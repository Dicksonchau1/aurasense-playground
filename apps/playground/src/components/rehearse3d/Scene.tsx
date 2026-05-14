"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window { THREE: any; }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.async = true; s.onload = () => resolve(); s.onerror = () => reject(new Error("load failed " + src));
    document.head.appendChild(s);
  });
}

export default function Scene({
  building,
  altitude,
  speed,
  running,
  paused,
}: {
  building: string;
  altitude: number;
  speed: number;
  running: boolean;
  paused: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>({ running, paused, t: 0 });

  // keep latest flags accessible inside the rAF loop
  useEffect(() => { stateRef.current.running = running; stateRef.current.paused = paused; }, [running, paused]);

  useEffect(() => {
    let disposed = false;
    let raf = 0;
    let renderer: any, scene: any, camera: any, controls: any, drone: any, pathLine: any, curve: any;

    (async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js");
      if (disposed) return;
      const THREE = window.THREE;
      const canvas = canvasRef.current!;
      const wrap = wrapRef.current!;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.9;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x030507);
      scene.fog = new THREE.FogExp2(0x030507, 0.0045);

      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
      camera.position.set(120, 90, 160);
      camera.lookAt(0, 40, 0);

      controls = new THREE.OrbitControls(camera, canvas);
      controls.target.set(0, 40, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.minDistance = 30;
      controls.maxDistance = 600;
      controls.maxPolarAngle = Math.PI / 2 - 0.1;

      const resize = () => {
        const w = wrap.clientWidth, h = wrap.clientHeight || 480;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      new ResizeObserver(resize).observe(wrap);
      resize();

      scene.add(new THREE.AmbientLight(0x0a1520, 2.5));
      const sun = new THREE.DirectionalLight(0xb0c8e8, 1.2);
      sun.position.set(80, 200, 60); sun.castShadow = true;
      scene.add(sun);
      scene.add(new THREE.GridHelper(300, 60, 0x0a1520, 0x0a1520));

      // Ground
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshLambertMaterial({ color: 0x0a0d10 }));
      ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

      // City context
      const cityMat = new THREE.MeshLambertMaterial({ color: 0x111822 });
      const blocks = [[-60,-70,18,26,14],[60,-65,20,28,16],[-70,40,16,22,20],[65,50,22,18,18],
                      [-50,80,14,30,12],[50,75,18,24,14],[-80,-20,12,20,24],[80,-10,16,26,16]];
      blocks.forEach(([x,z,w,d,h]) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), cityMat);
        m.position.set(x as number, (h as number)/2, z as number); m.castShadow = true; scene.add(m);
      });

      // Main building (ICC-style)
      const bGroup = new THREE.Group(); scene.add(bGroup);
      const matCore = new THREE.MeshPhongMaterial({ color: 0x0d1926, specular: 0x2a4a6a, shininess: 60 });
      const matGlass = new THREE.MeshPhongMaterial({ color: 0x0e2040, specular: 0x4488cc, shininess: 120, transparent: true, opacity: 0.75 });
      const matMetal = new THREE.MeshPhongMaterial({ color: 0x1a2533, specular: 0x335577, shininess: 80 });
      const podium = new THREE.Mesh(new THREE.BoxGeometry(40, 8, 35), new THREE.MeshLambertMaterial({ color: 0x0e1620 }));
      podium.position.set(0, 4, 0); podium.castShadow = true; bGroup.add(podium);
      const segs = [[8,26,22,30],[38,24,20,30],[68,22,18,30],[98,20,16,25],[123,18,14,20],[143,15,12,15],[158,12,10,10]];
      segs.forEach(([y,w,d,h]) => {
        const s = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), matCore);
        s.position.set(0, y + h/2, 0); s.castShadow = true; bGroup.add(s);
        const g = new THREE.Mesh(new THREE.BoxGeometry(w+0.3, h, d+0.3), matGlass);
        g.position.set(0, y + h/2, 0); bGroup.add(g);
      });
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 20, 8), matMetal);
      mast.position.set(0, 178, 0); bGroup.add(mast);

      // Drone
      drone = new THREE.Group(); scene.add(drone);
      const droneMat = new THREE.MeshPhongMaterial({ color: 0x1a2535, specular: 0x00d4c8, shininess: 100 });
      drone.add(new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 2.2), droneMat));
      const rotorMat = new THREE.MeshBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
      [-1.4, 1.4].forEach((x) => {
        [-1.4, 1.4].forEach((z) => {
          const arm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 0.2), droneMat);
          arm.position.set(x*0.5, 0, z*0.5); arm.rotation.y = Math.atan2(x, z); drone.add(arm);
          const rot = new THREE.Mesh(new THREE.CircleGeometry(0.9, 8), rotorMat);
          rot.position.set(x, 0.3, z); rot.rotation.x = -Math.PI/2; drone.add(rot);
        });
      });
      const droneLight = new THREE.PointLight(0x00d4c8, 0, 30); scene.add(droneLight);
      drone.visible = false;

      // Flight path
      function buildCurve(alt: number) {
        const pts: any[] = []; const r = 22;
        pts.push(new THREE.Vector3(0, 5, 60));
        const floors = [alt*0.3, alt*0.55, alt*0.75, alt*0.9];
        pts.push(new THREE.Vector3(0, floors[0], 60));
        floors.forEach((fh) => {
          [[r+5,fh,0],[r+5,fh,-r-5],[-r-5,fh,-r-5],[-r-5,fh,r+5],[r+5,fh,r+5],[r+5,fh,0]].forEach(([x,y,z]) =>
            pts.push(new THREE.Vector3(x as number, y as number, z as number)));
        });
        pts.push(new THREE.Vector3(0, alt+12, -20));
        pts.push(new THREE.Vector3(0, alt+12, 20));
        pts.push(new THREE.Vector3(0, alt+12, 0));
        pts.push(new THREE.Vector3(0, floors[0], 60));
        pts.push(new THREE.Vector3(0, 5, 60));
        return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
      }
      curve = buildCurve(altitude);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(200));
      pathLine = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x00d4c8, transparent: true, opacity: 0.35 }));
      scene.add(pathLine);

      let last = 0;
      const loop = (t: number) => {
        const dt = Math.min((t - last) / 1000, 0.05); last = t;
        controls.update();
        if (stateRef.current.running && !stateRef.current.paused) {
          stateRef.current.t = Math.min(1, stateRef.current.t + 0.0012 * (speed / 4));
          const p = curve.getPointAt(stateRef.current.t);
          const a = curve.getPointAt(Math.min(1, stateRef.current.t + 0.005));
          drone.visible = true;
          drone.position.copy(p);
          drone.position.y += Math.sin(t * 0.004) * 0.15;
          drone.lookAt(a);
          droneLight.position.copy(drone.position);
          droneLight.intensity = 1.5 + Math.sin(t * 0.006) * 0.5;
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })().catch((e) => console.error(e));

    return () => { disposed = true; if (raf) cancelAnimationFrame(raf); };
  }, [building, speed, altitude]);

  return (
    <div ref={wrapRef} className="aura-viewport-dark w-full" style={{ height: 520 }}>
      anvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}

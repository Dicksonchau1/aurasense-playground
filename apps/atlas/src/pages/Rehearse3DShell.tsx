// ATLAS Rehearse3DShell: new first-class view for Rehearse 3D mission simulator
import React, { useEffect, useRef } from "react";
import { loadThreeJS } from "./threejs-lazy";
import OverlayLayers from "./OverlayLayers";

export default function Rehearse3DShell() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let renderer: any, scene: any, camera: any, animationId: number;
    let cleanup = () => {};
    loadThreeJS().then(THREE => {
      if (!canvasRef.current) return;
      // Renderer
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
      renderer.setClearColor("#18181b");
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight, false);
      // Scene
      scene = new THREE.Scene();
      // Camera
      camera = new THREE.PerspectiveCamera(60, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
      camera.position.set(0, 8, 16);
      // Light
      const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 1.0);
      scene.add(hemi);
      const sun = new THREE.DirectionalLight(0xffffff, 0.7);
      sun.position.set(10, 20, 10);
      scene.add(sun);
      // Ground
      const groundGeo = new THREE.PlaneGeometry(32, 32);
      const groundMat = new THREE.MeshStandardMaterial({ color: 0x23232a });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0;
      scene.add(ground);

      // --- Terrain mesh (heightmap placeholder) ---
      const terrainGeo = new THREE.PlaneGeometry(24, 24, 32, 32);
      // Simple heightmap: sine wave for demo
      for (let i = 0; i < terrainGeo.attributes.position.count; i++) {
        const x = terrainGeo.attributes.position.getX(i);
        const y = terrainGeo.attributes.position.getY(i);
        const z = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 1.2;
        terrainGeo.attributes.position.setZ(i, z);
      }
      terrainGeo.computeVertexNormals();
      const terrainMat = new THREE.MeshStandardMaterial({ color: 0x2a3a3a, flatShading: true, wireframe: false, opacity: 0.95, transparent: true });
      const terrain = new THREE.Mesh(terrainGeo, terrainMat);
      terrain.rotation.x = -Math.PI / 2;
      terrain.position.y = 0.1;
      scene.add(terrain);

      // --- Waypoint markers (cyan spheres) ---
      const waypoints = [
        [-8, 0.5, -8],
        [-4, 0.5, 0],
        [0, 0.5, 4],
        [4, 0.5, 0],
        [8, 0.5, -8],
      ];
      waypoints.forEach(([x, y, z], idx) => {
        const markerGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const markerMat = new THREE.MeshStandardMaterial({ color: 0x00eaff });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.set(x, y, z);
        scene.add(marker);
        // Numbered sprite placeholder (future: add text sprite)
      });

      // --- Mission path (CatmullRom curve, cyan tube) ---
      const curve = new THREE.CatmullRomCurve3(waypoints.map(([x, y, z]) => new THREE.Vector3(x, 0.6, z)));
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.12, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color: 0x00eaff });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // --- Drone model (simple placeholder: box + cylinder for rotors) ---
      const droneGroup = new THREE.Group();
      const bodyGeo = new THREE.BoxGeometry(0.8, 0.2, 0.8);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      droneGroup.add(body);
      // Rotors
      for (let i = 0; i < 4; i++) {
        const rotorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16);
        const rotorMat = new THREE.MeshStandardMaterial({ color: 0x00eaff });
        const rotor = new THREE.Mesh(rotorGeo, rotorMat);
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        rotor.position.set(Math.cos(angle) * 0.45, 0.15, Math.sin(angle) * 0.45);
        rotor.rotation.x = Math.PI / 2;
        droneGroup.add(rotor);
      }
      droneGroup.position.set(0, 1.2, 4);
      scene.add(droneGroup);


      // --- Geofence prism (extruded polygon, cyan wireframe) ---
      const geofenceShape = new THREE.Shape([
        new THREE.Vector2(-6, -6),
        new THREE.Vector2(-2, 6),
        new THREE.Vector2(6, 4),
        new THREE.Vector2(4, -4),
        new THREE.Vector2(-6, -6),
      ]);
      const geofenceExtrude = new THREE.ExtrudeGeometry(geofenceShape, { depth: 6, bevelEnabled: false });
      const geofenceMat = new THREE.MeshBasicMaterial({ color: 0x00eaff, wireframe: true, opacity: 0.7, transparent: true });
      const geofence = new THREE.Mesh(geofenceExtrude, geofenceMat);
      geofence.position.set(0, 0.05, 0);
      geofence.rotation.x = -Math.PI / 2;
      scene.add(geofence);

      // --- Sensor cone (semi-transparent cyan cone, FOV placeholder) ---
      const coneGeo = new THREE.ConeGeometry(1.2, 3, 32, 1, true, 0, Math.PI * 0.5);
      const coneMat = new THREE.MeshStandardMaterial({ color: 0x00eaff, opacity: 0.25, transparent: true });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(0, 1.2, 4.7);
      cone.rotation.x = Math.PI / 2;
      scene.add(cone);

      // --- Wind vector arrows (every 5m, scaled by wind speed) ---
      const windSpeed = 4.5; // m/s (placeholder)
      const windDir = Math.PI / 4; // 45 deg (placeholder)
      const arrowColor = 0x00eaff;
      for (let x = -10; x <= 10; x += 5) {
        for (let z = -10; z <= 10; z += 5) {
          const from = new THREE.Vector3(x, 0.2, z);
          const to = new THREE.Vector3(
            x + Math.cos(windDir) * windSpeed * 0.5,
            0.2,
            z + Math.sin(windDir) * windSpeed * 0.5
          );
          const dir = to.clone().sub(from).normalize();
          const length = from.distanceTo(to);
          const arrowHelper = new THREE.ArrowHelper(dir, from, length, arrowColor, 0.5, 0.25);
          scene.add(arrowHelper);
        }
      }

      // Animate
      function animate() {
        animationId = requestAnimationFrame(animate);
        // Animate drone rotors
        for (let i = 1; i < droneGroup.children.length; i++) {
          droneGroup.children[i].rotation.z += 0.3;
        }
        renderer.render(scene, camera);
      }
      animate();
      // Cleanup
      cleanup = () => {
        cancelAnimationFrame(animationId);
        renderer.dispose && renderer.dispose();
      };
    });
    return () => cleanup();
  }, []);

  return (
    <main className="atlas-shell p-8">
      <header className="view-header mb-6">
        <h1 className="text-2xl font-bold">Rehearse 3D</h1>
        <p className="text-zinc-500">Digital twin mission simulation · ArduPilot SITL parity</p>
        <div className="flex gap-2 mt-4">
          <button className="btn btn-ghost">Load Mission</button>
          <button className="btn btn-ghost">Import KML/GeoJSON</button>
          <button className="btn btn-amber">Reset Scene</button>
          <button className="btn btn-primary" disabled>Promote to Flight Session</button>
        </div>
      </header>
      {/* KPI Strip */}
      <section className="kpi-grid mb-6">
        <div className="kpi-card">Sim Status: <span className="text-cyan-500">READY</span></div>
        <div className="kpi-card">Sim Speed: 1.0×</div>
        <div className="kpi-card">Waypoints Covered: 0 / 12</div>
        <div className="kpi-card">Predicted Battery Use: <span className="text-green-500">28%</span></div>
      </section>
      {/* Main grid: 3D scene + sidebar placeholder */}
      <div className="grid-main-side" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        <div className="scene-3d-canvas bg-zinc-900 rounded-lg min-h-[480px] flex items-center justify-center relative overflow-hidden">
          <canvas ref={canvasRef} width={640} height={480} style={{ width: '100%', height: 480, borderRadius: 12, display: 'block' }} />
          {/* Overlay layers rendered above canvas */}
          <OverlayLayers />
        </div>
        <aside className="sidebar-panels bg-zinc-800 rounded-lg p-4 min-h-[480px]">
          <span className="text-zinc-400">[Sidebar Panels Placeholder]</span>
        </aside>
      </div>
    </main>
  );
}

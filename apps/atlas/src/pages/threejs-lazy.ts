// threejs-lazy.ts: Utility to lazy-load three.js r161 from CDN
export async function loadThreeJS() {
  // Only load once
  if ((window as any).THREE) return (window as any).THREE;
  const mod = await import('https://unpkg.com/three@0.161.0/build/three.module.js');
  (window as any).THREE = mod;
  return mod;
}

const base = process.env.NEXT_PUBLIC_REHEARSE_API ?? "";

export const sweepApi = {
  list:     ()                => fetch(`${base}/api/sweeps`).then(r => r.json()),
  create:   (body: any)       => fetch(`${base}/api/sweeps`, { method:"POST", body: JSON.stringify(body), headers:{"Content-Type":"application/json"} }).then(r=>r.json()),
  get:      (id: string)      => fetch(`${base}/api/sweeps/${id}`).then(r => r.json()),
  cancel:   (id: string)      => fetch(`${base}/api/sweeps/${id}/cancel`, { method:"POST" }),
  promote:  (id: string)      => fetch(`${base}/api/sweeps/${id}/promote`, { method:"POST" }),
  report:   (id: string)      => `${base}/api/sweeps/${id}/report.html`,
};

export const physicsApi = {
  perlinTile:    (bbox: number[]) => `${base}/api/physics/perlin?bbox=${bbox.join(",")}`,
  windseerTile:  (bbox: number[]) => `${base}/api/physics/windseer/tile?bbox=${bbox.join(",")}`,
  windseerStreams:(bbox: number[]) => `${base}/api/physics/windseer/streamlines?bbox=${bbox.join(",")}`,
  windseerStatus:()               => fetch(`${base}/api/physics/windseer/status`).then(r=>r.json()),
};

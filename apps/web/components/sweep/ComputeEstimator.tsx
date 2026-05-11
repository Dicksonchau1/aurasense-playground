import { Card, Row } from "@/components/ui/Card";

export function ComputeEstimator({ cells, episodeSeconds, realtimeFactor }: any) {
  const gpuMin = (cells * episodeSeconds) / (60 * realtimeFactor);
  const wallA100 = gpuMin / 60;
  const wall8L4 = gpuMin / 8 / 60;
  const cost = gpuMin / 60 * 0.65; // g6.xlarge spot
  return (
    <Card title="Compute estimate">
      <Row k="Cells" v={cells.toLocaleString()}/>
      <Row k="GPU-min" v={Math.round(gpuMin).toLocaleString()}/>
      <Row k="Wall · 1× A100" v={`${wallA100.toFixed(1)} h`}/>
      <Row k="Wall · 8× L4"   v={`${(wall8L4*60).toFixed(0)} min`}/>
      <Row k="Cost (spot)"    v={`$${cost.toFixed(2)}`}/>
    </Card>
  );
}

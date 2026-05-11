import { Card, Field } from "@/components/ui/Card";
import { Slider, Switch } from "@/components/ui/inputs";

export function WindSeerControls() {
  return (
    <>
      <Card title="WindSeer · Kowloon">
        <Field k="Model"          v="windseer_kln_v0.3.onnx"/>
        <Field k="Topography"     v="HK Lands DSM 1m · Kowloon tile pack"/>
        <Field k="Boundary src"   v="HKO · King's Park + Waglan"/>
        <Field k="Validation"     v="0.86 m/s RMSE vs anemometry (n=12 flights)"/>
        <Field k="Inference"      v="42 ms · Jetson Orin NX"/>
      </Card>
      <Card title="Live forecast">
        <Slider label="Forecast time +" min={0} max={24} unit="h"/>
        <Slider label="Altitude AGL"    min={5} max={150} unit="m"/>
        <Switch label="Use live HKO feed"/>
        <Switch label="Auto-reschedule if gust > gate"/>
      </Card>
      <Card title="Tile coverage">
        <div>KowloonTileMap placeholder</div>
      </Card>
    </>
  );
}

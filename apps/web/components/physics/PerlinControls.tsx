import { Card } from "@/components/ui/Card";
import { Slider, Select, Switch } from "@/components/ui/inputs";

export function PerlinControls() {
  return (
    <Card title="Perlin wind">
      <Slider label="Avg speed" min={0} max={20} unit="m/s" />
      <Slider label="Direction" min={0} max={359} unit="°" />
      <Select label="Intensity" options={["low","med","high"]}/>
      <Slider label="Gust factor" min={1} max={2.5} step={0.1} unit="×"/>
      <Slider label="Shear layer altitude" min={0} max={100} unit="m"/>
      <Switch label="Per-face surface drag"/>
    </Card>
  );
}

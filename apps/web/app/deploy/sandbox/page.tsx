import { EnvironmentSandbox } from "@/components/sandbox/EnvironmentSandbox";
import { DigitalTwinViewport } from "@/components/sandbox/DigitalTwinViewport";
import { AeroSensorReadout } from "@/components/sandbox/AeroSensorReadout";
import { RehearsePanel } from "@/components/rehearse/RehearsePanel";

export default function Page() {
  return (
    <div className="grid grid-cols-12 gap-5 p-6">
      <div className="col-span-4 space-y-5">
        <EnvironmentSandbox />
      </div>
      <div className="col-span-8 space-y-5">
        <DigitalTwinViewport />
        <AeroSensorReadout />
        <RehearsePanel />
      </div>
    </div>
  );
}

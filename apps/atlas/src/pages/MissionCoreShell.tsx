// ATLAS MissionCoreShell: integrates FailsafeSection and MissionCommandsSection
import React from "react";
import {
  FailsafeSection,
  MissionCommandsSection,
  PolicyReceiptSection,
  VehicleLinkSection,
  MissionFenceSection
} from "../../../components/atlas/sections";
import {
  useArduPilotPolicyReceipts,
  useArduPilotVehicleLink,
  useArduPilotMissionFence
} from "../../../lib/atlas/hooks-ardupilot";
import {
  getPolicyReceiptPanelVM,
  getVehicleLinkPanelVM,
  getMissionFencePanelVM
} from "../../../lib/atlas/view-models-ardupilot";

  const policyReceipts = useArduPilotPolicyReceipts();
  const vehicleLink = useArduPilotVehicleLink();
  const missionFence = useArduPilotMissionFence();

  const policyVm = getPolicyReceiptPanelVM(
    policyReceipts.state,
    policyReceipts.selectedReceipt
  );
  const vehicleLinkVm = getVehicleLinkPanelVM(vehicleLink.state);
  const missionFenceVm = getMissionFencePanelVM(missionFence.state);

  return (
    <main className="atlas-shell p-8">
      <h1 className="text-2xl font-bold mb-4">ATLAS Mission Core</h1>
      <PolicyReceiptSection
        vm={policyVm}
        onSelectReceipt={policyReceipts.selectReceipt}
      />
      <VehicleLinkSection
        vm={vehicleLinkVm}
        onPromotePath={vehicleLink.promotePath}
      />
      <MissionFenceSection
        vm={missionFenceVm}
        onSetAutoResponse={missionFence.setAutoResponse}
      />
      <FailsafeSection />
      <MissionCommandsSection />
    </main>
  );
}

// ATLAS FlightStackShell: integrates FailsafeSection and MissionCommandsSection
import React from "react";
import {
  FailsafeSection,
  MissionCommandsSection,
  PolicyReceiptSection,
  VehicleLinkSection,
  RecoveryActionsSection
} from "../../../components/atlas/sections";
import {
  useArduPilotPolicyReceipts,
  useArduPilotVehicleLink,
  useArduPilotRecoveryActions
} from "../../../lib/atlas/hooks-ardupilot";
import {
  getPolicyReceiptPanelVM,
  getVehicleLinkPanelVM,
  getRecoveryActionsPanelVM
} from "../../../lib/atlas/view-models-ardupilot";

  const policyReceipts = useArduPilotPolicyReceipts();
  const vehicleLink = useArduPilotVehicleLink();
  const recovery = useArduPilotRecoveryActions();

  const policyVm = getPolicyReceiptPanelVM(
    policyReceipts.state,
    policyReceipts.selectedReceipt
  );
  const vehicleLinkVm = getVehicleLinkPanelVM(vehicleLink.state);
  const recoveryVm = getRecoveryActionsPanelVM(recovery.state);

  return (
    <main className="atlas-shell p-8">
      <h1 className="text-2xl font-bold mb-4">ATLAS Flight Stack</h1>
      <PolicyReceiptSection
        vm={policyVm}
        onSelectReceipt={policyReceipts.selectReceipt}
      />
      <VehicleLinkSection
        vm={vehicleLinkVm}
        onPromotePath={vehicleLink.promotePath}
      />
      <RecoveryActionsSection
        vm={recoveryVm}
        onIssueAction={recovery.issueRecoveryAction}
      />
      <FailsafeSection />
      <MissionCommandsSection />
    </main>
  );
}

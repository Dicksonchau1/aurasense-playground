import React from "react";
import {
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
import {
  AtlasPageHeader,
  SectionCard,
  LoadingSkeleton,
  ErrorBanner,
  ActionButtonBar
} from "../../../lib/atlas/components";
import { getAtlasPageHeaderVM } from "../../../lib/atlas/view-models";

export default function MissionCoreShell() {
  // Real operational state hooks
  const policyReceipts = useArduPilotPolicyReceipts();
  const vehicleLink = useArduPilotVehicleLink();
  const missionFence = useArduPilotMissionFence();

  // View-models for each section
  const policyVm = getPolicyReceiptPanelVM(
    policyReceipts.state,
    policyReceipts.selectedReceipt
  );
  const vehicleLinkVm = getVehicleLinkPanelVM(vehicleLink.state);
  const missionFenceVm = getMissionFencePanelVM(missionFence.state);

  // Compose a page header from mission state (replace with real mission/validation if available)
  const header = getAtlasPageHeaderVM({
    mission: policyReceipts.state?.mission,
    validation: null
  });

  // Loading/error state
  const loading =
    policyReceipts.loading || vehicleLink.loading || missionFence.loading;
  const error =
    policyReceipts.error || vehicleLink.error || missionFence.error;

  return (
    <main className="atlas-shell p-8">
      <AtlasPageHeader {...header} />

      {error && <ErrorBanner message={error} />}
      {loading ? (
        <LoadingSkeleton lines={6} />
      ) : (
        <>
          <SectionCard title="Mission Policy Receipts">
            <PolicyReceiptSection
              vm={policyVm}
              onSelectReceipt={policyReceipts.selectReceipt}
            />
          </SectionCard>
          <SectionCard title="Vehicle Link">
            <VehicleLinkSection
              vm={vehicleLinkVm}
              onPromotePath={vehicleLink.promotePath}
            />
          </SectionCard>
          <SectionCard title="Mission Fence">
            <MissionFenceSection
              vm={missionFenceVm}
              onSetAutoResponse={missionFence.setAutoResponse}
            />
          </SectionCard>
          <ActionButtonBar>
            <button className="btn btn-primary">Arm Mission</button>
            <button className="btn btn-secondary">Abort</button>
          </ActionButtonBar>
        </>
      )}
    </main>
  );
}

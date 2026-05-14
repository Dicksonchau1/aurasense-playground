"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  FlightSession,
  Mission,
  MissionSaveResponse,
  MissionValidationResult,
  OperatorCommand,
  OperatorCommandAck,
  RehearsalVerdict,
  RehearseLaunchResponse,
  ReplayAuditBundle,
  ScenarioRuntime
} from "./contracts";
import {
  finalizeRehearsal,
  getDemoMission,
  isAtlasDemoMode,
  issueFlightCommand,
  launchFlight,
  launchRehearsal,
  loadReplayAuditBundle,
  runMissionValidation,
  saveMission
} from "./demo";

type AsyncStatus = "idle" | "loading" | "success" | "error";

type HookState<T> = {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error";
}

function useAsyncState<T>(initialData: T | null = null) {
  const [state, setState] = useState<HookState<T>>({
    status: initialData ? "success" : "idle",
    data: initialData,
    error: null
  });

  const setLoading = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: "loading",
      error: null
    }));
  }, []);

  const setSuccess = useCallback((data: T) => {
    setState({
      status: "success",
      data,
      error: null
    });
  }, []);

  const setError = useCallback((error: unknown) => {
    setState((prev) => ({
      ...prev,
      status: "error",
      error: getErrorMessage(error)
    }));
  }, []);

  return {
    state,
    setLoading,
    setSuccess,
    setError,
    setState
  };
}

export function useAtlasMission(options?: {
  autoLoad?: boolean;
  initialMission?: Mission | null;
}) {
  const autoLoad = options?.autoLoad ?? true;
  const missionState = useAsyncState<Mission>(options?.initialMission ?? null);
  const validationState = useAsyncState<MissionValidationResult>(null);
  const saveState = useAsyncState<MissionSaveResponse>(null);
  const rehearseLaunchState = useAsyncState<RehearseLaunchResponse>(null);

  const loadMission = useCallback(async () => {
    missionState.setLoading();
    try {
      const mission = await getDemoMission();
      missionState.setSuccess(mission);
      return mission;
    } catch (error) {
      missionState.setError(error);
      throw error;
    }
  }, [missionState]);

  const createOrUpdateMission = useCallback(
    async (mission: Mission) => {
      saveState.setLoading();
      try {
        const result = await saveMission(mission);
        saveState.setSuccess(result);
        missionState.setSuccess(result.mission);
        return result;
      } catch (error) {
        saveState.setError(error);
        throw error;
      }
    },
    [missionState, saveState]
  );

  const validate = useCallback(
    async (input: {
      mission_id: string;
      vehicle_id: string;
      ruleset: "atlas-default" | "hkcad" | "org-custom";
    }) => {
      validationState.setLoading();
      try {
        const result = await runMissionValidation(input);
        validationState.setSuccess(result);
        return result;
      } catch (error) {
        validationState.setError(error);
        throw error;
      }
    },
    [validationState]
  );

  const promoteToRehearsal = useCallback(
    async (input: {
      mission_id: string;
      scenario_id?: string;
      environment_override?: Record<string, unknown>;
    }) => {
      rehearseLaunchState.setLoading();
      try {
        const result = await launchRehearsal(input);
        rehearseLaunchState.setSuccess(result);
        return result;
      } catch (error) {
        rehearseLaunchState.setError(error);
        throw error;
      }
    },
    [rehearseLaunchState]
  );

  useEffect(() => {
    if (!autoLoad || options?.initialMission) return;
    loadMission().catch(() => {});
  }, [autoLoad, loadMission, options?.initialMission]);

  return {
    demoMode: isAtlasDemoMode(),
    mission: missionState.state.data,
    missionStatus: missionState.state.status,
    missionError: missionState.state.error,
    validation: validationState.state.data,
    validationStatus: validationState.state.status,
    validationError: validationState.state.error,
    saveResult: saveState.state.data,
    saveStatus: saveState.state.status,
    saveError: saveState.state.error,
    rehearseLaunch: rehearseLaunchState.state.data,
    rehearseLaunchStatus: rehearseLaunchState.state.status,
    rehearseLaunchError: rehearseLaunchState.state.error,
    loadMission,
    createOrUpdateMission,
    validate,
    promoteToRehearsal
  };
}

export function useAtlasRehearsal(options?: {
  autoFinalize?: boolean;
  sessionId?: string | null;
}) {
  const verdictState = useAsyncState<RehearsalVerdict>(null);
  const flightState = useAsyncState<FlightSession>(null);
  const commandState = useAsyncState<OperatorCommandAck>(null);

  const complete = useCallback(
    async (sessionId: string) => {
      verdictState.setLoading();
      try {
        const result = await finalizeRehearsal(sessionId);
        verdictState.setSuccess(result);
        return result;
      } catch (error) {
        verdictState.setError(error);
        throw error;
      }
    },
    [verdictState]
  );

  const startFlight = useCallback(
    async (input: {
      mission_id: string;
      vehicle_id: string;
      source_session_id?: string;
    }) => {
      flightState.setLoading();
      try {
        const result = await launchFlight(input);
        flightState.setSuccess(result);
        return result;
      } catch (error) {
        flightState.setError(error);
        throw error;
      }
    },
    [flightState]
  );

  const sendCommand = useCallback(
    async (sessionId: string, command: OperatorCommand) => {
      commandState.setLoading();
      try {
        const result = await issueFlightCommand(sessionId, command);
        commandState.setSuccess(result);
        return result;
      } catch (error) {
        commandState.setError(error);
        throw error;
      }
    },
    [commandState]
  );

  useEffect(() => {
    if (!options?.autoFinalize || !options.sessionId) return;
    complete(options.sessionId).catch(() => {});
  }, [complete, options?.autoFinalize, options?.sessionId]);

  return {
    demoMode: isAtlasDemoMode(),
    verdict: verdictState.state.data,
    verdictStatus: verdictState.state.status,
    verdictError: verdictState.state.error,
    flightSession: flightState.state.data,
    flightStatus: flightState.state.status,
    flightError: flightState.state.error,
    commandAck: commandState.state.data,
    commandStatus: commandState.state.status,
    commandError: commandState.state.error,
    complete,
    startFlight,
    sendCommand
  };
}

export function useAtlasAudit(sessionId?: string | null) {
  const auditState = useAsyncState<ReplayAuditBundle>(null);

  const loadAudit = useCallback(
    async (value?: string | null) => {
      const targetSessionId = value ?? sessionId;
      if (!targetSessionId) {
        throw new Error("sessionId is required to load replay audit bundle");
      }

      auditState.setLoading();
      try {
        const result = await loadReplayAuditBundle(targetSessionId);
        auditState.setSuccess(result);
        return result;
      } catch (error) {
        auditState.setError(error);
        throw error;
      }
    },
    [auditState, sessionId]
  );

  useEffect(() => {
    if (!sessionId) return;
    loadAudit(sessionId).catch(() => {});
  }, [loadAudit, sessionId]);

  const summary = useMemo(() => {
    const bundle = auditState.state.data;
    if (!bundle) return null;

    return {
      eventCount: bundle.events.length,
      traceCount: bundle.traces.length,
      artifactCount: bundle.artifacts.length,
      telemetrySamples: bundle.telemetry_index.samples,
      missionTitle: bundle.mission.title,
      sessionId:
        "session_id" in bundle.session ? bundle.session.session_id : null
    };
  }, [auditState.state.data]);

  return {
    demoMode: isAtlasDemoMode(),
    auditBundle: auditState.state.data,
    auditStatus: auditState.state.status,
    auditError: auditState.state.error,
    auditSummary: summary,
    loadAudit
  };
}

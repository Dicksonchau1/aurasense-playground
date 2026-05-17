// Telemetry feature wiring: connects UI to API and WebSocket using strict contracts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api-client';
import { AtlasFlightSocket } from '../../services/ws/atlas-flight-socket';
import { TelemetryFrame, TelemetryFrameSchema } from '../../contracts/telemetry-frame';
import { AtlasEvent } from '../../contracts/atlas-event';
import { RootState } from '../../app/store';
import { setTelemetryFrame, setTelemetryError, setTelemetryStale } from '../../domain/telemetry/telemetrySlice';

export function useTelemetry(sessionId: string) {
  const dispatch = useDispatch();
  const telemetry = useSelector((state: RootState) => state.telemetry.data);
  const error = useSelector((state: RootState) => state.telemetry.error);
  const isStale = useSelector((state: RootState) => state.telemetry.isStale);

  useEffect(() => {
    let socket: AtlasFlightSocket | null = null;
    let staleTimeout: any;
    // Fetch latest telemetry frame from API
    api.get(`/telemetry/latest/${sessionId}`)
      .then(res => {
        const frame: TelemetryFrame = TelemetryFrameSchema.parse(res.data);
        dispatch(setTelemetryFrame(frame));
      })
      .catch(e => {
        dispatch(setTelemetryError('Failed to load telemetry'));
      });
    // Connect to WebSocket for real-time telemetry
    socket = new AtlasFlightSocket(sessionId, (event: AtlasEvent) => {
      if (event.type === 'TELEMETRY_FRAME') {
        try {
          const frame: TelemetryFrame = TelemetryFrameSchema.parse(event.payload);
          dispatch(setTelemetryFrame(frame));
          if (staleTimeout) clearTimeout(staleTimeout);
          staleTimeout = setTimeout(() => dispatch(setTelemetryStale(true)), 5000); // 5s freshness window
        } catch {}
      }
    });
    return () => {
      socket?.close();
      if (staleTimeout) clearTimeout(staleTimeout);
    };
  }, [sessionId, dispatch]);

  return { telemetry, error, isStale };
}

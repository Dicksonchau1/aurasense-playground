// Flight Stack feature wiring: connects UI to API and WebSocket using strict contracts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api-client';
import { AtlasFlightSocket } from '../../services/ws/atlas-flight-socket';
import { FlightSession, FlightSessionSchema } from '../../contracts/flight-session';
import { AtlasEvent } from '../../contracts/atlas-event';
import { RootState } from '../../app/store';
import { setFlightSession, setFlightStatus, setFlightError } from '../../domain/flight/flightSlice';

export function useFlightStack(sessionId: string) {
  const dispatch = useDispatch();
  const flightSession = useSelector((state: RootState) => state.flight.data);
  const error = useSelector((state: RootState) => state.flight.error);

  useEffect(() => {
    let socket: AtlasFlightSocket | null = null;
    api.get(`/flight-sessions/${sessionId}`)
      .then(res => {
        const session: FlightSession = FlightSessionSchema.parse(res.data);
        dispatch(setFlightSession(session));
      })
      .catch(e => {
        dispatch(setFlightError('Failed to load flight session'));
      });
    socket = new AtlasFlightSocket(sessionId, (event: AtlasEvent) => {
      if (event.type === 'FLIGHT_STATUS_UPDATE') {
        dispatch(setFlightStatus(event.payload.status));
      }
      // Add more event handling as needed
    });
    return () => {
      socket?.close();
    };
  }, [sessionId, dispatch]);

  return { flightSession, error };
}

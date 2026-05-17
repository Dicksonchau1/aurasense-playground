// Mission Core feature wiring: connects UI to API and WebSocket using strict contracts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api-client';
import { AtlasFlightSocket } from '../../services/ws/atlas-flight-socket';
import { Mission, MissionSchema } from '../../contracts/mission';
import { AtlasEvent } from '../../contracts/atlas-event';
import { RootState } from '../../app/store';
import { setMission, setMissionStatus, setMissionError } from '../../domain/mission/missionSlice';

// Example hook for Mission Core operational wiring
export function useMissionCore(sessionId: string) {
  const dispatch = useDispatch();
  const mission = useSelector((state: RootState) => state.mission.data);
  const error = useSelector((state: RootState) => state.mission.error);

  useEffect(() => {
    let socket: AtlasFlightSocket | null = null;
    // Fetch mission data from API
    api.get(`/missions/${sessionId}`)
      .then(res => {
        const mission: Mission = MissionSchema.parse(res.data);
        dispatch(setMission(mission));
      })
      .catch(e => {
        dispatch(setMissionError('Failed to load mission'));
      });
    // Connect to WebSocket for real-time mission events
    socket = new AtlasFlightSocket(sessionId, (event: AtlasEvent) => {
      // Handle mission-related events, e.g. status updates
      if (event.type === 'MISSION_STATUS_UPDATE') {
        dispatch(setMissionStatus(event.payload.status));
      }
      // Add more event handling as needed
    });
    return () => {
      socket?.close();
    };
  }, [sessionId, dispatch]);

  return { mission, error };
}

// UI components can use this hook to bind to real mission state and events

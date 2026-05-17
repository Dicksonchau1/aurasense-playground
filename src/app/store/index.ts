// Centralized store setup for ATLAS operational state
import { configureStore } from '@reduxjs/toolkit';
import missionReducer from '../../domain/mission/missionSlice';
import flightReducer from '../../domain/flight/flightSlice';
import telemetryReducer from '../../domain/telemetry/telemetrySlice';
import auditReducer from '../../domain/audit/auditSlice';
// ...import other slices as needed

export const store = configureStore({
  reducer: {
    mission: missionReducer,
    flight: flightReducer,
    telemetry: telemetryReducer,
    audit: auditReducer,
    // ...add other slices
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

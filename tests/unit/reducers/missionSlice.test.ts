// Example reducer test for missionSlice
import missionReducer, { setMission, setMissionStatus, setMissionError } from '../../../src/domain/mission/missionSlice';

describe('missionSlice reducer', () => {
  it('sets mission data', () => {
    const initialState = { data: null, status: null, error: null };
    const mission = { id: 'm1', name: 'Test', createdAt: '', updatedAt: '', status: 'PLANNED', policyReceiptId: 'pr1' };
    const state = missionReducer(initialState, setMission(mission));
    expect(state.data).toEqual(mission);
  });

  it('sets mission status', () => {
    const initialState = { data: null, status: null, error: null };
    const state = missionReducer(initialState, setMissionStatus('ACTIVE'));
    expect(state.status).toBe('ACTIVE');
  });

  it('sets mission error', () => {
    const initialState = { data: null, status: null, error: null };
    const state = missionReducer(initialState, setMissionError('err'));
    expect(state.error).toBe('err');
  });
});

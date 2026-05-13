// Simple local/sessionStorage persistence for nurse rehearse session state
export function saveNurseRehearseSession(session: any) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem("nurseRehearseSession", JSON.stringify(session));
  }
}

export function loadNurseRehearseSession() {
  if (typeof window !== "undefined") {
    const raw = window.sessionStorage.getItem("nurseRehearseSession");
    if (raw) return JSON.parse(raw);
  }
  return null;
}

export function clearNurseRehearseSession() {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem("nurseRehearseSession");
  }
}

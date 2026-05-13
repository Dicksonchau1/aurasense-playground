export const demoScript = [
  {
    step: "Login as institutional user",
    qa: ["Verify login form appears", "Check user is redirected after login"]
  },
  {
    step: "Switch between Playground modes (Rehearse-Nurse, ATTAS, Robotics)",
    qa: ["Verify navigation works", "Check correct module UI loads"]
  },
  {
    step: "Show real-time vision inference and 3D overlays",
    qa: ["Verify MediaPipe output updates", "Check 3D map overlay renders"]
  },
  {
    step: "Trigger policy overlays and audit events",
    qa: ["Trigger overlay", "Check audit event emitted"]
  },
  {
    step: "Walk through demo script overlay",
    qa: ["Demo script overlay is visible", "Step navigation works"]
  },
  {
    step: "Validate audit chain and logs",
    qa: ["Merkle audit chain is visible", "Logs are populated"]
  }
];

export type DroneStatus = "registered" | "active" | "maintenance" | "retired";

export const DRONE_STATUS_LABEL: Record<DroneStatus, string> = {
  registered: "Registered",
  active: "Active",
  maintenance: "Maintenance",
  retired: "Retired",
};

export interface DroneCapabilities {
  rtsp_url?: string;
  firmware?: string;
  geofence_enabled?: boolean;
  thermal?: boolean;
  zoom_max?: number;
  notes?: string;
  [key: string]: unknown;
}

export interface Drone {
  id: string;
  owner_id: string;
  name: string;
  model: string;
  serial: string;
  status: DroneStatus;
  max_alt_m: number;
  max_speed_ms: number;
  battery_wh: number;
  capabilities: DroneCapabilities;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DroneInput {
  name: string;
  model: string;
  serial: string;
  status?: DroneStatus;
  max_alt_m?: number;
  max_speed_ms?: number;
  battery_wh?: number;
  capabilities?: DroneCapabilities;
}

export const DEFAULT_DRONE_INPUT: Required<Omit<DroneInput, "capabilities">> & { capabilities: DroneCapabilities } = {
  name: "",
  model: "",
  serial: "",
  status: "registered",
  max_alt_m: 120,
  max_speed_ms: 15,
  battery_wh: 100,
  capabilities: {
    rtsp_url: "",
    firmware: "",
    geofence_enabled: true,
    thermal: false,
    zoom_max: 1,
    notes: "",
  },
};

export function validateDroneInput(input: Partial<DroneInput>): string | null {
  if (!input.name || input.name.trim().length < 2) return "Name must be at least 2 characters";
  if (!input.model || input.model.trim().length < 2) return "Model is required";
  if (!input.serial || input.serial.trim().length < 3) return "Serial number is required (min 3 chars)";
  if (typeof input.max_alt_m === "number" && (input.max_alt_m <= 0 || input.max_alt_m > 500))
    return "Max altitude must be between 1 and 500 m";
  if (typeof input.max_speed_ms === "number" && (input.max_speed_ms <= 0 || input.max_speed_ms > 50))
    return "Max speed must be between 1 and 50 m/s";
  if (typeof input.battery_wh === "number" && input.battery_wh <= 0)
    return "Battery capacity must be positive";
  return null;
}

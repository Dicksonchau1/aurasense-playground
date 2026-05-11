export interface HriCoreConfig {
  nepaApiUrl: string;
  authTokenProvider?: () => Promise<string | null>;
}

let _config: HriCoreConfig = {
  nepaApiUrl: process.env.NEXT_PUBLIC_NEPA_API_URL ?? "http://localhost:8000",
};

export function configureHriCore(cfg: Partial<HriCoreConfig>) {
  _config = { ..._config, ...cfg };
}

export function getConfig(): HriCoreConfig {
  return _config;
}

import { configureHriCore } from "@aurasense/hri-core";
import { createClient } from "@/lib/supabase/client";

export function bootstrapHri() {
  configureHriCore({
    nepaApiUrl: "",   // same-origin → Next proxy /api/nepa/v1/hri/*
    authTokenProvider: async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    },
  });
}

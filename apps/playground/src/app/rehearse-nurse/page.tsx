"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import DynamicImport from "next/dynamic";
const NurseRehearseSession = DynamicImport(() => import("../../components/rehearseNurse/Session"), { ssr: false });
const NurseRehearseResult = DynamicImport(() => import("../../components/rehearseNurse/Result"), { ssr: false });

export default function Page() {
  return <NurseRehearseFlow />;
}
export const dynamic = "force-dynamic";

import NurseRehearseFlow from "./NurseRehearseFlow";

export default function Page() {
  return <NurseRehearseFlow />;
}

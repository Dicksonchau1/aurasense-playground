"use client";

export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const Rehearse3DImpl = dynamicImport(() => import("./_impl"), {
  ssr: false,
  loading: () => null,
});

export default function Page() {
  return <Rehearse3DImpl />;
}

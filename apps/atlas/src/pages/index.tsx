import React from "react";
import AtlasNav from "./AtlasNav";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <AtlasNav />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Atlas</h1>
        <p className="mt-2 text-zinc-500">Facade defect labeler (surface: "atlas") with overlays</p>
      </main>
    </div>
  );
}

"use client";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";
// import { VolumeLayer } from "@/components/physics/layers/VolumeLayer";
// import { StreamlineLayer } from "@/components/physics/layers/StreamlineLayer";

export function WindFieldViewport({ engine }: { engine: "perlin"|"windseer" }) {
  // const layers = engine === "windseer"
  //   ? [new VolumeLayer({ id:"vol", data:"/api/physics/windseer/tile" }),
  //      new StreamlineLayer({ id:"streams", data:"/api/physics/windseer/streamlines" })]
  //   : [new VolumeLayer({ id:"vol", data:"/api/physics/perlin" })];
  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-800 h-[640px]">
      <DeckGL initialViewState={{ longitude:114.173, latitude:22.32, zoom:14, pitch:55, bearing:30 }}
              controller /* layers={layers} */>
        <Map mapStyle="mapbox://styles/mapbox/dark-v11"
             mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}/>
      </DeckGL>
    </div>
  );
}

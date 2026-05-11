"use client";
import { useEffect, useState } from "react";
import { WorldModelSSEClient, EntropyEvent } from "@aurasense/world-model-client";

export function WhyAmIAskedSparkline() {
  const [entropy, setEntropy] = useState<EntropyEvent[]>([]);

  useEffect(() => {
    const client = new WorldModelSSEClient();
    client.connect("/api/world-model/entropy", (event) => {
      setEntropy((prev) => [...prev.slice(-49), event]);
    });
    return () => client.disconnect();
  }, []);

  return (
    <svg width={200} height={40}>
      {entropy.map((e, i) => (
        <circle
          key={i}
          cx={4 * i}
          cy={40 - e.value * 40}
          r={2}
          fill="#38bdf8"
        />
      ))}
    </svg>
  );
}

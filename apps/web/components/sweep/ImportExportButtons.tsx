import { yamlToGrid, gridToYaml } from "@/lib/sweep/yaml";
import { useRef } from "react";

export function ImportExportButtons({ grid, onImport }: { grid: any; onImport: (g: any) => void }) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const { grid: g, errors } = yamlToGrid(text);
      if (errors.length) {
        alert("YAML import error:\n" + errors.join("\n"));
      } else if (g) {
        onImport(g);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExport = () => {
    const yaml = gridToYaml(grid);
    const blob = new Blob([yaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "default.yaml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCLI = () => {
    const cmd = `aurasense sweep run --policy {policy} --scenario {scenario} --grid default.yaml --gate {gateProfile}`;
    navigator.clipboard.writeText(cmd);
    alert("CLI command copied to clipboard");
  };

  return (
    <div className="flex gap-2">
      <input type="file" accept=".yaml,.yml" ref={fileInput} style={{ display: "none" }} onChange={handleImport} />
      <button className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-200" onClick={() => fileInput.current?.click()}>Import YAML</button>
      <button className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-200" onClick={handleExport}>Export YAML</button>
      <button className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-200" onClick={handleCopyCLI}>Copy CLI</button>
    </div>
  );
}

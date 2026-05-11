"use client";
import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { OrthomosaicViewer } from "@/components/reports/OrthomosaicViewer";
import { PointCloudViewer } from "@/components/reports/PointCloudViewer";
import { ModelViewer } from "@/components/reports/ModelViewer";
import { CsvTable } from "@/components/reports/CsvTable";

export default function Page() {
  const [tab, setTab] = useState("ortho");
  return (
    <div className="p-6 space-y-5">
      <Tabs value={tab} onChange={setTab} items={[
        { v:"ortho", l:"Orthomosaic" }, { v:"pc", l:"Point Cloud" },
        { v:"3d", l:"3D Model" },       { v:"csv", l:"CSV" },
      ]}/>
      {tab==="ortho" && <OrthomosaicViewer/>}
      {tab==="pc"    && <PointCloudViewer/>}
      {tab==="3d"    && <ModelViewer/>}
      {tab==="csv"   && <CsvTable/>}
    </div>
  );
}

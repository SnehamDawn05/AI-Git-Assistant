"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AnalysisTypeSelector } from "./analysis-type-selector";

export function AnalysisForm() {
  const [type, setType] = useState("REVIEW");

  return (
    <form className="space-y-6">
      <AnalysisTypeSelector value={type} onValueChange={setType} />

      <Input placeholder="Repository URL" />

      {type === "REVIEW" && <Input placeholder="PR URL" />}

      <Button className="w-full" type="submit">
        Analyze
      </Button>
    </form>
  );
}

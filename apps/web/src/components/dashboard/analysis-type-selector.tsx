"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";

interface Props {
  value: string;
  onValueChange: (value: string) => void;
}

export function AnalysisTypeSelector({ value, onValueChange }: Props) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="REVIEW" id="review" />

        <Label htmlFor="review">PR Review</Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="SUMMARY" id="summary" />

        <Label htmlFor="summary">Code Summary</Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="README" id="readme" />

        <Label htmlFor="readme">README Generator</Label>
      </div>
    </RadioGroup>
  );
}

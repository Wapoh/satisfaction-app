"use client";

import { AgeGroup } from "@/components/AgeSelect";

const AGE_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: "-15", label: "-15 ans" },
  { value: "15-19", label: "15-19 ans" },
  { value: "20-24", label: "20-24 ans" },
  { value: "25-39", label: "25-39 ans" },
  { value: "40-59", label: "40-59 ans" },
  { value: "60+", label: "60 ans et +" },
];

export default function AgeTiles({
  value,
  onChange,
  required = false,
}: {
  value: AgeGroup | "";
  onChange: (value: AgeGroup) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-[#1f5f8b]">
        Quelle est votre tranche d&apos;âge ?
        {required && <span className="ml-1 text-[#3aa76d]">*</span>}
      </h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {AGE_OPTIONS.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                "rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150",
                "shadow-sm",
                isActive
                  ? "border-[#3aa76d] bg-[#e8f7ef] text-[#1f5f8b] ring-2 ring-[#3aa76d]/30"
                  : "border-[#b9d5e8] bg-[#f4fbff] text-[#1f5f8b] hover:border-[#63a7cf] hover:bg-[#eaf6fc]",
              ].join(" ")}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
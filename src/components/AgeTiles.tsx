"use client";
import { AgeGroup } from "@/components/AgeSelect";

type Option = { value: AgeGroup; label: string };

const OPTIONS: Option[] = [
  { value: "-15",   label: "-15 ans" },
  { value: "15-19", label: "15-19 ans" },
  { value: "20-24", label: "20-24 ans" },
  { value: "25-39", label: "25-39 ans" },
  { value: "40-59", label: "40-59 ans" },
  { value: "60+",   label: "60 ans et +" },
];

export default function AgeTiles({
  value,
  onChange,
  required = true,
  title = "Tranche d’âge",
}: {
  value?: AgeGroup;
  onChange?: (v: AgeGroup) => void;
  required?: boolean;
  title?: string;
}) {
  return (
    <div aria-labelledby="age-title">
      <div id="age-title" className="mb-3 text-lg md:text-xl font-semibold">
        {title} {required && <span className="text-red-500">*</span>}
      </div>

      {/* iPad: 3 colonnes, gros espacements */}
      <div
        role="group"
        aria-label="Choix de la tranche d’âge"
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
      >
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange?.(opt.value)}
              aria-pressed={selected}
              className={[
                "h-16 md:h-20 rounded-2xl border px-4 md:px-6",
                "flex items-center justify-center",
                "text-base md:text-xl font-medium",
                "transition focus:outline-none focus:ring-2 focus:ring-offset-2",
                selected
                  ? "bg-black text-white border-black"
                  : "bg-white hover:bg-gray-50 border-gray-300"
              ].join(" ")}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {required && !value && (
        <p className="mt-3 text-sm md:text-base text-gray-500">
          Touchez une vignette pour sélectionner votre tranche d’âge.
        </p>
      )}
    </div>
  );
}

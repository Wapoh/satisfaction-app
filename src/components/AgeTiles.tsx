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
      <div id="age-title" className="mb-2 font-medium">
        {title} {required && <span className="text-red-500">*</span>}
      </div>

      <div
        role="group"
        aria-label="Choix de la tranche d’âge"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
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
                "h-14 rounded-2xl border text-base sm:text-lg px-4 flex items-center justify-center",
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

      {/* aide visuelle si rien n'est choisi et que c'est requis */}
      {required && !value && (
        <p className="mt-2 text-sm text-gray-500">
          Touchez une vignette pour sélectionner votre tranche d’âge.
        </p>
      )}
    </div>
  );
}

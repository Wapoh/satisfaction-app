"use client";
type AgeGroup = "-15" | "15-19" | "20-24" | "25-39" | "40-59" | "60+";

export type { AgeGroup };

export default function AgeSelect({
  value,
  onChange,
  required = true,
}: {
  value?: AgeGroup;
  onChange?: (v: AgeGroup) => void;
  required?: boolean;
}) {
  const options: AgeGroup[] = ["-15", "15-19", "20-24", "25-39", "40-59", "60+"];

  return (
    <div>
      <label className="block mb-2">Tranche d’âge</label>
      <select
        className="w-full rounded-xl border p-3 bg-white"
        value={value ?? ""}
        required={required}
        onChange={(e) => onChange?.(e.target.value as AgeGroup)}
      >
        <option value="" disabled>Choisir…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

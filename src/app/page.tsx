"use client";

import Image from "next/image";
import { useState } from "react";
import { AgeGroup } from "@/components/AgeSelect";
import AgeTiles from "@/components/AgeTiles";
import SatisfactionApp, {
  DiscoverySource,
  ExpectationAnswer,
} from "@/components/SatisfactionApp";

type Feedback = {
  source: DiscoverySource;
  expectation: ExpectationAnswer;
  age: AgeGroup;
  createdAt: string;
};

export default function Home() {
  const STORAGE_KEY = "satisfaction-feedbacks";

  const [age, setAge] = useState<AgeGroup | "">("");
  const [err, setErr] = useState<string | null>(null);
  const [adminTrigger, setAdminTrigger] = useState(0);

  function saveFeedback(feedback: Feedback) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: Feedback[] = raw ? JSON.parse(raw) : [];
      const updated = [feedback, ...existing];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Erreur sauvegarde :", error);
    }
  }

  function handleSubmit(
    source: DiscoverySource,
    expectation: ExpectationAnswer
  ) {
    if (!age) {
      setErr("Choisissez votre tranche d’âge.");
      return;
    }

    setErr(null);

    saveFeedback({
      source,
      expectation,
      age,
      createdAt: new Date().toISOString(),
    });
  }

  function handleResetAll() {
    setAge("");
    setErr(null);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  function handleLogoClick() {
    setAdminTrigger((prev) => prev + 1);
  }

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8 space-y-10">

        {/* Logo */}

        <div className="flex justify-center">
          <button onClick={handleLogoClick}>
            <Image
              src="/640px-TernoisCom_logo_2017.png"
              alt="Logo TernoisCom"
              width={420}
              height={160}
              priority
            />
          </button>
        </div>

        {/* Bloc affiche + tranche âge */}

        <section className="mx-auto max-w-6xl flex gap-8">

          {/* Encadré affiche */}

          <div className="w-64 bg-white border rounded-2xl shadow-sm p-4 flex justify-center">
            <Image
              src="/evenement-culturel.png"
              alt="Affiche évènement culturel"
              width={240}
              height={360}
              className="rounded-xl"
            />
          </div>

          {/* Encadré tranche âge */}

          <div className="flex-1 bg-white border rounded-2xl shadow-sm p-6">

            <AgeTiles
              value={age as AgeGroup}
              onChange={setAge}
              required
            />

            {err && (
              <p className="mt-3 text-red-600">
                {err}
              </p>
            )}

          </div>

        </section>

        {/* Questionnaire */}

        <SatisfactionApp
          onSubmit={handleSubmit}
          onResetAll={handleResetAll}
          adminTrigger={adminTrigger}
        />

      </div>

    </main>
  );
}
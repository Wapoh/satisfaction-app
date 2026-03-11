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
      const existing = raw ? JSON.parse(raw) : [];
      const updated = [feedback, ...existing];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  }

  function handleSubmit(
    source: DiscoverySource,
    expectation: ExpectationAnswer
  ) {
    if (!age) {
      setErr("Choisis une tranche d’âge avant de répondre.");
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
    } catch {
      // rien
    }
  }

  function handleLogoTripleClick() {
    setAdminTrigger((prev) => prev + 1);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleLogoTripleClick}
            className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
            aria-label="Logo TernoisCom - accès admin"
          >
            <Image
              src="/640px-TernoisCom_logo_2017.png"
              alt="Logo TernoisCom"
              width={500}
              height={200}
              priority
            />
          </button>
        </div>

        <section className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
          <AgeTiles value={age as AgeGroup} onChange={setAge} required />

          {err && <p className="mt-3 text-center text-red-600">{err}</p>}
        </section>

        <SatisfactionApp
          onSubmit={handleSubmit}
          onResetAll={handleResetAll}
          adminTrigger={adminTrigger}
        />
      </div>
    </main>
  );
}
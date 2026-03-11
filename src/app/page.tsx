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

  function saveFeedback(feedback: Feedback) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : [];

      const updated = [feedback, ...existing];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Erreur sauvegarde", e);
    }
  }

  function handleSubmit(source: DiscoverySource, expectation: ExpectationAnswer) {
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
    } catch {}
  }

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8 space-y-8">

        <div className="flex justify-center">
          <Image
            src="/640px-TernoisCom_logo_2017.png"
            alt="Logo TernoisCom"
            width={500}
            height={200}
            priority
          />
        </div>

        <section className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
          <AgeTiles
            value={age as AgeGroup}
            onChange={setAge}
            required
          />

          {err && (
            <p className="mt-3 text-red-600 text-center">
              {err}
            </p>
          )}
        </section>

        <h2 className="text-center text-2xl font-semibold text-gray-800 mt-10">
          Qu&apos;avez-vous pensé de cet événement culturel ?
        </h2>

        <SatisfactionApp
          onSubmit={handleSubmit}
          onResetAll={handleResetAll}
        />

      </div>
    </main>
  );
}
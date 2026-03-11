"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AgeGroup } from "@/components/AgeSelect";
import AgeTiles from "@/components/AgeTiles";
import SatisfactionApp from "@/components/SatisfactionApp";

type Feedback = {
  rating: number;
  age: AgeGroup;
  createdAt: string;
};

export default function Home() {
  const STORAGE_KEY = "satisfaction-feedbacks";

  const [age, setAge] = useState<AgeGroup | "">("");
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<Feedback[]>([]);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;

      setData(raw ? (JSON.parse(raw) as Feedback[]) : []);
    } catch {
      setData([]);
    }
  }, []);

  const mapVoteToRating: Record<
    "excellent" | "bien" | "moyen" | "insuffisant",
    number
  > = {
    excellent: 5,
    bien: 4,
    moyen: 3,
    insuffisant: 2,
  };

  function save(feedback: Feedback) {
    const next = [feedback, ...data];
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleVote(type: "excellent" | "bien" | "moyen" | "insuffisant") {
    if (!age) {
      setErr("Choisis une tranche d’âge avant de voter.");
      return;
    }

    setErr(null);

    save({
      rating: mapVoteToRating[type],
      age: age as AgeGroup,
      createdAt: new Date().toISOString(),
    });
  }

  function handleResetAll() {
    setAge("");
    setErr(null);
    setData([]);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-center">
          <Image
            src="/640px-TernoisCom_logo_2017.png"
            alt="Logo de la Communauté de Communes du Ternois"
            width={500}
            height={200}
            priority
          />
        </div>

        <section className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
          <AgeTiles value={age as AgeGroup} onChange={setAge} required />
          {err && <p className="mt-3 text-red-600 text-center">{err}</p>}
        </section>

        <h2 className="text-center text-2xl font-semibold text-gray-800 mt-10">
          Qu&apos;avez-vous pensé de cet événement culturel ?
        </h2>

        <SatisfactionApp onVote={handleVote} onResetAll={handleResetAll} />
      </div>
    </main>
  );
}
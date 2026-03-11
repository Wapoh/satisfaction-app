"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Download } from "lucide-react";

export type DiscoverySource =
  | "Réseaux sociaux"
  | "Affiche / flyer"
  | "Presse"
  | "Site internet"
  | "Bouche à oreille"
  | "Médiathèque / École de musique / autres structures TernoisCom";

export type ExpectationAnswer =
  | "Tout à fait"
  | "Plutôt oui"
  | "Plutôt non"
  | "Pas vraiment";

type AgeGroup = "-15" | "15-19" | "20-24" | "25-39" | "40-59" | "60+";

type StoredFeedback = {
  source: DiscoverySource;
  expectation: ExpectationAnswer;
  age: AgeGroup;
  createdAt: string;
};

const STORAGE_KEY = "satisfaction-feedbacks";

const DISCOVERY_OPTIONS: DiscoverySource[] = [
  "Réseaux sociaux",
  "Affiche / flyer",
  "Presse",
  "Site internet",
  "Bouche à oreille",
  "Médiathèque / École de musique / autres structures TernoisCom",
];

const EXPECTATION_OPTIONS: ExpectationAnswer[] = [
  "Tout à fait",
  "Plutôt oui",
  "Plutôt non",
  "Pas vraiment",
];

export default function SatisfactionApp({
  onSubmit,
  onResetAll,
  adminTrigger,
}: {
  onSubmit?: (source: DiscoverySource, expectation: ExpectationAnswer) => void;
  onResetAll?: () => void;
  adminTrigger: number;
}) {
  const [activeTab, setActiveTab] = useState("vote");
  const [source, setSource] = useState<DiscoverySource | "">("");
  const [expectation, setExpectation] = useState<ExpectationAnswer | "">("");
  const [stored, setStored] = useState<StoredFeedback[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const clickCountRef = useRef(0);
  const lastClickRef = useRef(0);

  const loadData = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setStored(raw ? JSON.parse(raw) : []);
    } catch {
      setStored([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (adminTrigger === 0) return;

    const now = Date.now();

    if (now - lastClickRef.current < 700) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }

    lastClickRef.current = now;

    if (clickCountRef.current >= 3) {
      setActiveTab("admin");
      clickCountRef.current = 0;
    }
  }, [adminTrigger]);

  const handleSubmit = () => {
    if (!source || !expectation) {
      setFormError("Veuillez répondre aux deux questions.");
      return;
    }

    setFormError(null);
    onSubmit?.(source, expectation);
    setSource("");
    setExpectation("");
    loadData();
  };

  const resetVotes = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStored([]);
    setSource("");
    setExpectation("");
    setFormError(null);
    onResetAll?.();
  };

  const exportResults = () => {
    const data = stored
      .map(
        (entry) =>
          `${new Date(entry.createdAt).toLocaleString()} — ${entry.age} — ${entry.source} — ${entry.expectation}`
      )
      .join("\n");

    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resultats-satisfaction.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const sourceCounts = useMemo(() => {
    const counts: Record<DiscoverySource, number> = {
      "Réseaux sociaux": 0,
      "Affiche / flyer": 0,
      Presse: 0,
      "Site internet": 0,
      "Bouche à oreille": 0,
      "Médiathèque / École de musique / autres structures TernoisCom": 0,
    };

    stored.forEach((entry) => {
      counts[entry.source] += 1;
    });

    return counts;
  }, [stored]);

  const expectationCounts = useMemo(() => {
    const counts: Record<ExpectationAnswer, number> = {
      "Tout à fait": 0,
      "Plutôt oui": 0,
      "Plutôt non": 0,
      "Pas vraiment": 0,
    };

    stored.forEach((entry) => {
      counts[entry.expectation] += 1;
    });

    return counts;
  }, [stored]);

  return (
    <div className="mx-auto max-w-6xl">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="vote">
          <Card className="border-[#cfe4f1] bg-white p-8 shadow-sm">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col">
                <h3 className="mb-2 text-base font-bold text-[#1f5f8b]">
                  Comment avez-vous connu l&apos;évènement ?
                </h3>

                <select
                  required
                  className="w-full rounded-lg border border-[#8fc2dd] bg-[#f4fbff] p-3 text-sm text-[#1f5f8b] outline-none transition focus:border-[#3aa76d] focus:ring-2 focus:ring-[#3aa76d]/25"
                  value={source}
                  onChange={(e) =>
                    setSource(e.target.value as DiscoverySource)
                  }
                >
                  <option value="">Choisir...</option>
                  {DISCOVERY_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <h3 className="mb-2 text-base font-bold text-[#1f5f8b]">
                  Cet évènement correspondait-il à vos attentes ?
                </h3>

                <select
                  required
                  className="w-full rounded-lg border border-[#8fc2dd] bg-[#f4fbff] p-3 text-sm text-[#1f5f8b] outline-none transition focus:border-[#3aa76d] focus:ring-2 focus:ring-[#3aa76d]/25"
                  value={expectation}
                  onChange={(e) =>
                    setExpectation(e.target.value as ExpectationAnswer)
                  }
                >
                  <option value="">Choisir...</option>
                  {EXPECTATION_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {formError && (
              <p className="mt-4 text-center font-medium text-red-600">
                {formError}
              </p>
            )}

            <div className="mt-8 text-center">
              <Button
                onClick={handleSubmit}
                className="border-0 bg-[#3aa76d] px-6 py-2 font-semibold text-white hover:bg-[#2f8d5c]"
              >
                Valider la réponse
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card className="space-y-6 border-[#cfe4f1] bg-white p-6 shadow-sm">
            <div>
              <h3 className="mb-2 font-semibold text-[#1f5f8b]">
                Résumé par provenance
              </h3>

              <ul className="space-y-1 text-sm text-slate-700">
                {DISCOVERY_OPTIONS.map((option) => (
                  <li key={option}>
                    {option} : {sourceCounts[option]}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-[#1f5f8b]">
                Résumé par attentes
              </h3>

              <ul className="space-y-1 text-sm text-slate-700">
                {EXPECTATION_OPTIONS.map((option) => (
                  <li key={option}>
                    {option} : {expectationCounts[option]}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-[#1f5f8b]">
                Dernières réponses
              </h3>

              {stored.length === 0 ? (
                <p className="text-sm opacity-70">Aucune réponse.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {stored.slice(0, 20).map((entry, index) => (
                    <li
                      key={index}
                      className="rounded-lg border border-[#d8e9f3] bg-[#f8fcfe] p-3"
                    >
                      {new Date(entry.createdAt).toLocaleString()} — {entry.age} —{" "}
                      {entry.source} — {entry.expectation}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={resetVotes}
                variant="outline"
                className="flex items-center gap-2 border-[#8fc2dd] text-[#1f5f8b] hover:bg-[#eef8fc]"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>

              <Button
                onClick={exportResults}
                variant="outline"
                className="flex items-center gap-2 border-[#8fc2dd] text-[#1f5f8b] hover:bg-[#eef8fc]"
              >
                <Download className="h-4 w-4" />
                Exporter
              </Button>

              <Button
                onClick={() => setActiveTab("vote")}
                className="ml-auto bg-[#1f5f8b] text-white hover:bg-[#184b6d]"
              >
                Retour
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
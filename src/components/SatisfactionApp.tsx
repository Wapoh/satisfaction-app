"use client";

import React, { useEffect, useState } from "react";
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
  | "Médiathèque / École de musique / structures TernoisCom";

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

export default function SatisfactionApp({
  onSubmit,
  onResetAll,
}: {
  onSubmit?: (source: DiscoverySource, expectation: ExpectationAnswer) => void;
  onResetAll?: () => void;
}) {
  const [activeTab, setActiveTab] = useState("vote");
  const [source, setSource] = useState<DiscoverySource | "">("");
  const [expectation, setExpectation] = useState<ExpectationAnswer | "">("");
  const [stored, setStored] = useState<StoredFeedback[]>([]);

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

  const handleSubmit = () => {
    if (!source || !expectation) return;

    onSubmit?.(source, expectation);

    setSource("");
    setExpectation("");

    loadData();
  };

  const resetVotes = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStored([]);
    onResetAll?.();
  };

  const exportResults = () => {
    const data = stored
      .map(
        (v) =>
          `${new Date(v.createdAt).toLocaleString()} — ${v.age} — ${v.source} — ${v.expectation}`
      )
      .join("\n");

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resultats-satisfaction.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  let clickCount = 0;
  let lastClick = 0;

  const handleAdminClick = () => {
    const now = Date.now();

    if (now - lastClick < 700) {
      clickCount++;

      if (clickCount >= 3) {
        setActiveTab("admin");
        clickCount = 0;
      }
    } else {
      clickCount = 1;
    }

    lastClick = now;
  };

  return (
    <div className="max-w-6xl mx-auto relative">

      {/* bouton admin discret */}
      <div
        onClick={handleAdminClick}
        className="absolute right-2 top-2 cursor-pointer text-xs bg-gray-200/60 hover:bg-gray-300 px-2 py-1 rounded"
      >
        Admin
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>

        {/* PARTIE QUESTIONNAIRE */}

        <TabsContent value="vote">
          <Card className="p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              <div>
                <h3 className="font-semibold mb-2">
                  Comment avez-vous connu l'évènement ?
                </h3>

                <select
                  className="border rounded p-2 w-full"
                  value={source}
                  onChange={(e) =>
                    setSource(e.target.value as DiscoverySource)
                  }
                >
                  <option value="">Choisir...</option>
                  <option>Réseaux sociaux</option>
                  <option>Affiche / flyer</option>
                  <option>Presse</option>
                  <option>Site internet</option>
                  <option>Bouche à oreille</option>
                  <option>
                    Médiathèque / École de musique / structures TernoisCom
                  </option>
                </select>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Cet évènement correspondait-il à vos attentes ?
                </h3>

                <select
                  className="border rounded p-2 w-full"
                  value={expectation}
                  onChange={(e) =>
                    setExpectation(e.target.value as ExpectationAnswer)
                  }
                >
                  <option value="">Choisir...</option>
                  <option>Tout à fait</option>
                  <option>Plutôt oui</option>
                  <option>Plutôt non</option>
                  <option>Pas vraiment</option>
                </select>
              </div>

            </div>

            <div className="mt-8 text-center">
              <Button onClick={handleSubmit}>Valider la réponse</Button>
            </div>

          </Card>
        </TabsContent>

        {/* PARTIE ADMIN */}

        <TabsContent value="admin">
          <Card className="p-6 space-y-6">

            <h3 className="font-semibold">Derniers votes</h3>

            {stored.length === 0 ? (
              <p>Aucune réponse.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {stored.slice(0, 20).map((v, i) => (
                  <li key={i} className="border p-2 rounded">
                    {new Date(v.createdAt).toLocaleString()} — {v.age} —{" "}
                    {v.source} — {v.expectation}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-3">

              <Button onClick={resetVotes} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>

              <Button onClick={exportResults} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>

              <Button
                onClick={() => setActiveTab("vote")}
                className="ml-auto"
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
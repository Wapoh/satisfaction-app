"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Download } from "lucide-react";
import Toast from "@/components/Toast";

interface VoteCount {
  excellent: number;
  bien: number;
  moyen: number;
  insuffisant: number;
}

export type VoteType = keyof VoteCount;

// ---- Données admin (lecture localStorage)
type AgeGroup = "-15" | "15-19" | "20-24" | "25-39" | "40-59" | "60+";
const AGE_GROUPS: AgeGroup[] = ["-15", "15-19", "20-24", "25-39", "40-59", "60+"];

type StoredFeedback = {
  rating: number;
  age: AgeGroup;
  createdAt: string;
};

const STORAGE_KEY = "satisfaction-feedbacks";

function mapRatingToVoteType(r: number): VoteType {
  if (r >= 5) return "excellent";
  if (r === 4) return "bien";
  if (r === 3) return "moyen";
  return "insuffisant"; // 1..2
}

export default function SatisfactionApp({
  onVote,
}: {
  onVote?: (type: VoteType) => void;
}) {
  const [votes, setVotes] = useState<VoteCount>({
    excellent: 0,
    bien: 0,
    moyen: 0,
    insuffisant: 0,
  });

  const [activeTab, setActiveTab] = useState<string>("vote");
  const [showToast, setShowToast] = useState(false);

  // Admin data
  const [stored, setStored] = useState<StoredFeedback[]>([]);
  const [matrix, setMatrix] =
    useState<Record<VoteType, Record<AgeGroup, number>> | null>(null);

  // Halo visuel sur le smiley cliqué
  const [flash, setFlash] = useState<VoteType | null>(null);

  // === Nouveau système de triple-clic global pour ouvrir l'onglet admin ===
  useEffect(() => {
    let lastClick = 0;
    let count = 0;

    const onGlobalClick = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      // Zone cliquable = carré 150px dans le coin supérieur droit
      const withinAdminZone =
        clientX > window.innerWidth - 150 && clientY < 150;

      if (!withinAdminZone) return;

      const now = Date.now();

      if (now - lastClick < 700) {
        count++;
        if (count >= 3) {
          setActiveTab("admin");
          count = 0;
        }
      } else {
        count = 1;
      }

      lastClick = now;
    };

    window.addEventListener("click", onGlobalClick);
    return () => window.removeEventListener("click", onGlobalClick);
  }, []);

  const handleVote = (type: VoteType) => {
    // callback vers la page (sauvegarde age + createdAt + rating)
    onVote?.(type);

    // compteur local
    setVotes((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setShowToast(true);

    // petite vibration (si supportée) pour retour haptique
    try {
      (navigator as any)?.vibrate?.(10);
    } catch {
      // ignore
    }

    // halo visuel
    setFlash(type);
    setTimeout(() => setFlash(null), 250);

    // recharge les données stockées (pour admin en direct)
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      setStored(raw ? (JSON.parse(raw) as StoredFeedback[]) : []);
    } catch {
      // ignore
    }
  };

  const resetVotes = () => {
    setVotes({
      excellent: 0,
      bien: 0,
      moyen: 0,
      insuffisant: 0,
    });
  };

  const exportResults = () => {
    const data = `Résultats (compteur smileys):
Excellent: ${votes.excellent}
Bien: ${votes.bien}
Moyen: ${votes.moyen}
Insuffisant: ${votes.insuffisant}`;
    const blob = new Blob([data], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resultats-satisfaction.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // charge votes stockés au montage
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      setStored(raw ? (JSON.parse(raw) as StoredFeedback[]) : []);
    } catch {
      setStored([]);
    }
  }, []);

  // calcule matrice âge × appréciation à l’ouverture de l’admin
  useEffect(() => {
    if (activeTab !== "admin") return;

    const base: Record<VoteType, Record<AgeGroup, number>> = {
      excellent: {
        "-15": 0,
        "15-19": 0,
        "20-24": 0,
        "25-39": 0,
        "40-59": 0,
        "60+": 0,
      },
      bien: {
        "-15": 0,
        "15-19": 0,
        "20-24": 0,
        "25-39": 0,
        "40-59": 0,
        "60+": 0,
      },
      moyen: {
        "-15": 0,
        "15-19": 0,
        "20-24": 0,
        "25-39": 0,
        "40-59": 0,
        "60+": 0,
      },
      insuffisant: {
        "-15": 0,
        "15-19": 0,
        "20-24": 0,
        "25-39": 0,
        "40-59": 0,
        "60+": 0,
      },
    };

    (stored || []).forEach((f) => {
      const col = mapRatingToVoteType(f.rating);
      if (base[col] && base[col][f.age] !== undefined) {
        base[col][f.age] += 1;
      }
    });

    setMatrix(base);
  }, [activeTab, stored]);

  // ---- Smileys iPad-friendly
  const SmileySVG = ({
    type,
  }: {
    type: "excellent" | "bien" | "moyen" | "insuffisant";
  }) => {
    const colors = {
      excellent: "#8CC84B",
      bien: "#FFD700",
      moyen: "#FF8C00",
      insuffisant: "#FF4136",
    };
    const faces = {
      excellent: (
        <>
          <circle cx="35" cy="40" r="5" fill="#000" />
          <circle cx="65" cy="40" r="5" fill="#000" />
          <path
            d="M30 55 C 40 65, 60 65, 70 55"
            stroke="#000"
            strokeWidth="5"
            fill="none"
          />
        </>
      ),
      bien: (
        <>
          <circle cx="35" cy="40" r="5" fill="#000" />
          <circle cx="65" cy="40" r="5" fill="#000" />
          <path
            d="M30 60 L 70 60"
            stroke="#000"
            strokeWidth="5"
            fill="none"
          />
        </>
      ),
      moyen: (
        <>
          <circle cx="35" cy="40" r="5" fill="#000" />
          <circle cx="65" cy="40" r="5" fill="#000" />
          <path
            d="M30 65 C 40 55, 60 55, 70 65"
            stroke="#000"
            strokeWidth="5"
            fill="none"
          />
        </>
      ),
      insuffisant: (
        <>
          <path
            d="M25 35 C 30 30, 35 30, 40 35"
            stroke="#000"
            strokeWidth="5"
            fill="none"
          />
          <path
            d="M60 35 C 65 30, 70 30, 75 35"
            stroke="#000"
            strokeWidth="5"
            fill="none"
          />
          <path
            d="M30 65 C 40 55, 60 55, 70 65"
            stroke="#000"
            strokeWidth="5"
            fill="none"
          />
        </>
      ),
    };
    return (
      <svg
        viewBox="0 0 100 100"
        className="select-none touch-none w-36 h-36 md:w-56 md:h-56 lg:w-64 lg:h-64"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="50" cy="50" r="45" fill={colors[type]} />
        {faces[type]}
      </svg>
    );
  };

  // Bouton “smiley” accessible et large zone de clic
  const SmileyButton = ({
    type,
    label,
    onClick,
    active = false,
  }: {
    type: "excellent" | "bien" | "moyen" | "insuffisant";
    label: string;
    onClick: () => void;
    active?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={[
        "group w-full flex items-center justify-center rounded-2xl p-2 md:p-3",
        "hover:scale-[1.03] active:scale-[0.98] transition-transform outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        active ? "ring-4 ring-black/40 ring-offset-2" : "",
      ].join(" ")}
      aria-label={label}
    >
      <SmileySVG type={type} />
    </button>
  );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Onglet vote */}
        <TabsContent value="vote" className="mt-4">
          <Card className="p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 place-items-center">
              <SmileyButton
                type="excellent"
                label="Excellent"
                onClick={() => handleVote("excellent")}
                active={flash === "excellent"}
              />
              <SmileyButton
                type="bien"
                label="Bien"
                onClick={() => handleVote("bien")}
                active={flash === "bien"}
              />
              <SmileyButton
                type="moyen"
                label="Moyen"
                onClick={() => handleVote("moyen")}
                active={flash === "moyen"}
              />
              <SmileyButton
                type="insuffisant"
                label="Insuffisant"
                onClick={() => handleVote("insuffisant")}
                active={flash === "insuffisant"}
              />
            </div>
          </Card>
        </TabsContent>

        {/* Onglet admin */}
        <TabsContent value="admin" className="mt-4">
          <Card className="p-4 md:p-6 space-y-6">
            {/* Résumé (compteur smileys) */}
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Résumé des votes (smileys)</h3>
              <ul className="text-sm opacity-80">
                <li>Excellent: {votes.excellent}</li>
                <li>Bien: {votes.bien}</li>
                <li>Moyen: {votes.moyen}</li>
                <li>Insuffisant: {votes.insuffisant}</li>
              </ul>
            </div>

            {/* Répartition par tranche d’âge (localStorage) */}
            <div className="space-y-3">
              <h3 className="font-medium">Répartition par tranche d’âge</h3>
              {!matrix ? (
                <p className="text-sm opacity-70">Aucune donnée enregistrée.</p>
              ) : (
                <div className="overflow-auto">
                  <table className="min-w-[600px] w-full text-sm border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border px-3 py-2 text-left">
                          Tranche d’âge
                        </th>
                        <th className="border px-3 py-2 text-center">
                          Excellent
                        </th>
                        <th className="border px-3 py-2 text-center">Bien</th>
                        <th className="border px-3 py-2 text-center">Moyen</th>
                        <th className="border px-3 py-2 text-center">
                          Insuffisant
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {AGE_GROUPS.map((ag) => (
                        <tr key={ag}>
                          <td className="border px-3 py-2">{ag}</td>
                          <td className="border px-3 py-2 text-center">
                            {matrix.excellent[ag]}
                          </td>
                          <td className="border px-3 py-2 text-center">
                            {matrix.bien[ag]}
                          </td>
                          <td className="border px-3 py-2 text-center">
                            {matrix.moyen[ag]}
                          </td>
                          <td className="border px-3 py-2 text-center">
                            {matrix.insuffisant[ag]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Derniers votes */}
            <div className="space-y-2">
              <h3 className="font-medium">Derniers votes</h3>
              {stored.length === 0 ? (
                <p className="text-sm opacity-70">Aucun vote enregistré.</p>
              ) : (
                <ul className="text-sm space-y-1">
                  {stored.slice(0, 20).map((f, i) => (
                    <li key={i} className="border rounded px-3 py-2">
                      {new Date(f.createdAt).toLocaleString()} — {f.age} —{" "}
                      {mapRatingToVoteType(f.rating)}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Actions admin */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={resetVotes}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </Button>

              <Button
                onClick={exportResults}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exporter les résultats
              </Button>

              <Button
                onClick={() => setActiveTab("vote")}
                variant="default"
                className="md:ml-auto"
              >
                Retour au vote
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Toast
        message="Merci de votre réponse"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

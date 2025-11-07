'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Download } from 'lucide-react';
import Toast from '@/components/Toast';

interface VoteCount {
  excellent: number;
  bien: number;
  moyen: number;
  insuffisant: number;
}

type VoteType = keyof VoteCount;

export default function SatisfactionApp({
  onVote,
}: {
  onVote?: (type: VoteType) => void; // 👈 callback optionnel
}) {
  const [votes, setVotes] = useState<VoteCount>({
    excellent: 0,
    bien: 0,
    moyen: 0,
    insuffisant: 0
  });
  const [activeTab, setActiveTab] = useState<string>('vote');
  const [adminClicks, setAdminClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const handleVote = (type: VoteType) => {
    // callback vers la page (pour sauver age + createdAt)
    onVote?.(type);

    // comptage local existant
    setVotes(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    setShowToast(true);
  };

  const resetVotes = () => {
    setVotes({
      excellent: 0,
      bien: 0,
      moyen: 0,
      insuffisant: 0
    });
  };

  const exportResults = () => {
    const data = `Résultats:\nExcellent: ${votes.excellent}\nBien: ${votes.bien}\nMoyen: ${votes.moyen}\nInsuffisant: ${votes.insuffisant}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resultats-satisfaction.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogoClick = () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime > 2000) {
      setAdminClicks(1);
    } else {
      setAdminClicks(adminClicks + 1);
    }
    setLastClickTime(currentTime);
  };

  useEffect(() => {
    if (adminClicks >= 3) {
      setActiveTab('admin');
      setAdminClicks(0);
    }
  }, [adminClicks]);

  // Custom SVG Smileys (inchangé)
  const SmileySVG = ({ type }: { type: 'excellent' | 'bien' | 'moyen' | 'insuffisant' }) => {
    const colors = {
      excellent: '#8CC84B',
      bien: '#FFD700',
      moyen: '#FF8C00',
      insuffisant: '#FF4136'
    };
    const faces = {
      excellent: (<><circle cx="35" cy="40" r="5" fill="#000" /><circle cx="65" cy="40" r="5" fill="#000" /><path d="M30 55 C 40 65, 60 65, 70 55" stroke="#000" strokeWidth="5" fill="none" /></>),
      bien: (<><circle cx="35" cy="40" r="5" fill="#000" /><circle cx="65" cy="40" r="5" fill="#000" /><path d="M30 60 L 70 60" stroke="#000" strokeWidth="5" fill="none" /></>),
      moyen: (<><circle cx="35" cy="40" r="5" fill="#000" /><circle cx="65" cy="40" r="5" fill="#000" /><path d="M30 65 C 40 55, 60 55, 70 65" stroke="#000" strokeWidth="5" fill="none" /></>),
      insuffisant: (<><path d="M25 35 C 30 30, 35 30, 40 35" stroke="#000" strokeWidth="5" fill="none" /><path d="M60 35 C 65 30, 70 30, 75 35" stroke="#000" strokeWidth="5" fill="none" /><path d="M30 65 C 40 55, 60 55, 70 65" stroke="#000" strokeWidth="5" fill="none" /></>)
    };
    return (
      <svg viewBox="0 0 100 100" className="w-64 h-64 cursor-pointer">
        <circle cx="50" cy="50" r="45" fill={colors[type]} />
        {faces[type]}
      </svg>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div
          className="w-6 h-6 absolute top-2 right-2 cursor-default"
          onClick={handleLogoClick}
          title="Zone d'accès administrateur"
        />

        <TabsContent value="vote" className="mt-4">
          <Card className="p-6">
            <div className="grid grid-cols-4 gap-8">
              <div onClick={() => handleVote('excellent')} className="cursor-pointer hover:scale-105 transition-transform">
                <SmileySVG type="excellent" />
              </div>
              <div onClick={() => handleVote('bien')} className="cursor-pointer hover:scale-105 transition-transform">
                <SmileySVG type="bien" />
              </div>
              <div onClick={() => handleVote('moyen')} className="cursor-pointer hover:scale-105 transition-transform">
                <SmileySVG type="moyen" />
              </div>
              <div onClick={() => handleVote('insuffisant')} className="cursor-pointer hover:scale-105 transition-transform">
                <SmileySVG type="insuffisant" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="mt-4">
          <Card className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="mb-4 p-4 bg-gray-100 rounded-md">
                <h3 className="font-medium mb-2">Résumé des votes :</h3>
                <ul>
                  <li>Excellent: {votes.excellent}</li>
                  <li>Bien: {votes.bien}</li>
                  <li>Moyen: {votes.moyen}</li>
                  <li>Insuffisant: {votes.insuffisant}</li>
                </ul>
              </div>

              <Button onClick={resetVotes} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </Button>

              <Button onClick={exportResults} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exporter les résultats
              </Button>

              <Button onClick={() => setActiveTab('vote')} variant="default" className="mt-4">
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

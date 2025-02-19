'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Download } from 'lucide-react';

interface VoteCount {
  excellent: number;
  bien: number;
  moyen: number;
  insuffisant: number;
}

const SatisfactionApp: React.FC = () => {
  const [votes, setVotes] = useState<VoteCount>({
    excellent: 0,
    bien: 0,
    moyen: 0,
    insuffisant: 0
  });
  const [activeTab, setActiveTab] = useState<string>('vote');
  const [adminClicks, setAdminClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleVote = (type: keyof VoteCount) => {
    setVotes(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
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

  // Custom SVG Smileys
  const SmileySVG = ({ type }: { type: 'excellent' | 'bien' | 'moyen' | 'insuffisant' }) => {
    const colors = {
      excellent: '#90EE90', // Light green
      bien: '#FFD700',      // Yellow
      moyen: '#FFA500',     // Orange
      insuffisant: '#DC143C' // Red
    };

    const paths = {
      excellent: "M50 90 C 40 90, 30 70, 50 60 C 70 70, 60 90, 50 90", // Big smile
      bien: "M30 70 C 40 75, 60 75, 70 70",                            // Smile
      moyen: "M30 70 L 70 70",                                         // Straight line
      insuffisant: "M30 80 C 40 70, 60 70, 70 80"                      // Frown
    };

    return (
      <svg viewBox="0 0 100 100" className="w-64 h-64 cursor-pointer">
        <circle cx="50" cy="50" r="45" fill={colors[type]} />
        <circle cx="35" cy="40" r="5" fill="#333" /> {/* Left eye */}
        <circle cx="65" cy="40" r="5" fill="#333" /> {/* Right eye */}
        <path d={paths[type]} stroke="#333" strokeWidth="3" fill="none" /> {/* Mouth */}
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
                onClick={() => setActiveTab('vote')}
                variant="default" 
                className="mt-4"
              >
                Retour au vote
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SatisfactionApp;
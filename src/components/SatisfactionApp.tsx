'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SmilePlus, Meh, Frown, RotateCcw, Download } from 'lucide-react';

// Interface définissant la structure des votes
interface VoteCount {
  excellent: number;
  bien: number;
  moyen: number;
  insuffisant: number;
}

const SatisfactionApp: React.FC = () => {
  // Définition de l'état pour stocker les votes
  const [votes, setVotes] = useState<VoteCount>({
    excellent: 0,
    bien: 0,
    moyen: 0,
    insuffisant: 0
  });
  // État pour suivre l'onglet actif
  const [activeTab, setActiveTab] = useState<string>('vote');
  const [adminClicks, setAdminClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Fonction pour gérer les votes
  const handleVote = (type: keyof VoteCount) => {
    setVotes(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  // Fonction pour réinitialiser les votes
  const resetVotes = () => {
    setVotes({
      excellent: 0,
      bien: 0,
      moyen: 0,
      insuffisant: 0
    });
  };

  // Fonction pour exporter les résultats sous forme de fichier texte
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

  // Gestion de l'accès administrateur
  const handleLogoClick = () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime > 2000) {
      setAdminClicks(1);
    } else {
      setAdminClicks(adminClicks + 1);
    }
    setLastClickTime(currentTime);
  };

  // Vérification de l'accès admin après 3 clics
  useEffect(() => {
    if (adminClicks >= 3) {
      setActiveTab('admin');
      setAdminClicks(0);
    }
  }, [adminClicks]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="vote">Voter</TabsTrigger>
        </TabsList>

        {/* Zone cliquable pour accès admin */}
        <div className="w-6 h-6 absolute top-2 right-2 cursor-default" onClick={handleLogoClick} title="Zone d'accès administrateur" />

        {/* Contenu de l'onglet vote */}
        <TabsContent value="vote" className="mt-4">
          <Card className="p-6">
            <div className="grid grid-cols-4 gap-4">
              <Button onClick={() => handleVote('excellent')} className="p-6 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center">
                <SmilePlus className="h-32 w-32 text-white" />
              </Button>
              <Button onClick={() => handleVote('bien')} className="p-6 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center">
                <SmilePlus className="h-32 w-32 text-gray-800" />
              </Button>
              <Button onClick={() => handleVote('moyen')} className="p-6 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center">
                <Meh className="h-32 w-32 text-white" />
              </Button>
              <Button onClick={() => handleVote('insuffisant')} className="p-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center">
                <Frown className="h-32 w-32 text-white" />
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Contenu de l'onglet administration */}
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
                <RotateCcw className="w-4 h-4" /> Réinitialiser
              </Button>
              <Button onClick={exportResults} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" /> Exporter les résultats
              </Button>
              <Button onClick={() => setActiveTab('vote')} variant="default" className="mt-4">
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

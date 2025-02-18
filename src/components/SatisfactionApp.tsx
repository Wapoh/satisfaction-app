'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SmilePlus, Meh, Frown, RotateCcw, Download } from 'lucide-react';

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

  // Fonction pour gérer l'accès administrateur
  const handleLogoClick = () => {
    const currentTime = new Date().getTime();
    
    // Réinitialise le compteur si plus de 2 secondes se sont écoulées
    if (currentTime - lastClickTime > 2000) {
      setAdminClicks(1);
    } else {
      setAdminClicks(adminClicks + 1);
    }
    
    setLastClickTime(currentTime);
  };

  // Vérifie si l'accès admin est accordé (3 clics rapides)
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
          {/* L'onglet Administration reste caché dans l'interface */}
        </TabsList>

        {/* Zone cliquable pour accéder à l'admin */}
        <div 
          className="w-6 h-6 absolute top-2 right-2 cursor-default"
          onClick={handleLogoClick}
          title="Zone d'accès administrateur"
        />

        <TabsContent value="vote" className="mt-4">
          <Card className="p-6">
            <div className="grid grid-cols-4 gap-4">
              <Button 
                onClick={() => handleVote('excellent')} 
                className="flex flex-col items-center p-6 bg-green-500 hover:bg-green-600"
              >
                <SmilePlus className="h-16 w-16 mb-2" />
                <span className="text-white font-medium text-sm">Excellent</span>
              </Button>
              
              <Button 
                onClick={() => handleVote('bien')} 
                className="flex flex-col items-center p-6 bg-yellow-400 hover:bg-yellow-500"
              >
                <SmilePlus className="h-16 w-16 mb-2" />
                <span className="text-gray-800 font-medium text-sm">Bien</span>
              </Button>

              <Button 
                onClick={() => handleVote('moyen')} 
                className="flex flex-col items-center p-6 bg-orange-500 hover:bg-orange-600"
              >
                <Meh className="h-16 w-16 mb-2" />
                <span className="text-white font-medium text-sm">Moyen</span>
              </Button>

              <Button 
                onClick={() => handleVote('insuffisant')} 
                className="flex flex-col items-center p-6 bg-red-500 hover:bg-red-600"
              >
                <Frown className="h-16 w-16 mb-2" />
                <span className="text-white font-medium text-sm">Insuffisant</span>
              </Button>
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
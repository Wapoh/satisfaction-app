'use client';

import React, { useState } from 'react';
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

  return (
    <div className="p-4 max-w-md mx-auto">
      <Tabs defaultValue="vote" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="vote">Voter</TabsTrigger>
          {/* L'onglet Administration a été supprimé */}
        </TabsList>

        <TabsContent value="vote" className="mt-4">
          <Card className="p-6">
            <div className="grid grid-cols-4 gap-4">
              <Button 
                onClick={() => handleVote('excellent')} 
                className="flex flex-col items-center p-6 bg-green-500 hover:bg-green-600"
              >
                <SmilePlus className="h-12 w-12" />
                {/* Suppression de l'affichage du nombre de votes */}
              </Button>
              
              <Button 
                onClick={() => handleVote('bien')} 
                className="flex flex-col items-center p-6 bg-yellow-400 hover:bg-yellow-500"
              >
                <SmilePlus className="h-12 w-12" />
                {/* Suppression de l'affichage du nombre de votes */}
              </Button>

              <Button 
                onClick={() => handleVote('moyen')} 
                className="flex flex-col items-center p-6 bg-orange-500 hover:bg-orange-600"
              >
                <Meh className="h-12 w-12" />
                {/* Suppression de l'affichage du nombre de votes */}
              </Button>

              <Button 
                onClick={() => handleVote('insuffisant')} 
                className="flex flex-col items-center p-6 bg-red-500 hover:bg-red-600"
              >
                <Frown className="h-12 w-12" />
                {/* Suppression de l'affichage du nombre de votes */}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="mt-4">
          <Card className="p-6">
            <div className="flex flex-col space-y-4">
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
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SatisfactionApp;
'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SmilePlus, Meh, Frown, RotateCcw, Download } from 'lucide-react';

interface VoteCount {
  happy: number;
  neutral: number;
  sad: number;
}

const SatisfactionApp: React.FC = () => {
  const [votes, setVotes] = useState<VoteCount>({
    happy: 0,
    neutral: 0,
    sad: 0
  });

  const handleVote = (type: keyof VoteCount) => {
    setVotes(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const resetVotes = () => {
    setVotes({
      happy: 0,
      neutral: 0,
      sad: 0
    });
  };

  const exportResults = () => {
    const data = `Résultats:\nSatisfait: ${votes.happy}\nNeutre: ${votes.neutral}\nInsatisfait: ${votes.sad}`;
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vote">Voter</TabsTrigger>
          <TabsTrigger value="admin">Administration</TabsTrigger>
        </TabsList>

        <TabsContent value="vote" className="mt-4">
          <Card className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <Button 
                onClick={() => handleVote('happy')} 
                className="flex flex-col items-center p-6 bg-green-500 hover:bg-green-600"
              >
                <SmilePlus className="h-12 w-12" />
                <span className="mt-2">{votes.happy}</span>
              </Button>

              <Button 
                onClick={() => handleVote('neutral')} 
                className="flex flex-col items-center p-6 bg-orange-500 hover:bg-orange-600"
              >
                <Meh className="h-12 w-12" />
                <span className="mt-2">{votes.neutral}</span>
              </Button>

              <Button 
                onClick={() => handleVote('sad')} 
                className="flex flex-col items-center p-6 bg-red-500 hover:bg-red-600"
              >
                <Frown className="h-12 w-12" />
                <span className="mt-2">{votes.sad}</span>
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
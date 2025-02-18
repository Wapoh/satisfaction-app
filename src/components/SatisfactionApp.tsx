'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SmilePlus, Meh, Frown } from 'lucide-react';

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

  const handleVote = (type: keyof VoteCount) => {
    setVotes(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="vote">Voter</TabsTrigger>
        </TabsList>

        <TabsContent value="vote" className="mt-4">
          <Card className="p-6">
            <div className="grid grid-cols-4 gap-4">
              <Button onClick={() => handleVote('excellent')} className="p-6 bg-green-500 hover:bg-green-600 rounded-full">
                <SmilePlus className="h-24 w-24 text-white" />
              </Button>
              <Button onClick={() => handleVote('bien')} className="p-6 bg-yellow-400 hover:bg-yellow-500 rounded-full">
                <SmilePlus className="h-24 w-24 text-gray-800" />
              </Button>
              <Button onClick={() => handleVote('moyen')} className="p-6 bg-orange-500 hover:bg-orange-600 rounded-full">
                <Meh className="h-24 w-24 text-white" />
              </Button>
              <Button onClick={() => handleVote('insuffisant')} className="p-6 bg-red-500 hover:bg-red-600 rounded-full">
                <Frown className="h-24 w-24 text-white" />
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SatisfactionApp;

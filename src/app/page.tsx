import type { Metadata } from 'next';
import SatisfactionApp from '@/components/SatisfactionApp';

export const metadata: Metadata = {
  title: 'Application de Satisfaction',
  description: 'Sondage de satisfaction avec émojis',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Évaluez votre satisfaction
        </h1>
        <SatisfactionApp />
      </div>
    </main>
  );
}
import type { Metadata } from 'next';
import Image from 'next/image';
import SatisfactionApp from '@/components/SatisfactionApp';
import TernoisComLogo from '@/public/640px-TernoisCom_logo_2017.png'; // Assurez-vous que l'image est bien dans public

export const metadata: Metadata = {
  title: 'Application de Satisfaction',
  description: 'Sondage de satisfaction avec émojis',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Image 
            src={TernoisComLogo} 
            alt="Logo de la Communauté de Communes du Ternois" 
            width={250} // Ajustez la taille si besoin
            height={100}
          />
        </div>
        <SatisfactionApp />
      </div>
    </main>
  );
}

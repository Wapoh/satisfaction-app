import Image from 'next/image';
import SatisfactionApp from '@/components/SatisfactionApp';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Image 
            src="/640px-TernoisCom_logo_2017.png" 
            alt="Logo de la Communauté de Communes du Ternois" 
            width={250} 
            height={100} 
          />
        </div>
        <SatisfactionApp />
      </div>
    </main>
  );
}

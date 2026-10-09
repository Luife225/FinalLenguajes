import { ReactNode } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface MainLayoutProps {
  children: ReactNode;
  footerLinkText?: string;
  footerLinkTo?: string;
}

export const MainLayout = ({ children, footerLinkText, footerLinkTo }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer linkText={footerLinkText} linkTo={footerLinkTo} />
    </div>
  );
};

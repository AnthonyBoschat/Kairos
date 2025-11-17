import '@/styles/main.scss';
import { Providers } from './providers';
import s from "./styles.module.scss"
import { Anuphan, Mulish } from 'next/font/google'
import withClass from '@/utils/class';
import { Metadata } from 'next';

const anuphan = Anuphan({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-anuphan',
});
const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', "500", "600", '700'],
  variable: '--font-mulish',
});

export const metadata: Metadata = {
  title: 'Kairos',
  description: 'Organisez vos projets avec Kairos : créez des dossiers, listes de tâches et suivez vos objectifs efficacement',
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="fr">
      <body className={withClass(s.layout, anuphan.variable, mulish.variable)} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

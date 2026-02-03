import '@/styles/main.scss';
import { Providers } from './providers';
import s from "./styles.module.scss"
import { Anuphan, Mulish, Redacted_Script } from 'next/font/google'
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
const redacted = Redacted_Script({
  subsets: ['latin'],
  weight: ['300', "400", "700"],
  variable: '--font-redacted',
});

export const metadata: Metadata = {
  title: 'Kairos: les bonnes actions, au bon moment',
  description: 'Organisez vos projets avec Kairos : créez des dossiers, listes de tâches et suivez vos objectifs efficacement',
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="fr">
      <body className={withClass(s.layout, anuphan.variable, mulish.variable, redacted.variable)} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

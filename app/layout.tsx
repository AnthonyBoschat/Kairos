import '@/styles/main.scss';
import { Providers } from './providers';
import s from "./styles.module.scss"
import { Anuphan } from 'next/font/google'
import withClass from '@/utils/class';

const mulish = Anuphan({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mulish',
});

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="fr">
      <body className={withClass(s.layout, mulish.variable)} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

import '@/styles/main.scss';
import { Providers } from './providers';
import s from "./styles.module.scss"
import { Anuphan, Anton_SC } from 'next/font/google'
import withClass from '@/utils/class';

const anuphan = Anuphan({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-anuphan',
});
const anton = Anton_SC({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-antonsc',
});

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="fr">
      <body className={withClass(s.layout, anuphan.variable, anton.variable)} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

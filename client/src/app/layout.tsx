import type { Metadata } from 'next';
import 'remixicon/fonts/remixicon.css';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Local Marketplace',
  description: 'A final project marketplace built with Next.js, Express, MongoDB, Mongoose, JWT, and DaisyUI.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="marketplace">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

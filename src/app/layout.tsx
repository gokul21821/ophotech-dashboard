import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'CMS Dashboard',
  description: 'Manage your newsletters, blogs, and case studies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
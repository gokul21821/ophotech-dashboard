import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: "OphoTech | AI-Powered MVP Development in 15 Days",
  description:
    "Transform your vision into production-ready MVPs with OphoTech's AI-driven development approach.",
  icons: {
    icon: "/icons/titlebar.svg",
  },
  openGraph: {
    title: "OphoTech | AI-Powered MVP Development in 15 Days",
    description:
      "Transform your vision into production-ready MVPs with OphoTech's AI-driven development approach.",
    url: "https://ophotech.com",
    siteName: "OphoTech",
    locale: "en_US",
    type: "website",
  },
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
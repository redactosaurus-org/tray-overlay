import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Redactosaurus Tray Overlay',
    description: 'Manage your protection settings and protected domains',
    icons: {
        icon: [
            { rel: 'icon', url: '/redactosaurus_logo.png' },
            { rel: 'icon', url: '/redactosaurus.ico' },
        ],
        apple: '/redactosaurus_logo.png',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}

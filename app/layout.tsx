import type { Metadata } from 'next';
import './globals.css';
const title = 'デザインの言語化ワークショップ';
const description = '「なぜ、このデザインなのか？」に答える。判断の根拠を共有し、チームの次の意思決定につなげる8時間のワークショップ。';
const coverImage = 'https://bon214.github.io/design-language-workshop/cover-thumbnail.png';
export const metadata: Metadata = {
 title, description, icons: { icon: '/favicon.svg' },
 openGraph: { title, description, type: 'website', locale: 'ja_JP', url: 'https://bon214.github.io/design-language-workshop/', images: [{ url: coverImage, width: 1280, height: 740, alt: 'デザインの言語化ワークショップの表紙' }] },
 twitter: { card: 'summary_large_image', title, description, images: [coverImage] },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>){return <html lang="ja"><body>{children}</body></html>}

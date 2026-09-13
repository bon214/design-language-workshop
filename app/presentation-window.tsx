'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';

// A fixed viewport preserves the slide layout, including its media queries,
// while the outer tab scales the whole slide to fit the display.
const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 740;
const getScale = () => Math.min(window.innerWidth / SLIDE_WIDTH, window.innerHeight / SLIDE_HEIGHT);
const makeSlideUrl = () => {
 const url = new URL(window.location.href);
 url.searchParams.set('view', 'slide');
 return url.href;
};

export default function PresentationWindow() {
 const frame = useRef<HTMLIFrameElement>(null);
 const [scale, setScale] = useState(getScale);
 const [full, setFull] = useState(false);
 const [message, setMessage] = useState('');
 const [slideUrl, setSlideUrl] = useState(makeSlideUrl);

 const enterFullscreen = useCallback(async () => {
  try {
   if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
   }
   setMessage('');
   frame.current?.contentWindow?.focus();
  } catch {
   setMessage(document.fullscreenEnabled
    ? 'ボタンを押すと全画面表示になります。'
    : 'ブラウザーの表示メニューから全画面に切り替えてください。');
  }
 }, []);

 useEffect(() => {
  document.title = 'スライド上映｜デザインの言語化';
  const resize = () => setScale(getScale());
  const navigate = () => setSlideUrl(makeSlideUrl());
  const fullscreen = () => {
   setFull(!!document.fullscreenElement);
   resize();
  };
  const request = (event: MessageEvent) => {
   if (event.source !== frame.current?.contentWindow || event.origin !== window.location.origin) return;
   if (event.data?.type === 'workshop-fullscreen') {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void enterFullscreen();
   }
   if (event.data?.type === 'workshop-slide' && /^#slide-\d+$/.test(event.data.hash)) {
    window.history.replaceState(null, '', event.data.hash);
   }
  };
  window.addEventListener('resize', resize);
  window.addEventListener('hashchange', navigate);
  window.addEventListener('message', request);
  document.addEventListener('fullscreenchange', fullscreen);
  // Automatic fullscreen works when the browser has granted it. Otherwise
  // retain the slide-only tab and offer one direct user gesture to enter it.
  const initialFrame = window.requestAnimationFrame(() => void enterFullscreen());
  return () => {
   window.cancelAnimationFrame(initialFrame);
   window.removeEventListener('resize', resize);
   window.removeEventListener('hashchange', navigate);
   window.removeEventListener('message', request);
   document.removeEventListener('fullscreenchange', fullscreen);
  };
 }, [enterFullscreen]);

 return <main className="presentation-window">
  <iframe
   ref={frame}
   title="スライド上映"
   src={slideUrl}
   allow="fullscreen"
   allowFullScreen
   style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: `translate(-50%, -50%) scale(${scale})` }}
   onLoad={() => frame.current?.contentWindow?.focus()}
  />
  {!full && <div className="presentation-launch">
   <Button onClick={() => void enterFullscreen()}><Expand/>全画面で表示</Button>
   {message && <output>{message}</output>}
  </div>}
 </main>;
}

"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const adsbygoogle = (window as any).adsbygoogle;
      if (adsbygoogle && adRef.current) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      // AdSense not loaded yet or ad blocker
    }
  }, []);

  return (
    <div ref={adRef} className={`w-full overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5881105388002876"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

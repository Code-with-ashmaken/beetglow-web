import { useEffect } from 'react';
import { FB_PIXEL_ID } from '../config/store';

/**
 * Loads Meta Pixel when FB_PIXEL_ID is set (env REACT_APP_FB_PIXEL_ID).
 * Without an ID, no script runs — paste your Pixel ID in .env to enable tracking.
 */
export default function FacebookPixel() {
  useEffect(() => {
    if (!FB_PIXEL_ID) return;

    if (document.getElementById('fb-pixel-base')) return;

    const s = document.createElement('script');
    s.id = 'fb-pixel-base';
    s.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(s);

    const nos = document.createElement('noscript');
    nos.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1" alt="" />`;
    document.body.appendChild(nos);
  }, []);

  return null;
}

import React, { useEffect } from 'react';

// Get Meta Pixel ID from localStorage or use default
const getMetaPixelId = () => {
  return localStorage.getItem('metaPixelId') || '';
};

const FacebookPixel = ({ children }) => {
  const pixelId = getMetaPixelId();

  useEffect(() => {
    // Only initialize pixel if we have a valid ID
    if (pixelId && pixelId.trim() !== '') {
      // Initialize Facebook Pixel
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;f.push=n;f.loaded=!0;f.version='2.0';f.queue=[];t=b.createElement(e);t.async=!0;t.src=v;u=b.getElementsByTagName(e)[0];
      u.parentNode.insertBefore(t,u)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', pixelId);
      fbq('track', 'PageView');
    }
  }, [pixelId]);

  // Don't render anything visible - this is just for pixel tracking
  return null;
};

export default FacebookPixel;

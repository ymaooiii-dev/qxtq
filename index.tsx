import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 只有在生产环境且 HTTPS 下注册 SW
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(reg => console.log('SW Registered'))
      .catch(err => console.debug('SW Failed (Normal in some modes)', err));
  });
}

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}

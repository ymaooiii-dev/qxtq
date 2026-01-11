import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 只有在生产环境且支持的情况下注册 SW
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

if ('serviceWorker' in navigator && !isLocalhost) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Atmosphere SW Active'))
      .catch(err => console.debug('SW Registration Skip', err));
  });
}

const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    // 显式停止外部的超时计时器
    // Fix: Access loadTimer via type casting to avoid "Property 'loadTimer' does not exist on type 'Window'" errors
    const anyWindow = window as any;
    if (anyWindow.loadTimer) {
      clearTimeout(anyWindow.loadTimer);
      delete anyWindow.loadTimer;
    }
    
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  }
};

// 确保 DOM 加载完成后再执行
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderApp();
} else {
  document.addEventListener('DOMContentLoaded', renderApp);
}
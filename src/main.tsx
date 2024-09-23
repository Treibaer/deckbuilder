import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import setFavicon from './utils/faviconSwitcher.ts';

setFavicon();

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>
  ,
)

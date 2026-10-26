import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AiKeyButton } from './AiKeyButton';
import { installApiShim } from './apiShim';
import './index.css';

// Static hosts (GitHub Pages) have no /api server: the shim answers in-browser.
// On a Node host, requests still go to server.ts untouched.
installApiShim();

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <AiKeyButton />
  </>
);

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import init from './init.jsx';

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  const vdom = await init();
  
  root.render(
    <StrictMode>
      {vdom}
    </StrictMode>
  );
};

app();
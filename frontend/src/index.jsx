import ReactDOM from 'react-dom/client';
import init from './init.jsx';

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  // Вызываем init и рендерим полученный VDOM
  const vdom = await init();
  root.render(vdom);
};

app();
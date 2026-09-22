// ВАЖНО: импортируем без расширения .js / .jsx
import init from './init'; 

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  const vdom = await init();
  root.render(vdom);
};

app();
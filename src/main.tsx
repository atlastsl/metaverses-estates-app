import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {Provider} from 'react-redux';
import './helpers/intl/i18n.ts';
import './assets/styles/main.css';
import './assets/styles/app.scss';
import store from "./app/pages/store.ts";

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)

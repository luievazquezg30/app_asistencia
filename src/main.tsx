import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import { initStorage } from './storages/Storage';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

defineCustomElements(window);

initStorage().then(() => {

    ReactDOM.createRoot(document.getElementById('root')!).render(

        <React.StrictMode>

            <App />

        </React.StrictMode>

    );

});
import { IonApp } from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';

import AppRoutes from './routes/AppRoutes';

/* Core CSS */

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

const App = () => {

    return (

        <IonApp>

            <IonReactRouter>

                <AppRoutes/>

            </IonReactRouter>

        </IonApp>

    );

}

export default App;
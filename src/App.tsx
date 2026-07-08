import { IonApp } from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';

import AppRoutes from './routes/AppRoutes';

/* Core CSS */

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import AuthProvider from './context/AuthProvider';

const App = () => {

    return (
      <IonApp>

          <AuthProvider>

              <IonReactRouter>

                  <AppRoutes/>

              </IonReactRouter>

          </AuthProvider>

      </IonApp>

    );

}

export default App;
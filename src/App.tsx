import { useEffect } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { SplashScreen } from '@capacitor/splash-screen'; // Importa el plugin
import AppRoutes from './routes/AppRoutes';
import AuthProvider from './context/AuthProvider';

/* Core CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

setupIonicReact();

const App = () => {

  useEffect(() => {
    const initApp = async () => {
      await SplashScreen.hide();
    };

    initApp();
  }, []);

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
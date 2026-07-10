import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'app-asistencia',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 10000,
      launchAutoHide: true,
      backgroundColor: "#cc3737",
      androidSplashResourceName: "splash",
      iosSpinnerStyle: "small",
      spinnerColor: "#1701a9",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
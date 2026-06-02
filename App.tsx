// App.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LogBox } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';

// Silence all unnecessary React Native developer warning banners
LogBox.ignoreAllLogs();

enableScreens();
const qc = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={qc}>
        <AppNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

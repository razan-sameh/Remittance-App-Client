// App.tsx
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import React from 'react';
import AppNavigator from './src/navigator/AppNavigator';
// export const serverURL = 'http://10.0.2.2:3000'; // Android emulators
export const serverURL = 'http://192.168.1.6:3000'; // physical device

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

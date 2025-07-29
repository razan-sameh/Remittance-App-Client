import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

const messaging = getMessaging();

setBackgroundMessageHandler(messaging, async remoteMessage => {
    console.log('📬 Background message received:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

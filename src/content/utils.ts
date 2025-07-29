import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

export const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
                'Camera Permission Required',
                'Please enable camera permission from settings to use this feature.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
        } else {
            Alert.alert('Permission Denied', 'Camera access is required to continue.');
        }
        return false;
    }
    return true; // iOS automatically handles this with `Info.plist`
};

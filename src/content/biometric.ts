import { Alert } from 'react-native';
import * as Keychain from 'react-native-keychain';

// Function to check if biometric authentication is supported
const isBiometrySupported = async () => {
    try {
        const biometryType = await Keychain.getSupportedBiometryType();
        console.log('getSupportedBiometryType', biometryType);
        return !!biometryType;
    } catch (error: any) {
        console.log('Error checking biometry support:', error.message);
        Alert.alert('Error', error.message);
        return false;
    }
};

// Function to save credentials with biometric protection
const saveCredentialsWithBiometry = async (username: string, password: string) => {
    try {
        await Keychain.setGenericPassword(username, password, {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        });
        console.log('Credentials saved successfully with biometry protection in keychain');
    } catch (error: any) {
        console.log('Error saving credentials:', error.message);
        if (error.name === 'BiometryEnrollmentCancel') {
            console.log('Biometric enrollment canceled by the user.');
            Alert.alert('Cancelled', 'Biometric enrollment canceled by the user.');
        } else {
            console.log('Unknown error:', error);
            Alert.alert('Error', error.message || 'Unknown error occurred.');
        }
    }
};

// Function to verify biometric auth only (no saving credentials)
export const verifyBiometric = async () => {
    try {
        const credentials = await Keychain.getGenericPassword({
            authenticationPrompt: {
                title: 'Authenticate to proceed with sending money',
            },
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        });

        return !!credentials;
    } catch (error: any) {
        console.log('Biometric verification failed:', error.message);
        Alert.alert('Biometric Failed', 'Could not verify identity.');
        return false;
    }
};

// Function to retrieve credentials with biometric authentication
const getCredentialsWithBiometry = async () => {
    try {
        const credentials = await Keychain.getGenericPassword({
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        });
        return credentials;
    } catch (error: any) {
        console.log('Error retrieving credentials:', error.message);
        Alert.alert('Error', error.message);
        if (error.message.includes('authentication failed')) {
            console.log('Biometric authentication failed.');
            Alert.alert('Authentication Failed', 'Biometric authentication failed.');
        } else {
            console.log('Unknown error:', error);
            Alert.alert('Error', error.message || 'Unknown error occurred.');
        }
        return null;
    }
};

// Example usage
export default async function callBiometric(): Promise<boolean> {
    const biometrySupported = await isBiometrySupported();

    if (biometrySupported) {
        // Save credentials with biometric protection
        await saveCredentialsWithBiometry('username', 'password');

        // Retrieve credentials with biometric authentication
        const credentials = await getCredentialsWithBiometry();

        if (!credentials) {
            console.log('Biometric authentication failed or credentials not found.');
            Alert.alert('Failed', 'Biometric authentication failed or credentials not found.');
            return false;
        }
        return true;
    } else {
        console.log('Biometry not supported on this device.');
        Alert.alert('Not Supported', 'Biometry not supported on this device.');
        return false;
    }
};


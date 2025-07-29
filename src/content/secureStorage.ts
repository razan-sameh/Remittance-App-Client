// content/secureStorage.ts
import EncryptedStorage from 'react-native-encrypted-storage';

export const saveEncryptedKyc = async (data: any) => {
    try {
        await EncryptedStorage.setItem('kyc_data', JSON.stringify(data));
    } catch (error) {
        console.error('🔐 Failed to encrypt KYC data:', error);
    }
};

export const loadEncryptedKyc = async () => {
    try {
        const json = await EncryptedStorage.getItem('kyc_data');
        return json ? JSON.parse(json) : null;
    } catch (error) {
        console.error('🔓 Failed to load encrypted KYC data:', error);
        return null;
    }
};

export const clearEncryptedKyc = async () => {
    await EncryptedStorage.removeItem('kyc_data');
};

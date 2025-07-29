import AsyncStorage from "@react-native-async-storage/async-storage";
import { typKYC } from "./type";

export const getKycData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('kycData');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Failed to load KYC data', e);
        return null;
    }
};

export const setKycData = async (data: typKYC) => {
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem("kycData", jsonValue);
    } catch (e) {
        console.error("Failed to save KYC data", e);
    }
};
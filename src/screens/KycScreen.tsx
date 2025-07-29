import React, { useState } from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    Alert,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { serverURL } from '../../App';
import { requestCameraPermission } from '../content/utils';
import { setKycData } from '../content/asyncStorage';
import NetInfo from '@react-native-community/netinfo';

type KycFormData = {
    fullName: string;
    address: string;
    phone: string;
};

export default function KycScreen({ navigation }: any) {
    const { control, handleSubmit, formState: { errors } } = useForm<KycFormData>();
    const [nationalId, setnationalId] = useState<any>(null);
    const [selfiePhoto, setSelfiePhoto] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const capturePhoto = async (type: 'id' | 'selfie') => {
        const permissionGranted = await requestCameraPermission(); // wait fully for this to complete

        if (!permissionGranted) {
            // No alert here! Let `requestCameraPermission` handle the alert itself
            return;
        }

        const result = await launchCamera({
            mediaType: 'photo',
            cameraType: type === 'selfie' ? 'front' : 'back',
        });

        if (result.assets?.length) {
            type === 'id' ? setnationalId(result.assets[0]) : setSelfiePhoto(result.assets[0]);
        }
    };


    const onSubmit = async (data: KycFormData) => {
        if (!nationalId || !selfiePhoto) {
            Alert.alert("Please capture both ID and selfie photos");
            return;
        }

        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
            Alert.alert("No Internet", "Please connect to the internet to submit your KYC data.");
            return;
        }
        setIsSubmitting(true); // 🔄 Start loading

        const formData = new FormData();
        formData.append('fullName', data.fullName);
        formData.append('address', data.address);
        formData.append('phone', data.phone);
        formData.append('nationalId', {
            uri: nationalId.uri,
            name: nationalId.fileName || 'id.jpg',
            type: nationalId.type || 'image/jpeg',
        });
        formData.append('selfiePhoto', {
            uri: selfiePhoto.uri,
            name: selfiePhoto.fileName || 'selfie.jpg',
            type: selfiePhoto.type || 'image/jpeg',
        });

        try {
            await axios.post(`${serverURL}/api/kyc/submit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await setKycData({
                fullName: data.fullName,
                address: data.address,
                phone: data.phone,
                nationalId,
                selfiePhoto,
            });
            Alert.alert("Submitted", "Your KYC data is pending review", [
                { text: "OK", onPress: () => navigation.replace("VerificationSuccess") }
            ]);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to submit KYC data");
        } finally {
            setIsSubmitting(false); // ✅ Stop loading
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Verify Your Identity</Text>

            <Controller
                control={control}
                name="fullName"
                rules={{ required: 'Full name is required' }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />
            {errors.fullName && <Text style={styles.error}>{errors.fullName.message}</Text>}

            <Controller
                control={control}
                name="address"
                rules={{ required: 'Address is required' }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />
            {errors.address && <Text style={styles.error}>{errors.address.message}</Text>}

            <Controller
                control={control}
                name="phone"
                rules={{
                    required: 'Phone number is required',
                    pattern: {
                        value: /^\+?[1-9]\d{1,14}$/, // E.164 format
                        message: 'Invalid phone number (e.g. +201234567890)',
                    },
                }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />
            {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

            <TouchableOpacity style={styles.captureButton} onPress={() => capturePhoto('id')}>
                <Text style={styles.captureButtonText}>Capture National ID</Text>
            </TouchableOpacity>

            {nationalId && (
                <Image source={{ uri: nationalId.uri }} style={styles.image} />
            )}

            <TouchableOpacity style={styles.captureButton} onPress={() => capturePhoto('selfie')}>
                <Text style={styles.captureButtonText}>Capture Selfie</Text>
            </TouchableOpacity>
            {selfiePhoto && (
                <Image source={{ uri: selfiePhoto.uri }} style={styles.image} />
            )}

            <TouchableOpacity
                style={[styles.button, isSubmitting && { opacity: 0.6 }]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Verify Identity</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#8fbc8f',
        textAlign: 'center',
        marginBottom: 24,
    },
    section: {
        marginTop: 16,
        fontWeight: '600',
        fontSize: 16,
        color: '#333',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 10,
        marginTop: 8,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    link: {
        color: '#007bff',
        marginTop: 8,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#8fbc8f', // Purple
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    captureButton: {
        borderWidth: 1,
        borderColor: '#8fbc8f',
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },

    captureButtonText: {
        color: '#8fbc8f',
        fontWeight: 'bold',
        fontSize: 16,
    },

});

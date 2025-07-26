import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { serverURL } from '../../App';

export default function KycScreen() {
    const [photo, setPhoto] = useState<any>(null);

    const handleCapture = async () => {
        const result = await launchCamera({ mediaType: 'photo' });
        if (result.assets?.length) {
            setPhoto(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        if (!photo) return Alert.alert("Please capture a photo first");

        const formData = new FormData();
        formData.append('kycImage', {
            uri: photo.uri,
            name: photo.fileName || 'kyc.jpg',
            type: photo.type || 'image/jpeg',
        });

        try {
            const res = await axios.post(`${serverURL}/api/kyc/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert("Success", res.data.message);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to upload image");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Button title="Capture Photo" onPress={handleCapture} />
            {photo && <Image source={{ uri: photo.uri }} style={{ width: 100, height: 100, marginTop: 10 }} />}
            <Button title="Upload Photo" onPress={handleSubmit} />
        </View>
    );
}

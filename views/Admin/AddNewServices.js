import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';

const AddNewServices = ({ navigation }) => {
    const [service, setService] = useState('');
    const [prices, setPrices] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [creatorName, setCreatorName] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth().currentUser;
            if (currentUser) {
                const userDoc = await firestore().collection('user').doc(currentUser.uid).get();
                if (userDoc.exists) {
                    setCreatorName(userDoc.data().name);
                }
            }
        };
        fetchUserData();
    }, []);

    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('Hủy chọn');
            } else if (response.errorMessage) {
                console.log('Lỗi ImagePicker: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];
                setImageUri(selectedImage.uri);
            }
        });
    };

    const uploadImage = async (uri) => {
        try {
            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
            const storageRef = storage().ref(`services/${filename}`);
            await storageRef.putFile(uploadUri);
            return await storageRef.getDownloadURL();
        } catch (error) {
            console.error('Lỗi thêm ảnh:', error);
            throw error;
        }
    };

    const addService = async () => {
        if (service.trim() === '' || prices.trim() === '') {
            Alert.alert('Lỗi', 'Vui lòng điền vào tất cả các trường hợp');
            return;
        }

        let imageUrl = '';
        if (imageUri) {
            try {
                imageUrl = await uploadImage(imageUri);
            } catch (error) {
                console.error('Lỗi thêm ảnh:', error);
                Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tải hình ảnh lên');
                return;
            }
        }

        try {
            await firestore()
                .collection('services')
                .add({
                    service: service.trim(),
                    prices: prices.trim(),
                    imageUrl,
                    creatorName,
                });

            Alert.alert('Thành công', 'Đã thêm dịch vụ thành công');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Lỗi:', error);
            Alert.alert('Error', 'Thêm dịch vụ thất bại');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                {imageUri && (
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    )}
                <TouchableOpacity onPress={pickImage} >
                    <Text style={{ fontSize: 15, color: '#6600FF', textAlign: 'center',marginTop:10,fontWeight:'bold'}}>Chọn ảnh</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold',color:"#FF9966" }}>Tên dịch vụ</Text>
                <TextInput
                    placeholder="Điền tên dịch vụ"
                    onChangeText={setService}
                    value={service}
                    style={styles.input}
                />
                <Text style={{ fontWeight: 'bold',color:"#FF9966" }}>Giá</Text>
                <TextInput
                    placeholder="0"
                    onChangeText={setPrices}
                    value={prices}
                    style={styles.input}
                    keyboardType="number-pad"
                />

                

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={addService} style={styles.button}>
                        <Text style={{ fontSize: 20, color: '#FFFF99' }}>Thêm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    topContainer: {
        width: '100%',
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
    },
    backButton: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    bottomContainer: {
        width: '90%',
        marginTop: 30,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: '#ced4da',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#e9ecef',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#00CCCC',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    buttonsContainer: {
        marginTop: 10,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ced4da',
        backgroundColor: '#e9ecef',
    },
    textStyle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    imagePickerText: {
        fontSize: 15,
        color: '#007bff',
        textAlign: 'center',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
});


export default AddNewServices;

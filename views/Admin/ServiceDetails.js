import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker'; 
import firestore from '@react-native-firebase/firestore';

const ServiceDetails = ({ route, navigation }) => {
    const { service } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [updatedServiceName, setUpdatedServiceName] = useState(service.service);
    const [updatedPrices, setUpdatedPrices] = useState(service.prices);
    const [imageUrl, setImageUrl] = useState(service.imageUrl);
    const [creatorName, setCreatorName] = useState('');

    useEffect(() => {
        const fetchCreatorName = async () => {
            const serviceDoc = await firestore().collection('services').doc(service.id).get();
            if (serviceDoc.exists) {
                const serviceData = serviceDoc.data();
                setCreatorName(serviceData.creatorName || 'N/A');
            }
        };

        fetchCreatorName();
    }, [service.id]);

    const handleChooseImage = () => {
        ImagePicker.openPicker({}).then(image => {
            const source = { uri: image.path };
            setImageUrl(source.uri);
        }).catch(error => {
            console.log(error);
        });
    };

    const handleUpdate = async () => {
        if (updatedServiceName.trim() === '' || updatedPrices.trim() === '') {
            Alert.alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            const querySnapshot = await firestore()
                .collection('services')
                .where('service', '==', service.service)
                .get();

            querySnapshot.forEach(async documentSnapshot => {
                await documentSnapshot.ref.update({
                    service: updatedServiceName.trim(),
                    prices: updatedPrices.trim(),
                    imageUrl: imageUrl,
                });
            });

            console.log('Service updated successfully');
            Alert.alert('Thông báo', 'Bạn đã chỉnh sửa thành công');
            setModalVisible(false);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error updating service:', error);
            Alert.alert('Thông báo', 'Chỉnh sửa không thành công');
        }
    };

    const handleDelete = async () => {
        try {
            const querySnapshot = await firestore()
                .collection('services')
                .where('service', '==', service.service)
                .get();

            querySnapshot.forEach(async documentSnapshot => {
                await documentSnapshot.ref.delete();
            });

            console.log('Service deleted successfully');
            Alert.alert('Thông báo', 'Bạn đã xoá thành công');
            setModalVisible(false);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error deleting service:', error);
            Alert.alert('Thông báo', 'Xoá không thành công');
        }
    };
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
    };
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setIsEditMode(true);
                    setModalVisible(true);
                }} style={styles.editButton}>
                    <MaterialCommunityIcons name="progress-pencil" size={34} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.containerWrapper}>
                {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                )}
                <TouchableOpacity onPress={handleChooseImage} style={styles.chooseImageButton}>
                    <Text style={styles.chooseImageText}>Chọn ảnh</Text>
                </TouchableOpacity>
                <View style={styles.section}>
                    <Text style={styles.label}>Tên dịch vụ:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={updatedServiceName}
                            onChangeText={setUpdatedServiceName}
                            placeholder="Tên dịch vụ"
                            editable={isEditMode}
                        />
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Giá:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={formatPrice(updatedPrices)}
                            onChangeText={setUpdatedPrices}
                            placeholder="Giá"
                            keyboardType="numeric"
                            editable={isEditMode}
                        />
                    </View>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={handleUpdate}>
                            <Text style={styles.modalButton}>Thay đổi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete}>
                            <Text style={[styles.modalButton, styles.deleteButton]}>Xoá</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButton}>Huỷ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        padding: 20,
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        justifyContent: 'center',
    },
    editButton: {
        justifyContent: 'center',
    },
    containerWrapper: {
        borderWidth: 1,
        borderColor: '#00CCCC',
        borderRadius: 15,
        padding: 10, 
        backgroundColor:"#00CCCC"
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10, 
    },
    label: {
        fontWeight: 'bold',
        fontSize:18,
        marginBottom: 5,
        width: 100, 
        color:'#FF9966'
    },
    inputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 5,
    },
    input: {
        padding: 10,
        fontWeight:"bold",
        fontSize:18,
        color:'#555555',
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    chooseImageButton: {
        alignItems: 'center',
        marginVertical: 10,
    },
    chooseImageText: {
        fontWeight:'bold',
        fontSize:20,
        color: '#FFFF99',
        // textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalButton: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    deleteButton: {
        color: 'red',
    },
});

export default ServiceDetails;
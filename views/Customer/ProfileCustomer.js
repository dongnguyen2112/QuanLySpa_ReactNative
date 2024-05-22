import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProfileCustomer = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth().currentUser;

                if (user) {
                    const userQuerySnapshot = await firestore()
                        .collection('user')
                        .where('email', '==', user.email)
                        .get();

                    if (!userQuerySnapshot.empty) {
                        const userData = userQuerySnapshot.docs[0].data();
                        setUserData(userData);
                        setName(userData.name);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateProfile = async () => {
        if (!name.trim()) {
            Alert.alert('Lỗi', 'Không được để trống tên người dùng.');
            return;
        }

        setUpdating(true);
        try {
            const user = auth().currentUser;

            if (user) {
                const userDoc = await firestore()
                    .collection('user')
                    .doc(user.uid);

                await userDoc.update({
                    name,
                });

                Alert.alert('Thành công', 'Tên người dùng đã được cập nhật!');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin tài khoản.');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                <Icon name="arrow-left" size={25} color="black" />
            </TouchableOpacity>

            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <Text style={styles.title}>Thông tin tài khoản</Text>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Email: {userData?.email}</Text>
                            <Text style={styles.text}>Quyền: {userData?.role}</Text>

                            <Text style={styles.inputLabel}>Tên người dùng</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleUpdateProfile}
                            style={styles.button}
                            disabled={updating}
                        >
                            {updating ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Cập nhật</Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
        margin: 20,
    },
    iconContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FF9966',
    },
    textContainer: {
        borderWidth: 3,
        borderColor: '#00CCCC',
        borderRadius: 10,
        padding: 10,
        width: '100%',
    },
    text: {
        fontSize: 18,
        color: '#FF9966',
        marginBottom: 10,
    },
    inputLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FF9966',
        marginBottom: 8,
        marginTop: 20,
    },
    input: {
        height: 50,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#FF9966',
        borderWidth: 1,
        borderColor: '#00CCCC',
        marginBottom: 10,
        width: '100%',
    },
    button: {
        backgroundColor: '#00CCCC',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFF99',
    },
});

export default ProfileCustomer;

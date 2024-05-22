import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from './Header';

const Customer = ({ navigation }) => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const snapshot = await firestore().collection('bookings').get();
                const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBookings(bookingsData);
            } catch (error) {
                console.error('Lỗi ', error);
            }
        };

        fetchBookings();
    }, []);

    const handleDelete = async (item) => {
        try {
            await firestore().collection('bookings').doc(item.id).delete();
            setBookings(prevBookings => prevBookings.filter(booking => booking.id !== item.id));
            Alert.alert('Thành công', 'Xóa lịch đặt khách hàng thành công!');
        } catch (error) {
            console.error('Lỗi xóa: ', error);
            Alert.alert('Lỗi', 'Xóa không thành công!');
        }
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.list}>
                <Text style={styles.title}>LỊCH ĐẶT KHÁCH HÀNG</Text>
                <FlatList
                    data={bookings}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <Text style={styles.serialNumber}>{index + 1}.</Text>
                            <View style={styles.itemContent}>
                                <View style={{ justifyContent: 'center', alignContent: 'center' }}>
                                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                                </View>
                                <View style={{ marginLeft: 15, flex: 1 }}>
                                    <Text style={styles.bookingText}>Tên dịch vụ: {item.serviceName}</Text>
                                    <Text style={styles.bookingText}>Giá: {formatPrice(item.prices)}</Text>
                                    <Text style={styles.bookingText}>Ngày hẹn: {item.bookingDate}</Text>
                                    <Text style={styles.bookingText}>Thời gian: {item.bookingTime}</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
                                    <MaterialCommunityIcons name="delete-empty-outline" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 20,
        color:'#FF9966',
    },
    list: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
        borderRadius: 30,
        backgroundColor: '#00CCCC',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    serialNumber: {
        marginRight: 10,
        fontWeight: 'bold',
    },
    itemContent: {
        flexDirection: 'row',
        flex: 1,
    },
    bookingText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#FF9966',
    },
    image: {
        width: 60,
        height: 60,
        marginBottom: 10,
        borderRadius: 10,
    },
    deleteButton: {
        marginTop:30,
        backgroundColor: 'red',
        height:50,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5,
    },
});

export default Customer;

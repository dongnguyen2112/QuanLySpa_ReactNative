import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const Booking = ({ route }) => {
    const navigation = useNavigation();
    const { serviceName, prices, imageUrl } = route.params;
    const [bookingDate, setBookingDate] = useState(new Date());
    const [bookingTime, setBookingTime] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSaveBooking = async () => {
        if (!bookingTime.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập thời gian');
            return;
        }

        try {
            const formattedDate = formatBookingDate(bookingDate);
            await firestore().collection('bookings').add({
                serviceName,
                prices,
                imageUrl,
                bookingDate: formattedDate,
                bookingTime,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            Alert.alert('Thông báo', 'Đặt lịch thành công');
            navigation.navigate('HomeCustomer');
        } catch (error) {
            Alert.alert('Error', 'Đặt lịch thất bại');
        }
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
    };

    const formatBookingDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}-${month}-${year}`;
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || bookingDate;
        setShowDatePicker(false);
        setBookingDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
            <Text style={styles.text}>Tên dịch vụ: {serviceName}</Text>
            <Text style={styles.text}>Giá tiền: {formatPrice(prices)}</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Chọn ngày"
                        value={formatBookingDate(bookingDate)} 
                        editable={false} 
                    />
                    <Icon name="calendar" size={24} color="#00796b" style={styles.icon} />
                </View>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={bookingDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Nhập thời gian"
                value={bookingTime}
                onChangeText={setBookingTime}
            />

            <TouchableOpacity style={styles.button} onPress={handleSaveBooking}>
                <Text style={styles.buttonText}>Đặt Lịch</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        marginTop:10,
        color:"#FF9966",
        fontSize: 20,
        fontWeight:'bold'
    },
    image: {
        width: 300,
        height: 200,
        marginTop: 20,
        borderRadius: 10,
    },
    datePickerButton: {
        padding: 5,
        width: '95%',
        marginTop: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        fontSize: 16,
        color: '#00796b',
        flex: 1,
    },
    icon: {
        marginLeft: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#00796b',
        borderRadius: 10,
        marginTop: 20,
        fontWeight:'bold'
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    button: {
        backgroundColor: '#00CCCC',
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: 200,
    },
    buttonText: {
        color: '#FFFF99',
        fontSize: 16, 
        fontWeight: 'bold',
    },
});

export default Booking;

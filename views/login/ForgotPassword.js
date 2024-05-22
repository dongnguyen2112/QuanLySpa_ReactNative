import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSendEmail = () => {
    if (!email.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập địa chỉ email.');
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Thành công', 'Đã gửi link reset password đến email của bạn!');
        setEmail(''); // Reset trường email sau khi gửi thành công
        navigation.goBack(); // Quay lại màn hình đăng nhập sau khi gửi email
      })
      .catch((error) => Alert.alert('Lỗi', error.message));
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Quên Mật Khẩu</Text>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            theme={{ colors: { primary: '#00CCCC' } }}
          />
          <Button mode="contained" onPress={handleSendEmail} style={styles.button}>
            <Text style={styles.buttonText}>Gửi Email</Text>
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f7f8fa',
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FF9966',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
    
  },
  button: {
    marginTop: 10,
    backgroundColor: '#00CCCC',
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFF99',
    fontWeight: 'bold',
  },
});

export default ForgotPassword;

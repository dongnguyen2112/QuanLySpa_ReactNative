import React from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Settings = ({ navigation }) => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>
                Cài đặt
            </Text>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>Tài khoản</Text>
                </View>
                <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('ChangePassword')}>
                    <Icon
                        name='lock'
                        style={styles.icon}
                        size={20} color={'#4A90E2'}
                    />
                    <Text style={styles.text}>Đổi mật khẩu</Text>
                    <Icon
                        name='chevron-right'
                        style={styles.chevron}
                        size={16} color={'#B0B0B0'}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('Login')}>
                    <Icon
                        name='sign-out'
                        style={styles.icon}
                        size={20} color={'#4A90E2'}
                    />
                    <Text style={styles.text}>Đăng xuất</Text>
                    <Icon
                        name='chevron-right'
                        style={styles.chevron}
                        size={16} color={'#B0B0B0'}
                    />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#F5F7FA',
    },
    title: {
        color: '#FF9966',
        fontSize: 28,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        backgroundColor: '#E4E8F1',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    sectionHeaderText: {
        fontSize: 18,
        color: '#FF9966',
        fontWeight: 'bold',
    },
    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E8F1',
    },
    text: {
        flex: 1,
        color: 'black',
        fontSize: 16,
        paddingLeft: 10,
        fontWeight: 'bold'
    },
    icon: {
        marginRight: 10,
    },
    chevron: {
        marginLeft: 'auto',
    },
});

export default Settings;

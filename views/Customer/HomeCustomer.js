import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileCustomer from './ProfileCustomer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Details from './Details';
import HeaderCustomer from './HeaderCustomer';

const Stack = createStackNavigator();

const HomeScreenCustomer = ({ navigation }) => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesSnapshot = await firestore().collection('services').get();
                const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(servicesData);
                setFilteredServices(servicesData);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const userQuerySnapshot = await firestore().collection('user').get();
                userQuerySnapshot.forEach(doc => {
                    const user = doc.data();
                    setUsername(user.user);
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchServices();
        fetchUserData();

        const unsubscribe = navigation.addListener('focus', () => {
            fetchServices();
            fetchUserData();
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = services.filter(service =>
                service.service.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredServices(filtered);
        } else {
            setFilteredServices(services);
        }
    }, [searchQuery, services]);

    const handleServicePress = (service) => {
        navigation.navigate('Details', { service });
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleServicePress(item)}>
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{`${index + 1}. ${item.service}`}</Text>
                <Text style={styles.itemText}>{formatPrice(item.prices)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <HeaderCustomer navigation={navigation} />

            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Tìm kiếm ..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    
                />
                <MaterialCommunityIcons name="clipboard-text-search-outline" size={25} color="black" style={styles.icon} />
            </View>


            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>DANH SÁCH DỊCH VỤ</Text>
                </View>

                <FlatList
                    data={filteredServices}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    style={styles.list}
                />
            </View>
        </View>
    );
};

const HomeCustomer = ({ route }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="HomeCustomer"
                component={HomeScreenCustomer}
                initialParams={route.params}
            />
            <Stack.Screen name="ProfileCustomer" component={ProfileCustomer} />
            <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    upperView: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FFC0CB',
        alignItems: 'center',
    },
    searchBarContainer: {
        margin:30,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#00CCCC',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
       
    },
    searchBar: {
        flex:1,
        height: 40,
        borderColor: '#00CCCC',
        borderWidth: 3,
        borderRadius: 30,
        margin: 10,
        paddingLeft: 10,
    },
    icon: {
        marginLeft: 10,
    },
    contentContainer: {
        flex: 1,
        padding: 15,
    },
    card: {
        backgroundColor: '#00CCCC',
        borderRadius: 30,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemText: {
        fontSize: 19,
        color:"#FF9966",
        fontWeight:'bold'
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
        fontSize: 30,
        textAlign: 'center',
        color: '#FF9966',
    },
    addButton: {
        backgroundColor: 'pink',
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
    },
    username: {
        marginRight: 'auto',
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconContainer: {
        padding: 5,
    },
    list: {
        paddingTop: 20,
        
    },
});

export default HomeCustomer;
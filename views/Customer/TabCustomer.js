import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeCustomer from './HomeCustomer';
import AppoitmentCustomer from './AppoitmentCustomer';
import SettingsCustomer from './SettingsCustomer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from 'react-native';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabCustomer = ({ navigation, route }) => {
    const userName = route.params?.userName || "Default Name";

    return (
        <Tab.Navigator  screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#00CCCC',  
            tabBarInactiveTintColor: '#888',
            
        }}>
            <Tab.Screen
                name={"Trang chủ"}
                component={HomeCustomer}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home-account" size={35} color={color} />
                    ),

                }}
            />
            <Tab.Screen
                name="Dịch vụ"
                component={AppoitmentCustomer}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cash-multiple" size={35} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Cài đặt"
                component={SettingsCustomer}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-cog" size={35} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

// const HomeStackScreen = () => (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="HomeCustomer" component={HomeCustomer} />
//     </Stack.Navigator>
// );

// const TransactionStackScreen = () => (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="AppoitmentCustomer" component={AppoitmentCustomer} />
//     </Stack.Navigator>
// );

// const CustomerStackScreen = () => (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="SettingsCustomer" component={SettingsCustomer} />
//     </Stack.Navigator>
// );


export default TabCustomer;
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './Home';
import TransactionScreen from './Transaction';
import CustomerScreen from './Customer';
import SettingsScreen from './Settings';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from 'react-native';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = ({ navigation, route }) => {
    const userName = route.params?.userName || "Default Name";

    return (
        <Tab.Navigator  screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#00CCCC',  
            tabBarInactiveTintColor: '#888',
            
        }}>
            <Tab.Screen
                name={"Trang chủ"}
                component={HomeStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home-account" size={35} color={color} />
                    ),

                }}
            />
           
            <Tab.Screen
                name="Dịch vụ"
                component={CustomerStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cash-multiple" size={35} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Cài đặt"
                component={SettingsStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-cog" size={35} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const HomeStackScreen = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
);

const TransactionStackScreen = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Transaction" component={TransactionScreen} />
    </Stack.Navigator>
);

const CustomerStackScreen = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Customer" component={CustomerScreen} />
    </Stack.Navigator>
);

const SettingsStackScreen = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
);

export default TabNavigator;
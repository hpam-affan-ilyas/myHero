
import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, Platform,Alert, Dimensions, View,RefreshControl, SafeAreaView, ActivityIndicator, Modal,StatusBar,BackHandler } from 'react-native';
import IconBack from 'react-native-vector-icons/Feather';
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import SupportScreen from './SupportPage';
import ProductScreen from './ProductPage';
import ActivityScreen from './ActivityPage';
import PortoScreen from './PortoPage';
import HomeScreen from './HomePage';

var styles = require('../utils/Styles');

const HomeStack = createStackNavigator(
    {
        HomeScreen: {
            screen: HomeScreen,
            navigationOptions: ({ navigation }) => {
              let headerTitle = (<View style={styles.header}>
                    <View style={styles.headerLeft}></View>
                    <View style={styles.headerCenter}><Image source={require('../img/myheroGif.gif')} style={{width:150,height:35,resizeMode:"contain"}}/></View>
                    <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                        <Image source={require('../img/user.png')} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                   </View>);
              let headerLeft = null;
              let headerRight = null;
              let headerStyle = styles.headerStyle;
              return { headerTitle, headerLeft, headerStyle,headerRight};
              
            },

        },
    },
    {
        initialRouteName:'HomeScreen'
    }
);
const ProductStack = createStackNavigator(
    {
        ProductScreen: {
            screen: ProductScreen,
            navigationOptions: ({ navigation }) => {
                let headerTitle = (<View style={styles.header}>
                      <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate('Home')} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                      <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>PRODUK</Text></View>
                      <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                          <Image source={require('../img/user.png')} style={{ width: 25, height: 25 }} />
                      </TouchableOpacity>
                      </View>);
                let headerLeft = null;
                let headerRight = null;
                let headerStyle = styles.headerStyle;
                return { headerTitle, headerLeft, headerStyle,headerRight};
                }
        },
    },
    {
        initialRouteName:'ProductScreen'
    }
);
const PortoStack = createStackNavigator(
    {
        PortfolioScreen: {
            screen: PortoScreen,
            navigationOptions: ({ navigation }) => {
                let headerTitle = (<View style={styles.header}>
                    <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate('Home')} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                    <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>PORTOFOLIO</Text></View>
                    <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                        <Image source={require('../img/user.png')} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                    </View>);
                let headerLeft = null;
                let headerRight = null;
                let headerStyle = styles.headerStyle;
                return { headerTitle, headerLeft, headerStyle,headerRight};
            }
        },
    },
    {
        initialRouteName:'PortfolioScreen'
    }
);
const ActivityStack = createStackNavigator(
    {
        ActivityScreen: {
            screen: ActivityScreen,
            navigationOptions: ({ navigation }) => {
                let headerTitle = (<View style={styles.header}>
                    <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate('Home')} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                    <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>AKTIVITAS</Text></View>
                    <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                        <Image source={require('../img/user.png')} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                    </View>);
                let headerLeft = null;
                let headerRight = null;
                let headerStyle = styles.headerStyle;
                return { headerTitle, headerLeft, headerStyle,headerRight};
            }
        },
    },
    {
        initialRouteName:'ActivityScreen'
    }
);
const SupportStack = createStackNavigator(
    {
        Support: {
            screen: SupportScreen,
            navigationOptions: ({ navigation }) => {
                let headerTitle = (<View style={styles.header}>
                    <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate('Home')} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                    <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>BANTUAN</Text></View>
                    <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                        <Image source={require('../img/user.png')} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                    </View>);
                let headerLeft = null;
                let headerRight = null;
                let headerStyle = styles.headerStyle;
                return { headerTitle, headerLeft, headerStyle,headerRight};
            }
        },
    },
    {
        initialRouteName:'Support'
    }
);

const TabNavigator = createBottomTabNavigator(
    {
        Home: {
            screen: HomeStack,
            navigationOptions: {
                tabBarLabel: 'Beranda',
                tabBarIcon: ({ tintColor }) => (
                    <Image source={require('../img/home.png')} color={tintColor} style={styles.iconMenu} />
                ),
            },
        },
        Product: {
            screen: ProductStack,
            navigationOptions: {
                tabBarLabel: 'Produk',
                tabBarIcon: ({ tintColor }) => (
                    <Image source={require('../img/produk.png')} color={tintColor} style={styles.iconMenu} />
                ),
            },

        },
        Portfolio: {
            screen: PortoStack,
            navigationOptions: {
                tabBarLabel: 'Portofolio',
                tabBarIcon: ({ tintColor }) => (
                    <Image source={require('../img/porto.png')} color={tintColor} style={styles.iconMenu} />
                ),
            },
        },
        Activity: {
            screen: ActivityStack,
            navigationOptions: {
                tabBarLabel: 'Aktivitas',
                tabBarIcon: ({ tintColor }) => (
                    <Image source={require('../img/activity.png')} color={tintColor} style={styles.iconMenu} />
                ),
            },
        },
        Support: {
            screen: SupportStack,
            navigationOptions: {
                tabBarLabel: 'Bantuan',
                tabBarIcon: ({ tintColor, activeTintColor }) => (
                    <Image source={require('../img/support.png')} color={tintColor} style={styles.iconMenu} />
                ),
            },
        
        }
    },
    {
        initialRouteName: 'Home',
        activeColor: '#F44336',
        navigationOptions: {
            tabBarVisible: true
        },
        activeBackgroundColor: {

        },
        tabBarOptions: {
            activeTintColor: '#FFF',
            inactiveTintColor: '#7e7b7b',
            showIcon: true,
            style: styles.menuStyle,
            showLabel: true,
            labelStyle: {
                fontSize: 12,
                marginTop:5,
            }
        },
        
    }
);

export default createAppContainer(TabNavigator);




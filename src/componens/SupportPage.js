
import React, { Component } from 'react';
import { Image, TouchableOpacity, StatusBar, Text, TextInput, Animated, View, SafeAreaView, Alert, Linking, Modal, ActivityIndicator, RefreshControl, BackHandler } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeButton from "react-native-really-awesome-button";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import renderIf from './Renderif';
import UnAuth from './UnauthPage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Entypo';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');

export default class SupportPage extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(100);
        this.state = {
            backClickCount: 0,
            isToast: false,
            page: 'Support',
            isLoading: false,
            modalVisible: false,
            modalVisibleUnAuth: false,
            connection_Status: "",
            phoneNo: '',
            emailAdr: '',
            myToken: '',
            pesan: '',
            refreshing: false,
            isConnected: true
        }
    }
    Unauthorized() {
        this.setState({ isLoading: false, modalVisibleUnAuth: true })
        setTimeout(() => this.logout(), GLOBAL.timeOut);
    }
    logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Main');
    }
    _onRefresh() {
        this.setState({ refreshing: true });
        this._getToken().then(() => {
            this.setState({ refreshing: false })
        });
    }
    kirimPesan = () => {
        if (this.state.pesan.length == 0) {
            Alert.alert('Perhatian', 'Pesan tidak boleh kosong',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        } else {
            this.setState({ isLoading: true })
            fetch(GLOBAL.sendContact(), {
                method: 'POST',
                headers: {
                    'Accept': 'appication/json',
                    'Content-type': 'application/json',
                    'Authorization': this.state.myToken,
                },
                body: JSON.stringify({
                    pesan: this.state.pesan,
                })
            })
                .then((response) => {
                    this.setState({ isLoading: false })
                    if (response.status == '201') {
                        let res;
                        return response.json().then(obj => {
                            res = obj;
                            Alert.alert('Sukses', 'Pesan berhasil terkirim',
                                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                                { cancelable: false },
                            );
                        })
                    } else if (response.status == '401') {
                        this.Unauthorized()
                    } else {
                        Alert.alert('Perhatian', 'Pesan gagal terkirim, periksa jaringan internet Anda',
                            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                            { cancelable: false },
                        );
                    }
                })
        }

    }
    _getContact(token) {
        fetch(GLOBAL.getContact(), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token,
            },
        })
            .then((response) => {
                this.setState({ isLoading: false })
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        if (res.data.contact.no_telpon != null) {
                            this.setState({ phoneNo: res.data.contact.no_telpon })
                        }
                        if (res.data.contact.email != null) {
                            this.setState({
                                emailAdr: res.data.contact.email
                            })
                        }
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    // cek_koneksi(){
    //     NetInfo.isConnected.fetch().then(isConnected => {
    //         console.log('First, is ' + (isConnected ? 'online' : 'offline'));
    //       });
    //       function handleFirstConnectivityChange(isConnected) {
    //         console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
    //         NetInfo.isConnected.removeEventListener(
    //           'connectionChange',
    //           handleFirstConnectivityChange
    //         );
    //       }
    //       NetInfo.isConnected.addEventListener(
    //         'connectionChange',
    //         handleFirstConnectivityChange
    //       );
    // }
    _getToken = async () => {
        var aksesToken = await AsyncStorage.getItem('aksesToken');
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken })
            this._getContact(this.state.myToken);
        } else {
            this.Unauthorized()
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));
        return this._getToken();

    }
    componentWillUnmount() {
        this.backHandler.remove();
    }
    _spring() {
        this.setState({ backClickCount: 1 }, () => {
            Animated.sequence([
                Animated.spring(
                    this.springValue,
                    {
                        toValue: -.15,
                        friction: 5,
                        duration: 300,
                        useNativeDriver: true,
                    }
                ),
                Animated.timing(
                    this.springValue,
                    {
                        toValue: 100,
                        duration: 300,
                        useNativeDriver: true,
                    }
                ),

            ]).start(() => {
                this.setState({ backClickCount: 0 });
            });
        });

    }
    handleBackButton = () => {
        if (this.state.backClickCount < 1) {
            if (this.props.navigation.state.routeName == "HomeScreen") {
                this.setState({ isToast: true });
                setTimeout(() => this.setState({ isToast: false }), 500)
            }
            this.props.navigation.navigate('Home');
            this._spring()
        } else {
            this.setState({ isToast: false });
            BackHandler.exitApp()
        }
        return true;
    };
    render() {
        return (
            <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
                <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
                {renderIf(this.state.isToast == true)(
                    <View style={[styles.wrapper, { justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 2 }]}>
                        <View style={{ height: 100, width: "80%", borderWidth: 2, borderColor: "#dddddd", backgroundColor: '#eFeFeF', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                            <Text style={{ textAlign: 'center', color: '#000', fontSize: 16, fontWeight: '600' }}>Klik dua kali untuk keluar</Text>
                        </View>
                    </View>
                )}

                <View style={styles.topMenu}>
                    <TouchableOpacity style={styles.item2TopMenuActive} onPress={() => this.props.navigation.navigate('Support')}>
                        <Text style={styles.txtTopMenu}>KONTAK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item2TopMenu} onPress={() => this.props.navigation.navigate('Faq')}>
                        <Text style={styles.txtTopMenu}>FAQ</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }>
                    <View style={styles.containerMain}>

                        {
                            this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
                        }
                        <Text style={styles.txtMed}>Hubungi</Text>
                        <Text style={{ fontSize: 14, marginTop: 5, color: '#FFF', }}>Customer Service</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                            <Image source={require('../img/icon_copy.png')} style={{ width: 200, height: 75, resizeMode: 'cover' }} />
                            {/* <Text style={{ fontSize: 18, color: '#FFF', fontWeight: '600', flex: 1 }}>PT HENAN PUTIHRAI ASSET MANAGEMENT</Text> */}
                            {/* <Text style={{ fontSize: 30, color: '#FFF', fontWeight: '600', flex: 1 }}>MyHero</Text> */}
                        </View>
                        <View style={{ flex: 1, marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                <Icon name="old-phone" size={15} style={{ textAlign: "left", color: "#FFF", marginRight: 5 }} />
                                <Text style={styles.txtMed}>{this.state.phoneNo}</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'flex-end', flex: 1 }}>
                                    <AwesomeButton
                                        borderRadius={15}
                                        backgroundColor='#4F7942'
                                        backgroundShadow="#000"
                                        backgroundDarker="#45673a"
                                        height={40}
                                        width={GLOBAL.DEVICE_WIDTH * 0.35}
                                        onPress={() => { Linking.openURL('tel:' + this.state.phoneNo); }}
                                    >
                                        <Image source={require('./../img/btnLogin.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.35, height: 40, resizeMode: 'stretch' }} />
                                        <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>PANGGIL</Text>
                                    </AwesomeButton>
                                </View>
                            </View>

                        </View>
                        <View style={styles.whiteLine} />

                        <View style={styles.inputGroup}>
                            <View style={{ flexDirection: 'row', marginBottom: 10, justification: 'center', alignItems: 'center' }}>
                                <Icon name="mail" size={20} style={{ color: '#FFF', marginRight: 5 }} />
                                <Text style={styles.labelText}>{this.state.emailAdr}</Text>
                            </View>
                            <View style={styles.textInputContact}>
                                <TextInput placeholderTextColor="#000000" style={styles.textInput} keyboardType="default" multiline={true} onChangeText={(pesan) => this.setState({ pesan })} />
                            </View>
                            <View style={{ justifyContent: "flex-end", flex: 1, marginTop: 10, alignItems: "flex-end" }}>

                                <AwesomeButton
                                    borderRadius={15}
                                    backgroundColor='#4F7942'
                                    backgroundShadow="#000"
                                    backgroundDarker="#45673a"
                                    height={40}
                                    width={GLOBAL.DEVICE_WIDTH * 0.35}
                                    onPress={this.kirimPesan}
                                >
                                    <Image source={require('./../img/btnLogin.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.35, height: 40, resizeMode: 'stretch' }} />
                                    <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>KIRIM</Text>
                                </AwesomeButton>
                            </View>
                        </View>
                        
                    </View>
                    <View style={styles.boxBtnBottom}>
                            <Text style={styles.txtMed}>Terdaftar dan diawasi oleh</Text>
                            <Image source={require('../img/ojklogo.png')} style={{ width: 100, height: 30 }} resizeMode="stretch" />
                        </View>
                </ScrollView>

                {renderIf(this.state.modalVisibleUnAuth == true)(
                    <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
                )}
            </LinearGradient>
        );
    }
}

// const TabNavigator = createMaterialTopTabNavigator(
//     {
//         Contact: {
//             screen: ContactScreen,
//             navigationOptions: {
//                 tabBarLabel: 'Contact Us',
//             },
//         },
//         FaqSupport: {
//             screen: FaqSupport,
//             navigationOptions: {
//                 tabBarLabel: 'FAQ',
//             },
//         },
//     },
//     {
//         tabBarOptions: {
//             activeTintColor: '#FFF',
//             inactiveTintColor: '#dddddd',
//             showIcon: false,
//             style: { height: 54, backgroundColor: '#3b5998', borderTopWidth: 0.5, borderTopColor: '#fb9800' },
//             showLabel: true,
//             labelStyle: {
//                 fontSize: 10,
//             }
//         }
//     },
// );
// export default createAppContainer(TabNavigator);

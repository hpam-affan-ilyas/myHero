import React, { Component } from 'react';
import { Image,TouchableOpacity, Text, Animated,Easing,Alert,  View, RefreshControl, Platform, ActivityIndicator, Modal, StatusBar, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Unauth from './UnauthPage';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductList from './ProdukList';
import ImpianList from './ImpianPage';
import IntroApp from './IntroPage';
import renderIf from './Renderif';
import CarrauselIklan from './CarrauselIklan';
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');
var page="Home";
var platform = Platform.OS;

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(100) ;
        this.spinValue = new Animated.Value(100) ;;
        this.state = {
            backClickCount: 0,
            isToast:false,
            isLoading: false,
            totPorto: 0,
            ratio_return:0,
            statusNasabah: '',
            myToken: '',
            dataIklan: [],
            dataProduk: [],
            userName: '',
            hasil_kumulatif: 0,
            tglNab: null,
            colorHasilKumulatif: '#49c85a',
            colorTotPorto: '#49c85a',
            statusLengkapiData: false,
            refreshing: false,
            appVersion:0,
            modalVisibleUnAuth: false,
            aktifDeskripsi:1,
            focusBg:false,
            bg1:'#efefef',
            bg2:'#fff',
            bg3:'#fff',
            bg4:'#fff',
            textDeskripsi:'Cukup siapkan KTP, kurang dari 10 menit untuk mulai investasi',
            newMessage:'',
            translation: ['-45deg', '45deg'],
            spinAnim: new Animated.Value(0),
            fadeValue: new Animated.Value(0),
            showLonceng:true,
            promo:0,
            dataPromo:[],
        }
    }
    
    _onRefresh() {
        this.setState({ refreshing: true });
        this._getToken().then(() => {
            this.setState({ refreshing: false })
        });
    }
    Unauthorized(){
        this.setState({ isLoading: false,modalVisibleUnAuth:true})
                        setTimeout(()=> this.logout(),GLOBAL.timeOut);
    }
    _getProfile(token) {
        fetch(GLOBAL.profile(), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token,
            },
        })
            .then((response) => {
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        if (res.data.user.name != null) {
                            var name = res.data.user.name.split(' ');
                            var kata1 = name[0].toString().slice(0,1).toUpperCase()+name[0].toString().slice(1,20).toLowerCase();
                            this.setState({ userName: kata1});
                            AsyncStorage.setItem('namaValue', res.data.user.name + ' ' + res.data.user.last_name);
                        }
                        if (res.data.user.email != null) {
                            AsyncStorage.setItem('emailValue', res.data.user.email);
                        }
                        if (res.data.user.no_hp != null) {
                            AsyncStorage.setItem('noHpValue', res.data.user.no_hp);
                        }
                        if (res.data.status_nasabah != null) {
                            this.setState({
                                statusNasabah: res.data.status_nasabah
                            })
                            AsyncStorage.setItem('statusNasabah', res.data.status_nasabah);
                            if (res.data.status_nasabah == 'aktif') {
                                this._getSummery(token)
                            }
                            if (res.data.status_nasabah == 'belum nasabah') {
                                this.setState({ statusLengkapiData: true })
                            } else {
                                this.setState({ statusLengkapiData: false })
                            }
                        }
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    console.log("masuk sini 1", "masuk sini");
                   GLOBAL.gagalKoneksi()
                }
            })
    }

    _getPromo() {
        fetch(GLOBAL.getPromo(), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': this.state.myToken,
            },
        })
        .then((response) => {
            if (response.status == '201') {
                let res;
                return response.json().then(obj => {
                    res = obj;
                    this.setState({ promo: res.data})
                })
            } else if (response.status == '401') {
                this.Unauthorized()
            } else {
                console.log("masuk sini 2", "masuk sini");
                GLOBAL.gagalKoneksi()
            }
        })
    }

    _getSummery(token) {
        fetch(GLOBAL.summaryPorto(), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token,
            },
        })
            .then((response) => {
                console.log("Response Status", response.status)
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        if (res.data.portofolio.total != null) {
                            this.setState({ totPorto: res.data.portofolio.total })
                        }
                        if (res.data.portofolio.hasil_kumulatif != null) {
                            this.setState({ hasil_kumulatif: res.data.portofolio.hasil_kumulatif })
                        }
                        if (res.data.portofolio.tanggal != null) {
                            this.setState({ tglNab: res.data.portofolio.tanggal })
                        }
                        if (res.data.portofolio.ratio_return != null) {
                            this.setState({ ratio_return: res.data.portofolio.ratio_return })
                        }

                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    _getProdukList(token) {
        fetch(GLOBAL.produkListWithToken(), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token,
            },
        })
            .then((response) => {
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        this.setState({
                            dataProduk: res.data.produk,
                            //state: this.state["dataImg"].push(responseJson.data.slide[x][0])
                        }, function () {

                        });
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    console.log("masuk sini 4", "masuk sini");
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    _getNotifikasiNew(token) {
        fetch(GLOBAL.getNotifikasiNew(), {
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
                        this.setState({
                            newMessage: res.data.notifikasi,
                        })
                        if(this.state.newMessage > 0){
                            // this.loncengGerak();
                        }
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    // GLOBAL.gagalKoneksi()
                }
            })
    }

    _getIklan(token) {
        fetch(GLOBAL.iklan(), {
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
                        this.setState({
                            dataIklan: res.data.iklan,
                            //state: this.state["dataImg"].push(responseJson.data.slide[x][0])
                        }, function () {

                        });
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    console.log("masuk sini 4", "masuk sini");
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    // onPressNotifBtn() {
    //     if (this.state.statusNasabah == 'aktif') {
    //         this.props.navigation.navigate('NotifikasiInvest')
    //     } else if (this.state.statusNasabah == 'pending') {
    //         Alert.alert('Perhatian', 'Pendaftaran Anda sedang dalam proses. Transaksi dapat dilakukan bila pendaftaran Anda sudah diaktifasi',
    //             [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
    //             { cancelable: false },
    //         );
    //     } else if (this.state.statusNasabah == 'belum nasabah') {
    //         Alert.alert('Perhatian', 'Anda belum melengkapi data nasabah, segera lengkapi data nasabah!',
    //             [
    //                 { text: 'Nanti', onPress: () => console.log('Cancel Pressed') },
    //                 { text: 'Lengkapi Sekarang', onPress: () => this.props.navigation.navigate('Regist1') }
    //             ],
    //             { cancelable: false },
    //         );
    //     }
    // }

    logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Main');
    }

    _getToken = async () => {
        var aksesToken = await AsyncStorage.getItem('aksesToken');
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken });
            this._getProfile(this.state.myToken);
            this._getProdukList(this.state.myToken);
            this._getIklan(this.state.myToken);
            this._getNotifikasiNew(this.state.myToken);
            this._getPromo();
        } else {
            this.Unauthorized()
        }
    }

    fase_2(){
      
        this.setState({spinAnim: new Animated.Value(0),fadeValue: new Animated.Value(0) })
        this.setState({translation: this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['45deg', '-45deg']
        })})
        Animated.parallel([
        Animated.timing(
            this.state.spinAnim,
          {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true
          }
        ),
        Animated.timing(
            this.state.fadeValue,
          {
            toValue: 1,
            duration: 500,
          }
        )
        ]).start(()=> this.loncengGerak());
    }
    loncengGerak(){
     
        this.setState({spinAnim: new Animated.Value(0),fadeValue: new Animated.Value(0) })
        this.setState({translation: this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['-45deg', '45deg']
        })})
        Animated.parallel([
        Animated.timing(
            this.state.spinAnim,
          {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true
          }
        ),
        Animated.timing(
            this.state.fadeValue,
          {
            toValue: 1,
            duration: 500,
          }
        )
        ]).start(()=> this.fase_2());
        
    }
    componentDidMount() {
        this.loncengGerak();
        return this._getToken();
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }

    _spring() {
        this.setState({backClickCount: 1}, () => {
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
                this.setState({backClickCount: 0});
            });
        });

    }

    handleBackButton = () => {
        if(this.state.backClickCount < 1){
            if(this.props.navigation.state.routeName == "HomeScreen"){
                this.setState({isToast:true});
                setTimeout(()=>this.setState({isToast:false}),500)
            }
            this.props.navigation.navigate('Home');
            this._spring()
        }else{
            this.setState({isToast:false});
            BackHandler.exitApp()
        }
        return true;
    };

    render() {
        const iklan = this.state.dataIklan;
        const iklanMap = iklan.map((iklan, key) => iklan);
        const produk = this.state.dataProduk;
        const produkMap = produk.map((produk, key) => produk);
        const { navigate } = this.props.navigation;
        return (
            <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
                <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
                    {renderIf(this.state.isToast == true)(
                        <View style={[styles.wrapper,{justifyContent:'center',alignItems:'center',position:'absolute',zIndex:2}]}>
                            <View style={{padding:10,width:"80%",borderWidth:2,borderColor:"#dddddd",backgroundColor:'#000',justifyContent:'center',alignItems:'center',borderRadius:20}}>
                                <Text style={{textAlign:'center',color:'#000',fontSize:16,fontWeight:'600'}}>Klik dua kali untuk keluar</Text>
                            </View>
                        </View>
                    )}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }>

                        {
                            this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
                        }
                        <View style={styles.containerMain}>
                            <View style={{ flexDirection: "row",width:'100%' }}>
                                <Text style={styles.txtHeight}>Hai {this.state.userName}</Text>
                                <View style={{ alignItems: 'flex-end',justifyContent: 'flex-end',flex:1}}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifikasi')}>
            
                                        {renderIf(this.state.newMessage < 1)(
                                            <Image
                                                style={{height:30, width: 30}}
                                                source={require('../img/lonceng.png')} />
                                        )}
                                        {renderIf(this.state.newMessage > 0 && this.state.showLonceng == true)(
                                            <Animated.View style={{opacity:this.state.fadeValue}}>
                                                <Animated.Image
                                                style={{height:30, width: 30,transform: [{rotate: this.state.translation}] }}
                                                source={require('../img/lonceng2.png')} />
                                            </Animated.View>
                                            
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.txtMed}>Yuk tingkatkan terus investasimu!</Text>
                            <Text style={[styles.txt14White,{marginTop:10}]}>Nilai Portofolio</Text>
                            <View style={{flexDirection:'row',width:'100%'}}>
                                <Text style={[styles.txt16Bold,{ color: GLOBAL.manageColorKinerja(this.state.totPorto) }]}>Rp </Text>
                                <Text style={[styles.txt26Bold,{ color: GLOBAL.manageColorKinerja(this.state.totPorto) }]}>{GLOBAL.currency(this.state.totPorto, '.', true)}</Text>
                            </View>
                            <View style={{flexDirection:'row',width:'100%'}}>
                                <View style={{justifyContent:'flex-start'}}>
                                    <Text style={[styles.txtMed]}>Hasil Investasi</Text>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={[styles.txt16Bold,{color: GLOBAL.manageColorKinerja(this.state.hasil_kumulatif) } ]}>Rp </Text>
                                        <Text style={[styles.txt26Bold,{ color: GLOBAL.manageColorKinerja(this.state.hasil_kumulatif) } ]}>{GLOBAL.currency(this.state.hasil_kumulatif, '.', true)}</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'flex-end',alignItems:'flex-end',flex:1}}>
                                    <Text style={styles.txtMed}>Imbal Hasil</Text>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={[styles.txt26Bold,{ color: GLOBAL.manageColorKinerja(this.state.ratio_return)} ]}>{GLOBAL.manageKinerja(this.state.ratio_return)} </Text>
                                        <Text style={[styles.txt16Bold,{color: GLOBAL.manageColorKinerja(this.state.ratio_return) } ]}>%</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.whiteLine} />
                           
                            <ImpianList nav={navigate} pageId={2}/>
                    
                            <ProductList produkMap={produkMap} nav={navigate} pageId={2} promo={this.state.promo}/>
                  
                            <View style={styles.box}>
                                <View style={styles.boxListWhite2}>
                                    <Text style={[styles.btnTxtDefault,{marginBottom:10}]}>Gunakan Fitur Ini</Text>
                                    <View style={styles.boxBody100White}>
                                        <View style={{flexDirection:"row"}} >
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Kalkulator')}>
                                                <View style={styles.boxFiture}>
                                                    <View style={styles.boxIcon100White}>
                                                        <Image source={require('./../img/icon_kalkulator.png')} style={styles.icon100White} />
                                                    </View>
                                                    <Text style={styles.boxTitle100White}>Kalkulator {"\n"}Investasi</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('NotifikasiInvest')}>
                                                <View style={styles.boxFiture}>
                                                    <View style={styles.boxIcon100White}>
                                                    <Image source={require('./../img/icon_notif.png')} style={styles.icon100White} />
                                                    </View>
                                                    <Text style={styles.boxTitle100White}>Notifikasi {"\n"}Investasi</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <IntroApp />
                        </View>
                        <CarrauselIklan iklanMap={iklanMap} nav={navigate}/>
                    </ScrollView>
                    {renderIf(this.state.modalVisibleUnAuth == true)(
                        <Unauth visibleModal={this.state.modalVisibleUnAuth} />
                    )}
            </LinearGradient>
        );
    }
};
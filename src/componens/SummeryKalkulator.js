
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StatusBar, Modal, ActivityIndicator, ScrollView, Alert, RefreshControl, BackHandler, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import AwesomeButton from "react-native-really-awesome-button";
import AsyncStorage from '@react-native-community/async-storage';
import UnAuth from './UnauthPage';
import renderIf from './Renderif';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');

class SummeryKalkulator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            myToken: null,
            danaInvest: 0,
            dataChart: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            idProduk: null,
            namaProduk: '',
            estimasiReturn: 0,
            satuanWaktu: "Tahun",
            periode: 0,
            statusNasabah: '',
            result: 0,
            tipeMetode: 1,
            tipeKal: 1,
            satuanRupiah: 'Juta',
            refreshing: false,
            modalVisibleUnAuth: false,
        }
    };
    Unauthorized() {
        this.setState({ isLoading: false, modalVisibleUnAuth: true })
        setTimeout(() => this.logout(), GLOBAL.timeOut);
    }
    onPressNotifBtn() {
        if (this.state.statusNasabah == 'aktif') {
            this.props.navigation.navigate('FormNotifInvest', { nilaiInvest: this.state.danaInvest, namaProduk: this.state.namaProduk })
        } else if (this.state.statusNasabah == 'pending') {
            Alert.alert('Perhatian', 'Pendaftaran Anda sedang dalam proses. Transaksi dapat dilakukan bila pendaftaran Anda sudah diaktifasi',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        } else if (this.state.statusNasabah == 'belum nasabah') {
            Alert.alert('Perhatian', 'Anda belum melengkapi data nasabah, segera lengkapi data nasabah!',
                [
                    { text: 'Nanti', onPress: () => console.log('Cancel Pressed') },
                    { text: 'Lengkapi Sekarang', onPress: () => this.props.navigation.navigate('Regist1') }
                ],
                { cancelable: false },
            );
        }
    }
    goActBuy() {
        if (this.state.statusNasabah == 'aktif') {
            this.props.navigation.navigate('Buy', { id: this.state.idProduk, nilaiInvest: this.state.danaInvest })
        } else if (this.state.statusNasabah == 'pending') {
            Alert.alert('Perhatian', 'Pendaftaran Anda sedang dalam proses verifikasi. Transaksi dapat dilakukan setelah proses verifikasi selesai.',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        } else if (this.state.statusNasabah == 'belum nasabah') {
            Alert.alert('Perhatian', 'Anda belum melengkapi data nasabah, segera lengkapi data nasabah!',
                [
                    { text: 'Nanti', onPress: () => onsole.log('Cancel Pressed') },
                    { text: 'Lengkapi Sekarang', onPress: () => this.props.navigation.navigate('Regist1') }
                ],
                { cancelable: false },
            );
        }
    }
    _getToken = async () => {
        const { params } = this.props.navigation.state;
        var aksesToken = await AsyncStorage.getItem('aksesToken');
        this._getDisclaimer(aksesToken);
        var statusNb = await AsyncStorage.getItem('statusNasabah');
        if (statusNb != null && statusNb != '') {
            this.setState({ statusNasabah: statusNb })
        }
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken })
            this.setState({
                idProduk: params.idProd,
                namaProduk: params.namaProd,
                estimasiReturn: params.estimasiReturn,
                periode: params.periodeInvest,
            })
            if (params.tipeMetode == 1) {
                //tipe metode hitung target
                this.setState({ satuanWaktu: 'Tahun', tipeMetode: 1 })
            } else {
                //tipe metode hitung dana yg harus di invest
                this.setState({ satuanWaktu: 'Tahun', tipeMetode: 2 })
            }
            if (params.investasi != null && params.estimasiHasil != null) {
                var a = params.investasi;
                var b = params.estimasiHasil;
                if (params.tipeKal == '1') {
                    //tipe lungsum
                    this.setState({ danaInvest: a, result: b })
                } else {
                    //tipe reguler perbulan
                    this.setState({ danaInvest: b, result: a })
                }
            }
        } else {
            this.Unauthorized()
        }
    }
    _getDisclaimer(token) {
        this.setState({ isLoading: true })
        fetch(GLOBAL.getWordingSummary(), {
          method: 'GET',
          headers: {
            'Accept': 'appication/json',
            'Content-type': 'application/json',
            'Authorization': token,
          },
        })
          .then((response) => {
            this.setState({ isLoading: false })
            console.log("Response Status Disclaimer", response.status);
            if (response.status == '201') {
              let res;
              return response.json().then(obj => {
                res = obj;
                console.log("Data Disclaimer", res.data.disclaimer[0].text);
                this.setState({ disclaimer: res.data.disclaimer[0].text })
              })
            } else if (response.status == '400') {
              let res2;
              return response.json().then(obj => {
                res2 = obj;
                this.setState({ dataPorto: res2.data.portofolio })
              })
            }
            else if (response.status == '401') {
              this.Unauthorized()
            } else {
              GLOBAL.gagalKoneksi()
            } 
          })
        this.setState({ isLoading: false })
      }
    _onRefresh() {
        this.setState({ refreshing: true });
        this._getToken().then(() => {
            this.setState({ refreshing: false })
        });
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack();
            return true;
        });
        return this._getToken()
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }
    render() {
        return (
            <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
                <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
                <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    } >
                    {
                        this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
                    }
                    <View style={styles.containerMain}>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }} >
                            <View style={{ width: "30%" }}>
                                <Text style={styles.labelText}>Investasi</Text>
                            </View>
                            <View style={{ width: "70%", justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Text style={styles.txtMed}>Rp {this.state.danaInvest.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g, '.')}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }} >
                            <View style={{ width: "30%" }}>
                                <Text style={styles.labelText}>Estimasi imbal balik per {this.state.satuanWaktu}</Text>
                            </View>
                            <View style={{ width: "70%", justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Text style={styles.txtMed}>{GLOBAL.currency(this.state.estimasiReturn, '.', false)} %</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }} >
                            <View style={{ width: "30%" }}>
                                <Text style={styles.labelText}>Produk</Text>
                            </View>
                            <View style={{ width: "70%", justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Text style={styles.txtMed}>{this.state.namaProduk}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }} >
                            <View style={{ width: "30%" }}>
                                <Text style={styles.labelText}>Periode investasi</Text>
                            </View>
                            <View style={{ width: "70%", justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Text style={styles.txtMed}>{this.state.periode.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g, '.')} {this.state.satuanWaktu}</Text>
                            </View>
                        </View>
                        <View style={styles.whiteLine} ></View>
                        <View style={{ flexDirection: 'row' }} >
                            <View style={{ width: "30%" }}>
                                <Text style={styles.labelText}>Estimasi hasil investasi</Text>
                            </View>
                            <View style={{ width: "70%", justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Text style={styles.txtMed}>Rp {this.state.result.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g, '.')}</Text>
                            </View>
                        </View>
                        <View style={{ width: "100%", height: 150, marginTop: 10}}>
                            <Image source={require('../img/grid_white.png')} style={{ width: GLOBAL.DEVICE_WIDTH -30, height: 120, alignSelf: 'center', resizeMode: 'stretch' }} />
                            <LineChart
                                withInnerLines={false}
                                withOuterLines={false}
                                withVerticalLabels={false}
                                withHorizontalLabels={false}
                                withShadow={true}
                                withDots={false}
                                data={{
                                    datasets: [
                                        {
                                            data: this.state.dataChart,
                                            color: (opacity = 0.1) => '#FFD700',  // optional
                                            strokeWidth: 2 // optional
                                        },
                                    ],
                                }}
                                width={GLOBAL.DEVICE_WIDTH - 30} // from react-native
                                height={150}
                                chartConfig={{
                                    backgroundColor: '#3b5998',
                                    backgroundGradientFrom: '#203d8b',
                                    backgroundGradientTo: '#3b5998',
                                    backgroundGradientFromOpacity: 0.7,
                                    backgroundGradientToOpacity: 0,
                                    paddingRight: 0,
                                    paddingTop: 0,
                                    decimalPlaces: 0, // optional, defaults to 2dp
                                    color: (opacity = 0.5) => '#FFF',
                                }}
                                bezier
                                style={{
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    position: 'absolute'
                                }}
                            />
                        </View>
                        <View style={[styles.whiteLine,{marginTop:-5}]} ></View>
                        <View style={{marginTop:5}}>
                            <Text style={[styles.txtLittle, { textAlign: 'justify' }]}>
                                {this.state.disclaimer}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.boxBtnBottom, { flexDirection: 'row', paddingLeft: 15, paddingRight: 15,marginTop:20 }]}>
                        <AwesomeButton
                            borderRadius={15}
                            backgroundColor='#28ccfb'
                            backgroundShadow="#000"
                            backgroundDarker="#23b6e0"
                            height={40}
                            width={GLOBAL.DEVICE_WIDTH * 0.5 - 25}
                            style={{ marginTop: 10, marginRight: 10 }}
                            onPress={() => { this.goActBuy() }}
                        >
                            <Image source={require('./../img/btnPrev.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5 - 25, height: 40, resizeMode: 'stretch' }} />
                            <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>INVESTASI</Text>
                        </AwesomeButton>
                        {renderIf(this.state.myToken != '' && this.state.statusNasabah == 'aktif')(
                            <AwesomeButton
                                borderRadius={15}
                                backgroundColor='#4F7942'
                                backgroundShadow="#000"
                                backgroundDarker="#45673a"
                                height={40}
                                width={GLOBAL.DEVICE_WIDTH * 0.5 - 25}
                                style={{ marginTop: 10, marginLeft: 10 }}
                                onPress={() => this.onPressNotifBtn()}
                            >
                                <Image source={require('./../img/btnLogin.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5 - 20, height: 40, resizeMode: 'stretch' }} />
                                <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>BUAT PENGINGAT</Text>
                            </AwesomeButton>
                        )}
                    </View>
                </ScrollView>


                {renderIf(this.state.modalVisibleUnAuth == true)(
                    <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
                )}
            </LinearGradient>
        );
    }
}

export default SummeryKalkulator;

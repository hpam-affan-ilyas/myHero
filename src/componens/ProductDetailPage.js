
import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, Platform, ImageBackground, View, SafeAreaView, Linking, Alert, Modal, ActivityIndicator, RefreshControl, BackHandler, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeButton from "react-native-really-awesome-button";
import Icon from 'react-native-vector-icons/FontAwesome';
import { LineChart } from 'react-native-chart-kit';
import UnAuth from './UnauthPage';
import renderIf from './Renderif';
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');
const aktifTab = "#00a95c";
const pasifTab = '#4F7942';
const aktifDarkTab = "#039251";
const pasifDarkTab = "#45673a";
var platform = Platform.OS;

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingChart:false,
      myToken: null,
      statusNasabah:'',
      idProduk: 0,
      dataChart: [],
      dataChart2: [],
      namaProduct: '',
      userName: '',
      lastName: '',
      emailValue: '',
      noHpValue: '',
      nav1D: 0,
      nav1M: 0,
      nav3M: 0,
      navYTD: 0,
      nav1Y: 0,
      nav3Y: 0,
      nav5Y: 0,
      tglNav: '',
      nab: 0,
      navAktif: 0,
      jenisProduk: '',
      namaJenis:'',
      totalAum: 0,
      minPembelian: 0,
      linkFfs: null,
      linkProspektus: null,
      backgroundColor1: '#4F7942',
      backgroundDarkColor1: "#45673a",
      backgroundColor2: '#4F7942',
      backgroundDarkColor2: "#45673a",
      backgroundColor3: '#4F7942',
      backgroundDarkColor3: "#45673a",
      backgroundColor4: "#00a95c",
      backgroundDarkColor4: "#039251",
      backgroundColor5: '#4F7942',
      backgroundDarkColor5: "#45673a",
      backgroundColor6: '#4F7942',
      backgroundDarkColor6: "#45673a",
      backgroundColor7: '#4F7942',
      backgroundDarkColor7: "#45673a",
      colorNav1D: '#49c85a',
      colorNav1M: '#49c85a',
      colorNav3M: '#49c85a',
      colorNavYTD: '#49c85a',
      colorNav1Y: '#49c85a',
      colorNav3Y: '#49c85a',
      colorNavAktif: '#49c85a',
      refreshing: false,
      modalVisibleUnAuth: false,
      bechmarkLabel: '',
      bechmarkInfo: '',
    }
  };
  Unauthorized() {
    this.setState({ isLoading: false, modalVisibleUnAuth: true })
    setTimeout(() => this.logout(), GLOBAL.timeOut);
  }
  logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Main')
  }

  goActBuy() {
    if (this.state.statusNasabah == 'aktif') {
      this.props.navigation.navigate('Buy', { id: this.state.idProduk, nilaiInvest: null })
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
    console.log("masuk sini gak?");
  }

  _getDataChart(token, idProduk, kinerja) {
    this.setState({ isLoadingChart: true })
    if (typeof idProduk == "undefined" || idProduk == null || idProduk == '') return 0;
    if (kinerja == null) {
      kinerja = 'YTD'
    }
    fetch(GLOBAL.listNav(kinerja, idProduk), {
      method: 'GET',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
        'Authorization': token,
      }
    })
      .then((response) => {
        this.setState({ isLoadingChart: false })
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            var count = Object.keys(res.data.kinerja).length;
            let data_chart = [];
              this.setState({ bechmarkLabel: res.data.kode_benchmark, bechmarkInfo: res.data.nama_benchmark});
              for (var i = 0; i < count; i++) {
                data_chart.push({
                  nav: res.data.kinerja[i].nav_prosentase,
                  bechmark: res.data.kinerja[i].kinerja_benchmark,
                });
              }
            this.setState({ dataChart: data_chart });
          })
        } else if (response.status == '401') {
          this.Unauthorized()
        } else {
          GLOBAL.gagalKoneksi()
        }
      })

    switch (kinerja) {
      case '1D':
        this.setState({
          navAktif: this.state.nav1D,
          backgroundColor1: aktifTab,
          backgroundColor2: pasifTab,
          backgroundColor3: pasifTab,
          backgroundColor4: pasifTab,
          backgroundColor5: pasifTab,
          backgroundColor6: pasifTab,
          backgroundColor7: pasifTab,
          backgroundDarkColor1: aktifDarkTab,
          backgroundDarkColor2: pasifDarkTab,
          backgroundDarkColor3: pasifDarkTab,
          backgroundDarkColor4: pasifDarkTab,
          backgroundDarkColor5: pasifDarkTab,
          backgroundDarkColor6: pasifDarkTab,
          backgroundDarkColor7: pasifDarkTab,
          isLoading: false
        })
        break;
      case '1M':
        this.setState({
          navAktif: this.state.nav1M,
          backgroundColor1: pasifTab,
          backgroundColor2: aktifTab,
          backgroundColor3: pasifTab,
          backgroundColor4: pasifTab,
          backgroundColor5: pasifTab,
          backgroundColor6: pasifTab,
          backgroundColor7: pasifTab,
          backgroundDarkColor1: pasifDarkTab,
          backgroundDarkColor2: aktifDarkTab,
          backgroundDarkColor3: pasifDarkTab,
          backgroundDarkColor4: pasifDarkTab,
          backgroundDarkColor5: pasifDarkTab,
          backgroundDarkColor6: pasifDarkTab,
          backgroundDarkColor7: pasifDarkTab,
          isLoading: false
        })
        break;
      case '3M':
        this.setState({
          navAktif: this.state.nav3M,
          backgroundColor1: pasifTab,
          backgroundColor2: pasifTab,
          backgroundColor3: aktifTab,
          backgroundColor4: pasifTab,
          backgroundColor5: pasifTab,
          backgroundColor6: pasifTab,
          backgroundColor7: pasifTab,
          backgroundDarkColor1: pasifDarkTab,
          backgroundDarkColor2: pasifDarkTab,
          backgroundDarkColor3: aktifDarkTab,
          backgroundDarkColor4: pasifDarkTab,
          backgroundDarkColor5: pasifDarkTab,
          backgroundDarkColor6: pasifDarkTab,
          backgroundDarkColor7: pasifDarkTab,
          isLoading: false
        })
        break;
      case 'YTD':
        this.setState({
          navAktif: this.state.navYTD,
          backgroundColor1: pasifTab,
          backgroundColor2: pasifTab,
          backgroundColor3: pasifTab,
          backgroundColor4: aktifTab,
          backgroundColor5: pasifTab,
          backgroundColor6: pasifTab,
          backgroundColor7: pasifTab,
          backgroundDarkColor1: pasifDarkTab,
          backgroundDarkColor2: pasifDarkTab,
          backgroundDarkColor3: pasifDarkTab,
          backgroundDarkColor4: aktifDarkTab,
          backgroundDarkColor5: pasifDarkTab,
          backgroundDarkColor6: pasifDarkTab,
          backgroundDarkColor7: pasifDarkTab,
          isLoading: false
        })
        break;
      case '1Y':
        this.setState({
          navAktif: this.state.nav1Y,
          backgroundColor1: pasifTab,
          backgroundColor2: pasifTab,
          backgroundColor3: pasifTab,
          backgroundColor4: pasifTab,
          backgroundColor5: aktifTab,
          backgroundColor6: pasifTab,
          backgroundColor7: pasifTab,
          backgroundDarkColor1: pasifDarkTab,
          backgroundDarkColor2: pasifDarkTab,
          backgroundDarkColor3: pasifDarkTab,
          backgroundDarkColor4: pasifDarkTab,
          backgroundDarkColor5: aktifDarkTab,
          backgroundDarkColor6: pasifDarkTab,
          backgroundDarkColor7: pasifDarkTab,
          isLoading: false
        })
        break;
      case '3Y':
        this.setState({
          navAktif: this.state.nav3Y,
          backgroundColor1: pasifTab,
          backgroundColor2: pasifTab,
          backgroundColor3: pasifTab,
          backgroundColor4: pasifTab,
          backgroundColor5: pasifTab,
          backgroundColor6: aktifTab,
          backgroundColor7: pasifTab,
          backgroundDarkColor1: pasifDarkTab,
          backgroundDarkColor2: pasifDarkTab,
          backgroundDarkColor3: pasifDarkTab,
          backgroundDarkColor4: pasifDarkTab,
          backgroundDarkColor5: pasifDarkTab,
          backgroundDarkColor6: aktifDarkTab,
          backgroundDarkColor7: pasifDarkTab,
          isLoading: false
        })
        break;
      case '5Y':
        this.setState({
          navAktif: this.state.nav5Y,
          backgroundColor1: pasifTab,
          backgroundColor2: pasifTab,
          backgroundColor3: pasifTab,
          backgroundColor4: pasifTab,
          backgroundColor5: pasifTab,
          backgroundColor6: pasifTab,
          backgroundColor7: aktifTab,
          backgroundDarkColor1: pasifDarkTab,
          backgroundDarkColor2: pasifDarkTab,
          backgroundDarkColor3: pasifDarkTab,
          backgroundDarkColor4: pasifDarkTab,
          backgroundDarkColor5: pasifDarkTab,
          backgroundDarkColor6: pasifDarkTab,
          backgroundDarkColor7: aktifDarkTab,
          isLoading: false
        })
        break;
    }
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
              this.setState({ userName: res.data.user.name })
            }
            if (res.data.user.email != null) {
              this.setState({ emailValue: res.data.user.email })
            }
            if (res.data.user.no_hp != null) {
              this.setState({ noHpValue: res.data.user.no_hp })
            }
            if (res.data.user.last_name != null) {
              this.setState({ lastName: res.data.user.last_name })
            }
            if (res.data.status_nasabah != null) {
              this.setState({
                  statusNasabah: res.data.status_nasabah
              });
            }
          })
        } else if (response.status == '401') {
          this.Unauthorized
        } else {
          GLOBAL.gagalKoneksi()
        }
      })
  }
  _getDetailProduct(token, idProduk) {
    fetch(GLOBAL.detailProduk(idProduk), {
      method: 'GET',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
        'Authorization': token,
      }
    })
      .then((response) => {
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            this.setState({
              namaProduct: res.data.produk.nama_produk,
              nav1D: res.data.produk.kinerja_1D,
              nav1M: res.data.produk.kinerja_1M,
              nav3M: res.data.produk.kinerja_3M,
              navYTD: res.data.produk.kinerja_YTD,
              nav1Y: res.data.produk.kinerja_1Y,
              nav3Y: res.data.produk.kinerja_3Y,
              nav5Y: res.data.produk.kinerja_5Y,
              navAktif: res.data.produk.kinerja_YTD,
              jenisProduk: res.data.produk.jenis_produk,
              namaJenis:res.data.produk.nama_jenis,
              tglNav: res.data.produk.tanggal_nav,
              totalAum: res.data.produk.aum,
              nab: res.data.produk.nav,
              minPembelian: res.data.produk.minimal_subs,
              linkFfs: res.data.produk.link_ffs,
              linkProspektus: res.data.produk.link_prospektus,
              isLoading: false,
            });
          })
        } else if (response.status == '401') {
          this.Unauthorized()
        } else {
          GLOBAL.gagalKoneksi()
        }
      })
  }

  _getToken = async () => {
    var aksesToken = await AsyncStorage.getItem('aksesToken');
    const { params } = this.props.navigation.state;
    if (params.id != null) {
      this.setState({ idProduk: params.id });
    }
    if (aksesToken != null) {
      this.setState({ myToken: aksesToken });
      this._getProfile(this.state.myToken);
      this._getDataChart(this.state.myToken, this.state.idProduk, 'YTD');
      this._getDetailProduct(this.state.myToken, this.state.idProduk);
    } else {
      this.Unauthorized()
    }
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
    const data = this.state.dataChart;
    const dataValue = data.map((data, key) => data.nav);
    const dataValue2 = data.map((data, key) => data.bechmark);
    return (
      <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
        <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          } >
          <View style={styles.containerMain}>
            {
              this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
            }
            <View style={{ alignItems: "center", marginBottom: 15 }}>
              <Text style={styles.txtMed}>{this.state.namaProduct}</Text>
            </View>
            {renderIf(dataValue.length > 0)(
              <View>
                <View>
                {
                  this.state.isLoadingChart && <Modal transparent={true}><View style={{ width: GLOBAL.DEVICE_WIDTH - 30, height: 120, alignSelf: 'center',marginTop:160}}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
                }
                  <Image source={require('../img/grid_white.png')} style={{ width: GLOBAL.DEVICE_WIDTH - 30, height: 120, alignSelf: 'center', resizeMode: 'stretch' }} />
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
                          seriesName: 'series1',
                          data: dataValue,
                          color: (opacity = 0.1) => '#FFD700', // optional
                          strokeWidth: 2, // optional
                        },
                        {
                          seriesName: 'series2',
                          data: dataValue2,
                          color: (opacity = 0.1) => '#3c8c3c', // optional
                          strokeWidth: 2, // optional
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

                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      position: 'absolute'
                    }}
                  />

                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: 20, marginTop: 10 }}>
                  <View style={{ width: 30, height: 10, backgroundColor: '#FFD700', marginRight: 5 }} />
                  <Text style={{ fontSize: 13, color: '#FFD700' }}>{this.state.namaProduct}</Text>
                  <TouchableOpacity onPress={() => { Alert.alert('INFO', this.state.bechmarkInfo, [{ text: 'OK', onPress: () => console.log('OK Pressed') }], { cancelable: false }) }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: 30, height: 10, backgroundColor: '#3c8c3c', marginLeft: 10, marginRight: 5 }} />
                    <Text style={{ fontSize: 13, color: '#3c8c3c', marginRight: 5 }}>{this.state.bechmarkLabel}</Text>
                    <Icon name="info-circle" size={10} style={{ alignSelf: 'flex-start', color: '#FFF' }} />
                  </TouchableOpacity>
                </View>
              </View>
            )}


            <View style={{ borderColor: "#FFF", borderWidth: 0.5, marginTop: 10, marginBottom: 5 }} />
            <View style={{ flex: 7, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <AwesomeButton
                borderRadius={8}
                backgroundColor={this.state.backgroundColor1}
                backgroundShadow="#000"
                backgroundDarker={this.state.backgroundDarkColor1}
                width={(GLOBAL.DEVICE_WIDTH - 30) / 7}
                height={30}
                onPress={() => { this._getDataChart(this.state.myToken, this.state.idProduk, '1D') }}
              >1D</AwesomeButton>

              <AwesomeButton
                borderRadius={15}
                backgroundColor={this.state.backgroundColor2}
                backgroundShadow="#000"
                backgroundDarker={this.state.backgroundDarkColor2}
                width={(GLOBAL.DEVICE_WIDTH - 30) / 7}
                height={30}
                onPress={() => { this._getDataChart(this.state.myToken, this.state.idProduk, '1M') }}
              >1M</AwesomeButton>

              <AwesomeButton
                borderRadius={8}
                backgroundColor={this.state.backgroundColor3}
                backgroundShadow="#000"
                backgroundDarker={this.state.backgroundDarkColor3}
                width={(GLOBAL.DEVICE_WIDTH - 30) / 7}
                height={30}
                onPress={() => { this._getDataChart(this.state.myToken, this.state.idProduk, '3M') }}
              >3M</AwesomeButton>

              <AwesomeButton
                borderRadius={8}
                backgroundColor={this.state.backgroundColor4}
                backgroundShadow="#000"
                backgroundDarker={this.state.backgroundDarkColor4}
                width={(GLOBAL.DEVICE_WIDTH - 30) / 7}
                height={30}
                onPress={() => { this._getDataChart(this.state.myToken, this.state.idProduk, 'YTD') }}
              >YTD</AwesomeButton>

              <AwesomeButton
                borderRadius={8}
                backgroundColor={this.state.backgroundColor5}
                backgroundShadow="#000"
                backgroundDarker={this.state.backgroundDarkColor5}
                width={(GLOBAL.DEVICE_WIDTH - 30) / 7}
                height={30}
                onPress={() => { this._getDataChart(this.state.myToken, this.state.idProduk, '1Y') }}
              >1Y</AwesomeButton>

              <AwesomeButton
                borderRadius={8}
                backgroundColor={this.state.backgroundColor6}
                backgroundShadow="#000"
                backgroundDarker={this.state.backgroundDarkColor6}
                width={(GLOBAL.DEVICE_WIDTH - 30) / 7}
                height={30}
                onPress={() => { this._getDataChart(this.state.myToken, this.state.idProduk, '3Y') }}
              >3Y</AwesomeButton>

              <AwesomeButton
                borderRadius={8}
                backgroundColor={this.state.backgroundColor7}
                backgroundShadow="#000"
                backgroundDarker={this.state.backgroundDarkColor7}
                width={(GLOBAL.DEVICE_WIDTH - 30) / 7}
                height={30}
                onPress={() => { this._getDataChart(this.state.myToken, this.state.idProduk, '5Y') }}
              >5Y</AwesomeButton>

            </View>
            <View style={{ borderColor: "#FFF", borderWidth: 0.5, marginBottom: 10, marginTop: 5 }} />
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.txtMed}>NAB {GLOBAL.currency(this.state.nab, '.', false)}</Text>
              <Text style={{ fontSize: 16, fontWeight: platform == 'android' ? '800' : '600', color: GLOBAL.manageColorKinerja(this.state.navAktif) }}>{GLOBAL.currency(this.state.navAktif, '.', false)} %</Text>
              <Text style={styles.txtMed}>{GLOBAL.convertTgl(this.state.tglNav)}</Text>
            </View>
            <View style={styles.whiteLine} />
            <View style={{ flexDirection: "row" }}>
              <View style={{ alignItems: "flex-start", justifyContent: "flex-start", width: "33%", marginRight: 1 }}>
                <Text style={styles.txtLittle}>1 Hari</Text>
                <Text style={{ fontSize: 16, fontWeight: platform == 'android' ? '800' : '600', color: GLOBAL.manageColorKinerja(this.state.nav1D) }}>{GLOBAL.currency(this.state.nav1D, '.', false)} %</Text>
              </View>
             
              <View style={{ justifyContent: "center", alignItems: "center", width: "33%", marginRight: 1, marginLeft: 1 }}>
                <Text style={styles.txtLittle}>1 Bulan</Text>
                <Text style={{ fontSize: 16, fontWeight: platform == 'android' ? '800' : '600', color: GLOBAL.manageColorKinerja(this.state.nav1M) }}>{GLOBAL.currency(this.state.nav1M, '.', false)} %</Text>
              </View>
              
              <View style={{ justifyContent: "flex-end", alignItems: "flex-end", width: "33%", marginLeft: 1 }}>
                <Text style={styles.txtLittle}>3 Bulan</Text>
                <Text style={{ fontSize: 16, fontWeight: platform == 'android' ? '800' : '600', color: GLOBAL.manageColorKinerja(this.state.nav3M) }}>{GLOBAL.currency(this.state.nav3M, '.', false)} %</Text>
              </View>
              
            </View>

            <View style={{ flexDirection: "row",marginTop:5}}>
              <View style={{ alignItems: "flex-start", justifyContent: "flex-start", width: "33%", marginRight: 1  }}>
                <Text style={styles.txtLittle}>YTD</Text>
                <Text style={{ fontSize: 16, fontWeight: platform == 'android' ? '800' : '600', color: GLOBAL.manageColorKinerja(this.state.navYTD) }}>{GLOBAL.currency(this.state.navYTD, '.', false)} %</Text>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center", width: "33%", marginRight: 1, marginLeft: 1}}>
                <Text style={styles.txtLittle}>1 Tahun</Text>
                <Text style={{ fontSize: 16, fontWeight: platform == 'android' ? '800' : '600', color: GLOBAL.manageColorKinerja(this.state.nav1Y) }}>{GLOBAL.currency(this.state.nav1Y, '.', false)} %</Text>
              </View>
              <View style={{justifyContent: "flex-end", alignItems: "flex-end", width: "33%", marginLeft: 1 }}>
                <Text style={styles.txtLittle}>3 Tahun</Text>
                <Text style={{ fontSize: 16, fontWeight: platform == 'android' ? '800' : '600', color: GLOBAL.manageColorKinerja(this.state.nav3Y) }}>{GLOBAL.currency(this.state.nav3Y, '.', false)} %</Text>
              </View>
            </View>
            <View style={styles.whiteLine} />
            <View style={{ flexDirection: "row" }}>
              <View style={{ alignItems: "flex-start", justifyContent: "center", width: "33%", marginRight: 1 }}>
                <Text style={styles.txtLittle}>Jenis Produk</Text>
                <Text style={styles.txtLitleShadow}>{this.state.namaJenis}</Text>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center", width: "33%", marginRight: 1, marginLeft: 1 }}>
                <Text style={styles.txtLittle}>Total AUM</Text>
                <Text style={styles.txtLitleShadow}>Rp {GLOBAL.currency(this.state.totalAum, '.', true)}</Text>
              </View>
              <View style={{ justifyContent: "flex-end", alignItems: "flex-end", width: "33%", marginLeft: 1 }}>
                <Text style={styles.txtLittle}>Min Pembelian</Text>
                <Text style={styles.txtLitleShadow}>Rp {GLOBAL.currency(this.state.minPembelian, '.', true)}</Text>
              </View>
            </View>
            <View style={styles.whiteLine} />
            <View style={{ flexDirection: "row", flex: 1, marginTop: 5, marginBottom: 10 }}>
              <AwesomeButton
                borderRadius={15}
                backgroundColor='#4F7942'
                backgroundShadow="#000"
                backgroundDarker="#45673a"
                width={GLOBAL.DEVICE_WIDTH * 0.5 - 25}
                height={40}
                style={{ marginRight: 10 }}
                onPress={() => GLOBAL.openMyURL(this.state.linkProspektus)}
              >
                <Image source={require('./../img/btnLogin.png')} style={{ resizeMode: 'stretch', width: GLOBAL.DEVICE_WIDTH * 0.5 - 25, height: 40 }} />
                <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>PROSPEKTUS</Text>
              </AwesomeButton>
              <AwesomeButton
                borderRadius={15}
                backgroundColor='#4F7942'
                backgroundShadow="#000"
                backgroundDarker="#45673a"
                width={GLOBAL.DEVICE_WIDTH * 0.5 - 25}
                height={40}
                style={{ marginLeft: 10 }}
                onPress={() => GLOBAL.openMyURL(this.state.linkFfs)}
              >
                <Image source={require('./../img/btnLogin.png')} style={{ resizeMode: 'stretch', width: GLOBAL.DEVICE_WIDTH * 0.5 - 25, height: 40 }} />
                <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>FUND FACT SHEET</Text>
              </AwesomeButton>
            </View>
          </View>
          <View style={styles.boxBtnBottom}>

            <AwesomeButton
              borderRadius={15}
              backgroundColor="#00a95c"
              backgroundDarker="#039251"
              backgroundShadow="#000"
              height={40}
              width={GLOBAL.DEVICE_WIDTH * 0.5}
              style={{ marginTop: 10 }}
              onPress={() => this.goActBuy()}
            >
              <Image source={require('./../img/btnBeli.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5, height: 40, resizeMode: 'stretch' }} />
              <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>BELI</Text>
            </AwesomeButton>
          </View>
        </ScrollView>


        {renderIf(this.state.modalVisibleUnAuth == true)(
          <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
        )}
      </LinearGradient >
    );
  }
}

export default ProductDetail;

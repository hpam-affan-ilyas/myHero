
import React, { Component } from 'react';
import { Image, StatusBar, Text, FlatList, RefreshControl, Alert, Animated, View, Modal, ActivityIndicator, Platform, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import UnAuth from './UnauthPage';
import renderIf from './Renderif';
import ProductList from './ProdukList';
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');
var statusNasabah;
var platform = Platform.OS;

class PortoPage extends React.Component {
  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(100);
    this.state = {
      backClickCount: 0,
      isToast: false,
      page: 'Porto',
      isLoading: false,
      totPorto: 0,
      ratio_return: 0,
      myToken: '',
      dataPorto: [],
      dataProduk: [],
      hasil_kumulatif: 0,
      tglNab: null,
      colorHasilKumulatif: '#49c85a',
      colorTotPorto: '#49c85a',
      refreshing: false,
      colorTotPorto: '#49c85a',
      modalVisibleUnAuth: false,
      promo:0,
    }
  }
  Unauthorized() {
    this.setState({ isLoading: false, modalVisibleUnAuth: true })
    setTimeout(() => this.logout(), GLOBAL.timeOut);
  }
  logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Main')
  }
  renderItem = ({ item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.boxListWhite2}>
          <View style={{
            width: "100%",
            justifyContent: 'center',
            alignContent: 'center',
            borderWidth: 1,
            borderRadius: 10,
            paddingLeft: 10,
            paddingBottom: 10,
            paddingRight: 10,
            backgroundColor: '#FFF',
            flex: 1,
            shadowColor: '#efefef',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            borderLeftColor: item.kode_warna,
            borderLeftWidth: 3,
            borderTopColor: item.kode_warna,
            borderTopWidth: 3,
            borderRightColor: "#dddddd",
            borderRightWidth: 1,
            borderBottomColor: "#dddddd",
            borderBottomWidth: 1
          }}>
            <View style={styles.boxHeadListWhite}>
              <Text style={{ fontSize: 14, fontWeight: '600', color:item.kode_warna }}>{item.nama_jenis}</Text>
            </View>
            <View style={[styles.boxContenListWhite,{borderTopColor:item.kode_warna,paddingTop:10,borderTopWidth:1}]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Image source={{ uri: item.link_logo }} style={styles.img30} />
                <Text style={styles.txtHeadBlack}>{item.nama_produk}</Text>
              </View>
              <View style={{ flexDirection: 'row', flex: 1, width: '100%', marginTop: 5 }}>
                <View style={{ width: '50%' }}>
                  <Text style={styles.txtContenListWhite}>Nilai portofolio</Text>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: GLOBAL.manageColorKinerja(item.saldo_aum) }}>Rp {GLOBAL.currency(item.saldo_aum, '.', true)}</Text>
                  <Text style={styles.txtContenListWhite}>Hasil investasi</Text>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: GLOBAL.manageColorKinerja(item.hasil_kumulatif) }}>Rp {GLOBAL.currency(item.hasil_kumulatif, '.', true)}</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <Text style={styles.txtContenListWhite}>NAB</Text>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: GLOBAL.manageColorKinerja(item.saldo_nav) }}>{GLOBAL.currency(item.saldo_nav, '.', false)}</Text>
                  <Text style={styles.txtContenListWhite}>Imbal hasil</Text>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: GLOBAL.manageColorKinerja(item.ratio_return) }} >{GLOBAL.currency(item.ratio_return, '.', false)} %</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flex: 1, width: '100%', marginTop: 5, marginBottom: 5, justifyContent: 'space-between' }}>
                <View>
                  {/* <TouchableOpacity style={styles.btnJualLittle} onPress={() => this.props.navigation.navigate('Sell', { id: item.produk_id })}>
                      <Text style={styles.txtLittle}>JUAL</Text>
                    </TouchableOpacity> */}
                  <AwesomeButton
                    borderRadius={8}
                    backgroundColor="#00a95c"
                    backgroundDarker="#be254b"
                    backgroundShadow="#000"
                    width={80}
                    height={30}
                    onPress={() => this.props.navigation.navigate('Sell', { id: item.produk_id })}
                  >
                    <Image source={require('./../img/btnJual.png')} style={[styles.btnBeliLittleTemp, { resizeMode: 'stretch' }]} />
                    <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>JUAL</Text>
                  </AwesomeButton>
                </View>
                <View>
                  {/* <TouchableOpacity style={styles.btnJualLittle} onPress={() => this.props.navigation.navigate('Sell', { id: item.produk_id })}>
                      <Text style={styles.txtLittle}>JUAL</Text>
                    </TouchableOpacity> */}
                  <AwesomeButton
                    borderRadius={8}
                    backgroundColor="#00a95c"
                    backgroundDarker="#FA8E14"
                    backgroundShadow="#000"
                    width={80}
                    height={30}
                    onPress={() => this.props.navigation.navigate('Switch', { id: item.produk_id, kodeProduk: item.kode_produk })}
                  >
                    <Image source={require('./../img/btnSwitch.png')} style={[styles.btnBeliLittleTemp, { resizeMode: 'stretch' }]} />
                    <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>SWITCH</Text>
                  </AwesomeButton>
                </View>
                <View>
                  {/* <TouchableOpacity style={styles.btnBeliLittle} onPress={() => this.props.navigation.navigate('ProductDetail', { id: item.produk_id })}>
                      <Text style={styles.txtLittle}>BELI</Text>
                    </TouchableOpacity> */}
                  <AwesomeButton
                    borderRadius={8}
                    backgroundColor="#00a95c"
                    backgroundDarker="#039251"
                    backgroundShadow="#000"
                    width={80}
                    height={30}
                    onPress={() => this.props.navigation.navigate('ProductDetail', { id: item.produk_id })}
                  >
                    <Image source={require('./../img/btnBeli.png')} style={[styles.btnBeliLittleTemp, { resizeMode: 'stretch' }]} />
                    <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>BELI</Text>
                  </AwesomeButton>
                </View>
              </View>
            </View>
          </View>

        </View>
      </View>
    )
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
            GLOBAL.gagalKoneksi()
        }
    })
}

  _onRefresh() {
    this.setState({ refreshing: true });
    this._getToken().then(() => {
      this.setState({ refreshing: false })
    });
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
          GLOBAL.gagalKoneksi()
        }
      })
  }

  _getPorto(token) {
    this.setState({ isLoading: true })
    fetch(GLOBAL.listPorto(), {
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
            this.setState({ dataPorto: res.data.portofolio })
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

  _getToken = async () => {
    var aksesToken = await AsyncStorage.getItem('aksesToken');
    statusNasabah = await AsyncStorage.getItem('statusNasabah');
    console.log('aksesToken', aksesToken);
    if (aksesToken != null) {
      this.setState({ myToken: aksesToken })
      this._getPromo();
      this._getProdukList(this.state.myToken);
      if (statusNasabah == 'aktif') {
        this._getSummery(this.state.myToken);
        console.log('Continue get list');
        this._getPorto(this.state.myToken);
      }
    } else {
      this.Unauthorized()
    }
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));
    setTimeout(() => this.setState({ isLoading: false }), 2000)
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
    const produk = this.state.dataProduk;
    const produkMap = produk.map((produk, key) => produk);
    const { navigate } = this.props.navigation;
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <View style={styles.containerMain}>
            <Text style={styles.txtMed}>Nilai Portofolio</Text>
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

            {
              this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
            }
            <View style={[styles.whiteLine, { marginBottom: 10 }]} ></View>
            {renderIf(this.state.dataPorto.length > 0)(
              <View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.dataPorto}
                  keyExtractor={(x, i) => i}
                  renderItem={this.renderItem}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh.bind(this)}
                    />
                  }
                />
             
              </View>
            )}
            {renderIf(this.state.dataPorto.length < 1)(
              <View style={styles.boxNoData}>
                <Text style={styles.txtHeight}>Kamu belum mempunyai portofolio investasi</Text>
                <Image source={require('../img/no_activity.png')} style={{ width: '100%', height: GLOBAL.DEVICE_HEIGHT * 0.25, resizeMode: 'contain', justifyContent: 'flex-end' }} />
                {/* <View style={styles.boxBtnBottom}>
                  <AwesomeButton
                    borderRadius={15}
                    backgroundColor='#4F7942'
                    backgroundShadow="#000"
                    backgroundDarker="#45673a"
                    height={40}
                    width={GLOBAL.DEVICE_WIDTH * 0.5 + 20}
                    onPress={() => this.props.navigation.navigate('Product')}
                  >
                    <Image source={require('./../img/btnLogin.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5 + 20, height: 40, resizeMode: 'stretch' }} />
                    <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>INVESTASI SEKARANG</Text>
                  </AwesomeButton>
                </View> */}
              </View>
            )}
            <View style={[styles.whiteLine, { marginBottom: 10 }]} ></View>
            <View style={{marginBottom:10}}>
            <ProductList produkMap={produkMap} nav={navigate} pageId={2} promo={this.state.promo}/>
            </View>
           
          </View>
        </ScrollView>
        {renderIf(this.state.modalVisibleUnAuth == true)(
          <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
        )}
      </LinearGradient>
    );
  }
}

export default PortoPage;

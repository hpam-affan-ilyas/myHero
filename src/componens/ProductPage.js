
import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, Alert, StatusBar, Animated, View, Modal, ActivityIndicator, Platform, FlatList, RefreshControl,BackHandler } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
// import PureChart from 'react-native-pure-chart';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconAD from 'react-native-vector-icons/AntDesign';
import CarrauselIklan from './CarrauselIklan';
import ProductList from './ProdukList';
import ProductDetailScreen from './ProductDetailPage';
import AsyncStorage from '@react-native-community/async-storage';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');
import UnAuth from './UnauthPage';
import renderIf from './Renderif';
var platform = Platform.OS;

class LineChartView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataChart: [],
      isLoadingChart:false,
      dataChart2: [],
      token: '',
      jenisProduk:'',
      id: '',
      modalVisibleUnAuth: false,
      refreshing:false,
    }
  }
  Unauthorized(){
    this.setState({ isLoading: false,modalVisibleUnAuth:true})
                    setTimeout(()=> this.logout(),GLOBAL.timeOut);
}
  _getDataChart(token, idProduk, kinerja) {
    if (typeof idProduk == "undefined" || idProduk == null || idProduk == '') return 0;
    if (kinerja == null) {
      kinerja = '1Y'
    }
    this.setState({isLoadingChart:true})
    fetch(GLOBAL.listNav(kinerja, idProduk), {
      method: 'GET',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
        'Authorization': token,
      }
    })
      .then((response) => {
        this.setState({isLoadingChart:false})
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            var count = Object.keys(res.data.kinerja).length;
            let data_chart = [];
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
  }
  _getToken(){
    const { produkId } = this.props;
    const { token } = this.props;
    const { jenis_produk } = this.props;
    this.setState({jenisProduk:jenis_produk})
    this._getDataChart(token, produkId, '1Y');
  }
  _onRefresh() {
    this.setState({ refreshing: true });
    this._getToken().then(() => {
      this.setState({ refreshing: false })
    });
  }
  componentDidMount() {
    this._getToken();
  }
  
  render() {
    const data = this.state.dataChart;
    const dataValue = data.map((data, key) => data.nav);
    const dataValue2 = data.map((data, key) => data.bechmark);
    return (
      <View refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
        />
      } >
        {
            this.state.isLoadingChart && <Modal transparent={true}><View style={{width: GLOBAL.DEVICE_WIDTH-80,height:70,alignSelf:'center',alignItems:'center',justifyContent:'center',marginTop:230}}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
          }
        <Image source={require('../img/grid.png')} style={{width: GLOBAL.DEVICE_WIDTH-80,height:70,alignSelf:'center',resizeMode:'stretch'}} />
        <LineChart
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          withShadow={false}
          withDots={false}
          data={{
            datasets: [
              {
                seriesName: 'series1',
                data: dataValue,
                color: (opacity = 1) => '#FFD700', // optional
                strokeWidth: 2 // optional,
              },
              {
                seriesName: 'series2',
                data: dataValue2,
                color: (opacity = 1) => '#3c8c3c', // optional
                strokeWidth: 2 // optional
              },
            ],
          }}
          width={(GLOBAL.DEVICE_WIDTH*1)-80} // from react-native
          height={80}
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#FFF',
            backgroundGradientFromOpacity: 0.5,
            backgroundGradientToOpacity: 0.9,
            paddingRight:0,
            paddingTop:0,
            backgroundGradientTo: '#FFF',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 0.1) => '#dddddd',

          }}
          style={{
            position:'absolute'
          }}
          bezier
        />
         {renderIf(this.state.modalVisibleUnAuth == true)(
              <UnAuth visibleModal={this.state.modalVisibleUnAuth}/>
          )}
      </View>

    )
  }
}

class ProdukTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    }
  }

  render() {
    const { produkMap } = this.props;
    console.log('Produk Map', produkMap);
    const { nav } = this.props;
    console.log('nav', nav);
    const { token } = this.props;
    console.log('tokena', token);
    return (
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
        <View style={styles.box}>
          <View style={styles.boxListWhite2}>
              {produkMap.map(produkMap => (
                <View key={produkMap.kode_produk} style={{ width:"100%",
                justifyContent:'center',
                alignContent:'center',
                borderWidth: 1,
                borderRadius:10,
                padding:10,
                backgroundColor:'#FFF',
                flex:1,
                shadowColor:'#efefef',
                shadowOffset:{width:0,height:-2},
                shadowOpacity:0.8,
                shadowRadius:2,
                borderLeftColor: produkMap.kode_warna,
                borderLeftWidth: 3,
                borderTopColor:produkMap.kode_warna,
                borderTopWidth: 3,
                borderRightColor: "#dddddd",
                borderRightWidth: 1, 
                borderBottomColor: "#dddddd", 
                borderBottomWidth: 1 }}>
                  <View style={styles.boxHeadListWhiteRight}>
                    <View style={{flexDirection:'row',alignItems:'center',width:'100%'}}>
                      <Image source={{ uri: produkMap.link_logo }} style={styles.img30}/>
                      <Text style={styles.txtHeadBlack}>{produkMap.nama_produk}</Text>
                    </View>
                  </View>
                  <View style={styles.boxContenListWhite}>
                    <View style={{ flexDirection: 'row', flex: 1, width: '100%', marginBottom: 10 }}>
                      <View style={{ width: "50%" }}>
                        <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                            <TouchableOpacity style={{flexDirection:'row',marginRight:5}} onPress={()=> {Alert.alert('Info', 'CAGR (Compound Annual Growth Rate) adalah tingkat pertumbuhan tahunan rata-rata investasi selama jangka waktu tertentu',
                                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                                { cancelable: false },
                            )} } >
                                <Text style={styles.txtContenListWhite}>CAGR</Text>
                                <Icon name="info-circle" size={10} style={[styles.colorIconInput,{alignSelf:'flex-start'}]} />
                            </TouchableOpacity>
                            <Text style={styles.txtBlackHead3}>{GLOBAL.currency(produkMap.cagr, '.', false)} %</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'flex-end',textAlign:'left',width:'100%',flex:1}}>
                            <TouchableOpacity style={{flexDirection:'row',marginRight:5}} onPress={()=> {Alert.alert('Info', 'AUM (Asset Under Management) adalah dana kelolaan pada reksa dana mengacu pada total nilai dari investasi yang dikelola oleh manager investasi',
                                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                                    { cancelable: false },
                                )} }>
                                <Text style={styles.txtContenListWhite}>AUM</Text>
                                <Icon name="info-circle" size={10} style={[styles.colorIconInput,{alignSelf:'flex-start'}]} />
                            </TouchableOpacity>
                            <Text style={styles.txtBlackHead3}>Rp {GLOBAL.currency(produkMap.aum, '.',true)}</Text>
                        </View>
                      </View>
                      <View style={{ width: "50%" }}>
                        <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end',textAlign:'right',width:'100%',flex:1}}>
                          <TouchableOpacity style={{flexDirection:'row',marginRight:5}} onPress={()=> {Alert.alert('Info', 'Nilai Aktiva Bersih (NAB) adalah nilai yang menggambarkan total kekayaan bersih Reksa Dana setiap harinya',
                                  [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                                  { cancelable: false },
                              )} }>
                              <Text style={styles.txtContenListWhite}>NAB</Text>
                              <Icon name="info-circle" size={10} style={[styles.colorIconInput,{alignSelf:'flex-start'}]} />
                          </TouchableOpacity>
                            <Text style={styles.txtBlackHead3}>{GLOBAL.currency(produkMap.nav, '.', false)}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end',textAlign:'right',width:'100%',flex:1}}>
                            <Text style={[styles.txtContenListWhite,{marginRight:5}]}>Min. beli</Text>
                            <Text style={styles.txtBlackHead3}>Rp {GLOBAL.currency(produkMap.minimal_subs, '.',true)}</Text>
                        </View>
                      </View>
                    </View>
                    <LineChartView produkId={produkMap.id} token={token} jenis_produk={produkMap.jenis_produk} />
                    <View style={{marginTop:5,justifyContent:'flex-end',alignItems:'flex-end'}}>
                      {/* <TouchableOpacity style={styles.btnBeliLittle} onPress={() => nav('ProductDetail', { id: produkMap.id })}>
                        <Text style={styles.txtLittle}>BELI</Text>
                      </TouchableOpacity> */}
                      <AwesomeButton
                          borderRadius={8}
                          backgroundColor="#00a95c"
                          backgroundDarker="#039251"
                          backgroundShadow="#000"
                          width={80}
                          height={30}
                          onPress={() => nav('ProductDetail', { id: produkMap.id })}
                      >
                      <Image source={require('./../img/btnBeli.png')} style={[styles.btnBeliLittleTemp,{resizeMode:'stretch'}]} />
                      <Text style={[{position: 'absolute'},styles.btnTextWhite]}>BELI</Text>
                      </AwesomeButton>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

    )
  }
}
//saham
export default class ProductSahamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(100) ;
    this.state = {
      backClickCount: 0,
      isToast:false,
      page:'Product',
      myToken: '',
      dataProduk: [],
      isLoading: false,
      refreshing: false,
      dataChart: [],
      dataIklan: [],
      modalVisibleUnAuth: false,
      kodePromo:'',
      widthMenu:GLOBAL.DEVICE_WIDTH/3,
      isActive:'saham',
      widthLainya:60,
      heightMenu:54,
      dataJenisProduk:[],
      jmlJenis:0,
      isOffset:0,
      isLimit:3,
    }
  }
  Unauthorized(){
    this.setState({ isLoading: false,modalVisibleUnAuth:true})
    setTimeout(()=> this.logout(),GLOBAL.timeOut);
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
          GLOBAL.gagalKoneksi()
        }
      })
  }

  logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Main')
  }
  mapdataChart(dataNav) {
    console.log('Data Nav', dataNav);
    let res = dataNav
    var count = Object.keys(res).length;
    let data_chart = [];
    for (var i = 0; i < count; i++) {
      data_chart.push({
        nav: res[i].nav
      });
    }
    this.setState({ dataChart: data_chart, });
    const data = this.state.dataChart;
    const dataValue = data.map((data, key) => data.nav);
    return dataValue;

  }
  _onRefresh() {
    this.setState({ refreshing: true });
    this._getToken().then(() => {
      this.setState({ refreshing: false })
    });
  }

  _getProdukList(token, jenisProduk) {
    fetch(GLOBAL.produkListWithToken(jenisProduk), {
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
              isLoading: false,
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
pressTab(kodeJenis){
  this.setState({isActive:kodeJenis});
  this._getProdukList(this.state.myToken,kodeJenis);
}
pressTabLainnya(){
  this._getJenisProduk(this.state.myToken,this.state.isOffset,this.state.isLimit);
}
_getJenisProduk(token,offset,limit) {
  fetch(GLOBAL.getJenisProduk(offset,limit), {
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
                  var count = Object.keys(res.data.jenis).length;
                  let data_menu = [];
                  for (var i = 0; i < count; i++) {
                    data_menu.push({
                      title: res.data.jenis[i].nama_jenis,
                      kode: res.data.jenis[i].kode_jenis,
                    });
                  }
                  if(res.data.jml > 3){
                    var widthMenus = GLOBAL.DEVICE_WIDTH-this.state.widthLainya;
                    this.setState({widthMenu:widthMenus/res.data.jml_row})
                  }
                  this.setState({
                      dataJenisProduk: data_menu,
                      jmlJenis:res.data.jml,
                      isOffset:res.data.set_offset,
                  })
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
    if (aksesToken != null) {
      this.setState({ myToken: aksesToken, dataProduk: [] });
      this._getJenisProduk(this.state.myToken,this.state.isOffset,this.state.isLimit);
      this._getProdukList(this.state.myToken, 'saham');
      this._getIklan(this.state.myToken);

    } else {
      this.Unauthorized()
    }
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.handleBackButton.bind(this) );
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
    const produk = this.state.dataProduk;
    const produkMap = produk.map((produk, key) => produk);
    const { navigate } = this.props.navigation;
    const iklan = this.state.dataIklan;
    const iklanMap = iklan.map((iklan, key) => iklan);
    const menus = this.state.dataJenisProduk;
    const menusMap = menus.map((menus, key) => menus);
    return (
      <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
        <View style={{flexDirection:'row',height: this.state.heightMenu, backgroundColor: GLOBAL.StatusBarColor, borderTopWidth: 0.5, borderTopColor: '#fb9800'}}>
          {menusMap.map(menusMap => (
            <TouchableOpacity 
              key={menusMap.kode} 
              style={{width:this.state.widthMenu,height:this.state.heightMenu,alignItems:'center',justifyContent:'center',fontWeight:platform == 'android'? '800':'600',borderBottomColor:this.state.isActive == menusMap.kode?'#2dd613':'#3b5998',borderBottomWidth:2}}
              onPress={()=>this.pressTab(menusMap.kode)}>
              <Text style={{fontSize:14,color:'#FFF'}}>{"\n"}{menusMap.title}</Text>
            </TouchableOpacity>
          ))}
          {renderIf(this.state.jmlJenis > 3)(
              <TouchableOpacity 
                style={{width:this.state.widthLainya,height:this.state.heightMenu,alignItems:'center',justifyContent:'center',fontWeight:platform == 'android'? '800':'600',borderBottomColor:'#3b5998',borderBottomWidth:2}}
                onPress={()=>this.pressTabLainnya()}>
                <IconAD name="menu-fold" size={16} style={{color:'#FFF'}} />
                <Text style={{fontSize:14,color:'#FFF'}}>Lainnya</Text>
              </TouchableOpacity>
            )}
        </View>
       <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
        {renderIf(this.state.isToast == true)(
              <View style={[styles.wrapper,{justifyContent:'center',alignItems:'center',position:'absolute',zIndex:2}]}>
                  <View style={{height:100,width:"80%",borderWidth:2,borderColor:"#dddddd",backgroundColor:'#eFeFeF',justifyContent:'center',alignItems:'center',borderRadius:20}}>
                      <Text style={{textAlign:'center',color:'#000',fontSize:16,fontWeight:'600'}}>Klik dua kali untuk keluar</Text>
                  </View>
              </View>
          )}
          {
            this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
          }
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
            <View style={styles.containerMain}>
              <ProdukTemplate produkMap={produkMap} nav={navigate} token={this.state.myToken} />
            </View>
            <CarrauselIklan iklanMap={iklanMap} />
          </ScrollView>
        {renderIf(this.state.modalVisibleUnAuth == true)(
              <UnAuth visibleModal={this.state.modalVisibleUnAuth}/>
          )}

      </LinearGradient>
    );
  }
}

// const TabNavigator = createMaterialTopTabNavigator(
//   {
//     Saham: {
//       screen: ProductSahamScreen,
//       navigationOptions: {
//         tabBarLabel: 'Saham',
//       },
//     },
//     Campuran: {
//       screen: ProductCampuranScreen,
//       navigationOptions: {
//         tabBarLabel: 'Campuran',
//       },
//     },
//     PendapatanTetap: {
//       screen: ProductPtScreen,
//       navigationOptions: {
//         tabBarLabel: 'Obligasi',
//       },
//     },
//     MoneyMarket: {
//       screen: ProductMmScreen,
//       navigationOptions: {
//         tabBarLabel: 'Pasar Uang',
//       },
//     },
//   },
//   {
//     tabBarOptions: {
//       activeTintColor: '#FFF',
//       inactiveTintColor: '#dddddd',
//       showIcon: false,
//       style: { height: 54, backgroundColor: GLOBAL.StatusBarColor, borderTopWidth: 0.5, borderTopColor: '#fb9800' },
//       showLabel: true,
//       labelStyle: {
//         fontSize: 10,
//       }
//     }
//   },
// );

// export default createAppContainer(TabNavigator);

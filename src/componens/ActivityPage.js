import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, Animated, View, Platform,Modal,StatusBar,RefreshControl ,FlatList,BackHandler} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeButton from "react-native-really-awesome-button";
import Timeline from 'react-native-timeline-flatlist';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import UnAuth from './UnauthPage';
import CountDown from 'react-native-countdown-component';
import HistoryScreen from './HistoryPage';
import ProductList from './ProdukList';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
var styles = require('../utils/Styles');
import renderIf from './Renderif';
var GLOBAL = require('../utils/Helper');
var statusNasabah;
var platform = Platform.OS;
var page = "Activity";

class OrderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(100) ;
    this.state = {
      backClickCount: 0,
      isToast:false,
      page:'Activity',
      isLoading: false,
      dataOrder: [],
      dataProduk: [],
      refreshing: false,
      colorHeadBackGroud: ['#53e567', '#49c85a', '#39b54a'],
      txtHead: "PEMBELIAN",
      totPorto: "Rp 0",
      hasilKumulatif: "Rp 0",
      tglNab: "NAB per",
      colorHasilKumulatif: "#b9daOa",
      colorTotPorto: "#b9daOa",
      myDate: "",
      jmlTransSub:0,
      modalVisibleUnAuth: false,
      limit:20,
      promo:0,
    }
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
  logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Main')
  }

  viewMore(limit){
    var newLimit = limit*1+20;
    this.setState({limit: newLimit});
    this._onRefresh()
  }

  countDown(timeX) {
    var result;
    if(timeX != null){
      var times = timeX.split(':');
      var s = times[5]*1;
      var m = times[4] * 60;
      var h = times[3] * 60 * 60;
      var d = times[2] * 24 * 60 * 60;
      result = d+h + m + s;
    }else{
      result = 0
    }
    return result;
  }

  _getProdukList(token) {
    this.setState({isLoading:true})
    fetch(GLOBAL.produkListWithToken(), {
        method: 'GET',
        headers: {
            'Accept': 'appication/json',
            'Content-type': 'application/json',
            'Authorization': token,
        },
    })
        .then((response) => {
          this.setState({isLoading:false})
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
              this.setState({isLoading:false})
              this.Unauthorized()
            } else {
              this.setState({isLoading:false})
              GLOBAL.gagalKoneksi()
            }
        })
}
  
  _getOrder = async(token,limit)=> {
    this.setState({isLoading:true})
    // var token = this.state.myToken;
    fetch(GLOBAL.order(limit), {
      method: 'GET',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
        'Authorization': token,
      }
    })
      .then((response) => {
        this.setState({isLoading:false})
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            this.setState({ dataOrder: res.data.order,isLoading:false,jmlTransSub:res.data.jml_transaksi_sub})
          })
        } else if (response.status == '401') {
          this.setState({isLoading:false})
          this.Unauthorized()
        } else {
          this.setState({isLoading:false})
          GLOBAL.gagalKoneksi()
        }
      })
  }
  Unauthorized(){
    this.setState({ isLoading: false,modalVisibleUnAuth:true})
    setTimeout(()=> this.logout(),GLOBAL.timeOut);
}
  renderItem = ({item})=>{
    let data_histori = [];
        data_histori.push({
            title: GLOBAL.convertTglFull(item.tgl_status),
            description: item.last_status,
            circleColor: '#E1AD01',
        });
      return(
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
          <View style={styles.box}>
              <View style={styles.boxListWhite2}>
                <View style={{ width:"100%",
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
                borderLeftColor:item.kode_warna,
                borderLeftWidth: 3,
                borderTopColor:item.kode_warna,
                borderTopWidth: 3,
                borderRightColor: "#dddddd",
                borderRightWidth: 1, 
                borderBottomColor: "#dddddd", 
                borderBottomWidth: 1 }}>
                <View style={styles.boxHeadListWhiteRight}>
                  <View style={{flexDirection:'row'}}>
                    <View style={{ flexDirection: 'row',width:'75%' }} >
                        <Image source={{ uri: item.link_logo }} style={styles.img30} />
                        <View style={{ justifyContent: 'center' }}>
                          <Text style={styles.txtBlackHead}>{item.nama_produk}</Text>
                        </View>
                    </View>
                    <View style={{ width: "25%",justifyContent: 'center',alignItems:'flex-end'}}><Text style={{color:GLOBAL.myBackground(item.tipe),fontSize:14,fontWeight:'400',textAlign:'right'}} >{GLOBAL.manageTipeTransaksi(item.tipe)}</Text></View>
                  </View>
                </View>
                <View style={styles.boxContenListWhite}>
                  <View style={{ flexDirection: 'row', flex: 1, width: '100%', marginBottom: 10 }}>
                    <View style={{ width: "50%",justifyContent:'center',flex:1 }}>
                      <Text style={styles.txtBlackHead3}>{GLOBAL.currencyByTipeTrans(item.nominal, item.unit, item.tipe, '.')}</Text>
                      {/* <Text style={styles.txtContenListWhite}>Status</Text> */}
                      {/* <Text style={{ color: GLOBAL.colorStatus(item.status_transaksi), fontSize: 14, fontWeight: '400' }} >{item.last_status}</Text> */}
                    </View>
                    <View style={{ width: "50%",alignContent:'flex-end',alignItems:'flex-end' }}>
                    {renderIf(item.tipe == 'SUB' && item.status_transaksi == 'pending' && item.flag_upload != 'sudah')(
                      <View>
                        <Text style={styles.txtRedLittle}>Batas Waktu</Text>
                        <View style={{ flexDirection: "row" }}>
                          <Icon name="clock-o" size={20} style={{ alignItems: 'flex-start', margin: 2,color: '#1CC625'}} />
                          <CountDown
                            size={9}
                            until={this.countDown(item.waktu_sisa)}
                            onFinish={() => this._onRefresh.bind(this)}
                            digitStyle={{ backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625' }}
                            digitTxtStyle={{ color: '#1CC625' }}
                            timeLabelStyle={{ color: 'red', fontWeight: 'bold', fontSize: 10 }}
                            separatorStyle={{ color: '#1CC625' }}
                            timeToShow={['H', 'M', 'S']}
                            timeLabels={{ h: '', m: '', s: '' }}
                            showSeparator
                          />
                        </View>
                      </View>
                     )}
                      <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <Icon name="calendar" size={20} style={[styles.colorIconInput,{ marginRight: 2 }]} />
                        <Text style={styles.txtBlueLittle}>{GLOBAL.convertTgl(item.created_at)}</Text>
                      </View>
                    </View>
                  </View> 
                  <View style={styles.blueLine} />
                  <Text style={styles.txtBlueMed}>Status</Text>
                  <Timeline
                    data={data_histori}
                    titleStyle={{marginTop:-13,fontSize:13,color:GLOBAL.StatusBarColor}}
                    descriptionStyle={{fontSize:16,color:"#000",fontWeight:platform == 'android'?'800':'600'}}
                    showTime={false}
                  />
                  <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
                    <View style={{justifyContent:'flex-start',flexDirection:'row',width:'50%'}}>
                      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={()=> this.props.navigation.navigate('OrderDetail',{id:item.id})}>
                        <Text style={styles.btnTextDefault}>....</Text>
                        <Text style={styles.btnTextDefault}>Detail</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center',marginLeft:10 }} onPress={()=> this.props.navigation.navigate('Support')}>
                        <Text style={styles.btnTextDefault}>?</Text>
                        <Text style={styles.btnTextDefault}>Bantuan</Text>
                      </TouchableOpacity>
                    </View>
                    {renderIf(item.tipe == 'SUB' && item.status_transaksi == 'pending' && item.flag_upload != 'sudah')(
                      <View style={{alignContent:'flex-end',alignItems:'flex-end',width:'50%',justifyContent:'flex-end'}}>
                        {/* <TouchableOpacity style={styles.btnBeliLittle} onPress={()=> this.props.navigation.navigate('OrderDetail',{id:item.id})} >
                          <Text style={styles.txtLittle}>BAYAR</Text>
                        </TouchableOpacity> */}
                        <AwesomeButton
                            borderRadius={8}
                            backgroundColor="#00a95c"
                            backgroundDarker="#039251"
                            backgroundShadow="#000"
                            width={80}
                            height={30}
                            style={{marginTop:10}}
                            onPress={()=> this.props.navigation.navigate('OrderDetail',{id:item.id})}
                        >
                        <Image source={require('./../img/btnBeli.png')} style={[styles.btnBeliLittleTemp,{resizeMode:'stretch'}]} />
                        <Text style={[{position: 'absolute'},styles.btnTextWhite]}>BAYAR</Text>
                        </AwesomeButton>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              </View>
            </View>
        </ScrollView>
      )
  }
  _onRefresh(){
    this.setState({refreshing:true});
    this._getToken().then(()=>{
      this.setState({refreshing:false});
    });
  }

  _getToken = async () => {
    var aksesToken = await AsyncStorage.getItem('aksesToken');
    statusNasabah = await AsyncStorage.getItem('statusNasabah');
    if (aksesToken != null) {
      this.setState({ myToken: aksesToken })
      if(statusNasabah == 'aktif'){
        this._getOrder(this.state.myToken,this.state.limit);
      }else if(statusNasabah == 'belum nasabah'){
        this.setState({ statusLengkapiData: false })
      }
      this._getProdukList(this.state.myToken)
    } else {
      this.Unauthorized()
    }
  }
  componentDidMount(){
    this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.handleBackButton.bind(this) );
    const {params} = this.props.navigation.state;
    if(params.update == '1'){
      this._onRefresh()
    }else{
      return this._getToken();
    }
    
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
    const order = this.state.dataOrder;
    const produk = this.state.dataProduk;
    const produkMap = produk.map((produk, key) => produk);
    const { navigate } = this.props.navigation;
    return (
      <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
        <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
        {/* <OfflineNotice /> */}
        
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing = {this.state.refreshing}
                onRefresh ={this._onRefresh.bind(this)}
              />
            }
            >
          <View style={styles.containerMain}>
          {renderIf(this.state.isToast == true)(
                        <View style={[styles.wrapper,{justifyContent:'center',alignItems:'center',position:'absolute',zIndex:2}]}>
                            <View style={{height:100,width:"80%",borderWidth:2,borderColor:"#dddddd",backgroundColor:'#eFeFeF',justifyContent:'center',alignItems:'center',borderRadius:20}}>
                                <Text style={{textAlign:'center',color:'#000',fontSize:16,fontWeight:'600'}}>Klik dua kali untuk keluar</Text>
                            </View>
                        </View>
                    )}
          {renderIf(order.length < 1)(
            <View style={styles.boxNoData}>
            <Text style={styles.txtHeight}>Tidak ada data transaksi </Text>
            <Image source={require('../img/no_activity.png')} style={{width:'100%',height:GLOBAL.DEVICE_HEIGHT*0.25,resizeMode:'contain',justifyContent:'flex-end'}} />
          </View>
          )}
          
          {renderIf(order.length > 0)(
              <View>
              <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.dataOrder}
                  keyExtractor={(x,i)=>i}
                  renderItem={this.renderItem}
                  refreshControl={
                    <RefreshControl
                      refreshing = {this.state.refreshing}
                      onRefresh ={this._onRefresh.bind(this)}
                    />
                  }
              />
              {renderIf(order.length >= this.state.limit)(
                <TouchableOpacity onPress={()=> this.viewMore(this.state.limit)} style={{justifyContent:'center',alignItems:'center',marginBottom:10}}>
                  <Icon name="refresh" size={40} style={{color:"#FFF"}} />
                </TouchableOpacity>
              )}
              </View>
          )}
            <View style={[styles.whiteLine, { marginBottom: 10 }]} ></View>
            <View style={{marginBottom:10}}>
              <ProductList produkMap={produkMap} nav={navigate} pageId={2} promo={this.state.promo}/>
            </View> 
          </View>
        </ScrollView>
        {renderIf(this.state.modalVisibleUnAuth == true)(
            <UnAuth visibleModal={this.state.modalVisibleUnAuth}/>
        )}
      </LinearGradient>
    );
  }
}

const TabNavigator = createMaterialTopTabNavigator(
  {
    Order: {
      screen: OrderScreen,
      params: { update: '0' },
      navigationOptions: {
        tabBarLabel: 'Transaksi',
      },
    },
    History: {
      screen: HistoryScreen,
      navigationOptions: {
        tabBarLabel: 'Riwayat',
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#FFF',
      inactiveTintColor: '#dddddd',
      showIcon: false,
      style: { height: 54, backgroundColor:GLOBAL.StatusBarColor, borderTopWidth: 0.5, borderTopColor: '#fb9800' },
      showLabel: true,
      labelStyle: {
        fontSize: 12,
      }
    }
  },
);
export default createAppContainer(TabNavigator);

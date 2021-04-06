import React, { Component } from 'react';
import NetInfo from "@react-native-community/netinfo";
import {Image, TouchableOpacity, Text, Platform,RefreshControl, View, ActivityIndicator,Modal,StatusBar,Alert,BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native-gesture-handler';
import BlinkingIcon from './src/componens/BlinkingIcon';
import IconBack from 'react-native-vector-icons/Feather';
import Unauth from './src/componens/UnauthPage';
import AsyncStorage from '@react-native-community/async-storage';
import ImpianList from './src/componens/ImpianPage';
import ActivityPage from './src/componens/ActivityPage';
import IntroApp from './src/componens/IntroPage';
import Carrausel from './src/componens/Carrausel';
import { createStackNavigator, createAppContainer,createSwitchNavigator } from 'react-navigation';
import LoginScreen from './src/componens/LoginPage';
import DaftarScreen from './src/componens/DaftarPage';
import ResetScreen from './src/componens/ResetPassPage';
import PinScreen from './src/componens/PinPage';
import DashboardScreen from './src/componens/Dashboard';
import FaqScreen from './src/componens/FaqPage';
import ProductList from './src/componens/ProdukList';
import renderIf from './src/componens/Renderif';
import OrderDetailScreen from './src/componens/OrderDetailPage';
import BuyScreen from './src/componens/BuyPage';
import SellScreen from './src/componens/SellPage';
import SwitchScreen from './src/componens/SwitchPage';
import ProductDetailScreen from './src/componens/ProductDetailPage';
import KalkulatorScreen from './src/componens/KalkulatorFin';
import ProfileScreen from './src/componens/ProfilePage';
import RegistScreen1 from './src/componens/RegistPage1';
import RegistScreen2 from './src/componens/RegistPage2';
import RegistScreen3 from './src/componens/RegistPage3';
import RegistScreen4 from './src/componens/RegistPage4';
import SummaryKalkulator from './src/componens/SummeryKalkulator';
import NotifikasiInvest from './src/componens/NotifikasiInvest';
import EnsiklovetasiInvest from './src/componens/EnsiklovetasiInvest';
import TouchPage from './src/componens/TouchPage';
import NotifikasiScreen from './src/componens/Notifikasi';
import FormNotifInvest from './src/componens/FormNotifInvest';
import SimulasiScreen from './src/componens/SimulasiInvestasi';
import VideoScreen from './src/componens/VideoPage';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import { getModel,getDeviceName } from 'react-native-device-info';
import LoginPage from './src/componens/LoginPage';
import PinPage from './src/componens/PinPage';

var model = DeviceInfo.getModel();
var version = DeviceInfo.getVersion();
var buildNo = DeviceInfo.getBuildNumber();
var GLOBAL= require('./src/utils/Helper')
var styles = require('./src/utils/Styles');
var platform = Platform.OS;
var urlAppStore;
const STATUSBAR_HEIGHT = platform === 'android' ? StatusBar.currentHeight : 50;

class SplashScreen extends React.Component {
 componentDidMount(){
   setTimeout(()=> {this.props.navigation.navigate('Main')},2000)
 }
  render() {
    return (
      <View style={{width:GLOBAL.DEVICE_WIDTH,height:GLOBAL.DEVICE_HEIGHT,justifyContent:'center',alignItems:'center'}}>
        <Image source={require('./src/img/icon.png')} style={{justifyContent:'center',alignSelf:'center',resizeMode:'contain',height:GLOBAL.DEVICE_HEIGHT*0.40}}></Image>
      </View>
    );
  }
}

class MainPage extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      myToken: '',
      statusNasabah: '',
      isConnected: true,
      dataSource:[],
      dataProduk: [],
      viewBlink: true,
      modalSimulasi:false,
      modalVisibleUnAuth: false,
      refreshing: false,
      device_name:'',
      bcBtnLogin:false,
      promo:0,
      myToken:'',
      newVersion:'',
      urlUpdate:'',
      isWajibUpdate:false,
    }
  }
  Unauthorized(){
    this.setState({ isLoading: false,modalVisibleUnAuth:true})
    setTimeout(()=> this.logout(),GLOBAL.timeOut);
  }
  logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Main')
  }

  _getProdukList() {
    fetch(GLOBAL.produkList(), {
        method: 'GET',
        headers: {
            'Accept': 'appication/json',
            'Content-type': 'application/json',
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
                // this.Unauthorized()
            } else {
                // GLOBAL.gagalKoneksi()
            }
        })
  }

  _getSlideList() {
    this.setState({isLoading:true})
    fetch(GLOBAL.slide(),{
      method: 'GET',
      headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
      },
    })
    .then((response) =>{
      this.setState({isLoading:false})
      if (response.status == '201') {
        let res;
        return response.json().then(obj => {
            res = obj;
            this.setState({
              isLoading: false,
              dataSource: res.data.slide,
              //state: this.state["dataImg"].push(responseJson.data.slide[x][0])
            })
        })
      }else {
          GLOBAL.gagalKoneksi()
      }
    })
  }

  _getProfile(token) {
    this.setState({isLoading:true})
    fetch(GLOBAL.profile(), {
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
            if (res.data.status_nasabah != null) {
              this.setState({
                statusNasabah: res.data.status_nasabah
              })
              if (this.state.statusNasabah == 'aktif') {
                this.setState({isLoading:false})
                this.props.navigation.navigate('Pin', { id: null, value: null, title: 'HomeScreen' })
              } else {
                this.setState({isLoading:false})
                this.props.navigation.navigate('Dashboard')
              }
            }
          })
        } else if (response.status == '401') {
          this.setState({isLoading:false})
          this.logout()
        } else {
          this.setState({isLoading:false})
          GLOBAL.gagalKoneksi()
        }
      })
  }

  _postFirebase(tokenFcm,platform) {
    //https://devapi.myhero.id
    fetch(GLOBAL.postFirebase(), {
      method: 'POST',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        token_fcm: tokenFcm,
        platform: platform,
        model: model,
        device_name: this.state.device_name,
      })
    })
      .then((response) => {
        if (response.status == '201') {
          console.log('sukses post')
        } else if (response.status == '401') {
          console.log('gagal')
          // this.logout()
        } else {
          // GLOBAL.gagalKoneksi()
        }
      })
  }
  _getAppVersion() {
    fetch(GLOBAL.appVersion(platform), {
      method: 'GET',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
      },
    })
      .then((response) => {
        this.setState({isLoading:false})
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            var urlPlayStore = res.data.url_appstore;
              if(buildNo < res.data.build_no && res.data.wajib_update == 0){
                Alert.alert('Perhatian', 'Ada pembaruan aplikasi, update sekarang ke versi '+res.data.version,
                  [ { text: 'Nanti', onPress: () => console.log('Cancel Pressed') },
                    { text: 'OK', onPress: () => GLOBAL.openMyURL(urlPlayStore)}
                  ],
                  { cancelable: false },
                );
              }
              if(buildNo < res.data.build_no && res.data.wajib_update == 1){
                this.setState({isWajibUpdate:false,newVersion:res.data.version,urlUpdate:urlPlayStore})
              }
            
          })
        } else if (response.status == '401') {
          console.log('gagal')
          // this.logout()
          GLOBAL.gagalKoneksi()
        } else {
          GLOBAL.gagalKoneksi()
        }
      })
  }

  _getToken = async () => {
    this._getSlideList();
    var aksesToken = await AsyncStorage.getItem('aksesToken');
    AsyncStorage.setItem('statusNasabah', '');
    if (aksesToken != null) {
      this.setState({ myToken: aksesToken});
      this._getProfile(this.state.myToken);
      
    }
    this._getProdukList();
    this._getAppVersion();
  }
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    DeviceInfo.getDeviceName().then(deviceName => {
      this.setState({device_name: deviceName})
    });
    //console.log('fcmToken: '+fcmToken);
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
            //console.log('fcmToken: '+fcmToken);
        }
    }
    if(fcmToken != null){
      await AsyncStorage.setItem('fcmToken', fcmToken);
      this._postFirebase(fcmToken,platform,model,this.state.device_name)
    }
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    console.log('permition is: '+enabled);
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }

  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        // console.log('onNotification:');
         this.showAlert(title, body);
        const localNotification = new firebase.notifications.Notification({
          // sound:'sampleaudio',
          show_in_foreground: true,
        })
        .setNotificationId(notification.notificationId)
        .setTitle(title)
        .setBody(body)
        .android.setChannelId('fcm_default_channel')
        .android.setColor('#000000')
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .ios.setAlertAction(body);
    
        firebase.notifications()
        .displayNotification(localNotification)
        .catch(err => console.error(err));
        
    });

    const channel = new firebase.notifications.Android.Channel('fcm_default_channel','My Hero',firebase.notifications.Android.Importance)
     .setDescription('My Hero description')
     .setSound('sampleaudio.mp3');
     firebase.notifications().android.createChannel(channel);
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        console.log('onNotificationOpened:');
        this.showAlert(title, body);
    });
  
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        console.log('getInitialNotification:');
        this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  _onRefresh() {
    this.setState({ refreshing: true });
    this.checkPermission();
    this.createNotificationListeners();
    this._getToken().then(() => {
        this.setState({ refreshing: false })
    });
  }
  getBtnStyle(touched) {
    if(touched == true) {
     return {
      shadowColor:"#000",shadowOffset:{width:0,height:2},shadowOpacity:0.8,shadowRadius:1,marginBottom:15
     }
    } else {
      return {
        marginBottom:15
      }
    }
   }
  handleBackButton = () => {
    if(this.state.backClickCount < 1){
      this.setState({isToast:true});
      setTimeout(()=>this.setState({isToast:false}),500)
      this._spring()
    }else{
        this.setState({isToast:false});
        BackHandler.exitApp()
    }
    return true;
};

  componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange',this.handleConnectionChange)
    this.checkPermission();
    this.createNotificationListeners();
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert("Perhatian", "Apakah Anda yakin ingin keluar aplikasi?",
          [{ text: "Tidak", onPress: () => { } }, { text: "Ya", onPress: () => BackHandler.exitApp() }],
          { cancelable: false }
      );
        return true;
    });
    this._getToken();
  }

  componentWillUnmount(){
      NetInfo.isConnected.removeEventListener('connectionChange',this.handleConnectionChange)
      this.notificationListener();
      this.notificationOpenedListener();
      this.backHandler.remove();
  }

  handleConnectionChange = isConnected => {
      this.setState({isConnected});
      this.setState({isLoading:false});
  }
 
  render() {
    const img = this.state.dataSource;
    const images = img.map((img, key) => '' + img.link_file);
    const produk = this.state.dataProduk;
    const produkMap = produk.map((produk, key) => produk);
    const { navigate } = this.props.navigation;
    return (
      <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
        {renderIf(platform =='ios')(
          <View style={{height:STATUSBAR_HEIGHT,backgroundColor:'#FFF'}}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
          </View>
        )}
        {renderIf(platform =='android')(
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        )}
          {renderIf(!this.state.isConnected)(
            <Modal animationType={"slide"} transparent={false} visible={!this.state.isConnected}>
              <View style={{justifyContent:'center',padding:10,alignItems:'center',backgroundColor:'#FFF',height:GLOBAL.DEVICE_HEIGHT}}>
              <Image source={require('./src/img/no_connection.png')} style={{justifyContent:'center',alignSelf:'center',resizeMode:'contain',height:GLOBAL.DEVICE_HEIGHT*0.25}}/>
              <Text style={styles.btnTxtDefault}>Yah, internet kamu putus</Text>
              </View>
          </Modal>
          )}
          {renderIf(this.state.isWajibUpdate)(
            <Modal animationType={"slide"} transparent={true} visible={this.state.isWajibUpdate}>
                <View style={{flex:1,borderRadius:20,padding:10,backgroundColor:'#efefef',height:160,marginTop:GLOBAL.DEVICE_HEIGHT/2-80,marginBottom:GLOBAL.DEVICE_HEIGHT/2-80,marginLeft:50,marginRight:50,width:GLOBAL.DEVICE_WIDTH-100}}>
                  <Text style={{marginBottom:10,fontSize:20,textAlign:'center',color:'#000',height:30}}>Perhatian</Text>
                  <View style={{justifyContent:'center',alignItems:'center',flex:1,height:200-60}}>
                    <Text style={[styles.txtHeadBlack,{textAlign:'center',textAlignVertical: "center"}]}>Ada pembaruan aplikasi, update sekarang ke versi {this.state.newVersion}</Text>
                  </View>
                  <View style={{flex:1,justifyContent:'flex-end'}}>
                    <TouchableOpacity style={{borderTopWidth:1,marginTop:10,borderTopColor:'#000',height:30,justifyContent:'center'}} onPress={()=>GLOBAL.openMyURL(this.state.urlUpdate)}>
                      <Text style={styles.btnTxtDefault}>Ok</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </Modal>
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
          <View style={styles.logoContain}>
              <Image source={require('./src/img/Logo.png')} style={styles.imgLogo} />
          </View>
          <View style={styles.carrauselContain}>
            <Carrausel images={images} />
          </View>
          <View style={styles.footerBottom}>
            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={[styles.btnLogin,{marginBottom:15}]}>
                <Text style={styles.btnTextWhite2}>MASUK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Daftar')} style={styles.btnDaftar}>
                <Text style={styles.btnTxtDefault}>DAFTAR</Text>
            </TouchableOpacity> */}
            
            <AwesomeButton
                borderRadius={15}
                backgroundColor='#4F7942'
                backgroundShadow="#000"
                backgroundDarker="#45673a"
                height={40}
                style={{marginBottom:15}}
                width={GLOBAL.DEVICE_WIDTH*0.5}
                onPress={() => this.props.navigation.navigate('Login') }
            >
            <Image source={require('./src/img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5,height:40,resizeMode:'stretch'}} />
            <Text style={styles.btnTextWhite}>MASUK</Text>
            </AwesomeButton>
            <AwesomeButton
                borderRadius={15}
                backgroundColor='#fdfdfd'
                backgroundShadow="#000"
                // backgroundDarker="#e6e2e2"
                height={40}
                style={{marginBottom:10}}
                textColor="#0843bf"
                textSize={16}
                textLineHeight={600}
                width={GLOBAL.DEVICE_WIDTH*0.5}
                onPress={() => this.props.navigation.navigate('Daftar')}
            >DAFTAR
            </AwesomeButton>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize: 14,color: '#FFF',}}>Yuk cari tahu tentang MyHero, </Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Faq')}>
                <Text style={styles.txtDefault}>klik di sini</Text>
              </TouchableOpacity>
            </View>
            
            {
              this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
            }
          </View>
          <View style={styles.blinkingArrawContainer}>
            {renderIf(this.state.viewBlink)(
                <BlinkingIcon name="ios-arrow-down"/>
            )}
          </View>
          <View style={styles.containerMain}>
          <IntroApp />
          {/* pageId = 1 for page awal, pageId = 2 for page Home */}
          <ImpianList nav={navigate} pageId={1} />
          <ProductList produkMap={produkMap} nav={navigate} pageId={1} promo={this.state.promo} />
          
          <View style={{width:'100%',flexDirection:'row',height:50,justifyContent:'center',alignItems:'center'}}>
             <Text style={styles.txtLittle}>Terdaftar dan diawasi oleh</Text>
             <Image source={require('./src/img/ojklogo.png')} style={{ width: 100, height: 30,resizeMode:'contain' }} />
          </View>
          </View>
        </ScrollView>
        {renderIf(this.state.modalVisibleUnAuth == true)(
            <Unauth visibleModal={this.state.modalVisibleUnAuth} />
        )}
      </LinearGradient>
    );
  }
}
const RootStack = createStackNavigator(
  {
    Main: MainPage,
    Login:{
      screen: LoginPage,
      // navigationOptions: ({ navigation }) => {
      //     let headerTitle = 'MASUK';
      //     let headerBackTitle = null;
      //     let headerLeft = null;
      //     let headerRight = null;
      //     let headerStyle = styles.headerWhite;
      //     let headerTitleStyle = {color: '#0843bf', fontWeight: '600', fontSize: 16,flex:1,textAlign:'center',justifyContent:'center'}
      //     return { headerTitle, headerBackTitle, headerStyle, headerTitleStyle,headerLeft,headerRight };
      // },
    },
    Activity: {
      screen: ActivityPage
    },
    Daftar: {
      screen: DaftarScreen,
      navigationOptions: ({ navigation }) => {
        let headerTitle = (<View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintBlue} /></TouchableOpacity>
          <View style={styles.headerCenter}><Text style={styles.headerTitle}>DAFTAR</Text></View>
          <View style={styles.headerRight}></View>
          </View>);
        let headerLeft = null;
        let headerRight = null;
        let headerStyle = styles.headerWhite;
        return { headerTitle, headerLeft, headerStyle,headerRight};
      }
    },
    Reset: {
      screen: ResetScreen,
      navigationOptions: ({ navigation }) => {
        let headerTitle = (<View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintBlue} /></TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>PEMULIHAN PASSWORD</Text>
          </View>
          <View style={styles.headerRight}></View></View>);
        let headerLeft = null;
        let headerRight = null;
        let headerStyle = styles.headerWhite;
        return { headerTitle, headerLeft, headerStyle,headerRight};
      }
    },
    Pin: {
      screen: PinScreen,
      navigationOptions: () => ({
        header: null,
        gesturesEnabled: false,
      }),
    },
    Dashboard: {
      screen: DashboardScreen,
      navigationOptions: () => ({
        header: null,
        gesturesEnabled: false,
      }),
    },
    Faq:{
      screen: FaqScreen,
      navigationOptions: ({ navigation }) => {
        let headerTitle = (<View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitleWhite}>FAQ</Text>
          </View>
          <View style={styles.headerRight}></View></View>);
        let headerLeft = null;
        let headerRight = null;
        let headerStyle = styles.headerStyle;
        return { headerTitle, headerLeft, headerStyle,headerRight};
      }
    },
    VideoScreen: {
      screen: VideoScreen,
      navigationOptions: () => ({
        header: null,
        gesturesEnabled: false,
      }),
    },
    ProductDetail: {
      screen: ProductDetailScreen,
      navigationOptions: ({ navigation }) => {
          let headerTitle = (<View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
          <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>DETAIL PRODUK</Text></View>
              <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                  <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
              </View>);
          let headerLeft = null;
          let headerRight = null;
          let headerStyle = styles.headerStyle;
          return { headerTitle, headerLeft, headerStyle,headerRight};
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => {
        let headerTitle = (<View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
              <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>PROFIL</Text></View>
              <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                  <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
              </View>);
        let headerLeft = null;
        let headerRight = null;
        let headerStyle = styles.headerStyle;
        return { headerTitle, headerLeft, headerStyle,headerRight};
      }
    },
    Notifikasi: {
      screen: NotifikasiScreen,
      navigationOptions: ({ navigation }) => {
        let headerTitle = (<View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
              <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>Notifikasi</Text></View>
              <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                  <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
              </View>);
        let headerLeft = null;
        let headerRight = null;
        let headerStyle = styles.headerStyle;
        return { headerTitle, headerLeft, headerStyle,headerRight};
      }
    },
    Regist1: {
        screen: RegistScreen1,
        navigationOptions: ({ navigation }) => {
            let headerTitle = (<View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>REGISTRASI</Text></View>
                <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                    <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                </View>);
            let headerLeft = null;
            let headerRight = null;
            let headerStyle = styles.headerStyle;
            return { headerTitle, headerLeft, headerStyle,headerRight};
        }
    },
    Regist2: {
        screen: RegistScreen2,
        navigationOptions: ({ navigation }) => {
            let headerTitle = (<View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>REGISTRASI</Text></View>
                <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                    <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                </View>);
            let headerLeft = null;
            let headerRight = null;
            let headerStyle = styles.headerStyle;
            return { headerTitle, headerLeft, headerStyle,headerRight};
        }
    },
    Regist3: {
        screen: RegistScreen3,
        navigationOptions: ({ navigation }) => {
            let headerTitle = (<View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>REGISTRASI</Text></View>
                <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                    <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                </View>);
            let headerLeft = null;
            let headerRight = null;
            let headerStyle = styles.headerStyle;
            return { headerTitle, headerLeft, headerStyle,headerRight};
        }
    },
    Regist4: {
        screen: RegistScreen4,
        navigationOptions: ({ navigation }) => {
            let headerTitle = (<View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>REGISTRASI</Text></View>
                <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                    <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                </View>);
            let headerLeft = null;
            let headerRight = null;
            let headerStyle = styles.headerStyle;
            return { headerTitle, headerLeft, headerStyle,headerRight};
        }
    },
    Kalkulator: {
        screen: KalkulatorScreen,
        navigationOptions: ({ navigation }) => {
            let headerTitle = (<View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>KALKULATOR KEUANGAN</Text></View>
                <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                    <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                </View>);
            let headerLeft = null;
            let headerRight = null;
            let headerStyle = styles.headerStyle;
            return { headerTitle, headerLeft, headerStyle,headerRight};
        }
    },
    SummeryKal: {
        screen: SummaryKalkulator,
        navigationOptions: ({ navigation }) => {
            let headerTitle = (<View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>KALKULATOR KEUANGAN</Text></View>
                <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                    <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                </View>);
            let headerLeft = null;
            let headerRight = null;
            let headerStyle = styles.headerStyle;
            return { headerTitle, headerLeft, headerStyle,headerRight};
        }
    },
    NotifikasiInvest: {
        screen: NotifikasiInvest,
        navigationOptions: ({ navigation }) => {
            let headerTitle = (<View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>NOTIFIKASI INVESTASI</Text></View>
                <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                    <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                </View>);
            let headerLeft = null;
            let headerRight = null;
            let headerStyle = styles.headerStyle;
            return { headerTitle, headerLeft, headerStyle,headerRight};
        }
    },
    EnsiklovetasiInvest: {
      screen: EnsiklovetasiInvest,
      navigationOptions: ({ navigation }) => {
          let headerTitle = (<View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
              <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>ENSIKLOVETASI</Text></View>
              {/* <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                  <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity> */}
              </View>);
          let headerLeft = null;
          let headerRight = null;
          let headerStyle = styles.headerStyle;
          return { headerTitle, headerLeft, headerStyle,headerRight};
      }
  },
    FormNotifInvest: {
        screen: FormNotifInvest,
        navigationOptions: ({ navigation }) => {
            let headerTitle = (<View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
                <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>NOTIFIKASI INVESTASI</Text></View>
                <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                    <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                </View>);
            let headerLeft = null;
            let headerRight = null;
            let headerStyle = styles.headerStyle;
            return { headerTitle, headerLeft, headerStyle,headerRight};
        }
    },
    Buy: {
      screen: BuyScreen,
      navigationOptions: ({ navigation }) => {
          let headerTitle = (<View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
              <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>BELI</Text></View>
              <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                  <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
              </View>);
          let headerLeft = null;
          let headerRight = null;
          let headerStyle = styles.headerStyle;
          return { headerTitle, headerLeft, headerStyle,headerRight};
      }
    },
    Sell: {
      screen: SellScreen,
      navigationOptions: ({ navigation }) => {
          let headerTitle = (<View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate('PortfolioScreen')} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
              <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>JUAL</Text></View>
              <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                  <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
              </View>);
          let headerLeft = null;
          let headerRight = null;
          let headerStyle = styles.headerStyle;
          return { headerTitle, headerLeft, headerStyle,headerRight};
      }
    },
    Switch: {
      screen: SwitchScreen,
      navigationOptions: ({ navigation }) => {
          let headerTitle = (<View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate('PortfolioScreen')} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
              <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>SWITCH</Text></View>
              <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                  <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
              </View>);
          let headerLeft = null;
          let headerRight = null;
          let headerStyle = styles.headerStyle;
          return { headerTitle, headerLeft, headerStyle,headerRight};
      }
    },
    OrderDetail: {
      screen: OrderDetailScreen,
      navigationOptions: ({ navigation }) => {
          let headerTitle = (<View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
              <View style={styles.headerCenter}><Text style={styles.headerTitleWhite}>DETAIL TRANSAKSI</Text></View>
              <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Profile')} >
                  <Image source={require('./src/img/user.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
              </View>);
          let headerLeft = null;
          let headerRight = null;
          let headerStyle = styles.headerStyle;
          return { headerTitle, headerLeft, headerStyle,headerRight};
      }
    },
    SimulasiInvestasi: {
      screen: SimulasiScreen,
      navigationOptions: ({ navigation }) => {
          let headerTitle = (<View style={styles.header}><TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} ><IconBack name="chevron-left" size={25} style={styles.headerTintBlue} /></TouchableOpacity><View style={styles.headerCenter}><Text style={styles.headerTitle}>SIMULASI INVESTASI</Text></View><View style={styles.headerRight}></View></View>);
          let headerLeft = null;
          let headerRight = null;
          let headerStyle = styles.headerWhiteStyle;
          return { headerTitle, headerLeft, headerStyle,headerRight};
      }
    },
  },
  {
      initialRouteName: 'Main',    
  }
);
const InitialNavigator = createSwitchNavigator({
  Splash: SplashScreen,
  App: RootStack
});
const AppContainer = createAppContainer(RootStack);
const AppContainer2 = createAppContainer(InitialNavigator);
export default class App extends Component {
  render() {
    if(platform == 'android'){
      return <AppContainer2 />;
    }else{
      return <AppContainer />;
    }
  }
}



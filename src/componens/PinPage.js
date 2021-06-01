
import React, { Componentk, useState } from 'react';
import { Text, Image, View, TouchableOpacity, ActivityIndicator,TextInput, Alert, Modal, StatusBar, RefreshControl,BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView } from 'react-native-gesture-handler';
import PinView from 'react-native-pin-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconBack from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import TouchID from 'react-native-touch-id';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');
import UnAuth from './UnauthPage';
import renderIf from './Renderif';
var titleValue = null;

class PinPage extends React.Component {

  
  static navigationOptions = ({ navigation }) => {
    headers = null
  }
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      idProduk: null,
      valueProduk: null,
      title: null,
      myToken: '',
      pin1: '',
      pin2: '',
      pin3: '',
      pin4: '',
      pin5: '',
      pin6: '',
      isEditPin1: true,
      isEditPin2: false,
      isEditPin3: false,
      isEditPin4: false,
      isEditPin5: false,
      isEditPin6: false,
      refreshing: false,
      modalVisibleUnAuth: false,
      modalVisible:false,
      emailValue:'',
      pinBaru:'',
      pinKonfirm:'',
      secureTextEntry: true,
      secureTextEntry1: true,
      statusEye: 'eye-slash',
      statusEye1: 'eye-slash',
      backIcon: false,
      goBack:'',
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

  _buy(token, idProduk, nominal,kodeMetode,noVa,promo,clear) {
    fetch(GLOBAL.beliSimpan(), {
      method: 'POST',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        produk_id: idProduk,
        nominal: nominal,
        no_va: noVa,
        kode_metode: kodeMetode,
        kode_promo:promo,
      })
    })
      .then((response) => {
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            Alert.alert('Sukses', 'Transaksi berhasil. Segera lakukan pembayaran sebelum masa berlaku berakhir',
              [{ text: 'OK', onPress: () => this.props.navigation.navigate('Order',{update:'1'}) }],
              { cancelable: false },
            );
          })
        } else if (response.status == '401') {
          this.Unauthorized()
        } else if (response.status == '400') {
          let res;
          return response.json().then(obj => {
            res = obj;
            if(res.message == "Pin tidak valid"){
              Alert.alert('Perhatian', 'Pin Anda salah',
                [{ text: 'OK', onPress: () => console.log('Ok Pressed') }],
                { cancelable: false },
              );
            }else{
              Alert.alert('Perhatian', '' + res.message,
                [{ text: 'OK', onPress: () => this.props.navigation.navigate('Order',{update:'1'}) }],
                { cancelable: false },
              );
            }
           
          })
        } else {
          GLOBAL.gagalKoneksi()
        }
      })
  }

  _sell(token, idProduk, unit,clear) {
    fetch(GLOBAL.jualSimpan(), {
      method: 'POST',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        produk_id: idProduk,
        unit: unit
      })
    })
      .then((response) => {
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            Alert.alert('Sukses', 'Transaksi berhasil',
              [{ text: 'OK', onPress: () => this.props.navigation.navigate('Order',{update:'1'})}],
              { cancelable: false },
            );
          })
        } else if (response.status == '401') {
          this.Unauthorized()
        } else if (response.status == '400') {
          let res;
          return response.json().then(obj => {
            res = obj;
            if(res.message == "Pin tidak valid"){
              Alert.alert('Perhatian', 'PIN tidak valid',
                [{ text: 'OK', onPress: () => console.log('Ok Pressed') }],
                { cancelable: false },
              );
            }else{
              Alert.alert('Perhatian', '' + res.message,
                [{ text: 'OK', onPress: () => this.props.navigation.navigate('Order',{update:'1'}) }],
                { cancelable: false },
              );
            }
            
          })
        } else {
          GLOBAL.gagalKoneksi()
        }
      })
  }
  _switch(token, params) {
    fetch(GLOBAL.switch(), {
      method: 'POST',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        params: params
      })
    })
      .then((response) => {
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            Alert.alert('Sukses', 'Switch berhasil',
              [{ text: 'OK', onPress: () => this.props.navigation.navigate('Order',{update:'1'})}],
              { cancelable: false },
            );
          });
        } else {
          let res;
          return response.json().then(obj => {
            res = obj;
            Alert.alert('Perhatian',res.message,
              [{text: 'OK', onPress: () => this.setState({modalVisible: false}) }],
              {cancelable: false},
          );
          });
        }
      })
  }
  _cekPin(token, pinValue,clear) {
    const { params } = this.props.navigation.state;
    console.log('Params Cek Pin', params);
    if (pinValue.length != 6) {
      Alert.alert('Perhatian', 'PIN tidak valid',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    } else {
      fetch(GLOBAL.cekPinProfile(), {
        method: 'POST',
        headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          pin: pinValue
        })
      })
        .then((response) => {
          if (response.status == '201') {
            if(params.switch) {
              this._switch(this.state.myToken, params.switch); 
            } else {
              if (params.id != null && params.value != null && params.title != null) {
                if(params.title == 'SUB') {
                  if(params.kodeMetode != null && params.no_va != null && params.kode_promo != null){
                    this._buy(this.state.myToken, params.id, params.value,params.kodeMetode,params.no_va,params.kode_promo,clear)
                  }
                }else if(params.title == 'RED') {
                  this._sell(this.state.myToken, params.id, params.value,clear)
                }
              }else {
                this.props.navigation.navigate('Home')
              }
            }
            this.props.navigation.navigate('Home')
          } else if (response.status == '401') {
            this.Unauthorized()
          } else if (response.status == '400') {
            Alert.alert('Perhatian', 'PIN tidak valid',
              [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
              { cancelable: false },
            );
          } else {
            GLOBAL.gagalKoneksi()
          }
        })
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
            if (res.data.user.email != null) {
              this.setState({ emailValue: res.data.user.email })
            }
          })
        } else if (response.status == '401') {
          this.Unauthorized()
        } else {
          GLOBAL.gagalKoneksi()
        }
      })
  }

  onTongelEyesPress(StringHolder) {
    switch (StringHolder) {
      case '0':
        if (!this.state.secureTextEntry) {
          this.setState({
            statusEye: "eye-slash", secureTextEntry: !this.state.secureTextEntry,
          })
        } else {
          this.setState({
            statusEye: "eye", secureTextEntry: !this.state.secureTextEntry,
          })
        }
        break;
      case '1':
        if (!this.state.secureTextEntry1) {
          this.setState({
            statusEye1: "eye-slash", secureTextEntry1: !this.state.secureTextEntry1,
          })
        } else {
          this.setState({
            statusEye1: "eye", secureTextEntry1: !this.state.secureTextEntry1,
          })
        }
        break;
    }

  }

  resetPin(token){
    this.setState({isLoading:true})
    fetch(GLOBAL.resetPin(),{
      method: 'POST',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        email:this.state.emailValue,
        pin_baru: this.state.pinBaru,
      })
    })
    .then((response) => {
      this.setState({isLoading:false})
      if (response.status == '201') {
        let res;
        return response.json().then(obj => {
          res = obj;
          Alert.alert('Sukses',res.message,
              [{text: 'OK', onPress: () => this.setState({modalVisible: false}) }],
              {cancelable: false},
          );
          
        })
      } else if (response.status == '401') {
        this.Unauthorized()
      } else if (response.status == '400') {
        let res2;
        return response.json().then(obj => {
          res2 = obj;
          Alert.alert('Perhatian',res2.message,
              [{text: 'OK', onPress: () => this.setState({modalVisible: false}) }],
              {cancelable: false},
          );
          
        })
      } else {
        GLOBAL.gagalKoneksi()
      }
    })

  }

  _pinComplete(pin, clear) {
    this._cekPin(this.state.myToken, pin,clear)
    clear();
  }

  _getToken = async () => {
    var aksesToken = await AsyncStorage.getItem('aksesToken');
    const { params } = this.props.navigation.state;
    if(params.title != 'HomeScreen'){
      this.setState({goBack:params.title,backIcon:true})
    }else{
      this.setState({goBack:'HomeScreen',backIcon:false})
    }
    if (aksesToken != null) {
      this.setState({ myToken: aksesToken });
      this._getProfile(this.state.myToken);
      
    } else {
      this.Unauthorized()
    }
  }

  pressGoBack(){
    const { params } = this.props.navigation.state;
    this.props.navigation.navigate('Home')
    if(params.title == 'SUB'){
      this.props.navigation.navigate('Buy', { id: params.id, nilaiInvest: params.value })
    }else if(params.title == 'RED'){
      this.props.navigation.navigate('Sell', { id: params.id})
    }else{
      this.props.navigation.navigate('Home')
    }
  }
  _onRefresh() {
    this.setState({ refreshing: true });
    this._getToken().then(() => {
      this.setState({ refreshing: false })
    });
  }

  touchFunc() {
    const optionalConfigObject = {
      unifiedErrors: false,
      passcodeFallback: false 
    }
    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
      // Success code
      if (biometryType === 'FaceID') {
          console.log('FaceID is supported.');
      } else {
          console.log('TouchID is supported.');
      }
      this.handleLogin();
    })
      .catch(error => {
        console.log('Error Touch : ' + error);
      });
  }

  handleLogin() {
    const { params } = this.props.navigation.state;
    const configs = {
      title: 'Fingerprint Authentication',
      color: '#FF0000',
      sensorErrorDescription: 'Fingerprint invalid',
    };
    TouchID.authenticate('Login', configs)
      .then(success => {
        if(params.switch) {
          this._switch(this.state.myToken, params.switch);
        } else {
          if (params.id != null && params.value != null && params.title != null) {
            if(params.title == 'SUB') {
              if(params.kodeMetode != null && params.no_va != null && params.kode_promo != null){
                this._buy(this.state.myToken, params.id, params.value,params.kodeMetode,params.no_va,params.kode_promo,clear)
              }
            }else if(params.title == 'RED') {
              var clear = '';
              this._sell(this.state.myToken, params.id, params.value,clear)
            }
          }else {
            this.props.navigation.navigate('Home')
          }
        }
      })
      .catch(error => {
        console.log('Authentication Failed' + error);
      });
  }
  componentDidMount() {
    this.touchFunc();
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert("Perhatian", "Apakah Anda yakin ingin keluar aplikasi?",
          [{ text: "Tidak", onPress: () => { } }, { text: "Ya", onPress: () => BackHandler.exitApp() }],
          { cancelable: false }
      );
      return true;
  });
    return this._getToken();
  }

  componentWillUnmount() {
    this.backHandler.remove();
}

  render() {
    const { params } = this.props.navigation.state;
    return (
      <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
        <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
          
            {
              this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
            }
          <View style={{flexDirection: 'row',paddingTop:60,marginBottom:50}}>
              {renderIf( params.title != 'HomeScreen')(
                <TouchableOpacity style={styles.headerLeft} onPress={()=> this.pressGoBack()}><IconBack name="chevron-left" size={25} style={styles.headerTintWhite} /></TouchableOpacity>
              )}
              <View style={{alignItems:'center',justifyContent:'center',width:params.title != 'HomeScreen' ? GLOBAL.DEVICE_WIDTH-65:GLOBAL.DEVICE_WIDTH}}>
                <Text style={{ color: '#FFF', fontSize: 18, textAlign: 'center', fontWeight: '600'}}>Masukan PIN Kamu</Text>
              </View>
          </View>
          <View style={styles.pinContain}>
            <PinView
              inputBgColor="#FFF"
              inputActiveBgColor="#FFF"
              onComplete={(val, clear) => { this._pinComplete(val, clear) }}
              pinLength={6} />
          </View>
          <View style={styles.footerBottom}>
            <AwesomeButton
                borderRadius={15}
                backgroundColor='#e52757'
                backgroundShadow="#000"
                backgroundDarker="#cc2851"
                height={40}
                style={{marginBottom: 10}}
                width={GLOBAL.DEVICE_WIDTH*0.5-20}
                onPress={this.logout}
            >
            <Image source={require('./../img/btnLogout.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-20,height:40,resizeMode:'stretch'}} />
            <Text style={[{position: 'absolute'},styles.btnTextWhite]}>KELUAR</Text>
            </AwesomeButton>
            <TouchableOpacity onPress={()=>this.setState({modalVisible: true})}>
              <Text style={styles.btnTextWhite}>Lupa PIN? Reset PIN</Text>
            </TouchableOpacity>
          </View>
        {renderIf(this.state.modalVisibleUnAuth == true)(
          <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
        )}
        {/* modal Pin update */}
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}>
          <View style={styles.wrapper}>
            <View style={styles.modalFormInput}>
              <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{height:GLOBAL.DEVICE_HEIGHT-100}}>
                  <View style={styles.inputGroup} >
                    <Text style={styles.txtBlackHead}>Email</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput style={styles.textInput} placeholder="Email" value={this.state.emailValue} editable={false}/>
                      <View style={styles.iconGroup}>
                        <Icon name="envelope-o" size={20} />
                      </View>
                    </View>
                  </View>
                  <View style={styles.inputGroup} >
                    <Text style={styles.txtBlackHead}>PIN baru</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput {...this.props} style={styles.textInput}
                        secureTextEntry={this.state.secureTextEntry} placeholder="Konfirmasi PIN" keyboardType='number-pad' maxLength={6} onChangeText={(pinBaru) => this.setState({ pinBaru })} />
                      <TouchableOpacity onPress={() => this.onTongelEyesPress('0')} style={styles.iconGroup}>
                        <Icon name={this.state.statusEye} size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.inputGroup} >
                    <Text style={styles.txtBlackHead}>Konfirmasi PIN</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput {...this.props} style={styles.textInput}
                        secureTextEntry={this.state.secureTextEntry1} placeholder="Konfirmasi PIN" keyboardType='number-pad' maxLength={6} onChangeText={(pinKonfirm) => this.setState({ pinKonfirm })} />
                      <TouchableOpacity onPress={() => this.onTongelEyesPress('1')} style={styles.iconGroup}>
                        <Icon name={this.state.statusEye1} size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={styles.modalFormBtnBottom}>
              <View style={{ flexDirection: "row", flex: 1 }}>

                <AwesomeButton
                      borderRadius={15}
                      backgroundColor='#28ccfb'
                      backgroundShadow="#000"
                      backgroundDarker="#23b6e0"
                      height={40}
                      width={GLOBAL.DEVICE_WIDTH*0.5-25}
                      style={{marginTop:10,alignSelf:'flex-end', marginRight:20}}
                      onPress={() => this.setState({ modalVisible: false })}
                  >
                  <Image source={require('./../img/btnPrev.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                  <Text style={[{position: 'absolute'},styles.btnTextWhite]}>BATAL</Text>
                  </AwesomeButton>

                  <AwesomeButton
                      borderRadius={15}
                      backgroundColor='#4F7942'
                      backgroundShadow="#000"
                      backgroundDarker="#45673a"
                      height={40}
                      width={GLOBAL.DEVICE_WIDTH*0.5-25}
                      style={{marginTop:10,alignSelf:'flex-end'}}
                      onPress={() => this.resetPin(this.state.myToken)}
                  >
                  <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                  <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SIMPAN</Text>
                  </AwesomeButton>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    );
  }
}

export default PinPage;

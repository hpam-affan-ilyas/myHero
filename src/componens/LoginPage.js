
import React, { Component } from 'react';
import { Text, View,Platform  , KeyboardAvoidingView, TouchableOpacity, Image, Dimensions, TextInput, Alert, ActivityIndicator, Modal, StatusBar, BackHandler } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeButton from "react-native-really-awesome-button";
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import CountDown from 'react-native-countdown-component';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import { getModel,getDeviceName } from 'react-native-device-info';

var model = DeviceInfo.getModel();
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');
var platform = Platform.OS;
class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.field1 = React.createRef(); 
    this.field2 = React.createRef(); 
    this.state = {
      isLoading: false,
      secureTextEntry: true,
      iconEye: "eye-slash",
      tokenFcm: '',
      username: '',
      password: '',
      Ppass:'Password', 
      Pemail:'Email', 
      device_name:'',
      other_device_message:'',
      modalVisible: false,
      other_device_token:'',
      key:'',
    }
  }

  verifikasiOtherDevice(otherdeviceToken,username,key,token_fcm){
      this.setState({ isLoading: true });
      if(this.state.key.length == 0){
        Alert.alert('Gagal', 'Kode verifikasi tidak boleh kosong',
                [{ text: 'OK', onPress: () => console.log('Ok Pressed') }],
                { cancelable: false },
              );
      }else{
        fetch(GLOBAL.otherDevice(), {
          method: 'POST',
          headers: {
            'Accept': 'appication/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email: username,
            token: otherdeviceToken,
            key: key,
            token_fcm: token_fcm,
          })
        })
        .then((response) => {
          this.setState({isLoading:false,modalVisible:false})
          if (response.status == '201') {
            let res;
            this.setState({confirmCount: 0});
            return response.json().then(obj => {
              res = obj;
              this.setState({modalVisible:false})
              AsyncStorage.setItem('aksesToken', 'Bearer ' + res.data.api_token);
              this.props.navigation.navigate('HomeScreen');
            })
          }else{
            let res2;
            return response.json().then(obj => {
              res2 = obj;
              this.setState({modalVisible:false});
              alert(res2.message);
            })
            
          }
        })
      }
    
  }

  loginProses() {
  
    if (this.state.username.length == 0) {
      this.setState({ isLoading: false });
      Alert.alert('Perhatian', 'Email tidak boleh kosong',
        [{text: 'OK',
          onPress: () => { const textInput = this.field1.current;
          textInput.focus()}
        }],
        {cancelable: false},
      );
    } else if (this.state.password.length == 0) {
      this.setState({ isLoading: false });
      Alert.alert('Perhatian', 'Password tidak boleh kosong',
        [{text: 'OK',
          onPress: () => { const textInput = this.field2.current;
          textInput.focus()}
        }],
        {cancelable: false},
      );
    } else {
      console.log("masuk sini dong");
      this.setState({ isLoading: true });
      fetch(GLOBAL.login(), {
        method: 'POST',
        headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.username,
          password: this.state.password,
          token_fcm: this.state.tokenFcm,
          device_name:this.state.device_name,
          device_model: model,
        })
      })
      .then((response) => {
        this.setState({isLoading:false})
        console.log("Response Status", response.status);
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            AsyncStorage.setItem('aksesToken', 'Bearer ' + res.data.api_token);
            this.props.navigation.navigate('HomeScreen');
          })
        } else if (response.status == '200') {
          let res1;
          return response.json().then(obj => {
            res1 = obj;
            this.setState({
              other_device_message: res1.message,
              other_device_token:res1.data.otherdevice_token,
              modalVisible:true
            })
            // setTimeout(()=> this.setState({modalVisible:false}),700000);
          })
        }else{
          let res2;
          return response.json().then(obj => {
            res2 = obj;
            alert(res2.message);
          })
          
        }
      })

    }
  }

  onTongelEyesPress = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
    });
    if (!this.state.secureTextEntry) {
      this.setState({
        iconEye: "eye-slash",
      })
    } else {
      this.setState({
        iconEye: "eye",
      })
    }
  }
  async getToken() {
    DeviceInfo.getDeviceName().then(deviceName => {
      this.setState({device_name: deviceName})
    });
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    var platform = Platform.OS;
    //console.log('fcmToken: '+fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
        //console.log('fcmToken: '+fcmToken);
      }
    }
    if (fcmToken != null) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
      this.setState({ tokenFcm: fcmToken })
      // this._postFirebase(fcmToken, platform)
    }
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    console.log('permition is: ' + enabled);
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

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate('Main');
      return true;
    });
    this.checkPermission();
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  setFocus(label){
    switch(label){
        case 'email':
            this.setState({Lemail:'Email',Pemail:''})
            break;
        case 'pass':
            this.setState({Lpass:'Password',Ppass:''})
            break;
    }
}

setBlur(label){
    switch(label){
        case 'email':
            if(this.state.username .length == 0){
                this.setState({Lemail:'',Pemail:'Email'})
            }else{
                this.setState({Lemail:'Email',Pemail:''})
            }
            break;
        case 'pass':
            if(this.state.password.length == 0){
                this.setState({Lpass:'',Ppass:'Password'})
            }else{
                this.setState({Lpass:'Password',Ppass:''})
            }
            break;
    }
}
  render() {
    return (
      <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" hidden={false} />

        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}>
          <View style={{ width: GLOBAL.DEVICE_WIDTH, height: GLOBAL.DEVICE_HEIGHT, flex: 1 }}>
            <View style={styles.logoContain}>
              <Image source={require('../img/Logo.png')} style={styles.imgLogo} />
            </View>
            {
              this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
            }
            <View style={{ flex: 1, width: '100%', height: '75%' }}>
              <View style={{ marginLeft: 20, marginRight: 20, width: GLOBAL.DEVICE_WIDTH - 40, height: '80%', justifyContent: 'center' }}>
                <View style={styles.inputGroup} >
                <Text style={styles.labelText}>{this.state.Lemail}</Text>
                  <View style={styles.textInputGroup}>
                    <TextInput ref={this.field1} autoCapitalize='none' onFocus={()=>this.setFocus('email')} onBlur={()=>this.setBlur('email')} onSubmitEditing={() =>{ const textInput = this.field2.current;
                        textInput.focus()} } style={styles.textInput} placeholderTextColor="#000000" placeholder={this.state.Pemail} keyboardType='email-address'
                      onChangeText={(username) => this.setState({ username })} />
                    <TouchableOpacity style={styles.iconGroup}>
                      <Icon style={styles.colorIconInput} name="envelope-o" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup} >
                  <Text style={styles.labelText}>{this.state.Lpass}</Text>
                  <View style={styles.textInputGroup}>
                    <TextInput {...this.props}
                      onFocus={()=>this.setFocus('pass')} onBlur={()=>this.setBlur('pass')}
                      style={styles.textInput}
                      ref={this.field2}
                      placeholderTextColor="#000000"
                      onSubmitEditing={() => this.loginProses()}
                      secureTextEntry={this.state.secureTextEntry} placeholder={this.state.Ppass}  keyboardType='default'
                      onChangeText={(password) => this.setState({ password })} />
                    <TouchableOpacity onPress={this.onTongelEyesPress} style={styles.iconGroup}>
                      <Icon name={this.state.iconEye} style={{color:'#7d7d7d'}} size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.btnContainer}>
                  {/* <TouchableOpacity onPress={() => this.loginProses()} style={styles.btnLogin}>
                    <Text style={styles.btnTextWhite2}>MASUK</Text>
                  </TouchableOpacity> */}
                  <AwesomeButton
                      borderRadius={15}
                      backgroundColor='#4F7942'
                      backgroundShadow="#000"
                      backgroundDarker="#45673a"
                      height={40}
                      width={GLOBAL.DEVICE_WIDTH*0.5}
                      onPress={() => this.loginProses()}
                  >
                  <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5,height:40,resizeMode:'stretch'}} />
                  <Text style={[{position: 'absolute'},styles.btnTextWhite]}>MASUK</Text>
                  </AwesomeButton>

                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Reset')} style={{flexDirection:'row',margin:10}}>
                    <Text style={{fontSize:16,color:'#FFF',fontWeight:platform == 'android'?'800':'600'}}>Lupa password? </Text>
                    <Text style={{fontSize:16,color:'#45d4fd',fontWeight:platform == 'android'?'800':'600'}}>Klik di sini</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{flexDirection:'row'}} onPress={() => this.props.navigation.navigate('Daftar')}>
                    <Text style={{fontSize:16,color:'#FFF',fontWeight:platform == 'android'?'800':'600'}}>Belum punya akun? </Text>
                    <Text style={{fontSize:16,color:'#45d4fd',fontWeight:platform == 'android'?'800':'600'}}>Daftar</Text>
                  </TouchableOpacity>

                </View>

              </View>
              <View style={{ width: '100%', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10 }}>
                <Text style={styles.txtLittle}>Powered by PT Henan Putihrai Asset Management</Text>
              </View>
            </View>
          </View>
          
        </ScrollView>

          <Modal animationType={"slide"} transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => this.setState({modalVisible: false}) }>
            <View style={styles.wrapper}>
              <KeyboardAvoidingView behavior="position">
                <View style={{width:'100%',height:250,backgroundColor:'#FFF',marginTop:GLOBAL.DEVICE_HEIGHT-250}} >
                  <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <View style={{padding:15,justification:'center',alignItems:'center'}} >
                      <Text style={{fontWeight:'600',fontSize:14,color:'#000',textAlign:'center'}}>{this.state.other_device_message}</Text>
                      <View style={{justifyContent:'center',alignItems:'center',marginBottom:10,marginTop:5}} >
                        <TextInput maxLength={5} style={styles.textInputAuth} placeholder="Masukkan Kode Verifikasi" keyboardType='number-pad' onChangeText={(key) => this.setState({ key })} />
                      </View>
                      <CountDown
                        size={14}
                        until={420}
                        onFinish={() => this.setState({modalVisible:false,other_device_token:''})}
                        digitStyle={{ backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625' }}
                        digitTxtStyle={{ color: '#1CC625' }}
                        timeLabelStyle={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}
                        separatorStyle={{ color: '#1CC625' }}
                        timeToShow={['M', 'S']}
                        timeLabels={{ m: '', s: '' }}
                        showSeparator
                      />
                    </View>
                  </ScrollView>
                  <View style={[styles.modalFormBtnBottom, { flexDirection: "row" }]}>
                    <AwesomeButton
                      borderRadius={15}
                      backgroundColor='#28ccfb'
                      backgroundShadow="#000"
                      backgroundDarker="#23b6e0"
                      height={40}
                      width={GLOBAL.DEVICE_WIDTH * 0.5 - 25}
                      style={{ marginTop: 10, alignSelf: 'flex-end', marginRight: 10 }}
                      onPress={() => this.setState({ modalVisible: false })}
                    >
                      <Image source={require('./../img/btnPrev.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5 - 25, height: 40, resizeMode: 'stretch' }} />
                      <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>BATAL</Text>
                    </AwesomeButton>
                    <AwesomeButton
                          borderRadius={15}
                          backgroundColor='#4F7942'
                          backgroundShadow="#000"
                          backgroundDarker="#45673a"
                          height={40}
                          style={{marginTop:10}}
                          width={GLOBAL.DEVICE_WIDTH*0.5-25}
                          onPress={() => this.verifikasiOtherDevice(this.state.other_device_token,this.state.username,this.state.key,this.state.tokenFcm) }
                      >
                      <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                      <Text style={[{position: 'absolute'},styles.btnTextWhite]}>VERIFIKASI</Text>
                    </AwesomeButton>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
        </Modal>
      
      </LinearGradient>
    );
  }
}
export default LoginPage;

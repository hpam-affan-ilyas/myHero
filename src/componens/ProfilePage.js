
import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, StatusBar,KeyboardAvoidingView, Dimensions, View, Platform, TextInput, Alert, Modal, ActivityIndicator, RefreshControl,BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import CountDown from 'react-native-countdown-component';
import AsyncStorage from '@react-native-community/async-storage';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-picker';
import UnAuth from './UnauthPage';
import renderIf from './Renderif';
import DeviceInfo from 'react-native-device-info';
var platform = Platform.OS;
var version = DeviceInfo.getVersion();
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');

class ProfilePage extends React.Component {

  constructor(props) {
    super(props);
    this.field1 = React.createRef(); 
    this.field2 = React.createRef(); 
    this.field3 = React.createRef(); 
    this.field4 = React.createRef(); 
    this.field5 = React.createRef(); 
    this.field6 = React.createRef(); 
    this.field7 = React.createRef(); 
    this.field8 = React.createRef(); 
    this.field9 = React.createRef(); 
    this.field10 = React.createRef(); 
    this.field12 = React.createRef(); 
    this.state = {
      isLoading: false,
      txtBtnProfile: 'Lengkapi Data',
      myToken: '',
      statusBtnProfile: false,
      statusNasabah: 'pending',
      namaValue: '',
      firstName: '',
      lastName: '',
      labelName: '',
      emailValue: '',
      emailBaruValue:'',
      noHpValue: '',
      passValue: '',
      pinValue: '',
      editName: false,
      editEmail: false,
      editHp: false,
      editPass: false,
      editPin: false,
      secureTextEntry0: true,
      secureTextEntry1: true,
      secureTextEntry2: true,
      secureTextEntry3: true,
      secureTextEntry4: true,
      secureTextEntry5: true,
      statusEye0: 'eye-slash',
      statusEye1: 'eye-slash',
      statusEye2: 'eye-slash',
      statusEye3: 'eye-slash',
      statusEye4: 'eye-slash',
      statusEye5: 'eye-slash',
      passwordInput: '',
      passwordKonfirm: '',
      pinKonfirm: '',
      statusPin: true,
      modalVisible1: false,
      modalVisible2: false,
      modalVisible3: false,
      modalVisible4: false,
      modalVisible5: false,
      refreshing: false,
      modalVisibleUnAuth: false,
      modalVisibleKey:false,
      disableBtnSimpan:false,
      key:'',
      verifikasiHeadTitle:'',
      avatar:null,
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
  setModalVisible(isForm, isVisible) {
    switch (isForm) {
      case '1':
        if (isVisible == true) {
          this.setState({ modalVisible1: true });
        } else {
          this.setState({ modalVisible1: false });
        }
        break;
      case '2':
        if (isVisible == true) {
          this.setState({ modalVisible2: true,emailBaruValue:'' });
        } else {
          this.setState({ modalVisible2: false });
        }
        break;
      case '3':
        if (isVisible == true) {
          this.setState({ modalVisible3: true });
        } else {
          this.setState({ modalVisible3: false });
        }
        break;
      case '4':
        if (isVisible == true) {
          this.setState({ modalVisible4: true });
        } else {
          this.setState({ modalVisible4: false });
        }
        break;
      case '5':
        if (isVisible == true) {
          this.setState({ modalVisible5: true });
        } else {
          this.setState({ modalVisible5: false });
        }
        break;
    }
  }
  _editProfileName(token) {
    if (this.state.firstName.length == 0) {
      Alert.alert('Perhatian', 'Nama depan tidak boleh kosong',
        [{ text: 'OK', 
        onPress: () => { 
          const textInput = this.field1.current;
          textInput.focus();
         } }],
        { cancelable: false },
      );
    } else {
      fetch(GLOBAL.editNamaProfile(), {
        method: 'POST',
        headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          nama: this.state.firstName,
          last_name: this.state.lastName,
        })
      })
        .then((response) => {
          if (response.status == '201') {
            let res;
            return response.json().then(obj => {
              res = obj;
              if (res.data.user.last_name != null) {
                this.setState({ lastName: res.data.user.last_name })
              } else {
                this.setState({ lastName: '' })
              }
              if (res.data.user.name != null) {
                this.setState({ firstName: res.data.user.name })
                this.setState({ namaValue: this.state.firstName + ' ' + this.state.lastName })
              }
              Alert.alert('Sukses', '' + res.message,
                [{ text: 'OK', onPress: () => this.setModalVisible('1', false) }],
                { cancelable: false },
              );
            }).done()
          } else if (response.status == '401') {
            this.Unauthorized()
          } else {
            Alert.alert('Gagal', 'Nama gagal disimpan, periksa jaringan internet Anda',
              [{ text: 'OK', onPress: () => this.setModalVisible('1', false) }],
              { cancelable: false },
            );
          }
        })
    }
  }
  
  verifikasiEmailBaru(key,emailBaru){
    if(this.state.key.length == 0){
      Alert.alert('Perhatian', 'Kode verifikasi tidak boleh kosong',
        [{ text: 'OK',
        onPress: () => console.log("ok pressed") }],
        { cancelable: false },
      );
    }else{
      fetch(GLOBAL.verifikasiChangeEmail(), {
        method: 'POST',
        headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
          'Authorization': this.state.myToken,
        },
        body: JSON.stringify({
          key: key,
          email_baru: emailBaru,
        })
      })
        .then((response) => {
          if (response.status == '201') {
            let res;
            return response.json().then(obj => {
              res = obj;
              Alert.alert('Sukses', res.message,
                [{ text: 'OK', onPress: () => {this.setState({modalVisibleKey:false}); this.logout() } }],
                { cancelable: false },
              );
            })
          } else if (response.status == '401') {
            this.Unauthorized()
          }else if(response.status == '400'){
            let res;
            return response.json().then(obj => {
              res = obj;
              Alert.alert('Gagal', res.message,
                [{ text: 'OK', onPress: () => this.setState({modalVisibleKey:false}) }],
                { cancelable: false },
              );
            })
          } else {
            Alert.alert('Gagal', 'Verifikasi kode gagal, periksa jaringan internet Anda',
              [{ text: 'OK', onPress: () => this.setState({modalVisibleKey:false}) }],
              { cancelable: false },
            );
          }
        })
    }
  }

  _editProfileEmail(token) {
    if (this.state.emailValue.length == 0) {
      Alert.alert('Perhatian', 'Email tidak boleh kosong',
        [{ text: 'OK',
        onPress: () => { 
          const textInput = this.field3.current;
          textInput.focus();
         } }],
        { cancelable: false },
      );
    } else if (!this.state.emailValue.match(GLOBAL.mailFormat)) {
      Alert.alert('Perhatian', 'Alamat email tidak valid',
        [{ text: 'OK',
        onPress: () => { 
          const textInput = this.field3.current;
          textInput.focus();
         } }],
        { cancelable: false },
      );
    } else {
      this.setState({disableBtnSimpan:true})
      fetch(GLOBAL.editEmailProfile(), {
        method: 'POST',
        headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          email: this.state.emailBaruValue,
        })
      })
        .then((response) => {
          this.setState({disableBtnSimpan:false})
          if (response.status == '201') {
            let res;
            return response.json().then(obj => {
              res = obj;
              Alert.alert('Sukses', res.message,
                [{ text: 'OK', onPress: () => this.setState({modalVisible2:false,verifikasiHeadTitle:res.message ,modalVisibleKey:true}) }],
                { cancelable: false },
              );
            })
          } else if (response.status == '401') {
            this.Unauthorized()
          }else if (response.status == '400') {
            let res;
            return response.json().then(obj => {
              res = obj;
              Alert.alert('Gagal', res.message,
                [{ text: 'OK', onPress: () => this.setState({modalVisible2:false}) }],
                { cancelable: false },
              );
            })
          }else {
            Alert.alert('Gagal', 'Email gagal disimpan, periksa jaringan internet Anda',
              [{ text: 'OK', onPress: () => this.setState({modalVisible2:false}) }],
              { cancelable: false },
            );
          }
        })
    }
  }

  _editProfileNoHp(token) {
    if (this.state.noHpValue.length == 0) {
      Alert.alert('Perhatian', 'No ponsel tidak boleh kosong',
        [{ text: 'OK',
        onPress: () => { 
          const textInput = this.field4.current;
          textInput.focus();
         } }],
        { cancelable: false },
      );
    } else if (!this.state.noHpValue.match(GLOBAL.numbersFormat)) {
      Alert.alert('Perhatian', 'No ponsel tidak valid, hanya diizinkan angka',
        [{ text: 'OK',
        onPress: () => { 
          const textInput = this.field4.current;
          textInput.focus();
         } }],
        { cancelable: false },
      );
    } else {
      fetch(GLOBAL.editNoHpProfile(), {
        method: 'POST',
        headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          nohp: this.state.noHpValue,
        })
      })
        .then((response) => {
          if (response.status == '201') {
            let res;
            return response.json().then(obj => {
              res = obj;
              if (res.data.user.no_hp != null) {
                this.setState({ noHpValue: res.data.user.no_hp })
              }
              Alert.alert('Sukses', '' + res.message,
                [{ text: 'OK', onPress: () => this.setModalVisible('3', false) }],
                { cancelable: false },
              );
            })
          } else if (response.status == '401') {
            this.Unauthorized()
          } else {
            Alert.alert('Gagal', 'No ponsel gagal disimpan, periksa jaringan internet Anda',
              [{ text: 'OK', onPress: () => this.setModalVisible('3', false) }],
              { cancelable: false },
            );
          }
        })
    }
  }

  _editProfilePass(token) {
    if (this.state.passValue.length == 0) {
      Alert.alert('Perhatian','Password lama tidak boleh kosong',
        [{ text: 'OK',
        onPress: () => { 
          const textInput = this.field5.current;
          textInput.focus();
         } }],
        { cancelable: false },
      );
    } else if (this.state.passwordInput.length == 0) {
      Alert.alert('Perhatian', 'Password baru tidak boleh kosong',
        [{ text: 'OK',
        onPress: () => { 
          const textInput = this.field6.current;
          textInput.focus();
         } }],
        { cancelable: false },
      );
    } else if (this.state.passwordInput != this.state.passwordKonfirm) {
      Alert.alert('Perhatian', 'Konfirmasi password tidak valid',
        [{ text: 'OK',
        onPress: () => { 
          const textInput = this.field7.current;
          textInput.focus();
         } }],
        { cancelable: false },
      );
    } else {
      fetch(GLOBAL.editPasswordProfile(), {
        method: 'POST',
        headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          password_lama: this.state.passValue,
          password: this.state.passwordInput,
          password2: this.state.passwordKonfirm,
        })
      })
        .then((response) => {
          if (response.status == '201') {
            let res;
            return response.json().then(obj => {
              res = obj;
              this.setState({passValue:'',passwordInput:'',passwordKonfirm:''})
              Alert.alert('Sukses', '' + res.message,
                [{ text: 'OK', onPress: () => this.logout() }],
                { cancelable: false },
              );
            })
          } else if (response.status == '401') {
            this.setModalVisible('4', false)
            this.Unauthorized()
          } else if (response.status == '400') {
            let res;
            return response.json().then(obj => {
              res = obj;
              Alert.alert('Gagal', '' + res.message,
                [{ text: 'OK', onPress: () => console.log('ok pressed') }],
                { cancelable: false },
              );
            })
          } else {
            Alert.alert('Gagal', 'Password gagal disimpan, periksa jaringan internet Anda',
              [{ text: 'OK', onPress: () => this.setModalVisible('4', false) }],
              { cancelable: false },
            );
          }
        })
    }
  }

  _cekPin(token, value) {
    if (value.length != 6) {
      Alert.alert('Perhatian', 'PIN lama tidak valid',
        [{ text: 'OK',
        onPress: () => { 
          const textInput = this.field8.current;
          textInput.focus();
         } }],
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
          pin: value
        })
      })
        .then((response) => {
          if (response.status == '201') {
            this._editProfilePin(token)
          } else if (response.status == '401') {
            this.Unauthorized()
          } else if (response.status == '400') {
            Alert.alert('Perhatian', 'PIN lama tidak valid',
              [{ text: 'OK',
              onPress: () => { 
                const textInput = this.field8.current;
                textInput.focus();
               } }],
              { cancelable: false },
            );
          } else {
            GLOBAL.gagalKoneksi()
          }
        })
    }
  }

  _editProfilePin(token) {
    if (this.state.pinBaru.length != 6) {
      Alert.alert('Perhatian', 'PIN baru tidak boleh kurang atau lebih dari 6 digit',
        [{ text: 'OK',
        onPress: () => { 
          const textInput = this.field9.current;
          textInput.focus();
         } }],
        { cancelable: false },
      );
    } else if (!this.state.pinBaru.match(GLOBAL.numbersFormat)) {
      Alert.alert('Perhatian', 'PIN baru tidak valid, hanya diizinkan angka',
        [{ text: 'OK',
        onPress: () => { 
          const textInput = this.field9.current;
          textInput.focus();
         } }],
        { cancelable: false },
      );
    } else if (this.state.pinBaru != this.state.pinKonfirm) {
      Alert.alert('Perhatian', 'Konfirmasi PIN tidak valid',
        [{ text: 'OK',
        onPress: () => { 
          const textInput = this.field10.current;
          textInput.focus();
         } }],
        { cancelable: false },
      );
    } else {
      fetch(GLOBAL.editPinProfile(), {
        method: 'POST',
        headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          pin: this.state.pinKonfirm,
        })
      })
        .then((response) => {
          if (response.status == '201') {
            let res;
            return response.json().then(obj => {
              res = obj;
              this.setState({pinBaru:'',pinKonfirm:'',pinValue:''})
              Alert.alert('Sukses', '' + res.message,
                [{ text: 'OK', onPress: () => this.setModalVisible('5', false) }],
                { cancelable: false },
              );
            })
          } else if (response.status == '401') {
            this.setModalVisible('5',false);
            this.Unauthorized()
          } else {
            Alert.alert('Gaga', 'PIN gagal disimpan, periksa jaringan internet Anda',
              [{ text: 'OK', onPress: () => this.setModalVisible('5', false) }],
              { cancelable: false },
            );
          }
        })
    }
  }

  takeAvatar() {
    var option = { title: 'Pilih Gambar',cancelButtonTitle:'Batal',maxWidth:GLOBAL.maxWidthUploadImage,maxHeight:GLOBAL.maxHeightUploadImage,quality:1, storageOption: { skipBackup: true, path: 'images' }, takePhotoButtonTitle: 'Kamera', chooseFromLibraryButtonTitle: 'Galeri' };
    ImagePicker.showImagePicker(option, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        alert(response.error)
      } else if (response.customButton) {
      } else {
        var uri = response.uri;
        // if(Platform.OS == 'android' && response.width > 720){
        //   var newWidth = response.width*50/100;
        //   var newHeight = response.height*50/100;
        //   ImageResizer.createResizedImage(uri, newWidth, newHeight, "JPEG", 50, rotation = 0).then((res) => {
        //     this.uploadAvatar(res.uri);
        //   }).catch((err) => {
        //     // Oops, something went wrong. Check that the filename is correct and
        //     // inspect err to get more details.
        //     alert(err)
        //   });
        // }else{
          this.uploadAvatar(uri);
             // You can also display the image using data:
            // const source = 'data:image/jpeg;base64,' + response.data;
        // }
        
      }
    });
  }

  uploadAvatar(uriAvatar){
    this.setState({isLoading:true});
    let uploadData = new FormData();
    uploadData.append('avatar', {
        type: 'image/jpeg',
        name: 'imgAvatar',
        uri: uriAvatar,
    });
    fetch(GLOBAL.editFotoProfile(), {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': this.state.myToken,
      },
      body: uploadData
  })
  .then((response) => {
    this.setState({ isLoading: false });
      if (response.status == '201') {
          let res;
          return response.json().then(obj => {
              res = obj;
              Alert.alert('Sukses', 'Foto profil berhasil diupload',
                  [{ text: 'OK', onPress: () => this.setState({avatar:res.data.user.avatar_user}) }],
                  { cancelable: false },
              );
          })
      } else if (response.status == '401') {
          this.Unauthorized()
      } else if (response.status == '400') {
          let res;
          return response.json().then(obj => {
              res = obj;
              Alert.alert('Gagal', res.message,
                  [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                  { cancelable: false },
              );
          })
      } else {
          GLOBAL.gagalKoneksi()
      }
  })
  }

  onTongelEyesPress(StringHolder) {
    switch (StringHolder) {
      case '0':
        if (!this.state.secureTextEntry0) {
          this.setState({
            statusEye0: "eye-slash", secureTextEntry0: !this.state.secureTextEntry0,
          })
        } else {
          this.setState({
            statusEye0: "eye", secureTextEntry0: !this.state.secureTextEntry0,
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
      case '2':
        if (!this.state.secureTextEntry2) {
          this.setState({
            statusEye2: "eye-slash", secureTextEntry2: !this.state.secureTextEntry2,
          })
        } else {
          this.setState({
            statusEye2: "eye", secureTextEntry2: !this.state.secureTextEntry2,
          })
        }
        break;
      case '3':
        if (!this.state.secureTextEntry3) {
          this.setState({
            statusEye3: "eye-slash", secureTextEntry3: !this.state.secureTextEntry3,
          })
        } else {
          this.setState({
            statusEye3: "eye", secureTextEntry3: !this.state.secureTextEntry3,
          })
        }
        break;
      case '4':
        if (!this.state.secureTextEntry4) {
          this.setState({
            statusEye4: "eye-slash", secureTextEntry4: !this.state.secureTextEntry4,
          })
        } else {
          this.setState({
            statusEye4: "eye", secureTextEntry4: !this.state.secureTextEntry4,
          })
        }
        break;
      case '5':
        if (!this.state.secureTextEntry5) {
          this.setState({
            statusEye5: "eye-slash", secureTextEntry5: !this.state.secureTextEntry5,
          })
        } else {
          this.setState({
            statusEye5: "eye", secureTextEntry5: !this.state.secureTextEntry5,
          })
        }
        break;
    }

  }
  _onRefresh() {
    this.setState({ refreshing: true });
    this._getToken().then(() => {
      this.setState({ refreshing: false })
    });
  }
  onPressRegist() {
    AsyncStorage.setItem('namaValue', this.state.namaValue);
    AsyncStorage.setItem('emailValue', this.state.emailValue);
    AsyncStorage.setItem('noHpValue', this.state.noHpValue);
    this.props.navigation.navigate('Regist1')
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
            if (res.data.status_nasabah != null) {
              this.setState({ statusNasabah: res.data.status_nasabah })
              if (res.data.status_nasabah != 'aktif') {
                this.setState({ statusPin: false })
              }
              if (res.data.status_nasabah == 'belum nasabah' ) {
                this.setState({ statusBtnProfile: true })
              }else{
                this.setState({ statusBtnProfile: false })
              }
            }
            if (res.data.user.last_name != null) {
              this.setState({ lastName: res.data.user.last_name })
            } else {
              this.setState({ lastName: '' })
            }
            if (res.data.user.name != null) {
              this.setState({ firstName: res.data.user.name })
              this.setState({ namaValue: this.state.firstName + ' ' + this.state.lastName })
            }
            if (res.data.user.email != null) {
              this.setState({ emailValue: res.data.user.email })
              AsyncStorage.setItem('emailValue', res.data.user.email);
            }
            if (res.data.user.no_hp != null) {
              this.setState({ noHpValue: res.data.user.no_hp })
              AsyncStorage.setItem('noHpValue', res.data.user.no_hp);
            }
            if (res.data.user.avatar_user != null) {
              this.setState({ avatar: res.data.user.avatar_user })
            }else{
              this.setState({ avatar:'' })
            }
          })
        } else if (response.status == '401') {
          this.Unauthorized()
        } else {
          GLOBAL.gagalKoneksi()
        }
      })
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
            if (res.data.status_nasabah != null) {
              this.setState({ statusNasabah: res.data.status_nasabah })
              if (res.data.status_nasabah != 'aktif') {
                this.setState({ statusPin: false })
              }
              if (res.data.status_nasabah == 'belum nasabah' ) {
                this.setState({ statusBtnProfile: true })
              }else{
                this.setState({ statusBtnProfile: false })
              }
            }
            if (res.data.user.last_name != null) {
              this.setState({ lastName: res.data.user.last_name })
            } else {
              this.setState({ lastName: '' })
            }
            if (res.data.user.name != null) {
              this.setState({ firstName: res.data.user.name })
              this.setState({ namaValue: this.state.firstName + ' ' + this.state.lastName })
            }
            if (res.data.user.email != null) {
              this.setState({ emailValue: res.data.user.email })
              AsyncStorage.setItem('emailValue', res.data.user.email);
            }
            if (res.data.user.no_hp != null) {
              this.setState({ noHpValue: res.data.user.no_hp })
              AsyncStorage.setItem('noHpValue', res.data.user.no_hp);
            }
            if (res.data.user.avatar_user != null) {
              this.setState({ avatar: res.data.user.avatar_user })
            }else{
              this.setState({ avatar:'' })
            }
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
      this.setState({ myToken: aksesToken })
      this._getProfile(this.state.myToken);
    } else {
      this.Unauthorized()
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack();
      return true;
    });
    this._getToken();
  }
  componentWillUnmount() {
    this.backHandler.remove();
}
  render() {
    return (
      <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
        <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
        <View style={{ height: GLOBAL.DEVICE_HEIGHT - 130 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >
            <View style={{flexDirection:'row',justifyContent:'center',marginTop:20}}>
              <Image source={this.state.avatar == null ? require('../img/user.png'): { uri: this.state.avatar }} style={{ width: 120, height: 120,resizeMode:'cover',borderRadius:60}} />
              <TouchableOpacity style={{alignItems:'flex-end',justifyContent:'flex-end',marginLeft:-30}} onPress={()=>this.takeAvatar()}>
                <Icon name="camera" size={20} style={[{backgroundColor:'#FFF',padding:10,borderRadius:20,justifyContent:'center',width:40,height:40},styles.colorIconInput]} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalForm}>
              {
                this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
              }
              <View style={styles.inputGroup} >
                <Text style={styles.labelText}>Nama </Text>
                <TouchableOpacity style={styles.textInputGroup} onPress={() => this.setState({ modalVisible1: true })}>
                  <Text style={styles.textInput} >{this.state.namaValue}</Text>
                  <View style={styles.iconImgGroup} >
                    <Image source={require('../img/edit.png')} style={{ width: 30, height: 30 }} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.inputGroup} >
                <Text style={styles.labelText}>Email</Text>
                <TouchableOpacity style={styles.textInputGroup} onPress={() => this.setModalVisible('2', true)}>
                  <Text style={styles.textInput} >{this.state.emailValue}</Text>
                  <View style={styles.iconImgGroup} >
                    <Image source={require('../img/edit.png')} style={{ width: 30, height: 30 }} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.inputGroup} >
                <Text style={styles.labelText}>Nomor Ponsel</Text>
                <TouchableOpacity style={styles.textInputGroup} onPress={() => this.setModalVisible('3', true)}>
                  <Text style={styles.textInput} >{this.state.noHpValue}</Text>
                  <View style={styles.iconImgGroup} >
                    <Image source={require('../img/edit.png')} style={{ width: 30, height: 30 }} />
                  </View>
                </TouchableOpacity>
                </View>
              <View style={styles.inputGroup} >
                <Text style={styles.labelText}>Password</Text>
                <TouchableOpacity style={styles.textInputGroup} onPress={() => this.setModalVisible('4', true)}>
                  <Text style={styles.textInput}>********</Text>
                  <View style={styles.iconImgGroup} >
                    <Image source={require('../img/edit.png')} style={{ width: 30, height: 30 }} />
                  </View>
                </TouchableOpacity>
              </View>
              {renderIf(this.state.statusPin)(
                <View style={styles.inputGroup} >
                  <Text style={styles.labelText}>PIN</Text>
                  <TouchableOpacity style={styles.textInputGroup} onPress={() => this.setModalVisible('5', true)}>
                    <Text style={styles.textInput}>******</Text>
                    <View style={styles.iconImgGroup} >
                      <Image source={require('../img/edit.png')} style={{ width: 30, height: 30 }} />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {/* <View style={{ flexDirection: "row", marginTop: 30, flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
              
              {/* <View style={styles.boxBtnBottom}>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 10 }}>
                  <Text style={styles.txtLittle}>Versi App {version}</Text>
                </View>
              </View> */}
            </View>
          </ScrollView>
        </View>
        <View style={styles.boxBtnBottom}>
          <View style={{flexDirection:'row'}}>
          {renderIf(this.state.statusBtnProfile)(
            <AwesomeButton
              borderRadius={15}
              backgroundColor='#28ccfb'
              backgroundShadow="#000"
              backgroundDarker="#23b6e0"
              height={40}
              style={{marginBottom: 10,marginRight:20}}
              width={GLOBAL.DEVICE_WIDTH*0.5-20}
              onPress={() => this.onPressRegist()}
            >
              <Image source={require('./../img/btnPrev.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-20,height:40,resizeMode:'stretch'}} />
              <Text style={[{position: 'absolute'},styles.btnTextWhite]}>{this.state.txtBtnProfile}</Text>
            </AwesomeButton>
              
          )}
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
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 10 }}>
            <Text style={styles.txtLittle}>Versi App {version}</Text>
          </View>
        </View>
        {renderIf(this.state.modalVisibleUnAuth == true)(
          <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
        )}
        {/* modal name update */}
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible1}
          onRequestClose={() => this.setState({ modalVisible1: false })}>
          <View style={styles.wrapper}>
            <View style={styles.modalFormInput}>
              <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.inputGroup} >
                    <Text style={styles.ttxtBlackHead}>Nama Depan</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput placeholderTextColor="#000000" ref={this.field1} onSubmitEditing={() =>{ const textInput = this.field2.current;
                        textInput.focus()} } style={styles.textInput} placeholder="Nama Depan" value={this.state.firstName} onChangeText={(firstName) => this.setState({ firstName })} />
                    </View>
                  </View>
                  <View style={styles.inputGroup} >
                    <Text style={styles.txtBlackHead}>Nama Belakang</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput placeholderTextColor="#000000" ref={this.field2} onSubmitEditing={() =>{ this._editProfileName(this.state.myToken) } } style={styles.textInput} placeholder="Nama Belakang" value={this.state.lastName} onChangeText={(lastName) => this.setState({ lastName })} />
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
                      onPress={() => this.setState({ modalVisible1: false })}
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
                      onPress={() => { this._editProfileName(this.state.myToken) }}
                  >
                  <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                  <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SIMPAN</Text>
                  </AwesomeButton>
              </View>
            </View>
          </View>
        </Modal>

        {/* modal email update */}
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible2}
          onRequestClose={() => this.setState({ modalVisible2:false})}>
          <View style={styles.wrapper}>
            <View style={styles.modalFormInput}>
              <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.inputGroup} >
                    <Text style={styles.txtBlackHead}>Email Baru</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput placeholderTextColor="#000000" ref={this.field3} onSubmitEditing={() => {this._editProfileEmail(this.state.myToken) }} style={styles.textInput} placeholder="Email Baru" onChangeText={(emailBaruValue) => this.setState({ emailBaruValue })} />
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
                      onPress={() => this.setState({ modalVisible2: false })}
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
                      disabled={this.state.disableBtnSimpan}
                      width={GLOBAL.DEVICE_WIDTH*0.5-25}
                      style={{marginTop:10,alignSelf:'flex-end'}}
                      onPress={() => { this._editProfileEmail(this.state.myToken) }}
                  >
                  <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                  <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SIMPAN</Text>
                  </AwesomeButton>
              </View>
            </View>
          </View>
        </Modal>
        {/* modal no hp update */}
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible3}
          onRequestClose={() => this.setState({ modalVisible3: false })}>
          <View style={styles.wrapper}>
            <View style={styles.modalFormInput}>
              <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.inputGroup} >
                    <Text style={styles.ttxtBlackHead}>Nomor Ponsel</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput placeholderTextColor="#000000" ref={this.field4} onSubmitEditing={() => {this._editProfileNoHp(this.state.myToken) } } style={styles.textInput} placeholder="No Ponsel" value={this.state.noHpValue} onChangeText={(noHpValue) => this.setState({ noHpValue })} />
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
                      onPress={() => this.setState({ modalVisible3: false })}
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
                      onPress={() => { this._editProfileNoHp(this.state.myToken) }}
                  >
                  <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                  <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SIMPAN</Text>
                  </AwesomeButton>
              </View>
            </View>
          </View>
        </Modal>
        {/* modal password update */}
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible4}
          onRequestClose={() => this.setState({ modalVisible4: false })}>
          <View style={styles.wrapper}>
            <View style={styles.modalFormInput}>
              <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
              <View style={{height:GLOBAL.DEVICE_HEIGHT-100}}>
                  <View style={styles.inputGroup} >
                    <Text style={styles.txtBlackHead}>Password Lama</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput placeholderTextColor="#000000" {...this.props} style={styles.textInput}
                      ref={this.field5} onSubmitEditing={() =>{ const textInput = this.field6.current;
                        textInput.focus()} }
                        secureTextEntry={this.state.secureTextEntry0} placeholder="Password" keyboardType="default" value={this.state.passValue} onChangeText={(passValue) => this.setState({ passValue })} />
                      <TouchableOpacity onPress={() => this.onTongelEyesPress('0')} style={styles.iconGroup}>
                        <Icon name={this.state.statusEye0} size={20} style={styles.colorIconInput} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.inputGroup} >
                    <Text style={styles.txtBlackHead}>Password Baru</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput placeholderTextColor="#000000" {...this.props} style={styles.textInput}
                      ref={this.field6} onSubmitEditing={() =>{ const textInput = this.field7.current;
                        textInput.focus()} }
                        secureTextEntry={this.state.secureTextEntry1} placeholder="Password" keyboardType="default" onChangeText={(passwordInput) => this.setState({ passwordInput })} />
                      <TouchableOpacity onPress={()=> this.onTongelEyesPress('1')} style={styles.iconGroup}>
                        <Icon name={this.state.statusEye1} size={20} style={styles.colorIconInput} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.inputGroup} >
                    <Text style={styles.txtBlackHead}>Konfirmasi Password</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput placeholderTextColor="#000000" {...this.props} style={styles.textInput}
                      ref={this.field7} onSubmitEditing={() =>{ this._editProfilePass(this.state.myToken)} }
                        secureTextEntry={this.state.secureTextEntry2} placeholder="Konfirmasi password" keyboardType="default" onChangeText={(passwordKonfirm) => this.setState({ passwordKonfirm })} />
                      <TouchableOpacity onPress={() => this.onTongelEyesPress('2')} style={styles.iconGroup}>
                        <Icon name={this.state.statusEye2} size={20} style={styles.colorIconInput} />
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
                      onPress={() => this.setState({ modalVisible4: false })}
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
                      onPress={() => { this._editProfilePass(this.state.myToken) }}
                  >
                  <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                  <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SIMPAN</Text>
                  </AwesomeButton>
              </View>
            </View>
          </View>
        </Modal>
        {/* modal Pin update */}
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible5}
          onRequestClose={() => this.setState({ modalVisible5: false })}>
          <View style={styles.wrapper}>
            <View style={styles.modalFormInput}>
              <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{height:GLOBAL.DEVICE_HEIGHT-100}}>
                  <View style={styles.inputGroup} >
                    <Text style={styles.txtBlackHead}>PIN lama</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput placeholderTextColor="#000000" {...this.props} style={styles.textInput}
                        ref={this.field8} onSubmitEditing={() =>{ const textInput = this.field9.current;
                          textInput.focus()} }
                        secureTextEntry={this.state.secureTextEntry3} placeholder="PIN lama" keyboardType="number-pad" maxLength={6} value={this.state.pinValue} onChangeText={(pinValue) => this.setState({ pinValue })} />
                      <TouchableOpacity onPress={() => this.onTongelEyesPress('3')} style={styles.iconGroup}>
                        <Icon name={this.state.statusEye3} size={20} style={styles.colorIconInput} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.inputGroup} >
                    <Text style={styles.txtBlackHead}>PIN baru</Text>
                    <View style={styles.textInputGroupModal}>
                      <TextInput placeholderTextColor="#000000" {...this.props} style={styles.textInput}
                      ref={this.field9} onSubmitEditing={() =>{ const textInput = this.field10.current;
                        textInput.focus()} }
                        secureTextEntry={this.state.secureTextEntry4} placeholder="Konfirmasi PIN" keyboardType='number-pad' maxLength={6} onChangeText={(pinBaru) => this.setState({ pinBaru })} />
                      <TouchableOpacity onPress={() => this.onTongelEyesPress('4')} style={styles.iconGroup}>
                        <Icon name={this.state.statusEye4} size={20} style={styles.colorIconInput} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.inputGroup} >
                    <Text style={styles.txtBlackHead}>Konfirmasi PIN</Text>
                    <View style={styles.textInputGroupModal}> 
                      <TextInput placeholderTextColor="#000000" {...this.props} style={styles.textInput}
                      ref={this.field11} onSubmitEditing={() =>{ this._cekPin(this.state.myToken, this.state.pinValue) } }
                        secureTextEntry={this.state.secureTextEntry5} placeholder="Konfirmasi PIN" keyboardType='number-pad' maxLength={6} onChangeText={(pinKonfirm) => this.setState({ pinKonfirm })} />
                      <TouchableOpacity onPress={() => this.onTongelEyesPress('5')} style={styles.iconGroup}>
                        <Icon name={this.state.statusEye5} size={20} style={styles.colorIconInput}/>
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
                      onPress={() => this.setState({ modalVisible5: false })}
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
                      onPress={() => { this._cekPin(this.state.myToken, this.state.pinValue) }}
                  >
                  <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                  <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SIMPAN</Text>
                  </AwesomeButton>
              </View>
            </View>
          
          </View>
        </Modal>

        <Modal animationType={"slide"} transparent={true}
            visible={this.state.modalVisibleKey}
            onRequestClose={() => this.setState({modalVisibleKey: false}) }>
            <View style={styles.wrapper}>
              <KeyboardAvoidingView behavior="position">
                <View style={{width:'100%',height:250,backgroundColor:'#FFF',marginTop:GLOBAL.DEVICE_HEIGHT-250}} >
                  <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <View style={{padding:15,justification:'center',alignItems:'center'}} >
                      <Text style={{fontWeight:'600',fontSize:14,color:'#000',textAlign:'center'}}>{this.state.verifikasiHeadTitle}</Text>
                      <View style={{justifyContent:'center',alignItems:'center',marginBottom:10,marginTop:5}} >
                        <TextInput maxLength={5} style={styles.textInputAuth} placeholder="Masukkan Kode Verifikasi" keyboardType='number-pad' onChangeText={(key) => this.setState({ key })} />
                      </View>
                      <CountDown
                        size={14}
                        until={420}
                        onFinish={() => this.setState({modalVisibleKey:false,other_device_token:''})}
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
                      onPress={() => this.setState({ modalVisibleKey: false })}
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
                          onPress={() => this.verifikasiEmailBaru(this.state.key,this.state.emailBaruValue) }
                      >
                      <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                      <Text style={[{position: 'absolute'},styles.btnTextWhite]}>VERIFIKASI</Text>
                    </AwesomeButton>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
        </Modal>
      
      </LinearGradient >
    );
  }
}

export default ProfilePage;

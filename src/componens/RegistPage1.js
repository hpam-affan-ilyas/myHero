
import React, { Component } from 'react';
import { Image, TouchableOpacity,StatusBar, Text, View, TextInput, Alert, RefreshControl, BackHandler,Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageResizer from 'react-native-image-resizer';
import UnAuth from './UnauthPage';
import renderIf from './Renderif';
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');

class RegistPage1 extends React.Component {
  constructor(props) {
    super(props);
    this.field1 = React.createRef(); 
    this.state = {
      eKtp: '',
      imgKtpSource: null,
      imgSelfiSource: null,
      imgTtdSource: null,
      refreshing: false,
      modalVisibleUnAuth: false,
      resizedImageUri: '',
      errKtpMsg: ''
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
  onNext = () => {
    
    let continuePage = true;

    continuePage ? ['test','test1'] : 'test2';

    if(this.state.eKtp.length == 0) {
      continuePage = false;
      this.setState({ 
        errKtp: 'No E-KTP tidak boleh kosong', 
        errKtpMsg: 'No E-KTP tidak boleh kosong'
      });
    } else {
      if(!this.state.eKtp.match(GLOBAL.numbersFormat)) {
        continuePage = false;
        this.setState({ 
          errKtp: 'No E-KTP tidak valid, hanya diizinkan angka',
          errKtpMsg: 'No E-KTP tidak valid, hanya diizinkan angka'
        });
      }
    }
    if(this.state.imgKtpSource == null) {
      continuePage = false;
      this.setState({ 
        errImgKtp: 'Foto KTP tidak boleh kosong'
      });
    }
    if(this.state.imgSelfiSource == null) {
      continuePage = false;
      this.setState({ 
        errImgSelfi: 'Foto Selfi tidak boleh kosong'
      });
    }
    if(this.state.imgTtdSource == null) {
      continuePage = false;
      this.setState({ 
        errImgTtd: 'Foto tanda tangan tidak boleh kosong'
      });
    }

    console.log('Continue Process', continuePage);
    if(continuePage) {  
      AsyncStorage.setItem('eKtp', this.state.eKtp);
      AsyncStorage.setItem('imgEktp', this.state.imgKtpSource);
      AsyncStorage.setItem('imgSelfi', this.state.imgSelfiSource);
      AsyncStorage.setItem('imgTtd', this.state.imgTtdSource);
      // $dataRegistt1 = {
      //   'eKtp': this.state.eKtp,
      //   'imgKtpSource': this.state.imgKtpSource,
      //   'imgSelfiSource': this.state.imgSelfiSource,
      //   'imgTtdSource': this.state.imgTtdSource
      // };
      this.props.navigation.navigate('Regist2')
    }
  }

  changeTextEktp = (ktpText) => {
    if(ktpText){
      if(!ktpText.match(GLOBAL.numbersFormat)) {
        this.setState({ 
          eKtp: ktpText,
          errKtp: 'No E-KTP tidak valid, hanya diizinkan angka',
          errKtpMsg: 'No E-KTP tidak valid, hanya diizinkan angka'
        })
        console.log('states', this.state);
      } else {
        this.setState({
          eKtp: ktpText, 
          errKtp: undefined, 
          continueProses: true, 
          errKtpMsg: undefined, 
          errInvalidKtp: undefined
        })
      }
    } else {
      this.setState({
        errKtp: 'No E-KTP tidak boleh kosong',
        errKtpMsg: 'No E-KTP tidak boleh kosong',
        eKtp: ''
      })
    }

  }

  _getStore = async () => {
    var aksesToken = await AsyncStorage.getItem('aksesToken');
    if (aksesToken != null) {
      var eKtpStore = await AsyncStorage.getItem('eKtp');
      var imgKtpStore = await AsyncStorage.getItem('imgEktp');
      var imgSelfiStore = await AsyncStorage.getItem('imgSelfi');
      var imgTtdStore = await AsyncStorage.getItem('imgTtd');
      if (eKtpStore != null) {
        this.setState({ eKtp: eKtpStore })
      }
      if (imgKtpStore != null) {
        this.setState({ imgKtpSource: imgKtpStore })
      }
      if (imgSelfiStore != null) {
        this.setState({ imgSelfiSource: imgSelfiStore })
      }
      if (imgTtdStore != null) {
        this.setState({ imgTtdSource: imgTtdStore })
      }
    } else {
      this.Unauthorized()
    }

  }

  selectImage(imgPress) {
    console.log("masuk select image");
    var option = { title: 'Pilih Gambar',cancelButtonTitle:'Batal',maxWidth:GLOBAL.maxWidthUploadImage,maxHeight:GLOBAL.maxHeightUploadImage,quality:1, storageOption: { skipBackup: true, path: 'images'}, takePhotoButtonTitle: 'Kamera', chooseFromLibraryButtonTitle: 'Galeri' };
    ImagePicker.showImagePicker(option, (response) => {
      console.log('Response Select Image = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        alert(response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        var uri = response.uri;
        if(Platform.OS == 'android' && response.width > 720){
          var newWidth = response.width*50/100;
          var newHeight = response.height*50/100;
          ImageResizer.createResizedImage(uri, newWidth, newHeight, "JPEG", 100, rotation = 0).then((res) => {
            // response.uri is the URI of the new image that can now be displayed, uploaded...
            // response.path is the path of the new image
            // response.name is the name of the new image with the extension
            // response.size is the size of the new image
            switch (imgPress) {
              case 'ktp':
                this.setState({ imgKtpSource: res.uri });
                break;
              case 'selfi':
                this.setState({ imgSelfiSource: res.uri  });
                break;
              case 'ttd':
                this.setState({ imgTtdSource: res.uri });
                break;
            }
          }).catch((err) => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            alert(err)
          });
        }else{
          switch (imgPress) {
            case 'ktp':
              this.setState({ imgKtpSource: uri });
              break;
            case 'selfi':
              this.setState({ imgSelfiSource: uri  });
              break;
            case 'ttd':
              this.setState({ imgTtdSource: uri });
              break;
          }
             // You can also display the image using data:
            // const source = 'data:image/jpeg;base64,' + response.data;
        }
      }
    });
  }
  _onRefresh() {
    this.setState({ refreshing: true });
    this._getStore().then(() => {
      this.setState({ refreshing: false })
    });
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack();
      return true;
    });
    return this._getStore()
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  render() {
    return (
      <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
        <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
        <View style={{ height: GLOBAL.DEVICE_HEIGHT - 100 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            } >
            <View style={styles.containerMain}>

              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={styles.activeCirclePage}><Text style={styles.btnTxtDefault}>1</Text></View>
                <View style={styles.lineCirclePage} />
                <View style={styles.whiteCirclePage}><Text style={styles.btnTxtDefault}>2</Text></View>
                <View style={styles.lineCirclePage} />
                <View style={styles.whiteCirclePage} ><Text style={styles.btnTxtDefault}>3</Text></View>
                <View style={styles.lineCirclePage} />
                <View style={styles.whiteCirclePage} ><Text style={styles.btnTxtDefault}>4</Text></View>
              </View>

              <View style={styles.inputGroup} >
                <Text style={styles.labelText}>No E-KTP</Text>
                <View style={this.state.errKtp ? styles.textInputError : styles.textInputGroup}>
                  <TextInput placeholderTextColor="#000000" ref={this.field1} style={styles.textInput} placeholder="No E-KTP" keyboardType="number-pad" value={this.state.eKtp} onChangeText={(eKtp) => this.changeTextEktp(eKtp)} />
                  <View style={styles.iconGroup} >
                    <Icon name="id-card-o" size={20} style={styles.colorIconInput} />
                  </View>
                </View>
              </View>
              {renderIf(this.state.errKtpMsg)(
                <View>
                  <Text style={styles.errorMessage}>{this.state.errKtp && this.state.errKtpMsg}</Text>
                </View>
              )}
              
              <View style={this.state.errImgKtp && styles.wrapperImageError}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.labelText}>Foto E-KTP</Text>
                  <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => { this.selectImage('ktp') }}>
                      <Icon name="camera" size={25} style={{ color: '#28ccfb' }} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                  <TouchableOpacity onPress={() => { this.selectImage('ktp') }}>
                    <Image source={{ uri: this.state.imgKtpSource }} onLoad={e => { this.setState({ errImgKtp: undefined, continueProses: true }) }} style={{ width: 100, height: 100, resizeMode: "stretch", backgroundColor: '#e1e4e8' }} />
                  </TouchableOpacity>
                </View>
              </View>
              {renderIf(this.state.errImgKtp)(
                <View>
                  <Text style={styles.errorMessage}>{this.state.errImgKtp}</Text>
                </View>
              )}
              <View style={this.state.errImgSelfi && styles.wrapperImageError}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.labelText}>Selfie Dengan E-KTP</Text>
                  <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => { this.selectImage('selfi') }}>
                      <Icon name="camera" size={25} style={{ color: '#28ccfb' }} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                  <TouchableOpacity onPress={() => { this.selectImage('selfi') }}>
                    <Image source={{ uri: this.state.imgSelfiSource }} onLoad={e => {[this.setState({ errImgSelfi: undefined, continueProses: true}), console.log('Image', this.state.imgSelfiSourcnoe)] }} style={{ width: 100, height: 100, resizeMode: "stretch", backgroundColor: '#e1e4e8' }} />
                  </TouchableOpacity>
                </View>
              </View>
              {renderIf(this.state.errImgSelfi)(
                <View>
                  <Text style={styles.errorMessage}>{this.state.errImgSelfi}</Text>
                </View>
              )}

              <View style={this.state.errImgTtd && styles.wrapperImageError}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.labelText}>Foto Tanda Tangan</Text>
                  <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => { this.selectImage('ttd') }}>
                      <Icon name="camera" size={25} style={{ color: '#28ccfb' }} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                  <TouchableOpacity onPress={() => { this.selectImage('ttd') }}>
                    <Image source={{ uri: this.state.imgTtdSource }} onLoad={e => { this.setState({ errImgTtd: undefined, continueProses: true }) }} style={{ width: 100, height: 100, resizeMode: "stretch", backgroundColor: '#e1e4e8' }} />
                  </TouchableOpacity>
                </View>
              </View>
              {renderIf(this.state.errImgTtd)(
                <View>
                  <Text style={styles.errorMessage}>{this.state.errImgTtd}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
        <View style={styles.boxBtnBottom}>
          {/* <TouchableOpacity onPress={this.onNext} style={styles.btnBottom}>
            <Text style={styles.btnTextWhite}>BERIKUTNYA</Text>
          </TouchableOpacity> */}
          <AwesomeButton
              borderRadius={15}
              backgroundColor='#4F7942'
              backgroundShadow="#000"
              backgroundDarker="#45673a"
              height={40}
              style={{marginTop:10}}
              width={GLOBAL.DEVICE_WIDTH*0.5}
              onPress={this.onNext} 
          >
          <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5,height:40,resizeMode:'stretch'}} />
          <Text style={[{position: 'absolute'},styles.btnTextWhite]}>BERIKUTNYA</Text>
          </AwesomeButton>
        </View>
        {renderIf(this.state.modalVisibleUnAuth == true)(
          <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
        )}
      </LinearGradient >
    );
  }
}

export default RegistPage1;
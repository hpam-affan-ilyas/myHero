
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableOpacity, Image, StatusBar, Modal, ActivityIndicator, TextInput, ScrollView, Alert,RefreshControl,BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import { Dropdown } from 'react-native-material-dropdown';
import Unauth from './UnauthPage';
import renderIf from './Renderif';
import NotifikasiInvest from './NotifikasiInvest';
import AsyncStorage from '@react-native-community/async-storage';
import Slider from '@react-native-community/slider';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');

class FormNotifInvest extends Component {
    constructor(props) {
        super(props);
        // notifList = new NotifikasiInvest();
        this.state = {
            isLoading: false,
            tujInvest:'',
            nilaiInvest: '',
            namaProduk: '',
            idProduk: null,
            sliderValue: 15,
            dataProduk:[],
            refreshing:false,
            modalVisibleUnAuth: false,
        }
    };
    Unauthorized(){
        this.setState({ isLoading: false,modalVisibleUnAuth:true})
                        setTimeout(()=> this.logout(),GLOBAL.timeOut);
    }
    logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Main')
    }
    goListNotif(){
        this.props.navigation.navigate('NotifikasiInvest');
    }
    simpanProses(token){
        if(this.state.tujInvest.length == 0){
            Alert.alert('Perhatian', 'Tujuan investasi harus diisi',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        }else if(this.state.nilaiInvest == 0){
            Alert.alert('Perhatian', 'Nilai investasi harus diisi',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        }else if(!this.state.nilaiInvest.replace('.','').replace('.','').match(GLOBAL.numbersFormat) || this.state.nilaiInvest.slice(0,1) == 0){
            Alert.alert('Perhatian', 'Nilai investasi tidak valid',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        }else if(this.state.namaProduk.length == 0){
            Alert.alert('Perhatian', 'Nama produk harus diisi',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        }else if(this.state.sliderValue < 0 && this.state.sliderValue > 31){
            Alert.alert('Perhatian', 'Tanggal notifikasi tidak valid',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        }else{
            var nominal = this.state.nilaiInvest.replace('.','').replace('.','');
            fetch(GLOBAL.notifikasiInvestasi(), {
                method: 'POST',
                headers: {
                    'Accept': 'appication/json',
                    'Content-type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    tujuan: this.state.tujInvest,
                    produk_id:this.state.idProduk,
                    nominal: nominal,
                    tgl_notifikasi: this.state.sliderValue,
                })
            })
            .then((response) => {
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        Alert.alert('Sukses','Notifikasi investasi berhasil disimpan',
                            [{text: 'OK', onPress: () => this.goListNotif() }],
                            {cancelable: false},
                        );
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else if(response.status == '400'){
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        Alert.alert('Perhatian',''+res.message,
                            [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
                            {cancelable: false},
                        );
                    })
                }else {
                    GLOBAL.gagalKoneksi()
                }
            })
        }
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
                var count = Object.keys(res.data.produk).length;
                        let data_produk = [];
                        for (var i = 0; i < count; i++) {
                            data_produk.push({
                                id: res.data.produk[i].id,
                                value: res.data.produk[i].nama_produk
                            })
                        }
                        this.setState({ dataProduk: data_produk })
              })
            } else if (response.status == '401') {
              this.Unauthorized()
            }else{
                GLOBAL.gagalKoneksi()
            }
          })
      }
    onProdukSelected(isSelect) {
        var produkMap = this.state.dataProduk;
        var produk = produkMap.map((produkMap, key) => produkMap);
        for (var i = 0; i < produk.length; i++) {
            if (produk[i].value == isSelect) {
                this.setState({
                    idProduk: produk[i].id,
                    namaProduk: produk[i].value
                })
            }
        }
    }
    _onRefresh(){
        this.setState({refreshing:true});
        this._getToken().then(()=>{
          this.setState({refreshing:false})
        });
    }
    _getToken = async () => {
        var aksesToken = await AsyncStorage.getItem('aksesToken');
        const { params } = this.props.navigation.state;
        if (params.nilaiInvest != null) {
            this.setState({ nilaiInvest: params.nilaiInvest });
        }
        if (params.namaProduk != null) {
            this.setState({ namaProduk: params.namaProduk });
        }
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken})
            this._getProdukList(this.state.myToken)
        } else {
            this.Unauthorized()
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack();
            return true;
        });
        return this._getToken();
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }
    render() {
        return (
            <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
                <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
                <ScrollView contentContainerStyle={{ width: GLOBAL.DEVICE_WIDTH, height: GLOBAL.DEVICE_HEIGHT }}
                    showsVerticalScrollIndicator={false} scrollEnabled={true}
                    refreshControl={
                        <RefreshControl
                          refreshing = {this.state.refreshing}
                          onRefresh ={this._onRefresh.bind(this)}
                        />
                    } >
                    {
                        this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
                    }
                    <View style={styles.containerMain}>
                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>Tujuan Investasi</Text>
                            <View style={styles.textInputGroup}>
                                <TextInput style={styles.textInput} placeholder="Tujuan Investasi" maxLength={20} keyboardType="default" onChangeText={(tujInvest)=>this.setState({tujInvest})} />
                            </View>
                        </View>
                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>Nilai Investasi</Text>
                            <View style={styles.textInputGroup}>
                                <TextInput style={styles.textInput} placeholder="0" keyboardType="number-pad" value={this.state.nilaiInvest.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g, '.')} onChangeText={(nilaiInvest) => this.setState({ nilaiInvest })} />
                            </View>
                        </View>
                        <Dropdown
                            label='Produk'
                            textColor='#FFF'
                            itemColor='#000'
                            baseColor='#FFF'
                            selectedItemColor='#000'
                            value={this.state.namaProduk}
                            onChangeText={(namaProduk) => { this.onProdukSelected(namaProduk) }}
                            data={this.state.dataProduk} />
                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>Tanggal Notifikasi Investasi</Text>
                            <Slider
                                step={1}
                                minimumValue={1}
                                maximumValue={31}
                                minimumTrackTintColor='#7FFF00'
                                maximumTrackTintColor='#FFFFFF'
                                thumbTintColor = '#7FFF00'
                                value={this.state.sliderValue}
                                onValueChange={(ChangedValue) => this.setState({sliderValue:ChangedValue})}
                                style={{ width: '100%'}}
                            />
                        </View>
                        <View style={{ flexDirection: 'row',width:'100%'}}>
                            <Text style={{ width:'33.3%', justifyContent: 'flex-start', color: "#FFF", fontSize: 12, marginLeft: 5 }}>1</Text>
                            <Text style={{ width:'33.3%', justifyContent: 'center',textAlign:'center', color: "#FFF", fontSize: 12 }}>{this.state.sliderValue}</Text>
                            <View style={{ width:'33.3%', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 5 }}>
                                <Text style={styles.txtLittle}>30</Text>
                            </View>
                        </View>
                        <View style={styles.btnContainer}>
                            {/* <TouchableOpacity onPress={()=>this.simpanProses(this.state.myToken)} >
                                <LinearGradient colors={['#fdfdfd', '#e7e7e7', '#d5d5d5']} style={styles.btnDaftar} >
                                    <Text style={styles.btnTxtDefault}>SIMPAN</Text>
                                </LinearGradient>
                            </TouchableOpacity> */}
                            <AwesomeButton
                                borderRadius={15}
                                backgroundColor='#4F7942'
                                backgroundShadow="#000"
                                backgroundDarker="#45673a"
                                height={40}
                                style={{marginTop:10}}
                                width={GLOBAL.DEVICE_WIDTH*0.5}
                                onPress={()=>this.simpanProses(this.state.myToken)}
                                >
                                    <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5,height:40,resizeMode:'stretch'}} />
                                    <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SIMPAN</Text>
                            </AwesomeButton>
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

export default FormNotifInvest;


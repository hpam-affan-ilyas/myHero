
import React, { Component, useState } from 'react';
import { Text, View, Image, TouchableOpacity, KeyboardAvoidingView, StatusBar, Alert, TextInput, Modal ,ActivityIndicator,RefreshControl,BackHandler} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from 'react-native-check-box';
import AwesomeButton from "react-native-really-awesome-button";
import AsyncStorage from '@react-native-community/async-storage';
import Slider from '@react-native-community/slider';
import { ScrollView } from 'react-native-gesture-handler';
var styles = require('../utils/Styles');
var GLOBAL= require('../utils/Helper');
import UnAuth from './UnauthPage';
import renderIf from './Renderif';

class SwitchPage extends Component {
    constructor(props) {
        super(props);
        this.field1 = React.createRef(); 
        this.state = {
            isLoading:false,
            myToken: '',
            idProduk: '',
            namaBank: '',
            namaProduk: '',
            tgl: '',
            namaRek: '',
            noRek: '',
            jmlUnit: 0,
            jmlUnit2: 0,
            jmlUnit3: 0,
            sliderValue: '',
            saldoUnit: '',
            saldoAum: '',
            minimalSisa: '',
            saldoNav: '',
            nilaiJual: 0,
            isChecked: false,
            sliderValue: 0,
            modalVisible: false,
            refreshing:false,
            modalVisibleUnAuth: false,
            isError:'',
            isi:[],
            title:'',
            moveTo: '',
            minimumPembelian: ''
        }
    };
    Unauthorized(){
        this.setState({ isLoading: false,modalVisibleUnAuth:true})
        setTimeout(()=> this.logout(),GLOBAL.timOut);
    }
    logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Main');
    }
    changeNominal(nominal){
        if (typeof nominal == "undefined" || nominal == null || nominal == '' || nominal == 0 ){
            Alert.alert('Gagal', 'Jumlah unit tidak boleh kosong',
              [{ text: 'OK', onPress: () => console.log('ok pressed') }],
              { cancelable: false },
            );
        }else if(nominal.toString().slice(0,1) == 0 && nominal.length > 1){
            Alert.alert('Gagal', 'Jumlah unit tidak valid',
              [{ text: 'OK', onPress: () => console.log('ok pressed') }],
              { cancelable: false },
            );
        }else{
            var a = nominal;
            var sisaUnit = this.state.saldoUnit - a;
            var sisaNominal = sisaUnit*this.state.saldoNav;
            if(a > this.state.saldoUnit){
                Alert.alert('Gagal', 'Jumlah unit tidak boleh melebihi saldo unit',
                    [{ text: 'OK', onPress: () => console.log('ok pressed') }],
                    { cancelable: false },
                    );
            }else if(sisaNominal < this.state.minimalSisa && sisaNominal > 0 ){
                Alert.alert('Gagal', 'Minimal sisa saldo tidak boleh kurang dari '+this.state.minimalSisa.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g,'.'),
                    [{ text: 'OK', onPress: () => console.log('ok pressed') }],
                    { cancelable: false },
                    );
            }else{
                this.setState({ modalVisible: false,jmlUnit: a,jmlUnit2:a,jmlUnit3:a});
                var nilaiJual2 = a * this.state.saldoNav;
                var slideVal = (a/this.state.saldoUnit)*100;
                this.setState({nilaiJual:nilaiJual2, sliderValue:slideVal,test:slideVal})
            }
        }

    }
    getNominal(nominal){
        var a = nominal;
        var nilaiJual2 = a * this.state.saldoNav;
        return GLOBAL.currencyInput(nilaiJual2,'.');
    }
    setModalVisible(visible) {
        switch (visible) {
            case 'open':
                this.setState({ modalVisible: true, jmlUnit2: this.state.jmlUnit,jmlUnit3: this.state.jmlUnit });
                break;
            case 'cancel':
                this.setState({ modalVisible: false });
                break;
            case 'ok':
                this.changeNominal(this.state.jmlUnit2)
                break;
        }
    }
    sliderAct(value) {
        this.setState({sliderValue:value})
        var unit = (this.state.saldoUnit * value) / 100;
        var nilaiJual = unit * this.state.saldoNav;
        if(value == 100){
            this.setState({
                nilaiJual: nilaiJual,
                jmlUnit: this.state.saldoUnit,
                jmlUnit2: this.state.saldoUnit,
                jmlUnit3: this.state.saldoUnit,
            })
        }else{
            this.setState({
                nilaiJual: nilaiJual,
                jmlUnit: unit,
                jmlUnit2: unit,
                jmlUnit3: unit,
            })
        }
    }
    _goActSwitch() {
        var kodeProduk = this.state.kodeProduk;
        var sisaUnit = this.state.saldoUnit-this.state.jmlUnit;
        var sisaNominal = sisaUnit*this.state.saldoNav;
        let continuePin = true;
        let allUnit = false;
        if (this.state.jmlUnit == 0) {
            Alert.alert('Perhatian', 'Jumlah unit yang ingin dijual harus diisi',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
            continuePin = false;
        } else if(sisaNominal < this.state.minimalSisa && sisaNominal > 0){
            Alert.alert('Perhatian', 'Minimal sisa saldo tidak boleh kurang dari '+this.state.minimalSisa.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g,'.'),
                [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed')}, { text: 'All Unit', onPress: () => [this.sliderAct(100), allUnit = true]}],
                { cancelable: false },
            );
            continuePin = false;
        }
        
        if (!this.state.moveTo) {
            Alert.alert('Perhatian', 'Product Pindahan harus di pilih',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
            continuePin = false;
        } else {
            if (this.state.nilaiJual < this.state.minimumPembelian) {
                Alert.alert('Perhatian', 'Minimal Pembelian pada Produk '+this.state.moveToValue+' adalah Rp. '+this.state.minimumPembelian.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: false },
                );
                continuePin = false;
            }
        }

        console.log('Continue to Pin Page?', continuePin);
        if(continuePin) {
            this.props.navigation.navigate('Pin', {
                switch : [
                    {
                        id: this.state.idProduk, 
                        value: this.state.jmlUnit, 
                        title: 'SWTOUT',
                        kodeProduk: kodeProduk,
                        moveTo : this.state.moveTo
                    },
                    {
                        id: this.state.moveTo, 
                        title: 'SWTIN',
                        allUnit: allUnit,
                        fromId: this.state.idProduk,
                    }
                ]
            });
        }
    }
    _getSellView(token, idProduk) {
        fetch(GLOBAL.getJualTampil(idProduk), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token,
            }
        })
            .then((response) => {
                if (response.status == '200') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        this.setState({
                            namaProduk: res.data.produk.nama_produk,
                            minimalSisa: res.data.produk.minimal_sisa,
                            namaBank: res.data.bank.nama_bank,
                            noRek: res.data.bank.norek,
                            namaRek: res.data.bank.nama_rekening,
                            imgBank: res.data.bank.logo_bank,
                            saldoUnit: res.data.saldo.saldo_unit,
                            saldoAum: res.data.saldo.saldo_aum,
                            saldoNav: res.data.saldo.saldo_nav,
                            tgl: res.data.saldo.tanggal,
                            availableProducts: res.data.availableProducts
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
            this.setState({ idProduk: params.id, kodeProduk: params.kodeProduk });
        }
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken });
            this._getSellView(this.state.myToken, this.state.idProduk);
            this.getKetentuanTrans('RED');
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
    onChangeText(value, index, data) {
        fetch(GLOBAL.getMinimumPembelian(data[index].id), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': this.state.myToken,
            },
        }).then((response) => {
            if(response.status == '201') {
                let res;
                return response.json().then(obj => {
                    res = obj;
                    this.setState({
                        minimumPembelian: res.minimal_subs,
                        moveTo: data[index].id,
                        moveToValue: data[index].value
                    })
                });
            }
        });
    }
    getKetentuanTrans(tipe) {
        fetch(GLOBAL.ketentuanTransaksi(tipe), {
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
                var content = res.data.isi;
                let content_data = [];
                var a = content.split('<br>');
                for(var i = 1;i <= a.length;i++){
                    content_data.push({
                        no: i,
                        value:a[i-1],
                    });
                }
                this.setState({
                    title: res.data.title,
                    isi: content_data
                })
            
            })
        } else {
            GLOBAL.gagalKoneksi()
        }
        })
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.navigate('PortfolioScreen');
            return true;
        });
        this._getToken()
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }
    render() {
        // num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        (this.state.minimumPembelian == '') ? this.state.minimumPembelian = 0 : this.state.minimumPembelian;
        let moveTo = 'Pilih Product';
        let dataDropdown = new Array();
        if(this.state.availableProducts){
            for(let i = 0; i < this.state.availableProducts.length; i++) {
                dataDropdown.push({
                    value: this.state.availableProducts[i].nama_produk,
                    id: this.state.availableProducts[i].id
                });
            }
        }
        const ketentuan = this.state.isi;
        const dataKetentuan = ketentuan.map((ketentuan, key) => ketentuan);
        return (
            <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
               <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                        refreshing = {this.state.refreshing}
                        onRefresh ={this._onRefresh.bind(this)}
                        />
                    }>
                        {
                            this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
                        }
                        <View style={styles.containerMain}>
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>Pilih Reksa Dana</Text>
                                <View style={styles.textInputGroup}>
                                    <TextInput placeholderTextColor="#000000" style={styles.textInput} placeholder="Nama Produk" value={this.state.namaProduk} editable={false} />
                                </View>
                            </View>
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>Unit Tersedia</Text>
                                <View style={styles.textInputGroup}>
                                    <TextInput placeholderTextColor="#000000" style={styles.textInput} placeholder="Unit Tersedia" value={this.state.saldoUnit.toString().replace('.', ',')} editable={false} />
                                </View>
                            </View>
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>Minimum Sisa Unit</Text>
                                <View style={styles.textInputGroup}>
                                    <TextInput placeholderTextColor="#000000" style={styles.textInput} editable={false} placeholder="Minimal Sisa" value={"Rp " + GLOBAL.currencyInput(this.state.minimalSisa, '.')} />
                                </View>
                            </View>
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>Jumlah Unit yang Ingin Dipindah?</Text>
                                <Slider
                                    step={1}
                                    minimumValue={0}
                                    maximumValue={100}
                                    minimumTrackTintColor='#7FFF00'
                                    maximumTrackTintColor='#FFFFFF'
                                    thumbTintColor = '#7FFF00'
                                    value={this.state.sliderValue}
                                    onValueChange={(ChangedValue) => this.sliderAct(ChangedValue)}
                                    style={{ width: '100%' }}
                                />
                                <View style={{ flexDirection: 'row', flex: 2 }}>
                                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',marginLeft:5}} onPress={() => this.sliderAct(0)}>
                                    {/* <Text style={styles.txtLittle}>0</Text> */}
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 5 }} onPress={() => this.sliderAct(100)}>
                                        <Text style={styles.txtLittle}>Semua Unit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.inputGroup} >
                                <TouchableOpacity style={styles.textInputGroup} onPress={() => { this.setModalVisible('open') }}>
                                    <Text style={styles.textInput}>{this.state.jmlUnit3.toString().replace('.', ',')}</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>Perkiraan Nilai Jual Per Tanggal {GLOBAL.convertTgl(this.state.tgl)}</Text>
                                <View style={styles.textInputGroup}>
                                    <Text style={styles.textInput} >Rp {GLOBAL.currencyInput(this.state.nilaiJual, '.')}</Text>
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.labelText}>Pindahkan Ke</Text>
                                <Dropdown
                                    value={moveTo}
                                    onChangeText={this.onChangeText.bind(this)}
                                    style={{color: '#fff'}}
                                    baseColor="#fff"
                                    data={dataDropdown}
                                />
                                <Text style={styles.labelText}>Minimal Pembelian: Rp. {this.state.minimumPembelian.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                            </View>
                        </View>
                        <View style={styles.boxBtnBottom}>
                    <AwesomeButton
                        borderRadius={15}
                        backgroundColor='#e52757'
                        backgroundShadow="#000"
                        backgroundDarker="#FA8E14"
                        width={GLOBAL.DEVICE_WIDTH*0.5}
                        style={{marginTop:10}}
                        height={40}
                        onPress={()=> this._goActSwitch()}
                    >
                    <Image source={require('./../img/btnSwitch.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5,height:40,resizeMode:'stretch'}} />
                    <Text style={[{position: 'absolute'},styles.btnTextWhite]}>PINDAHKAN</Text>
                    </AwesomeButton>
                </View>
                    </ScrollView>
                {renderIf(this.state.modalVisibleUnAuth == true)(
                    <UnAuth visibleModal={this.state.modalVisibleUnAuth}/>
                )}
                <Modal animationType={"slide"} transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setModalVisible('cancel') }}>
                    <View style={styles.wrapper}>
                        <KeyboardAvoidingView behavior="position">
                        <View style={{width:'100%',height:300,backgroundColor:'#FFF',marginTop:GLOBAL.DEVICE_HEIGHT-300}} >
                            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                                <View style={{padding:15,justification:'center',alignItems:'center'}} >
                                    <View style={styles.inputGroup} >
                                        <Text style={styles.txtBlackHead}>Jumlah Unit yang Ingin Di Pindah?</Text>
                                        <View style={styles.textInputGroupModal}>
                                            <TextInput placeholderTextColor="#000000" ref={this.field1} style={styles.textInput} placeholder="0" value={this.state.jmlUnit2.toString()} maxLength={17} keyboardType='decimal-pad' onChangeText={(jmlUnit2) => { this.setState({jmlUnit2}) }} />
                                        </View>
                                        <Text style={{marginBottom:5,marginTop:5,color:'RED',fontSize:14}}>{this.state.isError}</Text>
                                    </View>
                                    <View style={[styles.inputGroup,{flexDirection:'row'}]} >
                                        <Text style={[styles.txtBlackHead,{width:"30%"}]}>Jumlah Unit</Text>
                                        <Text style={[styles.txtBlackHead3,{width:"70%",textAlign:'right'}]}>{GLOBAL.currencyInput2(this.state.jmlUnit2)}</Text>
                                    </View>
                                    <View style={[styles.inputGroup,{flexDirection:'row'}]} >
                                        <Text style={[styles.txtBlackHead,{width:"30%"}]}>Perkiraan Nilai Jual</Text>
                                        <Text style={[styles.txtBlackHead3,{width:"70%",textAlign:'right'}]} >Rp {this.getNominal(this.state.jmlUnit2)}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                            <View style={[styles.modalFormBtnBottom,{flexDirection: "row"}]}>
                                <AwesomeButton
                                    borderRadius={15}
                                    backgroundColor='#28ccfb'
                                    backgroundShadow="#000"
                                    backgroundDarker="#23b6e0"
                                    height={40}
                                    width={GLOBAL.DEVICE_WIDTH*0.5-25}
                                    style={{marginTop:10,alignSelf:'flex-end', marginRight:20}}
                                    onPress={() => { this.setModalVisible('cancel') }}
                                >
                                <Image source={require('./../img/btnPrev.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                                <Text style={[{position: 'absolute'},styles.btnTextWhite]}>BATAL</Text>
                                </AwesomeButton>

                                <AwesomeButton
                                    borderRadius={15}
                                    backgroundColor='#000'
                                    backgroundShadow="#000"
                                    backgroundDarker="#FA8E14"
                                    height={40}
                                    width={GLOBAL.DEVICE_WIDTH*0.5-25}
                                    style={{marginTop:10,alignSelf:'flex-end'}}
                                    onPress={() => { this.setModalVisible('ok') }}
                                >
                                <Image source={require('./../img/btnSwitch.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                                <Text style={[{position: 'absolute'},styles.btnTextWhite]}>Pindahkan</Text>
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
export default SwitchPage;

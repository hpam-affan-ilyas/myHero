
import React, { Component } from 'react';
import { Text, View, StatusBar, TouchableOpacity, Image, Dimensions, Modal,ActivityIndicator, TextInput, ScrollView,Alert,RefreshControl,BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import { Dropdown} from 'react-native-material-dropdown';
import CheckBox from 'react-native-check-box';
import AsyncStorage from '@react-native-community/async-storage';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');
import renderIf from './Renderif';
import UnAuth from './UnauthPage';
var radio_investasi = [{ label: 'Investasi satu kali (lump sum)', value: 1 }, { label: 'Investasi reguler setiap bulan', value: 2 }];

class KalkulatorFin extends Component {
    constructor(props) {
        super(props);
        this.field1 = React.createRef(); 
        this.field2 = React.createRef(); 
        this.field3 = React.createRef(); 
        this.state = {
            isLoading: false,
            idProduk:null,
            namaProd: null,
            myToken:null,
            metodeInvestasi:1,
            satuanWaktu:'Tahun',
            satuanWaktuReturn:'Per Tahun',
            tipeKalkulator:1,
            labelInvest:'Dana',
            danaInvestasi:'',
            jangkaWaktu:'',
            profileRisk:'',
            colorBtn2: ['#fdfdfd', '#e7e7e7', '#d5d5d5'],
            colorBtn1: ['#45d4fd', '#28ccfb', '#00bff3'],
            estimasiReturn:0,
            dataProfileRisiko: [{ id: 1, value: 'Konservatif' }, { id: 2, value: 'Moderat' }, { id: 3, value: 'Agresif' }],
            profileRisikoValue:'',
            labelResul:'',
            result:'',
            dataMapResult: [],
            refreshing:false,
            statusNasabah:'',
            modalVisibleUnAuth: false,
            isCheckedKonservatif: false,
            isCheckedModerat: false,
            isCheckedAgresif: false,
        }

    };
    Unauthorized(){
        this.setState({ isLoading: false,modalVisibleUnAuth:true})
                        setTimeout(()=> this.logout(),GLOBAL.timeOut);
    }
    _refeshKalkulator(){
        this.setState({
            tipeKalkulator:1,
            labelInvest:'Dana',
            danaInvestasi:0,
            jangkaWaktu:0,
            profileRisk:'',
            colorBtn1: ['#fdfdfd', '#e7e7e7', '#d5d5d5'],
            colorBtn2: ['#45d4fd', '#28ccfb', '#00bff3'],
            estimasiReturn:0,
            dataProfileRisiko: [{ id: 1, value: 'Konservatif' }, { id: 2, value: 'Moderat' }, { id: 3, value: 'Agresif' }],
            profileRisikoValue:'',
            labelResul:'',
            result:'',
        })
    }
    hitungProses = () => {
        var result;
        var danaInvest;
        var periode;
        if (this.state.metodeInvestasi == null ) {
            Alert.alert('Perhatian','Metode investasi harus diisi',
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: false},
              );
        } else if (this.state.danaInvestasi.length == 0 || this.state.danaInvestasi < 1) {
            Alert.alert('Perhatian','Dana investasi harus diisi',
                [{text: 'OK', 
                onPress: () => { const textInput = this.field1.current;
                    textInput.focus()} 
                }],
                {cancelable: false},
              );
        }else if (this.state.danaInvestasi.slice(0,1) == 0) {
            Alert.alert('Perhatian','Dana investasi tidak valid',
                [{text: 'OK',
                    onPress: () => { const textInput = this.field1.current;
                    textInput.focus()}
                }],
                {cancelable: false},
              );
        }else if (this.state.jangkaWaktu.length == 0 || this.state.jangkaWaktu < 1) {
            Alert.alert('Perhatian','Jangka waktu harus diisi',
                [{text: 'OK',
                    onPress: () => { const textInput = this.field2.current;
                    textInput.focus()}
                }],
                {cancelable: false},
              );
        } else if (!this.state.jangkaWaktu.match(GLOBAL.numbersFormat) || this.state.jangkaWaktu.slice(0,1) == 0) {
            Alert.alert('Perhatian','Jangka waktu tidak valid',
                [{text: 'OK',
                    onPress: () => { const textInput = this.field2.current;
                    textInput.focus()}
                }],
                {cancelable: false},
              );
        }else if(this.state.isCheckedKonservatif == false && this.state.isCheckedModerat == false && this.state.isCheckedAgresif == false){
            Alert.alert('Perhatian', 'Profil risiko harus diisi!',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        }else {
            if(this.state.tipeKalkulator == 1){
                //Tipe Hitung Target
                switch(this.state.metodeInvestasi){
                    case 1:
                        //lungsum
                        danaInvest = this.state.danaInvestasi.replace('.','').replace('.','').replace('.','');
                        periode = this.state.jangkaWaktu;
                        var c = (Math.pow(1+this.state.estimasiReturn/100,periode)*1)*(danaInvest*1)
                        result = Math.round(c)
                        break;
                    case 2:
                        //perbulan
                        danaInvest = this.state.danaInvestasi.replace('.','').replace('.','').replace('.','');
                        periode = this.state.jangkaWaktu
                        var c = (danaInvest*1)*((Math.pow(1+((this.state.estimasiReturn/12)/100),(periode*12))-1)/((this.state.estimasiReturn/12)/100)*1)*(1+((this.state.estimasiReturn/12)/100))
                        result = Math.round(c)
                        break;
                }
            }else{
                // Tipe Dana yang harus di invest
                switch(this.state.metodeInvestasi){
                    case 1:
                        //lungsum
                        danaInvest = this.state.danaInvestasi.replace('.','').replace('.','').replace('.','');
                        periode = this.state.jangkaWaktu;
                        var c = (danaInvest*1)/Math.pow(1+this.state.estimasiReturn/100,periode)
                        result = Math.round(c)
                        break;
                    case 2:
                        //perbulan
                        danaInvest = this.state.danaInvestasi.replace('.','').replace('.','').replace('.','');
                        periode = this.state.jangkaWaktu;
                        var c = (danaInvest*1)/((Math.pow(1+((this.state.estimasiReturn/12)/100),(periode*12))-1)/((this.state.estimasiReturn/12)/100))/(1+(this.state.estimasiReturn/12)/100)
                        result = Math.round(c)
                        break;
                }

            }
          
            this.props.navigation.navigate('SummeryKal',{idProd: this.state.idProduk,namaProd: this.state.namaProd,investasi: danaInvest,estimasiReturn: this.state.estimasiReturn,periodeInvest: periode,estimasiHasil: result,tipeMetode: this.state.metodeInvestasi,tipeKal:this.state.tipeKalkulator})
        }

    }

    pressBtn(value){
        switch(value){
            case '1':
                this.setState({
                    labelInvest: 'Dana',
                    tipeKalkulator:1,
                    colorBtn2: ['#fdfdfd', '#e7e7e7', '#d5d5d5'],
                    colorBtn1: ['#45d4fd', '#28ccfb', '#00bff3'],
                })
                break;
            case '2':
                this.setState({
                    labelInvest: "Target hasil",
                    tipeKalkulator:2,
                    colorBtn1: ['#fdfdfd', '#e7e7e7', '#d5d5d5'],
                    colorBtn2: ['#45d4fd', '#28ccfb', '#00bff3'],
                })
                break;
        }
    }
    logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Main')
      }
    returnProdukByProfilRisk(tipe) {
        fetch(GLOBAL.detailProdukByProfileRisk(tipe), {
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
                    estimasiReturn: res.data.produk.cagr,
                    idProduk: res.data.produk.id,
                    namaProd: res.data.produk.nama_produk,
                });
              })
            } else if (response.status == '401') {
             this.Unauthorized()
            } else {
                GLOBAL.gagalKoneksi()
            }
          })
    }
 
    manageCheckbox(isChecked){
        if(isChecked == 'konservatif'){
            this.returnProdukByProfilRisk('konservatif');
            this.setState({
                isCheckedKonservatif: !this.state.isCheckedKonservatif,
                isCheckedModerat:false,
                isCheckedAgresif:false,
            });
            
        }else if(isChecked == 'moderat'){
            this.returnProdukByProfilRisk('moderat');
                this.setState({
                    isCheckedKonservatif: false,
                    isCheckedModerat: !this.state.isCheckedModerat,
                    isCheckedAgresif:false,
                });
                
        }else if(isChecked == 'agresif'){
            this.returnProdukByProfilRisk('agresif');
                this.setState({
                    isCheckedKonservatif: false,
                    isCheckedModerat:false,
                    isCheckedAgresif:!this.state.isCheckedAgresif,
                });
                
        }
        
    }

    presMetode(value){
        switch(value){
            case 1:
                this.setState({ metodeInvestasi: value,satuanWaktu:'Tahun',satuanWaktuReturn:'Per Tahun'});
                break;
            case 2:
                this.setState({ metodeInvestasi: value,satuanWaktu:'Tahun',satuanWaktuReturn:'Per Tahun'})
                break;
        }
    }
    _getToken = async () => {
        var aksesToken = await AsyncStorage.getItem('aksesToken');
        if (aksesToken != null) {
          this.setState({ myToken: aksesToken })
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
    componentDidMount(){
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack();
            return true;
        });
        return this._getToken()
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }
    render() {
        return (
            <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
               <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />

                <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh.bind(this)}
                        />
                      } >
                    {
                        this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
                    }
                    <View style={[styles.containerMain,{marginBottom:25}]}>
                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>Metode Investasi</Text>
                            <RadioForm
                                radio_props={radio_investasi}
                                initial={0}
                                onPress={(value) => {this.presMetode(value)}}
                                formHorizontal={false}
                                isSelected={true}
                                labelHorizontal={true}
                                buttonColor={'#FFFF'}
                                buttonSize={20}
                                labelStyle={{ marginRight: 10 }}
                                selectedButtonColor={'#FFF'}
                                selectedLabelColor={'#FFF'}
                                labelColor={'#FFF'}
                                buttonOuterSize={30}
                                animation={true} />
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={{width:"50%",height:50}} onPress={()=>{this.pressBtn('1')}}>
                                <LinearGradient colors={this.state.colorBtn1} style={{height: 40,marginRight:10,marginBottom: 10,borderRadius: 10,alignItems: 'center',padding:3,justifyContent: 'center',padding:5}} >
                                    <Text style={styles.btnTextSmallDefault}>Hitung Target Hasil</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:"50%",height:50}} onPress={()=>{this.pressBtn('2')}}>
                                <LinearGradient colors={this.state.colorBtn2} style={{height: 40,marginLeft:10,marginBottom: 10,borderRadius: 10,alignItems: 'center',padding:3,justifyContent: 'center',padding:5}} >
                                    <Text style={styles.btnTextSmallDefault}>Hitung Dana</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>{this.state.labelInvest} Investasi</Text>
                            <View style={styles.textInputGroup}>
                                <View style={{backgroundColor:'#28ccfb',width:50,height:40,borderTopLeftRadius:10,borderBottomLeftRadius:10,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={styles.txtMed}>Rp </Text>
                                </View>
                                <TextInput placeholderTextColor="#000000" maxLength={17} ref={this.field1} style={styles.textInput} placeholder="0" keyboardType="number-pad" value={this.state.danaInvestasi.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g,'.')} onChangeText={(danaInvestasi) => this.setState({ danaInvestasi })} />
                            </View>
                            <Text style={[styles.labelText,{textAlign:'justify'}]}>{GLOBAL.terbilang(this.state.danaInvestasi.replace('.','').replace('.','').replace('.',''))}</Text>
                        </View>
                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>Jangka Waktu</Text>
                            <View style={[styles.textInputGroup,{width:150}]}>
                                <TextInput placeholderTextColor="#000000" maxLength={2} ref={this.field2} style={styles.textInput} placeholder="0" keyboardType="number-pad" value={this.state.jangkaWaktu} onChangeText={(jangkaWaktu) => this.setState({ jangkaWaktu })} />
                                <View style={{backgroundColor:'#28ccfb',width:60,height:40,borderTopRightRadius:10,borderBottomRightRadius:10,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={styles.txtMed}> {this.state.satuanWaktu} </Text>
                                </View>
                            </View>
                        </View>
                        {/* <View style={{ borderColor: '#efefef', backgroundColor: '#FFF', borderRadius: 10, padding: 10, width: "100%", marginTop: 5, marginBottom: 5, borderWidth: 1 }} > */}
                        <View style={[styles.inputGroup,{paddingRight:10}]} >
                            <Text style={styles.labelText}>Pilih Profil Risiko</Text>
                            <CheckBox
                                style={styles.labelCheckbox}
                                onClick={() => this.manageCheckbox('konservatif') }
                                isChecked={this.state.isCheckedKonservatif}
                                checkBoxColor='#FFF'
                                rightText={"Konservatif"}
                                rightTextStyle={styles.labelCheckbox}
                            />
                            <View style={{paddingLeft:25}}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                    <Text style={styles.txtLabelCheckbox}>Investor dengan profil risiko konservatif cenderung menghindari risiko dan lebih memilih instrumen investasi yang aman seperti tabungan, deposito, dan reksa dana pasar uang.</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                    <Text style={styles.txtLabelCheckbox}>Investor ini merasa nyaman dengan instrumen investasi yang imbal hasilnya tidak terlalu besar namun bergerak stabil.</Text>
                                </View>
                            </View>
                            <CheckBox
                                style={styles.labelCheckbox}
                                onClick={() => this.manageCheckbox('moderat') }
                                isChecked={this.state.isCheckedModerat}
                                checkBoxColor='#FFF'
                                rightText={"Moderat"}
                                rightTextStyle={styles.labelCheckbox}
                            />
                            <View style={{paddingLeft:25}}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                    <Text style={styles.txtLabelCheckbox}>Investor dengan profil risiko moderat memiliki karakteristik yang siap menerima fluktuasi jangka pendek dengan potensi keuntungan yang diharapkan dapat lebih tinggi dari tingkat inflasi dan deposito.</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                    <Text style={styles.txtLabelCheckbox}>Investor ini lebih berani mengambil risiko, namun tetap berhati-hati dalam memilih jenis instrumen investasi, dan biasanya membatasi jumlah investasi pada instrumen berisiko.</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                    <Text style={styles.txtLabelCheckbox}>Jenis reksa dana yang cocok untuk investor moderat adalah reksa dana campuran yang risikonya relatif lebih rendah dibandingkan dengan instrumen saham atau reksa dana saham.</Text>
                                </View>
                            </View>
                            <CheckBox
                                style={styles.labelCheckbox}
                                onClick={() => this.manageCheckbox('agresif') }
                                isChecked={this.state.isCheckedAgresif}
                                checkBoxColor='#FFF'
                                rightText={"Agresif"}
                                rightTextStyle={styles.labelCheckbox}
                            />
                            <View style={{paddingLeft:25}}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                    <Text style={styles.txtLabelCheckbox}>Investor dengan profil risiko agresif sangat siap untuk menanggung risiko.</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                    <Text style={styles.txtLabelCheckbox}>Investor ini cenderung berani mengambil risiko yang lebih tinggi untuk mendapatkan imbal hasil yang tinggi.</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                    <Text style={styles.txtLabelCheckbox}>Jenis reksa dana yang cocok untuk investor agresif adalah reksa dana saham yang risikonya relatif lebih tinggi dibandingkan namun dengan potensi keuntungan yang lebih tinggi juga.</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>Estimasi Imbal Balik {this.state.satuanWaktuReturn}</Text>
                            <View style={styles.textInputGroup}>
                                <Text style={styles.textInput}>{GLOBAL.currency(this.state.estimasiReturn,'.',false)}</Text>
                                <View style={{backgroundColor:'#28ccfb',width:50,height:40,borderTopRightRadius:10,borderBottomRightRadius:10,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={styles.txtMed}> % </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.boxBtnBottom}>
                        <AwesomeButton
                            borderRadius={15}
                            backgroundColor="#00a95c"
                            backgroundDarker="#039251"
                            backgroundShadow="#000"
                            height={40}
                            width={GLOBAL.DEVICE_WIDTH*0.5}
                            style={{marginTop:10}}
                            onPress={this.hitungProses}
                        >
                        <Image source={require('./../img/btnBeli.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5,height:40,resizeMode:'stretch'}} />
                        <Text style={[{position: 'absolute'},styles.btnTextWhite]}>HITUNG</Text>
                        </AwesomeButton>
                    </View>
                </ScrollView>
                
                {renderIf(this.state.modalVisibleUnAuth == true)(
                        <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
                    )}
            </LinearGradient>
        );
    }
}

export default KalkulatorFin;


import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableOpacity, Image, Dimensions, Modal, ActivityIndicator, TextInput, Alert, StatusBar,BackHandler, KeyboardAvoidingView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import CheckBox from 'react-native-check-box';
import Icon from 'react-native-vector-icons/Ionicons';
import renderIf from './Renderif';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');

class SimulasiInvestasi extends Component {
    constructor(props) {
        super(props);
        this.field1 = React.createRef(); 
        this.field2 = React.createRef(); 
        this.field3 = React.createRef(); 
        this.state = {
            isLoading: false,
            myToken:'',
            tahun: '',
            impian: '',
            estimasiRupiah: '',
            modalView: true,
            isCheckedKonservatif: false,
            isCheckedModerat: false,
            isCheckedAgresif: false,
            modalVisible:false,
            targetReturn:0,
            investasi:'',
            nilaiReturn:0,
            statusNasabah:'',
            namaProduk:'',
            cagr:0,
            pageId:1,
        }

    };
    goToMulaiInvest(){
        this.setState({modalVisible:false});
        if(this.state.statusNasabah == 'aktif'){
            this.props.navigation.navigate('Product');
        }else if(this.state.pageId == 1){
            this.props.navigation.navigate('Daftar');
        }else{
            this.props.navigation.navigate('Regist1');
        }
    }
    simulasikan() {
        var result;
        var danaInvest;
        var periode;
        var periodeOnBulan;
        var profilRisiko;
        var returnPerTahun;
        var kinerja;
        if (this.state.impian.length < 1) {
            Alert.alert('Perhatian', 'Kolom impian harus diisi!',
                [{ text: 'OK',
                onPress: () => { 
                    const textInput = this.field1.current;
                    textInput.focus();
                } }],
                { cancelable: false },
            );
        } else if (this.state.tahun.length < 1 || this.state.tahun == 0) {
            Alert.alert('Perhatian', 'Kolom tahun harus diisi',
                [{ text: 'OK',
                onPress: () => { 
                    const textInput = this.field2.current;
                    textInput.focus();
                } }],
                { cancelable: false },
            );
        } else if (!this.state.tahun.match(GLOBAL.numbersFormat) || this.state.tahun.slice(0, 1) == 0) {
            Alert.alert('Perhatian', 'kolom tahun tidak valid',
                [{ text: 'OK',
                onPress: () => { 
                    const textInput = this.field2.current;
                    textInput.focus();
                } }],
                { cancelable: false },
            );
        } else if (this.state.estimasiRupiah.length < 1) {
            Alert.alert('Perhatian', 'Kolom estimasi rupiah harus diisi',
                [{ text: 'OK',
                onPress: () => { 
                    const textInput = this.field3.current;
                    textInput.focus();
                } }],
                { cancelable: false },
            );
        } else if (this.state.estimasiRupiah.slice(0, 1) == 0) {
            Alert.alert('Perhatian', 'Kolom estimasi rupiah tidak valid',
                [{ text: 'OK',
                onPress: () => { 
                    const textInput = this.field3.current;
                    textInput.focus();
                } }],
                { cancelable: false },
            );
        }else if(this.state.isCheckedKonservatif == false && this.state.isCheckedModerat == false && this.state.isCheckedAgresif == false){
            Alert.alert('Perhatian', 'Profil risiko harus diisi!',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        }else {
            if(this.state.isCheckedAgresif == true){
                profilRisiko = 'Agresif';
                returnPerTahun = 10;

            }
            // if(this.state.isCheckedModerat== true){
            //     profilRisiko = 'Moderat';
            //     returnPerTahun = 8;
            // }
            // if(this.state.isCheckedKonservatif == true){
            //     profilRisiko = 'Konservatif';
            //     returnPerTahun = 5;
            // }
            // var currentVal=(returnPerTahun+100)/100;
            // var pangkatVal = 1/(1*12);
            // kinerja = ((Math.pow(currentVal,pangkatVal))-1)*100;
            kinerja = (this.state.cagr/12)/100;
            danaInvest = this.state.estimasiRupiah.replace('.','').replace('.','').replace('.',''); ;
            periode = this.state.tahun;
            periodeOnBulan = periode*12;
            var a = danaInvest*1;
            var b = Math.pow(1+(kinerja),periodeOnBulan)-1;
            var c = (danaInvest*1)/((Math.pow(1+kinerja,periodeOnBulan)-1)/kinerja)/(1+kinerja)
            //  alert(a+" "+b+" "+periodeOnBulan+" "+kinerja+' '+c)
            result = Math.round(c);
           
            this.setState({investasi:result,nilaiReturn:this.state.cagr,modalVisible:true,targetReturn:danaInvest })
        }
    }
    _getDetailProduct(tipe) {
        fetch(GLOBAL.detailProdukByProfileRisk(tipe), {
          method: 'GET',
          headers: {
            'Accept': 'appication/json',
            'Content-type': 'application/json',
          }
        })
          .then((response) => {
            if (response.status == '201') {
              let res;
              return response.json().then(obj => {
                res = obj;
                this.setState({
                    namaProduk: res.data.produk.nama_produk,
                    cagr:res.data.produk.cagr,
                })
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
            
                this.setState({
                    isCheckedKonservatif: !this.state.isCheckedKonservatif,
                    isCheckedModerat:false,
                    isCheckedAgresif:false,
                });
                this._getDetailProduct('konservatif');
                
        }else if(isChecked == 'moderat'){
                this.setState({
                    isCheckedKonservatif: false,
                    isCheckedModerat: !this.state.isCheckedModerat,
                    isCheckedAgresif:false,
                });
                this._getDetailProduct('moderat');
        }else if(isChecked == 'agresif'){
                this.setState({
                    isCheckedKonservatif: false,
                    isCheckedModerat:false,
                    isCheckedAgresif:!this.state.isCheckedAgresif,
                });
                this._getDetailProduct('agresif');
        }
    }
    onPressNotifBtn(){
        this.setState({modalVisible:false});
        if (this.state.statusNasabah == 'aktif') {
            this.props.navigation.navigate('FormNotifInvest',{nilaiInvest:this.state.investasi,namaProduk:this.state.namaProduk})
        } else if (this.state.statusNasabah == 'pending') {
            Alert.alert('Perhatian', 'Pendaftaran Anda sedang dalam proses. Transaksi dapat dilakukan bila pendaftaran Anda sudah diaktifasi',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        } else if (this.state.statusNasabah == 'belum nasabah') {
            Alert.alert('Perhatian', 'Anda belum melengkapi data nasabah, segera lengkapi data nasabah!',
                [
                { text: 'Nanti', onPress: () => console.log('Cancel Pressed') },
                { text: 'Lengkapi Sekarang', onPress: () => this.props.navigation.navigate('Regist1') }
                ],
                { cancelable: false },
            );
        }
    }
    _getAsycStore = async () => {
        var statusNasabahStore = await AsyncStorage.getItem('statusNasabah');
        var aksesToken = await AsyncStorage.getItem('aksesToken');
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken })
        }else{
            this.setState({ myToken: '' })
        }
        if (statusNasabahStore != null) {
            this.setState({ statusNasabah: statusNasabahStore })
        }else{
            this.setState({ statusNasabah: ''})
        }
    }
    componentDidMount(){
        const {params} = this.props.navigation.state;
        this.setState({
            impian: params.dream,
            pageId: params.pageId,
        });
        this._getAsycStore();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack();
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }
    render() {
        return (
            <LinearGradient colors={['#FFF', '#FFF', '#FFF']} style={styles.wrapper}>
                <StatusBar backgroundColor='#FFF' barStyle='dark-content' hidden={false} />
                <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>

                        <View style={styles.containerMain}>
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelInputModal}>Apa Impianmu</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 10 }}>
                                    <TouchableOpacity style={styles.boxItem100White} onPress={() => this.setState({ impian: 'Rumah impian' })}>
                                        <View style={styles.boxIcon100White}>
                                            <Image source={require('../img/rumah.png')} style={styles.icon100White} />
                                        </View>
                                        <Text style={styles.boxTitle100White}>Rumah{"\n"}Impian</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.boxItem100White} onPress={() => this.setState({ impian: 'Mobil impian' })}>
                                        <View style={styles.boxIcon100White}>
                                            <Image source={require('../img/mobil.png')} style={styles.icon100White} />
                                        </View>
                                        <Text style={styles.boxTitle100White}>Mobil{"\n"}Impian</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.boxItem100White} onPress={() => this.setState({ impian: 'Tabungan pendidikan' })}>
                                        <View style={styles.boxIcon100White}>
                                            <Image source={require('../img/pendidikan.png')} style={styles.icon100White} />
                                        </View>
                                        <Text style={styles.boxTitle100White}>Tabungan{"\n"}Pendidikan</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.boxItem100White} onPress={() => this.setState({ impian: 'Liburan impian' })}>
                                        <View style={styles.boxIcon100White} >
                                            <Image source={require('../img/keliling_dunia.png')} style={styles.icon100White} />
                                        </View>
                                        <Text style={styles.boxTitle100White}>Liburan{"\n"}Impian</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.textInputGroupModal}>
                                    <TextInput placeholderTextColor="#000000" ref={this.field1} onSubmitEditing={() => {
                                        const textInput = this.field2.current;
                                        textInput.focus()
                                    }} style={styles.textInput} placeholder="Impian Anda" keyboardType="default" value={this.state.impian} onChangeText={(impian) => { this.setState({ impian }) }} />
                                </View>
                            </View>
                            <View style={[styles.inputGroup,{paddingRight:10}]} >
                                <Text style={styles.labelInputModal}>Pilih Jangka Waktu</Text>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginBottom: 10, marginLeft: 10, marginRight: 10 }}>
                                    <TouchableOpacity style={styles.txtHorizontalScroll} onPress={() => this.setState({ tahun: '1' })}>
                                        <Text style={styles.txtLittle}>1 Tahun</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.txtHorizontalScroll} onPress={() => this.setState({ tahun: '3' })} >
                                        <Text style={styles.txtLittle}>3 Tahun</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.txtHorizontalScroll} onPress={() => this.setState({ tahun: '5' })} >
                                        <Text style={styles.txtLittle}>5 Tahun</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.txtHorizontalScroll} onPress={() => this.setState({ tahun: '10' })} >
                                        <Text style={styles.txtLittle}>10 Tahun</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                                <View style={[styles.textInputGroupModal,{width:150}]}>
                                    <TextInput placeholderTextColor="#000000" ref={this.field2} maxLength={2} onSubmitEditing={() => {
                                        const textInput = this.field3.current;
                                        textInput.focus()
                                    }} style={styles.textInput} placeholder="Tahun" value={this.state.tahun} keyboardType="number-pad" onChangeText={(tahun) => { this.setState({ tahun }) }} />
                                    <View style={{backgroundColor:'#28ccfb',width:60,height:40,borderTopRightRadius:20,borderBottomRightRadius:20,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={styles.txtDefault}>Tahun</Text>
                                    </View>
                                </View>
                            </View>
                            <KeyboardAvoidingView behavior="position">
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelInputModal}>Estimasi Nilai Rupiah Impianmu</Text>
                                <View style={styles.textInputGroupModal}>
                                    <TextInput placeholderTextColor="#000000" maxLength={17} ref={this.field3} style={styles.textInput} value={this.state.estimasiRupiah.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g,'.')} placeholder="Estimasi Rupiah" keyboardType="number-pad" onChangeText={(estimasiRupiah) => { this.setState({ estimasiRupiah }) }} />
                                </View>
                                <Text style={{marginBottom:2,textAlign:'justify',color:GLOBAL.statusBarColor,fontSize:14}}>{GLOBAL.terbilang(this.state.estimasiRupiah.replace('.','').replace('.','').replace('.',''))}</Text>
                            </View>
                            </KeyboardAvoidingView>
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelInputModal}>Pilih Profil Risiko</Text>
                                <CheckBox
                                    style={styles.txtLittleBlack}
                                    onClick={() => {this.manageCheckbox('konservatif')} }
                                    isChecked={this.state.isCheckedKonservatif}
                                    checkBoxColor='#000'
                                    rightText={"Konservatif"}
                                    rightTextStyle={styles.txtLittleBlack,{fontWeight: '600'}}
                                />
                                <View style={{paddingLeft:25}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text >{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckboxBlack}>Investor dengan profil risiko konservatif cenderung menghindari risiko dan lebih memilih instrumen investasi yang aman seperti tabungan, deposito, dan reksa dana pasar uang.</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckboxBlack}>Investor ini merasa nyaman dengan instrumen investasi yang imbal hasilnya tidak terlalu besar namun bergerak stabil.</Text>
                                    </View>
                                </View>
                                <CheckBox
                                    style={styles.txtLittleBlack}
                                    onClick={() => {this.manageCheckbox('moderat')} }
                                    isChecked={this.state.isCheckedModerat}
                                    checkBoxColor='#000'
                                    rightText={"Moderat"}
                                    rightTextStyle={styles.txtLittleBlack,{fontWeight: '600'}}
                                />
                                <View style={{paddingLeft:25}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckboxBlack}>Investor dengan profil risiko moderat memiliki karakteristik yang siap menerima fluktuasi jangka pendek dengan potensi keuntungan yang diharapkan dapat lebih tinggi dari tingkat inflasi dan deposito.</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckboxBlack}>Investor ini lebih berani mengambil risiko, namun tetap berhati-hati dalam memilih jenis instrumen investasi, dan biasanya membatasi jumlah investasi pada instrumen berisiko.</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckboxBlack}>Jenis reksa dana yang cocok untuk investor moderat adalah reksa dana campuran yang risikonya relatif lebih rendah dibandingkan dengan instrumen saham atau reksa dana saham.</Text>
                                    </View>
                                </View>
                                <CheckBox
                                    style={styles.txtLittleBlack}
                                    onClick={() => {this.manageCheckbox('agresif')} }
                                    isChecked={this.state.isCheckedAgresif}
                                    checkBoxColor='#000'
                                    rightText={"Agresif"}
                                    rightTextStyle={styles.txtLittleBlack,{fontWeight: '600'}}
                                />
                                <View style={{paddingLeft:25}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckboxBlack}>Investor dengan profil risiko agresif sangat siap untuk menanggung risiko.</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckboxBlack}>Investor ini cenderung berani mengambil risiko yang lebih tinggi untuk mendapatkan imbal hasil yang tinggi.</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckboxBlack}>Jenis reksa dana yang cocok untuk investor agresif adalah reksa dana saham yang risikonya relatif lebih tinggi dibandingkan namun dengan potensi keuntungan yang lebih tinggi juga.</Text>
                                    </View>
                                </View>
                            </View>
                        
                        </View>
                        <View style={styles.boxBtnBottom}>
                            <AwesomeButton
                                borderRadius={15}
                                backgroundColor='#4F7942'
                                backgroundShadow="#000"
                                backgroundDarker="#45673a"
                                height={40}
                                style={{marginTop:10}}
                                width={GLOBAL.DEVICE_WIDTH*0.5}
                                onPress={() => this.simulasikan()}
                                >
                                    <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5,height:40,resizeMode:'stretch'}} />
                                    <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SIMULASIKAN</Text>
                            </AwesomeButton>
                        </View>
                </ScrollView>
                
                {/* modal hasil simulasi */}
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({modalVisible: false}) }>
                    <View style={styles.wrapper} >
                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
                        
                        <TouchableOpacity style={styles.btnBackCircle} onPress={()=> this.setState({modalVisible:false})}>
                            <Icon size={20} name="ios-close" color="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.containerMain}>
                            <Text style={[styles.txtHeadBlack2,{marginBottom:10}]}>Hasil Simulasi Investasi</Text>        
                            <View style={{flexDirection:'row',marginBottom:5}}>
                                <View style={{width:'30%'}}>
                                    <Text style={styles.txtBlackHead}>Target impian kamu</Text>
                                </View>
                                <View style={{width:'70%',justifyContent:'flex-end',alignItems:'flex-end'}}>
                                    <Text style={styles.txtBlueMed}>{this.state.impian}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',marginBottom:5}}>
                                <View style={{width:'30%'}}>
                                    <Text style={styles.txtBlackHead}>Estimasi nilai impian kamu</Text>
                                </View>
                                <View style={{width:'70%',justifyContent:'flex-end',alignItems:'flex-end'}}>
                                    <Text style={styles.txtBlueMed}>Rp {this.state.targetReturn.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g, '.')}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',marginBottom:5}}>
                                <View style={{width:'30%'}}>
                                    <Text style={styles.txtBlackHead}>Periode wujudkan impian kamu</Text>
                                </View>
                                <View style={{width:'70%',justifyContent:'flex-end',alignItems:'flex-end'}}>
                                    <Text style={styles.txtBlueMed}>{this.state.tahun} Tahun</Text>
                                </View>
                            </View>
                            <View style={styles.blackLine} />
                            <View style={{flexDirection:'row',marginBottom:5}}>
                                <View style={{width:'30%'}}>
                                    <Text style={styles.txtBlackHead}>Estimasi investasi per bulan</Text>
                                </View>
                                <View style={{width:'70%',justifyContent:'flex-end',alignItems:'flex-end'}}>
                                    <Text style={styles.txtBlueMed}>Rp {this.state.investasi.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g, '.')}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{width:'30%'}}>
                                    <Text style={styles.txtBlackHead}>Estimasi imbal balik per tahun</Text>
                                </View>
                                <View style={{width:'70%',justifyContent:'flex-end',alignItems:'flex-end'}}>
                                    <Text style={styles.txtBlueMed}>{GLOBAL.currency(this.state.nilaiReturn,'.',false)} %</Text>
                                </View>
                            </View>
                            <Text style={[styles.txtBlackHead,{marginTop:15}]}>Disclaimer</Text>
                            <Text style={[styles.txtBlueMed,{textAlign:'justify'}]}>Simulasi ini disediakan hanya sebagai alat bantu simulasi investasi dan tidak dimaksudkan untuk menyediakan rekomendasi atau saran apa pun.{"\n"}{"\n"}PT Henan Putihrai Asset Management tidak bertanggung jawab atas keakuratan hasil simulasi ini. Segala akibat yang timbul dari penggunaan hasil simulasi menjadi tanggung jawab investor / calon investor sepenuhnya.{"\n"}{"\n"}Nilai estimasi hasil investasi bukan merupakan jaminan hasil investasi yang akan diperoleh Investor, namun hanya merupakan indikasi. Dalam hal Investor / calon Investor memilih profil risiko, maka nilai estimasi hasil investasi yang ditampilkan merupakan nilai hasil investasi historis rata-rata dari jenis produk investasi sesuai dengan profil risiko yang dipilih.</Text>
                        </View>
                        <View style={[styles.modalFormBtnBottom, { flexDirection: "row",justifyContent:'center',alignItems:'center' }]}>

                            <AwesomeButton
                                borderRadius={15}
                                backgroundColor='#28ccfb'
                                backgroundShadow="#000"
                                backgroundDarker="#23b6e0"
                                height={40}
                                width={GLOBAL.DEVICE_WIDTH*0.5-25}
                                style={{marginTop:10,marginRight:10}}
                                onPress={() => this.goToMulaiInvest() }
                            >
                            <Image source={require('./../img/btnPrev.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                            <Text style={[{position: 'absolute'},styles.btnTextWhite]}>INVESTASI</Text>
                            </AwesomeButton>
                            {renderIf(this.state.myToken != '' && this.state.statusNasabah == 'aktif')(
                
                            <AwesomeButton
                                borderRadius={15}
                                backgroundColor='#4F7942'
                                backgroundShadow="#000"
                                backgroundDarker="#45673a"
                                height={40}
                                width={GLOBAL.DEVICE_WIDTH*0.5-25}
                                style={{marginTop:10,marginLeft:10}}
                                onPress={() => this.onPressNotifBtn() }
                            >
                            <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-20,height:40,resizeMode:'stretch'}} />
                            <Text style={[{position: 'absolute'},styles.btnTextWhite]}>BUAT PENGINGAT</Text>
                            </AwesomeButton>
                            )}
                        </View>
                    </ScrollView>
                    </View>
                </Modal>
            
            </LinearGradient>



        );
    }
}

export default SimulasiInvestasi;

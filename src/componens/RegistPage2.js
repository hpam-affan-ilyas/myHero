
import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, StatusBar,Platform, View, KeyboardAvoidingView, TextInput, Alert, Modal, ActivityIndicator, RefreshControl,BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import SearchableDropDown from 'react-native-searchable-dropdown';
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView } from 'react-native-gesture-handler';
// import { useDarkMode } from 'react-native-dark-mode';
import DateTimePicker from "react-native-modal-datetime-picker";
import UnAuth from './UnauthPage';
import renderIf from './Renderif';
import Icon from 'react-native-vector-icons/FontAwesome';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');
var platform = Platform.OS;
// const isDarkMode = useDarkMode();
const option = [{ label: 'Pria', value: '1' }, { label: 'Wanita', value: '2' }];

class RegistPage2 extends React.Component {
    constructor(props) {
        super(props);
        this.field1 = React.createRef(); 
        this.field2 = React.createRef(); 
        this.field3 = React.createRef(); 
        this.field4 = React.createRef(); 
        this.field5 = React.createRef(); 
        this.field6 = React.createRef(); 
        this.field7 = React.createRef();
        this.state = {
            isLoading: false,
            sDateTimePickerVisible: false,
            eKtp: '',
            myToken: '',
            editNama: true,
            editNoHp: true,
            editJk: true,
            editTglLahir: true,
            editTempatLahir: true,
            namaValue: '',
            emailValue: '',
            noHpValue: '',
            tglLahirValue: '',
            tempatLahirValue: '',
            statusNikahValue: '',
            agamaValue: '',
            dataStatusNikah: [{ id: 1, value: 'Belum Menikah' }, { id: 2, value: 'Menikah' }, { id: 3, value: 'Janda / Duda' }],
            dataAgama: [],
            refreshing: false,
            modalVisibleUnAuth: false,
            jenis_kelaminValue:'0',
            isCheckedPria:false,
            isCheckedWanita:false,
            tanggalId: '',
            tanggalValue: '',
            errTanggalValue: '',
            tanggal: '',
            yearId: '',
            yearValue: '',
            bulanId: '',
            bulanValue: '',
            errBulanValue: ''
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

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        this.setState({
            errTglLahir: undefined
        })
        let dateChoosed = date;
        var a;
        if ((dateChoosed.getMonth() + 1) < 10) {
            a = '0' + (dateChoosed.getMonth() + 1)
        } else {
            a = (dateChoosed.getMonth() + 1)
        }
        let formatted_date = dateChoosed.getDate() + "-" + a + "-" + dateChoosed.getFullYear()
        // this.setState({ tglLahirValue: formatted_date })
        this.hideDateTimePicker();
        const textInput = this.field5.current;
        textInput.focus()
    };

    onPreviuos = () => {
        this.props.navigation.navigate('Regist1');
    }
    onNext = () => {
        var bulanId = '';
        if(this.state.bulanValue == "Januari") {
            bulanId = "01";
        } else if (this.state.bulanValue == "Februari") {
            bulanId =  "02";
        } else if (this.state.bulanValue == "Maret") {
            bulanId =  "03";
        } else if (this.state.bulanValue == "April") {
            bulanId =  "04";
        } else if (this.state.bulanValue == "Mei") {
            bulanId =  "05";
        } else if (this.state.bulanValue == "Juni") {
            bulanId =  "06";
        } else if (this.state.bulanValue == "Juli") {
            bulanId =  "07";
        } else if (this.state.bulanValue == "Agustus") {
            bulanId =  "08";
        } else if (this.state.bulanValue == "September") {
            bulanId =  "09";
        } else if (this.state.bulanValue == "Oktober") {
            bulanId =  "10";
        } else if (this.state.bulanValue == "November") {
            bulanId = "11";
        } else if (this.state.bulanValue == "Desember") {
            bulanId =  "12";
        }
        let states = this.state;
        let namaValue = states.namaValue;
        let emailValue = states.emailValue;
        let noHpValue = states.noHpValue;
        let jenisKelaminValue = states.jenis_kelaminValue;
        let tanggalLahirValue = states.tanggalValue+'-'+bulanId+'-'+states.yearValue;
        let tempatLahirValue = states.tempatLahirValue;
        let statusNikahValue = states.statusNikahValue;
        let agamaValue = states.agamaValue;
        let tanggalValue = states.tanggalValue;
        let bulanValue = states.bulanValue;
        let yearValue = states.yearValue;
        console.log("Tanggal Lahir Value", tanggalLahirValue);
        
        let continueNextPage = true;
        !namaValue && [continueNextPage = false, this.setState({errNama: 'Nama Tidak Boleh Kosong'})]
        if(!emailValue) {
            continueNextPage = false
            this.setState({errEmail: 'Email Tidak Boleh Kosong'})
        } else {
            if(!emailValue.match(GLOBAL.mailFormat)) {
                continueNextPage = false
                this.setState({errEmail: 'Email Tidak Valid'})
            }
        }
        console.log("Tanggal Value", tanggalValue);
        console.log("Bulan Value", bulanValue);
        console.log("Tahun Value", yearValue);
        console.log("Tempat Lahir", tempatLahirValue);
        !noHpValue && [continueNextPage = false, this.setState({errNoHp: 'Nomor Handphone Tidak Boleh Kosong'})]
        jenisKelaminValue == 0 && [continueNextPage = false, this.setState({errJenisKelamin: 'Jenis Kelamin Harus di Pilih'})]
        !tanggalLahirValue && [continueNextPage = false, this.setState({errTglLahir: 'Tanggal Lahir Harus di Isi'})]
        !tempatLahirValue && [continueNextPage = false, this.setState({errTempatLahir: 'Tempat Lahir Tidak Boleh Kosong'})]
        !statusNikahValue && [continueNextPage = false, this.setState({errStatusNikah: 'Status Nikah Tidak Boleh Kosong'})]
        !agamaValue && [continueNextPage = false, this.setState({errAgama: 'Agama Tidak Boleh Kosong'})]
        !tanggalValue && [continueNextPage = false, this.setState({errTanggalValue: 'Tanggal Harus Lengkap'})]
        !bulanValue && [continueNextPage = false, this.setState({errTanggalValue: 'Tanggal Harus Lengkap'})]
        !yearValue && [continueNextPage = false, this.setState({errTanggalValue: 'Tanggal Harus Lengkap'})]
        if(tanggalValue && bulanValue && yearValue) {
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var theDate = new Date(yearValue+"-"+bulanId+"-"+tanggalValue);
            var daysInMonth = new Date(yearValue, bulanId, 0).getDate();
            console.log("Days In Month", daysInMonth);
            var dateValid = true;
            console.log("tanggalValue > daysInMonth", tanggalValue > daysInMonth);
            if(tanggalValue > daysInMonth) {
                dateValid = false;
            }
            if(!dateValid) {
                this.setState({
                    errTanggalValue: "Format Tanggal Tidak Valid"
                });
                continueNextPage = false;
            }
        }
        console.log("Error Tempat Lahir", this.state.errTempatLahir);
        console.log("Error Tanggal lAHIR Lahir", this.state.errTanggalValue);
        console.log('Continue to the Next Page?', continueNextPage);
        if(continueNextPage) {
            var statusNikahId;
            var a = this.state.dataStatusNikah
            var b = a.map((a, key) => a);
            for (var i = 0; i < b.length; i++) {
                if (b[i].value == this.state.statusNikahValue) {
                    statusNikahId = b[i].id
                }
            }
            var agamaId;
            var agama = this.state.dataAgama;
            var agama2 = agama.map((agama, key) => agama);
            for (var i = 0; i < agama2.length; i++) {
                if (agama2[i].value == this.state.agamaValue) {
                    agamaId = agama2[i].id
                }
            }
            
            this.setState({
                tglLahirValue: this.state.tanggalValue+'-'+bulanId+'-'+this.state.yearValue
            })
            console.log("set item tglLahirValue", tanggalLahirValue);
            AsyncStorage.setItem('jkValue', this.state.jenis_kelaminValue);
            AsyncStorage.setItem('tglLahirValue', tanggalLahirValue);
            AsyncStorage.setItem('tempatLahirValue', this.state.tempatLahirValue);
            AsyncStorage.setItem('statusNikahValue', this.state.statusNikahValue);
            AsyncStorage.setItem('statusNikahId', '' + statusNikahId);
            AsyncStorage.setItem('agamaValue', this.state.agamaValue);
            AsyncStorage.setItem('agamaId', '' + agamaId);

            let uploadData = new FormData();
            var tgl = tanggalLahirValue.split('-');
            var tgl_lahir = tgl[2] + '-' + tgl[1] + '-' + tgl[0];
            uploadData.append('nama', this.state.namaValue);
            uploadData.append('email', this.state.emailValue);
            uploadData.append('phone', this.state.noHpValue);
            uploadData.append('tempatLahir', this.state.tempatLahirValue);
            uploadData.append('jenisKelamin', this.state.jenis_kelaminValue);
            uploadData.append('tanggalLahir', tgl_lahir);
            uploadData.append('statusNikah', statusNikahId);
            uploadData.append('agama', agamaId);
            uploadData.append('page', '2');
            console.log("Upload Data Page 2", uploadData);
            this.props.navigation.navigate('Regist3')
            // fetch(GLOBAL.register(), {
            //     method: 'POST',
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'multipart/form-data',
            //         'Authorization': this.state.myToken,
            //     },
            //     body: uploadData
            // }).then((response) => {
            //     console.log("Response Status Pendaftaran", response.status);
            //     if (response.status == '201') {
            //         this.setState({ isLoading: false });
            //         let res;
            //         return response.json().then(obj => {
            //             res = obj;
            //             // Alert.alert('Sukses', 'Registrasi berhasil, data sudah dilengkapi',
            //             //     [{ text: 'OK', onPress: () => this.props.navigation.navigate('Home') }],
            //             //     { cancelable: false },
            //             // );
            //         })
            //     } else if (response.status == '401') {
            //         this.setState({ isLoading: false });
            //         this.Unauthorized()
            //     } else if (response.status == '400') {
            //         this.setState({ isLoading: false });
            //         let res;
            //         return response.json().then(obj => {
            //             res = obj;
            //             console.log("Res 400", res);
            //             Alert.alert('Gagal', res.message,
            //                 [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            //                 { cancelable: false },
            //             );
            //         })
            //     } else {
            //         // console.log("Response Else", response);
            //         // this.setState({ isLoading: false });
            //         // GLOBAL.gagalKoneksi()
            //     }
            // })
        }
    }
    _getAgama(token) {
        fetch(GLOBAL.getAgama(), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token,
            }
        })
            .then((response) => {
                this.setState({ isLoading: false })
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        var count = Object.keys(res.data.agama).length;
                        let data_agama = [];
                        for (var i = 0; i < count; i++) {
                            data_agama.push({
                                id: res.data.agama[i].id,
                                value: res.data.agama[i].nama_agama
                            })
                        }
                        this.setState({ dataAgama: data_agama })
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
        var eKtpStore = await AsyncStorage.getItem('eKtp');
        var namaStore = await AsyncStorage.getItem('namaValue');
        var emailStore = await AsyncStorage.getItem('emailValue');
        var noHpStore = await AsyncStorage.getItem('noHpValue');
        var jkStore = await AsyncStorage.getItem('jkValue');
        var tglLahirStore = await AsyncStorage.getItem('tglLahirValue');
        var tempatLahirStore = await AsyncStorage.getItem('tempatLahirValue');
        var statusNikahStore = await AsyncStorage.getItem('statusNikahValue');
        var statusNikahIdStore = await AsyncStorage.getItem('statusNikahId');
        var agamaStore = await AsyncStorage.getItem('agamaValue');
        var agamaIdStore = await AsyncStorage.getItem('agamaId');
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken })
            if (namaStore != null) {
                this.setState({ namaValue: namaStore })
            }
            // if (eKtpStore != null) {
            //     this._cekEktp(this.state.myToken, eKtpStore)
            // }
            if (emailStore != null) {
                this.setState({ emailValue: emailStore })
            }
            if (noHpStore != null) {
                this.setState({ noHpValue: noHpStore })
            }
            
            if (jkStore != null) {
                this.setState({jenis_kelaminValue: jkStore})
            }
            if (tglLahirStore != null) {
                this.setState({ tglLahirValue: tglLahirStore })
            }
            if (tempatLahirStore != null) {
                this.setState({ tempatLahirValue: tempatLahirStore })
            }
            if (statusNikahStore != null) {
                this.setState({ statusNikahValue: statusNikahStore })
            }
            if (statusNikahIdStore != null) {
                this.setState({ statusNikahId: statusNikahIdStore })
            }
            if (agamaStore != null) {
                this.setState({ agamaValue: agamaStore })
            }
            if (agamaIdStore != null) {
                this.setState({ agamaIdValue: agamaIdStore })
            }
            this._getAgama(this.state.myToken);
            this._getTanggal(this.state.myToken);
        } else {
            this.Unauthorized()
        }
    }
    _getTanggal(token) {
        console.log("masuk get tanggal");
        const data_tanggal = [];
        for(var i = 1; i <= 31; i++) {
            data_tanggal.push({
                id: i,
                value: i.toString()
            })
        }
        this.setState({
            dataTanggal: data_tanggal
        })
        console.log("State Data Tanggal", this.state.dataTanggal);

        fetch(GLOBAL.getMonths(), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token,
            }
        })
            .then((response) => {
                this.setState({ isLoading: false })
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        var count = Object.keys(res.data.months).length;
                        var data_bulan = [];
                        for (var i = 0; i < count; i++) {
                            data_bulan.push({
                                id: res.data.months[i].id,
                                value: res.data.months[i].name
                            })
                        }
                        this.setState({ dataBulan: data_bulan })
                        console.log("State Data Bulan", this.state.dataBulan);
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })

        const d = new Date();
        let year = d.getFullYear();
        let tenYears = year - 10;
        let hundredYears = tenYears - 100;
        let years = [];
        for(let i = tenYears; i >= hundredYears; i--) {
            years.push({
                id: i,
                value: i.toString()
            });
        }
        this.setState({
            dataYears: years
        })
    }

    checkBirthDateYear(yearValue) {
        console.log("Year Value", yearValue);
        if(!this.state.tanggalValue || !this.state.bulanValue || !this.state.yearValue) {
            this.setState({
                errTanggalValue: "Format Tanggal Tidak Valid"
            })
        } else {
            this.setState({
                errTanggalValue: undefined
            })
        }
        
    }

    checkBirthDateMonth(bulanValue) {
        console.log("Bulan Value", bulanValue);
        if(!this.state.tanggalValue || !this.state.bulanValue || !this.state.yearValue) {
            this.setState({
                errTanggalValue: "Format Tanggal Tidak Valid"
            })
        } else {
            this.setState({
                errTanggalValue: undefined
            })
        }
        this.setState({yearValue, errTahunValue: undefined })
        
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this._getToken().then(() => {
            this.setState({ refreshing: false })
        });
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
                <View style={{height:GLOBAL.DEVICE_HEIGHT-100}}> 
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        } >
                            <View style={[styles.containerMain,{marginBottom:25}]}>
                                {
                                    this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
                                }
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <View style={styles.activeCirclePage}><Text style={styles.btnTxtDefault}>1</Text></View>
                                    <View style={styles.lineCirclePageActive} />
                                    <View style={styles.activeCirclePage}><Text style={styles.btnTxtDefault}>2</Text></View>
                                    <View style={styles.lineCirclePage} />
                                    <View style={styles.whiteCirclePage} ><Text style={styles.btnTxtDefault}>3</Text></View>
                                    <View style={styles.lineCirclePage} />
                                    <View style={styles.whiteCirclePage} ><Text style={styles.btnTxtDefault}>4</Text></View>
                                </View>
                                <View style={styles.inputGroup} >
                                    <Text style={styles.labelText}>Nama</Text>
                                    <View style={this.state.errNama ? styles.textInputError : styles.textInputGroup}>
                                        <TextInput 
                                            placeholderTextColor="#000000" 
                                            autoCorrect={false} 
                                            ref={this.field1} 
                                            onSubmitEditing={() => { 
                                                const textInput = this.field2.current;
                                                textInput.focus()
                                            }}
                                            style={this.state.errEmpty ? styles.textInputError : styles.textInput} 
                                            placeholder="Nama" 
                                            value={this.state.namaValue} 
                                            keyboardType='default' 
                                            editable={this.state.editNama} 
                                            onChangeText={(namaValue) => 
                                                this.field1 ? this.setState({ namaValue, errNama: undefined }) : this.setState({errEmpty: 'true'})
                                            } />
                                    </View>
                                </View>
                                {renderIf(this.state.errNama)(
                                    <View>
                                        <Text style={styles.errorMessage}>{this.state.errNama && this.state.errNama}</Text>
                                    </View>
                                )}
                                <View style={styles.inputGroup} >
                                    <Text style={styles.labelText}>Email</Text>
                                    <View style={this.state.errEmail ? styles.textInputError : styles.textInputGroup}>
                                        <TextInput 
                                            placeholderTextColor="#000000" 
                                            autoCorrect={false} 
                                            ref={this.field2} 
                                            onSubmitEditing={() =>{ 
                                                const textInput = this.field3.current;
                                                textInput.focus()} } 
                                                style={styles.textInput} 
                                                placeholder="Email" 
                                                keyboardType='email-address' 
                                                value={this.state.emailValue} 
                                                onChangeText={(emailValue) => 
                                                    this.setState({ emailValue, errEmail: undefined })
                                                } />
                                    </View>
                                </View>
                                {renderIf(this.state.errEmail)(
                                    <View>
                                        <Text style={styles.errorMessage}>{this.state.errEmail && this.state.errEmail}</Text>
                                    </View>
                                )}
                                <View style={styles.inputGroup} >
                                    <Text style={styles.labelText}>No Ponsel</Text>
                                    <View style={this.state.errNoHp ? styles.textInputError : styles.textInputGroup}>
                                        <TextInput placeholderTextColor="#000000" ref={this.field3} onSubmitEditing={() =>{ const textInput = this.field4.current;
                                textInput.focus()} } style={styles.textInput} placeholder="No Ponsel" returnKeyType="done" keyboardType='number-pad' value={this.state.noHpValue} editable={this.state.editNoHp} onChangeText={(noHpValue) => this.setState({ noHpValue })} />
                                    </View>
                                </View>
                                <View style={styles.inputGroup} >
                                    <Text style={styles.labelText}>Tempat Lahir</Text>
                                    <View style={styles.textInputGroup}>
                                        <TextInput 
                                            placeholderTextColor="#000000" 
                                            ref={this.field5} 
                                            onSubmitEditing={() => { 
                                                const textInput = this.field6.current;
                                                } }  
                                            style={this.state.errTempatLahir ? styles.textInputErrorTempatLahir : styles.textInput} 
                                            editable={this.state.editTempatLahir} 
                                            placeholder="Tempat Lahir" 
                                            keyboardType='default' 
                                            value={this.state.tempatLahirValue}
                                            onChangeText={(tempatLahirValue) => this.setState({ tempatLahirValue, errTempatLahir: undefined })} />
                                    </View>
                                </View>
                                {renderIf(this.state.errTempatLahir)(
                                    <Text style={styles.errorMessage}>{this.state.errTempatLahir && this.state.errTempatLahir}</Text>
                                )}
                                <View style={!this.state.errJenisKelamin ? styles.inputGroup : styles.errorBorder}>
                                    <Text style={styles.labelText}>Jenis Kelamin</Text>
                                    <View style={{flexDirection:'row'}}>
                                    {option.map(item =>(
                                            <View key={item.value} style={styles.radioBtnContainer} >
                                                <TouchableOpacity onPress={() =>{
                                                    this.setState({jenis_kelaminValue: item.value, errJenisKelamin: undefined}) } } style={styles.radioBtnCircle} > 
                                                    {renderIf(this.state.jenis_kelaminValue == item.value)(
                                                        <View style={styles.radioBtnChecked} />
                                                    )}
                                                </TouchableOpacity>
                                                <Text style={styles.txtLittle}>{item.label}</Text>
                                            </View>
                                    )) }
                                    </View>
                                </View>
                                {renderIf(this.state.errJenisKelamin)(
                                    <Text style={styles.errorMessage}>{this.state.errJenisKelamin && this.state.errJenisKelamin}</Text>
                                )}
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>Tanggal Lahir</Text>
                                <View style={{flexDirection: "row"}}>
                                    {/* <Dropdown
                                        label='a'
                                        textColor='#FFF'
                                        itemColor='#000'
                                        baseColor='#FFF'
                                        value={this.state.tanggalValue}
                                        selectedItemColor='#000'
                                        onChangeText={(tanggalValue) =>this.setState({ tanggalValue, errTanggalValue: undefined }) } 
                                        data={this.state.dataTanggal}
                                    /> */}
                                    {/* <SearchableDropDown
                                        onTextChange={text => console.log(text)}
                                        onItemSelect={(item) => this.setState({
                                            tanggalId:item.id,
                                            tanggalValue:item.name,
                                            errTanggalValue: undefined
                                        })}
                                        textInputStyle={styles.textInputSearchDropdownDate}
                                        itemStyle={styles.itemSearchDropdownDate}
                                        itemTextStyle={{
                                            color: '#222'
                                        }}
                                        itemsContainerStyle={{
                                            maxHeight: 220
                                        }}
                                        items={this.state.dataTanggal}
                                        placeholder={this.state.tanggalValue ==''?'Tgl':this.state.tanggalValue}
                                        placeholderTextColor="#000"
                                        value={this.state.tanggalValue}
                                        resetValue={false}
                                        underlineColorAndroid='transparent' 
                                    /> */}
                                    {/* <SearchableDropDown
                                        onTextChange={text => console.log(text)}
                                        onItemSelect={(item) => this.setState({
                                            bulanId:item.id,
                                            bulanValue:item.name,
                                            errBulanValue: undefined
                                        })}
                                        textInputStyle={styles.textInputSearchDropdownMonth}
                                        itemStyle={styles.itemSearchDropdownMonth}
                                        itemTextStyle={{
                                            color: '#222'
                                        }}
                                        itemsContainerStyle={{
                                            maxHeight: 220
                                        }}
                                        items={this.state.dataBulan}
                                        placeholder={this.state.bulanValue ==''?'Bulan':this.state.bulanValue}
                                        placeholderTextColor="#000"
                                        value={this.state.bulanValue}
                                        resetValue={false}
                                        underlineColorAndroid='transparent' 
                                    />
                                    <SearchableDropDown
                                        onTextChange={text => console.log(text)}
                                        onItemSelect={(item) => this.setState({
                                            yearId:item.id,
                                            yearValue:item.name,
                                            errYearValue: undefined
                                        }),
                                        console.log("test clicked")}
                                        textInputStyle={styles.textInputSearchDropdownYear}
                                        itemStyle={styles.itemSearchDropdownYear}
                                        itemTextStyle={{
                                            color: '#222'
                                        }}
                                        itemsContainerStyle={{
                                            maxHeight: 220
                                        }}
                                        items={this.state.dataYears}
                                        placeholder={this.state.yearValue ==''?'Tahun':this.state.yearValue}
                                        placeholderTextColor="#000"
                                        value={this.state.yearValue}
                                        resetValue={false}
                                        underlineColorAndroid='transparent' 
                                    /> */}
                                </View>
                            </View>
                            <View style = {this.state.errStatusNikah && styles.errorBorder, {flexDirection: 'row'}}>
                                <View style={{width: "20%", marginRight: 10}}>
                                    <Dropdown
                                        label='Tanggal'
                                        textColor='#FFF'
                                        itemColor='#000'
                                        baseColor='#FFF'
                                        value={this.state.tanggalValue}
                                        selectedItemColor='#000'
                                        onChangeText={(tanggalValue) =>this.setState({ tanggalValue, errTanggalValue: undefined }) } 
                                        data={this.state.dataTanggal}
                                        itemCount={4.3}
                                    />
                                </View>
                                <View style={{width: "50%", marginRight: 10}}>
                                    <Dropdown
                                        label='Bulan'
                                        textColor='#FFF'
                                        itemColor='#000'
                                        baseColor='#FFF'
                                        value={this.state.bulanValue}
                                        selectedItemColor='#000'
                                        onChangeText={(bulanValue) => this.setState({ bulanValue, errBulanValue: undefined })} 
                                        data={this.state.dataBulan}
                                        itemCount={4.3}
                                    />
                                </View>
                                <View style={{width: "25%", marginRight: 10}}>
                                    <Dropdown
                                        label='Tahun'
                                        textColor='#FFF'
                                        itemColor='#000'
                                        baseColor='#FFF'
                                        value={this.state.yearValue}
                                        selectedItemColor='#000'
                                        onChangeText={(yearValue) => this.setState({yearValue, errTahunValue: undefined })} 
                                        data={this.state.dataYears}
                                        itemCount={4.3}
                                    />
                                </View> 
                            </View>
                            {renderIf(this.state.errTanggalValue)(
                                    <Text style={styles.errorMessage}>{this.state.errTanggalValue && this.state.errTanggalValue}</Text>
                                )}
                        <View style = {this.state.errStatusNikah && styles.errorBorder}>
                            <Dropdown
                                label='Status Pernikahan'
                                textColor='#FFF'
                                itemColor='#000'
                                baseColor='#FFF'
                                value={this.state.statusNikahValue}
                                selectedItemColor='#000'
                                onChangeText={(statusNikahValue) =>this.setState({ statusNikahValue, errStatusNikah: undefined }) } 
                                data={this.state.dataStatusNikah}
                                ref={this.field6}  
                                itemCount={4.3}
                            />
                        </View>
                        {renderIf(this.state.errStatusNikah)(
                            <View>
                                <Text style={styles.errorMessage}>{this.state.errStatusNikah && this.state.errStatusNikah}</Text>
                            </View>
                        )}
                        <View style = {this.state.errAgama && styles.errorBorder}>
                            <Dropdown
                                label='Agama'
                                textColor='#FFF'
                                itemColor='#000'
                                baseColor='#FFF'
                                selectedItemColor='#000'
                                value={this.state.agamaValue}
                                onChangeText={(agamaValue) => { this.setState({ agamaValue, errAgama: undefined }) } } 
                                data={this.state.dataAgama}  
                                itemCount={4.3}
                            />
                        </View>
                        {renderIf(this.state.errAgama)(
                            <View>
                                <Text style={styles.errorMessage}>{this.state.errAgama && this.state.errAgama}</Text>
                            </View>
                        )}
                        </View> 
                    </ScrollView>
                </View>
                <View style={styles.boxBtnBottom}>
                    <View style={{ flexDirection: "row",flex: 1,paddingRight:15,paddingLeft:15 }}>
                        {/* <TouchableOpacity style={styles.btnBottomPrev} onPress={this.onPreviuos}>
                            <Text style={styles.btnTextWhite}>SEBELUMNYA</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnBottomNext} onPress={this.onNext}>
                            <Text style={styles.btnTextWhite}>BERIKUTNYA</Text>
                        </TouchableOpacity> */}
                        <AwesomeButton
                            borderRadius={15}
                            backgroundColor='#28ccfb'
                            backgroundShadow="#000"
                            backgroundDarker="#23b6e0"
                            height={40}
                            width={GLOBAL.DEVICE_WIDTH*0.5-25}
                            style={{marginTop:10,alignSelf:'flex-end', marginRight:10}}
                            onPress={this.onPreviuos}
                        >
                        <Image source={require('./../img/btnPrev.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                        <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SEBELUMNYA</Text>
                        </AwesomeButton>

                        <AwesomeButton
                            borderRadius={15}
                            backgroundColor='#4F7942'
                            backgroundShadow="#000"
                            backgroundDarker="#45673a"
                            height={40}
                            width={GLOBAL.DEVICE_WIDTH*0.5-25}
                            style={{marginTop:10,alignSelf:'flex-end',marginLeft:10}}
                            onPress={this.onNext}
                        >
                        <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                        <Text style={[{position: 'absolute'},styles.btnTextWhite]}>BERIKUTNYA</Text>
                        </AwesomeButton>
                    </View>
                </View>
                {renderIf(this.state.modalVisibleUnAuth == true)(
              <UnAuth visibleModal={this.state.modalVisibleUnAuth}/>
          )}
            </LinearGradient >
        );
    }
}

export default RegistPage2;

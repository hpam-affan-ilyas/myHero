
import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, PlatList, StatusBar, View, KeyboardAvoidingView, TextInput, Alert, ActivityIndicator, Modal, RefreshControl, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButton from "react-native-really-awesome-button";
import { Dropdown } from 'react-native-material-dropdown';
import SearchableDropDown from 'react-native-searchable-dropdown';
import CheckBox from 'react-native-check-box';
import Icon from 'react-native-vector-icons/FontAwesome';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');
import UnAuth from './UnauthPage';
import renderIf from './Renderif';
import BlinkingIcon from './BlinkingIcon';

class RegistPage4 extends React.Component {
    constructor(props) {
        super(props);
        this.field1 = React.createRef();
        this.field2 = React.createRef();
        this.field3 = React.createRef();
        this.field4 = React.createRef();
        this.field5 = React.createRef();
        this.field6 = React.createRef();
        this.state = {
            isLoading: false,
            secureTextEntry1: true,
            secureTextEntry2: true,
            iconEye1: "eye-slash",
            iconEye2: "eye-slash",
            isCheckedKonservatif: false,
            isCheckedModerat: false,
            isCheckedAgresif: false,
            myToken: '',
            fotoKtpValue: '',
            imgNameKTP: '',
            fotoSelfiValue: '',
            imgNameSelfi: '',
            fotoTtdValue: '',
            imgNameTtd: '',
            noKtpValue: '',
            jkId: '',
            tglLahirValue: '',
            tempatLahirValue: '',
            statusNikahId: '',
            agamaId: '',
            alamatValue: '',
            kotaId: '',
            kodePosValue: '',
            alamatDomValue: '',
            kotaDomId: '',
            kodePosDomValue: '',
            alamatSuratValue: '',
            pendidikanId: '',
            pendidikanText: '',
            pekerjaanId: '',
            pekerjaanText: '',
            pendidikanText: '',
            penghasilanId: '',
            sumberdanaId: '',
            sumberdanaText: '',
            tujInvestId: '',
            tujInvestText: '',
            profileRisikoId: '',
            profileRisikoValue: '',
            bankId: '',
            bankValue: '',
            noRekValue: '',
            namaRekValue: '',
            pinValue: '',
            pinKonfirmValue: '',
            refreshing: false,
            dataBankOption: [],
            dataBank: [],
            viewBlink: true,
            kodeAgenValue: '',
            myToken: '',
            pinFocus: false,
            modalDropdown: false,
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

    onPreviuos = () => {
        this.props.navigation.navigate('Regist3');
    }
    onFinish = () => {
        let finishPage = true;
        if (this.state.bankValue.length == 0 || this.state.bankValue == "Pilih Bank" || this.state.bankId == "") {
            finishPage = false;
            this.setState({
                errBankValue: 'Pilihan Bank Tidak Tersedia'
            })            
        }
        if (this.state.noRekValue.length == 0) {
            finishPage = false;
            this.setState({
                errNoRekValue: 'No Rekening tidak boleh kosong'
            }) 
        } else {
            if (!this.state.noRekValue.match(GLOBAL.numbersFormat)) {
                finishPage = false;
                this.setState({
                    errNoRekValue: 'No Rekening tidak valid'
                }) 
            }
        }
        if (this.state.namaRekValue.length == 0) {
            finishPage = false;
            this.setState({
                errNamaRekValue: 'Nama Rekening tidak boleh kosong'
            }) 
        }
        if (this.state.isCheckedKonservatif == false && this.state.isCheckedModerat == false && this.state.isCheckedAgresif == false) {
            finishPage = false;
            this.setState({
                errProfileResiko: 'Profile risiko tidak boleh kosong'
            }) 
        }
        if (this.state.pinValue.length != 6) {
            finishPage = false;
            this.setState({
                errPinValue: 'Pin tidak boleh kurang atau lebih dari 6 digit'
            }) 
        } else {
            if (!this.state.pinValue.match(GLOBAL.numbersFormat)) {
                finishPage = false;
                this.setState({
                    errPinValue: 'Pin tidak valid'
                })
            } 
        }
        if (!this.state.pinKonfirmValue) {
            finishPage = false;
            this.setState({
                errPinKonfirmValue: 'Konfirmasi Pin Tidak Boleh Kosong'
            })
        }
        if (this.state.pinValue != this.state.pinKonfirmValue) {
            finishPage = false;
            this.setState({
                errKonfirmasiPin: 'Konfirmasi pin tidak valid'
            })
        } 
        // else {
            if(finishPage) {
                this.setState({ isLoading: true }); 
                let uploadData = new FormData();
                uploadData.append('profilRisiko', this.state.profileRisikoId);
                uploadData.append('bankId', this.state.bankId);
                uploadData.append('noRek', this.state.noRekValue);
                uploadData.append('namaRekeningBank', this.state.namaRekValue);
                uploadData.append('pin', this.state.pinValue);
                uploadData.append('statusNasabah', 'Pending');
                uploadData.append('kodeAgen', this.state.kodeAgenValue);
                fetch(GLOBAL.pendaftaran(), {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                        'Authorization': this.state.myToken,
                    },
                    body: uploadData
                }).then((response) => {
                        if (response.status == '201') {
                            this.setState({ isLoading: false });
                            let res;
                            return response.json().then(obj => {
                                res = obj;
                                Alert.alert('Pendaftaran Sudah Selesai', res.message,
                                    [{ text: 'OK', onPress: () => this.props.navigation.navigate('HomeScreen') }],
                                );
                            })
                        } else {
                            this.setState({ isLoading: false });
                            GLOBAL.gagalKoneksi()
                        }
                    })
            }
        // }
    }
    onTongelEyesPress(StringHolder) {
        switch (StringHolder) {
            case '1':
                this.setState({
                    secureTextEntry1: !this.state.secureTextEntry1,
                });
                if (!this.state.secureTextEntry1) {
                    this.setState({
                        iconEye1: "eye-slash",
                    })
                } else {
                    this.setState({
                        iconEye1: "eye",
                    })
                }
                break;
            case '2':
                this.setState({
                    secureTextEntry2: !this.state.secureTextEntry2,
                });
                if (!this.state.secureTextEntry2) {
                    this.setState({
                        iconEye2: "eye-slash",
                    })
                } else {
                    this.setState({
                        iconEye2: "eye",
                    })
                }
                break;
        }

    }

    _getNamaBank(token) {
        this.setState({ isLoading: true })
        fetch(GLOBAL.getBank(), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token
            }
        })
            .then((response) => {
                this.setState({ isLoading: false })
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        var count = Object.keys(res.data.bank).length;
                        let data_bank = [];
                        for (var i = 0; i < count; i++) {
                            data_bank.push({
                                id: res.data.bank[i].id,
                                name: res.data.bank[i].nama_bank
                            })
                        }
                        this.setState({ dataBank: data_bank })
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
        var imgKtpStore = await AsyncStorage.getItem('imgEktp');
        var imgSelfiStore = await AsyncStorage.getItem('imgSelfi');
        var imgTtdStore = await AsyncStorage.getItem('imgTtd');
        var jkStore = await AsyncStorage.getItem('jkValue');
        var tglLahirStore = await AsyncStorage.getItem('tglLahirValue');
        var tempatLahirStore = await AsyncStorage.getItem('tempatLahirValue');
        var statusNikahIdStore = await AsyncStorage.getItem('statusNikahId');
        var agamaIdStore = await AsyncStorage.getItem('agamaId');
        var kotaIdStore = await AsyncStorage.getItem('kotaIdValue');
        var alamatStore = await AsyncStorage.getItem('alamatValue');
        var kodePosStore = await AsyncStorage.getItem('kodePosValue');
        var alamatDomStore = await AsyncStorage.getItem('alamatDomValue');
        var kotaDomIdStore = await AsyncStorage.getItem('kotaDomIdValue');
        var kodePosDomStore = await AsyncStorage.getItem('kodePosDomValue');
        var alamatSuratStore = await AsyncStorage.getItem('alamatSuratValue');
        var kotaSuratIdStore = await AsyncStorage.getItem('kotaSurMerIdValue');
        var kodePosSuratStore = await AsyncStorage.getItem('kodePosSuratValue')
        var pendidikanIdStore = await AsyncStorage.getItem('pendidikanId');
        var pendidikanTextStore = await AsyncStorage.getItem('pendidikanText');
        var pekerjaanIdStore = await AsyncStorage.getItem('pekerjaanId');
        var pekerjaanTextStore = await AsyncStorage.getItem('pekerjaanText');
        var penghasilanIdStore = await AsyncStorage.getItem('penghasilanId');
        var sumberdanaIdStore = await AsyncStorage.getItem('sumberdanaId');
        var sumberdanaTextStore = await AsyncStorage.getItem('sumberdanaText');
        var tujInvestIdStore = await AsyncStorage.getItem('tujInvestId');
        var tujInvestTextStore = await AsyncStorage.getItem('tujInvestText');
        var profRiskStore = await AsyncStorage.getItem('profRiskValue');
        var profRiskIdStore = await AsyncStorage.getItem('profRiskId');
        var bankStore = await AsyncStorage.getItem('bankValue');
        var bankIdStore = await AsyncStorage.getItem('bankId');
        var noRekStore = await AsyncStorage.getItem('noRekValue');
        var namaRekStore = await AsyncStorage.getItem('namaRekValue');
        var kodeAgenStore = await AsyncStorage.getItem('kodeAgenValue');
        console.log('Kota Surat ID Store', kotaSuratIdStore);
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken })
            if (kotaSuratIdStore != null) {
                this.setState({ kotaSuratIdValue: kotaSuratIdStore })
            }
            if (kodePosSuratStore != null) {
                this.setState({ kodePosSuratValue: kodePosSuratStore })
            }
            if (eKtpStore != null) {
                this.setState({ noKtpValue: eKtpStore })
            }
            if (imgKtpStore != null) {
                this.setState({ fotoKtpValue: imgKtpStore })
            }
            if (imgSelfiStore != null) {
                this.setState({ fotoSelfiValue: imgSelfiStore })
            }
            if (imgTtdStore != null) {
                this.setState({ fotoTtdValue: imgTtdStore })
            }
            if (jkStore != null) {
                this.setState({ jkId: jkStore })
            }
            if (tglLahirStore != null) {
                this.setState({ tglLahirValue: tglLahirStore })
            }
            if (tempatLahirStore != null) {
                this.setState({ tempatLahirValue: tempatLahirStore })
            }
            if (statusNikahIdStore != null) {
                this.setState({ statusNikahId: statusNikahIdStore })
            }
            if (agamaIdStore != null) {
                this.setState({ agamaId: agamaIdStore })
            }
            if (kotaIdStore != null) {
                this.setState({ kotaId: kotaIdStore })
            }
            if (alamatStore != null) {
                this.setState({ alamatValue: alamatStore })
            }
            if (kodePosStore != null) {
                this.setState({ kodePosValue: kodePosStore })
            }
            if (alamatDomStore != null) {
                this.setState({ alamatDomValue: alamatDomStore })
            }
            if (kotaDomIdStore != null) {
                this.setState({ kotaDomId: kotaDomIdStore })
            }
            if (kodePosDomStore != null) {
                this.setState({ kodePosDomValue: kodePosDomStore })
            }
            if (alamatSuratStore != null) {
                this.setState({ alamatSuratValue: alamatSuratStore })
            }
            if (pendidikanIdStore != null) {
                this.setState({ pendidikanId: pendidikanIdStore })
            }
            if (pendidikanTextStore != null) {
                this.setState({ pendidikanText: pendidikanTextStore })
            }
            if (pekerjaanIdStore != null) {
                this.setState({ pekerjaanId: pekerjaanIdStore })
            }
            if (pekerjaanTextStore != null) {
                this.setState({ pekerjaanText: pekerjaanTextStore })
            }
            if (penghasilanIdStore != null) {
                this.setState({ penghasilanId: penghasilanIdStore })
            }
            if (sumberdanaIdStore != null) {
                this.setState({ sumberdanaId: sumberdanaIdStore })
            }
            if (sumberdanaTextStore != null) {
                this.setState({ sumberdanaText: sumberdanaTextStore })
            }
            if (tujInvestIdStore != null) {
                this.setState({ tujInvestId: tujInvestIdStore })
            }
            if (tujInvestTextStore != null) {
                this.setState({ tujInvestText: tujInvestTextStore })
            }
            if (profRiskIdStore != null) {
                this.setState({ profileRisikoId: profRiskIdStore })
            }
            if (profRiskStore != null) {
                this.setState({ profileRisikoValue: profRiskStore })
                this.manageCheckbox(profRiskStore);
            }
            if (bankIdStore != null) {
                this.setState({ bankId: bankIdStore })
            }
            if (bankStore != null) {
                this.setState({ bankValue: bankStore })
            }
            if (noRekStore != null) {
                this.setState({ noRekValue: noRekStore })
            }
            if (namaRekStore != null) {
                this.setState({ namaRekValue: namaRekStore })
            }
            if (kodeAgenStore != null) {
                this.setState({ kodeAgenValue: kodeAgenStore })
            }

            this._getNamaBank(aksesToken)
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
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack();
            return true;
        });
        console.log("State pin", this.state.pinValue);
        console.log("State Kode Agen", this.state.kodeAgenValue);
        return this.checkCustomer();
        // return this._getToken();
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }

    checkCustomer = async () => {
        let aksesToken = await AsyncStorage.getItem('aksesToken');
        this.setState({
            myToken: aksesToken
        })
        if(aksesToken) {
            fetch(GLOBAL.checkCustomer(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': aksesToken,
                }
            })
            .then((response) => {
                if (response.status == '201') {
                    let res;
                    return response.json().then( obj => {
                        res = obj;
                        if(!res.nasabah) {
                            console.log('Create a New One');
                        } else {
                           let idBank = res.nasabah.bank_id;
                           this.getNamaBank(idBank);
                           let noRek = res.nasabah.no_rek;
                           let namaRekening = res.nasabah.nama_rekening_bank;
                           let profilRisiko = res.nasabah.profil_risiko;
                           let profilRisikoValue = 'Konservatif';
                           if(profilRisiko == 2) {
                            profilRisikoValue = 'Moderat'
                           }
                           if(profilRisiko == 3) {
                               profilRisikoValue = 'Agresif'
                           }
                           this.manageCheckbox(profilRisikoValue);
                           let pin = res.nasabah.pin;
                           let kodeAgen = res.nasabah.kode_agen;
                           this.setState({
                               noRekValue: noRek,
                               namaRekValue: namaRekening,
                               pinValue: pin,
                               kodeAgenValue: kodeAgen
                           })
                           console.log("State Pin 2", this.state.pinValue);
                           console.log("State Kode Agen 2", this.state.kodeAgenValue);
                        }
                    });
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
        }
    }

    getNamaBank = async (idBank) => {
        let aksesToken = await AsyncStorage.getItem('aksesToken');
        this.setState({
            myToken: aksesToken
        })
        let dataPost = new FormData();
        dataPost.append("idBank", idBank)
        fetch(GLOBAL.getNamaBank(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': this.state.myToken,
            },
            body: dataPost
        }).then((response) => {
            if (response.status == '201') {
                let res;
                return response.json().then( obj => {
                    res = obj;
                    this.setState({
                        bankValue: res.bank.nama_bank,
                        bankId: res.bank.id
                    })
                });
            } else {
                return response.json().then( obj => {
                    res = obj;
                    console.log("Res Failed", res); 
                });
                GLOBAL.gagalKoneksi()
            }
        })
    }

    manageCheckbox(isChecked) {
        this.setState({
            errProfileResiko: undefined
        })
        if (isChecked == 'Konservatif') {
            this.setState({
                isCheckedKonservatif: !this.state.isCheckedKonservatif,
                isCheckedModerat: false,
                isCheckedAgresif: false,
                profileRisikoId: 1,
                profileRisikoValue: 'Konservatif'
            })
        } else if (isChecked == 'Moderat') {
            this.setState({
                isCheckedKonservatif: false,
                isCheckedModerat: !this.state.isCheckedModerat,
                isCheckedAgresif: false,
                profileRisikoId: 2,
                profileRisikoValue: 'Moderat'
            })
        } else if (isChecked == 'Agresif') {
            this.setState({
                isCheckedKonservatif: false,
                isCheckedModerat: false,
                isCheckedAgresif: !this.state.isCheckedAgresif,
                profileRisikoId: 3,
                profileRisikoValue: 'Agresif'
            })
        }
        // const textInput = this.field5.current;
        // textInput.focus()
    }

    render() {
        return (
            <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
                <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
                <View style={{ height: GLOBAL.DEVICE_HEIGHT - 100 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps = 'always'
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        } >

                        <View style={[styles.containerMain, { marginBottom: 25 }]}>
                            {
                                this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={styles.activeCirclePage}><Text style={styles.btnTxtDefault}>1</Text></View>
                                <View style={styles.lineCirclePageActive} />
                                <View style={styles.activeCirclePage}><Text style={styles.btnTxtDefault}>2</Text></View>
                                <View style={styles.lineCirclePageActive} />
                                <View style={styles.activeCirclePage} ><Text style={styles.btnTxtDefault}>3</Text></View>
                                <View style={styles.lineCirclePageActive} />
                                <View style={styles.activeCirclePage} ><Text style={styles.btnTxtDefault}>4</Text></View>
                            </View>

                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>Bank</Text>
                                <SearchableDropDown
                                    onTextChange={text => console.log(text)}
                                    onItemSelect={(item) => this.setState({
                                        bankId:item.id,
                                        bankValue:item.name,
                                        errBankValue: undefined
                                    })}
                                    textInputStyle={this.state.errBankValue ? styles.dropdownError : styles.textInputSearchDropdown}
                                    itemStyle={styles.itemSearchDropdown}
                                    itemTextStyle={{
                                        color: '#222'
                                    }}
                                    itemsContainerStyle={{
                                        maxHeight: 220
                                    }}
                                    items={this.state.dataBank}
                                    placeholder={this.state.bankValue ==''?'Pilih Bank':this.state.bankValue}
                                    placeholderTextColor="#000"
                                    value={this.state.bankValue}
                                    resetValue={false}
                                    underlineColorAndroid='transparent' 
                                />
                                <View>
                                    <Text style={styles.errorMessage}>{this.state.errBankValue && this.state.errBankValue}</Text>
                                </View>
                            </View>

                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>No Rekening Bank</Text>
                                <View style={this.state.errNoRekValue ? styles.textInputError : styles.textInputGroup}>
                                    <TextInput placeholderTextColor="#000000" ref={this.field2} onSubmitEditing={() => {
                                        const textInput = this.field3.current;
                                        textInput.focus()
                                    }} style={styles.textInput} placeholder="No Rekening Bank" returnKeyType="done" keyboardType="numeric" value={this.state.noRekValue} onChangeText={(noRekValue) => this.setState({ noRekValue, errNoRekValue: undefined})} />
                                </View>
                                <View>
                                    <Text style={styles.errorMessage}>{this.state.errNoRekValue && this.state.errNoRekValue}</Text>
                                </View>
                            </View>

                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>Nama Pada Rekening Bank</Text>
                                <View style={this.state.errNamaRekValue ? styles.textInputError : styles.textInputGroup}>
                                    <TextInput placeholderTextColor="#000000" ref={this.field3} style={styles.textInput} autoCorrect={false} placeholder="Nama Pada Rekening Bank" keyboardType='default' value={this.state.namaRekValue} onChangeText={(namaRekValue) => this.setState({ namaRekValue, errNamaRekValue: undefined })} />
                                </View>
                                <View>
                                    <Text style={styles.errorMessage}>{this.state.errNamaRekValue && this.state.errNamaRekValue}</Text>
                                </View>
                            </View>
                            <View style={this.state.errProfileResiko ? styles.errorBorder : [styles.inputGroup, { paddingRight: 10 }]} >
                                <Text style={styles.labelText}>Pilih Profil Risiko</Text>
                                <CheckBox
                                    style={styles.labelCheckbox}
                                    onClick={() => { this.manageCheckbox('Konservatif') }}
                                    isChecked={this.state.isCheckedKonservatif}
                                    checkBoxColor='#FFF'
                                    rightText={"Konservatif"}
                                    rightTextStyle={styles.labelCheckbox}
                                />
                                <View style={{ paddingLeft: 25 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckbox}>Investor dengan profil risiko konservatif cenderung menghindari risiko dan lebih memilih instrumen investasi yang aman seperti tabungan, deposito, dan reksa dana pasar uang.</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckbox}>Investor ini merasa nyaman dengan instrumen investasi yang imbal hasilnya tidak terlalu besar namun bergerak stabil.</Text>
                                    </View>
                                </View>
                                <CheckBox
                                    style={styles.labelCheckbox}
                                    onClick={() => { this.manageCheckbox('Moderat') }}
                                    isChecked={this.state.isCheckedModerat}
                                    checkBoxColor='#FFF'
                                    rightText={"Moderat"}
                                    rightTextStyle={styles.labelCheckbox}
                                />
                                <View style={{ paddingLeft: 25 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckbox}>Investor dengan profil risiko moderat memiliki karakteristik yang siap menerima fluktuasi jangka pendek dengan potensi keuntungan yang diharapkan dapat lebih tinggi dari tingkat inflasi dan deposito.</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckbox}>Investor ini lebih berani mengambil risiko, namun tetap berhati-hati dalam memilih jenis instrumen investasi, dan biasanya membatasi jumlah investasi pada instrumen berisiko.</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckbox}>Jenis reksa dana yang cocok untuk investor moderat adalah reksa dana campuran yang risikonya relatif lebih rendah dibandingkan dengan instrumen saham atau reksa dana saham.</Text>
                                    </View>
                                </View>
                                <CheckBox
                                    style={styles.labelCheckbox}
                                    onClick={() => { this.manageCheckbox('Agresif') }}
                                    isChecked={this.state.isCheckedAgresif}
                                    checkBoxColor='#FFF'
                                    rightText={"Agresif"}
                                    rightTextStyle={styles.labelCheckbox}
                                />
                                <View style={{ paddingLeft: 25 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckbox}>Investor dengan profil risiko agresif sangat siap untuk menanggung risiko.</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckbox}>Investor ini cenderung berani mengambil risiko yang lebih tinggi untuk mendapatkan imbal hasil yang tinggi.</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.txtLabelCheckbox}>{'\u2022'} </Text>
                                        <Text style={styles.txtLabelCheckbox}>Jenis reksa dana yang cocok untuk investor agresif adalah reksa dana saham yang risikonya relatif lebih tinggi dibandingkan namun dengan potensi keuntungan yang lebih tinggi juga.</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>PIN</Text>
                                <View style={this.state.errPinValue ? styles.textInputError : styles.textInputGroup}>
                                    <TextInput {...this.props}
                                        ref={this.field5}
                                        placeholderTextColor="#000000"
                                        onFocus={() => this.setState({ pinFocus: true })}
                                        onBlur={() => this.setState({ pinFocus: false })}
                                        onSubmitEditing={() => {
                                            const textInput = this.field6.current;
                                            textInput.focus()
                                        }}
                                        returnKeyType = "done"
                                        style={styles.textInput} keyboardType='number-pad'
                                        secureTextEntry={this.state.secureTextEntry1} placeholder="Pin" maxLength={6}
                                        onChangeText={(pinValue) => this.setState({ pinValue, errPinValue: undefined })} />
                                    <TouchableOpacity onPress={this.onTongelEyesPress.bind(this, '1')} style={styles.iconGroup}>
                                        <Icon name={this.state.iconEye1} size={20} style={styles.colorIconInput} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Text style={styles.errorMessage}>{this.state.errPinValue && this.state.errPinValue}</Text>
                                </View>
                            </View>
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>Konfirmasi PIN</Text>
                                <View style={this.state.errPinKonfirmValue || this.state.errKonfirmasiPin ? styles.textInputError : styles.textInputGroup}>
                                    <TextInput {...this.props}
                                        ref={this.field6}
                                        returnKeyType = "done"
                                        placeholderTextColor="#000000"
                                        onFocus={() => this.setState({ pinFocus: true })}
                                        onBlur={() => this.setState({ pinFocus: false })}
                                        style={styles.textInput} keyboardType='number-pad'
                                        secureTextEntry={this.state.secureTextEntry2} placeholder="Konfirmasi Pin" maxLength={6}
                                        onChangeText={(pinKonfirmValue) => this.setState({ pinKonfirmValue, errPinKonfirmValue: undefined })} />
                                    <TouchableOpacity onPress={this.onTongelEyesPress.bind(this, '2')} style={styles.iconGroup}>
                                        <Icon name={this.state.iconEye2} size={20} style={styles.colorIconInput} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Text style={this.state.errPinKonfirmValue && styles.errorMessage}>{this.state.errPinKonfirmValue && this.state.errPinKonfirmValue}</Text>
                                </View>
                                <View>
                                    <Text style={this.state.errKonfirmasiPin && styles.errorMessage}>{this.state.errKonfirmasiPin && this.state.errKonfirmasiPin}</Text>
                                </View>
                            </View>
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>Kode Agen</Text>
                                <View style={styles.textInputGroup}>
                                    <TextInput
                                        placeholderTextColor="#000000"
                                        onFocus={() => this.setState({ pinFocus: true })}
                                        onBlur={() => this.setState({ pinFocus: false })}
                                        style={styles.textInput} keyboardType="default" placeholder="Kode Agen (Opsional)" maxLength={10}
                                        onChangeText={(kodeAgenValue) => this.setState({ kodeAgenValue:kodeAgenValue})} />
                                </View>
                            </View>
                            {renderIf(this.state.pinFocus == true)(
                                <View style={{ width: '100%', height: 200 }} />
                            )}
                        </View>
                    </ScrollView>
                    {renderIf(this.state.viewBlink)(
                        <BlinkingIcon name="ios-arrow-down" />
                    )}
                </View>
                <View style={styles.boxBtnBottom}>
                    <View style={{ flexDirection: "row", flex: 1, paddingRight: 15, paddingLeft: 15 }}>
                        <AwesomeButton
                            borderRadius={15}
                            backgroundColor='#28ccfb'
                            backgroundShadow="#000"
                            backgroundDarker="#23b6e0"
                            height={40}
                            width={GLOBAL.DEVICE_WIDTH * 0.5 - 25}
                            style={{ marginTop: 10, alignSelf: 'flex-end', marginRight: 10 }}
                            onPress={this.onPreviuos}
                        >
                            <Image source={require('./../img/btnPrev.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5 - 25, height: 40, resizeMode: 'stretch' }} />
                            <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>SEBELUMNYA</Text>
                        </AwesomeButton>

                        <AwesomeButton
                            borderRadius={15}
                            backgroundColor='#4F7942'
                            backgroundShadow="#000"
                            backgroundDarker="#45673a"
                            height={40}
                            width={GLOBAL.DEVICE_WIDTH * 0.5 - 25}
                            style={{ marginTop: 10, alignSelf: 'flex-end', marginLeft: 10 }}
                            onPress={this.onFinish}
                        >
                            <Image source={require('./../img/btnLogin.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5 - 25, height: 40, resizeMode: 'stretch' }} />
                            <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>SELESAI</Text>
                        </AwesomeButton>
                    </View>
                </View>
                {renderIf(this.state.modalVisibleUnAuth == true)(
                    <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
                )}
            </LinearGradient >
        );
    }
}

export default RegistPage4;

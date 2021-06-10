
import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, Platform, StatusBar, View, SafeAreaView, TextInput, Alert, ActivityIndicator, Modal, RefreshControl, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import BlinkingIcon from './BlinkingIcon';
import AwesomeButton from "react-native-really-awesome-button";
import AsyncStorage from '@react-native-community/async-storage';
import { Dropdown } from 'react-native-material-dropdown';
import SearchableDropDown from 'react-native-searchable-dropdown';
import SearchableDropDown2 from 'react-native-searchable-dropdown';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');
import UnAuth from './UnauthPage';
import renderIf from './Renderif';

import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
    MenuProvider
} from 'react-native-popup-menu';
import { TouchableHighlightBase } from 'react-native';
let option1 = [{ label: 'Sesuai Alamat KTP', value: '1' }, { label: 'Tambah Alamat Lain', value: '2' }];
let option2 = [{ label: 'Sesuai Alamat KTP', value: '1' }, { label: 'Tambah Alamat Lain', value: '3' }];
const { Popover } = renderers;

class RegistPage3 extends React.Component {

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
            screenHeight: 0,
            openFormAlamatSurat: false,
            openFormAlamatDomisili: false,
            myToken: '',
            kotaValue: '',
            alamatValue: '',
            kotaIdValue: '',
            provinsiValue: '',
            negaraValue: '',
            kodePosValue: '',
            alamatDomValue: '',
            kotaDomValue: '',
            kotaDomIdValue: '',
            provinsiDomValue: '',
            negaraDomValue: '',
            kodePosDomValue: '',
            alamatSuratValue: '',
            indexAlamatSurat: '0',
            indexAlamatDom: '0',
            pendidikanValue: '',
            pendidikanId: '',
            pendidikanInput: false,
            pendidikanText: '',
            pekerjaanValue: '',
            pekerjaanText: '',
            pekerjaanInput: false,
            pekerjaanId: '',
            penghasilanValue: '',
            penghasilanId: '',
            sumberdanaValue: '',
            sumberdanaId: '',
            sumberdanaInput: false,
            sumberdanaText: '',
            tujInvestValue: '',
            tujInvestId: '',
            tujInvestInput: false,
            tujInvestText: '',
            dataKota: [],
            dataPekerjaan: [],
            dataPendidikan: [],
            dataPenghasilan: [],
            dataTujInvest: [],
            dataSumberdana: [],
            refreshing: false,
            dataKotaOption: [],
            modalVisibleUnAuth: false,
            viewBlink: true,
            addHeight: false,
            kotaSurMerValue: '',
            alamatSurMerValue: '',
            provinsiSurMerValue: '',
            negaraSurMerValue: '',
            kotaSurMerIdValue: '',
            kodePosSurMerValue: '',
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
        this.props.navigation.navigate('Regist2');
    }
    onNext = () => {
        this.setState({
            errAlamatSesuaiKtp: undefined,
            errFormAlamatDomisili: undefined
        })
        let continueNextPage = true;
        if(!this.state.alamatValue || !this.state.kodePosValue) {
            if(!this.state.kotaValue) {
                if(!this.state.kotaText) {
                    this.setState({
                        errAlamatSesuaiKtp: 'Form Alamat Sesuai KTP Harus di Lengkapi'
                    })
                }
            }
        } else {
            this.setState({
                errAlamatSesuaiKtp: undefined
            })
        }
        if(this.state.openFormAlamatDomisili) {
            if(!this.state.alamatDomValue || !this.state.kodePosDomValue) {
                if(!this.state.kotaDomValue) {
                    if(!this.state.kotaDomText) {
                        this.setState({
                            errFormAlamCatDomisili: 'Form Alamat Sesuai Domisili Harus di Lengkapi'
                        })
                    }
                }
            } else {
                this.setState({
                    errFormAlamatDomisili: undefined
                }) 
            }
        }
        if(this.state.openFormAlamatSurat) {
            if(!this.state.alamatSurMerValue) {
                this.setState({
                    errFormAlamatSuratMenyurat: 'Form Alamat Surat Menyurat Harus di Lengkapi'
                })
            } else {
                this.setState({
                    errFormAlamatSuratMenyurat: undefined
                })
            }
        }
        if (this.state.alamatValue.length == 0) {
            this.setState({
                errAlamatValue : 'Alamat Tidak Boleh Kosong'
            })
            continueNextPage = false;
        }
        if (this.state.kotaValue.length == 0 || this.state.kotaValue == "Pilih Kota") {
            if(!this.state.kotaText) {
                this.setState({
                    errKotaValue : 'Kota Tidak Boleh Kosong'
                })
                continueNextPage = false;
            }
        }
        if (this.state.kodePosValue.length == 0) {
            this.setState({
                errKodePosValue : 'Kode Pos Tidak Boleh Kosong'
            })
            continueNextPage = false;
        } else {
            if (!this.state.kodePosValue.match(GLOBAL.numbersFormat)) {
                this.setState({
                    errKodePosValue : 'Kode Pos tidak valid'
                })
                continueNextPage = false;
            }
        }
        if (this.state.indexAlamatDom == '0') {
            this.setState({
                errIndexAlamatDom : 'Alamat Domisili Harus di Pilih'
            })
            continueNextPage = false;
        }
        if (this.state.indexAlamatDom == '2' && this.state.alamatDomValue.length == 0) {
            this.setState({
                errAlamatDomValue : 'Alamat Tidak Boleh Kosong'
            })
            continueNextPage = false;
        }
        if(this.state.openFormAlamatDomisili) {
            if(this.state.kotaDomValue) {
                if (this.state.kotaDomValue.length == 0 || this.state.kotaDomValue == "Pilih Kota") {
                    this.setState({
                        errKotaDomValue : 'Kota Tidak Boleh Kosong'
                    })
                    continueNextPage = false;
                }
            } else {
                this.setState({
                    errKotaDomValue : 'Kota Tidak Boleh Kosong'
                })
                continueNextPage = false;
            }
            if(!this.state.kodePosDomValue) {
                this.setState({
                    errKodePosDomValue : 'Kode Pos Tidak Boleh Kosong'
                })
                continueNextPage = false;
            } else {
                if (!this.state.kodePosDomValue.match(GLOBAL.numbersFormat)) {
                    this.setState({
                        errKodePosDomValue : 'Kode Pos Tidak Valid'
                    })
                    continueNextPage = false;
                }
            }
        }
        if (this.state.indexAlamatSurat == '0') {
            this.setState({
                errIndexAlamatSurat : 'Alamat Harus di Pilih'
            })
            continueNextPage = false;
        }
        if (this.state.indexAlamatSurat == '3') {
            if(this.state.alamatSurMerValue.length == 0) {
                this.setState({
                    errAlamatSurMerValue : ''
                })
                continueNextPage = false;
            }
        }
        if (this.state.pendidikanValue.length == 0) {
            this.setState({
                errPendidikanValue : 'Pendidikan Tidak Boleh Kosong'
            })
            continueNextPage = false;
        }
        if (this.state.pendidikanValue == "Lainnya" && this.state.pendidikanText.length == 0) {
            this.setState({
                errPendidikanValue : 'Pendidikan Tidak Boleh Kosong'
            })
            continueNextPage = false;
        }
        if (this.state.pekerjaanValue.length == 0) {
            this.setState({
                errPekerjaanValue : 'Pekerjaan Tidak Boleh Kosong'
            })
            continueNextPage = false;
        }
        if (this.state.pekerjaanValue == "Lainnya" && this.state.pekerjaanText.length == 0) {
            this.setState({
                errPekerjaanValue : 'Pekerjaan Tidak Boleh Kosong'
            })
            continueNextPage = false;
        }
        if (this.state.penghasilanValue.length == 0) {
            this.setState({
                errPenghasilanValue : 'Penghasilan Tidak Boleh Kosong'
            })
            continueNextPage = false;
        }
        if (this.state.sumberdanaValue.length == 0) {
            this.setState({
                errSumberDanaValue : 'Sumberdana Tidak Boleh Kosong'
            })
            continueNextPage = false;
        }
        if (this.state.sumberdanaValue == "Lainnya" && this.state.sumberdanaText.length == 0) {
            this.setState({
                errSumberDanaValue : 'Sumberdana Tidak Boleh Kosong'
            })
            continueNextPage = false;
        }
        if (this.state.tujInvestValue.length == 0) {
            this.setState({
                errTujuanIvestValue : 'Tujuan investasi Tidak Boleh Kosong'
            })
            continueNextPage = false;
        }
        if (this.state.tujInvestValue == "Lainnya" && this.state.tujInvestText.length == 0) {
            this.setState({
                errTujuanIvestValue : 'Tujuan investasi Tidak Boleh Kosong'
            })
            continueNextPage = false;
        }
        console.log("Continue Next Page", continueNextPage);
        if(continueNextPage) {
            this.props.navigation.navigate('Regist4');
            if(this.state.kotaIdValue) {
                this.setState({
                    kotaText: ''
                })
            }
            if(this.state.indexAlamatDom == 1) {
                this.setState({
                    alamatDomValue : this.state.alamatValue,
                    kotaDomValue: this.state.kotaIdValue,
                    kodePosDomValue: this.state.kodePosValue
                })
            }
            if(this.state.indexAlamatSurat == 1) {
                this.setState({
                    alamatSurMerValue : this.state.alamatValue
                })
            } else if (this.state.indexAlamatSurat == 2) {
                this.setState({
                    alamatSurMerValue : this.state.alamatDomValue
                })
            }
            let uploadData = new FormData();
            uploadData.append('alamatKtp', this.state.alamatValue);
            uploadData.append('kotaKtp', this.state.kotaIdValue);
            uploadData.append('kotaKtpText', this.state.kotaText);
            uploadData.append('kodePosKtp', this.state.kodePosValue);
            uploadData.append('alamatDom', this.state.alamatDomValue);
            uploadData.append('kotaDom', this.state.kotaDomValue);
            uploadData.append('kotaDomText', this.state.kotaDomText);
            uploadData.append('kodePosDom', this.state.kodePosDomValue);
            uploadData.append('alamatSurMer', this.state.alamatSurMerValue);
            uploadData.append('pendidikan', this.state.pendidikanId);
            uploadData.append('pekerjaan', this.state.pekerjaanId);
            uploadData.append('sumberDana', this.state.sumberdanaId);
            uploadData.append('penghasilanPerTahun', this.state.penghasilanId);
            uploadData.append('page', '3');
            return;
            fetch(GLOBAL.register(), {
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
                        // Alert.alert('Sukses', 'Registrasi berhasil, data sudah dilengkapi',
                        //     [{ text: 'OK', onPress: () => this.props.navigation.navigate('Home') }],
                        //     { cancelable: false },
                        // );
                    })
                } else if (response.status == '401') {
                    this.setState({ isLoading: false });
                    this.Unauthorized()
                } else if (response.status == '400') {
                    this.setState({ isLoading: false });
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        Alert.alert('Gagal', res.message,
                            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                            { cancelable: false },
                        );
                    })
                } else {
                    // this.setState({ isLoading: false });
                    // GLOBAL.gagalKoneksi()
                }
            })
            this.props.navigation.navigate('Regist4');
        }
    }
    onKotaSelected = async (isSelect, isKotaType) => {
        var kotaMap = this.state.dataKota;
        var kota = kotaMap.map((kotaMap, key) => kotaMap);
        for (var i = 0; i < kota.length; i++) {
            if (kota[i].value == isSelect) {
                if (isKotaType == '1') {
                    this.setState({
                        kotaIdValue: kota[i].id,
                        provinsiValue: kota[i].provinsi,
                        negaraValue: kota[i].negara,
                        kotaValue: kota[i].value,
                    })
                } else {
                    this.setState({
                        kotaDomIdValue: kota[i].id,
                        provinsiDomValue: kota[i].provinsi,
                        negaraDomValue: kota[i].negara,
                        kotaDomValue: kota[i].value,
                    })
                }
            }
        }
    }
    onPendSelected(isSelect) {
        this.setState({
            errPendidikanValue: undefined
        })
        var pendMap = this.state.dataPendidikan;
        var pend = pendMap.map((pendMap, key) => pendMap);
        for (var i = 0; i < pend.length; i++) {
            if (pend[i].value == isSelect) {
                this.setState({
                    pendidikanId: pend[i].id,
                    pendidikanValue: pend[i].value,
                });
                if (pend[i].value == "Lainnya") {
                    this.setState({ pendidikanInput: true })
                } else {
                    this.setState({ pendidikanInput: false, pendidikanText: '' })
                }
            }
        }
    }
    onPekSelected(isSelect) {
        this.setState({
            errPekerjaanValue: undefined
        })
        var pekMap = this.state.dataPekerjaan;
        var pek = pekMap.map((pekMap, key) => pekMap);
        for (var i = 0; i < pek.length; i++) {
            if (pek[i].value == isSelect) {
                this.setState({
                    pekerjaanId: pek[i].id,
                    pekerjaanValue: pek[i].value,
                });
                if (pek[i].value == "Lainnya") {
                    this.setState({ pekerjaanInput: true })
                } else {
                    this.setState({ pekerjaanInput: false, pekerjaanText: '' })
                }
            }
        }
    }

    onSumberSelected(isSelect) {
        this.setState({
            errSumberDanaValue: undefined
        })
        var sumMap = this.state.dataSumberdana;
        var sum = sumMap.map((sumMap, key) => sumMap);
        for (var i = 0; i < sum.length; i++) {
            if (sum[i].value == isSelect) {
                this.setState({
                    sumberdanaId: sum[i].id,
                    sumberdanaValue: sum[i].value,
                });
                if (sum[i].value == "Lainnya") {
                    this.setState({ sumberdanaInput: true })
                } else {
                    this.setState({ sumberdanaInput: false, sumberdanaText: '' })
                }
            }
        }
    }
    onPengSelected(isSelect) {
        this.setState({
            errPenghasilanValue: undefined
        })
        var pengMap = this.state.dataPenghasilan;
        var peng = pengMap.map((pengMap, key) => pengMap);
        for (var i = 0; i < peng.length; i++) {
            if (peng[i].value == isSelect) {
                this.setState({
                    penghasilanId: peng[i].id,
                    penghasilanValue: peng[i].value
                })
            }
        }
    }
    onTujSelected(isSelect) {
        this.setState({
            errTujuanIvestValue: undefined
        })
        var tujMap = this.state.dataTujInvest;
        var tuj = tujMap.map((tujMap, key) => tujMap);
        for (var i = 0; i < tuj.length; i++) {
            if (tuj[i].value == isSelect) {
                this.setState({
                    tujInvestId: tuj[i].id,
                    tujInvestValue: tuj[i].value,
                });
                if (tuj[i].value == "Lainnya") {
                    this.setState({ tujInvestInput: true })
                } else {
                    this.setState({ tujInvestInput: false, tujInvestText: '' })
                }
            }
        }
    }
    onSetPilAlamatDomisili(isOpen) {
        this.setState({ 
            indexAlamatDom: isOpen,
            errAlamatSesuaiKtp: undefined,
            errIndexAlamatDom: undefined,
            errAlamatDomValue: undefined,
            openFormAlamatDomisili: false,
            errKotaDomValue: undefined,
            errProvinsiDomValue: undefined,
            errNegaraDomValue: undefined,
            errKodePosDomValue: undefined,
            errFormAlamatDomisili: undefined,
            indexAlamatSurat: 0
        })
        switch (isOpen) {
            case '1':
                if (!this.state.alamatValue || !this.state.kodePosValue) {
                    this.setState({ indexAlamatDom: '0' })
                    this.setState({
                        errAlamatSesuaiKtp: 'Form Alamat Sesuai KTP Harus di Lengkapi'
                    })
                    !this.state.alamatValue && this.setState({errAlamatValue: 'Alamat Tidak Boleh Kosong'})
                    !this.state.kodePosValue && this.setState({ errKodePosValue: 'Kode Pos Tidak Boleh Kosong'})
                    if(!this.state.kotaValue) {
                        if(!this.state.kotaText) {
                            this.setState({errKotaValue: 'Kota Tidak Boleh Kosong'})
                        } else {
                            this.setState({errKotaValue: undefined})
                        }
                    } else {
                        this.setState({errKotaValue: undefined})
                    }
                } else if(!this.state.kotaValue) {
                    if(!this.state.kotaText) {
                        this.setState({ indexAlamatDom: '0' })
                        this.setState({
                            errAlamatSesuaiKtp: 'Form Alamat Sesuai KTP Harus di Lengkapi',
                            errKotaValue: 'Kota Tidak Boleh Kosong'
                        })
                    } else {
                        this.setState({
                            errAlamatSesuaiKtp: undefined
                        })
                    }
                } else if(!this.state.kotaText) {
                    if(!this.state.kotaValue) {
                        this.setState({ indexAlamatDom: '0' })
                        this.setState({
                            errAlamatSesuaiKtp: 'Form Alamat Sesuai KTP Harus di Lengkapi',
                            errKotaValue: 'Kota Tidak Boleh Kosong'
                        })
                    } else {
                        this.setState({
                            errAlamatSesuaiKtp: undefined
                        })
                    }
                } else {
                    option2 = [
                        { label: 'Sesuai Alamat KTP', value: '1' }, 
                        { label: 'Tambah Alamat Lain', value: '3' }
                    ];
                    this.setState({
                        indexAlamatSurat: '0'
                    })
                }
                break;
            case '2':
                if (!this.state.alamatValue || !this.state.kodePosValue) {
                    this.setState({ indexAlamatDom: '0' })
                    this.setState({
                        errAlamatSesuaiKtp: 'Form Alamat Sesuai KTP Harus di Lengkapi'
                    })
                    !this.state.alamatValue && this.setState({errAlamatValue: 'Alamat Tidak Boleh Kosong'})
                    !this.state.kodePosValue && this.setState({ errKodePosValue: 'Kode Pos Tidak Boleh Kosong'})
                    if(!this.state.kotaValue) {
                        if(!this.state.kotaText) {
                            this.setState({errKotaValue: 'Kota Tidak Boleh Kosong'})
                        } else {
                            this.setState({errKotaValue: undefined})
                        }
                    } else {
                        this.setState({errKotaValue: undefined})
                    }
                }  else if(!this.state.kotaValue) {
                    if(!this.state.kotaText) {
                        this.setState({ indexAlamatDom: '0' })
                        this.setState({
                            errAlamatSesuaiKtp: 'Form Alamat Sesuai KTP Harus di Lengkapi',
                            errKotaValue: 'Kota Tidak Boleh Kosong'
                        })
                    } else {
                        this.setState({
                            errAlamatSesuaiKtp: undefined,
                            openFormAlamatDomisili: true
                        })
                    }
                } else if(!this.state.kotaText) {
                    if(!this.state.kotaValue) {
                        this.setState({ indexAlamatDom: '0' })
                        this.setState({
                            errAlamatSesuaiKtp: 'Form Alamat Sesuai KTP Harus di Lengkapi',
                            errKotaValue: 'Kota Tidak Boleh Kosong'
                        })
                    } else {
                        this.setState({
                            errAlamatSesuaiKtp: undefined
                        })
                    }
                } else {
                    this.setState({
                        openFormAlamatDomisili: true
                    })
                    option2 = [
                        { label: 'Sesuai Alamat KTP', value: '1' }, 
                        { label: 'Sesuai Alamat Domisili', value: '2' },
                        { label: 'Tambah Alamat Lain', value: '3' }
                    ];
                }
                break;
        }

    }
    onSetPilAlamatSurat(isOpen) {
        if(this.state.indexAlamatDom == 0){
            this.setState({
                errIndexAlamatDom: 'Alamat Domisili Harus di Pilih'
            })
        }
        this.setState({
            openFormAlamatSurat: false,
            errFormAlamatDomisili: undefined,
            errAlamatDomValue: undefined,
            errKotaDomValue: undefined,
            errKodePosDomValue: undefined
        })
        switch (isOpen) {
            case '1':
                if(this.state.indexAlamatDom == 1) {
                    this.setState({
                        indexAlamatSurat: isOpen,
                        errAlamatSesuaiKtp: undefined,
                        errIndexAlamatSurat: undefined
                    })
                } else {
                    if (!this.state.alamatDomValue || !this.state.kodePosDomValue) {
                        this.setState({
                            errFormAlamatDomisili: 'Form Alamat Domisili Harus di Lengkapi'
                        })
                        !this.state.alamatDomValue && this.setState({errAlamatDomValue: 'Alamat Domisili Tidak Boleh Kosong'})
                        !this.state.kodePosDomValue && this.setState({errKodePosDomValue: 'Kode Pos Domisili Tidak Boleh Kosong'})
                        if(!this.state.kotaDomValue) {
                            if(!this.state.kotaDomText) {
                                this.setState({errKotaDomValue: 'Kota Domisili Tidak Boleh Kosong'})
                            }
                        } else {
                            this.setState({errKotaDomValue: undefined})
                        }
                    } else {
                        this.setState({
                            indexAlamatSurat: isOpen,
                            errAlamatSesuaiKtp: undefined,
                            errIndexAlamatSurat: undefined
                        })
                    }
                }
                break;
            case '2':
                if (!this.state.alamatDomValue || !this.state.kodePosDomValue) {
                    this.setState({
                        errFormAlamatDomisili: 'Form Alamat Domisili Harus di Lengkapi'
                    })
                    !this.state.alamatDomValue && this.setState({errAlamatDomValue: 'Alamat Domisili Tidak Boleh Kosong'})
                    !this.state.kodePosDomValue && this.setState({errKodePosDomValue: 'Kode Pos Domisili Tidak Boleh Kosong'})
                    if(!this.state.kotaDomValue) {
                        if(!this.state.kotaDomText) {
                            this.setState({errKotaDomValue: 'Kota Domisili Tidak Boleh Kosong'})
                        } else {
                            this.setState({errKotaDomValue: undefined})
                        }
                    } else {
                        this.setState({errKotaDomValue: undefined})
                    }
                } else {
                    this.setState({
                        indexAlamatSurat: isOpen,
                        errAlamatSesuaiKtp: undefined,
                        errIndexAlamatSurat: undefined
                    })
                }
                break;
            case '3':
                this.setState({
                    openFormAlamatSurat: true,
                })
                if(this.state.indexAlamatDom == 2) {
                    if (!this.state.alamatDomValue || !this.state.kodePosDomValue) {
                        this.setState({
                            errFormAlamatDomisili: 'Form Alamat Domisili Harus di Lengkapi',
                            indexAlamatSurat: 0,
                            openFormAlamatSurat: false
                        })
                        !this.state.alamatDomValue && this.setState({errAlamatDomValue: 'Alamat Domisili Tidak Boleh Kosong'})
                        !this.state.kodePosDomValue && this.setState({errKodePosDomValue: 'Kode Pos Domisili Tidak Boleh Kosong'})
                        if(!this.state.kotaDomValue) {
                            if(!this.state.kotaDomText) {
                                this.setState({errKotaDomValue: 'Kota Domisili Tidak Boleh Kosong'})
                            } else {
                                this.setState({errKotaDomValue: undefined})
                            }
                        } else {
                            this.setState({errKotaDomValue: undefined})
                        }
                    } else if(!this.state.kotaDomValue) {
                        if(!this.state.kotaDomText) {
                            this.setState({ indexAlamatDom: '0' })
                            this.setState({
                                errAlamatDomValue: 'Form Alamat Domisili Harus di Lengkapi',
                                indexAlamatSurat: 0,
                                errKotaDomValue: 'Kota Domisili Tidak Boleh Kosong',
                                openFormAlamatSurat: false
                            })
                        } else {
                            this.setState({
                                errAlamatDomValue: undefined
                            })
                        }
                    } else if(!this.state.kotaDomText) {
                        if(!this.state.kotaDomValue) {
                            this.setState({ indexAlamatDom: '0' })
                            this.setState({
                                errAlamatDomValue: 'Form Alamat Domisili Harus di Lengkapi',
                                errKotaDomValue: 'Kota Domisili Tidak Boleh Kosong',
                                indexAlamatSurat: 0,
                                openFormAlamatSurat: false
                            })
                        } else {
                            this.setState({
                                errAlamatDomValue: undefined
                            })
                        }
                    } else {
                        this.setState({ 
                            errFormAlamatSuratMenyurat: undefined,
                            errAlamatSurMerValue: undefined,
                            errKotaSurMerValue: undefined,
                            errProvinsiSurMerValue: undefined,
                            errNegaraSurMerValue: undefined
                        });
                    }
                }
                break;
        }
    }

    _getTujInvest(token) {
        this.setState({ isLoading: true })
        fetch(GLOBAL.getTujuanInvestasi(), {
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
                        var count = Object.keys(res.data.tujuan_investasi).length;
                        let data_tujInvest = [];
                        for (var i = 0; i < count; i++) {
                            data_tujInvest.push({
                                id: res.data.tujuan_investasi[i].id,
                                value: res.data.tujuan_investasi[i].nama_tujuan_investasi
                            })
                        }
                        this.setState({ dataTujInvest: data_tujInvest })
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    _getSumberdana(token) {
        this.setState({ isLoading: true })
        fetch(GLOBAL.getSumberDana(), {
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
                        var count = Object.keys(res.data.sumberdana).length;
                        let data_sumberdana = [];
                        for (var i = 0; i < count; i++) {
                            data_sumberdana.push({
                                id: res.data.sumberdana[i].id,
                                value: res.data.sumberdana[i].nama_sumberdana
                            })
                        }
                        this.setState({ dataSumberdana: data_sumberdana })
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    _getPenghasilan(token) {
        this.setState({ isLoading: true })
        fetch(GLOBAL.getPenghasilan(), {
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
                        var count = Object.keys(res.data.penghasilan).length;
                        let data_penghasilan = [];
                        for (var i = 0; i < count; i++) {
                            data_penghasilan.push({
                                id: res.data.penghasilan[i].id,
                                value: res.data.penghasilan[i].nama_penghasilan
                            })
                        }
                        this.setState({ dataPenghasilan: data_penghasilan })
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    _getPekerjaan(token) {
        this.setState({ isLoading: true })
        fetch(GLOBAL.getPekerjaan(), {
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
                        var count = Object.keys(res.data.pekerjaan).length;
                        let data_pekerjaan = [];
                        for (var i = 0; i < count; i++) {
                            data_pekerjaan.push({
                                id: res.data.pekerjaan[i].id,
                                value: res.data.pekerjaan[i].nama_pekerjaan
                            })
                        }
                        this.setState({ dataPekerjaan: data_pekerjaan })
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }
    _getPendidikan(token) {
        this.setState({ isLoading: true })
        fetch(GLOBAL.getPendidikan(), {
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
                        var count = Object.keys(res.data.pendidikan).length;
                        let data_pendidikan = [];
                        for (var i = 0; i < count; i++) {
                            data_pendidikan.push({
                                id: res.data.pendidikan[i].id,
                                value: res.data.pendidikan[i].nama_pendidikan
                            })
                        }
                        this.setState({ dataPendidikan: data_pendidikan })
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    _getKota(token, paramKota) {
        this.setState({ isLoading: true })
        var myKota;
        if (paramKota != null) {
            myKota = paramKota
        } else {
            myKota = ''
        }
        fetch(GLOBAL.getKota(myKota), {
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
                        var count = Object.keys(res.data.kota).length;
                        let data_kota = [];
                        for (var i = 0; i < count; i++) {
                            data_kota.push({
                                id: res.data.kota[i].id,
                                provinsi: res.data.kota[i].propinsi,
                                negara: res.data.kota[i].negara,
                                name: res.data.kota[i].kotamadya
                            })
                        }
                        this.setState({ dataKota: data_kota })
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    searchFilterFunction(text, modulName, inputId) {
        if (this.state.dataKota.length > 0) {
            const newData = this.state.dataKota.filter(item => {
                const itemData = item.kota.toUpperCase();
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            this.setState({ dataKotaOption: newData });
            if (newData.length > 0) {
                this.menu.menuCtx.menuActions.openMenu(modulName);
            } else {
                this.menu.menuCtx.menuActions.isMenuOpen(modulName) && this.menu.menuCtx.menuActions.closeMenu(modulName);
            }

        }
        switch (inputId) {
            case 'kota_ktp':
                this.setState({
                    kotaValue: text,
                });
                break
            case 'kota_domisili':
                this.setState({
                    kotaDomValue: text,
                });
                break
        }
    }

    _getToken = async () => {
        var aksesToken = await AsyncStorage.getItem('aksesToken');
        var kotaIdStore = await AsyncStorage.getItem('kotaIdValue');
        var kotaStore = await AsyncStorage.getItem('kotaValue');
        var alamatStore = await AsyncStorage.getItem('alamatValue');
        var provinsiStore = await AsyncStorage.getItem('provinsiValue');
        var negaraStore = await AsyncStorage.getItem('negaraValue');
        var kodePosStore = await AsyncStorage.getItem('kodePosValue');
        var indexAlamatDomStore = await AsyncStorage.getItem('indexAlamatDom');
        var alamatDomStore = await AsyncStorage.getItem('alamatDomValue');
        var kotaDomIdStore = await AsyncStorage.getItem('kotaDomIdValue');
        var kotaDomStore = await AsyncStorage.getItem('kotaDomValue');
        var provinsiDomStore = await AsyncStorage.getItem('provinsiDomValue');
        var negaraDomStore = await AsyncStorage.getItem('negaraDomValue');
        var kodePosDomStore = await AsyncStorage.getItem('kodePosDomValue');
        var indexAlamatSuratStore = await AsyncStorage.getItem('indexAlamatSurat');
        var alamatSuratStore = await AsyncStorage.getItem('alamatSuratValue');
        var kotaSuratStore = await AsyncStorage.getItem('kotaSuratValue');
        var kotaSuratIdStore = await AsyncStorage.getItem('kotaSurMerIdValue');
        var provinsiSuratStore = await AsyncStorage.getItem('provinsiSuratValue');
        var negaraSuratStore = await AsyncStorage.getItem('negaraSuratValue');
        var kodePosSuratStore = await AsyncStorage.getItem('kodePosSuratValue');
        var pendidikanStore = await AsyncStorage.getItem('pendidikanValue');
        var pendidikanIdStore = await AsyncStorage.getItem('pendidikanId');
        var pendidikanTextStore = await AsyncStorage.getItem('pendidikanText');
        var pekerjaanStore = await AsyncStorage.getItem('pekerjaanValue');
        var pekerjaanIdStore = await AsyncStorage.getItem('pekerjaanId');
        var pekerjaanTextStore = await AsyncStorage.getItem('pekerjaanText');
        var penghasilanStore = await AsyncStorage.getItem('penghasilanValue');
        var penghasilanIdStore = await AsyncStorage.getItem('penghasilanId');
        var sumberdanaStore = await AsyncStorage.getItem('sumberdanaValue');
        var sumberdanaIdStore = await AsyncStorage.getItem('sumberdanaId');
        var sumberdanaTextStore = await AsyncStorage.getItem('sumberdanaText');
        var tujInvestStore = await AsyncStorage.getItem('tujInvestValue');
        var tujInvestIdStore = await AsyncStorage.getItem('tujInvestId');
        var tujInvestTextStore = await AsyncStorage.getItem('tujInvestText');
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken })
            if (kotaSuratStore != null) {
                this.setState({
                    kotaSurMerValue: kotaSuratStore,

                })
            }
            if (kotaSuratIdStore != null) {
                this.setState({
                    kotaSurMerIdValue: kotaSuratIdStore,

                })
            }
            if (provinsiSuratStore != null) {
                this.setState({
                    provinsiSurMerValue: provinsiSuratStore
                })
            }
            if (negaraSuratStore != null) {
                this.setState({
                    negaraSurMerValue: negaraSuratStore
                })
            }
            if (kodePosSuratStore != null) {
                this.setState({
                    kodePosSurMerValue: kodePosSuratStore
                })
            }
            if (kotaStore != null) {
                this.setState({ kotaValue: kotaStore })
            }
            if (kotaIdStore != null) {
                this.setState({ kotaIdValue: kotaIdStore })
            }
            if (alamatStore != null) {
                this.setState({ alamatValue: alamatStore })
            }
            if (provinsiStore != null) {
                this.setState({ provinsiValue: provinsiStore })
            }
            if (negaraStore != null) {
                this.setState({ negaraValue: negaraStore })
            }
            if (kodePosStore != null) {
                this.setState({ kodePosValue: kodePosStore })
            }
            if (indexAlamatDomStore != null) {
                this.setState({ indexAlamatDom: indexAlamatDomStore })
                if(indexAlamatDomStore == 2){
                    this.setState({openFormAlamatDomisili:true})
                }
            }
            if (alamatDomStore != null) {
                this.setState({ alamatDomValue: alamatDomStore })
            }
            if (kotaDomIdStore != null) {
                this.setState({ kotaDomIdValue: kotaDomIdStore })
            }
            if (kotaDomStore != null) {
                this.setState({ kotaDomValue: kotaDomStore })
            }
            if (provinsiDomStore != null) {
                this.setState({ provinsiDomValue: provinsiDomStore })
            }
            if (negaraDomStore != null) {
                this.setState({ negaraDomValue: negaraDomStore })
            }
            if (kodePosDomStore != null) {
                this.setState({ kodePosDomValue: kodePosDomStore })
            }
            if (indexAlamatSuratStore != null) {
                this.setState({ indexAlamatSurat: indexAlamatSuratStore, errIndexAlamatSurat: undefined })
            }
            if (alamatSuratStore != null) {
                this.setState({ alamatSurMerValue: alamatSuratStore })
                if (alamatSuratStore != alamatStore && alamatSuratStore != alamatDomStore && alamatSuratStore != '') {
                    this.setState({ openFormAlamatSurat: true })
                }
            }
            if (pendidikanStore != null) {
                this.setState({ pendidikanValue: pendidikanStore });
                if (pendidikanStore == "Lainnya") {
                    this.setState({
                        pendidikanInput: true,
                        pendidikanText: pendidikanTextStore
                    });
                }
            }
            if (pendidikanIdStore != null) {
                this.setState({ pendidikanId: pendidikanIdStore })
            }
            if (pekerjaanStore != null) {
                this.setState({ pekerjaanValue: pekerjaanStore })
                if (pekerjaanStore == "Lainnya") {
                    this.setState({
                        pekerjaanInput: true,
                        pekerjaanText: pekerjaanTextStore
                    });
                }
            }
            if (pekerjaanIdStore != null) {
                this.setState({ pekerjaanId: pekerjaanIdStore })
            }
            if (penghasilanStore != null) {
                this.setState({ penghasilanValue: penghasilanStore })
            }
            if (penghasilanIdStore != null) {
                this.setState({ penghasilanId: penghasilanIdStore })
            }
            if (sumberdanaStore != null) {
                this.setState({ sumberdanaValue: sumberdanaStore })
                if (sumberdanaStore == "Lainnya") {
                    this.setState({
                        sumberdanaInput: true,
                        sumberdanaText: sumberdanaTextStore
                    });
                }
            }
            if (sumberdanaIdStore != null) {
                this.setState({ sumberdanaId: sumberdanaIdStore })
            }
            if (tujInvestStore != null) {
                this.setState({ tujInvestValue: sumberdanaStore });
                if (tujInvestStore == "Lainnya") {
                    this.setState({
                        tujInvestInput: true,
                        tujInvestText: tujInvestTextStore
                    });
                }
            }
            if (tujInvestIdStore != null) {
                this.setState({ tujInvestId: tujInvestIdStore })
            }
            this._getKota(this.state.myToken, null);
            this._getPendidikan(this.state.myToken);
            this._getPekerjaan(this.state.myToken);
            this._getPenghasilan(this.state.myToken);
            this._getSumberdana(this.state.myToken);
            this._getTujInvest(this.state.myToken);
        } else {
            this.Unauthorized()
        }
    }
    kotaKtpFunctionOnTextChange(item) {
        this.setState({
            kotaText: item,
            editableProvinsiKtp: true,
            provinsiValue: null,
            errKotaValue: undefined,
            errAlamatSesuaiKtp: undefined,
            errKodePosValue: undefined,
            errAlamatValue: undefined,
            openFormAlamatDomisili: false,
            indexAlamatDom: 0
        })
    }
    kotaKtpFunctionOnItemSelect(item) {
        this.setState({
            kotaValue: item.name,
            provinsiValue: item.provinsi,
            negaraValue: item.negara,
            kotaIdValue: item.id,
            errKotaValue: undefined,
            errProvinsiValue: undefined,
            errNegaraValue: undefined,
            editableProvinsiKtp: false
        });
    }
    kotaDomisiliFunctionOnTextChange(item) {
        this.setState({
            editableProvinsiDomisili: true,
            kotaDomText: item,
            provinsiDomValue: null,
            errKotaDomValue: undefined,
            errFormAlamatDomisili: undefined,
            errAlamatDomValue: undefined,
            errKodePosDomValue: undefined
        })
    }
    kotaDomisiliFunctionOnItemSelect(item) {
        this.setState({
            kotaValue: item.name,
            provinsiValue: item.provinsi,
            kotaIdValue: item.id,
            errKotaValue: undefined,
            errProvinsiDomValue: undefined,
        });
    }
    provinsiKtpFunctionOnChangeText(provinsiValue) {
        this.setState({ 
            provinsiValue: provinsiValue,
            errProvinsiValue: '',
            errAlamatSesuaiKtp: ''
        })
    }
    _onRefresh() {
        this.setState({ refreshing: true });
        this._getToken().then(() => {
            this.setState({ refreshing: false })
        });
    }
    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight })
    }
    componentDidMount() {
        this.setState({
            negaraValue: "INDONESIA"
        })
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
                <View style={{ height: GLOBAL.DEVICE_HEIGHT - 100 }}>
                    {/* <MenuProvider ref={(ref) => this.menu = ref} style={styles.inputGroup} customStyles={{ backdrop: {} }}> */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps = 'always'
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }>
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
                                    <View style={styles.lineCirclePage} />
                                    <View style={styles.whiteCirclePage} ><Text style={styles.btnTxtDefault}>4</Text></View>
                                </View>

                                <View style={styles.inputGroup} >
                                    <Text style={styles.labelText}>Alamat Sesuai KTP</Text>
                                    <View style={this.state.errAlamatSesuaiKtp ? { borderRadius: 10, borderColor: "red", borderWidth: 1, padding: 10 } : { borderRadius: 10, borderColor: "#FFF", borderWidth: 1, padding: 10 }}>
                                        <Text style={styles.labelText}>Alamat</Text>
                                        <View style={this.state.errAlamatValue ? styles.textInputError : styles.textInputGroup}>
                                            <TextInput placeholderTextColor="#000" autoCorrect={false} ref={this.field1} style={styles.textInput} placeholder="Alamat" value={this.state.alamatValue} keyboardType='default' onChangeText={(alamatValue) => this.setState({ alamatValue, errAlamatValue: undefined, errAlamatSesuaiKtp: undefined, errKotaValue: undefined, errKodePosValue: undefined, openFormAlamatDomisili: false, indexAlamatDom: 0 })} />
                                        </View>
                                        {renderIf(this.state.errAlamatValue)(
                                            <View>
                                                <Text style={styles.errorMessage}>{this.state.errAlamatValue && this.state.errAlamatValue}</Text>
                                            </View>
                                        )}
                                        <Text style={styles.labelText}>Kota</Text>
                                        <SearchableDropDown
                                            onTextChange={(item) => {this.kotaKtpFunctionOnTextChange(item)}}
                                            onItemSelect={(item) => {this.kotaKtpFunctionOnItemSelect(item)}}
                                            // containerStyle={}
                                            textInputStyle={this.state.errKotaValue ? styles.dropdownError : styles.textInputSearchDropdown}
                                            itemStyle={styles.itemSearchDropdown}
                                            itemTextStyle={{
                                                color: '#222'
                                            }}
                                            itemsContainerStyle={{
                                                maxHeight: 220
                                            }}
                                            items={this.state.dataKota}
                                            placeholder={this.state.kotaValue ==''?'Pilih Kota':this.state.kotaValue}
                                            placeholderTextColor="#000"
                                            resetValue={false}
                                            underlineColorAndroid='transparent' 
                                        />
                                        {renderIf(this.state.errKotaValue)(
                                            <View>
                                                <Text style={styles.errorMessage}>{this.state.errKotaValue && this.state.errKotaValue}</Text>
                                            </View>
                                        )}
                                        <Text style={styles.labelText}>Provinsi</Text>
                                        <View style={this.state.errProvinsiValue ? styles.textInputError : styles.textInputGroup}>
                                            <TextInput 
                                                placeholderTextColor="#000" 
                                                style={styles.textInput} 
                                                placeholder="Provinsi" 
                                                value={this.state.provinsiValue} 
                                                editable={this.state.editableProvinsiKtp} 
                                                onChangeText={(provinsiValue) => this.provinsiKtpFunctionOnChangeText(provinsiValue)} />
                                        </View>
                                        {renderIf(this.state.errProvinsiValue)(
                                            <View>
                                                <Text style={styles.errorMessage}>{this.state.errProvinsiValue && this.state.errProvinsiValue}</Text>
                                            </View>
                                        )}
                                        <Text style={styles.labelText}>Negara</Text>
                                        <View style={this.state.errNegaraValue ? styles.textInputError : styles.textInputGroup}>
                                            <TextInput placeholderTextColor="#000" style={styles.textInput} placeholder="Negara" value={this.state.negaraValue} editable={false} onChangeText={(negaraValue) => this.setState({ negaraValue })} />
                                        </View>
                                        {renderIf(this.state.errNegaraValue)(
                                            <View>
                                                <Text style={styles.errorMessage}>{this.state.errNegaraValue && this.state.errNegaraValue}</Text>
                                            </View>
                                        )}
                                        <Text style={styles.labelText}>Kode Pos</Text>
                                        <View style={this.state.errKodePosValue ? styles.textInputError : styles.textInputGroup}>
                                            <TextInput placeholderTextColor="#000" blurOnSubmit={true} multiline returnKeyType="done" ref={this.field3} style={styles.textInput} placeholder="Kode Pos" value={this.state.kodePosValue} keyboardType='number-pad' onChangeText={(kodePosValue) => this.setState({ kodePosValue, errKodePosValue: undefined, errAlamatSesuaiKtp: undefined, errAlamatValue: undefined, errKotaValue: undefined, openFormAlamatDomisili: false, indexAlamatDom: 0 })} />
                                        </View>
                                        {renderIf(this.state.errKodePosValue)(
                                            <View>
                                                <Text style={styles.errorMessage}>{this.state.errKodePosValue && this.state.errKodePosValue}</Text>
                                            </View>  
                                        )}
                                    </View>
                                    {renderIf(this.state.errAlamatSesuaiKtp)(
                                        <View>
                                            <Text style={styles.errorMessage}>{this.state.errAlamatSesuaiKtp}</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={this.state.errIndexAlamatDom ? styles.errorBorder : styles.inputGroup}>
                                    <Text style={styles.labelText}>Alamat Sesuai Domisili</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {option1.map(item => (
                                            <View key={item.value} style={styles.radioBtnContainer} >
                                                <TouchableOpacity onPress={() => {
                                                    this.onSetPilAlamatDomisili(item.value)
                                                }} style={styles.radioBtnCircle} >
                                                    {renderIf(this.state.indexAlamatDom == item.value)(
                                                        <View style={styles.radioBtnChecked} />
                                                    )}
                                                </TouchableOpacity>
                                                <Text style={styles.txtLittle}>{item.label}</Text>
                                            </View>
                                        ))}
                                    </View>
                                {renderIf(this.state.errIndexAlamatDom)(
                                       <Text style={styles.errorMessage}>{this.state.errIndexAlamatDom && this.state.errIndexAlamatDom}</Text>     
                                    )}
                                    {renderIf(this.state.openFormAlamatDomisili)(
                                        <View>
                                            <View style={this.state.errFormAlamatDomisili ? { borderRadius: 10, borderColor: "red", borderWidth: 1, padding: 10 } : { borderRadius: 10, borderColor: "#FFF", borderWidth: 1, padding: 10 }}>
                                                <Text style={styles.labelText}>Alamat</Text>
                                                <View style={this.state.errAlamatDomValue ? styles.textInputError : styles.textInputGroup}>
                                                    <TextInput placeholderTextColor="#000" autoCorrect={false} ref={this.field4} style={styles.textInput} placeholder="Alamat" value={this.state.alamatDomValue} keyboardType='default' onChangeText={(alamatDomValue) => this.setState({ alamatDomValue, errAlamatDomValue: undefined, errKotaDomValue: undefined, errFormAlamatDomisili: undefined, errKodePosDomValue: undefined, errKodePosDomValue: undefined})} />
                                                </View>
                                                {renderIf(this.state.errAlamatDomValue)(
                                                    <View>
                                                        <Text style={styles.errorMessage}>{this.state.errAlamatDomValue && this.state.errAlamatDomValue}</Text>
                                                    </View>
                                                )}
                                                <Text style={styles.labelText}>Kota Domisili</Text>
                                                <SearchableDropDown2
                                                    onTextChange={(item) => {this.kotaDomisiliFunctionOnTextChange(item)}}
                                                    onItemSelect={(item) => this.setState({
                                                        kotaDomValue: item.name,
                                                        provinsiDomValue: item.provinsi,
                                                        negaraDomValue: item.negara,
                                                        kotaDomIdValue: item.id,
                                                        errKotaDomValue: undefined,
                                                        errProvinsiDomValue: undefined,
                                                        errNegaraDomValue: undefined
                                                    })}
                                                    textInputStyle={this.state.errKotaDomValue ? styles.dropdownError : styles.textInputSearchDropdown}
                                                    itemStyle={styles.itemSearchDropdown}
                                                    itemTextStyle={{
                                                        color: '#222'
                                                    }}
                                                    itemsContainerStyle={{
                                                        maxHeight: 220
                                                    }}
                                                    items={this.state.dataKota}
                                                    placeholder={this.state.kotaDomValue ==''?'Pilih Kota Domisili':this.state.kotaDomValue}
                                                    placeholderTextColor="#000"
                                                    resetValue={false}
                                                    underlineColorAndroid='transparent' 
                                                />
                                                {renderIf(this.state.errKotaDomValue)(
                                                    <View>
                                                        <Text style={this.state.errKotaDomValue && styles.errorMessage}>{this.state.errKotaDomValue && this.state.errKotaDomValue}</Text>
                                                    </View>
                                                )}
                                                <Text style={styles.labelText}>Provinsi</Text>
                                                <View style={this.state.errProvinsiDomValue ? styles.textInputError : styles.textInputGroup}>
                                                    <TextInput placeholderTextColor="#000" style={styles.textInput} placeholder="Provinsi" value={this.state.provinsiDomValue} editable={this.state.editableProvinsiDomisili} onChangeText={(provinsiDomValue) => this.setState({ provinsiDomValue, errProvinsiDomValue: undefined })} />
                                                </View>
                                                {renderIf(this.state.errProvinsiDomValue) (
                                                    <View>
                                                        <Text style={this.state.errProvinsiDomValue && styles.errorMessage}>{this.state.errProvinsiDomValue && this.state.errProvinsiDomValue}</Text>
                                                    </View>
                                                )}
                                                <Text style={styles.labelText}>Negara</Text>
                                                <View style={this.state.errNegaraValue ? styles.textInputError : styles.textInputGroup}>
                                                    <TextInput placeholderTextColor="#000" style={styles.textInput} placeholder="Negara" value={this.state.negaraValue} editable={false} onChangeText={(negaraDomValue) => this.setState({ negaraDomValue, errNegaraDomValue: undefined })} />
                                                </View>
                                                {renderIf(this.state.errNegaraValue)(
                                                    <View>
                                                        <Text style={this.state.errNegaraValue && styles.errorMessage}>{this.state.errNegaraValue && this.state.errNegaraValue}</Text>
                                                    </View>
                                                )}
                                                <Text style={styles.labelText}>Kode Pos</Text>
                                                <View style={this.state.errKodePosDomValue ? styles.textInputError : styles.textInputGroup}>
                                                    <TextInput placeholderTextColor="#000" ref={this.field6} style={styles.textInput} returnKeyType="done" placeholder="Kode Pos" value={this.state.kodePosDomValue} keyboardType='number-pad' onChangeText={(kodePosDomValue) => this.setState({ kodePosDomValue, errKodePosDomValue: undefined, errFormAlamatDomisili: undefined, errAlamatDomValue: undefined, errKotaDomValue: undefined })} />
                                                </View>
                                                {renderIf(this.state.errKodePosDomValue)(
                                                    <View>
                                                        <Text style={this.state.errKodePosDomValue && styles.errorMessage}>{this.state.errKodePosDomValue && this.state.errKodePosDomValue}</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={styles.errorMessage}>{this.state.errFormAlamatDomisili && this.state.errFormAlamatDomisili}</Text>
                                        </View>
                                    )}
                                </View>
                                <View>
                                    
                                </View>
                                <View style={this.state.errIndexAlamatSurat ? styles.errorBorder : styles.inputGroup} >
                                    <Text style={styles.labelText}>Alamat Surat Menyurat</Text>
                                    {option2.map(item => (
                                        <View key={item.value} style={styles.radioBtnContainer} >
                                            <TouchableOpacity onPress={() => {
                                                this.onSetPilAlamatSurat(item.value)
                                            }} style={styles.radioBtnCircle} >
                                                {renderIf(this.state.indexAlamatSurat == item.value)(
                                                    <View style={styles.radioBtnChecked} />
                                                )}
                                            </TouchableOpacity>
                                            <Text style={styles.txtLittle}>{item.label}</Text>
                                        </View>
                                    ))}
                                </View>
                                {renderIf(this.state.openFormAlamatSurat)(
                                    <View>
                                    <View style={this.state.errFormAlamatSuratMenyurat ? { borderRadius: 10, borderColor: "red", borderWidth: 1, padding: 10 } : { borderRadius: 10, borderColor: "#FFF", borderWidth: 1, padding: 10 }}>

                                    <Text style={styles.labelText}>Alamat</Text>
                                    <View style={this.state.errAlamatSurMerValue ? styles.textInputGroupSuratError : styles.textInputGroupSurat}>
                                        <TextInput  
                                            placeholderTextColor="#000" 
                                            ref={this.field4} 
                                            style={styles.textInputAlamatSurat} 
                                            placeholder="Alamat" 
                                            value={this.state.alamatSurMerValue} 
                                            keyboardType='default' 
                                            onChangeText={(alamatSurMerValue) => this.setState({ alamatSurMerValue, errAlamatSurMerValue: undefined, errFormAlamatSuratMenyurat: undefined})} 
                                            underlineColorAndroid = "transparent"
                                            numberOfLines = {10}

                                        />
                                    </View>
                                    {renderIf(this.state.errAlamatSurMerValue)(
                                        <View>
                                            <Text style={styles.errorMessage}>{this.state.errAlamatSurMerValue && this.state.errAlamatSurMerValue}</Text>
                                        </View>
                                    )}
                                    {/* <Text style={styles.labelText}>Kota</Text>
                                    <SearchableDropDown2
                                        onTextChange={text => console.log(text)}
                                        onItemSelect={(item) => 
                                            this.setState({
                                                kotaSurMerValue: item.name,
                                                provinsiSurMerValue: item.provinsi,
                                                negaraSurMerValue: item.negara,
                                                kotaSurMerIdValue: item.id,
                                                errKotaSurMerValue: undefined,
                                                errProvinsiSurMerValue: undefined,
                                                errNegaraSurMerValue: undefined
                                            })
                                            // this.setState({
                                            //     kotaDomValue: item.name,
                                            //     provinsiDomValue: item.provinsi,
                                            //     negaraDomValue: item.negara,
                                            //     kotaDomIdValue: item.id
                                            // })
                                        }
                                        textInputStyle={this.state.errKotaSurMerValue ? styles.dropdownError : styles.textInputSearchDropdown}
                                        itemStyle={styles.itemSearchDropdown}
                                        itemTextStyle={{
                                            color: '#222'
                                        }}
                                        itemsContainerStyle={{
                                            maxHeight: 220
                                        }}
                                        items={this.state.dataKota}
                                        placeholder={this.state.kotaSurMerValue ==''?'Pilih Kota Domisili':this.state.kotaSurMerValue}
                                        placeholderTextColor="#000"
                                        resetValue={false}
                                        underlineColorAndroid='transparent' 
                                    />
                                    {renderIf(this.state.errKotaSurMerValue)(
                                        <View>
                                            <Text style={styles.errorMessage}>{this.state.errKotaSurMerValue && this.state.errKotaSurMerValue}</Text>
                                        </View>
                                    )}
                                    <Text style={styles.labelText}>Provinsi</Text>
                                    <View style={this.state.errProvinsiSurMerValue ? styles.textInputError : styles.textInputGroup}>
                                        <TextInput placeholderTextColor="#000" style={styles.textInput} placeholder="Provinsi" value={this.state.provinsiSurMerValue} editable={false} onChangeText={(provinsiSurMerValue) => this.setState({ provinsiSurMerValue })} />
                                    </View>
                                    {renderIf(this.state.errProvinsiSurMerValue)(
                                        <View>
                                            <Text style={styles.errorMessage}>{this.state.errProvinsiSurMerValue && this.state.errProvinsiSurMerValue}</Text>
                                        </View>
                                    )}
                                    <Text style={styles.labelText}>Negara</Text>
                                    <View style={this.state.errNegaraSurMerValue ? styles.textInputError : styles.textInputGroup}>
                                        <TextInput placeholderTextColor="#000" style={styles.textInput} placeholder="Negara" value={this.state.negaraSurMerValue} editable={false} onChangeText={(negaraSurMerValue) => this.setState({ negaraSurMerValue })} />
                                    </View>
                                    {renderIf(this.state.errNegaraSurMerValue)(
                                        <View>
                                            <Text style={styles.errorMessage}>{this.state.errNegaraSurMerValue && this.state.errNegaraSurMerValue}</Text>
                                        </View>  
                                    )}
                                    <Text style={styles.labelText}>Kode Pos</Text>
                                    <View style={this.state.errKodePosSurMerValue ? styles.textInputError : styles.textInputGroup}>
                                        <TextInput placeholderTextColor="#000" returnKeyType="done" style={styles.textInput} placeholder="Kode Pos" value={this.state.kodePosSurMerValue} keyboardType='number-pad' onChangeText={(kodePosSurMerValue) => this.setState({ kodePosSurMerValue, errKodePosSurMerValue: undefined })} />
                                    </View>
                                    {renderIf(this.state.errKodePosSurMerValue)(
                                        <View>
                                        <Text style={styles.errorMessage}>{this.state.errKodePosSurMerValue && this.state.errKodePosSurMerValue}</Text>
                                    </View>
                                    )} */}
                                </View>
                                <Text style={styles.errorMessage}>{this.state.errFormAlamatSuratMenyurat && this.state.errFormAlamatSuratMenyurat}</Text>
                                </View>
                                )}
                                <View style={this.state.errPendidikanValue && styles.errorBorder}>
                                    <Dropdown
                                        label='Pendidikan'
                                        textColor='#FFF'
                                        itemColor='#000'
                                        baseColor='#FFF'
                                        selectedItemColor='#000'
                                        value={this.state.pendidikanValue}
                                        onChangeText={(pendidikanValue) => { this.onPendSelected(pendidikanValue) }}
                                        data={this.state.dataPendidikan} 
                                        itemCount = {4.3}
                                    />
                                        {renderIf(this.state.pendidikanInput)(
                                            <View style={styles.textInputGroup}>
                                                <TextInput maxLength={50} placeholderTextColor="#000" style={styles.textInput} placeholder="Pendidikan" keyboardType='default' value={this.state.pendidikanText} onChangeText={(pendidikanText) => this.setState({ pendidikanText })} />
                                            </View>
                                        )}
                                </View>
                                {renderIf(this.state.errPendidikanValue)(
                                    <View>
                                        <Text style={styles.errorMessage}>{this.state.errPendidikanValue && this.state.errPendidikanValue}</Text>
                                    </View>
                                )}
                                <View style={this.state.errPekerjaanValue && styles.errorBorder}>
                                    <Dropdown
                                        label='Pekerjaan'
                                        textColor='#FFF'
                                        itemColor='#000'
                                        baseColor='#FFF'
                                        selectedItemColor='#000'
                                        value={this.state.pekerjaanValue}
                                        itemCount = {4.3}
                                        onChangeText={(pekerjaanValue) => { this.onPekSelected(pekerjaanValue) }}
                                        data={this.state.dataPekerjaan} />
                                        {renderIf(this.state.pekerjaanInput)(
                                            <View style={styles.textInputGroup}>
                                                <TextInput maxLength={50} placeholderTextColor="#000" style={styles.textInput} placeholder="Pekerjaan" keyboardType='default' value={this.state.pekerjaanText} onChangeText={(pekerjaanText) => this.setState({ pekerjaanText })} />
                                            </View>
                                        )}
                                </View>
                                {renderIf(this.state.errPekerjaanValue)(
                                    <View>
                                        <Text style={styles.errorMessage}>{this.state.errPekerjaanValue && this.state.errPekerjaanValue}</Text>
                                    </View>
                                )} 
                                <View style={this.state.errSumberDanaValue && styles.errorBorder}>
                                    <Dropdown
                                        label='Sumber Dana'
                                        textColor='#FFF'
                                        itemColor='#000'
                                        baseColor='#FFF'
                                        itemCount = {4.3}
                                        selectedItemColor='#000'
                                        value={this.state.sumberdanaValue}
                                        onChangeText={(sumberdanaValue) => { this.onSumberSelected(sumberdanaValue) }}
                                        data={this.state.dataSumberdana} />
                                        {renderIf(this.state.sumberdanaInput)(
                                            <View style={styles.textInputGroup}>
                                                <TextInput maxLength={50} onFocus={() => this.setState({ addHeight: true })} onBlur={() => this.setState({ addHeight: false })} placeholderTextColor="#000" style={styles.textInput} placeholder="Sumber Dana" keyboardType='default' value={this.state.sumberdanaText} onChangeText={(sumberdanaText) => this.setState({ sumberdanaText})} />
                                            </View>
                                        )}
                                        {renderIf(this.state.errSumberDanaValue)(
                                            <View>
                                                <Text style={styles.errorMessage}>{this.state.errSumberDanaValue && this.state.errSumberDanaValue}</Text>
                                            </View>
                                        )}
                                </View>
                                
                                <View style={this.state.errPenghasilanValue && styles.errorBorder}>
                                    <Dropdown
                                        label='Penghasilan Per Tahun'
                                        textColor='#FFF'
                                        itemColor='#000'
                                        baseColor='#FFF'
                                        itemCount = {4.3}
                                        selectedItemColor='#000'
                                        value={this.state.penghasilanValue}
                                        onChangeText={(penghasilanValue) => { this.onPengSelected(penghasilanValue) }}
                                        data={this.state.dataPenghasilan} 
                                    />
                                    {renderIf(this.state.errPenghasilanValue)(
                                        <View>
                                            <Text style={styles.errorMessage}>{this.state.errPenghasilanValue && this.state.errPenghasilanValue}</Text>
                                        </View>
                                    )}      
                                </View>
                                <View style={this.state.errTujuanIvestValue && styles.errorBorder}>
                                    <Dropdown
                                        label='Tujuan Investasi'
                                        textColor='#FFF'
                                        itemColor='#000'
                                        baseColor='#FFF'
                                        selectedItemColor='#000'
                                        itemCount = {4.3}
                                        value={this.state.tujInvestValue}
                                        onChangeText={(tujInvestValue) => { this.onTujSelected(tujInvestValue) }}
                                        data={this.state.dataTujInvest} />
                                        {renderIf(this.state.tujInvestInput)(
                                            <View style={styles.textInputGroup}>
                                                <TextInput maxLength={50} onFocus={() => this.setState({ addHeight: true })} onBlur={() => this.setState({ addHeight: false })} placeholderTextColor="#000" style={styles.textInput} placeholder="Tujuan Investasi" keyboardType='default' value={this.state.tujInvestText} onChangeText={(tujInvestText) => this.setState({ tujInvestText})} />
                                            </View>
                                        )}
                                        {renderIf(this.state.errTujuanIvestValue)(
                                            <View>
                                                <Text style={styles.errorMessage}>{this.state.errTujuanIvestValue && this.state.errTujuanIvestValue}</Text>
                                            </View>
                                        )}
                                </View>
                                {renderIf(this.state.addHeight == true)(
                                    <View style={{ width: '100%', height: 200 }} />
                                )}
                            </View>
                        </ScrollView>
                    {/* </MenuProvider> */}
                    {renderIf(this.state.viewBlink)(
                        <BlinkingIcon name="ios-arrow-down" />
                    )}
                </View>
                <View style={styles.boxBtnBottom}>
                    <View style={{ flexDirection: "row", flex: 1, paddingLeft: 15, paddingRight: 15 }}>

                        <AwesomeButton
                            borderRadius={15}
                            backgroundColor='#28ccfb'
                            backgroundShadow="#000"
                            backgroundDarker="#23b6e0"
                            height={40}
                            width={GLOBAL.DEVICE_WIDTH * 0.5 - 25}
                            style={{ marginTop: 10, alignSelf: 'flex-end', marginRight: 10 }}
                            onPress={this.onPreviuos}>
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
                            onPress={this.onNext}>
                            <Image source={require('./../img/btnLogin.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5 - 25, height: 40, resizeMode: 'stretch' }} />
                            <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>BERIKUTNYA</Text>
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

export default RegistPage3;

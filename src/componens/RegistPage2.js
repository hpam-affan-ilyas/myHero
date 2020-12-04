
import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, StatusBar,Platform, View, KeyboardAvoidingView, TextInput, Alert, Modal, ActivityIndicator, RefreshControl,BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView } from 'react-native-gesture-handler';
// import { useDarkMode } from 'react-native-dark-mode';
import DateTimePicker from "react-native-modal-datetime-picker";
import UnAuth from './UnauthPage';
import renderIf from './Renderif';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFirstInstallTime } from 'react-native-device-info';
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
        this.setState({ tglLahirValue: formatted_date })
        this.hideDateTimePicker();
        const textInput = this.field5.current;
        textInput.focus()
    };

    onPreviuos = () => {
        this.props.navigation.navigate('Regist1');
    }
    onNext = () => {
        let states = this.state;
        let namaValue = states.namaValue;
        let emailValue = states.emailValue;
        let noHpValue = states.noHpValue;
        let jenisKelaminValue = states.jenis_kelaminValue;
        let tanggalLahirValue = states.tglLahirValue;
        let tempatLahirValue = states.tempatLahirValue;
        let statusNikahValue = states.statusNikahValue;
        let agamaValue = states.agamaValue;
        
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
        !noHpValue && [continueNextPage = false, this.setState({errNoHp: 'Nomor Handphone Tidak Boleh Kosong'})]
        jenisKelaminValue == 0 && [continueNextPage = false, this.setState({errJenisKelamin: 'Jenis Kelamin Harus di Pilih'})]
        !tanggalLahirValue && [continueNextPage = false, this.setState({errTglLahir: 'Tanggal Lahir Harus di Isi'})]
        !tempatLahirValue && [continueNextPage = false, this.setState({errTempatLahir: 'Tempat Lahir Tidak Boleh Kosong'})]
        !statusNikahValue && [continueNextPage = false, this.setState({errStatusNikah: 'Status Nikah Tidak Boleh Kosong'})]
        !agamaValue && [continueNextPage = false, this.setState({errAgama: 'Agama Tidak Boleh Kosong'})]

        console.log('Continue to the Page 3?', continueNextPage);
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
            let uploadData = new FormData();
            var tgl = this.state.tglLahirValue.split('-');
            var tgl_lahir = tgl[2] + '-' + tgl[1] + '-' + tgl[0];
            uploadData.append('jenisKelamin', this.state.jenis_kelaminValue);
            uploadData.append('tanggalLahir', tgl_lahir);
            uploadData.append('tempatLahir', this.state.tempatLahirValue);
            uploadData.append('statusNikah', statusNikahId);
            uploadData.append('agama', agamaId);
            console.log("Form Upload Data", uploadData);
            fetch(GLOBAL.pendaftaran(), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': this.state.myToken,
                },
                body: uploadData
            })
            .then((response) => {
                if (response.status == '201') {
                    try{
                        this.props.navigation.navigate('Regist3');
                    }catch(e) {
                        return false;
                    }
                } else {
                    this.setState({ isLoading: false });
                    GLOBAL.gagalKoneksi()
                }
            })
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
                            if(res.nasabah.status_nikah == 1) {
                                this.setState({
                                    statusNikahValue: "Belum Menikah"
                                })
                            } 
                            if(res.nasabah.status_nikah == 2) {
                                this.setState({
                                    statusNikahValue: "Menikah"
                                })
                            }
                            if(res.nasabah.status_nikah == 3) {
                                this.setState({
                                    statusNikahValue: "Janda / Duda"
                                })
                            }
                            
                            this.getNamaAgama(this.state.myToken, res.nasabah.agama);
                            let tanggalLahir = res.nasabah.tgl_lahir;
                            let splitTanggalLahir = tanggalLahir.split("-");
                            let newTanggalLahir = splitTanggalLahir[2] + '-' + splitTanggalLahir[1] + '-' + splitTanggalLahir[0];
                            console.log("Tanggal Lahir", tanggalLahir);
                            console.log("New Tanggal Lahir", newTanggalLahir);
                            this.setState({
                                namaValue: res.users.name+' '+res.users.last_name,
                                emailValue: res.users.email,
                                noHpValue: res.users.no_hp,
                                jenis_kelaminValue: res.nasabah.jenis_kelamin,
                                tglLahirValue: newTanggalLahir,
                                tempatLahirValue: res.nasabah.tempat_lahir
                            })
                            this._getAgama(this.state.myToken);
                        }
                    });
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
        }
    }

    getNamaAgama = async (token, idAgama) => {
        fetch(GLOBAL.getNamaAgama(), {
            method: 'POST',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({
                idAgama: idAgama
            })
        })
            .then((response) => {
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        this.setState({
                            agamaValue: res.data.agama.nama_agama
                        })
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    _getToken = async () => {
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken })
            if (namaStore != null) {
                this.setState({ namaValue: namaStore })
            }
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
        return this.checkCustomer();
        // return this._getToken();
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
                    <KeyboardAvoidingView behavior="position">
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
                        <View>
                            <Text style={styles.errorMessage}>{this.state.errNoHp && this.state.errNoHp}</Text>
                        </View>
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
                            <TouchableOpacity onPress={this.showDateTimePicker} ref={this.field4}>
                                <Text style={styles.labelText}>Tanggal Lahir</Text>
                                <View style={this.state.errTglLahir ? styles.textInputError : styles.textInputGroup} >
                                    <View style={styles.iconGroupLeft} >
                                        <Icon name="calendar" size={20} style={styles.colorIconInput}/>
                                    </View>
                                    <Text style={styles.textInput}>{this.state.tglLahirValue}</Text>
                                    <DateTimePicker
                                        isVisible={this.state.isDateTimePickerVisible}
                                        onConfirm={this.handleDatePicked}
                                        onCancel={this.hideDateTimePicker}
                                        datePickerContainerStyleIOS={{backgroundColor:'#3676c2'}}
                                        cancelButtonContainerStyleIOS={{backgroundColor:'#3676c2'}}
                                        titleStyle={{color:'#FFF'}}
                                        confirmTextStyle={{color:'#FFF'}}
                                        cancelTextStyle={{color:'#FFF'}}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {renderIf(this.state.errTglLahir)(
                            <View>
                                <Text style={styles.errorMessage}>{this.state.errTglLahir && this.state.errTglLahir}</Text>
                            </View>
                        )}

                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>Tempat Lahir</Text>
                            <View style={styles.textInputGroup}>
                                <TextInput 
                                    placeholderTextColor="#000000" 
                                    ref={this.field5} 
                                    onSubmitEditing={() => { 
                                        const textInput = this.field6.current;
                                        textInput.focus()} }  
                                    style={this.state.errTempatLahir ? styles.textInputErrorTempatLahir : styles.textInput} 
                                    editable={this.state.editTempatLahir} 
                                    placeholder="Tempat Lahir" 
                                    value={this.state.tempatLahirValue} 
                                    keyboardType='default' 
                                    onChangeText={(tempatLahirValue) => this.setState({ tempatLahirValue, errTempatLahir: undefined })} />
                            </View>
                        </View>
                        {renderIf(this.state.errTempatLahir)(
                            <View>
                                <Text style={styles.errorMessage}>{this.state.errTempatLahir && this.state.errTempatLahir}</Text>
                            </View>
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
                            />
                        </View>
                        {renderIf(this.state.errAgama)(
                            <View>
                                <Text style={styles.errorMessage}>{this.state.errAgama && this.state.errAgama}</Text>
                            </View>
                        )}
                        
                    </View>
                    </KeyboardAvoidingView>
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

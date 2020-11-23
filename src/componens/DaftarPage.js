
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, Dimensions, Modal, ActivityIndicator, TextInput, ScrollView, Alert,StatusBar,BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import Icon from 'react-native-vector-icons/FontAwesome';
import renderIf from './Renderif';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');

class DaftarPage extends Component {
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
            statusEye1: 'eye-slash',
            statusEye2: 'eye-slash',
            namaDepan: '',
            namaBelakang: '',
            emailInput: '',
            noHp: '',
            passwordInput: '',
            passwordKonfirm: '',
            PnamaDepan:'Nama Lengkap',   
            PnamaBelakang:'Nama Belakang',
            Pemail:'Email',
            Php:'No Ponsel',   
            Ppass:'Password',  
            PpassKonfirm:'Konfirmasi Password',
        }
    };

    emailInputChange = (emailInput) => {
        if(!emailInput) {
            this.setState({
                errEmailInput : 'Email Tidak Boleh Kosong'
            })
        } else {
            if(!emailInput.match(GLOBAL.mailFormat)) {
                this.setState({
                    errEmailInput : 'Email Tidak Valid'
                })
            } else {
                this.setState({ 
                    emailInput,
                    errEmailInput: undefined 
                })
            }
        }
    }

    namaLengkapChange = (namaDepan) => {
        if(!namaDepan) {
            this.setState({
                errNamaLengkap : 'Nama Lengkap Tidak Boleh Kosong'
            })
        } else {
            this.setState({
                namaDepan,
                errNamaLengkap : undefined
            })
        }
    } 

    noHpChange = (noHp) => {
        if(!noHp) {
            this.setState({
                errNoHp : 'Nomor Handphone Tidak Boleh Kosong'
            })
        } else {
            if(!noHp.match(GLOBAL.numbersFormat)) {
                this.setState({
                    errNoHp : 'Nomor Handphone Tidak Valid'
                })
            } else {
                this.setState({ 
                    noHp, 
                    errNoHp: undefined 
                })
            }
        }        
    }

    passwordInputChange = (passwordInput) => {
        if(!passwordInput) {
            this.setState({
                errPasswordInput : 'Password Tidak Boleh Kosong'
            })
        } else {
            this.setState({ 
                passwordInput, 
                errPasswordInput: undefined
            })
        }
    }

    passwordKonfirmChange = (passwordKonfirm) => {
        if(!passwordKonfirm) {
            this.setState({
                errKonfirmPassword : 'Password Konfirm Tidak Boleh Kosong'
            })
        } else {
            if(this.state.passwordInput != passwordKonfirm) {
                this.setState({
                    errKonfirmPassword : 'Password Harus Sama'
                })
            } else {
                this.setState({ 
                    passwordKonfirm, 
                    errKonfirmPassword: undefined 
                })
            }
        }
    }

    daftarProses = () => {
        let continueRegist = true;
        if(this.state.errNamaLengkap) {
            continueRegist = false;
        }
        if(this.state.errEmailInput) {
            continueRegist = false;
        }
        if(this.state.errNoHp) {
            continueRegist = false;
        }
        if(this.state.errPasswordInput) {
            continueRegist = false;
        }
        if(this.state.errKonfirmPassword) {
            continueRegist = false;
        }
        this.state.errNamaLengkap && continueRegist == false;
        this.state.errEmailInput && continueRegist == false;
        this.state.errNoHp && continueRegist == false;
        this.state.errPasswordInput && continueRegist == false;
        this.state.errKonfirmPassword && continueRegist == false;

        !this.state.namaDepan && [this.setState({ errNamaLengkap : 'Nama Lengkap Tidak Boleh Kosong'}), continueRegist = false]
        if(!this.state.emailInput) {
            this.setState({
                errEmailInput : 'Email Tidak Boleh Kosong'
            })
            continueRegist = false
        } else {
            if(!this.state.emailInput.match(GLOBAL.mailFormat)) {
                this.setState({
                    errEmailInput : 'Email Tidak Valid'
                })
                continueRegist = false
            }

        }
        if(!this.state.noHp) {
            this.setState({
                errNoHp : 'Nomor Handphone Tidak Boleh Kosong'
            })
            continueRegist = false
        } else {
            if(!this.state.noHp.match(GLOBAL.numbersFormat)) {
                this.setState({
                    errNoHp : 'Nomor Handphone Tidak Valid'
                })
                continueRegist = false
            }
        }
        !this.state.passwordInput && this.setState({ errPasswordInput : 'Password Tidak Boleh Kosong'})
        if(!this.state.passwordKonfirm) {
            this.setState({ 
                errKonfirmPassword : 'Konfirm Password Tidak Boleh Kosong'
            })
            continueRegist = false
        } else {
            if(this.state.passwordInput != this.state.passwordKonfirm) {
                this.setState({ 
                    errKonfirmPassword : 'Password Harus Sama'
                })
                continueRegist = false
            }
        }
        console.log('Continue Regist?', continueRegist);
        if(continueRegist) {
            var nama_lengkap = this.state.namaDepan.split(" ");
            var nama_lengkap_belakang;
            var nama_belakang_sebelumnya;
            for(var i=1;i < nama_lengkap.length; i++){
                var nama_belakang = nama_lengkap[i];
                if(i == 1){
                    nama_belakang_sebelumnya= nama_lengkap[i];
                    nama_lengkap_belakang = nama_belakang_sebelumnya;
                }else{
                    nama_lengkap_belakang = nama_belakang_sebelumnya+" "+nama_belakang;
                }
                nama_belakang_sebelumnya = nama_lengkap_belakang;
            }
            this.setState({ isLoading: true})
            fetch(GLOBAL.daftar(), {
                method: 'POST',
                headers: {
                    'Accept': 'appication/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    nama: nama_lengkap[0],
                    email: this.state.emailInput,
                    no_hp: this.state.noHp,
                    password: this.state.passwordInput,
                    password2: this.state.passwordKonfirm,
                    last_name: nama_lengkap_belakang,
                })
            }).then((response) => response.json()).then((res) => {
                    this.setState({ isLoading: false })
                    if (res.success === true) {
                        Alert.alert('Sukses', '' + res.message + '\nKonfirmasi email untuk aktifasi akun',
                            [{ text: 'OK', onPress: () => this.props.navigation.navigate('Login') }],
                            { cancelable: false },
                        );
                    } else {
                        this.setState({
                            errResopnse : res.message
                        })
                    }
                }).done();
            this.setState({ isLoading: false })
        }
    }

    onTongelEyesPress(StringHolder) {
        switch (StringHolder) {
            case '1':
                this.setState({
                    secureTextEntry1: !this.state.secureTextEntry1,
                });
                if (!this.state.secureTextEntry1) {
                    this.setState({
                        statusEye1: "eye-slash",
                    })
                } else {
                    this.setState({
                        statusEye1: "eye",
                    })
                }
                break;
            case '2':
                this.setState({
                    secureTextEntry2: !this.state.secureTextEntry2,
                });
                if (!this.state.secureTextEntry2) {
                    this.setState({
                        statusEye2: "eye-slash",
                    })
                } else {
                    this.setState({
                        statusEye2: "eye",
                    })
                }
                break;
        }

    }
    componentDidMount(){
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack();
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }

    setFocus(label){
        switch(label){
            case 'namaDepan':
                this.setState({LnamaDepan:'Nama Lengkap',PnamaDepan:''})
                break;
            case 'namaBelakang':
                this.setState({LnamaBelakang:'Nama Belakang',PnamaBelakang:''})
                break;
            case 'email':
                this.setState({Lemail:'Email',Pemail:''})
                break;
            case 'hp':
                this.setState({Lhp:'No Ponsel',Php:''})
                break;
            case 'pass':
                this.setState({Lpass:'Password',Ppass:''})
                break;
            case 'passKonfirm':
                this.setState({LpassKonfirm:'Konfirmasi Password',PpassKonfirm:''})
                break;
        }
    }

    setBlur(label){
        switch(label){
            case 'namaDepan':
                if(this.state.namaDepan.length == 0){
                    this.setState({LnamaDepan:'',PnamaDepan:'Nama Lengkap'})
                }else{
                    this.setState({LnamaDepan:'Nama Lengkap',PnamaDepan:''})
                }
                break;
            case 'namaBelakang':
                if(this.state.namaBelakang.length == 0){
                    this.setState({LnamaBelakang:'',PnamaBelakang:'Nama Belakang'})
                }else{
                    this.setState({LnamaBelakang:'Nama Belakang',PnamaBelakang:''})
                }
                break;
            case 'email':
                if(this.state.emailInput.length == 0){
                    this.setState({Lemail:'',Pemail:'Email'})
                }else{
                    this.setState({Lemail:'Email',Pemail:''})
                }
                break;
            case 'hp':
                if(this.state.noHp.length == 0){
                    this.setState({Lhp:'',Php:'No Ponsel'})
                }else{
                    this.setState({Lhp:'No Ponsel',Php:''})
                }
                break;
            case 'pass':
                if(this.state.passwordInput.length == 0){
                    this.setState({Lpass:'',Ppass:'Password'})
                }else{
                    this.setState({Lpass:'Password',Ppass:''})
                }
                break;
            case 'passKonfirm':
                if(this.state.passwordKonfirm.length == 0){
                    this.setState({LpassKonfirm:'',PpassKonfirm:'Konfirmasi Password'})
                }else{
                    this.setState({LpassKonfirm:'Konfirmasi Password',PpassKonfirm:''})
                }
                break;
        }
    }

    render() {
        return (
            <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
                <StatusBar backgroundColor="#FFF" barStyle="dark-content" hidden={false} />
          
                <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} scrollEnabled={true}>
                    <View style={{ width: GLOBAL.DEVICE_WIDTH, height: GLOBAL.DEVICE_HEIGHT, flex: 1 }}>
                        <View style={styles.logoContain}>
                            <Image source={require('../img/Logo.png')} style={styles.imgLogo} />
                        </View>

                        {
                            this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
                        }
                        <View style={{marginLeft: 20, marginRight: 20,height:'75%'}}>
                            <View style={styles.inputGroup} >
                                {renderIf(this.state.errResopnse)(
                                    <Text style={[styles.errorMessage, {marginTop: 10}]}>{this.state.errResopnse}</Text>
                                )}
                                <Text style={styles.labelText}>{this.state.LnamaDepan}</Text>
                                <View style={this.state.errNamaLengkap ? styles.textInputError : styles.textInputGroup}>
                                    <TextInput placeholderTextColor="#000000" autoCorrect={false} ref={this.field1} autoCapitalize = 'none' onFocus={()=>this.setFocus('namaDepan')} onBlur={()=>this.setBlur('namaDepan')} onSubmitEditing={() =>{ const textInput = this.field3.current; textInput.focus()} } style={styles.textInput} placeholder={this.state.PnamaDepan} keyboardType='default' maxLength={25} onChangeText={(namaDepan) => this.namaLengkapChange(namaDepan)} />
                                </View>
                            </View>
                            {renderIf(this.state.errNamaLengkap)(
                                <Text style={styles.errorMessage}>{this.state.errNamaLengkap}</Text>
                            )}
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>{this.state.Lemail}</Text>
                                <View style={this.state.errEmailInput ? styles.textInputError : styles.textInputGroup}>
                                    <TextInput placeholderTextColor="#000000" ref={this.field3} autoCapitalize = 'none' onFocus={()=>this.setFocus('email')} onBlur={()=>this.setBlur('email')} onSubmitEditing={() =>{ const textInput = this.field4.current;
                                    textInput.focus()} } style={styles.textInput} placeholder={this.state.Pemail} keyboardType="email-address" onChangeText={(emailInput) => this.emailInputChange(emailInput)} />
                                </View>
                            </View>
                            {renderIf(this.state.errEmailInput)(
                                <Text style={styles.errorMessage}>{this.state.errEmailInput}</Text>
                            )}
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>{this.state.Lhp}</Text>
                                <View style={this.state.errNoHp ? styles.textInputError : styles.textInputGroup}>
                                    <TextInput placeholderTextColor="#000000" ref={this.field4} onFocus={()=>this.setFocus('hp')} onBlur={()=>this.setBlur('hp')} onSubmitEditing={() =>{ const textInput = this.field5.current;
                                    textInput.focus()} } style={styles.textInput} placeholder={this.state.Php} keyboardType='phone-pad' maxLength={13} onChangeText={(noHp) => this.noHpChange(noHp)} />
                                </View>
                            </View>
                            {renderIf(this.state.errNoHp)(
                                <Text style={styles.errorMessage}>{this.state.errNoHp}</Text>
                            )}
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>{this.state.Lpass}</Text>
                                <View style={this.state.errPasswordInput ? styles.textInputError : styles.textInputGroup}>
                                    <TextInput {...this.props} style={styles.textInput}
                                    placeholderTextColor="#000000"
                                       ref={this.field5} onFocus={()=>this.setFocus('pass')} onBlur={()=>this.setBlur('pass')} onSubmitEditing={() =>{ const textInput = this.field6.current;
                                        textInput.focus()} } secureTextEntry={this.state.secureTextEntry1} placeholder={this.state.Ppass} maxLength={30}  keyboardType="default" onChangeText={(passwordInput) => this.passwordInputChange(passwordInput)} />
                                    <TouchableOpacity onPress={this.onTongelEyesPress.bind(this, '1')} style={styles.iconGroup}>
                                        <Icon style={{color:'#7d7d7d'}} name={this.state.statusEye1} size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {renderIf(this.state.errPasswordInput)(
                                <Text style={styles.errorMessage}>{this.state.errPasswordInput}</Text>
                            )}
                            <View style={styles.inputGroup} >
                                <Text style={styles.labelText}>{this.state.LpassKonfirm}</Text>
                                <View style={this.state.errKonfirmPassword ? styles.textInputError : styles.textInputGroup}>
                                    <TextInput {...this.props} style={styles.textInput}
                                    placeholderTextColor="#000000"
                                       ref={this.field6} onFocus={()=>this.setFocus('passKonfirm')} onBlur={()=>this.setBlur('passKonfirm')} onSubmitEditing={ this.daftarProses } secureTextEntry={this.state.secureTextEntry2} placeholder={this.state.PpassKonfirm} keyboardType="default" maxLength={30}  onChangeText={(passwordKonfirm) => this.passwordKonfirmChange(passwordKonfirm)} />
                                    <TouchableOpacity onPress={this.onTongelEyesPress.bind(this, '2')} style={styles.iconGroup}>
                                        <Icon style={{color:'#7d7d7d'}} name={this.state.statusEye2} size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {renderIf(this.state.errKonfirmPassword)(
                                <Text style={styles.errorMessage}>{this.state.errKonfirmPassword}</Text>
                            )}
                            <View style={{alignItems:'center',marginTop:10,marginBottom:20}}>
                                {/* <TouchableOpacity onPress={this.daftarProses} style={styles.btnDaftar} >
                                    <Text style={styles.btnTxtDefault}>DAFTAR</Text>
                                </TouchableOpacity> */}
                                <AwesomeButton
                                    borderRadius={15}
                                    backgroundColor='#fdfdfd'
                                    backgroundShadow="#000"
                                    // backgroundDarker="#e6e2e2"
                                    height={40}
                                    style={{marginBottom:10}}
                                    textColor="#0843bf"
                                    textSize={16}
                                    textLineHeight={600}
                                    width={GLOBAL.DEVICE_WIDTH*0.5}
                                    onPress={this.daftarProses}
                                >DAFTAR
                                </AwesomeButton>
                            </View>
                            
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        );
    }
}

export default DaftarPage;



import React, { Component } from 'react';
import { Text, View, Alert, TouchableOpacity, Image, Dimensions,Modal,ActivityIndicator, TextInput, ScrollView,StatusBar,BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import Icon from 'react-native-vector-icons/FontAwesome';
var GLOBAL= require('../utils/Helper');
var styles = require('../utils/Styles');

class ResetPassPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading:false,
            email: '',
            Pemail:'Email', 
        }
    }
    resetPass = () => {
        if(this.state.email.length == 0) {
            Alert.alert('Perhatian', 'Email tidak boleh kosong',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        } else if (!this.state.email.match(GLOBAL.mailFormat)) {
            Alert.alert('Perhatian', 'Email tidak valid',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        } else {
            this.setState({isLoading:true})
            fetch(GLOBAL.resetPassword(), {
                method: 'POST',
                headers: {
                    'Accept': 'appication/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                })
            })
                .then((response) => response.json())
                .then((res) => {
                    this.setState({isLoading:false})
                    if(res.success === true) {
                        Alert.alert('Sukses',''+res.message,
                            [{text: 'OK', onPress: () => this.props.navigation.navigate('Login')}],
                            {cancelable: false},
                        );

                    }else if(res.success === false){
                        Alert.alert('Perhatian',''+res.message,
                            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                            {cancelable: false},
                        );
                    }else {
                        GLOBAL.gagalKoneksi()
                    }
                })
            this.setState({isLoading:false})
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
            case 'email':
                this.setState({Lemail:'Email',Pemail:''})
                break;
        }
    }
    
    setBlur(label){
        switch(label){
            case 'email':
                if(this.state.email .length == 0){
                    this.setState({Lemail:'',Pemail:'Email'})
                }else{
                    this.setState({Lemail:'Email',Pemail:''})
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
                    <View style={{marginLeft: 20, marginRight: 20, marginTop: 10,height:'75%',alignItems:'center'}}>
                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>{this.state.Lemail}</Text>
                            <View style={styles.textInputGroup}>
                                <TextInput placeholderTextColor="#000000" onFocus={()=>this.setFocus('email')} onBlur={()=>this.setBlur('email')} {...this.props} style={styles.textInput} placeholder={this.state.Pemail} keyboardType="email-address" onChangeText={(email) => this.setState({email})} />
                                <TouchableOpacity onPress={this.onTongelEyesPress} style={styles.iconGroup}>
                                    <Icon name="envelope-o" style={styles.colorIconInput} size={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.btnContainer}>
                            {/* <TouchableOpacity onPress={this.resetPass} style={styles.btnDaftar} >
                                <Text style={styles.btnTxtDefault}>KIRIM</Text>
                            </TouchableOpacity> */}
                            <AwesomeButton
                                borderRadius={15}
                                backgroundColor='#4F7942'
                                backgroundShadow="#000"
                                backgroundDarker="#45673a"
                                height={40}
                                style={{marginTop:10}}
                                width={GLOBAL.DEVICE_WIDTH*0.5}
                                onPress={this.resetPass}
                                >
                                    <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5,height:40,resizeMode:'stretch'}} />
                                    <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SIMPAN</Text>
                            </AwesomeButton>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
    }
}

export default ResetPassPage;

import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, View } from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";
var GLOBAL= require('../utils/Helper');
var styles = require('../utils/Styles');

export default class ImpianPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageId:1,
        }

    };
    componentDidMount(){
        const {pageId} = this.props;
        this.setState({
            pageId: pageId,
        });
    }
    render() {
        const { nav } = this.props;
        return (
            <View style={styles.box}>
                <View style={styles.boxListWhite2}>
                    <Text style={styles.btnTxtDefault}>Apa Impianmu?</Text>
                    <View style={styles.boxBody100White}>
                        <View style={{ flexDirection: 'row',marginBottom:5}}>
                            <TouchableOpacity style={styles.boxItem100White} onPress={() => nav('SimulasiInvestasi',{dream:'Rumah impian',pageId:this.state.pageId})} >
                                <View style={styles.boxIcon100White}>
                                    <Image source={require('../img/rumah.png')} style={styles.icon100White} />
                                </View>
                                <Text style={styles.boxTitle100White}>Rumah{"\n"}Impian</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.boxItem100White} onPress={() => nav('SimulasiInvestasi',{dream:'Mobil impian',pageId:this.state.pageId})} >
                                <View style={styles.boxIcon100White}>
                                    <Image source={require('../img/mobil.png')} style={styles.icon100White} />
                                </View>
                                <Text style={styles.boxTitle100White}>Mobil{"\n"}Impian</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.boxItem100White} onPress={() => nav('SimulasiInvestasi',{dream:'Tabungan pendidikan',pageId:this.state.pageId})} >
                                <View style={styles.boxIcon100White}>
                                    <Image source={require('../img/pendidikan.png')} style={styles.icon100White} />
                                </View>
                                <Text style={styles.boxTitle100White}>Tabungan{"\n"}Pendidikan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.boxItem100White} onPress={() => nav('SimulasiInvestasi',{dream:'Liburan impian',pageId:this.state.pageId})}>
                                <View style={styles.boxIcon100White}>
                                    <Image source={require('../img/keliling_dunia.png')} style={styles.icon100White} />
                                </View>
                                <Text style={styles.boxTitle100White}>Liburan{"\n"}Impian</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contenCenter}>
                            <AwesomeButton
                                borderRadius={10}
                                backgroundColor='#4F7942'
                                backgroundShadow="#000"
                                backgroundDarker="#45673a"
                                height={40}
                                width={GLOBAL.DEVICE_WIDTH*0.5+45}
                                onPress={() => nav('SimulasiInvestasi',{dream:'',pageId:this.state.pageId}) }
                            >
                            <Image source={require('./../img/btnLogin.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5+60,height:40,resizeMode:'stretch'}} />
                            <Text style={[{position: 'absolute'},styles.btnTextWhite]}>RENCANAKAN SEKARANG</Text>
                            </AwesomeButton>
                            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('SimulasiInvestasi',{dream:''}) } style={styles.btnLogin}>
                                <Text style={styles.btnTextWhite}>Rencanakan Sekarang</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </View>
                        
       );
    }
}

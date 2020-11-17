import React, { Component } from 'react';
import { Image, View, Text,Modal } from 'react-native';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');

export default class UnauthScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    }
    render() {
        const {visibleModal} = this.props;
        return (
          <View>
            <Modal animationType={"slide"} transparent={false} visible={visibleModal}>
            <View style={{justifyContent:'center',padding:10,alignItems:'center',backgroundColor:'#FFF',height:GLOBAL.DEVICE_HEIGHT}}>
              <Image source={require('../img/unauthorized.png')} style={{justifyContent:'center',alignSelf:'center',resizeMode:'contain',height:GLOBAL.DEVICE_HEIGHT*0.25}}/>
              <Text style={styles.btnTxtDefault}>Session Anda sudah tidak berlaku lagi{'\n'} silahkan login kembali</Text>
            </View>
          </Modal>
          </View>
          
        );
      }
    }
import React, { Component } from 'react';
import { Image, View, Text,Modal } from 'react-native';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');

export default class OfflineTemp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    }
    handleConnectionChange = isConnected => {
      this.setState({isConnected});
    }
    cobalagi(){
      NetInfo.isConnected.addEventListener('connectionChange',this.handleConnectionChange)
    }
    componentDidMount(){
      NetInfo.isConnected.addEventListener('connectionChange',this.handleConnectionChange)
    }
    componentWillUnmount(){
      NetInfo.isConnected.removeEventListener('connectionChange',this.handleConnectionChange)
    }
    render() {
        const {visibleModal} = this.props;
        return (
          <View>
            <Modal animationType={"slide"} transparent={false} visible={visibleModal}>
            <View style={{justifyContent:'center',padding:10,alignItems:'center',backgroundColor:'#FFF',height:GLOBAL.DEVICE_HEIGHT}}>
              <Image source={require('../img/no_connection.png')} style={{justifyContent:'center',alignSelf:'center',resizeMode:'contain',height:GLOBAL.DEVICE_HEIGHT*0.25}}/>
              <Text style={styles.btnTxtDefault}>Yah, koneksi internet Anda putus</Text>
              <TouchableOpacity style={styles.btnDefault} onPress={() => cobalagi()} >
                <Text style={styles.txtLittle}>Coba lagi</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          </View>
          
        );
      }
    }
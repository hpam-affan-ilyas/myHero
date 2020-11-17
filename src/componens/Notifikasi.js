
import React, { Component } from 'react';
import { Text,StatusBar, View,Image, TouchableOpacity, ScrollView, Modal,ActivityIndicator, Alert,RefreshControl,FlatList,BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButton from "react-native-really-awesome-button";
import renderIf from './Renderif';
import UnAuth from './UnauthPage';
import Icon from 'react-native-vector-icons/FontAwesome';
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');

class Notifikasi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dataNotif:[],
            myToken :'',
            limit:20,
            title:'',
            content:'',
            modalVisible:false,
        }
    };
    Unauthorized(){
      this.setState({ isLoading: false,modalVisibleUnAuth:true})
      setTimeout(()=> this.logout(),GLOBAL.timeOut);
    }

    logout = async () => {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Main')
    }
    manageRead(isRead,tipe){
      switch(tipe){
        case 'icon':
          if(isRead == 1){
            return "#4c669f";
          }else{
            return "#f4f228"
          }
          break;
        case 'text':
          if(isRead == 1){
            return "#808080"
          }else{
            return "#000";
          }
          break;
      }
    }
    onClickMessage(id,action,tanggal,pesan){
      this._getNotifRead(this.state.myToken,id);
      if(action != null){
        this.props.navigation.navigate(action);
      }
      this.setState({
        modalVisible:true,
        title:tanggal,
        content:pesan
      })
    }
    renderItem = ({item})=>{
      return(
        <View style={styles.box}>
          <View style={styles.boxListWhite2}>
            <TouchableOpacity onPress={()=> this.onClickMessage(item.id,item.action,item.tanggal,item.pesan) }>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Icon name="circle" size={14} style={{color:this.manageRead(item.status_read,'icon'),marginRight:5}}/>
                <Text style={{fontSize: 12,color: this.manageRead(item.status_read,'text'),fontWeight: '600'}}>{GLOBAL.convertTgl(item.tanggal.toString().slice(0,10)) }</Text>
              </View>
              <Text ref={item.id} style={{fontSize: 14,color: this.manageRead(item.status_read,'text'),fontWeight: '600'}}>{item.pesan}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    _getNotif(token,limit){
      this.setState({isLoading:true})
      fetch(GLOBAL.getNotifikasi(limit), {
        method: 'GET',
        headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
          'Authorization': token,
        },
      })
        .then((response) => {
          this.setState({isLoading:false})
          if (response.status == '201') {
            let res;
            return response.json().then(obj => {
              res = obj;
              this.setState({ dataNotif: res.data.notifikasi})
            })
          } else if (response.status == '401') {
            this.Unauthorized()
          }else{
            GLOBAL.gagalKoneksi()
          }
        })
        this.setState({isLoading:false})
    }

    _getNotifRead(token,idNotif){
      this.setState({isLoading:true})
      fetch(GLOBAL.notifikasiRead(), {
        method: 'POST',
        headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          id: idNotif
        })
      })
        .then((response) => {
          this.setState({isLoading:false})
          if (response.status == '201') {
            let res;
            return response.json().then(obj => {
              res = obj;
              this._getNotif(this.state.myToken,this.state.limit);

            })
          } else if (response.status == '401') {
            this.Unauthorized()
          }else{
            GLOBAL.gagalKoneksi()
          }
        })
        this.setState({isLoading:false})
    }
    viewMore(limit){
      var newLimit = limit*1+20;
      this.setState({limit: newLimit});
      this._onRefresh()
    }
    _onRefresh(){
      this.setState({refreshing:true});
      this._getToken().then(()=>{
          this.setState({refreshing:false})
      });
    }
    _getToken = async () => {
      var aksesToken = await AsyncStorage.getItem('aksesToken');
      if (aksesToken != null) {
        this.setState({ myToken: aksesToken });
        this._getNotif(this.state.myToken,this.state.limit);
      }else {
        this.Unauthorized()
      }
    }
    
    componentDidMount(){
      this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        this.props.navigation.goBack();
        return true;
      });
      return this._getToken()
        
    }
    componentWillUnmount() {
      this.backHandler.remove();
    }
    render() {
      const notif = this.state.dataNotif;
        return (
            <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
              <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
              <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}
                refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh.bind(this)}
                    />
                  } >
                   
                  {
                      this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
                  }
                 <View style={styles.containerMain}>
                    <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.dataNotif}
                    keyExtractor={(x,i)=>i}
                    renderItem={this.renderItem}
                    refreshControl={
                        <RefreshControl
                        refreshing = {this.state.refreshing}
                        onRefresh ={this._onRefresh.bind(this)}
                        />
                    }
                    />
                    {renderIf(notif.length >= this.state.limit)(
                      <TouchableOpacity onPress={()=> this.viewMore(this.state.limit)} style={{justifyContent:'center',alignItems:'center',marginBottom:10}}>
                        <Icon name="refresh" size={40} style={{color:"#FFF"}} />
                      </TouchableOpacity>
                    )}
                  </View>

              </ScrollView>
              {renderIf(this.state.modalVisibleUnAuth == true)(
                <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
              )}
              <Modal animationType={"slide"} transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({ modalVisible: false })}>
                    <View style={{justifyContent:'flex-start',flex:1,margin:15}}>
                        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>

                            <View>
                                <Image source={require('./../img/icon.png')} style={{ width: 30, height: 30, resizeMode: 'stretch' }} />
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                  <Icon name="circle" size={14} style={{color:this.manageRead(1,'icon'),marginRight:5}}/>
                                  <Text style={[styles.txtHeadBlack, { textAlign: 'justify', fontSize: 16 }]}>{GLOBAL.convertTgl(this.state.title.toString().slice(0,10)) }</Text>
                                </View>
                                
                                <View style={{ marginTop: 15, marginBottom: 15 }}>
                                  <Text style={[styles.txtLittleBlack, { textAlign: 'justify' }]}>{this.state.content}</Text>
                                </View>
                            </View>
                            <View style={[styles.boxBtnBottom,{marginTop:30}]}>
                                <AwesomeButton
                                    borderRadius={15}
                                    backgroundColor='#4F7942'
                                    backgroundShadow="#000"
                                    backgroundDarker="#45673a"
                                    height={40}
                                    width={GLOBAL.DEVICE_WIDTH * 0.5}
                                    onPress={() => this.setState({ modalVisible: false })}
                                >
                                    <Image source={require('./../img/btnLogin.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5, height: 40, resizeMode: 'stretch' }} />
                                    <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>KEMBALI</Text>
                                </AwesomeButton>
                            </View>
                        </ScrollView>

                    </View>
                </Modal>
            
            </LinearGradient>
        );
    }
}

export default Notifikasi;


import React, { Component } from 'react';
import { Text,TextInput, View,StatusBar, TouchableOpacity, ScrollView, Modal,ActivityIndicator, Alert,RefreshControl,FlatList,BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import AsyncStorage from '@react-native-community/async-storage';
import renderIf from './Renderif';
import UnAuth from './UnauthPage';
import Icon from 'react-native-vector-icons/FontAwesome';
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');

export default class NotifikasiInvest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dataNotif:[],
            myToken :'',
            modalVisibleUnAuth: false,
        }
    };
    Unauthorized(){
      this.setState({ isLoading: false,modalVisibleUnAuth:true})
                      setTimeout(()=> this.logout(),GLOBAL.timeOut);
  }
    deleteNotif(myId){
      Alert.alert('Sukses','Apakah Anda yakin? Notifikasi investasi tidak akan muncul bila daftar sudah dihapus',
                  [{text: 'OK', onPress: () => this.deleteNotifInvest(this.state.myToken,myId)}],
                  {cancelable: false},
              );
    }
    deleteNotifInvest(token,idNotif){
      fetch(GLOBAL.deleteNotifikasiInvestasi(), {
          method: 'POST',
          headers: {
            'Accept': 'appication/json',
            'Content-type': 'application/json',
            'Authorization': token
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
                Alert.alert('Sukses','Notifikasi investasi berhasil dihapus',
                            [{text: 'OK', onPress: () => this._onRefresh() }],
                            {cancelable: false},
                        );
              })
            } else if (response.status == '401') {
              this.Unauthorized()
            }else{
              GLOBAL.gagalKoneksi()
            }
          })
          this.setState({isLoading:false})
    }
    logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Main')
      }
      renderItem = ({item})=>{
        return(
          <View style={styles.box}>
          <View style={styles.boxListWhite2}>
              <View style={styles.boxBody100White}>
                <View style={[styles.boxHeadListWhiteRight,{marginBottom:10}]}>
                  <View style={{flexDirection:'row'}}>
                    <View style={{width:'90%',flexDirection:'row'}}>
                      <Icon name="bell-o" size={30} style={styles.colorIconInput} />
                      <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.txtBlackHead}>{item.tujuan_investasi}</Text>
                      </View>
                    </View>
                      <View style={{width:"10%",justifyContent: "flex-end", alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={() =>this.deleteNotif(item.id)}>
                          <Icon name="trash-o" size={25} style={styles.colorIconInput} />
                        </TouchableOpacity>
                      </View>
                  </View>
                </View>
                <View style={styles.boxContenListWhite}>
                  <View style={{ flexDirection: 'row', flex: 1, width: '100%'}}>
                    <View style={{ width: "50%" }}>
                      <Text style={styles.txtContenListWhite}>Nilai Investasi</Text>
                      <Text style={styles.txtBlackHead}>{GLOBAL.currency(item.nilai_investasi,'.',true)}</Text>
                      <Text style={styles.txtContenListWhite}>Produk</Text>
                      <Text style={styles.txtBlackHead} >{item.nama_produk}</Text>
                    </View>
                    <View style={{ width: "50%", justifyContent: "flex-end", alignItems: 'flex-end' }}>
                      <View style={{ flexDirection: "row", alignItems: 'center'}}>
                        <Icon name="calendar" size={20} style={[styles.colorIconInput,{ marginRight: 2 }]} />
                        <Text style={styles.txtContenListWhite}>Tanggal Notifikasi</Text>
                      </View>
                      <Text style={styles.txtBlackHead}>Setiap Tanggal {item.tgl_notifikasi}</Text>
                    </View>
                  </View>
                </View>
              </View>
  
          </View>
        </View>
        )
      }

      _getNotif(token){
        this.setState({isLoading:true})
        fetch(GLOBAL.listNotifikasiInvestasi(), {
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
          this._getNotif(this.state.myToken)
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
      const notifMap = notif.map((notif, key) => notif);
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
                        <TouchableOpacity style={{alignItems:'flex-end',flex:1,marginBottom:15}} onPress={()=>this.props.navigation.navigate('FormNotifInvest',{nilaiInvest:null,namaProduk:null})}>
                            <Icon name="plus-circle" style={{color:'#FFF'}} size={25}/>
                        </TouchableOpacity>
                    
                    {renderIf(notif.length < 1)(
                      <View style={styles.boxNoData}>
                        <Text style={styles.txtCenter}>Tidak ada daftar{'\n'}notifikasi investasi </Text>
                      </View>
                    )}
                    {/* <NotifikasiContent notifMap={notifMap} nav={navigate} /> */}
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
                    </View>
              </ScrollView>
              {renderIf(this.state.modalVisibleUnAuth == true)(
                <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
              )}
            </LinearGradient>
        );
    }
}
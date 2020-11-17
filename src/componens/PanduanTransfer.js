
import React, { Component } from 'react';
import { View,TouchableOpacity,Text,FlatList,Clipboard,Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButton from "react-native-really-awesome-button";
import renderIf from './Renderif';
var GLOBAL= require('../utils/Helper');
var styles = require('../utils/Styles');
var klik;

export default class PanduanTransfer extends Component{
    constructor(props){
      super(props);
      this.state = {
        myToken:'',
        dataPanduan:[],
        refreshing:false,
        isHidden:'',
        isMetode:'',
        kode_metode:'',
        nominal_beli:'',
      }
    }
    _onRefresh() {
      this.setState({ refreshing: true });
      this._getToken().then(() => {
        this.setState({ refreshing: false })
      });
    }
    
    getPanduanBayar(metode_bayar) {
      fetch(GLOBAL.panduanBayar(metode_bayar), {
        method: 'GET',
        headers: {
          'Accept': 'appication/json',
          'Content-type': 'application/json',
          'Authorization': this.state.myToken,
        },
      })
        .then((response) => {
          if (response.status == '201') {
            let res;
            return response.json().then(obj => {
              res = obj;
              this.setState({
                dataPanduan: res.data.panduan,
                isMetode:res.data.jenis,
              })
              if(res.data.panduan.length == 1){
                this.setState({isHidden:res.data.panduan[0].id})
              }
              
            })
          } else {
            GLOBAL.gagalKoneksi()
          }
        })
    }

    _getToken = async () => {
      var aksesToken = await AsyncStorage.getItem('aksesToken');
      const { metode } = this.props;
      const { nominal} = this.props;
      this.setState({kode_metode:metode,nominal_beli:nominal.toString()});
      // alert(aksesToken);
      if (aksesToken != null) {
        this.setState({ myToken: aksesToken });
        this.getPanduanBayar(metode);
      }
    }
    componentDidMount() {
      return this._getToken();
    }
    manageKlik(id){
        if(this.state.isHidden === id){
            this.setState({isHidden:''})
        }else{
            this.setState({isHidden:id})
        }
    }

    render(){
      const dataPanduan = this.state.dataPanduan
      const panduan = dataPanduan.map((dataPanduan, key) => dataPanduan);
        return(
            <View>
                  <Text style={styles.txtBlueMed}>Jumlah yang harus dibayar</Text>
                    
                  <View style={{width:'100%', flexDirection: "row",marginBottom:10, alignItems: "center", flex: 1 }}>
                      <View style={{width:'60%'}} >
                          <Text style={styles.txtBlueHeight}>Rp {GLOBAL.currency(this.state.nominal_beli,'.',true)}</Text>
                      </View>
                      <View style={{alignItems:'center',justifyContent:'flex-end',width:'40%',paddingRight:15}}>
                          <AwesomeButton
                              borderRadius={8}
                              backgroundColor="#00a95c"
                              backgroundDarker="#039251"
                              backgroundShadow="#000"
                              width={GLOBAL.DEVICE_WIDTH*0.4}
                              height={30}
                              style={{marginTop:10}}
                              onPress={() => Clipboard.setString(this.state.nominal_beli)}
                          >
                          <Image source={require('./../img/btnBeli.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.4,height:30,resizeMode:'stretch'}} />
                          <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SALIN NOMINAL</Text>
                          </AwesomeButton>
                      </View>
                  </View> 
                  <View style={styles.blueLine}/>
                  {panduan.map(panduan => (
                      <View>
                          <TouchableOpacity style={{width:'100%', flexDirection: "row", alignItems: "center", flex: 1 }} onPress={() => this.manageKlik(panduan.id) }>
                              <View style={{width:'95%'}} >
                                  <Text style={styles.txtBlueMed}>{panduan.title}</Text>
                              </View>
                              <View style={{width:'5%',alignItems:'flex-end'}}>
                                  <View style={{ justifyContent: "center", alignItems: "flex-end", width:'100%' }} >
                                      <Icon name={klik == panduan.id ? "ios-arrow-up":"ios-arrow-down"} size={20} style={styles.colorIconInput} />
                                  </View>
                              </View>
                            </TouchableOpacity>
                          {renderIf(this.state.isHidden== panduan.id)(
                              <ContentPanduan content={panduan.isi} />
                          )}
                          <View style={styles.blueLine}/>
                      </View>
                  ))}
            </View>
        )
        
    }
  }

class ContentPanduan extends Component{
    constructor(props){
      super(props);
      this.state = {
        contentPanduan:[],
        refreshing:false,
      }
    }
    _onRefresh() {
      this.setState({ refreshing: true });
      this._getToken().then(() => {
        this.setState({ refreshing: false })
      });
    }
  
    _getToken = async () => {
      const { content} = this.props;
        let content_data = [];
        var a = content.split('<br>');
        for(var i = 1;i <= a.length;i++){
            content_data.push({
                no: i,
                value:a[i-1],
            });
        }
      this.setState({contentPanduan: content_data})
    }
    componentDidMount() {
      return this._getToken();
    }

    render(){
        const data = this.state.contentPanduan;
        const dataConten = data.map((data, key) => data);
        return(
            <View style={{marginTop:10}}>
            {dataConten.map(dataConten => (
            <View style={{flexDirection:'row',paddingRight:15,paddingBottom:5}}>
                <Text style={styles.txtBlueLittle} >{dataConten.no}. </Text>
                <Text style={[styles.txtBlueLittle,{textAlign:'justify'}]} >{dataConten.value}</Text>
            </View>
            ))}
            </View>
        )
        
    }
  } 


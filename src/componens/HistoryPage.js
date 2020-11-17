import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, Modal,Platform, ActivityIndicator, RefreshControl, Animated, View, StatusBar, SafeAreaView, FlatList, BackHandler } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-material-dropdown';
import Timeline from 'react-native-timeline-flatlist';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIon from 'react-native-vector-icons/Ionicons';
import Unauth from './UnauthPage';
import renderIf from './Renderif';
import Renderif from './Renderif';
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');
var tglNow = new Date();
var mm = tglNow.getMonth() + 1;
var platform = Platform.OS;
var hariSebelumnya = new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000));
var newDate = tglNow.getDate() + '/' + mm + '/' + tglNow.getFullYear();
var mm2 = hariSebelumnya.getMonth() + 1;
var tglLastWeek = hariSebelumnya.getDate() + '/' + mm2 + '/' + hariSebelumnya.getFullYear();
var statusNasabah;

class HistoriStatusTransaksi extends Component{
  constructor(props){
    super(props);
    this.state = {
      myToken:'',
      dataHistori:[],
      refreshing:false,
    }
   
  }
  _onRefresh() {
    this.setState({ refreshing: true });
    this._getToken().then(() => {
      this.setState({ refreshing: false })
    });
  }

  _getHistoriStatus(token, idOrder) {
    fetch(GLOBAL.orderDetailStatus(idOrder), {
      method: 'GET',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
        'Authorization': token,
      },
    })
      .then((response) => {
        this.setState({ isLoading: false })
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            var count = Object.keys(res.data.histori).length;
            let data_histori = [];
            for (var i = 0; i < count; i++) {
                data_histori.push({
                    title: GLOBAL.convertTglFull(res.data.histori[i].tgl_status),
                    description: res.data.histori[i].keterangan+"\n"+res.data.histori[i].note,
                    lineColor: GLOBAL.StatusBarColor,
                    circleColor:res.data.histori[i].warna,
                });
            }
            this.setState({dataHistori: data_histori})
            
          })
        } else if (response.status == '401') {
          this.Unauthorized()
        } else {
          GLOBAL.gagalKoneksi()
        }
      })
  }
  _getToken = async () => {
    const { data } = this.props;
    var aksesToken = await AsyncStorage.getItem('aksesToken');
    if (aksesToken != null) {
      this.setState({ myToken: aksesToken })
      this._getHistoriStatus(this.state.myToken, data);
    } else {
     this.Unauthorized()
    }
  }
  componentDidMount() {
    return this._getToken();
  }
  render(){
    const histori = this.state.dataHistori
      return(
          <View>
           
            <Timeline
              data={this.state.dataHistori}
              titleStyle={{marginTop:-13,fontSize:13,color:GLOBAL.StatusBarColor}}
              descriptionStyle={{fontSize:16,color:"#000",fontWeight:platform == 'android'?'800':'600'}}
              showTime={false}
            />
          </View>
      )
      
  }
} 

class HistoryScreen extends React.Component {

  getDateCustome(tgl) {
    var a;
    if (tgl < 10) {
      a = '0' + tgl;
    } else {
      a = tgl;
    }
    return a
  }
  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(100) ;
    this.state = {
      backClickCount: 0,
      isToast:false,
      page:'History',
      isLoading: false,
      colorHeadBackGroud: ['#53e567', '#49c85a', '#39b54a'],
      isDateTimePickerVisibleA: false,
      isDateTimePickerVisibleB: false,
      dateSampai: newDate,
      dateDari: tglLastWeek,
      jenisTransaksi: null,
      dataHistory: [],
      refreshing: false,
      totPorto: "Rp 0",
      hasilKumulatif: "Rp 0",
      tglNab: "NAB per",
      colorHasilKumulatif: "#b9daOa",
      colorTotPorto: "#b9daOa",
      modalVisibleUnAuth: false,
      limit:20,
      isShowHistori:'',
    }
  }
  logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Main')
  }
  Unauthorized() {
    this.setState({ isLoading: false, modalVisibleUnAuth: true })
    setTimeout(() => this.logout(), GLOBAL.timeOut);
  }

  showDateTimePicker(isPicker) {
    switch (isPicker) {
      case '1':
        this.setState({ isDateTimePickerVisibleA: true });
        break;
      case '2':
        this.setState({ isDateTimePickerVisibleB: true });
        break;
    }
  };

  hideDateTimePicker(isPicker, isCancel) {
    switch (isPicker) {
      case '1':
        this.setState({ isDateTimePickerVisibleA: false });
        break;
      case '2':
        this.setState({ isDateTimePickerVisibleB: false });
        break;
    }
  };

  handleDatePickedA = date => {
    let dateChoosed = date;
    var getMM = dateChoosed.getMonth() + 1;
    let formatted_date = dateChoosed.getDate() + "/" + getMM + "/" + dateChoosed.getFullYear();
    // if(new Date(formatted_date) > new Date(this.state.dateSampai)){
    //   Alert.alert('Perhatian','Tanggal dari tidak boleh lebih dari tanggal sampai',
    //     [{text: 'OK', onPress: () => this.setState({isDateTimePickerVisibleA: false,dateDari: tglLastWeek})}],
    //     {cancelable: false},
    //   );
    // }else{
    this.setState({ dateDari: formatted_date, isDateTimePickerVisibleA: false });
    if (statusNasabah == 'aktif') {
      this._getHistory(this.state.myToken, formatted_date, this.state.dateSampai, this.state.jenisTransaksi,this.state.limit)
    }
    // }

  };
  handleDatePickedB = date => {
    let dateChoosedB = date;
    var getMMB = dateChoosedB.getMonth() + 1;
    let formatted_dateB = dateChoosedB.getDate() + "/" + getMMB + "/" + dateChoosedB.getFullYear()
    // if(new Date(formatted_dateB) < new Date(this.state.dateDari)){
    //   Alert.alert('Perhatian','Tanggal dari tidak boleh lebih dari tanggal sampai',
    //     [{text: 'OK', onPress: () => this.setState({isDateTimePickerVisibleB: false,dateSampai: newDate}) }],
    //     {cancelable: false},
    //   );
    // }else{
    this.setState({ dateSampai: formatted_dateB, isDateTimePickerVisibleB: false })
    if (statusNasabah == 'aktif') {
      this._getHistory(this.state.myToken, this.state.dateDari, formatted_dateB, this.state.jenisTransaksi,this.state.limit);
    }
    // }
  };
  onPressJenisTrans(value) {
    var a;
    if (value != null) {
      a = value
    } else {
      a = ''
    }
    this.setState({ jenisTransaksi: a })
    if (statusNasabah == 'aktif') {
      this._getHistory(this.state.myToken, this.state.dateDari, this.state.dateSampai, this.state.jenisTransaksi,this.state.limit)
    }

  }
  renderItem = ({ item }) => {
    let data_histori = [];
      data_histori.push({
        title: GLOBAL.convertTglFull(item.tgl_status),
        description: item.last_status,
        circleColor: item.status_transaksi =='expired' || item.status_transaksi =='reject'?'#de2a57':'#19297b',
      });
    return (
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
        <View style={styles.box}>
          <View style={styles.boxListWhite2}>
              <View style={{ width:"100%",
                justifyContent:'center',
                alignContent:'center',
                borderWidth: 1,
                borderRadius:10,
                padding:10,
                backgroundColor:'#FFF',
                flex:1,
                shadowColor:'#efefef',
                shadowOffset:{width:0,height:-2},
                shadowOpacity:0.8,
                shadowRadius:2,
                borderLeftColor: item.kode_warna,
                borderLeftWidth: 3,
                borderTopColor: item.kode_warna,
                borderTopWidth: 3,
                borderRightColor: "#dddddd",
                borderRightWidth: 1, 
                borderBottomColor: "#dddddd", 
                borderBottomWidth: 1 }}>
                <View style={styles.boxHeadListWhiteRight}>
                  <View style={{flexDirection:'row'}}>
                    <View style={{ flexDirection: 'row',width:'75%' }} >
                      <Image source={{ uri: item.link_logo }} style={styles.img30} />
                      <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.txtBlackHead}>{item.nama_produk}</Text>
                      </View>
                    </View>
                    <View style={{ width: "25%",justifyContent: 'center',alignItems:'flex-end'}}><Text style={{color:GLOBAL.myBackground(item.tipe),fontSize:14,fontWeight:'400',textAlign:'right'}} >{GLOBAL.manageTipeTransaksi(item.tipe)}</Text></View>
                  </View>
                </View>
                <View style={styles.boxContenListWhite}>
                  <View style={{ flexDirection: 'row', flex: 1, width: '100%', marginBottom: 10 }}>
                    <View style={{ width: "50%" }}>
                      <Text style={styles.txtBlackHead}>{GLOBAL.currencyByTipeTrans(item.nominal, item.unit, item.tipe,item.status_transaksi, '.')}</Text>
                      {/* <Text style={styles.txtContenListWhite}>Status</Text>
                      <Text style={{ color: GLOBAL.colorStatus(item.status_transaksi), fontSize: 14, fontWeight: '400' }} >{GLOBAL.manageStatus(item.status_transaksi, item.tipe, item.flag_upload)}</Text> */}
                    </View>
                    <View style={{ width: "50%", justifyContent: "flex-end", alignItems: 'flex-end' }}>
                      <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <Icon name="calendar" size={20} style={[styles.colorIconInput,{ marginRight: 2 }]} />
                        <Text style={styles.txtBlueLittle}>{GLOBAL.convertTgl(item.created_at)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.blueLine} />
                  <View style={{width:'100%', flexDirection: "row", alignItems: "center", flex: 1 }}>
                      <View style={{width:'95%'}} >
                          <Text style={styles.txtBlueMed}>Status</Text>
                      </View>
                      <View style={{width:'5%',alignItems:'flex-end'}}>
                          <TouchableOpacity style={{ justifyContent: "center", alignItems: "flex-end", width:'100%' }} onPress={() =>{this.state.isShowHistori == item.id? this.setState({isShowHistori: ''}): this.setState({isShowHistori: item.id})} } >
                              <IconIon name={this.state.isShowHistori == item.id ? "ios-arrow-up":"ios-arrow-down"} size={20} style={styles.colorIconInput} />
                          </TouchableOpacity>
                      </View>
                  </View> 
                  {renderIf(this.state.isShowHistori == item.id)(
                      <View>
                          <HistoriStatusTransaksi data={item.id} />
                      </View>
                  )}
                  {renderIf(this.state.isShowHistori != item.id)(
                      <View>
                          <Timeline
                            data={data_histori}
                            titleStyle={{marginTop:-13,fontSize:13,color:GLOBAL.StatusBarColor}}
                            descriptionStyle={{fontSize:16,color:"#000",fontWeight:platform == 'android'?'800':'600'}}
                            showTime={false}
                          />
                      </View>
                  )}
                </View>
              </View>
  
          </View>
        </View>
      </ScrollView>
    )
  }
  _onRefresh() {
    this.setState({ refreshing: true });
    this._getToken().then(() => {
      this.setState({ refreshing: false })
    });
  }
  _getHistory = async (token, dateDari, dateSampai, jenisTransaksi,limit) => {
    this.setState({ isLoading: true})
    if (typeof dateDari == "undefined" || dateDari == null) return "";
    if (typeof dateSampai == "undefined" || dateSampai == null) return "";
    var dateX = ''; var dateY = ''; var tipeTrans = '';
    if (dateDari != null) {
      var formatDate = dateDari.split('/');
      var bulan = this.getDateCustome(formatDate[1]);
      var day = this.getDateCustome(formatDate[0]);
      dateX = formatDate[2] + '-' + bulan + '-' + day;
    }
    if (dateSampai != null && dateSampai != '') {
      var formatDate = dateSampai.split('/');
      var bulan = this.getDateCustome(formatDate[1]);
      var day = this.getDateCustome(formatDate[0]);
      dateY = formatDate[2] + '-' + bulan + '-' + day;
    }
    if (jenisTransaksi != null) {
      switch (jenisTransaksi) {
        case 'Pembelian':
          tipeTrans = 'SUB'
          break;
        case 'Penjualan':
          tipeTrans = 'RED'
          break;
        case 'Semua':
          tipeTrans = ''
          break;
      }
    }
    fetch(GLOBAL.histori(dateX, dateY, tipeTrans,limit), {
      method: 'GET',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
        'Authorization': token,
      },
    })
      .then((response) => {
        this.setState({ isLoading: false })
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            this.setState({ dataHistory: res.data.order })
          })
        } else if (response.status == '401') {
          this.setState({ isLoading: false })
          this.Unauthorized()
        } else {
          this.setState({ isLoading: false })
          GLOBAL.gagalKoneksi()
        }
      })
    this.setState({ isLoading: false })
  }

  viewMore(limit){
    var newLimit = limit*1+20;
    this.setState({limit: newLimit});
    this._onRefresh()
  }

  _getToken = async () => {
    // console.log('App started in', initialMode, 'mode')
    var aksesToken = await AsyncStorage.getItem('aksesToken');
    statusNasabah = await AsyncStorage.getItem('statusNasabah');
    if (aksesToken != null) {
      this.setState({ myToken: aksesToken })
      if (statusNasabah == 'aktif') {
        this._getHistory(this.state.myToken, '', '', '',this.state.limit);
      }

    } else {
      this.Unauthorized()
    }
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.handleBackButton.bind(this) );
    return this._getToken();
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  _spring() {
    this.setState({backClickCount: 1}, () => {
        Animated.sequence([
            Animated.spring(
                this.springValue,
                {
                    toValue: -.15,
                    friction: 5,
                    duration: 300,
                    useNativeDriver: true,
                }
            ),
            Animated.timing(
                this.springValue,
                {
                    toValue: 100,
                    duration: 300,
                    useNativeDriver: true,
                }
            ),

        ]).start(() => {
            this.setState({backClickCount: 0});
        });
    });

}
handleBackButton = () => {
  if(this.state.backClickCount < 1){
      if(this.props.navigation.state.routeName == "HomeScreen"){
          this.setState({isToast:true});
          setTimeout(()=>this.setState({isToast:false}),500)
      }
      this.props.navigation.navigate('Home');
      this._spring()
  }else{
      this.setState({isToast:false});
      BackHandler.exitApp()
  }
  return true;
};
  render() {
    const history = this.state.dataHistory;
    let data = [{ value: 'Semua' }, { value: 'Penjualan' }, { value: 'Pembelian' }];
    return (
      <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
        <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
        {renderIf(this.state.isToast == true)(
              <View style={[styles.wrapper,{justifyContent:'center',alignItems:'center',position:'absolute',zIndex:2}]}>
                  <View style={{height:100,width:"80%",borderWidth:2,borderColor:"#dddddd",backgroundColor:'#eFeFeF',justifyContent:'center',alignItems:'center',borderRadius:20}}>
                      <Text style={{textAlign:'center',color:'#000',fontSize:16,fontWeight:'600'}}>Klik dua kali untuk keluar</Text>
                  </View>
              </View>
          )}
        <View style={styles.containerMain}>
          <View style={{marginBottom:5}}>
            <View style={styles.inputGroup} >
              <View style={{ flexDirection: 'row' }} >
                <TouchableOpacity style={{ width: '50%', marginRight: 10 }} onPress={this.showDateTimePicker.bind(this, '1')}>
                  <Text style={styles.labelText}>Dari</Text>
                  <View style={styles.textInputGroup} >
                    <View style={styles.iconGroupLeft} >
                      <Icon name="calendar" size={20} style={styles.colorIconInput}/>
                    </View>
                    <Text style={styles.textInput}>{this.state.dateDari}</Text>
                    <DateTimePicker
                      isVisible={this.state.isDateTimePickerVisibleA}
                      onConfirm={this.handleDatePickedA}
                      onCancel={this.hideDateTimePicker.bind(this, '1')}
                      datePickerContainerStyleIOS={{backgroundColor:'#3676c2'}}
                      cancelButtonContainerStyleIOS={{backgroundColor:'#3676c2'}}
                      titleStyle={{color:'#FFF'}}
                      confirmTextStyle={{color:'#FFF'}}
                      cancelTextStyle={{color:'#FFF'}}
                    />
                  </View>
                </TouchableOpacity>
                <View style={{ width: '50%'}} >
                  <Dropdown
                    label='Jenis Transaksi'
                    textColor='#FFF'
                    itemColor='#000'
                    baseColor='#FFF'
                    selectedItemColor='#000'
                    onChangeText={(jenisTransaksi) => { this.onPressJenisTrans(jenisTransaksi) }}
                    data={data} />
                </View>
              </View>
            </View>
            <View style={styles.inputGroup} >
              <TouchableOpacity style={{ width: '50%',marginRight:10 }} onPress={this.showDateTimePicker.bind(this, '2')}>
                <Text style={styles.labelText}>Sampai</Text>
                <View style={styles.textInputGroup} >
                  <View style={styles.iconGroupLeft} >
                    <Icon name="calendar" size={20} style={styles.colorIconInput}/>
                  </View>
                  <Text style={styles.textInput}>{this.state.dateSampai}</Text>
                  <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisibleB}
                    onConfirm={this.handleDatePickedB}
                    onCancel={this.hideDateTimePicker.bind(this, '2')}
                    datePickerContainerStyleIOS={{backgroundColor:'#3676c2'}}
                    cancelButtonContainerStyleIOS={{backgroundColor:'#3676c2'}}
                    titleStyle={{color:'#FFF'}}
                    confirmTextStyle={{color:'#FFF'}}
                    cancelTextStyle={{color:'#FFF'}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
            {
              this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
            }
            {/* <ContenHistoryList historyMap= {historyMap}/> */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >
            {renderIf(history.length < 1)(

              <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <Text style={styles.txtHeight}>Tidak ada data transaksi {this.state.myDate}</Text>
                <Image source={require('../img/no_activity.png')} style={{ width: '100%', height: GLOBAL.DEVICE_HEIGHT * 0.25, resizeMode: 'contain', justifyContent: 'flex-end' }} />
              </View>
            )}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.dataHistory}
              keyExtractor={(x, i) => i}
              renderItem={this.renderItem}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }
            />
            {renderIf(history.length >= this.state.limit)(
              <TouchableOpacity onPress={()=> this.viewMore(this.state.limit)} style={{justifyContent:'center',alignItems:'center',marginBottom:10}}>
                <Icon name="refresh" size={40} style={{color:"#FFF"}} />
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
        {renderIf(this.state.modalVisibleUnAuth == true)(
          <Unauth visibleModal={this.state.modalVisibleUnAuth} />
        )}
      </LinearGradient>
    );
  }
}

export default HistoryScreen;

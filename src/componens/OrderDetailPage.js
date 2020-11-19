
                    // {renderIf(this.state.tipe != 'SWTIN' || this.state.tipe != 'SWTOUT') (
                        
                    //   )}
import React, { Component } from 'react';
import { Image, TouchableOpacity,Platform, Text, StatusBar,Clipboard , View, SafeAreaView, Alert, Modal, ActivityIndicator, FlatList, RefreshControl,BackHandler } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButton from "react-native-really-awesome-button";
import CountDown from 'react-native-countdown-component';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIon from 'react-native-vector-icons/Ionicons';
import ImageResizer from 'react-native-image-resizer';
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');
import UnAuth from './UnauthPage';
import PanduanBayar from './PanduanTransfer';
import renderIf from './Renderif';

var platform = Platform.OS;
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

  _getHistoriStatus(token, idOrder,status,tipe,flag_upload,metode) {
    fetch(GLOBAL.orderDetailStatus(idOrder), {
      method: 'GET',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'application/json',
        'Authorization': token,
      },
    }).then((response) => {
        this.setState({ isLoading: false })
        if (response.status == '201') {
          let res;
          return response.json().then(obj => {
            res = obj;
            var count = Object.keys(res.data.histori).length;
            let data_histori = [];
            var method = metode.split("-");
            if(method[0] == "VA" && tipe =="SUB"){
              this.setState({
                dataHistori:[
                  {
                    title: GLOBAL.convertTglFull(res.data.histori[0].tgl_status),
                    description: res.data.histori[0].keterangan,
                    lineColor: res.data.histori[0].kode_history_id == status? '#dcdcdc':'#19297b',
                    circleColor:res.data.histori[0].kode_history_id == status? '#E1AD01':'#19297b',
                  },
                  {
                    title: res.data.histori[1].tgl_status == null ? "-": GLOBAL.convertTglFull(res.data.histori[1].tgl_status),
                    description: res.data.histori[1].keterangan == null?"Pembelian sedang diverifikasi":res.data.histori[1].keterangan,
                    lineColor: res.data.histori[1].kode_history_id == status? '#dcdcdc':'#19297b',
                    circleColor:res.data.histori[1].kode_history_id == status? '#E1AD01':'#19297b',
                  },
                  {
                    title: "-",
                    description: "Pembelian berhasil",
                    lineColor: '#dcdcdc',
                    circleColor:'#dcdcdc',
                  }
                ]
              })
            }else if(method[0] == "M" && tipe =="SUB"){
              this.setState({
                dataHistori:[
                  {
                    title: GLOBAL.convertTglFull(res.data.histori[0].tgl_status),
                    description: res.data.histori[0].keterangan,
                    lineColor: res.data.histori[0].kode_history_id == status? '#dcdcdc':'#19297b',
                    circleColor:res.data.histori[0].kode_history_id == status? '#E1AD01':'#19297b',
                  },
                  {
                    title: res.data.histori[1].tgl_status == null ? "-": GLOBAL.convertTglFull(res.data.histori[1].tgl_status),
                    description: res.data.histori[1].keterangan == null ?"Pembayaran sudah diterima":res.data.histori[1].keterangan,
                    lineColor: res.data.histori[1].kode_history_id == status? '#dcdcdc':'#19297b',
                    circleColor:res.data.histori[1].kode_history_id == status? '#E1AD01':'#19297b',
                  },
                  {
                    title: "-",
                    description: "Pembelian berhasil",
                    lineColor: '#dcdcdc',
                    circleColor:'#dcdcdc',
                  }
                ]
              })
            }else if(tipe =="RED"){
              this.setState({
                dataHistori:[
                  {
                    title: GLOBAL.convertTglFull(res.data.histori[0].tgl_status),
                    description: res.data.histori[0].keterangan,
                    lineColor: res.data.histori[0].kode_history_id == status? '#dcdcdc':'#19297b',
                    circleColor:res.data.histori[0].kode_history_id == status? '#E1AD01':'#19297b',
                  },
                  {
                    title: res.data.histori[1].tgl_status == null ? "-": GLOBAL.convertTglFull(res.data.histori[1].tgl_status),
                    description: res.data.histori[1].keterangan == null ?"Penjualan berhasil":res.data.histori[1].keterangan,
                    lineColor: res.data.histori[1].kode_history_id == status? '#dcdcdc':'#19297b',
                    circleColor:res.data.histori[1].kode_history_id == status? '#E1AD01':'#19297b',
                  },
                  {
                    title: "-",
                    description: "Penjualan berhasil\nDana akan diterima dalam 3-7 hari kerja",
                    lineColor: '#dcdcdc',
                    circleColor:'#dcdcdc',
                  }
                ]
              })
            }
            
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
    const { status } = this.props;
    const { tipe } = this.props;
    const { flag_upload } = this.props;
    const { metode } = this.props;
    var aksesToken = await AsyncStorage.getItem('aksesToken');
    if (aksesToken != null) {
      this.setState({ myToken: aksesToken })
      this._getHistoriStatus(this.state.myToken, data,status,tipe,flag_upload,metode);
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

export default class OrderDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      idOrder: null,
      dataOrder: [],
      historiStatusTrans:[],
      refreshing: false,
      colorHeadBackGroud: ['#53e567', '#49c85a', '#39b54a'],
      txtHead: "PEMBELIAN",
      totPorto: "Rp 0",
      hasilKumulatif: "Rp 0",
      tglNab: "NAB per",
      colorHasilKumulatif: "#b9daOa",
      colorTotPorto: "#b9daOa",
      myDate: "",
      imgBukti: '',
      myToken: '',
      modalVisibleUnAuth: false,
      isShowHistori:false,

      namaProduk:'',
      idProduk:'',
      logoProduk:'',
      kodeWarna:'#0a4c98',
      jenisProduk:'',
      logoBank:'',
      noRekening:'',
      namaRekening:'',
      nominal:'',
      unit:'',
      kodeMetodeBayar:'',
      metodeBayar:'',
      idTransaksi:'',
      statusTransaksi:'',
      tipe:'',
      flagUpload:'',
      tglCreated:'',
      tglExpired:'',
      waktuSisa:'',
      lastStatus:'',
      warnaStatus:'',
      idStatus:'',
      tglStatus:'',
      dataHistori:[],
      kodeKetentuan:'SUB-VA-CIMB',
      headerMetodeBayar:'',
      fitureUpload:false,
      fitureNamaRek:false,
      isi:[],
      title:'',

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
  batasMaks(value, tgl) {
    if (typeof value == "undefined" || value == null) return 0;
    if (typeof tgl == "undefined" || tgl == null) return " ";
    var a = tgl.toString().replace(' ', '-').split('-');
    var b = a[0] + '/' + a[1] + '/' + a[2];
    var c = new Date(b);
    var d = a[3].split(':');
    c.setDate(c.getDate() + value);
    var dd = c.getDate();
    var mm = c.getMonth() + 1;
    var yy = c.getFullYear();
    var bulan;
    var day;
    if (dd.toString().length = 1) {
      day = '0' + dd;
    }

    switch (mm) {
      case 1:
        bulan = 'Jan'
        break;
      case 2:
        bulan = 'Feb'
        break;
      case 3:
        bulan = 'Maret'
        break;
      case 4:
        bulan = 'April'
        break;
      case 5:
        bulan = 'Mei'
        break;
      case 6:
        bulan = 'Juni'
        break;
      case 7:
        bulan = 'Juli'
        break;
      case 8:
        bulan = 'Agustus'
        break;
      case 9:
        bulan = 'Sep'
        break;
      case 10:
        bulan = 'Okt'
        break;
      case 11:
        bulan = 'Nov'
        break;
      case 12:
        bulan = 'Des'
        break;
    }
    var result = day + ' ' + bulan + ' ' + yy + ' ' + d[0] + ':' + d[1];
    return result;
  }
  selectImage() {
    var option = { title: 'Pilih Gambar',cancelButtonTitle:'Batal',maxWidth:GLOBAL.maxWidthUploadImage,maxHeight:GLOBAL.maxHeightUploadImage,quality:1, storageOption: { skipBackup: true, path: 'images' }, takePhotoButtonTitle: 'Kamera', chooseFromLibraryButtonTitle: 'Galeri' };
    ImagePicker.showImagePicker(option, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        alert(response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // You can also display the image using data:
        // const source = 'data:image/jpeg;base64,' + response.data;
        // if(platform== 'android' && response.width > 720){
        //   var newWidth = response.width*50/100;
        //   var newHeight = response.height*50/100;
        //   ImageResizer.createResizedImage(uri, newWidth, newHeight, "JPEG", 50, rotation = 0).then((res) => {
        //     // response.uri is the URI of the new image that can now be displayed, uploaded...
        //     // response.path is the path of the new image
        //     // response.name is the name of the new image with the extension
        //     // response.size is the size of the new image
        //     this.setState({ imgBukti: res.uri });
        //   }).catch((err) => {
        //     // Oops, something went wrong. Check that the filename is correct and
        //     // inspect err to get more details.
        //     alert(err)
        //   });
        // }else{
          this.setState({ imgBukti: response.uri });
        // }
      }
    });
  }
  _uploadImg(token, idOrder, img) {
    let dataUpload = new FormData();
    var imgName = 'imgBuktiTransfer' + idOrder;
    dataUpload.append('bukti_transfer', { uri: img, type: 'image/jpeg', name: imgName })
    dataUpload.append('id', idOrder)
    this.setState({isLoading:true})
    fetch(GLOBAL.uploadBukti(), {
      method: 'POST',
      headers: {
        'Accept': 'appication/json',
        'Content-type': 'multipart/form-data',
        'Authorization': token,
      },
      body: dataUpload
    })
    .then((response) => {
      console.log('Upload Bukti Response', response);
      if (response.status == '201') {
        this.setState({isLoading:false});
        Alert.alert('Sukses', 'Upload bukti transfer sukses',
          [{ text: 'OK', onPress: () => this.props.navigation.navigate('Order') }],
          { cancelable: false },
        );
      } else if (response.status == '401') {
        this.setState({isLoading:false});
        this.Unauthorized()
      } else if (response.status == '400') {
        this.setState({isLoading:false});
        let res;
        return response.json().then(obj => {
          res = obj;
          Alert.alert('Gagal', '' + res.message,
            [{ text: 'OK', onPress: () => console.log('Ok pressed') }],
            { cancelable: false },
          );
        })
      } else {
        this.setState({isLoading:false});
        GLOBAL.gagalKoneksi()
      }
    })
    this.setState({isLoading:false});
  }
  goActUpload(idOrder) {
    console.log('idOrder', idOrder);
    if (this.state.imgBukti.length == 0) {
      Alert.alert('Perhatian', 'Bukti transfer harus diisi',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    } else {
      this._uploadImg(this.state.myToken, idOrder, this.state.imgBukti)
    }
  }
  countDown(timeX) {
    var result;
    if (timeX != null) {
      var times = timeX.split(':');
      var s = times[5] * 1;
      var m = times[4] * 60;
      var h = times[3] * 60 * 60;
      var d = times[2] * 24 * 60 * 60;
      result = d + h + m + s;
    } else {
      result = 0
    }
    return result;
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this._getToken().then(() => {
      this.setState({ refreshing: false })
    });
  }
  _getOrderDetail(token, idOrder) {
    fetch(GLOBAL.orderDetail(idOrder), {
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
            let data_histori = [];
            data_histori.push({
                title: GLOBAL.convertTglFull(res.data.tgl_status),
                description: res.data.last_status,
                circleColor: '#E1AD01',
            });
            this.setState({ 
              namaProduk: res.data.nama_produk,
              idProduk:res.data.idProduk,
              logoProduk:res.data.logo_produk,
              jenisProduk:res.data.jenis_produk,
              kodeWarna:res.data.kode_warna,
              logoBank:res.data.link_logo,
              noRekening:res.data.nomor_rekening,
              namaRekening:res.data.nama_rekening,
              nominal:res.data.nominal,
              unit:res.data.unit,
              kodeMetodeBayar:res.data.kode_metode_bayar,
              metodeBayar:res.data.metode_bayar,
              idTransaksi:res.data.id,
              statusTransaksi:res.data.status_transaksi,
              tipe:res.data.tipe,
              flagUpload:res.data.flag_upload,
              tglCreated:res.data.created_at,
              tglExpired:res.data.expired_at,
              waktuSisa:res.data.waktu_sisa,
              lastStatus:res.data.last_status,
              warnaStatus:res.data.warna,
              idStatus:res.data.id_status,
              tglStatus:res.data.tgl_status,
              dataHistori:data_histori,
              headerMetodeBayar:res.data.header_metode_bayar,
              fitureUpload:res.data.fiture_upload_bukti_transfer,
              fitureNamaRek:res.data.fiture_nama_rekening,
              kodeKetentuan:res.data.kode_ketentuan,
              switching: res.data.switching
            });
            // alert(this.state.kodeKetentuan)
            this.getKetentuanTrans(this.state.kodeKetentuan);
          })
        } else if (response.status == '401') {
          this.Unauthorized()
        } else {
          GLOBAL.gagalKoneksi()
        }
      })
  }

  getKetentuanTrans(tipe) {
    fetch(GLOBAL.ketentuanTransaksi(tipe), {
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
                var content = res.data.isi;
                let content_data = [];
                var a = content.split('<br>');
                for(var i = 1;i <= a.length;i++){
                    content_data.push({
                        no: i,
                        value:a[i-1],
                    });
                }
                this.setState({
                    title: res.data.title,
                    isi: content_data
                })
            
            })
        } else {
            GLOBAL.gagalKoneksi()
        }
        })
    }

  _getToken = async () => {
    var aksesToken = await AsyncStorage.getItem('aksesToken');
    const { params } = this.props.navigation.state;
    if (params.id != null) {
      this.setState({ idOrder: params.id })
    }
    if (aksesToken != null) {
      this.setState({ myToken: aksesToken })
      this._getOrderDetail(this.state.myToken, this.state.idOrder);
    } else {
     this.Unauthorized()
    }
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack();
      return true;
  });
    return this._getToken();
  }
  componentWillUnmount() {
    this.backHandler.remove();
}
  render() {
    const ketentuan = this.state.isi;
    const dataKetentuan = ketentuan.map((ketentuan, key) => ketentuan);
    return (
      <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
        <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
          {
            this.state.isLoading && <Modal transparent={true}><View style={styles.loadingStyle}><ActivityIndicator size="large" color="#C1FF33" /></View></Modal>
          }
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
            <View style={styles.containerMain}>
              <View style={styles.box}>
                <View style={styles.boxListWhite2}>
                  <View style={{ width:"100%",
                    justifyContent:'center',
                    alignContent:'center',
                    borderWidth: 1,
                    borderColor: "#dddddd",
                    borderRadius:10,
                    padding:10,
                    backgroundColor:'#FFF',
                    flex:1,
                    shadowColor:'#efefef',
                    shadowOffset:{width:0,height:-2},
                    shadowOpacity:0.8,
                    shadowRadius:2,
                    borderLeftColor: this.state.kodeWarna,
                    borderLeftWidth: 3,
                    borderTopColor:this.state.kodeWarna,
                    borderTopWidth: 3,
                    borderRightColor: "#dddddd",
                    borderRightWidth: 1, 
                    borderBottomColor: "#dddddd", 
                    borderBottomWidth: 1 }}
                  >
                    <View style={styles.boxHeadListWhiteRight}>
                      <View style={{flexDirection:'row'}}>
                        <View style={{ flexDirection: 'row',width:'75%' }} >
                          <Image source={{ uri: this.state.logoProduk}} style={styles.img30} />
                          <View style={{ justifyContent: 'center' }}>
                            <Text style={styles.txtBlackHead}>{this.state.namaProduk}</Text>
                          </View>
                        </View>
                        <View style={{ width: "25%",justifyContent: 'center',alignItems:'flex-end'}}><Text style={{color:GLOBAL.myBackground(this.state.tipe),fontSize:14,fontWeight:'400',textAlign:'right'}} >{GLOBAL.manageTipeTransaksi(this.state.tipe)}</Text></View>
                      </View>
                    </View>
                    <View style={styles.boxContenListWhite}>
                      <View style={{ flexDirection: 'row', flex: 1, width: '100%', marginBottom: 10 }}>
                        <View style={{ width: "50%",justifyContent:'center',flex:1}}>
                          <Text style={styles.txtBlackHead3}>{GLOBAL.currencyByTipeTrans(this.state.nominal, this.state.unit, this.state.tipe, '.')}</Text>
                        </View>
                        <View style={{ width: "50%",alignContent:'flex-end',alignItems:'flex-end' }}>
                          {renderIf(this.state.tipe == 'SUB' && this.state.statusTransaksi == 'pending' && this.state.flagUpload != 'sudah')(
                            <View style={{marginBottom:10}}>
                              <Text style={[styles.txtRedLittle,{textAlign:'right'}]}>Batas Waktu</Text>
                              <View style={{ flexDirection: "row" }}>
                                <Icon name="clock-o" size={20} style={{ alignItems: 'flex-start', margin: 2 ,color: '#1CC625'}} />
                                <CountDown
                                  size={9}
                                  until={this.countDown(this.state.waktuSisa)}
                                  onFinish={() => this._onRefresh.bind(this)}
                                  digitStyle={{ backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625' }}
                                  digitTxtStyle={{ color: '#1CC625' }}
                                  timeLabelStyle={{ color: 'red', fontWeight: 'bold', fontSize: 10 }}
                                  separatorStyle={{ color: '#1CC625' }}
                                  timeToShow={['H', 'M', 'S']}
                                  timeLabels={{ h: '', m: '', s: '' }}
                                  showSeparator
                                />
                              </View>
                            </View>
                          )}
                          <View style={{ flexDirection: "row", alignItems: 'center' }}>
                            <Icon name="calendar" size={20} style={[styles.colorIconInput,{ marginRight: 2 }]} />
                            <Text style={styles.txtBlueLittle}>{GLOBAL.convertTgl(this.state.tglCreated)}</Text>
                          </View>
                        </View>
                      </View>  
                      <View style={styles.blueLine} />
                        <View style={{width:'100%', flexDirection: "row", alignItems: "center", flex: 1 }}>
                          <View style={{width:'95%'}} >
                              <Text style={styles.txtBlueMed}>Status</Text>
                          </View>
                          {renderIf(this.state.idStatus != 1)(
                          <View style={{width:'5%',alignItems:'flex-end'}}>
                              <TouchableOpacity style={{ justifyContent: "center", alignItems: "flex-end", width:'100%' }} onPress={() => this.setState({isShowHistori: !this.state.isShowHistori})} >
                                  <IconIon name={this.state.isShowHistori == true ? "ios-arrow-up":"ios-arrow-down"} size={20} style={styles.colorIconInput} />
                              </TouchableOpacity>
                          </View>
                          )}
                        </View> 
                        {renderIf(this.state.isShowHistori == true)(
                          <View>
                              <HistoriStatusTransaksi data={this.state.idTransaksi} status={this.state.idStatus} tipe={this.state.tipe} flag_upload={this.state.flagUpload} metode={this.state.kodeMetodeBayar} />
                          </View>
                        )}
                        {renderIf(this.state.isShowHistori == false)(
                          <View>
                              <Timeline
                                data={this.state.dataHistori}
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
                <View style={{marginBottom:10}}>
                  <Text style={styles.txtMed}>{this.state.title}</Text>
                  {dataKetentuan.map(dataKetentuan => (
                    <View style={{ flexDirection: 'row',paddingLeft:10,paddingRight:10 }}>
                        <Text style={styles.txtLittle}>{dataKetentuan.no}. </Text>
                        <Text style={[styles.txtLittle,{textAlign:'justify'}]}>{dataKetentuan.value}</Text>
                    </View>
                  ))}
                </View>         
                <View style={!this.state.switching && styles.boxWhite}>
                  <Text style={!this.state.switching && styles.txtBlueLittle}>{!this.state.switching && this.state.headerMetodeBayar}</Text>
                  <View style={!this.state.switching && {flexDirection:'row',alignItems:'center',width:'100%',paddingRight:5}}>
                    <View style={!this.state.switching && {width:'80%',flexDirection:'row',alignItems:'center'}}>
                      <Image source={!this.state.switching && {uri:this.state.logoBank}} style={{ width:80, height: 50, resizeMode: "stretch" }}/>
                      <View style={!this.state.switching && {width:1,height:30,borderColor:'#415566',borderWidth:0.5,marginRight:10,marginLeft:10}}/>
                        <Text style={!this.state.switching && styles.txtBlueMed}>{!this.state.switching && this.state.noRekening}</Text>
                      </View>
                      <View style={!this.state.switching && {alignItems:'center',justifyContent:'flex-end',width:'20%'}}>
                        {renderIf(!this.state.switching)(
                          <AwesomeButton
                          borderRadius={8}
                          backgroundColor="#00a95c"
                          backgroundDarker="#039251"
                          backgroundShadow="#000"
                          width={80}
                          height={30}
                          style={{marginTop:10}}
                          onPress={() => Clipboard.setString(this.state.noRekening)}>
                            {renderIf(!this.state.switching) (
                              <Image source={!this.state.switching && require('./../img/btnBeli.png')} style={!this.state.switching && [styles.btnBeliLittleTemp,{resizeMode:'stretch'}]} />
                            )}
                          <Text style={!this.state.switching && [{position: 'absolute'},styles.btnTextWhite]}>{!this.state.switching && 'SALIN'}</Text>
                        </AwesomeButton>
                        )}
                      </View>
                    </View>
                    {renderIf(this.state.fitureNamaRek)(
                      <View>
                        <Text style={styles.txtBlueMed}>{this.state.namaRekening}</Text>
                      </View>
                    )}
                    {renderIf(this.state.tipe == 'SUB')(
                      <View>
                        <View style={styles.blueLine}/>
                        <Text style={styles.txtBlueHeight}>Panduan Pembayaran</Text>
                        <PanduanBayar style={{marginTop:10}} metode={this.state.kodeMetodeBayar} nominal={this.state.nominal} />
                      </View>
                    )}
                    {renderIf(this.state.fitureUpload)(
                      <View >
                        <Text style={styles.labelText}>Unggah Bukti Transfer</Text>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                          <TouchableOpacity onPress={() => { this.selectImage() }}>
                            {renderIf(this.state.imgBukti.length == 0)(
                              <Image source={require('../img/ic_gallery.png')} style={{ width: 100, height: 100, resizeMode: "stretch" }} />
                            )}
                            {renderIf(this.state.imgBukti.length > 0)(
                              <Image source={{ uri: this.state.imgBukti }} style={{ width: 100, height: 100, resizeMode: "stretch" }} />
                            )}
                          </TouchableOpacity>
                        </View>
                        <View style={styles.btnContainer}>
                          <AwesomeButton
                            borderRadius={15}
                            backgroundColor="#00a95c"
                            backgroundDarker="#039251"
                            backgroundShadow="#000"
                            height={40}
                            width={GLOBAL.DEVICE_WIDTH * 0.5}
                            style={{ marginTop: 10 }}
                            onPress={() => this.goActUpload(this.state.idTransaksi)}
                          >
                            <Image source={require('./../img/btnBeli.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5, height: 40, resizeMode: 'stretch' }} />
                            <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>UNGGAH</Text>
                          </AwesomeButton>
                        </View>
                      </View>
                    )}
              </View>
            </View>
            {renderIf(this.state.modalVisibleUnAuth == true)(
                  <UnAuth visibleModal={this.state.modalVisibleUnAuth}/>
              )}
          </ScrollView>
      </LinearGradient>
    );
  }
}

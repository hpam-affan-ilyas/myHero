import React, { Component } from 'react';
import { Image, TouchableOpacity,FlatList, Text, Clipboard , Alert, View, Modal} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import renderIf from './Renderif';
import UnAuth from './UnauthPage';
var GLOBAL= require('../utils/Helper');
var styles = require('../utils/Styles');

export default class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            modalVisible:false,
            myToken:'', 
            modalVisibleUnAuth:false,   
            dataPromo:[], 
            viewDetail:'',
        }
    }
    pressDetail(idPromo){
        if(this.state.viewDetail == idPromo){
            this.setState({viewDetail:''})
        }else{
            this.setState({viewDetail:idPromo})
        }
    }
    renderItem = ({ item }) => {
        return (
            <View>
                <View style={styles.blueLine}></View>
            <View style={styles.box}>
                <View style={[styles.boxListWhite2,{borderBottomColor:'#efefef',borderBottomWidth:2}]}>
                    <View style={styles.boxBody100White}>
                        <Text style={styles.txtHeadBlack}>{item.judul_promo}</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <View style={{ width: '75%' }} >
                                <Text style={styles.txtHeadBlack}>Kode Promo: {item.kode_promo}</Text>
                            </View>
                            <View style={{ width: '25%', alignItems: 'flex-end' }}>
                                <AwesomeButton
                                    borderRadius={8}
                                    backgroundColor='#4F7942'
                                    backgroundShadow="#000"
                                    backgroundDarker="#45673a"
                                    width={70}
                                    height={25}
                                    onPress={() => {Clipboard.setString(item.kode_promo);this.setState({modalVisible:false})} }
                                >
                                <Text style={[{position: 'absolute'},styles.btnTextWhite]}>SALIN</Text>
                                </AwesomeButton>
                            </View>
                        </View>
                        <Text style={styles.txtLittleBlack}>{item.item_promo}</Text>
                        <Text style={styles.txtLittleBlack}>Minimum pembelian Rp {GLOBAL.currency(item.min_sub, '.',true)}</Text>
                        <View style={{flexDirection:'row',marginTop:10}}>
                            <View style={{ width: '75%' }} >
                                <Text style={styles.txtLittleBlack}>Berlaku hingga {GLOBAL.convertTgl(item.tgl_akhir_promo)}</Text>
                            </View>
                            <TouchableOpacity style={{ width: '25%', alignItems: 'flex-end' }} onPress={()=> this.pressDetail(item.id)}>
                                <Text style={{fontSize:16,color:'#4F7942',fontWeight:'600'}}>Detail</Text>
                            </TouchableOpacity>
                        </View>
                        {renderIf(this.state.viewDetail == item.id)(
                            <View>
                                <View style={[styles.blueLine,{marginBottom:10}]}></View>
                                <Text style={[styles.txtLittleBlack, { textAlign: 'justify' }]}>{item.keterangan}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
            </View>
     
        )
    }

    _getListPromo() {
        fetch(GLOBAL.listPromo(), {
          method: 'GET',
          headers: {
            'Accept': 'appication/json',
            'Content-type': 'application/json',
            'Authorization': this.state.myToken,
          },
        })
          .then((response) => {
            this.setState({ isLoading: false })
            if (response.status == '201') {
              let res;
              return response.json().then(obj => {
                res = obj;
                this.setState({
                  dataPromo: res.data.promo,
                  //state: this.state["dataImg"].push(responseJson.data.slide[x][0])
                }, function () {
    
                });
              })
            } else if (response.status == '401') {
                this.setState({modalVisible:false})
                // this.Unauthorized()
            } else {
                this.setState({modalVisible:false})
                // GLOBAL.gagalKoneksi()
            }
          })
      }

    viewPromo(){
        this._getListPromo();
        this.setState({modalVisible:true})
    }

    _getToken = async () => {
        var aksesToken = await AsyncStorage.getItem('aksesToken');
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken });
            this._getListPromo();
        }
    }
    componentDidMount() {
        return this._getToken();
    }
    render() {
        const { produkMap } = this.props;
        const {pageId} = this.props;
        const { nav } = this.props;
        const {promo} = this.props
        return (
            <View>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
                <View style={styles.box}>
                    <View style={styles.boxListWhite2} >
                        {renderIf(promo > 0)(
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <View style={{width:'70%',flexDirection:'row',alignItems:'center'}}>
                                    <Image source={require('../img/promo.png')} style={{width:30,height:30}}/>
                                    <Text style={{fontSize:16,color:'#FF0000',fontWeight:'600'}}>Ada {promo} promo buat kamu</Text>
                                </View>
                                <View style={{width:'30%',justifyContent:'flex-end',alignItems:'flex-end'}}>
                                    <AwesomeButton
                                        borderRadius={8}
                                        backgroundColor='#4F7942'
                                        backgroundShadow="#000"
                                        backgroundDarker="#45673a"
                                        width={80}
                                        height={25}
                                        onPress={() => this.viewPromo()}
                                    >
                                    <Text style={[{position: 'absolute'},styles.btnTextWhite]}>Lihat Yuk</Text>
                                    </AwesomeButton>
                                </View>
                            </View>
                        )}
                        <Text style={[styles.btnTxtDefault,{marginBottom:10}]}>Pilih Produk Reksa Dana</Text>
                        <View style={styles.boxBody100White} >
                            {produkMap.map(produkMap => (
                                <View key={produkMap.kode_produk} style={{width:'100%',borderRadius:15,paddingLeft:10,paddingBottom:10,paddingRight:10,marginBottom:10,borderLeftColor:produkMap.kode_warna,borderLeftWidth:3,borderTopColor:produkMap.kode_warna,borderTopWidth:3,borderRightColor:'#efefef',borderRightWidth:1,borderBottomColor:'#efefef',borderBottomWidth:1}}>
                                    <View style={styles.boxHeadListWhite }>
                                        <Text style={{fontSize: 14,fontWeight:'600',color:produkMap.kode_warna }}>{produkMap.nama_jenis}</Text>
                                    </View>
                                    <View style={[styles.boxContenListWhite,{borderTopColor:produkMap.kode_warna,paddingTop:10,borderTopWidth:1}]}>
                                        <View style={{flexDirection:'row',alignItems:'center',width:'100%'}}>
                                            <Image source={{ uri: produkMap.link_logo }} style={styles.img30}/>
                                            <Text style={styles.txtHeadBlack}>{produkMap.nama_produk}</Text>
                                        </View>
                                        <View style={{flexDirection:'row',flex:1,width:'100%',marginTop:10}}>
                                            <View style={{width:'50%'}}>
                                                <View style={{flexDirection:'row'}}>
                                                    <TouchableOpacity style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end',marginRight:5}} onPress={()=> {Alert.alert('Info', 'CAGR (Compound Annual Growth Rate) adalah tingkat pertumbuhan tahunan rata-rata investasi selama jangka waktu tertentu',
                                                        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                                                        { cancelable: false },
                                                    )} } >
                                                        <Text style={styles.txtContenListWhite}>CAGR</Text>
                                                        <Icon name="info-circle" size={10} style={[styles.colorIconInput,{alignSelf:'flex-start'}]} />
                                                    </TouchableOpacity>
                                                    <Text style={styles.txtBlackHead3}>{GLOBAL.currency(produkMap.cagr, '.', false)} %</Text>
                                                </View>
                                                <View style={{flexDirection:'row',marginTop:10}}>
                                                    <TouchableOpacity style={{flexDirection:'row',alignItems:'flex-end',marginRight:5}} onPress={()=> {Alert.alert('Info', 'AUM (Asset Under Management) adalah dana kelolaan pada reksa dana mengacu pada total nilai dari investasi yang dikelola oleh manager investasi',
                                                            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                                                            { cancelable: false },
                                                        )} }>
                                                        <Text style={styles.txtContenListWhite}>AUM</Text>
                                                        <Icon name="info-circle" size={10} style={[styles.colorIconInput,{alignSelf:'flex-start'}]} />
                                                    </TouchableOpacity>
                                                    <Text style={styles.txtBlackHead3}>Rp {GLOBAL.currency(produkMap.aum, '.',true)}</Text>
                                                </View>
                                            </View>
                                            <View style={{width:'50%',justifyContent:'flex-end',alignItems:'flex-end'}}>
                                                <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end',textAlign:'right',width:'100%',flex:1}}>
                                                    <TouchableOpacity style={{flexDirection:'row',justifyContent:'flex-end',marginRight:5}} onPress={()=> {Alert.alert('Info', 'Nilai Aktiva Bersih (NAB) adalah nilai yang menggambarkan total kekayaan bersih reksa dana setiap harinya',
                                                            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                                                            { cancelable: false },
                                                        )} }>
                                                        <Text style={styles.txtContenListWhite}>NAB</Text>
                                                        <Icon name="info-circle" size={10} style={[styles.colorIconInput,{alignSelf:'flex-start'}]} />
                                                    </TouchableOpacity>
                                                    <Text style={styles.txtBlackHead3}>{GLOBAL.currency(produkMap.nav, '.', false)}</Text>
                                                </View>
                                                <View style={{flexDirection:'row',marginTop:10,justifyContent:'flex-end',alignItems:'flex-end',textAlign:'right',width:'100%',flex:1}}>
                                                    <Text style={[styles.txtContenListWhite,{marginRight:5}]}>Min. beli</Text>
                                                    <Text style={styles.txtBlackHead3}>Rp {GLOBAL.currency(produkMap.minimal_subs, '.',true)}</Text>
                                                </View>
                                                {renderIf(pageId == 2)(
                                                    <AwesomeButton
                                                        borderRadius={5}
                                                        backgroundColor="#00a95c"
                                                        backgroundDarker="#039251"
                                                        backgroundShadow="#000"
                                                        width={80}
                                                        height={30}
                                                        style={{marginTop:10}}
                                                        onPress={() => nav('ProductDetail', { id: produkMap.id })}
                                                    >
                                                    <Image source={require('./../img/btnBeli.png')} style={[styles.btnBeliLittleTemp,{resizeMode:'stretch'}]} />
                                                    <Text style={[{position: 'absolute'},styles.btnTextWhite]}>BELI</Text>
                                                    </AwesomeButton>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Modal animationType={"slide"} transparent={true} visible={this.state.modalVisible} onRequestClose={() => this.setState({modalVisible: false}) }>
                <View style={{width: GLOBAL.DEVICE_WIDTH,height:GLOBAL.DEVICE_HEIGHT-150,marginTop:150,padding:15,backgroundColor:'#FFF'}}>
                    <Text style={[styles.txtHeadBlack,{marginBottom:10}]}>Promo yang tersedia</Text>
                    {/* <View style={styles.blueLine}></View> */}
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.dataPromo}
                        keyExtractor={(x, i) => i}
                        renderItem={this.renderItem}
                        style={{ marginBottom: 15 }}
                    />
                    <View style={styles.modalFormBtnBottom}>
                            <AwesomeButton
                                borderRadius={15}
                                backgroundColor='#28ccfb'
                                backgroundShadow="#000"
                                backgroundDarker="#23b6e0"
                                height={40}
                                width={GLOBAL.DEVICE_WIDTH*0.5-25}
                                style={{alignSelf:'center'}}
                                onPress={() => this.setState({ modalVisible: false })}
                            >
                            <Image source={require('./../img/btnPrev.png')} style={{width:GLOBAL.DEVICE_WIDTH*0.5-25,height:40,resizeMode:'stretch'}} />
                            <Text style={[{position: 'absolute'},styles.btnTextWhite]}>KEMBALI</Text>
                            </AwesomeButton>
                    </View>
                </View>
            </Modal>
            {renderIf(this.state.modalVisibleUnAuth == true)(
                <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
            )}
            </View>
        );
    }
}


import React, { Component } from 'react';
import { Text, View, Image,FlatList, Modal, TouchableOpacity, StatusBar, RefreshControl, TextInput, Alert, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from 'react-native-check-box';
import UnAuth from './UnauthPage';
import renderIf from './Renderif';
import AwesomeButton from "react-native-really-awesome-button";
// import TextInputMask from 'react-native-text-input-mask';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');
var statusNasabah;
let listKodePromo = [];
const option = [{ label: 'Transfer Virtual Account', value: 1 }, { label: 'Transfer Bank (Verifikasi Manual)', value: 2 }];

class BuyPage extends Component {
    constructor(props) {
        super(props);
        this.field1 = React.createRef();
        this.state = {
            myToken: '',
            noRek: '',
            kodeMetodeBayar: '',
            kode_ketentuan_trans:'',
            metodeBayar: '',
            namaRek: '',
            headTitleMetodeBayar:'',
            metodeBayarList:[],
            refreshing: false,
            jmlInvest: '',
            namaProduk: '',
            minPembelian: '',
            isChecked: false,
            idProduk: '',
            imgBank: GLOBAL.imgBank,
            modalVisibleUnAuth: false,
            modalVisible:false,
            title: '',
            isi: [],
            kode_promo: '',
            dataPromo: [],
            promo: 0,
            viewNumberedList:0,
        }
    };
    pressDetail(idPromo) {
        if (this.state.viewDetail == idPromo) {
            this.setState({ viewDetail: '' })
        } else {
            this.setState({ viewDetail: idPromo })
        }
    }
    renderItem = ({ item }) => {
        return (
            <View>
                <View style={styles.blueLine}></View>
            <View style={styles.box}>
                <View style={[styles.boxListWhite2, { borderBottomColor: '#efefef', borderBottomWidth: 2 }]}>
                    <View style={styles.boxBody100White}>
                        <Text style={styles.txtHeadBlack}>{item.judul_promo}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                                    onPress={() => this.setState({kode_promo:item.kode_promo,modalVisible:false})}
                                >
                                    <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>PAKAI</Text>
                                </AwesomeButton>
                            </View>
                        </View>
                        <Text style={styles.txtLittleBlack}>{item.item_promo}</Text>
                        <Text style={styles.txtLittleBlack}>Minimum pembelian Rp {GLOBAL.currency(item.min_sub, '.', true)}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={{ width: '75%' }} >
                                <Text style={styles.txtLittleBlack}>Berlaku hingga {GLOBAL.convertTgl(item.tgl_akhir_promo)}</Text>
                            </View>
                            <TouchableOpacity style={{ width: '25%', alignItems: 'flex-end' }} onPress={() => this.pressDetail(item.id)}>
                                <Text style={{ fontSize: 16, color: '#4F7942', fontWeight: '600' }}>Detail</Text>
                            </TouchableOpacity>
                        </View>
                        {renderIf(this.state.viewDetail == item.id)(
                            <View>
                                <View style={[styles.blueLine, { marginBottom: 10 }]}></View>
                                <Text style={[styles.txtLittleBlack, { textAlign: 'justify' }]}>{item.keterangan}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
            </View>
        )
    }
    Unauthorized() {
        this.setState({ isLoading: false, modalVisibleUnAuth: true })
        setTimeout(() => this.logout(), GLOBAL.timeOut);
    }
    logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Main');
    }
    goActBuy() {
        if (this.state.jmlInvest.length == 0 || this.state.jmlInvest == 0 || this.state.jmlInvest == null) {
            Alert.alert('Perhatian', 'Jumlah investasi harus diisi',
                [{
                    text: 'OK',
                    onPress: () => {
                        const textInput = this.field1.current;
                        textInput.focus();
                    }
                }],
                { cancelable: false },
            );
        } else if (this.state.jmlInvest.toString().slice(0, 1) == 0 && this.state.jmlInvest.toString().length > 1) {
            Alert.alert('Perhatian', 'Jumlah investasi tidak valid',
                [{
                    text: 'OK',
                    onPress: () => {
                        const textInput = this.field1.current;
                        textInput.focus();
                    }
                }],
                { cancelable: false },
            );
        } else if (this.state.jmlInvest.toString().replace('.', '').replace('.', '').replace('.', '') < this.state.minPembelian) {
            Alert.alert('Perhatian', 'Jumlah investasi tidak boleh kurang dari minimal pembelian ' + this.state.minPembelian.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g, '.'),
                [{
                    text: 'OK',
                    onPress: () => {
                        const textInput = this.field1.current;
                        textInput.focus();
                    }
                }],
                { cancelable: false },
            );
        }else if(this.state.kodeMetodeBayar.length == 0){
            Alert.alert('Perhatian', 'Metode pembayaran belum dipilih',
                [{ text: 'OK', onPress: () => console.log('Ok Pressed') }],
                { cancelable: false },
            );
        }else if (this.state.isChecked === false) {
            Alert.alert('Perhatian', 'Kolom cek list harus diisi',
                [{ text: 'OK', onPress: () => console.log('Ok Pressed') }],
                { cancelable: false },
            );
        }else if(this.state.promo > 0 && this.state.kode_promo.length > 0){
            var sama = 0;
            for(var i = 0; i < listKodePromo.length; i++){
                if(listKodePromo[i].kode == this.state.kode_promo.toUpperCase() ){
                    sama = sama+1;
                }
            }
            if(sama == 0){
                Alert.alert('Perhatian', 'Kode promo tidak valid',
                    [{ text: 'OK', onPress: () => console.log('Ok Pressed') }],
                    { cancelable: false },
                );
            }else{
                var jml = this.state.jmlInvest.toString().replace('.', '').replace('.', '').replace('.', '');
                this.props.navigation.navigate('Pin', { id: this.state.idProduk, value: jml, title: 'SUB', kodeMetode: this.state.kodeMetodeBayar, no_va: this.state.noRek,kode_promo:this.state.kode_promo.toUpperCase() })
            }
        }else {
            var jml = this.state.jmlInvest.toString().replace('.', '').replace('.', '').replace('.', '');
            this.props.navigation.navigate('Pin', { id: this.state.idProduk, value: jml, title: 'SUB', kodeMetode: this.state.kodeMetodeBayar, no_va: this.state.noRek,kode_promo:this.state.kode_promo.toUpperCase() })
        }
    }
    // GET BUY TAMPIL 2 with Virtual Account
    _getBuyView(token, idProduk) {
        fetch(GLOBAL.buyTampil2(idProduk), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token,
            }
        })
            .then((response) => {
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        this.setState({
                            namaProduk: res.data.produk.nama_produk,
                            minPembelian: res.data.produk.minimal_subs,
                        });
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    _getMetodeBayarList(token, idProduk) {
        // console.log("idProduk", idProduk);
        let data = {
            "idProduk" : idProduk
        }
        fetch(GLOBAL.metodeBayarList(), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token,
            }
        })
            .then((response) => {
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        console.log("Response Metode Bayar", res);
                        this.setState({
                            metodeBayarList: res.data.metode,
                        });
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
            // body: JSON.stringify(data),
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
                        console.log("Response Ketentuan Transaksi", res);
                        var content = res.data.isi;
                        let content_data = [];
                        var a = content.split('<br>');
                        for (var i = 1; i <= a.length; i++) {
                            content_data.push({
                                no: i,
                                value: a[i - 1],
                            });
                        }
                        this.setState({
                            title: res.data.title,
                            isi: content_data,
                            viewNumberedList:res.data.view_numbered_list,
                        })

                    })
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    _getMetodeBayar(token, id, idProduk) {
        fetch(GLOBAL.metodeBayar(id, idProduk), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
                'Authorization': token,
            }
        })
            .then((response) => {
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        if (res.data.bank.no_rek != null) {
                            this.setState({ noRek: res.data.bank.no_rek })
                        }
                        if (res.data.bank.nama_rek != null) {
                            this.setState({ namaRek: res.data.bank.nama_rek })
                        }
                        if (res.data.bank.head_title != null) {
                            this.setState({ headTitleMetodeBayar: res.data.bank.head_title })
                        }
                        if (res.data.bank.link_logo != null) {
                            this.setState({ imgBank: res.data.bank.link_logo })
                        }
                        if (res.data.bank.jenis_tipe != null) {
                            this.setState({ metodeBayar: res.data.bank.jenis_tipe })
                        }
                        if (res.data.bank.kode_metode != null) {
                            this.setState({
                                kodeMetodeBayar: res.data.bank.kode_metode,
                                kode_ketentuan_trans: "SUB-" + res.data.bank.kode_metode,
                            })
                        }
                        this.getKetentuanTrans(this.state.kode_ketentuan_trans);
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    viewPromo(){
        this._getListPromo();
        this.setState({ modalVisible: true })
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
                        var count = Object.keys(res.data.promo).length;
                        for (var i = 0; i < count; i++) {
                            listKodePromo.push({
                                kode: res.data.promo[i].kode_promo,
                            })
                        }
                        this.setState({
                            dataPromo: res.data.promo,
                            //state: this.state["dataImg"].push(responseJson.data.slide[x][0])
                        }, function () {

                        });
                    })
                } else if (response.status == '401') {
                    this.setState({ modalVisible: false })
                    this.Unauthorized()
                } else {
                    this.setState({ modalVisible: false })
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    _getPromo() {
        fetch(GLOBAL.getPromo(), {
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
                        this.setState({ promo: res.data })
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }
            })
    }

    _getToken = async () => {
        var aksesToken = await AsyncStorage.getItem('aksesToken');
        statusNasabah = await AsyncStorage.getItem('statusNasabah');
        if (statusNasabah == 'pending') {
            Alert.alert('Perhatian', 'Pendaftaran Anda sedang dalam proses verifikasi. Transaksi dapat dilakukan setelah proses verifikasi selesai.',
                [{ text: 'OK', onPress: () => this.props.navigation.navigate('Home') }],
                { cancelable: false },
            );
        } else if (statusNasabah == 'belum nasabah') {
            Alert.alert('Perhatian', 'Anda belum melengkapi data nasabah, segera lengkapi data nasabah!',
                [
                    { text: 'Nanti', onPress: () => console.log('Cancel Pressed') },
                    { text: 'Lengkapi Sekarang', onPress: () => this.props.navigation.navigate('Regist1') }
                ],
                { cancelable: false },
            );
        }
        const { params } = this.props.navigation.state;
        if (params.id != null) {
            this.setState({ idProduk: params.id });
        }
        if (params.nilaiInvest != null) {
            this.setState({ jmlInvest: params.nilaiInvest });
        }
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken });
            //this._getBuyView(this.state.myToken,this.state.idProduk)
            this._getBuyView(this.state.myToken, this.state.idProduk);
            this._getMetodeBayarList(this.state.myToken, this.state.idProduk);
            this.getKetentuanTrans(this.state.kode_ketentuan_trans);
            this._getPromo();
            this._getListPromo();
            // this._getMetodeBayar(this.state.myToken,'1',this.state.idProduk);
        } else {
            this.Unauthorized()
        }
    }
    _onRefresh() {
        this.setState({ refreshing: true });
        this._getToken().then(() => {
            this.setState({ refreshing: false })
        });
    }
    componentDidMount() {
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
        const listMetode = this.state.metodeBayarList;
        const metodeMap = listMetode.map((listMetode, key) => listMetode);
        const ketentuan = this.state.isi;
        const dataKetentuan = ketentuan.map((ketentuan, key) => ketentuan);
        return (
            <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
                <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />

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
                    <View style={styles.containerMain}>
                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>Pilih Reksa Dana</Text>
                            <View style={styles.textInputGroup}>
                                <TextInput placeholderTextColor="#000000" style={styles.textInput} placeholder="Nama Produk" value={this.state.namaProduk} editable={false} />
                            </View>
                        </View>
                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>Minimum Pembelian</Text>
                            <View style={styles.textInputGroup}>
                                <TextInput placeholderTextColor="#000000" style={styles.textInput} editable={false} placeholder="Minimum pembelian" value={"Rp " + GLOBAL.currencyInput(this.state.minPembelian, '.')} />
                            </View>
                        </View>
                        <View style={styles.inputGroup} >
                            <Text style={styles.labelText}>Nominal yang akan Diinvestasikan</Text>
                            <View style={styles.textInputGroup}>
                                <TextInput placeholderTextColor="#000000" ref={this.field1} style={styles.textInput} placeholder="0" keyboardType='number-pad' maxLength={17} value={this.state.jmlInvest.toString().replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g, '.')} onChangeText={(jmlInvest) => this.setState({ jmlInvest })} />
                            </View>
                        </View>
                        {renderIf(this.state.promo > 0)(
                            <View style={styles.inputGroup} >
                                <View style={{ flexDirection: 'row',marginBottom:5, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ width: '70%', flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../img/promo.png')} style={{ width: 30, height: 30 }} />
                                        <Text style={{ fontSize: 16, color: '#FFF', fontWeight: '600' }}>Ada {this.state.promo} promo buat kamu</Text>
                                    </View>
                                    <View style={{ width: '30%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                        <AwesomeButton
                                            borderRadius={8}
                                            backgroundColor='#4F7942'
                                            backgroundShadow="#000"
                                            backgroundDarker="#45673a"
                                            width={80}
                                            height={25}
                                            onPress={() => this.viewPromo()}
                                        >
                                            <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>Lihat Yuk</Text>
                                        </AwesomeButton>
                                    </View>
                                </View>
                                <Text style={styles.labelText}>Kode Promo</Text>
                                <View style={styles.textInputGroup}>
                                    <TextInput placeholderTextColor="#000000" style={styles.textInput} placeholder="Kode Promo" value={this.state.kode_promo.toUpperCase()} onChangeText={(kode_promo) => this.setState({ kode_promo })} />
                                </View>
                            </View>
                        )}
                        <View style={styles.inputGroup} >
                            <View style={styles.boxWhite}>
                                <Text style={[styles.txtHeadBlack2, { marginBottom: 5 }]}>Pilih Metode Pembayaran</Text>
                                {metodeMap.map(item => (
                                    <View>
                                        {renderIf(item.head_title_view)(
                                            <Text style={styles.txtBlueMed}>{item.head_title}</Text>
                                        )}
                                        <View key={item.id} style={styles.radioBtnContainer} >
                                            <TouchableOpacity onPress={() => this._getMetodeBayar(this.state.myToken, item.id, this.state.idProduk)} style={styles.radioBtnCircleBlue} >
                                                {renderIf(this.state.metodeBayar == item.jenis_tipe)(
                                                    <View style={styles.radioBtnCheckedBlue} />
                                                )}
                                            </TouchableOpacity>
                                            <Image source={{ uri: item.link_logo }} style={{ width: 80, height: 50, resizeMode: "stretch" }} />
                                            <Text style={styles.txtBlueMed, { marginLeft: 5 }}>{item.nama_metode}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.txtMed}>{this.state.title}</Text>
                            {dataKetentuan.map(dataKetentuan => (
                                <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
                                    {renderIf(this.state.viewNumberedList == 1)(
                                        <Text style={styles.txtLittle}>{dataKetentuan.no}. </Text> 
                                    )}
                                    <Text style={[styles.txtLittle, { textAlign: 'justify' }]}>{dataKetentuan.value}</Text>
                                </View>
                            ))}
                        </View>
                        {renderIf(this.state.metodeBayar !== '')(
                            <View style={styles.boxWhite}>
                                <Text style={styles.txtBlueLittle}>{this.state.headTitleMetodeBayar}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={{ uri: this.state.imgBank }} style={{ width: 80, height: 50, resizeMode: "stretch" }} />
                                    <View style={{ width: 1, height: 30, borderColor: '#415566', borderWidth: 0.5, marginRight: 10, marginLeft: 10 }} />
                                    <Text style={styles.txtBlueMed}>{this.state.noRek}</Text>
                                </View>
                                <Text style={styles.txtBlueMed}>{this.state.namaRek}</Text>
                            </View>
                        )}

                        <View style={styles.inputGroup} >
                            <CheckBox
                                style={{ flex: 1, color: '#FFF' }}
                                onClick={() => {
                                    this.setState({
                                        isChecked: !this.state.isChecked
                                    })
                                }}
                                isChecked={this.state.isChecked}
                                checkBoxColor='#FFF'
                                rightText={"Saya telah membaca  prospektus dan telah mengerti risiko dari investasi saya"}
                                rightTextStyle={[styles.txtLittle, { paddingTop: 5 }]}
                            />
                        </View>
                    </View>
                    <View style={styles.boxBtnBottom}>
                        {/* <TouchableOpacity onPress={()=>this.goActBuy()} style={styles.btnBeliBottom}>
                        <Text style={styles.btnTextWhite}>BELI</Text>
                    </TouchableOpacity> */}
                        <AwesomeButton
                            borderRadius={15}
                            backgroundColor="#00a95c"
                            backgroundDarker="#039251"
                            backgroundShadow="#000"
                            height={40}
                            width={GLOBAL.DEVICE_WIDTH * 0.5}
                            style={{ marginTop: 10 }}
                            onPress={() => this.goActBuy()}
                        >
                            <Image source={require('./../img/btnBeli.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5, height: 40, resizeMode: 'stretch' }} />
                            <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>BELI</Text>
                        </AwesomeButton>
                    </View>
                </ScrollView>
                <Modal animationType={"slide"} transparent={true} visible={this.state.modalVisible} onRequestClose={() => this.setState({ modalVisible: false })}>
                    <View style={{ width: GLOBAL.DEVICE_WIDTH, height: GLOBAL.DEVICE_HEIGHT - 150, marginTop: 150, padding: 15, backgroundColor: '#FFF' }}>
                        <Text style={[styles.txtHeadBlack,{marginBottom:10}]}>Promo yang tersedia</Text>
                    
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
                                width={GLOBAL.DEVICE_WIDTH * 0.5 - 25}
                                style={{ alignSelf: 'center' }}
                                onPress={() => this.setState({ modalVisible: false })}
                            >
                                <Image source={require('./../img/btnPrev.png')} style={{ width: GLOBAL.DEVICE_WIDTH * 0.5 - 25, height: 40, resizeMode: 'stretch' }} />
                                <Text style={[{ position: 'absolute' }, styles.btnTextWhite]}>KEMBALI</Text>
                            </AwesomeButton>
                        </View>
                    </View>
                </Modal>

                {renderIf(this.state.modalVisibleUnAuth == true)(
                    <UnAuth visibleModal={this.state.modalVisibleUnAuth} />
                )}

            </LinearGradient>
        );
    }
}

export default BuyPage;



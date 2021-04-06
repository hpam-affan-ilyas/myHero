
import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, FlatList, TextInput, View, SafeAreaView, RefreshControl, StatusBar, BackHandler } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButton from "react-native-really-awesome-button";
import LinearGradient from 'react-native-linear-gradient';
import IconIonicon from 'react-native-vector-icons/Ionicons';
import SearchableDropDown from 'react-native-searchable-dropdown';
import renderIf from './Renderif'
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');
var FAQ = require('../utils/Faq');
import Modal from 'react-native-modal';
// import { MenuProvider } from 'react-native-popup-menu';
// import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
// const { Popover } = renderers;

export default class EnsiklovetasiInvest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myToken: null,
            refreshing: false,
            faqValue: '',
            faqImage: '',
            dataFaqOption: [],
            dataFaq: [],
            idFaq: '',
            modalVisible: false,
            title: '',
            content: '',
            img: '',
            isImg: false,
        }
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this._getToken().then(() => {
            this.setState({ refreshing: false })
        });
    }
    // searchFilterFunction(text, modulName) {
    //     this.setState({
    //         faqValue: text,
    //     });
    //     const data = this.state.dataFaq;
    //     if (data.length > 0) {
    //         const newData = data.filter(item => {
    //             const itemData = item.title.toUpperCase();
    //             const textData = text.toUpperCase();
    //             return itemData.indexOf(textData) > -1;
    //         });
    //         this.setState({ dataFaqOption: newData });
    //         if (newData.length > 0) {
    //             this.menu.menuCtx.menuActions.openMenu(modulName);
    //         } else {
    //             this.menu.menuCtx.menuActions.isMenuOpen(modulName) && this.menu.menuCtx.menuActions.closeMenu(modulName);
    //         }

    //     }
    // }
    _getFaq() {
        this.setState({ isLoading: true })
        fetch(GLOBAL.ensiklovetasiList(), {
            method: 'GET',
            headers: {
                'Accept': 'appication/json',
                'Content-type': 'application/json',
            }
        })
            .then((response) => {
                this.setState({ isLoading: false })
                if (response.status == '201') {
                    let res;
                    return response.json().then(obj => {
                        res = obj;
                        var count = Object.keys(res.data.faq).length;
                        let data_faq = [];
                        var imgUrl;
                        for (var i = 0; i < count; i++) {
                            var isImg;
                            if (res.data.faq[i].head_image == null) {
                                isImg = false
                            } else {
                                isImg = true
                            }
                            data_faq.push({
                                id: res.data.faq[i].id,
                                name: res.data.faq[i].title,
                                img: res.data.faq[i].head_image,
                                isImg: isImg,
                                content: res.data.faq[i].content,
                            })
                        }
                        this.setState({ dataFaq: data_faq })
                    })
                } else if (response.status == '401') {
                    this.Unauthorized()
                } else {
                    GLOBAL.gagalKoneksi()
                }

            });
    }
    renderItem = ({ item }) => {
        return (
            <View style={{width:'100%',marginTop:5}}>
                <View style={styles.boxListWhite2}>
                    <View style={styles.boxBody100White}>
                        <TouchableOpacity style={{ flexDirection: "row", }} onPress={() => this.setState({ modalVisible: true, title: item.title, content: item.content, img: item.img, isImg: item.isImg })} >
                            <View style={{ width: '95%' }} >
                                <Text style={styles.txtHeadBlack}>{item.name}</Text>
                            </View>
                            <View style={{ width: '5%', alignItems: 'flex-end' }}>
                                <View style={{ justifyContent: "center", alignItems: "flex-end", width: '100%' }} >
                                    <IconIonicon name="ios-arrow-down" size={20} style={{ color: "#000" }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    onSelectItem(obj){
        
    }

    _getToken = async () => {
        var aksesToken = await AsyncStorage.getItem('aksesToken');
        if (aksesToken != null) {
            this.setState({ myToken: aksesToken })
        }
        this._getFaq();
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
        return (
            <LinearGradient colors={GLOBAL.BackgroundApp} style={styles.wrapper} >
                <StatusBar backgroundColor={GLOBAL.StatusBarColor} barStyle='light-content' hidden={false} />
                <View style={styles.containerMain}>
                    {/* <MenuProvider ref={(ref) => this.menu = ref} customStyles={{ backdrop: {} }}>
                        <View style={{ marginBottom: 5 }} >
                            <View style={styles.inputGroup}>
                                <View style={styles.textInputGroup}>
                                    <TextInput
                                    placeholderTextColor="#000000"
                                        placeholder="Apa yang ingin anda tanyakan?"
                                        style={styles.textInput}
                                        value={this.state.faqValue}
                                        keyboardType="default"
                                        onChangeText={(faqValue) => this.searchFilterFunction(faqValue, 'typeSearch')}
                                    />
                                    <TouchableOpacity style={styles.iconGroup}>
                                        <IconIonicon name="ios-search" size={20} />
                                    </TouchableOpacity>
                                    <Menu name='typeSearch' renderer={Popover} rendererProps={{ preferredPlacement: 'bottom', }}>
                                        <MenuTrigger >
                                        </MenuTrigger>

                                        <MenuOptions >
                                            <ScrollView style={styles.scrollSearchDropdown} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                                                {this.state.dataFaqOption.length > 0 && this.state.dataFaqOption.map((dataFaqOption, index) =>

                                                    <MenuOption key={index} text={dataFaqOption.title} style={styles.menuFirstOption}
                                                        onSelect={() => this.setState({
                                                            idFaq: dataFaqOption.id,
                                                            img: dataFaqOption.img,
                                                            isImg: dataFaqOption.isImg,
                                                            title: dataFaqOption.title,
                                                            content: dataFaqOption.content,
                                                            modalVisible: true
                                                        })}
                                                    />

                                                )}
                                            </ScrollView>
                                        </MenuOptions>
                                    </Menu>
                                </View>
                            </View>

                        </View>

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.dataFaq}
                            keyExtractor={(x, i) => i}
                            renderItem={this.renderItem}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                            style={{ marginBottom: 15 }}
                        />

                    </MenuProvider>
                             */}
                    <SearchableDropDown
                        onTextChange={text => console.log(text)}
                        onItemSelect={(item) =>  this.setState({
                            idFaq: item.id,
                            img: item.img,
                            isImg: item.isImg,
                            title: item.name,
                            content: item.content,
                            modalVisible: true
                        })}
                        // containerStyle={}
                        textInputStyle={styles.textInputSearchDropdown}
                        itemStyle={styles.itemSearchDropdown}
                        itemTextStyle={{
                            color: '#222'
                        }}
                        itemsContainerStyle={{
                            maxHeight: 220
                        }}
                        items={this.state.dataFaq}
                        placeholder="Apa yang ingin anda tanyakan?"
                        resetValue={false}
                        underlineColorAndroid='transparent' />

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.dataFaq}
                        keyExtractor={(x, i) => i}
                        renderItem={this.renderItem}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                        style={{ marginBottom: 15 }}
                        />
                </View>

                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({ modalVisible: false })}>
                    <View style={{ justifyContent: 'flex-start', flex: 1 }}>
                        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>

                            <View >
                                <Text style={[styles.txtHeadBlack, { textAlign: 'justify', fontSize: 16 }]}>{this.state.title}</Text>
                                <View style={{ marginTop: 10, marginBottom: 10 }}>
                                    {renderIf(this.state.isImg)(
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={{ uri: this.state.img }} style={{ width: GLOBAL.DEVICE_WIDTH - 60, height: (GLOBAL.DEVICE_WIDTH - 60) * 0.70, resizeMode: 'contain' }} />
                                        </View>
                                    )}
                                    {renderIf(this.state.content.length > 0)(
                                        <Text style={[styles.txtLittleBlack, { textAlign: 'justify' }]}>{this.state.content}</Text>
                                    )}

                                </View>
                            </View>
                            <View style={styles.boxBtnBottom}>
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

'use strict';
// var Fonts = require('../../assets/fonts/');
// const MyFont ={
//   montserratBold: Fonts.montserrat_bold,
// };
var React = require('react-native');
import { Dimensions ,Platform} from 'react-native';
var GLOBAL = require('./Helper');
var platform = Platform.OS;
var {
    StyleSheet,
} = React;

module.exports = StyleSheet.create({
    //layout
    wrapper: {
        flex: 1,
        width: GLOBAL.DEVICE_WIDTH,
        height: GLOBAL.DEVICE_HEIGHT,
    },
    box: {
        width:"100%",
        marginTop:10
    },

    textInputSearchDropdown:{
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: '#fff',
        color: "#415566",
        padding: 10,
        borderRadius: 20,
        marginBottom: 5
    },
    dropdownError:{
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: '#fff',
        color: "#415566",
        padding: 10,
        borderRadius: 20,
        marginBottom: 5
    },

    itemSearchDropdown:{
        padding: 10,
        marginTop: 2,
        backgroundColor: '#ddd',
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 5
    },
    
    wrapperLandscape: {
        flex: 1,
    },
    containerMain: {
        paddingTop:15,
        paddingLeft:15,
        paddingRight:15,
        width: GLOBAL.DEVICE_WIDTH,
        height:"100%",
        flex: 1,
    },
    container: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingVertical: 30,
        marginBottom: 30,
        height: "100%"
    },
    scrollerContain: {
        width: GLOBAL.DEVICE_WIDTH,
        height: GLOBAL.DEVICE_HEIGHT,
    },
    logoContain: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: "center",
        borderBottomLeftRadius: GLOBAL.DEVICE_WIDTH/2,
        borderBottomRightRadius: GLOBAL.DEVICE_WIDTH/2,
        width: GLOBAL.DEVICE_WIDTH,
        height: GLOBAL.DEVICE_HEIGHT*0.20,
    },
    pinContain:{
        width: GLOBAL.DEVICE_WIDTH,
        height: GLOBAL.DEVICE_HEIGHT*0.65,
        justifyContent: "center",
        alignItems:'center',
        alignContent:'center',
    },
    imgLogo: {
        width: '80%',
        height: "50%",
        justifyContent:'center',
        alignSelf:'center',
        resizeMode:'contain',
    },
    carrauselContain: {
        width: GLOBAL.DEVICE_WIDTH,
        justifyContent:'center',
        alignItems:'center',
        height: GLOBAL.DEVICE_HEIGHT*0.50-GLOBAL.DEVICE_HEIGHT*0.05,
        marginTop:GLOBAL.DEVICE_HEIGHT*0.015,
        marginBottom:GLOBAL.DEVICE_HEIGHT*0.015
    },
    carrauselImage: {
        height: "100%",
        width: GLOBAL.DEVICE_WIDTH,
    },
    mediaPlayer: {
        height: GLOBAL.DEVICE_WIDTH*0.75,
        width: GLOBAL.DEVICE_WIDTH,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'black',
    },
    circleDiv: {
        position: "absolute",
        bottom: 15,
        height: 10,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    pageCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 5,
        backgroundColor: "#fff"
    },
    whiteCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        margin: 5,
        backgroundColor: "#fff"
    },
    statusCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 5,
    },
    footerBottom: {
        justifyContent:'center',
        alignItems: 'center',
        padding:15,
        width: GLOBAL.DEVICE_WIDTH,
        height: GLOBAL.DEVICE_HEIGHT*0.20,
        flex:1,
    },
    blinkingArrawContainer: {
        alignItems:'flex-end',
        backgroundColor:'transparent',
        marginTop:5,
        height:GLOBAL.DEVICE_HEIGHT*0.05,
        width:GLOBAL.DEVICE_WIDTH,
    },
    radioBtnContainer:{
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center',
    },
    radioBtnCircle:{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight:5,
    },
    radioBtnChecked:{
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#FFF',
    },
    radioBtnCircleBlue:{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#0843bf',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight:5,
    },
    radioBtnCheckedBlue:{
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#0843bf',
    },
    //txt
    txt16Bold:{
        fontSize: GLOBAL.convertFontSize(16),
        fontWeight: platform == 'android'? '800':'600'
    },
    txt26Bold:{
        fontSize: GLOBAL.convertFontSize(26),
        fontWeight: platform == 'android'? '800':'600'
    },
    txtLink: {
        fontSize: GLOBAL.convertFontSize(14),
        color: '#45d4fd',
        fontWeight:platform=='android' ? '800':'600'
    },
    txt14White: {
        fontSize: GLOBAL.convertFontSize(14),
        color: '#FFF',
    },
    txtMed: {
        fontSize: 16,
        color: '#FFF',
    },
    txtDefault: {
        fontSize: GLOBAL.convertFontSize(14),
        color: '#FFF',
        fontWeight:platform=='android' ? '800':'600'
    },
    txtHeight: {
        fontSize: 18,
        color: '#FFF',
        fontWeight:platform=='android' ? '800':'600',
    },
    //btn
    
    btnLogin:{
        width: GLOBAL.DEVICE_WIDTH*0.5,
        height: 40,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#4F7942',
        shadowColor:'#3e5c35',
        shadowOffset:{width:0,height:5},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    lineTopingBtn:{
        backgroundColor:'#40f708',
        opacity:0.5,
        width: "80%",
        height:4,
        borderRadius: 2,
        paddingTop:5,
    },
    btnBeli:{
        width: 200,
        height: 30,
        marginBottom: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#00a95c',
        shadowColor:'#365fa5',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    btnBeliBottom:{
        width: GLOBAL.DEVICE_WIDTH,
        backgroundColor:'#00a95c',
        height: 40,
        marginTop:10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'#4F7942',
        shadowColor:'#5dcd3a',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    btnBeliLittle:{
        width: 80,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#00a95c',
        shadowColor:'#365fa5',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    btnBeliLittleTemp:{
        width: 80,
        height: 30,
    },
    btnBeliLittleTemp2:{
        top: window.height,
        bottom: -window.height
    },
    btnBeliLittle2:{
        width: 110,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#00a95c',
        shadowColor:'#365fa5',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    btnJual:{
        width: 200,
        height: 30,
        marginBottom: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#de2a57',
        shadowColor:'#365fa5',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    btnJualLittle:{
        width: 80,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#de2a57',
        shadowColor:'#365fa5',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    btnJualBottom:{
        width: GLOBAL.DEVICE_WIDTH,
        backgroundColor:'#00a95c',
        height: 40,
        marginTop:10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'#de2a57',
        shadowColor:'#5dcd3a',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    btnLittle:{
        width:80,
        height:20,
        borderRadius:8,
        alignItems:'center',
        justifyContent:'center'
    },
    btnDaftar: {
        width: GLOBAL.DEVICE_WIDTH*0.5,
        height: 40,
        marginBottom: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#fdfdfd',
        shadowColor:'#365fa5',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    btnDefault: {
        width: 200,
        height: 30,
        marginBottom: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#fdfdfd',
        shadowColor:'#365fa5',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.5,
        shadowRadius:1,
    },
    btnDefaultWithIcon: {
        // width: 200,
        height: 30,
        marginBottom: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#fdfdfd',
        shadowColor:'#365fa5',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
        flexDirection:'row'
    },
    topMenu:{
        flexDirection:'row',
        height: 54,
        width:GLOBAL.DEVICE_WIDTH,
        backgroundColor: GLOBAL.StatusBarColor,
        borderTopWidth: 0.5,
        borderTopColor: '#fb9800'
    },
    txtTopMenu:{
        textAlign:'center',
        color:'#FFF',
        fontSize:12,
        fontWeight:platform == 'android'?'800':'600',
        justifyContent:'center',
    },
    item2TopMenu:{
        flex:1,
        width:'50%',
        alignItems:'center',
        justifyContent:'center',
        height:54,
    },
    item2TopMenuActive:{
        flex:1,
        width:'50%',
        alignItems:'center',
        justifyContent:'center',
        height:54,
        borderBottomColor:'#FFD700',
        borderBottomWidth:2
    },
    btnTxtDefault2: {
        color: '#0843bf',
        textAlignVertical: "center",
        textAlign:'center',
        fontWeight: '600',
        fontSize: 16,
        // fontFamily: MyFont.montserratBold,
    },
    btnTxtDefault: {
        color: '#0843bf',
        textAlignVertical: "center",
        textAlign:'center',
        fontWeight: '600',
        fontSize: 16,
        // fontFamily: MyFont.montserratBold,
    },
    box100White:{
        width:GLOBAL.DEVICE_WIDTH,
        height:110,
        flexDirection:'row',
        backgroundColor:'#FFF',
        borderBottomColor:'#efefef',
        borderTopColor:'#efefef',
        shadowColor:'#efefef',
        borderBottomWidth:1,
        borderTopWidth:1,
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:2,
        padding:10,
        marginTop:10,
    },
    boxBody100White:{
        width:'100%'
    },
    boxItem100White:{
        width:"25%",
        flex:1,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        justifyContent:'center',
        alignItems:'center',
        padding:5,
    },
    boxIcon100White:{
        width:"25%",
        height:50,
        justifyContent:'center',
        alignItems:'center',
        padding:5
    },
    boxFiture:{
        width: GLOBAL.DEVICE_WIDTH/4,
        marginRight: 5,
        marginLeft: 5,
        borderWidth: 0.5,
        borderColor: "#dddddd",
        borderRadius:10,
        padding: 5,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FFF'
    },
    icon100White:{
        width:50,
        height:50,
        resizeMode:'contain'
    },
    boxTitle100White:{
        width:"100%",
        textAlign:'center',
        fontSize:12,
        color:'#000',
    },
    boxBigWhite:{
        width:GLOBAL.DEVICE_WIDTH,
        flexDirection:'column',
        backgroundColor:'#FFF',
        borderBottomColor:'#efefef',
        borderTopColor:'#efefef',
        shadowColor:'#efefef',
        shadowOffset:{width:0,height:-2},
        shadowOpacity:0.8,
        shadowRadius:2,
        padding:10,
        marginTop:15
    },
    boxBigWhite2:{
        width:GLOBAL.DEVICE_WIDTH,
        flexDirection:'column',
        backgroundColor:'#FFF',
        borderBottomColor:'#efefef',
        borderTopColor:'#efefef',
        shadowColor:'#efefef',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        shadowOffset:{width:0,height:-2},
        shadowOpacity:0.8,
        shadowRadius:2,
        paddingTop:10,
        marginTop:15
    },
    boxBigGreen:{
        width:GLOBAL.DEVICE_WIDTH,
        flexDirection:'column',
        backgroundColor:'#4F7942',
        borderBottomColor:'#efefef',
        borderTopColor:'#efefef',
        shadowColor:'#efefef',
        shadowOffset:{width:0,height:-2},
        shadowOpacity:0.8,
        shadowRadius:2,
        padding:10,
        marginTop:15
    },
    iconMenu:{
        width: 30, height: 30,
    },
    boxListWhite:{
        width:GLOBAL.DEVICE_WIDTH,
        marginTop:5,
        marginBottom:10,
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center',
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
    },
    boxListWhite2:{
        width:"100%",
        marginBottom:10,
        padding:10,
        justifyContent:'center',
        alignContent:'center',
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius:10,
        backgroundColor:'#FFF',
        flex:1,
        shadowColor:'#efefef',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    boxModalWhite:{
        width:GLOBAL.DEVICE_WIDTH-60,
        marginBottom:15,
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
    },
    boxListChart:{
        width:'100%',
        justifyContent:'center',
        alignContent:'center',
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius:10,
        backgroundColor:'#FFF',
        flex:1,
        shadowColor:'#efefef',
        shadowOffset:{width:0,height:-2},
        shadowOpacity:0.8,
        shadowRadius:2,
    },
    boxHeadListWhite:{
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        padding:5,
    },
    boxHeadListWhiteRight:{
        width:'100%',
    },
    boxContenListWhite:{
        width: '100%',
        flex:1,
    },
    contenCenter:{
        justifyContent:'center',
        alignItems:'center',
    },
    txtLittle: {
        fontSize: 13,
        color: '#FFF',
    },
    labelCheckbox: {
        fontSize: 16,
        color: '#FFF',
        fontWeight:platform=='android' ? '800':'600'
    },
    
    txtBlackHead: {
        fontSize: 14,
        color: '#000',
        fontWeight:platform=='android' ? '800':'600'
    },
    txtBlackHead3: {
        fontSize: GLOBAL.convertFontSize(14),
        color: '#000',
        fontWeight:platform=='android' ? '800':'600'
    },
    txtBlackHead2: {
        fontSize: 14,
        color: '#000',
        fontWeight:platform=='android' ? '800':'600',
        paddingLeft:10,
    },
    labelInputModal: {
        fontSize: 14,
        color: '#000',
        marginBottom:2,
    },
    txtContenListWhite: {
        fontSize: 13,
        color: '#000',
        fontWeight:'400'
    },
    txtBlueLittle: {
        fontSize: 13,
        color: '#415566',
    },
    img30:{
        width:30,
        height:30,
        resizeMode:'contain',
        marginRight:5,
    },
    modalFullScreen:{
        width:GLOBAL.DEVICE_WIDTH,
        height:GLOBAL.DEVICE_HEIGHT,
        justifyContent:'center',
        flex:1,
    },
    modalForm:{
        width:GLOBAL.DEVICE_WIDTH,
        height:'100%',
        padding:15,
    },
    btnBackCircle:{
        width:40,
        height:40,
        marginTop:50,
        marginLeft:15,
        backgroundColor:'#4F7942',
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'flex-start',
        zIndex:2,
    },
    boxBtnBottom:{
        width:"100%",
        height:"100%",
        justifyContent:'flex-end',
        alignItems:'flex-end',
        alignItems:'center',marginBottom:15,
        flex:1,
    },
    btnBottom:{
        width: GLOBAL.DEVICE_WIDTH,
        height: 40,
        marginTop:10,
        borderRadius: 10,
        alignItems: 'center',
        
        justifyContent:'center',
        backgroundColor:'#4F7942',
        shadowColor:'#5dcd3a',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    btnBottomPrev:{
        width: GLOBAL.DEVICE_WIDTH*0.5-10,
        height: 40,
        marginTop:10,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf:'flex-end',
        justifyContent:'center',
        backgroundColor:'#28ccfb',
        marginRight:20,
        shadowColor:'#5dcd3a',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    btnBottomNext:{
        width: GLOBAL.DEVICE_WIDTH*0.5-10,
        height: 40,
        marginTop:10,
        alignSelf:'flex-end',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'#4F7942',
        shadowColor:'#5dcd3a',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:1,
    },
    txtHorizontalScroll:{
        backgroundColor:'#4F7942',
        height:30,
        width:80,
        borderRadius:5,
        padding:3,
        marginRight:5,
        marginLeft:5,
        alignItems:'center',
        justifyContent:'center',
    },
    arrowHorizontalScroll:{
        color:'#4F7942',
        zIndex:2,
        alignSelf:'center',
        justifyContent:'center',
        flex:1
    },
    activeCirclePage: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems:'center',
        backgroundColor: "#00ff80"
    },
    whiteCirclePage: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems:'center',
        backgroundColor: "#FFF"
    },
    lineCirclePageActive:{
        width:20,height:2,backgroundColor:"#00ff80",alignSelf:'center'
    },
    lineCirclePage:{
        width:20,height:2,backgroundColor:'#FFF',alignSelf:'center'
    },
    containerPage: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: "100%",
        height: "100%",
        flex: 1,
    },
    
    txtLabelCheckbox:{
        fontSize:13,
        color:'#FFF',
        textAlign:'justify',
    },
    txtLabelCheckboxBlack:{
        fontSize:13,
        color:'#000',
        textAlign:'justify',
        paddingRight:15
    },
    txtLittleBlack: {
        fontSize: 13,
        color: '#000',
    },
    txtLitleShadow: {
        fontSize: 14,
        color: '#49c85a',
        fontWeight:'800',
    },
    txtBlueHeight: {
        fontSize: 16,
        color: '#415566',
        fontWeight: '600',
    },
    txtBlueMed: {
        fontSize: 14,
        color: '#415566',
        fontWeight: '600',
    },

    txtRedLittleBold: {
        fontSize: 13,
        color: "#de2a57",
        fontWeight: '600',
    },
    txtHeadWhite: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: '600',
    },
    txtHeadBlack: {
        fontSize: 14,
        color: '#000',
        fontWeight: '600',
    },
    txtHeadBlack2: {
        fontSize: 16,
        color: '#000',
        fontWeight: '800',
    },
    containListProdukHome: {
        flex: 1,
        marginTop: 10,
        width: "100%",
        height: 130,
    },
    boxListProdukHome: {
        borderColor: "#dddddd",
        borderWidth: 0.5,
        width: "100%",
        height: 130,
        marginRight: 10,
    },

    labelText: {
        color: "#FFF",
        fontSize:14,
        marginBottom: 2,
    },
    labelBtn: {
        color: "#FFF",
        fontSize: 16,
        margin: 10,
    },
    labelBtn2: {
        color: '#0843bf',
        fontSize: 16,
        margin: 10,
    },
    inputGroup: {
        width: "100%",
        marginBottom: 10,
    },
    formIconic: {
        width: "100%",
        flexDirection: "row",
    },
    iconImgGroup: {
        padding: 5,
        justifyContent: "center",
        alignSelf:"center",
    },
    iconGroup: {
        padding:10,
        justifyContent: "center",
        textAlign: "right"
    },
    colorIconInput:{
       color:'#7d7d7d'
    },
    iconGroupLeft: {
        paddingTop: 5,
        paddingLeft:10,
        paddingBottom: 5,
        paddingRight: 5,
        justifyContent: "center",
        alignItems:"center",
        textAlign: "left",
        color:'#FFF'
    },
    textInputGroup: {
        borderColor: '#efefef',
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: "100%",
        height: 40,
        flexDirection: "row",
    },
    dropdownStyle: {
        borderColor: '#efefef',
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: "100%",
        height: 40,
        padding:10,
        flexDirection: "row",
    },
    dropdownItemStyle:{
        padding: 10,
        marginTop: 2,
        backgroundColor: '#FAF9F8',
        borderColor: '#bbb',
        borderWidth: 1,
    },
    scrollSearchDropdown:{
        maxHeight:200,
        backgroundColor:'#efefef',
    },
    menuFirstOption: {
        minHeight:45,
        width:GLOBAL.DEVICE_WIDTH-40,
        borderBottomColor: '#D8D8D8', 
        borderBottomWidth: 2,
        zIndex:2,
    },
    textInputGroupModal: {
        borderColor: '#415566',
        backgroundColor: '#efefef',
        borderRadius: 20,
        width: "100%",
        height: 40,
        flexDirection: "row",
    },
    textInputContact: {
        borderColor: '#efefef',
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: "100%",
        height: 120,
        borderWidth: 1,
        flexDirection: "row",
    },
    errorBorder: {
        borderWidth: 1,
        borderColor: 'red',
        marginBottom: 10
    },
    textInput: {
        color: "#415566",
        padding: 10,
        flex: 1,
    },
    textInputErrorTempatLahir: {
        borderColor: 'red',
        borderWidth: 1,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 10,
        width: "100%",
        height: 40,
        flexDirection: "row",
    },
    textInputError: {
        borderColor: 'red',
        borderWidth: 1,
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: "100%",
        height: 40,
        flexDirection: "row",
    },
    wrapperImageError: {
        borderColor: 'red',
        borderWidth: 1
    },
    errorMessage: {
        marginTop: 0,
        color: "red",
    },
    btnContainer: {
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    btnMediumLogout: {
        width: GLOBAL.DEVICE_WIDTH*0.50-20,
        height: 40,
        marginBottom: 10,
        borderRadius: 15,
        backgroundColor:'#e52757',
        alignItems: 'center',
        padding:10,
        justifyContent: 'center',
    },
    btnMediumDefault: {
        width: GLOBAL.DEVICE_WIDTH*0.50-20,
        height: 40,
        marginBottom: 10,
        borderRadius: 15,
        backgroundColor:'#28ccfb',
        alignItems: 'center',
        padding:10,
        justifyContent: 'center',
    },
    btnMedium: {
        width: "100%",
        height: 40,
        marginBottom: 10,
        borderRadius: 15,
        alignItems: 'center',
        padding:10,
        justifyContent: 'center',
    },
    btnSmall: {
        width: "20%",
        height: 40,
        marginBottom: 10,
        borderRadius: 15,
        backgroundColor: '#00bff3',
        alignItems: 'center',
        justifyContent: 'center',
    },

    btnPortoHome: {
        width: "100%",
        height: 30,
        marginBottom: 5,
        borderRadius: 10,
        backgroundColor: '#00bff3',
        alignItems: 'center',
        justifyContent: 'center',
    },

    btnTextSmallDefault: {
        color: '#0843bf',
        textAlignVertical: "center",
        fontWeight: '400',
        fontSize: 13,
        // fontFamily: MyFont.montserratBold,
    },
    btnTextDefaultLittle: {
        color: '#0843bf',
        textAlignVertical: "center",
        fontWeight: '400',
        fontSize: 13,
        // fontFamily: MyFont.montserratBold,
    },
    btnTextWhite: {
        fontSize: GLOBAL.convertFontSize(14),
        color: '#FFF',
        fontWeight: '600',
        textAlignVertical: "center",
        position: 'absolute'
    },
    loadingStyle: {
        flex: 1,
        padding: 20,
        color:'#C1FF33',
        justifyContent: "center",
        alignItems: "center",
    },
    whiteLine: {
        borderColor: "#FFF",
        borderWidth: 0.5,
        marginTop: 10,
        marginBottom:10,
    },
    whiteLineBarmeter: {
        borderColor: "#FFF",
        borderWidth: 0.5,
        width:25,
        height:1
    },
    blackLine: {
        borderColor: "#000",
        borderWidth: 0.5,
        width:'100%',
        marginTop: 2,
        marginBottom: 2,
    },
    blueLine: {
        borderColor: '#efefef',
        borderWidth: 1,
        width:'100%',
        marginTop: 2,
        marginBottom: 10,
    },
    verticalBlackLine: {
        borderColor: "#000",
        borderWidth: 0.5,
        width:1,
        height:'100%',
        marginTop: 2,
        marginBottom: 2,
    },
    boxPin:{
        borderColor:'#FFF',
        borderWidth: 1,
        borderRadius:10,
        width:40,
        height:40,
        backgroundColor: 'rgba(255,255,255,0.5)',
        margin:5,
        padding:5,
        marginRight:10,
        justifyContent:'center',
        alignItems:'center'
    },
    boxWhite:{
        width: "100%",
        borderColor: '#efefef',
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderWidth: 1,
        padding:10
    },
    boxTransparent: {
        // backgroundColor: 'rgba(52, 52, 52, 0.8)'
        
    },
    modal:{
        width:GLOBAL.DEVICE_WIDTH-30,
        height:140,
        marginTop:150,
        marginBottom:GLOBAL.DEVICE_HEIGHT/2-70,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#dcdcdc',
        position:'absolute',
        padding:10,
        flex:1,
        borderRadius:20,
        marginLeft:10,
        marginRight:10,
    },
    textInputAuth:{
        width:GLOBAL.DEVICE_WIDTH*0.60,height:40,padding:5,borderBottomColor:'#1CC625',borderBottomWidth:2,textAlign:'center',color:'#000'
    },
    modalFormInput:{
        width:GLOBAL.DEVICE_WIDTH,
        height:GLOBAL.DEVICE_HEIGHT-100,
        padding:10,
    },
    modalFormBtnBottom:{
        width:"100%",
        height:"100%",
        justifyContent:'flex-end',
        alignItems:'flex-end',
        flex:1,
        padding:15
    },
    
    modalMed:{
        width:GLOBAL.DEVICE_WIDTH-20,
        height:200,
        marginTop:130,
        marginBottom:GLOBAL.DEVICE_HEIGHT/2-100,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#00FFFF',
        position:'absolute',
        padding:10,
        flex:1,
        borderRadius:20,
        marginLeft:10,
        marginRight:10,
    },
    modalBig:{
        width:GLOBAL.DEVICE_WIDTH-20,
        height:280,
        marginTop:100,
        marginBottom:GLOBAL.DEVICE_HEIGHT/2-140,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#00FFFF',
        position:'absolute',
        padding:10,
        flex:1,
        borderRadius:20,
        marginLeft:10,
        marginRight:10,
    },
    offlineModal:{
        width:"100%",
        height:100,
        marginTop:GLOBAL.DEVICE_HEIGHT-100,
        backgroundColor:'#00FFFF',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    closeIcon:{
        justifyContent:'flex-end',
        alignItems:'flex-end',
        marginRight:5,
        marginTop:5,
    },
    txtLightMed:{
        fontSize: 14,
        color: '#49c85a',
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 2
    },
    boxFitureProduk:{
        height: 170,
        width: GLOBAL.DEVICE_WIDTH / 2.5,
        marginRight: 5,
        marginLeft: 5,
        borderWidth: 0.5,
        borderColor: "#dddddd",
        borderRadius:10,
        padding: 5,
        backgroundColor:'#FFF'
    },
    boxFitureProduk2:{
        height: 125,
        width: GLOBAL.DEVICE_WIDTH / 2.5,
        marginRight: 5,
        marginLeft: 5,
        borderWidth: 0.5,
        borderColor: "#dddddd",
        borderRadius:10,
        padding: 5,
        marginTop:10,
        backgroundColor:'#FFF'
    },
    boxFitureProduk3:{
        height: 125,
        width: GLOBAL.DEVICE_WIDTH-30,
        marginRight: 5,
        marginLeft: 5,
        borderWidth: 0.5,
        borderColor: "#dddddd",
        borderRadius:10,
        padding: 5,
        marginTop:10,
        marginBottom:5,
        backgroundColor:'#FFF'
    },
    boxNoData:{
        justifyContent: 'center', 
        alignItems: 'center',
        height:GLOBAL.DEVICE_HEIGHT*0.5,
        flex:1
    },
    contentBoxFiture:{
        marginTop: 5,
        marginBottom: 5,
        justifyContent:'center',
        alignItems:'center',

    },
    header:{
        flex:1,
        alignItems:'center',
        flexDirection:'row'
    },
    headerWhite:{
        height: 40,
        backgroundColor: '#FFF',
        borderBottomWidth: 0.5,
        borderBottomColor: '#00bff3',
        flex:1,
    },
    headerWhite2:{
        height: 40,
        backgroundColor: '#FFF',
        flex:1,
    },
    headerStyle:{
        height: 40,
        backgroundColor: GLOBAL.StatusBarColor,
        borderBottomWidth: 0.5,
        borderBottomColor: '#fb9800',
        color: '#FFF'
    },
    headerWhiteStyle:{
        height: 40,
        backgroundColor: '#FFF',
        borderBottomWidth: 0.5,
        borderBottomColor: '#FFF',
    },
    headerBlackStyle:{
        height: 40,
        backgroundColor: '#000',
        borderBottomWidth: 0.5,
        borderBottomColor: '#fb9800',
        color: '#FFF'
    },
    headerLeft:{
        marginLeft: 5,
        width:25
    },
    headerTintWhite:{
        color:'#FFF'
    },
    headerTintBlue:{
        color:'#0843bf'
    },
    headerCenter:{
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    headerTitle:{
        color:'#0843bf',
        fontWeight:platform=='android' ? '800':'600',
        fontSize:16
    },
    headerTitleWhite:{
        color:'#FFF',
        fontWeight:platform=='android' ? '800':'600',
        fontSize:16
    },
    headerRight:{
        marginRight: 15,
        width:25
    },
    menuStyle:{
        height: 70,
        padding:10,
        backgroundColor: '#192f6a',
        borderTopWidth: 0.5,
        borderTopColor: '#fb9800'
    },

    txtCenter:{
        fontSize:16,
        color:'#FFF',
        textAlign:'center'
    },
    boxDeskripsi:{
        backgroundColor:'#efefef',
        width:"100%",
        height:55,
        padding:5,
        justifyContent:'center',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
    }
});

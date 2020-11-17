
import React, { Component } from 'react';
import { Image,Text, Platform, ScrollView, Modal, View, Linking,TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import Icon from 'react-native-vector-icons/FontAwesome';
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');
import renderIf from './Renderif';
var platform = Platform.OS;
import YouTube from 'react-native-youtube';


export default class Carrousel extends React.Component {
    scrollRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            paused: false,
            currentTime:0,
            duration: 0,
            isFullScreen: false,
            playerState: PLAYER_STATES.PLAYING,
            screenType:'stretch',
            isBuffering: false,
            isLoading: true,
        };
    }
    componentDidMount = () => {
        this._isMounted = true;
        setInterval(() => {
            this.setState(prev => ({ selectedIndex: prev.selectedIndex === this.props.iklanMap.length - 1 ? 0 : prev.selectedIndex + 1 }),
                () => {
                    this.scrollRef.current.scrollTo({
                        animated: true,
                        y: 0,
                        x: GLOBAL.DEVICE_WIDTH * this.state.selectedIndex
                    });
                });
        }, 3000);
    };

    onLoad = data => {
        this.setState({duration:data.duration, isLoading: false });
    }
    onLoadStart = data => this.setState({ isLoading: true });
    // onLoadStart = data => this.videoPlayer.seek(1.0);
    onProgress = data => {
        const { isLoading, playerState } = this.state;
        // Video Player will continue progress even if the video already ended
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
          this.setState({ currentTime: data.currentTime });
        }
    };
    onSeek = seek => {
        this.videoPlayer.seek(1.0);
      };
    onPaused = playerState => {
        this.setState({
            paused: !this.state.paused,
            playerState,
        });
    }
    // onError = () => (
    //     <View >
    //         <Text style={styles.txtTopMenu}> Video gagal diputar </Text>
    //     </View>
    // );
    onError = () => console.log('Oh! :', error);
    onReplay(){
        this.setState({ playerState: PLAYER_STATES.PLAYING });
        this.videoPlayer.seek();
    };

    onPress = (data) => {
        this.setState({ currentTime: data.currentTime })
    }

    onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });
    exitFullScreen = () => {
        alert("Exit full screen");
      };
    enterFullScreen = () => {};
    onFullScreen(video,nav){
        if(this.state.screenType=='stretch')
        nav('VideoScreen',{myVideo:video})
    else
        this.setState({screenType:'stretch'});
    };
    renderToolbar = (tittle) => (
        <View >
            <Text style={styles.txtTopMenu}> {tittle} </Text>
        </View>
    );
    onSeeking = currentTime => this.setState({ currentTime });
    
    setSelectedIndex = event => {
        //width of viewsize
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        //get current position
        const contentOffset = event.nativeEvent.contentOffset.x;
        const selectedIndex = Math.floor(contentOffset / viewSize);
        this.setState({ selectedIndex });
    }
    render() {
        const { iklanMap } = this.props
        const {nav} = this.props
        const { selectedIndex } = this.state
        return (

                    <View style={styles.carrauselContain2}>
                        <Text style={[styles.btnTextWhite2,{marginBottom:10,textAlign:'center'}]}>Informasi dan Promosi</Text>
                        <View style={{height:GLOBAL.DEVICE_WIDTH*0.75,width:GLOBAL.DEVICE_WIDTH,backgroundColor:'#e1e4e8',justifyContent:'center',alignItems:'center'}} >
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled
                                onMomentumScrollEnd={this.setSelectedIndex}
                                ref={this.scrollRef} >
                                {iklanMap.map(iklanMap => (
                                    <View key={iklanMap.link_file} >
                                        {renderIf(iklanMap.tipe == 'gambar')(
                                            <TouchableOpacity onPress={() => GLOBAL.openMyURL(iklanMap.link) }>
                                                <Image resizeMode="stretch"
                                                    source={{ uri: iklanMap.link_file }}
                                                    style={styles.mediaPlayer} />
                                            </TouchableOpacity>
                                        )}
                                        {renderIf(iklanMap.tipe == 'video' && platform == 'android')(
                                            <View style={{ justifyContent: 'center', alignItems: 'center',height:GLOBAL.DEVICE_WIDTH*0.75,width:GLOBAL.DEVICE_WIDTH}} >
                                                <Video
                                                    onEnd={this.onEnd}
                                                    onLoad={this.onLoad}
                                                    repeat={true}
                                                    muted={true}
                                                    onLoadStart={this.onLoadStart}
                                                    onProgress={this.onProgress}
                                                    paused={this.state.paused}
                                                    ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                                                    resizeMode={this.state.screenType}
                                                    onFullScreen={this.state.isFullScreen}
                                                    source={{ uri: iklanMap.link_file}} 
                                                    style={styles.carrauselImage}
                                                    volume={0}
                                                    />  
                                                <MediaControls
                                                    duration={this.state.duration}
                                                    isLoading={this.state.isLoading}
                                                    mainColor="#333"
                                                    onFullScreen={() => this.onFullScreen(iklanMap.link_file,nav)}
                                                    onPaused={() => this.onFullScreen(iklanMap.link_file,nav)}
                                                    onReplay={() => this.onFullScreen(iklanMap.link_file,nav)}
                                                    onSeek={this.onSeek}
                                                    onSeeking={this.onSeeking}
                                                    onError={this.onError}
                                                    playerState={this.state.playerState}
                                                    progress={this.state.currentTime}
                                                    toolbar={this.renderToolbar(iklanMap.tittle)}
                                                    />
                                            </View>
                                        )}
                                        {renderIf(iklanMap.tipe == 'video' && platform == 'ios')(
                                            <View style={{ justifyContent: 'center', alignItems: 'center',height:GLOBAL.DEVICE_WIDTH*0.75,width:GLOBAL.DEVICE_WIDTH}} >
                                                <YouTube
                                                videoId= {iklanMap.link}
                                                play={false}
                                                fullscreen={true}
                                                loop={true}
                                                onReady={e => this.setState({ isReady: true })}
                                                onChangeState={e => this.setState({ status: e.state })}
                                                onChangeQuality={e => this.setState({ quality: e.quality })}
                                                onError={e => alert('error: '+e.error)}
                                                style={styles.carrauselImage}
                                                />
                                            </View>
                                        )}
                                    </View>
                                ))}

                            </ScrollView>
                            <View style={styles.circleDiv}>
                                {iklanMap.map((iklanMap, i) => (
                                    <View key={iklanMap.link_file} style={[
                                        styles.pageCircle,
                                        { opacity: i === selectedIndex ? 0.5 : 1 }
                                    ]} />
                                ))}
                            </View>
                        </View>
                    </View>
        )
    }
}
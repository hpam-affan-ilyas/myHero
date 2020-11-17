import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
var styles = require('../utils/Styles');
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';

class VideoPage extends Component {
    
constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: false,
      playerState: PLAYER_STATES.PLAYING,
      screenType:'stretch'
};
  }
onSeek = seek => {
          this.videoPlayer.seek(seek);
        };
onPaused = playerState => {
          this.setState({
            paused: !this.state.paused,
            playerState,
          });
        };
onReplay = () => {
          this.setState({ playerState: PLAYER_STATES.PLAYING });
          this.videoPlayer.seek(0);
        };
onProgress = data => {
          const { isLoading, playerState } = this.state;
          // Video Player will continue progress even if the video already ended
          if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            this.setState({ currentTime: data.currentTime });
          }
        };
onLoad = data => this.setState({ duration: data.duration, isLoading: false });
onLoadStart = data => this.setState({ isLoading: true });
onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });
onError = () => (
  <View >
      <Text style={styles.txtTopMenu}> Video gagal diputar </Text>
  </View>
);
exitFullScreen = () => {
          alert("Exit full screen");
        };
enterFullScreen = () => {};
onFullScreen = ()=>{
  if(this.state.screenType=='stretch')
  this.props.navigation.navigate('Home')
else
  this.setState({screenType:'stretch'});
};
renderToolbar = () => (
          <View >
              <Text style={styles.txtTopMenu}>Video</Text>
          </View>
        );
onSeeking = currentTime => this.setState({ currentTime });
        
  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.wrapperLandscape}>
        <Video
          onEnd={this.onEnd}
          onLoad={this.onLoad}
          onLoadStart={this.onLoadStart}
          onProgress={this.onProgress}
          paused={this.state.paused}
          ref={videoPlayer => (this.videoPlayer = videoPlayer)}
          resizeMode={this.state.screenType}
          onFullScreen={this.state.isFullScreen}
          source={{ uri: params.myVideo }} 
          style={styles.mediaPlayer}
          volume={10}
        />
        <MediaControls
          duration={this.state.duration}
          isLoading={this.state.isLoading}
          mainColor="#333"
          onFullScreen={this.onFullScreen}
          onPaused={this.onPaused}
          onReplay={this.onReplay}
          onSeek={this.onSeek}
          onSeeking={this.onSeeking}
          playerState={this.state.playerState}
          progress={this.state.currentTime}
          toolbar={this.renderToolbar()}
        />
      </View>
    );
  }
}
export default VideoPage;
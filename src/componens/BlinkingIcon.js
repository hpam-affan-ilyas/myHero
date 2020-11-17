import React, { Component } from 'react';
import { View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var GLOBAL= require('../utils/Helper');
import renderIf from './Renderif';
var styles = require('../utils/Styles');

export default class BlinkingIcon extends Component{
    constructor(props){
      super(props);
      this.state={
        showIcon1: false,
        showIcon2: false,
        showIcon2: false,
        isShow:1,
      }
      // setInterval(() => {
      //   this.setState(previousState2 =>{
      //     return {showIcon2: !previousState2.showIcon2 };
      //   })
      // }, 1000);
      // setInterval(() => {
      //   this.setState(previousState1 =>{
      //     return {showIcon3: !previousState1.showIcon3 };
      //   })
      // }, 1010);
    }
    showicon(isShow){
      switch(isShow){
        case 1:
          this.setState({showIcon1:true});
          setTimeout(()=>{this.showicon(2)},400);
          break;
        case 2:
          this.setState({showIcon1:true,showIcon2:true});
          setTimeout(()=>{this.showicon(3)},400);
          break;
        case 3:
          this.setState({showIcon1:true,showIcon2:true,showIcon3:true});
          setTimeout(()=>{this.showicon(4)},400);
          break
        case 4:
          this.setState({showIcon1:false,showIcon2:false,showIcon3:false});
          setTimeout(()=>{this.showicon(1)},500);
          break;
      }
    }
    componentDidMount(){
      this.showicon(this.state.isShow)
    }
    render(){
      // let display1 = this.state.showIcon1 ? this.props.name:'';
      // let display2 = this.state.showIcon2 ? this.props.name:'';
      // let display3 = this.state.showIcon3 ? this.props.name:'';
      return(
        <View style={styles.blinkingArrawContainer} >
          {renderIf(this.state.showIcon1 == true)(
            <Icon name="ios-arrow-down" size={25} style={{color:'#FFF',alignSelf:'center'}} />
          )}
          {renderIf(this.state.showIcon2 == true)(
            <Icon name="ios-arrow-down" size={25} style={{color:'#FFF',alignSelf:'center',marginTop:-20}} />
          )}
          {renderIf(this.state.showIcon3 == true)(
            <Icon name="ios-arrow-down" size={25} style={{color:'#FFF',alignSelf:'center',marginTop:-20}} />
          )}
        </View>
        
      )
    }
  }
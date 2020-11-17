import React, { Component } from 'react';
import { Image,Dimensions,ScrollView,StyleSheet, View } from 'react-native';
var styles = require('../utils/Styles');
var GLOBAL = require('../utils/Helper');
export default class Carrousel extends React.Component{

    scrollRef = React.createRef();
    constructor(props){
        super(props);
        this.state = {
            selectedIndex: 0
        };
    }
    componentDidMount = () => {
        this._isMounted = true;
        setInterval(() =>{
            this.setState(prev => ({selectedIndex: prev.selectedIndex === this.props.images.length - 1 ? 0 : prev.selectedIndex + 1}),
            () =>
            {this.scrollRef.current.scrollTo({
                animated: true,
                y:0,
                x: GLOBAL.DEVICE_WIDTH * this.state.selectedIndex
            });
        });
        },3000);
    };
    setSelectedIndex = event =>{
        //width of viewsize
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        //get current position
        const contentOffset = event.nativeEvent.contentOffset.x;
        const selectedIndex = Math.floor(contentOffset / viewSize);
        this.setState({ selectedIndex });
    }
    render() {
        const {images} = this.props
        const {selectedIndex} = this.state
        return(
            <View style={{height:GLOBAL.DEVICE_WIDTH*0.75,width:GLOBAL.DEVICE_WIDTH,backgroundColor:'#e1e4e8',justifyContent:'center',alignItems:'center'}} >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onMomentumScrollEnd={this.setSelectedIndex}
                    ref={this.scrollRef}
                     >
                    {images.map(image => (
                        <Image resizeMode="stretch"
                            key={image}
                            source={{uri: image}}
                            style={styles.mediaPlayer}
                        />
                    ))}
                </ScrollView>
                <View style={styles.circleDiv}>
                    {images.map((image,i) =>(
                        <View key={image} style={[
                            styles.pageCircle,
                            {opacity: i === selectedIndex ? 0.5: 1 }
                        ]} />
                    ))}
                </View>
            </View>
        )
    }
}

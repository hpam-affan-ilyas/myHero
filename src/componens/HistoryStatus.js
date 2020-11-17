import React, { Component } from 'react';
import { View } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
var GLOBAL = require('../utils/Helper');
var styles = require('../utils/Styles');
import renderIf from './Renderif';

export default class HistoriStatusTransaksi extends Component{
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

  _getHistoriStatus(token, idOrder,status_id) {
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
            var icon;
            var line;
            for (var i = 0; i < count; i++) {
              //   if(status_id == res.data.histori[i].kode_history_id){
              //     icon = require('../img/circle2.png');
              //     line = '#dcdcdc'
              //   }else{
              //     icon = require('../img/circle.png');
              //     line = GLOBAL.StatusBarColor
              //   }
                data_histori.push({
                    time: GLOBAL.convertTglFull(res.data.histori[i].tgl_status),
                    title: res.data.histori[i].keterangan,
                    lineColor: GLOBAL.StatusBarColor,
                    icon: require('../img/circle2.png'),
                });

            }
          //   if(count < 3){
          //     data_histori.push({
          //         time: null,
          //         title: null,
          //         lineColor: '#dcdcdc',
          //         icon: require('../img/circle2.png'),
          //     });
          //   }
            this.setState({ dataHistori: data_histori})
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
    const { status_id } = this.props;
    var aksesToken = await AsyncStorage.getItem('aksesToken');
    if (aksesToken != null) {
      this.setState({ myToken: aksesToken })
      this._getHistoriStatus(this.state.myToken, data,status_id);
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
              timeStyle={{backgroundColor:'#ff9797',color:'#FFF',textAlign:'center',fontSize:13,padding:5,borderRadius:5}}
              titleStyle={{marginTop:-13,fontSize:14,marginBottom:20}}
            />
          </View>
      )
      
  }
} 
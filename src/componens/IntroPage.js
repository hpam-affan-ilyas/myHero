import React, { Component } from 'react';
import { Image,TouchableOpacity, Text,View} from 'react-native';
var styles = require('../utils/Styles');

export default class IntroPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aktifDeskripsi:1,
            focusBg:false,
            bg1:'#efefef',
            bg2:'#fff',
            bg3:'#fff',
            bg4:'#fff',
            textDeskripsi:'Cukup siapkan KTP, kurang dari 10 menit untuk mulai investasi',
            newMessage:'',
        }
    }

    bgOnFocus(item){
        this.setState({focusBg: true})
        this.bgAktif(item);
        var next = item*1+1;
        if(next < 5){
          setTimeout(()=> {this.cekFocus(next,true)},3000)
        }else{
          setTimeout(()=> {this.cekFocus(1,true)},3000)
        }
        
    }
    bgAktif(item){
        switch(item) {
          case 1:
              //bg1 state mudah menjadi aktif
            this.setState({
              bg1:'#efefef',bg2:'#fff',bg3:'#fff',bg4:'#fff',textDeskripsi:'Cukup siapkan KTP, kurang dari 10 menit untuk mulai investasi'
            });
            if(this.state.focusBg === true){
              setTimeout(()=> {this.cekFocus(2,true)},3000)
            }else{
              setTimeout(()=> {this.cekFocus(2,false)},2000)
            }
            break;
          case 2:
            this.setState({
              bg1:'#fff',bg2:'#efefef',bg3:'#fff',bg4:'#fff',textDeskripsi:'Bisa investasi dengan modal mulai dari Rp 100.000'
            })
            if(this.state.focusBg === true){
              setTimeout(()=> {this.cekFocus(3,true)},3000)
            }else{
              setTimeout(()=> {this.cekFocus(3,false)},2000)
            }
            break;
          case 3:
            this.setState({
              bg1:'#fff',bg2:'#fff',bg3:'#efefef',bg4:'#fff',textDeskripsi:'HPAM terdaftar & diawasi oleh OJK dengan lebih dari 10ribu nasabah'
            })
            if(this.state.focusBg === true){
              setTimeout(()=> {this.cekFocus(4,true)},3000)
            }else{
              setTimeout(()=> {this.cekFocus(4,false)},2000)
            }
            break;
          case 4:
            this.setState({
              bg1:'#fff',bg2:'#fff',bg3:'#fff',bg4:'#efefef',textDeskripsi:'Memberikan imbal hasil rata-rata tahunan di atas inflasi'
            })
            if(this.state.focusBg === true){
              setTimeout(()=> {this.cekFocus(1,true)},3000)
            }else{
              setTimeout(()=> {this.cekFocus(1,false)},2000)
            }
            break;
        }
        
    }
    cekFocus(next,klik){
        if(klik === true){
          if(this.state.focusBg === true){
            this.setState({focusBg:false})
            this.bgAktif(next)
          }else{
            
          }
        }else{
          if(this.state.focusBg === true){
           
          }else{
            this.bgAktif(next)
          }
        }
    }
    componentDidMount() {
        this.bgAktif(1);
    }
    render() {
        return (
            <View style={styles.box}>
                <View style={styles.boxListWhite2}>
                    <Text style={styles.btnTxtDefault}>Kenapa Pilih MyHero?</Text>
                    <View style={styles.boxBody100White}>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={[styles.boxItem100White,{backgroundColor:this.state.bg1}]} onPress={()=> this.bgOnFocus(1) } >
                                <View style={styles.boxIcon100White}>
                                    <Image source={require('../img/transaksi.png')} style={styles.icon100White} />
                                </View>
                                <Text style={styles.boxTitle100White}>Mudah{"\n"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.boxItem100White,{backgroundColor:this.state.bg2}]} onPress={()=> this.bgOnFocus(2) } >
                                <View style={styles.boxIcon100White}>
                                    <Image source={require('../img/harga.png')} style={styles.icon100White} />
                                </View>
                                <Text style={styles.boxTitle100White}>Terjangkau{"\n"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.boxItem100White,{backgroundColor:this.state.bg3}]} onPress={()=> this.bgOnFocus(3) } >
                                <View style={styles.boxIcon100White}>
                                    <Image source={require('../img/aman.png')} style={styles.icon100White} />
                                </View>
                                <Text style={styles.boxTitle100White}>Aman{"\n"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.boxItem100White,{backgroundColor:this.state.bg4}]} onPress={()=> this.bgOnFocus(4) }>
                                <View style={styles.boxIcon100White}>
                                    <Image source={require('../img/nasabah.png')} style={styles.icon100White} />
                                </View>
                                <Text style={styles.boxTitle100White}>Profitabel{"\n"}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.boxDeskripsi}>
                            <Text style={styles.txtLittleBlack}>{this.state.textDeskripsi}</Text>
                        </View>
                    </View>
                </View>
            </View>
                 
       );
    }
}

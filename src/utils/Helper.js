import { Linking,Dimensions,Alert,Platform} from 'react-native';
import { memoize } from 'react-native-really-awesome-button/src/helpers';
// var platform = Platform.OS == 'android'? 'http://api.myhero.id':'https://api.myhero.id';
var platform = Platform.OS == 'android'? 'http://localhost:8000/':'http://localhost:8000/';
module.exports = {
    base_url: platform,
    BackgroundApp:['#19297b', '#3b5998', '#192f6a'],  
    BackgroundApp2:['#4c669f', '#3b5998', '#192f6a'],
    StatusBarColor:'#19297b',
    imgNoConnection : this.base_url+'/file/produk/image/no_connection.jpg',
    imgUnAuth : this.base_url+'/file/produk/image/unauthorized.jpg',
    imgBank: this.base_url+'/file/logo_bank/image/PT. BANK CENTRAL ASIA TBK.1557914181.png', 
    lettersFormat : /^[A-Za-z]+$/,
    numbersFormat : /^[0-9]+$/,
    mailFormat : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    DEVICE_WIDTH : Dimensions.get("window").width,
    DEVICE_HEIGHT : Dimensions.get("window").height,
    timeOut:5000,
    maxWidthUploadImage:1160,
    maxHeightUploadImage:1544,
    page:'Home',
    appStore:'https://apps.apple.com/id/app/myhero-hpam/id1499297292',
    playStore: 'https://play.google.com/store/apps/details?id=com.hpam.myhero',
    //route api
    //Group of GET Route
    //GET App Version
    appVersion(Platform){
        var result = this.base_url+'/appversion2?platform='+Platform;
        return result;
    },

    //GET Produk List
    produkList(jenis,start,jumlah){
        if (typeof jenis == "undefined" ) jenis = '';
        if (typeof start == "undefined" ) start = '';
        if (typeof jumlah == "undefined" ) jumlah = '';
        var result = this.base_url+'/produk?jenis='+jenis+'&start='+start+"&jumlah="+jumlah;
        return result;
    },
    //GET faq list
    faqList(){
        var result = this.base_url+'/faq';
        return result;
    },
    //GET jumlah promo
    getPromo(){
        var result = this.base_url+'/rdo/cekpromo';
        return result;
    },

    //GET list promo
    listPromo(){
        var result = this.base_url+'/rdo/promo';
        return result;
    },

    produkListWithToken(jenis,start,jumlah){
        if (typeof jenis == "undefined" ) jenis = '';
        if (typeof start == "undefined" ) start = '';
        if (typeof jumlah == "undefined" ) jumlah = '';
        var result = this.base_url+'/rdo/produk?jenis='+jenis+'&start='+start+"&jumlah="+jumlah;
        return result;
    },
    //GET Profile
    profile(){
        var result = this.base_url+'/rdo/profile';
        return result;
    },
    // GET Data Nasabah
    dataNasabah(){
        var result = this.base_url+'/rdo/dataNasabah';
        return result;
    },
     //GET Profile
    slide(){
        var result = this.base_url+'/slide';
        return result;
    },
    //GET Summary porto
    summaryPorto(){
        var result = this.base_url+'/rdo/portofolio/summary2';
        return result;
    },
    //GET IKLAN PROMO
    iklan(){
        var result = this.base_url+'/rdo/iklan';
        return result;
    },
    //GET data chart
    listNav(kinerja,produkId){
        // if (typeof kinerja == "undefined" ) kinerja = '';
        // if (typeof produkId == "undefined" ) produkId = '';
        var result = this.base_url+'/rdo/produk/nav?kinerja='+kinerja+'&produk_id='+produkId;
        return result;
    },
    //GET order
    order(limit){
        var result = this.base_url+'/rdo/activity?jenis=order&limit='+limit;
        return result;
    },
    orderDetailStatus(id){
        var result = this.base_url+'/rdo/historitransaksi?id='+id;
        return result;
    },
    //GET BUY TAMPIL
    buyTampil(produkId){
        if (typeof produkId == "undefined" ) produkId = '';
        var result = this.base_url+'/rdo/beli?produk_id='+produkId;
        return result;
    },
    //GET BUY TAMPIL 2
    buyTampil2(produkId){
        if (typeof produkId == "undefined" ) produkId = '';
        var result = this.base_url+'/rdo/beli2?produk_id='+produkId;
        return result;
    },
    //GET History
    histori(dateFrom,dateTo,tipeTransaksi,limit){
        if (typeof dateFrom == "undefined" ) dateFrom = '';
        if (typeof dateTo == "undefined" ) dateTo = '';
        if (typeof tipeTransaksi == "undefined" ) tipeTransaksi = '';
        var result = this.base_url+'/rdo/activity?jenis=histori'+'&limit='+limit+'&tanggal_awal='+dateFrom+'&tanggal_akhir='+dateTo+'&jenis_transaksi='+tipeTransaksi;
        return result;
    },

    //GET Detail produk
    detailProduk(produkId){
        if (typeof produkId == "undefined" ) produkId = '';
        var result = this.base_url+'/rdo/produk/'+ produkId;
        return result;
    },

    //GET ketentuan transaksi
    ketentuanTransaksi(kode_tipe){
        if (typeof kode_tipe == "undefined" ) kode_tipe = '';
        var result = this.base_url+'/rdo/ketentuan_transaksi?kode='+kode_tipe;
        return result;
    },
    //GET metode bayar
    metodeBayarList(){
        var result = this.base_url+'/rdo/metode_bayarlist2';
        return result;
    },
    //GET metode bayar
    metodeBayar(id,idProduk){
        if (typeof idProduk == "undefined" ) idProduk = '';
        if (typeof id == "undefined" ) id = '';
        var result = this.base_url+'/rdo/metode_bayar2?id='+id+'&produk_id='+idProduk;
        return result;
    },
    //GET Detail produk
    detailProdukWithOutToken(produkId){
        if (typeof produkId == "undefined" ) produkId = '';
        var result = this.base_url+'/produk/'+ produkId;
        return result;
    },
    detailProdukByProfileRisk(tipe){
        if (typeof tipe == "undefined" ) tipe = '';
        var result = this.base_url+'/produkbyprofileresiko/'+tipe;
        return result;
    },
    //GET Notifikasi investasi list
    listNotifikasiInvestasi(){
        var result = this.base_url+'/rdo/notifikasiinvestasi/list';
        return result;
    },
    //GET Portofolio list
    listPorto(){
        var result = this.base_url+'/rdo/portofolio/list2';
        return result;
    },
    //GET order detail
    orderDetail(orderId){
        if (typeof orderId == "undefined" ) orderId = '';
        var result = this.base_url+'/rdo/orderdetail?id='+orderId;
        return result;
    },
    //GET panduan_bayar
    panduanBayar(kode_metode){
        if (typeof kode_metode == "undefined" ) kode_metode = 'VA-CIMB';
        var result = this.base_url+'/rdo/panduan_bayar?metode_bayar='+kode_metode;
        return result;
    },
    //GET agama
    getAgama(){
        var result = this.base_url+'/rdo/agama';
        return result;
    },

    getNamaKota() {
        var result = this.base_url+'/rdo/namaKota';
        return result;
    },

    getNamaPendidikan() {
        var result = this.base_url+'/rdo/namaPendidikan';
        return result;
    },

    getNamaBank() {
        var result = this.base_url+'/rdo/namaBank';
        return result;
    },

    getNamaSumberDana() {
        var result = this.base_url+'/rdo/namaSumberDana';
        return result;
    },

    getNamaPenghasilan() {
        var result = this.base_url+'/rdo/namaPenghasilan';
        return result;
    },

    getNamaPekerjaan() {
        var result = this.base_url+'/rdo/namaPekerjaan';
        return result;
    },

    getNamaAgama(){
        var result = this.base_url+'/rdo/namaAgama';
        return result;
    },
    //GET Notifikasi
    getNotifikasi(limit){
        var result = this.base_url+'/rdo/notifikasi/pesan?limit='+limit;
        return result;
    },
    //GET NEW Notifikasi
    getNotifikasiNew(){
        var result = this.base_url+'/rdo/notifikasi/new';
        return result;
    },
    //GET tujuan investasi
    getTujuanInvestasi(){
        var result = this.base_url+'/rdo/tujuan_investasi';
        return result;
    },
    //GET sumber dana
    getSumberDana(){
        var result = this.base_url+'/rdo/sumberdana';
        return result;
    },
    //GET jenis_produk
    getJenisProduk(offset,limit){
        var result = this.base_url+'/rdo/jenis_produk?offset='+offset+'&limit='+limit;
        return result;
    },
    //GET penghasilan
    getPenghasilan(){
        var result = this.base_url+'/rdo/penghasilan';
        return result;
    },
    //GET pekerjaan
    getPekerjaan(){
        var result = this.base_url+'/rdo/pekerjaan';
        return result;
    },
    //GET pendidikan
    getPendidikan(){
        var result = this.base_url+'/rdo/pendidikan';
        return result;
    },
    //GET kota
    getKota(keyKota){
        if (typeof keyKota == "undefined" ) keyKota = '';
        var result = this.base_url+'/rdo/kota/?keyword='+keyKota;
        return result;
    },
    //GET Bank
    getBank(){
        var result = this.base_url+'/rdo/bank';
        return result;
    },
    //GET Jual Tampil
    getJualTampil(idProduk){
        if (typeof idProduk == "undefined" ) idProduk = '';
        var result = this.base_url+'/rdo/jual?produk_id='+idProduk;
        return result;
    },
    //GET Contact
    getContact(){
        var result = this.base_url+'/rdo/contact';
        return result;
    },

    //Group of POST Router
    //POST verifikasi other device
    otherDevice(){
        var result = this.base_url+'/otherdeviceconfirm';
        return result;
    },
    //POST Firebase
    postFirebase(){
        var result = this.base_url+'/post_firebase';
        return result;
    },
    //POST Login
    login(){
        var result = this.base_url+'/login';
        return result;
    },
    //POST Daftar
    daftar(){
        var result = this.base_url+'/daftar';
        return result;
    },
    //POST notifikasi investasi simpan
    notifikasiInvestasi(){
        var result = this.base_url+'/rdo/notifikasiinvestasi';
        return result;
    },
    //POST Delete notifikasi investasi
    deleteNotifikasiInvestasi(){
        var result = this.base_url+'/rdo/notifikasiinvestasi/delete';
        return result;
    },
    //POST notifikasi update read
    notifikasiRead(){
        var result = this.base_url+'/rdo/notifikasi/read';
        return result;
    },
    //POST verifikasi Auth
    verifikasiChangeEmail(){
        var result = this.base_url+'/rdo/verifikasichangeemail';
        return result;
    },
    //POST edit nama profile
    editNamaProfile(){
        var result = this.base_url+'/rdo/profile/nama';
        return result;
    },
    //POST foto profile
    editFotoProfile(){
        var result = this.base_url+'/rdo/profile/avatar';
        return result;
    },
    //POST edit email profile
    editEmailProfile(){
        var result = this.base_url+'/rdo/profile/email';
        return result;
    },
    //POST edit no_hp profile
    editNoHpProfile(){
        var result = this.base_url+'/rdo/profile/nohp';
        return result;
    },
    //POST edit Password profile
    editPasswordProfile(){
        var result = this.base_url+'/rdo/profile/password';
        return result;
    },
    //POST edit Pin profile
    editPinProfile(){
        var result = this.base_url+'/rdo/profile/pin';
        return result;
    },
    //POST cek Pin profile
    cekPinProfile(){
        var result = this.base_url+'/rdo/pin';
        return result;
    },
    //POST Beli simpan
    beliSimpan(){
        var result = this.base_url+'/rdo/beli';
        return result;
    },
    getMinimumPembelian(produkId) {
        var result = this.base_url+'/rdo/minimumPembelian/'+produkId;
        return result;
    },
    //POST Jual simpan
    jualSimpan(){
        var result = this.base_url+'/rdo/jual';
        return result;
    },
    switch(){
        var result = this.base_url+'/rdo/switch';
        return result;
    },
    //POST upload bukti
    uploadBukti(){
        var result = this.base_url+'/rdo/uploadbukti';
        return result;
    },

    checkCustomer() {
        let result = this.base_url+'/rdo/checkCustomer';
        return result;
    },
    //POST CEK Nik
    cekNIK(){
        var result = this.base_url+'/rdo/cek_nik';
        return result;
    },
    //POST pendaftaran
    pendaftaran(){
        var result = this.base_url+'rdo/pendaftaran';
        return result;
    },
    //POST reset Password
    resetPassword(){
        var result = this.base_url+'/forgot';
        return result;
    },
    //POST Contact
    sendContact(){
        var result = this.base_url+'/rdo/contact';
        return result;
    },
    //POST lupapin
    resetPin(){
        var result = this.base_url+'/rdo/lupapin';
        return result;
    },

    //Group of Function non Route
    manageColorJenisProduk(jenisProduk) {
        if (typeof jenisProduk == "undefined" || jenisProduk == null) return "#FFF";
        var result;
        if (jenisProduk == 'saham') {
            result = "#0a4c98";
        }
        if (jenisProduk == 'mm') {
            result = "#ec008c";
        }
        if (jenisProduk == 'campuran') {
            result = "#4835c7";
        }
        if(jenisProduk == 'pendapatan'){
            result = "#f9192e"
        }
        return result;
    },
    manageJenisProduk(jenisProduk) {
        if (typeof jenisProduk == "undefined" || jenisProduk == null ) return "-";
        var result;
        if (jenisProduk == 'saham') {
            result = "Saham";
        }
        if (jenisProduk == 'mm') {
            result = "Pasar Uang";
        }
        if (jenisProduk == 'campuran') {
            result = "Campuran";
        }
        if(jenisProduk == 'pendapatan'){
            result = "Pendapatan Tetap"
        }
        return result;
    },
    manageKinerja(value) {
        if (typeof value == "undefined" || value == null) return "-";
        var a = value.toFixed(2);
        var result = a.toString().replace('.', ',');
        return result;
    },
    manageColorKinerja(value) {
        var result;
        if (typeof value == "undefined" || value == null) value = 0;
        if (value.toString().slice(0,1) == '-') {
            result = '#ff584f'
        } else {
            result = '#49c85a'
        }
        return result
    },
    currency(value, separator, isCurrency) {
        var result;
        if (typeof value == "undefined" || value == 0 || value == null || value == '') value = 0.0000;
        if (typeof separator == "undefined" || !separator) separator = ".";
        var nominal = Math.round(value);
        var min;
        var a;
        if (value.toString().slice(0,1) == '-') {
            min = '-';
        } else {
            min = '';
        }
        if (isCurrency === true) {
          if (nominal.toString().length < 10) {
            a = nominal.toString()
              .replace(/[^\d]+/g, "")
              .replace(/\B(?=(?:\d{3})+(?!\d))/g, separator);
          } else if (nominal.toString().length > 9 && nominal.toString().length < 13) {
            var b = (nominal / 1000000000).toFixed(2);
            a = b.toString().replace('.', ',') + ' M';
          } else if (nominal.toString().length > 12) {
            var c = (nominal / 1000000000000).toFixed(2);
            a = c.toString().replace('.', ',') + ' T';
          }
          result = min+a;
        } else {
          var d = value.toFixed(2).toString().replace('.', ',').split(',');
          var e = d[0].replace(/[^\d]+/g, "").replace(/\B(?=(?:\d{3})+(?!\d))/g, separator) + ',' + d[1];
          result = min+e;
        }
        return result;
    },
    currencyInput(value, separator) {
        if (typeof value == "undefined" || value == 0 || value == null || value == '') value = 0.0000;
        if (typeof separator == "undefined" || !separator) separator = ".";
        var nominal = Math.round(value);
        var a = nominal.toString()
            .replace(/[^\d]+/g, "")
            .replace(/\B(?=(?:\d{3})+(?!\d))/g, separator);
        return a;
    },
    currencyInput2(value) {
        var bil = value;
        if (typeof bil == "undefined" || bil == 0 || bil == null || bil == '') bil = 0.0000;
        var nominal = bil.toString().replace('.', '-').split('-');
        var des = nominal[1];
        if(typeof des == "undefined") des = 0;
        var a = nominal[0].toString()
            .replace(/[^\d]+/g, "")
            .replace(/\B(?=(?:\d{3})+(?!\d))/g,'.');
        return a+","+des;
    },
    currencyByTipeTrans(value,unit,tipe,status, separator) {
        if (typeof value == "undefined" || value == 0 || value == null) value = 0.0000;
        if (typeof separator == "undefined" || !separator) separator = ".";
        if (typeof unit == "undefined" || unit == null ) unit = 0;
        if (typeof tipe == "undefined" || tipe == null ) tipe = "SUB";
        var result;
        
        switch(tipe){
          case "RED":
              if (status == 'approve'){
                var nominal = Math.round(value);
                var min;
                var a;
                if (value.toString().slice(0,1) == '-') {
                    min = '-';
                } else {
                    min = '';
                }
                  if (nominal.toString().length < 10) {
                    var b = nominal.toString()
                      .replace(/[^\d]+/g, "")
                      .replace(/\B(?=(?:\d{3})+(?!\d))/g, separator);
                    a = 'Rp '+min+b;
                  } else if (nominal.toString().length > 9 && nominal.toString().length < 13) {
                    var b = (nominal / 1000000000).toFixed(2);
                    a = 'Rp '+min+b.toString().replace('.', ',') + ' M';
                  } else if (nominal.toString().length > 12) {
                    var c = (nominal / 1000000000000).toFixed(2);
                    a = 'Rp '+min+c.toString().replace('.', ',') + ' T';
                  }
                  result = a;
              }else{
                var d = unit.toFixed(2);
                var e = d.toString().replace('.',',')
                result = e+' Units'
              }
            break;
          case "SUB" :
            var nominal = Math.round(value);
            var min;
            var a;
            if (value.toString().slice(0,1) == '-') {
                min = '-';
            } else {
                min = '';
            }
              if (nominal.toString().length < 10) {
                var b = nominal.toString()
                  .replace(/[^\d]+/g, "")
                  .replace(/\B(?=(?:\d{3})+(?!\d))/g, separator);
                a = 'Rp '+min+b;
              } else if (nominal.toString().length > 9 && nominal.toString().length < 13) {
                var b = (nominal / 1000000000).toFixed(2);
                a = 'Rp '+min+b.toString().replace('.', ',') + ' M';
              } else if (nominal.toString().length > 12) {
                var c = (nominal / 1000000000000).toFixed(2);
                a = 'Rp '+min+c.toString().replace('.', ',') + ' T';
              }
              result = a;
            break;
        }
        return result;
    },
    convertTgl(tgl) {
        // var tglNow = new Date();
        // var m = tglNow.getMonth() + 1;
        // var mm;
        // if(m.toString().length == 1){
        //     mm = "0"+m;
        // }else{
        //     mm = m;
        // }
        // var newDate = tglNow.getFullYear() + '-' + mm + '-' + tglNow.getDate();
        if (typeof tgl == "undefined" || tgl == null) return '-';

        var a = tgl.toString().replace(' ','-').split('-');
        var bulan;
        switch (a[1]) {
            case '01':
                bulan = 'Jan'
                break;
            case '02':
                bulan = 'Feb'
                break;
            case '03':
                bulan = 'Maret'
                break;
            case '04':
                bulan = 'April'
                break;
            case '05':
                bulan = 'Mei'
                break;
            case '06':
                bulan = 'Juni'
                break;
            case '07':
                bulan = 'Juli'
                break;
            case '08':
                bulan = 'Agustus'
                break;
            case '09':
                bulan = 'Sep'
                break;
            case '10':
                bulan = 'Okt'
                break;
            case '11':
                bulan = 'Nov'
                break;
            case '12':
                bulan = 'Des'
                break;
        }
        var b = a[2] + ' ' + bulan + ' ' + a[0];
        return b;
    },
    convertTglFull(tgl) {
        if (typeof tgl == "undefined" || tgl == null) return '-';
        var a = tgl.toString().replace(' ','-').split('-');
        var b = a[3].toString().split(':');
        var jam = b[0]+":"+b[1];
        var bulan;
        switch (a[1]) {
            case '01':
                bulan = 'Jan'
                break;
            case '02':
                bulan = 'Feb'
                break;
            case '03':
                bulan = 'Maret'
                break;
            case '04':
                bulan = 'April'
                break;
            case '05':
                bulan = 'Mei'
                break;
            case '06':
                bulan = 'Juni'
                break;
            case '07':
                bulan = 'Juli'
                break;
            case '08':
                bulan = 'Agustus'
                break;
            case '09':
                bulan = 'Sep'
                break;
            case '10':
                bulan = 'Okt'
                break;
            case '11':
                bulan = 'Nov'
                break;
            case '12':
                bulan = 'Des'
                break;
        }
        var b = a[2] + ' ' + bulan + ' ' + a[0]+' '+jam;
        return b;
    },
    colorStatus(value) {
        var result;
        if (value == 'expired' || value == 'reject') {
          result = '#e52757'
        } else {
          result = '#49c85a'
        }
        return result
    },
    //for manage status transaksi in history and order page
    manageStatus(value,tipe,flag_upload){
        var result;
        if(value == 'expired') {
          result = 'Kedaluwarsa'
        }else if (value =='pending' && tipe =='RED') {
          result = "Dalam proses"
        }else if (value =='pending' && tipe =='SUB' && flag_upload == 'sudah'){
          result = "Dalam proses"
        }else if (value =='pending' && tipe =='SUB' && flag_upload == null) {
          result = "Menunggu pembayaran"
        }else if(value == 'reject'){
          result = "Ditolak"
        }else if(value == 'goodfund'){
          result = 'Pembayaran diterima'
        }else if(value == 'approve'){
          result = 'Selesai'
        }
        return result
    },
    //For bg head of activity and history page
    myBackground(tipeOrder) {
        if (typeof tipeOrder == "undefined" || tipeOrder == null) result= '#49c85a';
        var result
        if (tipeOrder == 'SUB') {
          result = '#49c85a'
        } else {
          result = '#e52757'
        }
        return result;
    },
    myBackground2(tipeOrder) {
        if (typeof tipeOrder == "undefined" || tipeOrder == null) result= '#49c85a';
        var result
        if (tipeOrder == 'SUB') {
            result = ['#53e567', '#49c85a', '#39b54a']
        } else {
            result = ['#f62e61', '#e52757', '#de2a57']
        }
        return result;
    },
    //For Linking 
    openMyURL(myUrl){
        Linking.canOpenURL(myUrl)
            .then((supported) => {
            if (!supported) {
                console.log("Can't handle url: " + url);
            } else {
                return Linking.openURL(myUrl);
            }
            })
            .catch((err) => console.error('An error occurred', err));
    },
    gagalKoneksi(){
        Alert.alert('Perhatian', 'Gagal koneksi, periksa jaringan internet Anda',
                                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                                { cancelable: false },
                            );
    },
    manageTipeTransaksi(tipe) {
        var result;
        if (typeof tipe == "undefined" || tipe == null) result= "-";
        if(tipe == "RED"){
            result = "Penjualan";
        }else if(tipe == "SUB"){
            result = "Pembelian";
        }else if(tipe == "SWTOUT") {
            result = "Switch Out";
        } else {
            result = "Switch In";
        }
        return result;
    },
    terbilang(nominal){
        var bilangan= nominal;
        var kalimat="";
        var angka   = new Array('0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0');
        var kata    = new Array('','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan');
        var tingkat = new Array('','Ribu','Juta','Miliar','Triliun');
        var panjang_bilangan = bilangan.length;
        
        /* pengujian panjang bilangan */
        if(panjang_bilangan > 15){
            kalimat = "Diluar Batas";
        }else{
            /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
            for(i = 1; i <= panjang_bilangan; i++) {
                angka[i] = bilangan.substr(-(i),1);
            }
            
            var i = 1;
            var j = 0;
            
            /* mulai proses iterasi terhadap array angka */
            while(i <= panjang_bilangan){
                subkalimat = "";
                kata1 = "";
                kata2 = "";
                kata3 = "";
                
                /* untuk Ratusan */
                if(angka[i+2] != "0"){
                    if(angka[i+2] == "1"){
                        kata1 = "Seratus";
                    }else{
                        kata1 = kata[angka[i+2]] + " Ratus";
                    }
                }
                
                /* untuk Puluhan atau Belasan */
                if(angka[i+1] != "0"){
                    if(angka[i+1] == "1"){
                        if(angka[i] == "0"){
                            kata2 = "Sepuluh";
                        }else if(angka[i] == "1"){
                            kata2 = "Sebelas";
                        }else{
                            kata2 = kata[angka[i]] + " Belas";
                        }
                    }else{
                        kata2 = kata[angka[i+1]] + " Puluh";
                    }
                }
                
                /* untuk Satuan */
                if (angka[i] != "0"){
                    if (angka[i+1] != "1"){
                        kata3 = kata[angka[i]];
                    }
                }
                
                /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
                if ((angka[i] != "0") || (angka[i+1] != "0") || (angka[i+2] != "0")){
                    subkalimat = kata1+" "+kata2+" "+kata3+" "+tingkat[j]+" ";
                }
                
                /* gabungkan variabe sub kalimat (untuk Satu blok 3 angka) ke variabel kalimat */
                kalimat = subkalimat + kalimat;
                i = i + 3;
                j = j + 1;
            }
            
            /* mengganti Satu Ribu jadi Seribu jika diperlukan */
            if ((angka[5] == "0") && (angka[6] == "0")){
                kalimat = kalimat.replace("Satu Ribu","Seribu");
            }
        }
        return kalimat;
    },
    convertFontSize(sizeFont){
        var a;
        if(this.DEVICE_WIDTH > 400){
            a = sizeFont*1+2;
        }else{
            a = sizeFont;
        }
        return a;
    }
}
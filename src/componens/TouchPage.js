import Icon from 'react-native-vector-icons/Ionicons';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, Text, TouchableHighlight, View} from 'react-native';
import ReactNativePinView from 'react-native-pin-view';
import TouchID from 'react-native-touch-id';

const Touch = () => {
  const pinView = useRef(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [showCompletedButton, setShowCompletedButton] = useState(false);

  useEffect(() => {
    //setShowCompletedButton(true);
    if (enteredPin.length > 0) {
      //setShowRemoveButton(true);
      setShowCompletedButton(true);
    } else {
      //setShowRemoveButton(false);
      setShowCompletedButton(false);
    }
    if (enteredPin.length === 4) {
      // todo
    } else {
      // todo
    }
  }, [enteredPin]);

  const [supported, setSupported] = useState(null);

  useEffect(() => {
    TouchID.isSupported()
      .then(success => {
        setSupported(true);
      })
      .catch(error => {
        console.log('Error Touch : ' + error);
        alert('Touch ID not supported on this device');
      });

    handleLogin();
  }, []);

  function handleLogin() {
    const configs = {
      title: 'Fingerprint Authentication',
      color: '#FF0000',
      sensorErrorDescription: 'Fingerprint invalid',
    };
    TouchID.authenticate('Login', configs)
      .then(success => {
        alert('Authentication Successful');
        console.log('Welcome');
      })
      .catch(error => {
        console.log('Authentication Failed' + error);
      });
  }

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#000000',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            paddingTop: 24,
            paddingBottom: 48,
            color: 'rgba(255,255,255,0.7)',
            fontSize: 24,
            textAlign: 'center',
          }}>
          Enter your pin
        </Text>
        <ReactNativePinView
          inputSize={10}
          ref={pinView}
          pinLength={4}
          buttonSize={50}
          onValueChange={value => setEnteredPin(value)}
          buttonAreaStyle={{
            marginTop: 100,
            paddingHorizontal: 90,
          }}
          inputAreaStyle={{
            marginBottom: 10,
          }}
          inputViewEmptyStyle={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#FFF',
          }}
          inputViewFilledStyle={{
            backgroundColor: '#FFF',
          }}
          buttonViewStyle={{
            padding: 0,
            borderWidth: 1,
            borderColor: '#FFF',
          }}
          buttonTextStyle={{
            color: '#FFF',
          }}
          onButtonPress={key => {
            if (key === 'custom_right') {
              pinView.current.clear();
            }
            if (key === 'custom_right') {
              //handleLogin();
            }
            if (key === 'four') { 
              alert('Welcome');
            }
          }}
          customLeftButton={
            showRemoveButton ? (
              <Icon name={'ios-backspace'} size={36} color={'#FFF'} />
            ) : (
              undefined
            )
          }
          customRightButton={
            showCompletedButton ? (
              <Icon name={'ios-backspace'} size={36} color={'#FFF'} r />
            ) : (
              undefined
            )
          }
        />
        {/* <TouchableHighlight
          style={{alignItems: 'center', marginTop: 24}}
          onPress={handleLogin}>
          <View style={{alignItems: 'center'}}>
            <Icon name={'ios-finger-print'} size={50} color={'#FFF'} r />
          </View>
        </TouchableHighlight> */}
        <Text />
      </SafeAreaView>
    </>
  );
};

export default Touch;
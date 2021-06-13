import React, { Component } from 'react';
import { Button, Image, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

class Usuario extends Component {
  state = {
    image: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
  }

  render() {
    let image = this.state.image;
    const { user } = this.props.route.params

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{marginBottom: 15}}>
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        </View>
        
        <Button style={{marginBottom: 15}} title="Subir Imagen" onPress={this._pickImage} />
        
        <View style={{marginTop: 15}} >
          <Text >¡Bienvenido {user}!</Text>
        </View>

      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Se necesitan permisos para la cámara');
      }
    }
  };

  _pickImage = async () => {
    
   
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    } catch (aux) {
      console.log(aux);
    }
  };
}

export default Usuario;
import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { firebaseConfig } from '../comun/comun';


class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  loginHandler = ({navigate}) => {
    const url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + firebaseConfig.apiKey;

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        returnSecureToken: true
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .catch(err => {
        alert("Usuario o contraseña erróneos, intente otra vez");
      })
      .then(res => res.json())
      .then(parsedRes => {

        if (!parsedRes.idToken) {
          alert("Ocurrió un error, revisa tus datos");
        } else {
          navigate('Inicio', { user: this.state.email })
        }
      });
  };


  render() {
    const { navigate } = this.props.navigation;
    
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={styles.header}> Bienvenido a AppGaztaroa</Text>
        </View>

        <TextInput
          placeholder="E-mail"
          autoCapitalize="none"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
          style={styles.inputLogin}
        />

        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          style={styles.inputLogin}
          secureTextEntry
        />

        <View style={styles.button}>
          <Button title="Login" onPress={() => this.loginHandler({navigate})} style={styles.button} disabled={(this.state.email === "" || this.state.password === "")} />
        </View>

        <Text style={styles.text}>Si no tienes cuenta, registrate <Text onPress={() => navigate('SignUp')} style={styles.navigateText}>Registrarse</Text></Text>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  headerView: {
    marginBottom: 20
  },
  header: {
    fontWeight: "bold",
    fontSize: 26,
    color: "chocolate"
  },
  text: {
    color: "black"
  },
  navigateText: {
    color: "#1E90FF"
  },
  inputLogin: {
    width: "70%"
  },
  button: {
    marginTop: 10,
    marginBottom: 15
  }
});

export default LoginScreen;
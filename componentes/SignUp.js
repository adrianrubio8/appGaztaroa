import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { firebaseConfig } from '../comun/comun';

class RegistroScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      valid: false,
    };
  }

  comprobarPassword = () => {
    if ((this.state.password.length > 0) && (this.state.password === this.state.confirmPassword)) {

      this.setState({ valid: true })
    } else {
      this.setState({ valid: false })
    }
  }

  signupHandler = ({ navigate }) => {
    const url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + firebaseConfig.apiKey;

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
        alert("E-mail o contraseña incorrectos, inténtelo otra vez");
      })
      .then(res => res.json())
      .then(parsedRes => {

        if (!parsedRes.idToken) {
          alert("Ocurrió un error, revise sus datos");
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
          <Text style={styles.header}>Create Account</Text>
        </View>

        <TextInput
          placeholder="E-mail"
          autoCapitalize="none"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          value={this.state.password}
          onChangeText={(password) => this.setState({ password: password }, this.comprobarPassword)}
          style={styles.input}
          secureTextEntry
        />

        <TextInput
          placeholder="Confirm password"
          autoCapitalize="none"
          value={this.state.confirmPassword}
          onChangeText={(confirmPassword) => this.setState({ confirmPassword }, this.comprobarPassword)}
          style={styles.input}
          secureTextEntry
        />

        <View style={styles.button} >
          <Button title="Create Account" onPress={() => this.signupHandler({ navigate })} disabled={(this.state.email === "" || !this.state.valid)} />
        </View>

        <Text style={styles.text}>Si ya tienes una cuenta haz <Text onPress={() => navigate('Login')} style={styles.navigateText}>Login</Text></Text>
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
    marginBottom: 25
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
  input: {
    width: "70%"
  },
  button: {
    marginTop: 10,
    marginBottom: 15
  }
});

export default RegistroScreen;
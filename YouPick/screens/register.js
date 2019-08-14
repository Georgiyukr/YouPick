import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ListView,
  TextInput,
  Button,
  ScrollView,
  RefreshControl,
  AsyncStorage,
  Image,
  ImageBackground
} from "react-native";
import { SCREENS } from "../constants";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  register() {
    if (!this.state.username || !this.state.password) {
      alert("Please enter username and password!");
      return;
    }
    fetch("http://192.168.1.59:3000/db/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      redirect: "follow",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */

        if (responseJson.success === true && responseJson.user) {
          AsyncStorage.setItem(
            "user",
            JSON.stringify({
              username: this.state.username,
              password: this.state.password
            })
          );
          this.props.navigation.navigate(SCREENS.SETPROFILE);
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputBoxes}>
          {/* Username Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            onChangeText={text => this.setState({ username: text })}
            value={this.state.username}
          />
          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            secureTextEntry={true}
          />
        </View>
        {/* Sign up button */}
        <TouchableOpacity
          onPress={() => this.register()}
          style={styles.buttonBlack}
        >
          <Text style={styles.buttonText}> Sign Up </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff4f5"
  },

  buttons: {
    fontSize: 40
  },
  input: {
    fontSize: 15,
    marginBottom: 10,
    width: 200,
    height: 40,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff4f5",
    borderBottomWidth: 2,
    borderColor: "#a2444a"
  },
  buttonGreen: {
    alignSelf: "stretch",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#40D654"
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "white",
    fontWeight: "bold"
  },
  buttonBlack: {
    alignSelf: "stretch",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#605152",
    height: 43,
    width: 300,
    marginBottom: 10,
    marginLeft: 10
  },
  inputBoxes: {
    paddingTop: 80
  }
});

Register.navigationOptions = {
  title: "Register",
  headerStyle: {
    backgroundColor: "#a2444a"
  },
  headerTitleStyle: {
    fontSize: 20,
    color: "white"
  },
  headerTintColor: "white"
};

export default Register;

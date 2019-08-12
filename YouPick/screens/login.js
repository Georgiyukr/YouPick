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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: ""
    };
  }

  login(username, password) {
    if (!username || !password) {
      alert("Please enter username and password!");
      return;
    }
    fetch("http://192.168.1.59:3000/db/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      redirect: "follow",
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
        // console.log("json", responseJson);

        if (responseJson.success === true && responseJson.user) {
          AsyncStorage.setItem(
            "user",
            JSON.stringify({
              username: this.state.username,
              password: this.state.password
            })
          );
          this.props.navigation.navigate(SCREENS.HOME);
        } else {
          this.setState({ message: "Incorrect credentials!!" }).bind(this);
          alert(`${this.state.message}`);
        }
      })
      .catch(err => {
        alert(err);
        console.log("ERROR IN LOGIN FETCH", err);
      });
  }

  componentDidMount() {
    AsyncStorage.getItem("user")
      .then(result => {
        if (result === null) {
          return;
        }
        var parsedResult = JSON.parse(result);
        var username = parsedResult.username;
        var password = parsedResult.password;
        if (username && password) {
          return this.login(username, password);
        }
        // Don't really need an else clause, we don't do anything in this case.
      })
      .catch(err => {
        alert(err);
      });
  }

  render() {
    return (
      // <ImageBackground
      //   source={require("../assets/youpick-bg.png")}
      //   resizeMode="cover"
      //   style={{ width: "100%", height: "100%", flex: 1 }}
      // >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={text => this.setState({ username: text })}
          value={this.state.username}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
          secureTextEntry={true}
        />

        <TouchableOpacity
          onPress={() => this.login(this.state.username, this.state.password)}
          style={styles.buttonGrey}
        >
          <Text style={styles.buttonText}> Log In </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate(SCREENS.REGISTER)}
          style={styles.buttonBlue}
        >
          <Text style={styles.buttonText}> Sign Up </Text>
        </TouchableOpacity>
      </View>
      // </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  buttons: {
    fontSize: 40
  },

  headers: {
    fontSize: 50,
    textAlign: "center"
  },
  input: {
    fontSize: 15,
    width: 400,
    height: 40,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  users: {
    borderColor: "black",
    borderWidth: 0.5,
    borderStyle: "solid",
    padding: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  messages: {
    fontSize: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    margin: 5,
    backgroundColor: "white"
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
    fontSize: 30,
    color: "white"
  },
  buttonBlue: {
    alignSelf: "stretch",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#368FD5"
  },
  buttonRed: {
    alignSelf: "stretch",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "red"
  },
  buttonGrey: {
    alignSelf: "stretch",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "grey"
  },
  text: {
    marginLeft: 10
  }
});

export default Login;

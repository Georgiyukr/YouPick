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
import { Header } from "react-native-elements";

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
    fetch("http://10.2.127.20:3000/db/login", {
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
        if (responseJson.success === true && responseJson.user) {
          AsyncStorage.setItem(
            "user",
            JSON.stringify({
              username: username,
              password: password
            }),
            () => {
              this.props.navigation.navigate(SCREENS.HOME);
            }
          );
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
          // alert(username + "/" + password);
          return this.login(username, password);
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  render() {
    return (
      <React.Fragment>
        <Header
          style={{ flex: 1, margin: 0 }}
          backgroundColor="#a2444a"
          centerComponent={{
            text: "Login",
            style: { color: "white", fontSize: 20, fontWeight: "bold" }
          }}
        />
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
          <View style={styles.actionButtons}>
            {/* Login button */}
            <TouchableOpacity
              onPress={() =>
                this.login(this.state.username, this.state.password)
              }
              style={styles.buttonBlack}
            >
              <Text style={styles.buttonText}> Log In </Text>
            </TouchableOpacity>

            {/* Sign up button */}
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate(SCREENS.REGISTER)}
              style={styles.buttonRed}
            >
              <Text style={styles.buttonText}> Sign Up </Text>
            </TouchableOpacity>
          </View>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff4f5"
  },
  actionButtons: {
    width: 300,
    paddingBottom: 10
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
    marginBottom: 8
  },
  buttonRed: {
    alignSelf: "stretch",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#a2444a",
    height: 43
  },
  inputBoxes: {
    paddingTop: 80
  }
});

Login.navigationOptions = {
  header: null
  // headerVisible: false
};

export default Login;

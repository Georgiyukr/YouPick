import React from "react";
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

function Home(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Go to your first restaurant!</Text>
      <TouchableOpacity
        onPress={() => props.navigation.navigate(SCREENS.PICK)}
        style={styles.buttonGrey}
      >
        <Text style={styles.buttonText}>Choose a Restaurant</Text>
      </TouchableOpacity>
    </View>
  );
}

async function logOut(props) {
  // const username = await AsyncStorage.getItem("user").then(result => {
  //   if (result === null) {
  //     return;
  //   }
  //   var parsedResult = JSON.parse(result);
  //   return parsedResult.username;
  // });

  fetch("http://192.168.1.59:3000/db/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    redirect: "follow"
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if (responseJson.success === true) {
        props.navigation.navigate(SCREENS.LOGIN);
      }
    })
    .catch(err => {
      // console.log("from fetch", err);
      alert(err);
    });
  AsyncStorage.setItem("user", "");
}

Home.navigationOptions = props => ({
  title: "Home",
  headerRight: (
    <Button
      title="View Profile"
      onPress={() => props.navigation.navigate(SCREENS.VIEWPROFILE)}
    />
  ),
  headerLeft: <Button title="Log Out" onPress={() => logOut(props)} />
});
export default Home;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#a2444b"
  },

  buttons: {
    fontSize: 40
  },
  title: {
    fontSize: 50,
    textAlign: "center",
    fontFamily: "Courier New",
    color: "white",
    fontWeight: "bold",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textShadowColor: "#000"
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
    justifyContent: "center"
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

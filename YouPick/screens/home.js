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

Home.navigationOptions = props => ({
  title: "Home",
  headerStyle: {
    backgroundColor: "#a2444a"
  },
  headerTitleStyle: {
    fontSize: 20,
    color: "white"
  },
  headerTintColor: "white",
  headerRight: (
    <Button
      title="View Profile"
      color="white"
      style={{ fontSize: 15 }}
      onPress={() => props.navigation.navigate(SCREENS.VIEWPROFILE)}
    />
  ),
  headerLeft: (
    <Button
      title="Log Out"
      color="white"
      style={{ fontSize: 15 }}
      onPress={() => logOut(props)}
    />
  )
});

async function logOut(props) {
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

function Home(props) {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.visitedText}>Visited Restraunts</Text>
      </ScrollView>

      <TouchableOpacity onPress={() => this.pick()} style={styles.buttonRed}>
        <Text style={styles.buttonText}>Pick Restraunt</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#fff4f5"
  },
  visitedText: {
    marginTop: 15,
    fontSize: 25,
    fontWeight: "bold",
    color: "#605152",
    textAlign: "center"
  },
  buttonRed: {
    alignSelf: "stretch",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#a2444a",
    height: 43,
    width: 300,
    marginBottom: 10,
    marginLeft: 10
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "white",
    fontWeight: "bold"
  }
});

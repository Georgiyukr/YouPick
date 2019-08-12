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
import MultiSelect from "react-native-multiple-select";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

class SetProfile extends Component {
  static navigationOptions = props => ({
    title: "Create Profile"
  });
  constructor(props) {
    super(props);
    this.state = {
      likedCuisines: [],
      priceRange: [],
      restrictions: [],
      username: "",
      imageUri: ""
    };
  }

  onSelectedItemsChange1 = selectedItems => {
    this.setState({ likedCuisines: selectedItems });
  };
  onSelectedItemsChange3 = selectedItems => {
    this.setState({ priceRange: selectedItems });
  };
  onSelectedItemsChange4 = selectedItems => {
    this.setState({ restrictions: selectedItems });
  };

  chooseImage = async () => {
    let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Permission Denied!");
      return;
    }
    let picture = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All
      // allowsEditing: true,
      // aspect: [4, 3]
    });
    // console.log("picture", picture);
    console.log("picture uri", picture.uri);
    if (picture.cancelled) {
      return;
    }
    this.setState({ imageUri: picture.uri });
  };

  sendData = () => {
    const fd = new FormData();
    fd.append("photo", {
      uri: this.imageUri,
      type: "image/jpeg",
      name: "profilePic.jpg"
    });
    fd.append("data", JSON.stringify(this.state));
    fetch("http://192.168.1.59:3000/db/setProfile", {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json"
      // },
      // credentials: "include",
      // redirect: "follow",
      body: fd
    })
      .then(response => response.json())
      .then(responseJson => {
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
        // console.log("json", responseJson);
        console.log(responseJson);
      })
      .catch(err => {
        console.log("set Profile", err);
        alert(err);
      });
    this.props.navigation.navigate(SCREENS.LOGIN);
  };

  render() {
    let isCompleted = true;
    if (
      this.state.likedCuisines.length === 0 ||
      this.state.priceRange.length === 0 ||
      this.state.restrictions.length === 0 ||
      !this.state.imageUri
    ) {
      isCompleted = false;
    }
    let cuisines = [
      { id: 55, name: "Italian" },
      { id: 25, name: "Chinese" },
      { id: 168, name: "Burger" },
      { id: 159, name: "Brazilian" },
      { id: 247, name: "Bubble Tea" },
      { id: 152, name: "African" },
      { id: 193, name: "BBQ" },
      { id: 182, name: "Breakfast" },
      { id: 30, name: "Cafe" },
      { id: 158, name: "Caribbean" },
      { id: 100, name: "Desserts" },
      { id: 67, name: "Korean" },
      { id: 136, name: "Latin American" },
      { id: 70, name: "Mediterranean" },
      { id: 73, name: "Mexican" },
      { id: 60, name: "Japanese" },
      { id: 143, name: "Healthy Food" },
      { id: 45, name: "French" },
      { id: 541, name: "Diner" },
      { id: 218, name: "Israeli" },
      { id: 82, name: "Pizza" },
      { id: 320, name: "Ramen" },
      { id: 998, name: "Salad" },
      { id: 304, name: "Sandwich" },
      { id: 83, name: "Seafood" },
      { id: 461, name: "Soulfood" },
      { id: 471, name: "Southern" },
      { id: 177, name: "Sushi" },
      { id: 997, name: "Taco" }
    ];
    let prices = [
      { id: 1, name: "$" },
      { id: 2, name: "$$" },
      { id: 3, name: "$$$" },
      { id: 4, name: "$$$$" }
    ];
    let restrictions = [
      { id: 1, name: "None" },
      { id: 2, name: "Vegetarian" },
      { id: 3, name: "Vegan" },
      { id: 4, name: "Pescatarian" },
      { id: 5, name: "Gluten Free" }
    ];

    AsyncStorage.getItem("user").then(result => {
      if (result === null) {
        return;
      }
      var parsedResult = JSON.parse(result);
      console.log(parsedResult);
      this.setState({ username: parsedResult.username });
    });
    return (
      // <ImageBackground
      //   source={require("../assets/youpick-bg.png")}
      //   resizeMode='cover'
      //   style={{ width: "100%", height: "100%", flex:1 }}
      // >
      <ScrollView style={{ backgroundColor: "#a2444b" }}>
        <View style={styles.container}>
          <View style={{ alignItems: "center" }}>
            {isCompleted ? (
              <Text />
            ) : (
              <Text style={{ fontSize: 20, color: "white" }}>
                ~Complete your profile!~
              </Text>
            )}
            <Text> </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignContent: "center"
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                alignSelf: "center"
              }}
            >
              Welcome, {this.state.username}{" "}
            </Text>
            <TouchableOpacity onPress={() => this.chooseImage()}>
              <Image
                source={{
                  uri:
                    this.state.imageUri ||
                    "https://miro.medium.com/max/480/1*DSNfSDcOe33E2Aup1Sww2w.jpeg"
                }}
                style={{ width: 100, height: 100 }}
              />
            </TouchableOpacity>
          </View>
          <Text> </Text>
          <Text style={styles.info}>What food do you like?</Text>
          <MultiSelect
            style={{ flex: 1 }}
            bgColor={"white"}
            tintColor={"#666666"}
            activityTintColor={"green"}
            items={cuisines}
            uniqueKey="id"
            onSelectedItemsChange={this.onSelectedItemsChange1}
            selectedItems={this.state.likedCuisines}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
          />
          <Text> </Text>
          <Text style={styles.info}>Any dietary restrictions? </Text>
          <MultiSelect
            style={{ flex: 1 }}
            bgColor={"white"}
            tintColor={"#666666"}
            activityTintColor={"green"}
            items={restrictions}
            uniqueKey="id"
            onSelectedItemsChange={this.onSelectedItemsChange4}
            selectedItems={this.state.restrictions}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
          />
          <Text> </Text>
          <Text style={styles.info}>
            What price range are you looking for?{" "}
          </Text>
          <MultiSelect
            style={{ flex: 1 }}
            bgColor={"white"}
            tintColor={"#666666"}
            activityTintColor={"green"}
            items={prices}
            uniqueKey="id"
            onSelectedItemsChange={this.onSelectedItemsChange3}
            selectedItems={this.state.priceRange}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
          />
          {isCompleted ? (
            <TouchableOpacity
              style={styles.buttonGrey}
              onPress={() => this.sendData()}
            >
              <Text style={styles.buttonText}> DONE </Text>
            </TouchableOpacity>
          ) : (
            <Text />
          )}
        </View>
      </ScrollView>
      // </ImageBackground>
    );
  }
}

export default SetProfile;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#a2444b"
  },

  buttons: {
    fontSize: 40
  },
  title: {
    fontSize: 50,
    textAlign: "center",
    fontFamily: "Courier New"
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
    borderWidth: 0.5,
    borderColor: "black"
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
  },
  info: {
    color: "white",
    fontSize: 20,
    alignSelf: "flex-start"
  }
});

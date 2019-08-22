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
  ImageBackground,
  FlatList
} from "react-native";
import { List, ListItem } from "react-native-elements";
import { SCREENS } from "../constants";
import MultiSelect from "react-native-multiple-select";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantID: this.props.navigation.state.params.restaurantID,
      restaurant: {}
    };
  }

  componentDidMount() {
    let url = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${
      this.state.restaurantID
    }`;
    fetch(url, {
      headers: { "user-key": "ca4658ce2aaad149ff89d86a0de8d2a3" }
    })
      .then(res => res.json())
      .then(responseJson => this.setState({ restaurant: responseJson }));
  }
  render() {
    // console.log("PROPS", this.props.navigation.getParam("restaurantID"));
    console.log("Restaurant", this.state.restaurant);

    return <View style={styles.container} />;
  }
}

Restaurant.navigationOptions = props => ({
  title: "Your Restaurant",
  headerStyle: {
    backgroundColor: "#a2444a"
  },
  headerTitleStyle: {
    fontSize: 20,
    color: "white"
  },
  headerTintColor: "white"
});

export default Restaurant;
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff4f5"
  }
});

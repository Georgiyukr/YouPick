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

import * as Permissions from "expo-permissions";

class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantID: this.props.navigation.state.params.restaurantID,
      restaurant: {},
      placeLat: undefined,
      placeLong: undefined,
      address: undefined,
      name: undefined,
      costForTwo: undefined,
      menu: undefined,
      image: undefined,
      rating: undefined,
      cuisine: undefined,
      phoneNumber: undefined,
      priceRange: undefined,
      loaded: false
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
      .then(responseJson => {
        this.setState({ restaurant: responseJson, loaded: true });
        let name = this.state.restaurant.name;
        let priceRange = this.state.restaurant.price_range;
        let address = this.state.restaurant.location.address;
        let placeLong = this.state.restaurant.location.longitude;
        let placeLat = this.state.restaurant.location.latitude;
        let costForTwo = this.state.restaurant.average_cost_for_two;
        let menu = this.state.restaurant.menu_url;
        let image = this.state.restaurant.featured_image;
        let rating = this.state.restaurant.user_rating.aggregate_rating;
        let cuisine = this.state.restaurant.cuisines;
        let phoneNumber = this.state.restaurant.phone_numbers.substring(0, 14);
        if (rating === 0) rating = undefined;
        this.setState({
          phoneNumber,
          cuisine,
          rating,
          image,
          menu,
          costForTwo,
          placeLat,
          placeLong,
          name,
          priceRange,
          address,
          loaded: true
        });
      });
  }
  render() {
    // console.log("PROPS", this.props.navigation.getParam("restaurantID"));
    console.log("RATING", this.state.rating);
    return (
      <View style={styles.container}>
        <Text>{this.state.phoneNumber}</Text>
      </View>
    );
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
    // justifyContent: "center",
    backgroundColor: "#fff4f5"
  }
});

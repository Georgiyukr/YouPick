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
import { List, ListItem, withTheme } from "react-native-elements";
import { SCREENS } from "../constants";
import StarRating from "react-native-star-rating";

import * as Permissions from "expo-permissions";
import { BorderlessButton } from "react-native-gesture-handler";

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
      loaded: false,
      username: "",
      latitude: this.props.navigation.state.params.latitude,
      longitude: this.props.navigation.state.params.longitude,
      restaurants: this.props.navigation.state.params.restaurantArray,
      mypriceRange: this.props.navigation.state.params.priceRange
    };
  }

  componentDidMount() {
    this.restaurantData();
  }
  visit() {
    console.log("IN VISIT");
    fetch("http://143.215.51.246:3000/db/visited", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow",
      body: JSON.stringify({
        name: this.state.name,
        cuisine: this.state.cuisine,
        rating: this.state.rating
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.success) console.log("VISITED");
      })
      .catch(err => {
        alert(err);
        console.log("ERROR IN SET PROFILE FETCH", err);
      });
  }

  search() {
    let goPlace;
    let options = this.state.restaurants;
    let found = false;
    while (!found) {
      let ranNum = Math.floor(Math.random() * options.length);
      goPlace = options[ranNum];
      let price = goPlace.restaurant.price_range;
      if (this.state.mypriceRange.indexOf(price) !== -1) {
        found = true;
      }
    }
    let restaurantID = goPlace.restaurant["R"].res_id;
    this.setState({ restaurantID: restaurantID });
    this.restaurantData();
  }

  restaurantData() {
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

        if (address.indexOf(",") !== -1) {
          let index = address.indexOf(",");
          address = address.substring(0, index);
        } else if (address.indexOf(".") !== -1) {
          let index = address.indexOf(".");
          address = address.substring(0, index);
        }
        if (rating === 0) rating = undefined;
        if (phoneNumber.length !== 14 || phoneNumber[0] !== "(")
          phoneNumber = undefined;
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
      <View style={{ backgroundColor: "#fff4f5" }}>
        <View style={styles.container}>
          <View style={styles.restaurantView}>
            <Text style={styles.name}>{this.state.name}</Text>
            <Image
              style={{
                width: 300,
                height: 220,
                borderRadius: 5
              }}
              source={{
                uri: this.state.image
              }}
            />
            <Text
              style={{
                marginTop: 4,
                color: "#7f7f7f",
                fontStyle: "italic",
                marginBottom: 4
              }}
            >
              {this.state.cuisine}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", color: "#605152" }}>
                Phone:
              </Text>
              <Text style={{ color: "#605152" }}>{this.state.phoneNumber}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", color: "#605152" }}>
                Address:{" "}
              </Text>
              <TouchableOpacity>
                <Text style={{ color: "#1973E8" }}>{this.state.address}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", color: "#605152" }}>
                Cost for two:
              </Text>
              <Text style={{ color: "#605152" }}>${this.state.costForTwo}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{ fontWeight: "bold", color: "#605152", marginRight: 5 }}
              >
                Rating:
              </Text>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={Number(this.state.rating)}
                starSize={18}
                fullStarColor={"#eaa510"}
              />
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20
            }}
          >
            <TouchableOpacity
              style={{
                width: 140,
                height: 43,
                backgroundColor: "#a2444a",
                borderRadius: 5,
                alignSelf: "stretch",
                padding: 10,
                marginLeft: 10
              }}
              onPress={() => this.search()}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 20,
                  textAlign: "center",
                  justifyContent: "center"
                }}
              >
                Again
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 140,
                height: 43,
                backgroundColor: "#28872d",
                borderRadius: 5,
                alignSelf: "stretch",
                padding: 10,
                marginRight: 10
              }}
              onPress={() => this.visit()}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 20,
                  textAlign: "center",
                  justifyContent: "center"
                }}
              >
                Going!!
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              style={{
                width: 140,
                height: 43,
                backgroundColor: "#000000",
                borderRadius: 5,
                alignSelf: "stretch",
                padding: 10,
                marginLeft: 10
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 20,
                  textAlign: "center",
                  justifyContent: "center"
                }}
              >
                Uber
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 140,
                height: 43,
                backgroundColor: "#1973E8",
                borderRadius: 5,
                alignSelf: "stretch",
                padding: 10,
                marginRight: 10
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 20,
                  textAlign: "center",
                  justifyContent: "center"
                }}
              >
                Maps
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    // flex: 1,
    alignItems: "center"
    // justifyContent: "center",
    // backgroundColor: "#fff4f5"
  },
  restaurantView: {
    width: 300,
    height: 350,
    marginTop: 20
  },
  name: {
    fontWeight: "bold",
    color: "#605152",
    fontSize: 25,
    marginBottom: 5
  }
});

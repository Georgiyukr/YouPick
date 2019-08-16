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
  Image
} from "react-native";
import { SCREENS } from "../constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import zomato from "zomato-api";
var client = zomato({ userKey: "edf93ee64341e71e145d65045b494dde" });

class Pick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      region: {
        latitude: null,
        longitude: null
      },
      locationArea: ""
    };
    this.restaurants = [];
    this.restaurantToGo = {};
  }

  async currentLocation() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    // console.log("got current position", location);
    await this.setState({
      region: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    });
    // console.log("My location: ", this.state.region);
  }

  // search the restaurant based on the given city
  async search() {
    await this.currentLocation();
    Promise.all([
      client.search({
        query: "koreatown",
        lat: this.state.region.latitude,
        lon: this.state.region.longitude,
        count: 20,
        cuisines: [55, 159, 182, 168, 121]
      }),
      client.search({
        query: "koreatown",
        lat: this.state.region.latitude,
        lon: this.state.region.longitude,
        count: 20,
        start: 20,
        cuisines: [55, 159, 182, 168, 121]
      }),
      client.search({
        query: "koreatown",
        lat: this.state.region.latitude,
        lon: this.state.region.longitude,
        count: 20,
        start: 40,
        cuisines: [55, 159, 182, 168, 121]
      }),
      client.search({
        query: "koreatown",
        lat: this.state.region.latitude,
        lon: this.state.region.longitude,
        count: 20,
        start: 60,
        cuisines: [55, 159, 182, 168, 121]
      }),
      client.search({
        query: "koreatown",
        lat: this.state.region.latitude,
        lon: this.state.region.longitude,
        count: 20,
        start: 80,
        cuisines: [55, 159, 182, 168, 121]
      })
    ]).then(([res1, res2, res3, res4, res5]) => {
      // console.log(
      //   "RESTAURANTS",
      //   res.restaurants,
      //   "restaurant length ",
      //   res.restaurants.length
      // )
      this.restaurants = [
        ...res1.restaurants,
        ...res2.restaurants,
        ...res3.restaurants,
        ...res4.restaurants,
        ...res5.restaurants
      ];

      let ranNum = Math.floor(Math.random() * 100);
      // console.log(ranNum);
      // let names = [];
      // this.restaurants.forEach(restaurant =>
      //   names.push(restaurant.restaurant.name)
      // );
      // console.log(
      //   //   "restaurant length",
      //   //   this.restaurants.length,
      //   //   "one restaurant",
      //   //   JSON.stringify(this.restaurants[20], null, 2),
      //   // "one restaurant name",
      //   // this.restaurants[ranNum].restaurant.name,
      //   "names",
      //   names,
      //   "length",
      //   names.length
      // );

      this.restaurantToGo = this.restaurants[ranNum].restaurant.name;
      this.props.navigation.navigate(SCREENS.RESTAURANT, {
        restaurantToGo: this.restaurantToGo
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter the area you want get restaurants from"
          onChangeText={text => this.setState({ locationArea: text })}
          value={this.state.locationArea}
        />
        <TouchableOpacity
          onPress={() => this.search()}
          style={styles.buttonGrey}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Pick;
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff4f5"
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

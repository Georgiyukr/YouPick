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
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import zomato from "zomato-api";
var client = zomato({ userKey: "edf93ee64341e71e145d65045b494dde" });

// log out function
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

// Home function component
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: null,
        longitude: null
      },
      username: "",
      foodLiked: [],
      priceRange: [],
      entity_id: null,
      entity_type: ""
    };
    this.restaurants = [];
    this.restaurantToGo = {};
  }

  async componentDidMount() {
    await this.currentLocation();
    const user = await AsyncStorage.getItem("user");

    console.log("user", user);

    if (user === null) {
      console.log("no user!!");
      return;
    }

    var parsedResult = JSON.parse(user);
    alert(
      `fetching http://192.168.1.59:3000/db/setProfile/${parsedResult.username}`
    );
    await fetch(
      `http://192.168.1.59:3000/db/setProfile/${parsedResult.username}`
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("JSON", responseJson);
        let foodLiked = responseJson["likedCuisines"];
        let priceRange = responseJson["priceRange"];
        this.setState({ foodLiked, priceRange });
      })
      .catch(err => console.log("FETCH FOOD ERROR", err));
  }

  //Getting users current Location
  async currentLocation() {
    //console.log("IN currentLocation()");
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //console.log("STATUS", status);
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    //console.log("got current position", location);
    await this.setState({
      region: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    });

    client
      .getGeocode({
        lat: this.state.region.latitude,
        lon: this.state.region.longitude
      })
      .then(res => {
        this.setState({
          entity_id: res["location"]["entity_id"],
          entity_type: res["location"]["entity_type"]
        });
        //console.log(this.state.entity_id);
      })
      .catch(err => console.log(err));
    // console.log("My location: ", this.state.region);
  }

  async search() {
    console.log("HERE");
    // client
    //   .getCategories()
    //   .then(response => console.log("CATEGORIES", response))
    //   .catch(err => console.log("ERROR in getCATEGORIES", err));
    //console.log(this.state.region.latitude, this.state.region.longitude);
    // client
    //   .getCities({
    //     lat: this.state.region.latitude,
    //     lon: this.state.region.longitude
    //   })
    //   .then(res => console.log("CITIES", res))
    //   .catch(err => console.log(err));
    // client
    //   .getCuisines({ city_id: 288 })
    //   .then(res => console.log("CUISINES", res))
    //   .catch(err => console.log(err));
    // client
    //   .getEstablishments({ city_id: 288 })
    //   .then(res => console.log("ESTABLISHMENTS", res))
    //   .catch(err => console.log(err));
    // client
    //   .getLocationDetails({ entity_id: 36932, entity_type: "group" })
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err));
    console.log("FOOOOOOD", this.state.foodLiked);
    let res1 = client.search({
      // entity_id: this.state.entity_id,
      // entity_type: this.state.entity_type,
      lat: this.state.region.latitude,
      lon: this.state.region.longitude,
      count: 20,
      cuisines: this.state.foodLiked,
      radius: 5000
    });
    console.log("RESPONSE", res1.json());

    //   Promise.all([
    //     client.search({
    //       entity_id: this.state.entity_id,
    //       entity_type: this.state.entity_type,
    //       lat: this.state.region.latitude,
    //       lon: this.state.region.longitude,
    //       count: 20,
    //       cuisines: this.state.foodLiked,
    //       radius: 5000
    //     }),
    //     client.search({
    //       entity_id: this.state.entity_id,
    //       entity_type: this.state.entity_type,
    //       lat: this.state.region.latitude,
    //       lon: this.state.region.longitude,
    //       count: 20,
    //       start: 20,
    //       cuisines: this.state.foodLiked,
    //       radius: 5000
    //     }),
    //     client.search({
    //       entity_id: this.state.entity_id,
    //       entity_type: this.state.entity_type,
    //       lat: this.state.region.latitude,
    //       lon: this.state.region.longitude,
    //       count: 20,
    //       start: 40,
    //       cuisines: this.state.foodLiked,
    //       radius: 5000
    //     }),
    //     client.search({
    //       entity_id: this.state.entity_id,
    //       entity_type: this.state.entity_type,
    //       lat: this.state.region.latitude,
    //       lon: this.state.region.longitude,
    //       count: 20,
    //       start: 60,
    //       cuisines: this.state.foodLiked,
    //       radius: 5000
    //     }),
    //     client.search({
    //       entity_id: this.state.entity_id,
    //       entity_type: this.state.entity_type,
    //       lat: this.state.region.latitude,
    //       lon: this.state.region.longitude,
    //       count: 20,
    //       start: 80,
    //       cuisines: this.state.foodLiked,
    //       radius: 5000
    //     })
    //   ])
    //     .then(([res1, res2, res3, res4, res5]) => {
    //       console.log(
    //         "RESTAURANTS",
    //         res.restaurants,
    //         "restaurant length ",
    //         res.restaurants.length
    //       );
    //       // this.restaurants = [
    //       //   ...res1.restaurants,
    //       //   ...res2.restaurants,
    //       //   ...res3.restaurants,
    //       //   ...res4.restaurants,
    //       //   ...res5.restaurants
    //       // ];
    //       // console.log("RESTAURANTS", this.restaurants);
    //     })
    //     .catch(err => console.log("ERROR in RESTAURANT SEARCH", err));
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.visitedText}>Visited Restraunts</Text>
        </ScrollView>

        <TouchableOpacity
          onPress={() => this.search()}
          style={styles.buttonRed}
        >
          <Text style={styles.buttonText}>Pick Restraunt</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// Top bar buttons and styles
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

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
var client = zomato({ userKey: "ca4658ce2aaad149ff89d86a0de8d2a3" });

// log out function
async function logOut(props) {
  fetch("http://143.215.51.246:3000/db/logout", {
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

    if (user === null) {
      console.log("no user!!");
      return;
    }

    var parsedResult = JSON.parse(user);
    await fetch(
      `http://143.215.51.246:3000/db/setProfile/${parsedResult.username}`
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("JSON", responseJson);
        let foodLiked = responseJson["likedCuisines"];
        let priceRange = responseJson["priceRange"];
        this.setState({ foodLiked: foodLiked, priceRange: priceRange });
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

    let url1 = "https://developers.zomato.com/api/v2.1/search?";
    let url2 = "https://developers.zomato.com/api/v2.1/search?";
    let url3 = "https://developers.zomato.com/api/v2.1/search?";
    let url4 = "https://developers.zomato.com/api/v2.1/search?";
    let url5 = "https://developers.zomato.com/api/v2.1/search?";

    url1 += `entity_id=${this.state.entity_id}`;
    url1 += `&entity_type=${this.state.entity_type}`;
    url1 += `&lat=${this.state.region.latitude}`;
    url1 += `&lon=${this.state.region.longitude}`;
    url1 += `&start=0`;
    url1 += `&count=20`;
    url1 += `&cuisines=${this.state.foodLiked}`;
    url1 += `&radius=5000`;

    url2 += `entity_id=${this.state.entity_id}`;
    url2 += `&entity_type=${this.state.entity_type}`;
    url2 += `&lat=${this.state.region.latitude}`;
    url2 += `&lon=${this.state.region.longitude}`;
    url2 += `&start=20`;
    url2 += `&count=20`;
    url2 += `&cuisines=${this.state.foodLiked}`;
    url2 += `&radius=5000`;

    url3 += `entity_id=${this.state.entity_id}`;
    url3 += `&entity_type=${this.state.entity_type}`;
    url3 += `&lat=${this.state.region.latitude}`;
    url3 += `&lon=${this.state.region.longitude}`;
    url3 += `&start=40`;
    url3 += `&count=20`;
    url3 += `&cuisines=${this.state.foodLiked}`;
    url3 += `&radius=5000`;

    url4 += `entity_id=${this.state.entity_id}`;
    url4 += `&entity_type=${this.state.entity_type}`;
    url4 += `&lat=${this.state.region.latitude}`;
    url4 += `&lon=${this.state.region.longitude}`;
    url4 += `&start=60`;
    url4 += `&count=20`;
    url4 += `&cuisines=${this.state.foodLiked}`;
    url4 += `&radius=5000`;

    url5 += `entity_id=${this.state.entity_id}`;
    url5 += `&entity_type=${this.state.entity_type}`;
    url5 += `&lat=${this.state.region.latitude}`;
    url5 += `&lon=${this.state.region.longitude}`;
    url5 += `&start=80`;
    url5 += `&count=20`;
    url5 += `&cuisines=${this.state.foodLiked}`;
    url5 += `&radius=5000`;

    let prom1 = fetch(url1, {
      headers: { "user-key": "ca4658ce2aaad149ff89d86a0de8d2a3" }
    }).then(res => res.json());
    let prom2 = fetch(url2, {
      headers: { "user-key": "ca4658ce2aaad149ff89d86a0de8d2a3" }
    }).then(res => res.json());
    let prom3 = fetch(url3, {
      headers: { "user-key": "ca4658ce2aaad149ff89d86a0de8d2a3" }
    }).then(res => res.json());
    let prom4 = fetch(url4, {
      headers: { "user-key": "ca4658ce2aaad149ff89d86a0de8d2a3" }
    }).then(res => res.json());
    let prom5 = fetch(url5, {
      headers: { "user-key": "ca4658ce2aaad149ff89d86a0de8d2a3" }
    }).then(res => res.json());

    Promise.all([prom1, prom2, prom3, prom4, prom5]).then(
      ([res1, res2, res3, res4, res5]) => {
        this.restaurants = [
          ...res1.restaurants,
          ...res2.restaurants,
          ...res3.restaurants,
          ...res4.restaurants,
          ...res5.restaurants
        ];
        let goPlace;
        let found = false;
        while (!found) {
          let ranNum = Math.floor(Math.random() * this.restaurants.length);
          goPlace = this.restaurants[ranNum];
          let price = goPlace.restaurant.price_range;
          if (this.state.priceRange.indexOf(price) !== -1) {
            found = true;
          }
        }
        let restaurantID = goPlace.restaurant["R"].res_id;
        this.props.navigation.navigate(SCREENS.RESTAURANT, {
          restaurantID: restaurantID
        });
      }
    );
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

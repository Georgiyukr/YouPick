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
  Picker
} from "react-native";
import { SCREENS } from "../constants";
import MultiSelect from "react-native-multiple-select";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
// import console = require("console");
// import console = require("console");

class SetProfile extends Component {
  static navigationOptions = props => ({
    title: "Create Profile",
    headerStyle: {
      backgroundColor: "#a2444a"
    },
    headerTitleStyle: {
      fontSize: 20,
      color: "white"
    },
    headerTintColor: "white",
    headerLeft: null
  });

  constructor(props) {
    super(props);
    this.state = {
      selectedFood: [],
      selectedPrice: [],
      username: ""
    };
  }

  submitInfo(username, foodLiked, priceRange) {
    console.log("IN SUBMIT");
    if (!foodLiked || !priceRange) {
      alert("Please enter your food and price preferences!");
      return;
    }

    fetch("http://10.2.127.10:3000/db/setProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow",
      body: JSON.stringify({
        username: username,
        foodLiked: foodLiked,
        priceRange: priceRange
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("HERE", responseJson);
        if (responseJson.success) {
          console.log("IN NAVIGATION");

          this.props.navigation.navigate(SCREENS.HOME);
        }
      })
      .catch(err => {
        alert(err);
        console.log("ERROR IN SET PROFILE FETCH", err);
      });
  }

  onSelectedItemsChangeFood = selectedItems => {
    this.setState({ selectedFood: selectedItems });
  };
  onSelectedItemsChangePrice = selectedItems => {
    this.setState({ selectedPrice: selectedItems });
  };

  render() {
    const food = [
      // this is the parent or 'item'
      {
        name: "Cuisines",
        id: 0,
        // these are the children or 'sub items'
        children: [
          {
            name: "African",
            id: 152
          },
          {
            name: "American",
            id: 1
          },
          {
            name: "Afghan",
            id: 1035
          },
          {
            name: "BBQ",
            id: 193
          },
          {
            name: "Brazilian",
            id: 159
          },
          {
            name: "Burger",
            id: 168
          },
          {
            name: "Chinese",
            id: 25
          },
          {
            name: "European",
            id: 38
          },
          {
            name: "French",
            id: 45
          },
          {
            name: "German",
            id: 134
          },
          {
            name: "Greek",
            id: 156
          },
          {
            name: "Healthy Food",
            id: 143
          },
          {
            name: "Indian",
            id: 148
          },
          {
            name: "Iranian",
            id: 140
          },
          {
            name: "Italian",
            id: 55
          },
          {
            name: "Korean",
            id: 67
          },
          {
            name: "Japanese",
            id: 60
          },
          {
            name: "Mediterranean",
            id: 70
          },
          {
            name: "Mexican",
            id: 73
          },
          {
            name: "Middle Eastern",
            id: 137
          },
          {
            name: "Pizza",
            id: 82
          }
        ]
      }
    ];
    const price = [
      // this is the parent or 'item'
      {
        name: "Price Range",
        id: 0,
        // these are the children or 'sub items'
        children: [
          {
            name: "$",
            id: 1
          },
          {
            name: "$$",
            id: 2
          },
          {
            name: "$$$",
            id: 3
          },
          {
            name: "$$$$",
            id: 4
          }
        ]
      }
    ];
    AsyncStorage.getItem("user").then(result => {
      if (result === null) {
        return;
      }

      var parsedResult = JSON.parse(result);
      this.setState({ username: parsedResult.username });
    });

    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.welcome}>Welcome {this.state.username}!</Text>
          <Text style={styles.pickText}>1. Choose food you like...</Text>

          {/* Selecting liked food */}

          <SectionedMultiSelect
            items={food}
            uniqueKey="id"
            subKey="children"
            selectText="Cuisines..."
            showDropDowns={false}
            readOnlyHeadings={true}
            onSelectedItemsChange={this.onSelectedItemsChangeFood}
            selectedItems={this.state.selectedFood}
            hideSearch={true}
            highlightChildren={true}
            colors={{
              primary: "#a2444a",
              success: "#a2444a",
              text: "#605152",
              subText: "#847273",
              selectToggleTextColor: "#847273",
              chipColor: "#a2444a",
              disabled: "black"
            }}
            styles={{
              selectToggle: {
                borderBottomWidth: 2,
                borderColor: "#a2444a",
                width: 300,
                marginLeft: 10,
                marginTop: 10,
                textAlign: "center"
              }
            }}
          />
          <Text style={styles.pickText}>2. Choose your range...</Text>
          <SectionedMultiSelect
            items={price}
            uniqueKey="id"
            subKey="children"
            selectText="Price ranges..."
            showDropDowns={false}
            readOnlyHeadings={true}
            onSelectedItemsChange={this.onSelectedItemsChangePrice}
            selectedItems={this.state.selectedPrice}
            hideSearch={true}
            highlightChildren={true}
            colors={{
              primary: "#a2444a",
              success: "#a2444a",
              text: "#605152",
              subText: "#847273",
              selectToggleTextColor: "#847273",
              chipColor: "#a2444a",
              disabled: "black"
            }}
            styles={{
              selectToggle: {
                borderBottomWidth: 2,
                borderColor: "#a2444a",
                width: 300,
                marginLeft: 10,
                marginTop: 10,
                textAlign: "center"
              }
            }}
          />
        </ScrollView>

        {/* Submit food and price preferences button */}
        <TouchableOpacity
          onPress={() =>
            this.submitInfo(
              this.state.username,
              this.state.selectedFood,
              this.state.selectedPrice
            )
          }
          style={styles.buttonBlack}
        >
          <Text style={styles.buttonText}> Done </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default SetProfile;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    // alignItems: "center",
    backgroundColor: "#fff4f5"
  },
  welcome: {
    marginTop: 15,
    fontSize: 25,
    fontWeight: "bold",
    color: "#605152",
    textAlign: "center"
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
    width: 300,
    marginBottom: 10,
    marginLeft: 10
  },
  pickText: {
    marginLeft: 10,
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold"
  }
});

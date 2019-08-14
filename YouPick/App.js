import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import {
  Login,
  Register,
  Home,
  SetProfile,
  Pick,
  ViewProfile,
  Restaurant
} from "./screens";
import { SCREENS } from "./constants";

const AuthNavigator = createStackNavigator(
  {
    Login: Login,
    Register: Register
  },
  { initialRouteName: SCREENS.LOGIN }
);
const Navigator = createStackNavigator(
  {
    Home: Home,
    SetProfile: SetProfile,
    Pick: Pick,
    ViewProfile: ViewProfile,
    Restaurant: Restaurant
  },
  { initialRouteName: SCREENS.HOME }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      auth: AuthNavigator,
      app: Navigator
    },
    { initialRouteName: "auth" }
  )
);

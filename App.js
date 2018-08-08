import {
  createStackNavigator,
} from 'react-navigation';
import HomeScreen from './HomeScreen';
import ViewScreen from './ViewScreen';
import CreateScreen from './CreateScreen';

export default createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  View: {
    screen: ViewScreen
  },
  Create: {
    screen: CreateScreen
  },
}, {
  initialRouteName: 'Home',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#a80000',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});
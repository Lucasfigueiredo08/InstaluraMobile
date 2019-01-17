// import { AppRegistry } from 'react-native';
// import Feed from './components/Feed';
// import Login from './screens/Login';

// export default () => {
//   AppRegistry.registerComponent('InstaluraMobile', () => Login);
// }

import { Navigation } from 'react-navigation';
import { NavigationGesture } from 'react-native-gesture-handler';
import Feed from './components/Feed';
import Login from './screens/Login';

export default () => {
  Navigation.registerComponent('Login', () => Login);
  Navigation.registerComponent('Feed', () => Feed);

  Navigation.startSingleScreenApp({
    screen: {
      screen: 'Login',
      title: 'Login'
    }
  });
}


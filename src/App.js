// import { AppRegistry } from 'react-native';
// import Feed from './components/Feed';
// import Login from './screens/Login';
// import {name as appName} from '../app.json';

// export default () => {
//   AppRegistry.registerComponent('InstaluraMobile_v2', () => Login);
// }

// import { Navigation } from 'react-navigation';
// import { NavigationGesture } from 'react-native-gesture-handler';
// import Feed from './components/Feed';
// import Login from './screens/Login';

// export default () => {
//   Navigation.registerComponent('Login', () => Login);
//   Navigation.registerComponent('Feed', () => Feed);

//   Navigation.startSingleScreenApp({
//     screen: {
//       screen: 'Login',
//       title: 'Login'
//     }
//   });
// }

import { Navigation } from 'react-native-navigation';
import { AsyncStorage } from 'react-native';
import Feed from './components/Feed';
import Login from './screens/Login';

export default () => {
  Navigation.registerComponent('navigation.playground.Feed', () => Feed);

  Navigation.registerComponent('navigation.playground.Login', () => Login);

  Navigation.registerComponent('navigation.playground.PerfilUsuario', () => Feed);

  // Navigation.events().registerAppLaunchedListener(() => {
  //   Navigation.setRoot({
  //     root: {
  //       component: {
  //         name: 'navigation.playground.Login'
  //       }
  //     }
  //   })
  // })s

  AsyncStorage.getItem('token')
    .then(token => {
      if (token) {
        Navigation.setRoot({
          root: {
            component: {
              name: 'navigation.playground.Login',
            }
          }
        })
      }
      else
      Navigation.setRoot({
        root: {
          component: {
            name: 'navigation.playground.Feed'
          }
        }
      })
    })
    .then(screen =>
      Navigation.events().registerAppLaunchedListener({ screen })
    );
}


/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/index';
import {name as appName} from './app.json';
import "./global.css"

AppRegistry.registerComponent(appName, () => App);

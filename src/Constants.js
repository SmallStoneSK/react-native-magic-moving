import {
  Dimensions
} from 'react-native';

const window = Dimensions.get('window');
const DeviceSize = {
  WIDTH: window.width,
  HEIGHT: window.height
};

export {
  DeviceSize
};
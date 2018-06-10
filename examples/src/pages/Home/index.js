import React, {PureComponent} from 'react';

import {
  View,
  StyleSheet
} from 'react-native';

import {Button} from '../../components/Button';

export class Home extends PureComponent {

  constructor(props) {
    super(props);
  }

  _onPressDemo(pageName) {
    const {navigation} = this.props;
    navigation.navigate(pageName);
  }

  onPressDemo1 = () => {
    this._onPressDemo('Demo1');
  };

  onPressDemo2 = () => {
    this._onPressDemo('Demo2');
  };

  render() {
    return (
      <View style={styles.container}>
        <Button text={'Demo1'} onPress={this.onPressDemo1}/>
        <Button text={'Demo2'} style={styles.btn} onPress={this.onPressDemo2}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    marginTop: 20
  }
});
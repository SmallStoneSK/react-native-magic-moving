import React, {Component} from 'react';

import {
  View,
  Modal,
  Animated,
  FlatList,
  UIManager,
  StyleSheet,
  ScrollView,
  findNodeHandle,
  TouchableOpacity
} from 'react-native';

import {Utils} from './Utils';
import {DeviceSize} from './Constants';

export class MagicMoving extends Component {

  constructor(props) {

    super(props);

    this.state = {
      selectedIndex: 0,
      showPopupLayer: false
    };

    this._cardRefs = [];

    this.popupAnimatedValue = new Animated.Value(0);
    this.closeAnimatedValue = new Animated.Value(0);
    this.bannerImageAnimatedValue = new Animated.Value(0);
  }

  _updateAnimatedStyles(x, y, width, height, pageX, pageY) {
    this.popupLayerStyle = {
      top: Utils.interpolate(this.popupAnimatedValue, [0, 1], [pageY, 0]),
      left: Utils.interpolate(this.popupAnimatedValue, [0, 1], [pageX, 0]),
      width: Utils.interpolate(this.popupAnimatedValue, [0, 1], [width, DeviceSize.WIDTH]),
      height: Utils.interpolate(this.popupAnimatedValue, [0, 1], [height, DeviceSize.HEIGHT])
    };
    this.closeStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute', top: 30, right: 20,
      opacity: Utils.interpolate(this.closeAnimatedValue, [0, 1], [0, 1])
    };
    this.bannerImageStyle = {
      width: Utils.interpolate(this.bannerImageAnimatedValue, [0, 1], [width, DeviceSize.WIDTH]),
      height: Utils.interpolate(this.bannerImageAnimatedValue, [0, 1], [height, DeviceSize.WIDTH * height / width])
    };
  }

  _onRequestClose = () => {
    const {onPopupLayerDidHide} = this.props;
    onPopupLayerDidHide && onPopupLayerDidHide();
  };

  _onPressCard = index => {
    UIManager.measure(findNodeHandle(this._cardRefs[index]), (x, y, width, height, pageX, pageY) => {
      this._updateAnimatedStyles(x, y, width, height, pageX, pageY);
      this.setState({
        selectedIndex: index,
        showPopupLayer: true
      }, () => {
        const {openDuration, onPopupLayerWillShow} = this.props;
        onPopupLayerWillShow && onPopupLayerWillShow(index);
        Animated.parallel([
          Animated.timing(this.closeAnimatedValue, {toValue: 1, duration: openDuration}),
          Animated.spring(this.popupAnimatedValue, {toValue: 1, friction: 6, duration: openDuration}),
          Animated.spring(this.bannerImageAnimatedValue, {toValue: 1, friction: 6, duration: openDuration})
        ]).start(() => {
          const {onPopupLayerDidShow} = this.props;
          onPopupLayerDidShow && onPopupLayerDidShow(index);
        });
      });
    });
  };

  _onPressClose = () => {
    const {closeDuration} = this.props;
    Animated.parallel([
      Animated.timing(this.closeAnimatedValue, {toValue: 0, duration: closeDuration}),
      Animated.timing(this.popupAnimatedValue, {toValue: 0, duration: closeDuration}),
      Animated.timing(this.bannerImageAnimatedValue, {toValue: 0, duration: closeDuration})
    ]).start(() => {
      this.setState({showPopupLayer: false});
    });
  };

  _renderClose = () => {
    return (
      <Animated.View style={this.closeStyle}>
        <TouchableOpacity style={styles.closeContainer} onPress={this._onPressClose}>
          <View style={[styles.forkLine, {top: +.5, transform: [{rotateZ: '45deg'}]}]}/>
          <View style={[styles.forkLine, {top: -.5, transform: [{rotateZ: '-45deg'}]}]}/>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  _renderCard = ({item, index}) => {
    const {cardStyle, renderCardContent} = this.props;
    return (
      <TouchableOpacity
        style={cardStyle}
        ref={_ => this._cardRefs[index] = _}
        onPress={() => this._onPressCard(index)}
      >
        {renderCardContent(item, index)}
      </TouchableOpacity>
    );
  };

  _renderList() {
    const {data} = this.props;
    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this._renderCard}
      />
    );
  }

  _renderPopupLayer() {
    const {data} = this.props;
    const {selectedIndex, showPopupLayer} = this.state;
    return (
      <Modal
        transparent={true}
        visible={showPopupLayer}
        onRequestClose={this._onRequestClose}
      >
        {showPopupLayer && (
          <Animated.View style={[styles.popupLayer, this.popupLayerStyle]}>
            {this._renderPopupLayerContent(data[selectedIndex], selectedIndex)}
          </Animated.View>
        )}
      </Modal>
    );
  }

  _renderPopupLayerContent(item, index) {
    const {renderPopupLayerBanner, renderPopupLayerContent} = this.props;
    return (
      <ScrollView bounces={false}>
        {renderPopupLayerBanner ? renderPopupLayerBanner(this.bannerImageStyle) : (
          <Animated.Image source={item.image} style={this.bannerImageStyle}/>
        )}
        {renderPopupLayerContent(item, index)}
        {this._renderClose()}
      </ScrollView>
    );
  }

  render() {
    const {style} = this.props;
    return (
      <View style={style}>
        {this._renderList()}
        {this._renderPopupLayer()}
      </View>
    );
  }
}

MagicMoving.defaultProps = {
  data: [],
  openDuration: 300,
  closeDuration: 300,
  renderCardContent: () => {},
  renderPopupLayerContent: () => {}
};

const styles = StyleSheet.create({
  popupLayer: {
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: '#FFF'
  },
  closeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#666'
  },
  forkLine: {
    width: 10,
    height: 1,
    backgroundColor: '#FFF'
  }
});
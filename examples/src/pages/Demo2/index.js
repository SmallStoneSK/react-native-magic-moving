import React, {PureComponent} from 'react';

import {
  View,
  Text,
  ImageBackground,
  StyleSheet
} from 'react-native';

import {mockedData} from "./MockedData";
import {Utils} from "../../common/Utils";
import {MagicMoving} from "../../components/MagicMoving";

export class Demo2 extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      popupLayerContent: '',
      hasContentLoaded: false
    };
  }

  _mockFetchingData(index) {
    Utils.waitFor(1000).then(() => {
      this.setState({
        hasContentLoaded: true,
        popupLayerContent: mockedData[index].content
      });
    });
  }

  _onPopupLayerWillShow = index => {
    this.state.hasContentLoaded && this.setState({hasContentLoaded: false});
    this._mockFetchingData(index);
  };

  _renderCardContent = item => {
    return (
      <ImageBackground style={styles.cardImage} source={item.image}>
        <View style={styles.cardMask}/>
        <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
      </ImageBackground>
    );
  };

  _renderPopupLayerContent = () => {
    if(this.state.hasContentLoaded) {
      const paragraphs = this.state.popupLayerContent.split('\n');
      return (
        <View style={styles.contentContainer}>
          {paragraphs.map((_, idx) => (
            <Text key={`p-${idx}`} style={styles.contentText}>{'\t' + _}</Text>
          ))}
        </View>
      );
    } else {
      return (
        <View style={styles.loadingContainer}>
          <Text>加载中...</Text>
        </View>
      );
    }
  };

  render() {
    return (
      <MagicMoving
        data={mockedData}
        cardStyle={styles.cardContainer}
        renderCardContent={this._renderCardContent}
        renderPopupLayerContent={this._renderPopupLayerContent}
        onPopupLayerWillShow={this._onPopupLayerWillShow}
      />
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 20,
    marginHorizontal: 20
  },
  cardImage: {
    width: 335,
    height: 200
  },
  cardMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  titleText: {
    zIndex: 1,
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 400
  },
  contentContainer: {
    marginBottom: 20,
    paddingHorizontal: 20
  },
  contentText: {
    marginTop: 20,
    fontSize: 15,
    lineHeight: 20,
    color: '#333'
  }
});
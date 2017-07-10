import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;
import Carousel from 'react-native-snap-carousel';

const MIN_SWIPE_SPEED = 0.3
const MIN_PAN_DISTANCE = 100.0
const SWIPER_HEIGHT = 154
const BOTTOM_VALUE_CLOSED = -SWIPER_HEIGHT
const BOTTOM_VALUE_OPEN = 0.0

export default class CollapsingCarousel extends Component {
  state = {
    entries: [
      {
        title: 'Satu',
      },
      {
        title: 'Dua',
      },
      {
        title: 'Tiga',
      },
      {
        title: 'Empat',
      },
    ],
    isOpen: true,
  }
  _panResponder = {}

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        // Do not allow this view to become responder on the start of a touch,
        // because we want the scroll view to handle touch first.
        return false;
      },
      onMoveShouldSetPanResponder: (event, gestureState) => {
        // Called for every touch move on the View when it is not the responder.
        // When there is obvious touch movement vertically, clain touch responsiveness.
        const {dy, vx, vy} = gestureState;
        return Math.abs(dy) > 10 || Math.abs(vy) > Math.abs(vx) + 0.3;
      },
      onPanResponderMove: (event, gestureState) => {
        // Touch moves.
        this._updateDashboardViewNativeStyle(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded

        let shouldToggle = false;
        if (this.state.isDashboardOpen) {
          if (gestureState.dy > MIN_PAN_DISTANCE || gestureState.vy > MIN_SWIPE_SPEED) {
            shouldToggle = true;
          }
        } else {
          if (gestureState.dy < -MIN_PAN_DISTANCE || gestureState.vy < -MIN_SWIPE_SPEED) {
            shouldToggle = true;
          }
        }

        if (shouldToggle) {
          // Toggle isDashboardOpen state
          LayoutAnimation.easeInEaseOut();
          this.setState({isDashboardOpen: !this.state.isDashboardOpen});
        } else {
          // Should not toggle isDashboardOpen state.
          // But dashboard may have been moved. Need to move it back.
          LayoutAnimation.easeInEaseOut();
          this._updateDashboardViewNativeStyle(0);
        }
      },
      onPanResponderTerminate: () => {
        // Another component has become the responder, so this gesture
        // should be cancelled.
        // But dashboard may have been moved. Need to move it back.
        LayoutAnimation.easeInEaseOut();
        this._updateDashboardViewNativeStyle(0);
      },
    });
  }

  render() {
    const sliderWidth = deviceWidth;
    const slides = this.state.entries.map((entry, index) => {
      return (
        <View key={`entry-${index}`} style={styles.slide}>
          <Text style={styles.title}>{ entry.title }</Text>
        </View>
      );
    });
    return (
      <View style={styles.container}>
        <View style={SWIPER_HEIGHT}>
          <Carousel
            ref={(carousel) => { this._carousel = carousel; }}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
          >
            { slides }
          </Carousel>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    width: deviceWidth,
    backgroundColor: '#ff0',
    justifyContent: 'center',

  },
});

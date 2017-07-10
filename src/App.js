import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import CollapsingCarousel from './CollapsingCarousel';

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <CollapsingCarousel />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

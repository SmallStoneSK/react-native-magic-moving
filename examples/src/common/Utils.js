export const Utils = {
  waitFor(millSeconds) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), millSeconds);
    });
  },
  interpolate(animatedValue, inputRange, outputRange) {
    if(animatedValue && animatedValue.interpolate) {
      return animatedValue.interpolate({inputRange, outputRange});
    }
  }
};
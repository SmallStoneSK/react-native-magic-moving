export const Utils = {
  interpolate(animatedValue, inputRange, outputRange) {
    if(animatedValue && animatedValue.interpolate) {
      return animatedValue.interpolate({inputRange, outputRange});
    }
  }
};
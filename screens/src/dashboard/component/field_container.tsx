import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {height, width} from '../../../constant';

interface FieldContainerProps {
  color: string;
  subColor: string;
  text: string;
  setHeight?: any | undefined;
  setWidth?: any | undefined;
}

const FieldContainer = ({
  color,
  subColor,
  text,
  setHeight,
  setWidth,
}: FieldContainerProps) => {
  const containerStyle: ViewStyle = {
    height: setHeight ?? height(10),
    width: setWidth ?? width(45),
    borderRadius: 10,
    backgroundColor: color,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const circleStyle: ViewStyle = {
    position: 'absolute',
    top: 10,
    left: 0,
    width: 110,
    height: 110,
    borderRadius: 50,
    backgroundColor: subColor,
    transform: [{translateY: -60}, {translateX: -20}],
  };
  return (
    <View style={containerStyle}>
      <View style={circleStyle} />
      <Text
        style={{
          fontSize: 19,
          fontWeight: '500',
          color: 'black',
          letterSpacing: 1,
        }}>
        {text}
      </Text>
    </View>
  );
};

export default FieldContainer;

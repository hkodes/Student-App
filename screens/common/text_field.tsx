import React from 'react';
import {Text, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {commonStyles} from '../constant';

interface TextInputsProps {
  label: string;
  hintText: string;
  text: string;
  keyboardType?: string | null;
  setText: (text: string) => void;
}

const TextInputs: React.FC<TextInputsProps> = ({
  label,
  hintText,
  text,
  setText,
  keyboardType,
}) => {
  return (
    <>
      <Text style={[commonStyles.lableText, {marginTop: '5%'}]}>{label}</Text>
      <TextInput
        style={commonStyles.inputText}
        onChangeText={text => setText(text)}
        value={text}
        placeholder={hintText}
        keyboardType={(keyboardType as any) || 'numeric'}
        maxLength={13}
      />
    </>
  );
};

export default TextInputs;

interface DisabledTextInputProps {
  label: string;
  text: string;
  keyboardType?: string | null;
}

export const DisabledTextInput: React.FC<DisabledTextInputProps> = ({
  label,
  text,
  keyboardType,
}) => {
  return (
    <>
      <Text style={[commonStyles.lableText, {marginTop: '5%'}]}>{label}</Text>
      <TextInput
        style={commonStyles.inputText}
        editable={false}
        value={text}
        keyboardType={(keyboardType as any) || 'numeric'}
        maxLength={13}
      />
    </>
  );
};

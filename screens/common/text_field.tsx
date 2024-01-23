import React from 'react';
import {KeyboardTypeOptions, Text, TextInput} from 'react-native';
import {commonStyles} from '../constant';

interface TextInputsProps {
  label: string;
  hintText: string;
  text: string;
  keyboardType?: KeyboardTypeOptions | null;
  setText: (text: string) => void;
  setBool?: (bool: boolean) => void;
  maxLength?: number;
}
const TextInputs: React.FC<TextInputsProps> = ({
  label,
  hintText,
  text,
  setText,
  keyboardType,
  setBool,
  maxLength,
}) => {
  const handleTextChange = (newText: string) => {
    setText(newText);
    if (setBool) {
      setBool(true);
    }
  };

  return (
    <>
      <Text style={[commonStyles.lableText, {marginTop: '5%'}]}>{label}</Text>
      <TextInput
        style={commonStyles.inputText}
        onChangeText={handleTextChange}
        value={text}
        placeholder={hintText}
        placeholderTextColor="grey"
        keyboardType={keyboardType || 'email-address'}
        maxLength={maxLength || undefined}
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

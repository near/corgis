import tinycolor from 'tinycolor2';

export default function genRandomColor() {
  return tinycolor.random().toHexString();
}

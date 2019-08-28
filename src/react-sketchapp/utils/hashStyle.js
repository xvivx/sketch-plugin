// @flow
import * as murmurHash from 'murmur2js';
import sortObjectKeys from './sortObjectKeys';

const hashStyle = (obj) => {
  if (obj) {
    return String(murmurHash(JSON.stringify(sortObjectKeys(obj))));
  }
  return '0';
};

export default hashStyle;

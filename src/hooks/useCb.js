import {useCallback} from 'react';

export default (callback, inputs = []) => {
  return useCallback(callback, inputs);
}

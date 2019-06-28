import React, {useRef} from 'react';
import useMount from 'react-use/lib/useMount';
import PropTypes from 'prop-types';
import Context from './Context';

const Provider = ({children}) => {
  // 首次加载
  const firstLoad = useRef(true);

  useMount(
    () => {
      // 已经加载之后将首次加载设置为false
      firstLoad.current = false;
    },
  );

  return (
    <Context.Provider value={{firstLoad}}>
      {children}
    </Context.Provider>
  )
};

Provider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Provider;

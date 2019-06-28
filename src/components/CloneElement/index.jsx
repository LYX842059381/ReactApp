import React, {cloneElement, forwardRef} from 'react';
import PropTypes from 'prop-types';

const CloneElement = forwardRef(({component, children, ...restProps}, ref) => {
  if (!component) {
    return null;
  }
  return cloneElement(component, {...restProps, ref}, children);
});


CloneElement.propTypes = {
  component: PropTypes.element,
  children: PropTypes.any,
};

CloneElement.defaultProps = {
  children: null,
  component: <div/>,
};

export default CloneElement;

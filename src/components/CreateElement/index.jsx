import {createElement, forwardRef} from 'react';
import PropTypes from 'prop-types';

const CreateElement = forwardRef((props, ref) => {
  const {
    component,
    children,
    ...restProps
  } = props;

  return createElement(
    component,
    {
      ...restProps,
      ref,
    },
    children,
  );
});


CreateElement.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ]),
  children: PropTypes.any,
};

CreateElement.defaultProps = {
  children: null,
  component: 'div',
};

export default CreateElement;

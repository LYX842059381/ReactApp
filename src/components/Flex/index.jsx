import React, {forwardRef} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CreateElement from '@/components/CreateElement';
import {
  AUTO,
  ROW,
} from '@/utils/constant';
import './styles/style.module.less';

const Flex = forwardRef(
  (props, ref) => {
    const {
      className,
      size,
      mode,
      align,
      justify,
      flex,
      wrap,
      ...other
    } = props;
    return (
      <CreateElement
        {...other}
        ref={ref}
        className={className}
        styleName={classnames({
          root: true,
          [align]: align,
          [justify]: justify,
          [`flex-${flex}`]: flex != null,
          [mode]: mode && mode !== ROW,
          [size]: size && size !== AUTO,
          wrap,
        })}
      />
    )
  },
);

Flex.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['fill', 'auto', 'width-fill', 'height-fill']),
  mode: PropTypes.oneOf(['row', 'column']),
  align: PropTypes.oneOf(['top', 'middle', 'bottom']),
  justify: PropTypes.oneOf(['start', 'center', 'end', 'space-between', 'space-around']),
  flex: PropTypes.oneOf([0, 1]),
  wrap: PropTypes.bool,
  component: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.func,
  ]),
};

export default Flex;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import {
  XL,
  LG,
  MD,
  SM,
  XS,
  XXS,
  XXXS,
} from '@/utils/constant';
import Font from './Font';
import './styles/styles.module.less';

const Icon = (props) => {
  const {
    className,
    size,
    style,
    color,
    ...other
  } = props;

  let isCustomSize;

  if ((isString(size)
    && size !== XL
    && size !== LG
    && size !== MD
    && size !== SM
    && size !== XS
    && size !== XXS
    && size !== XXXS)
    || isNumber(size)) {
    isCustomSize = 1;
  }

  let isCustomColor;

  if (isString(color) && color !== 'primary') {
    isCustomColor = 1;
  }

  return (
    <Font
      {...other}
      style={{
        ...style,
        color: isCustomColor ? color : null,
        fontSize: isCustomSize ? `${size / 100}rem` : null,
      }}
      className={className}
      styleName={classnames({
        [size]: !isCustomSize,
        'custom-icon': true,
        [color]: color && !isCustomColor,
      })}
    />
  );
};

Icon.propTypes = {
  style: PropTypes.object,
  type: PropTypes.string,
  className: PropTypes.string,
  source: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  color: PropTypes.string,
};

Icon.defaultProps = {
  size: 'md',
};

export default Icon;

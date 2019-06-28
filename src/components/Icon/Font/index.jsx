import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './fonts/iconfont.module.less';

const Font = (props) => {
  const {
    type,
    className,
    source,
    ...other
  } = props;

  return (
    <i
      {...other}
      className={className}
      styleName={classnames({
        [source]: true,
        [`icon-${type}`]: type,
      })}
    />
  );
};

Font.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  source: PropTypes.string,
};

Font.defaultProps = {
  source: 'iconfont',
};

export default Font;

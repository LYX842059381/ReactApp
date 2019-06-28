import React, {memo, useState} from 'react';
import PropTypes from 'prop-types';
import equal from '@/utils/equal';
import Common from '../Common';

const Spin = memo(
  ({loading, toast, ...props}) => {
    const [iconProps] = useState({
      type: 'loading',
    });

    return (
      <Common
        {...props}
        closeable={toast}
        toast={toast}
        iconProps={iconProps}
        show={loading}
      />
    )
  },
  equal,
);

Spin.propsTypes = {
  text: PropTypes.any,
  toast: PropTypes.bool,
  fill: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

Spin.defaultProps = {
  text: '数据加载中',
  toast: true,
};

export default Spin;

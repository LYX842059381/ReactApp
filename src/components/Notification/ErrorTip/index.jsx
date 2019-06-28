import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useBack} from '@/hooks/router';
import Common from '../Common';

const ErrorTip = ({error, toast, ...props}) => {
  const [iconProps] = useState({
    toast: {
      type: 'fail',
    },
    default: {
      type: 'cross-circle',
      color: '#000',
    },
  });

  const goBack = useBack();

  return (
    <Common
      {...props}
      closeable={toast}
      iconProps={toast ? iconProps.toast : iconProps.default}
      show={!!error}
      text={error}
      toast={toast}
      onClose={goBack}
    />
  )
};

ErrorTip.propsTypes = {
  text: PropTypes.any,
  toast: PropTypes.bool,
  fill: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
  error: PropTypes.string,
};

ErrorTip.defaultProps = {
  toast: true,
};

export default ErrorTip;

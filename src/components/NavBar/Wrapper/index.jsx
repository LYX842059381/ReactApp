import React from 'react';
import classnames from 'classnames';
import {platform} from '@/utils/platform';
import {isApp} from '@/config';
import './styles/style.module.less';

const Wrapper = ({className, ...props}) => {
  return (
    <div
      {...props}
      className={className}
      styleName={classnames({
        wrap: true,
        [platform]: platform && isApp,
      })}
    />
  )
};

export default Wrapper;

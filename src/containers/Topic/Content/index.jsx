import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import useEvents from '@/hooks/useEvents';
import './styles/style.module.less';

const Content = ({content, className, ...props}) => {
  const wrapper = useRef();

  useEvents(wrapper);

  return (
    <div
      {...props}
      className={className}
      ref={wrapper}
      styleName="content"
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
};

Content.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
};

export default Content;

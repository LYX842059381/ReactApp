import React, {memo, useState} from 'react';
import PropTypes from 'prop-types';
import useMount from 'react-use/lib/useMount';
import classnames from 'classnames';
import {Link} from 'react-router-dom';
import Flex from '@/components/Flex';
import equal from '@/utils/equal';
import {LG} from '@/utils/constant';
import avatar from './images/avatar.gif';
import './styles/style.module.less';

const Avatar = memo(
  ({username, url, size}) => {
    // 首先展示默认图片
    const [imgSrc, set] = useState(avatar);

    useMount(
      () => {
        // 加载图片
        const img = new Image();
        img.src = url;

        // 加载完成监听函数 加载完成设置 src为要显示的url
        const onLoad = () => set(url);

        // 监听事件
        img.addEventListener('load', onLoad);

        return () => {
          // 解除事件
          img.removeEventListener('load', onLoad);
        }
      }
    );

    return (
      <Flex
        component={Link}
        flex={0}
        styleName={classnames({
          avatar: true,
          lg: size === LG,
        })}
        to={`/user/${username}`}
      >
        <img src={imgSrc} alt={username}/>
      </Flex>
    );
  },
  equal,
);

Avatar.propTypes = {
  username: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['lg']),
};

export default Avatar;

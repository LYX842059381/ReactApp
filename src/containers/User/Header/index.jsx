import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {Link} from 'react-router-dom';
import Flex from '@/components/Flex';
import Avatar from '@/containers/Home/TabPanel/ListItem/Avatar';
import {LG, TOP} from '@/utils/constant';
import './styles/style.module.less';

dayjs.extend(relativeTime);

const Header = ({data}) => {
  return (
    <div styleName="header">
      <Flex align={TOP}>
        <Avatar username={data.loginname} url={data.avatar_url} size={LG} />
        <span styleName="user">
          {data.loginname}
        </span>
      </Flex>
      <Flex styleName="collect">
        <Link to={`/collect/${data.loginname}`}>
          点击查看他的收藏
        </Link>
      </Flex>
      <Flex styleName="score">
        <span>
          {data.score}
        </span>
        积分
      </Flex>
      <Flex styleName="sign-time">
        注册时间
        <span>
          {dayjs(data.create_at).toNow()}
        </span>
      </Flex>
    </div>
  );
};

Header.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Header;

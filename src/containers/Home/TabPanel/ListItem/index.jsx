import React, {memo} from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import {Link} from 'react-router-dom';
import Flex from '@/components/Flex';
import Show from '@/components/Show';
import equal from '@/utils/equal';
import {
  BOTTOM,
  END,
  HEIGHT_FILL,
  MIDDLE,
} from '@/utils/constant';
import Catogory from './Catogory';
import Avatar from './Avatar';
import './styles/style.module.less';

dayjs.locale('zh-cn');

dayjs.extend(relativeTime);

const ListItem = memo(
  ({data}) => {
    const {author, good, top} = data;

    const {loginname} = author;

    return (
      <Flex styleName="item" align={MIDDLE}>
        <Avatar username={loginname} url={author.avatar_url} />
        <Flex
          component={Link}
          align={MIDDLE}
          styleName="center"
          flex={1}
          to={`/topic/${data.id}`}
        >
          <Catogory top={top} good={good} tab={data.tab} />
          <div styleName="text">
            <h3 styleName="title">
              {data.title}
            </h3>
            <Show show={data.reply_count != null && data.visit_count != null}>
              <p styleName="info">
                <span styleName="reply">
                  {data.reply_count}
                </span>
                <span styleName="count">
                  /
                  {data.visit_count}
                </span>
              </p>
            </Show>
          </div>
        </Flex>
        <Flex justify={END} flex={0} size={HEIGHT_FILL} styleName="time" align={BOTTOM}>
          {dayjs(data.last_reply_at).toNow()}
        </Flex>
      </Flex>
    );
  },
  equal,
);

ListItem.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ListItem;

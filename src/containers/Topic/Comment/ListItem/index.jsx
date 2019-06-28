import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {Link} from 'react-router-dom';
import Flex from '@/components/Flex';
import Show from '@/components/Show';
import Icon from '@/components/Icon';
import Avatar from '@/containers/Home/TabPanel/ListItem/Avatar';
import useEvents from '@/hooks/useEvents';
import {MIDDLE, TOP, WIDTH_FILL, XXS} from '@/utils/constant';
import './styles/style.module.less';

dayjs.extend(relativeTime);

const ListItem = ({data, index}) => {
  const wrapper = useRef();
  useEvents(wrapper);

  const {author} = data;

  const {loginname} = author;

  return (
    <div styleName="item" id={data.id}>
      <Flex align={TOP} size={WIDTH_FILL}>
        <Avatar url={author.avatar_url} username={loginname}/>
        <Flex align={MIDDLE} styleName="userinfo" flex={1}>
          <Link styleName="user" to={`/user/${loginname}`}>
            {loginname}
          </Link>
          <a styleName="reply" href={`#${data.id}`}>
            {index + 1}
            楼•
            {dayjs(data.create_at).toNow()}
          </a>
          <Show show={!!data.reply_id}>
            <span styleName="author">
              作者
            </span>
          </Show>
        </Flex>
        <Flex
          styleName="operate"
          flex={0}
          align={MIDDLE}
        >
          <Icon
            type={data.is_uped ? 'communityiconpraisesel' : 'communityiconpraise4'}
            color="#000"
            styleName={classnames({
              active: data.is_uped,
            })}
            size={XXS}
          />
          <span>
            {data.ups.length}
          </span>
          <Icon type="share" size={XXS} color="#000"/>
        </Flex>
      </Flex>
      <div ref={wrapper} styleName="content" dangerouslySetInnerHTML={{__html: data.content}} />
    </div>
  );
};

ListItem.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default ListItem;

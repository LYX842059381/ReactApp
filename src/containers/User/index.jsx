import React, {useRef} from 'react';
import PullWrapper from '@/components/Pull/Wrapper';
import Notification from '@/components/Notification';
import usePage from '@/hooks/usePage';
import {getUserInfo} from '@/action';
import {useParams} from '@/hooks/router';
import Header from './Header';
import RecentlyReplies from './RecentlyReplies';
import RecentlyTopics from './RecentlyTopics';
import './styles/style.module.less';

const User = () => {
  const params = useParams();
  const scroller = useRef();

  const {id} = params;

  const {
    state,
    loading,
    error,
    pageInfo,
  } = usePage({
    action: getUserInfo,
    key: 'userInfo',
    id,
    params,
    url: id,
    scroller,
    isPage: true,
  });

  const {data} = state;

  return (
    <PullWrapper ref={scroller} pageInfo={pageInfo}>
      <Notification
        fill
        loading={loading}
        state={state}
        error={error}
      >
        <div styleName="user">
          <Header data={data}/>
          <RecentlyTopics data={data.recent_topics}/>
          <RecentlyReplies data={data.recent_replies}/>
        </div>
      </Notification>
    </PullWrapper>
  );
};

export default User;

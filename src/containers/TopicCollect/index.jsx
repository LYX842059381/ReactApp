import React, {useRef} from 'react';
import PullWrapper from '@/components/Pull/Wrapper';
import Notification from '@/components/Notification';
import ListItem from '@/containers/Home/TabPanel/ListItem';
import usePage from '@/hooks/usePage';
import {getTopicCollect} from '@/action';
import {useParams} from '@/hooks/router';

const TopicCollect = () => {
  const params = useParams();
  const scroller = useRef();

  const {id} = params;

  const {
    state,
    loading,
    error,
    pageInfo,
  } = usePage({
    action: getTopicCollect,
    key: 'topicCollect',
    id,
    params,
    url: id,
    scroller,
    isPage: true,
  });

  return (
    <PullWrapper pageInfo={pageInfo} ref={scroller}>
      <Notification
        fill
        loading={loading}
        state={state}
        error={error}
      >
        {
          state.data.map(item => (
            <ListItem data={item} key={item.id}/>
          ))
        }
      </Notification>
    </PullWrapper>
  );
};

export default TopicCollect;

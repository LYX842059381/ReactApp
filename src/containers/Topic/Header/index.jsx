import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd-mobile';
import {Link} from 'react-router-dom';
import {useDispatch} from 'redux-react-hook';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Flex from '@/components/Flex';
import Catogory from '@/containers/Home/TabPanel/ListItem/Catogory';
import useClosure from '@/hooks/useClosure';
import useToast from '@/hooks/useToast';
import {useParams} from '@/hooks/router';
import {setCollect, setDelCollect} from '@/action';
import {END, MIDDLE, TOP} from '@/utils/constant';
import equal from '@/utils/equal';
import {getCatogory} from '@/utils/utils';
import './styles/style.module.less';

dayjs.extend(relativeTime);

const Topic = memo(
  ({data}) => {
    const {is_collect: isCollect} = data;

    const toast = useToast();
    const {id} = useParams();
    const dispatch = useDispatch();

    const onClick = useClosure(
      async () => {
        toast.loading('提交中', 30);
        toast.fail('提交超时', 2, 30);
        try {
          const params = {topic_id: id};
          const result = isCollect ? await setDelCollect(params) : await setCollect(params);
          dispatch(result);
          toast.success(isCollect ? '取消收藏成功' : '收藏成功', 2);
        } catch (e) {
          toast.fail(isCollect ? '取消收藏失败' : '收藏失败', 2);
          if (__DEV__) {
            console.error(e) // eslint-disable-line
          }
        }
      },
    );

    return (
      <div styleName="header">
        <Flex component="h1" align={TOP} styleName="title">
          <Catogory styleName="catogory" good={data.good} top={data.top} tab={data.tab}/>
          <span>{data.title}</span>
        </Flex>
        <div styleName="infos">
          <span>
            {` 发布于 ${dayjs(data.create_at).toNow()} `}
          </span>
          <span>
            {` 作者 `}
            <Link to={`/user/${data.author.loginname}`}>
              {data.author.loginname}
            </Link>
            {' '}
          </span>
          <span>
            {`${data.visit_count} 次浏览 `}
          </span>
          <span>
            {` 来自 ${getCatogory(data.tab)} `}
          </span>
        </div>
        <Flex align={MIDDLE} justify={END}>
          <Button onClick={onClick} styleName="btn" type={isCollect ? 'ghost' : 'primary'}>
            {isCollect ? '取消收藏' : '收藏'}
          </Button>
        </Flex>
      </div>
    );
  },
  equal,
);

Topic.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Topic;

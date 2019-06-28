# 创建action

## compose 函数
utils/compose.js
```javascript
  const compose = (...funcs) => {
    if (funcs.length === 0) {
      return arg => arg;
    }
  
    if (funcs.length === 1) {
      return funcs[0];
    }
  
    return funcs.reduce((a, b) => {
      return (...args) => {
        const res = b(...args);
        if (res instanceof ComposeResult) {
          return a(...res.toArray());
        }
        return a(res);
      };
    });
  };
```

+ 此函数接收n个函数 并返回一个新的函数
+ 新的函数执行时会从最后一个函数开始执行
+ 并将前一个执行的结果作为参数传给下一个函数
+ 返回多个参数时返回 new ComposeResult(...args)

## 本项目 action 创建方式

### 例子

action/index.js
```javascript
  // 用户收藏的主题
  // https://cnodejs.org/api/v1/topic_collect/alsotang
  // 入参
  // params {Object?} 请求参数
  // url {String?} 请求的url 主要用于某些不使用查询字符串传递 参数的接口
  export const getTopicCollect = compose(
    actionCreater(TOPIC_COLLECT),
    checkRequestSuccess,
    http,
    packGetMethod,
    packGetParams('topic_collect/'),
    packAccessToken,
    packDefaultParams,
  );
```

### 执行逻辑

> 接收参数
params: {id: 'i5ting'};
url: 'i5ting';

+ 首先执行 packDefaultParams 函数 添加一个默认的参数
```javascript
  export const packDefaultParams = (params = {}, ...other) => {
    return new ComposeResult(
      {
        mdrender: true,
        ...params,
      },
      ...other,
    );
  };
```

> 执行结果 
params: {
  mdrender: true,
  id: 'i5ting'
};
url: 'i5ting';

+ 再执行 packAccessToken 函数添加 token 到请求参数中
```javascript
  export const packAccessToken = (params, ...other) => {
    return new ComposeResult(
      {
        ...params,
        accesstoken: 'f35da212-9372-42d0-bd61-8f02e6bb70ae',
      },
      ...other,
    );
  };
```


> 执行结果 
params: {
  mdrender: true,
  accesstoken: 'f35da212-9372-42d0-bd61-8f02e6bb70ae',
  id: 'i5ting'
};
url: 'i5ting';

+ 再执行 packGetParams('topic_collect/') 函数将参数拼装成可供 axios 直接发起请求的格式
+ 此函数使用 柯里化 简化函数层级
```javascript
  export const packGetParams = curry(
    (baseUrl, params, url = '') => {
      return {
        url: `${baseUrl}${url}`,
        params,
      };
    },
  );
```

> 执行结果 
{
  url: '/topic_collect/i5ting',
  params: {
    mdrender: true,
    accesstoken: 'f35da212-9372-42d0-bd61-8f02e6bb70ae',
    id: 'i5ting'
  },
}

+ 再执行 packGetMethod 函数将请求类型设置为 get
```javascript
  export const packGetMethod = (opts = {}) => {
    return {
      ...opts,
      method: 'get',
    };
  };
```

> 执行结果 
{
  method: 'get',
  url: '/topic_collect/i5ting',
  params: {
    mdrender: true,
    accesstoken: 'f35da212-9372-42d0-bd61-8f02e6bb70ae',
    id: 'i5ting'
  },
}

+ 再执行 http 函数发出 http 请求

文件路径 utils/http.js 
函数 httpCreater

> 执行结果为 axios 的 response 对象
https://github.com/axios/axios

+ 再执行 checkRequestSuccess 函数检查请求是否成功
```javascript
  export const checkRequestSuccess = async (response) => {
    const res = await response;
    const {payload, ...rest} = res;
    const {success, error_msg: errorMsg} = payload;
    if (success) {
      return {
        ...rest,
        payload: payload.data,
      };
    }
    throw createError(errorMsg || '请求出错');
  };
```

> 执行结果 
{
  params: {
    mdrender: true,
    id: 'i5ting',
    accesstoken: 'f35da212-9372-42d0-bd61-8f02e6bb70ae'
  },
  payload: [
    {
      id: '5ae140407b0e8dc508cca7cc',
      author_id: '573ab7ba542374db1db0a436',
      tab: 'share',
      content: '### 【6.12更新】 ###\r\nPPT已上传： https://github.com/NodePartyShanghai/party\r\n文章/视频施工中\r\n\r\n### 【议程安排】 ###\r\n本次NodeParty将于2018年6月9日在上海市静安区新闸路1418号，冠生园大厦5楼会议室举行\r\n13:00 签到入场\r\n13:30-16:30 主题分享\r\n16:30-17:30 自由交流\r\n\r\n### 【报名】 ###\r\n添加我的微信 aojiaotage ，注明 NodeParty 即可，下面是我微信的二维码\r\n![image.png](//static.cnodejs.org/FjXp42hBbGGTrv_fnQUGxmX3RUeA)\r\n\r\n### 【分享简介】 ###\r\n#### Node.js构建游戏服务器集群的思考 - 毛明超 #### \r\n分享者简介：15年游戏开发经验，2015年开始使用Node.js开发高性能服务器集群，精通服务端开发和项目架构设计\r\n\r\n#### Difficulty and Complexity - kyicy ####\r\n分享者简介：PwC team leader，擅长Go和JavaScript\r\n\r\n#### AnyProxy， 基于node的一种可编程代理实现 -  砚然 ####\r\n分享者简介：蚂蚁金服高级前端工程师，AnyProxy开源项目成员\r\n\r\n#### GraphQL实践 - timqian ####\r\n分享者简介：Modelo 后端工程师，star-history，gql-generator 作者\r\n\r\n#### Node.js在自动化测试中的全面应用 - 经致远 ####\r\n分享者简介：聆播科技CEO，曾任惠普软件研发经理和微软高级开发经理，负责多款自动化产品的中国区研发，包括LoadRunner、QTP/UFT、Mobile Center等\r\n\r\n#### A Beginner’s Guide to the Internet of Things---How to lifehack your life with Node.js and IoT clouds-Grant Dawson ####\r\n分享者简介：17 years of experience hacking online games, VR and 3D mapping. UwoTec CTO. Nominated as an Alibaba Cloud MVP and speaker for the 2050 New Generation conference.\r\n\r\n### 赞助商详情 ###\r\n本次活动由于报名人数大于预期，我们临时更换了付费场地以容纳更多与会者，十分感谢以下公司无私的场地赞助、人力赞助（排名不分先后）\r\n\r\n#### 考拉优教 ####\r\n考拉优教（我司）专注于为中国家庭提供多元化儿童素质教育服务平台，为百万用户提供多样的素质教育优质内容\r\n\r\n#### 游密通讯云 ####\r\n游密科技成立于2015年，其核心团队曾在腾讯、盛大、华为从事音视频通讯开发与管理16年。短短3年间，服务的用户数量突破10亿，游密也成为全球音视频通讯云服务的领先者！\r\n\r\n#### 数数科技 ####\r\n数数科技是一家专业的大数据服务公司，为客户提供舆情分析与监控、深度用户行为分析平台、以及专业的咨询服务和行业解决方案等一站式服务，赋予客户数据驱动的能力。',
      title: '【NODE PARTY】【上海】【已结束】PPT已上传',
      last_reply_at: '2018-07-25T07:23:38.281Z',
      good: false,
      top: false,
      reply_count: 243,
      visit_count: 16688,
      create_at: '2018-04-26T02:58:08.067Z',
      author: {
        loginname: 'aojiaotage',
        avatar_url: 'https://avatars3.githubusercontent.com/u/8339316?v=4&s=120'
      }
    }
  ],
}

+ 再执行 actionCreater(TOPIC_COLLECT) 将 TOPIC_COLLECT 添加为 actionType

> 执行结果 
{
  params: {
    mdrender: true,
    id: 'i5ting',
    accesstoken: 'f35da212-9372-42d0-bd61-8f02e6bb70ae'
  },
  payload: [
    {
      id: '5ae140407b0e8dc508cca7cc',
      author_id: '573ab7ba542374db1db0a436',
      tab: 'share',
      content: '### 【6.12更新】 ###\r\nPPT已上传： https://github.com/NodePartyShanghai/party\r\n文章/视频施工中\r\n\r\n### 【议程安排】 ###\r\n本次NodeParty将于2018年6月9日在上海市静安区新闸路1418号，冠生园大厦5楼会议室举行\r\n13:00 签到入场\r\n13:30-16:30 主题分享\r\n16:30-17:30 自由交流\r\n\r\n### 【报名】 ###\r\n添加我的微信 aojiaotage ，注明 NodeParty 即可，下面是我微信的二维码\r\n![image.png](//static.cnodejs.org/FjXp42hBbGGTrv_fnQUGxmX3RUeA)\r\n\r\n### 【分享简介】 ###\r\n#### Node.js构建游戏服务器集群的思考 - 毛明超 #### \r\n分享者简介：15年游戏开发经验，2015年开始使用Node.js开发高性能服务器集群，精通服务端开发和项目架构设计\r\n\r\n#### Difficulty and Complexity - kyicy ####\r\n分享者简介：PwC team leader，擅长Go和JavaScript\r\n\r\n#### AnyProxy， 基于node的一种可编程代理实现 -  砚然 ####\r\n分享者简介：蚂蚁金服高级前端工程师，AnyProxy开源项目成员\r\n\r\n#### GraphQL实践 - timqian ####\r\n分享者简介：Modelo 后端工程师，star-history，gql-generator 作者\r\n\r\n#### Node.js在自动化测试中的全面应用 - 经致远 ####\r\n分享者简介：聆播科技CEO，曾任惠普软件研发经理和微软高级开发经理，负责多款自动化产品的中国区研发，包括LoadRunner、QTP/UFT、Mobile Center等\r\n\r\n#### A Beginner’s Guide to the Internet of Things---How to lifehack your life with Node.js and IoT clouds-Grant Dawson ####\r\n分享者简介：17 years of experience hacking online games, VR and 3D mapping. UwoTec CTO. Nominated as an Alibaba Cloud MVP and speaker for the 2050 New Generation conference.\r\n\r\n### 赞助商详情 ###\r\n本次活动由于报名人数大于预期，我们临时更换了付费场地以容纳更多与会者，十分感谢以下公司无私的场地赞助、人力赞助（排名不分先后）\r\n\r\n#### 考拉优教 ####\r\n考拉优教（我司）专注于为中国家庭提供多元化儿童素质教育服务平台，为百万用户提供多样的素质教育优质内容\r\n\r\n#### 游密通讯云 ####\r\n游密科技成立于2015年，其核心团队曾在腾讯、盛大、华为从事音视频通讯开发与管理16年。短短3年间，服务的用户数量突破10亿，游密也成为全球音视频通讯云服务的领先者！\r\n\r\n#### 数数科技 ####\r\n数数科技是一家专业的大数据服务公司，为客户提供舆情分析与监控、深度用户行为分析平台、以及专业的咨询服务和行业解决方案等一站式服务，赋予客户数据驱动的能力。',
      title: '【NODE PARTY】【上海】【已结束】PPT已上传',
      last_reply_at: '2018-07-25T07:23:38.281Z',
      good: false,
      top: false,
      reply_count: 243,
      visit_count: 16688,
      create_at: '2018-04-26T02:58:08.067Z',
      author: {
        loginname: 'aojiaotage',
        avatar_url: 'https://avatars3.githubusercontent.com/u/8339316?v=4&s=120'
      }
    }
  ],
  type: 'TOPIC_COLLECT'
}

+ 再使用 dispatch 函数发出派发 action 执行结束

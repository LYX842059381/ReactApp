import axios from 'axios';
import curry from 'lodash/curry';
import '@babel/runtime-corejs2/core-js/array/is-array';
import {ComposeResult} from '@/utils/compose';
import {defaultHttpOptions} from '@/config';

// 创建错误
export const createError = (message, code) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

// 创建一个 axios 实例
const axiosInstance = axios.create(defaultHttpOptions);

// 检查mas后台处理是否成功
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

// 包装请求函数
export const httpCreater = curry(async (instance, options) => {
  const {originParams, ...opts} = options;
  try {
    const res = await instance(opts);
    if (__DEV__) {
      console.log(res.config.url, res); // eslint-disable-line
    }
    const {status} = res;
    // 判断此次请求是否成功
    if ((status >= 200 && status < 300) || status === 304) {
      const {data, params} = res.config;
      return {
        payload: res.data,
        params: originParams || params,
        data,
      };
    }
    // http 状态码 不在 200 - 299 之间 或者为 304 抛出错误
    const err = createError('request error');
    // 将 response 对象挂载在错误对象上 用于错误处理
    err.response = res;
    throw err;
  } catch (e) {
    // 错误处理
    const {response} = e;
    // 存在 response 对象 解析 response 对象
    if (response) {
      const {data, status: resStatus} = response;
      const {error_msg: errorMsg} = data;
      // 后台 主动抛出错误
      if (resStatus < 500 && data && errorMsg) {
        throw createError(errorMsg, resStatus);
      }
      // 后台 出错
      if (resStatus >= 500 && resStatus < 600) {
        throw createError('后台处理出错', resStatus);
      }
      // 未知
      throw createError('请求出错');
    }
    // 网络连接失败
    if (e.message === 'Network Error') {
      throw createError('网络错误');
    }
    // 超时
    if (e.code === 'ECONNABORTED') {
      throw createError('请求超时');
    }
    // 未知
    throw createError('请求出错');
  }
});

export const http = httpCreater(axiosInstance);

export const packPostParams = curry(
  /**
   * 适配post请求
   * @param baseUrl 请求公共路径
   * @param url 请求url
   * @param data 请求体数据
   * @param params url 查询字符串
   * @returns {{data: *, params, url: string}}
   */
  (baseUrl, data, url = '', params = {}) => {
    return {
      url: `${baseUrl}${url}`,
      params,
      data,
    };
  },
);

// 包装http请求配置 添加 post method
export const packPostMethod = (opts = {}) => {
  return {
    ...opts,
    method: 'post',
  };
};


/**
 * 适配get请求
 * @param baseUrl 请求公共路径
 * @param url 请求url
 * @param params url 查询字符串
 * @returns {{data: *, params, url: string}}
 */
export const packGetParams = curry(
  (baseUrl, params, url = '') => {
    return {
      url: `${baseUrl}${url}`,
      params,
    };
  },
);

// 包装http请求配置 添加 get method
export const packGetMethod = (opts = {}) => {
  return {
    ...opts,
    method: 'get',
  };
};

// 包装默认参数 不渲染成 html
export const packDefaultParams = (params = {}, ...other) => {
  return new ComposeResult(
    {
      mdrender: true,
      ...params,
    },
    ...other,
  );
};

// 包装分页列表的默认参数
export const pageListParams = (params = {}, ...other) => {
  return new ComposeResult(
    {
      page: 1,
      limit: 15,
      ...params,
    },
    ...other,
  );
};

// 从参数中 提取 reducer 需要使用的 id
export const packRequestId = curry(
  (paramsKey, key, options) => {
    const {
      originParams,
      ...rest
    } = options;

    const p = originParams || options[paramsKey];

    if (!p) {
      return options;
    }

    return {
      ...rest,
      originParams: {
        ...p,
        id: p[key],
      }
    }
  },
);

export const packRequestIdFromParams = packRequestId('params');
export const packRequestIdFromData = packRequestId('data');

// 在get请求参数中添加 token
export const packAccessToken = (params, ...other) => {
  return new ComposeResult(
    {
      ...params,
      accesstoken: 'f35da212-9372-42d0-bd61-8f02e6bb70ae',
    },
    ...other,
  );
};

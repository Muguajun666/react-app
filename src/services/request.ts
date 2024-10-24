import axios, {AxiosInstance} from 'axios';
import {API_BASE_URL, TIMEOUT} from '@env';

const service: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  withCredentials: true,
});

service.interceptors.request.use(
  config => {
    // 配置token
    config.headers['Accept-Language'] = 'en-US';
    // config.headers['Authorization'] = conf.getToken()
    return config;
  },
  error => {
    // 请求错误处理
    console.log(error);
  },
);

service.interceptors.response.use(
  res => {
    const {data} = res;
    console.log('response', data);
    // if (!data.success) {

    // }
    return data;
  },
  error => {
    console.log('error', error);
    if (error.response.status === 401) {
      // conf.removeToken()
    }
  },
);
export default service;

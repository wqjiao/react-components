/*
 * @Author: wqjiao 
 * @Date: 2018-11-30 16:21:03 
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-02-18 16:31:18
 * @Description: axios
 * @Use
    import $axios from '../../utils/http';
    $axios({
        url: url,
        type: 'get',
        params: params
    }).then(res => {
        console.log(res);
    })
 */
import axios from 'axios';
import { API_BASE_URL } from '../constants/constant';

// 配置axios的默认URL
axios.defaults.baseURL = API_BASE_URL;
// 配置超时时间
axios.defaults.timeout = 5000;
// 标识这是一个 ajax 请求
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// 配置请求拦截
axios.interceptors.request.use(config => {
    // 在这里对请求的数据进行处理
    // if () {
        
    // }
    return config;
}, function (err) {
    //Do something with response error
    return Promise.reject(err);
})

// 配置相应 axios 拦截器
axios.interceptors.response.use(response => {
    // 在这里你可以判断后台返回数据携带的请求码
    console.log('请求处理', response)
    // if (response.status === 200 || response.status === '200') {
    if (response.data.success === true || response.data.success === 'true') {
        return response.data.data || response.data;
    } else {
        // 非200请求抱错
        throw Error(response.data.msg || '服务异常');
    }

}, function (err) {
    return Promise.reject(err);
})

const $axios = axios;

export default $axios;

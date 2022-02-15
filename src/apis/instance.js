import axios from 'axios'
// import router from '@/router'
import { Message } from 'element-ui'

const instance = axios.create({
    time: 1000 * 60,
    withCredentials: true,
    baseURL: 'https://vue-music-trtst-com.vercel.app/'
})
instance.defaults.withCredentials = true
instance.defaults.validateStatus = function () {
    return true
}
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config
}, function (error) {
    // 对请求错误做些什么
    Message.error({ message: '请求超时!' })
    return Promise.reject(error)
})
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    const status = response.status
    // 在发送请求之前做些什么
    if (status === 200) {
        return Promise.resolve(response)
    } else if (status === 301) {
        Message.error({ message: '请先登录!' })
        // router.replace({
        //     path: 'login'
        // })
        return false
    } else {
        return Promise.reject(response)
    }
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
})

const ajaxMethod = ['get', 'post']
const api = {}
ajaxMethod.forEach(method => {
    // 数组取值的两种方式
    api[method] = function (uri, data, config) {
    return new Promise(function (resolve, reject) {
        instance[method](uri, data, config)
        .then(response => {
            if (response.status === 200) {
                resolve(response)
            }
        })
        .catch(error => {
            reject(error)
        })
    })
    }
})

export default api

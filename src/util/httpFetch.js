import {message, notification} from 'antd';
import hash from 'hash.js';
import LoginCheck from 'Public/LoginCheck/index'
//检测数据类型 ，返回对应数据类型的名称
function dataTypeTest (item) {
    const types = Object.keys(data_types);
    for (let index = 0; index < types.length; index++) {
        const key = types[index];
        const value = Object.prototype.toString.call(item);
        if (
            value === data_types[key] ||
            (Object.prototype.toString.call(data_types[key]) == "[object RegExp]" && data_types[key].test(value))
        ) {
            return key;
        }
    }
};
/**
 * 判断是否为空,支持任何数据
 * <pre>
 *     如果为undefined直接返回false
 *     1. 字符串判断是否为空字符串
 *     2. 如果是数组,判断长度是否到位0
 *     3.如果是对象,判断是否有key
 * </pre>
 * @param data
 */
function isEmpty(data) {
    let type = dataTypeTest(data);
    switch (type) {
        case "undefined":
        case "null":
            return true;
        case "string":
            let trimData = trim(data);
            return trimData === "";
        case "object":
        case "map":
            return Object.keys(data).length === 0;
        case "array":
        case "set":
            return data.length === 0;
        default:
            return false;
    }
}
/**
 *
 * @param {string} method get || post || put    .....
 * @param {string} url
 * @param {object} params 接口参数，key，value 对应
 * @param {object} config 可配置请求头等，请看下面的config注释
 */
function httpFetch(method, url, params, config) {
    config = config ? config : {};
    method = method.toUpperCase(); //转大写
    let {warn = true} = config;
    switch (method) {
        case "POST-PARAMS":
            method = "POST";
        case "GET":
        //get请求不使用强缓存。
        config.cache = 'no-cache';
        case "DELETE":
            //将get||delete请求传参都拼接到URL中
            if (params !== undefined) {
                url += url.indexOf("?") !== -1 ? "&" : "?";
                url += obj2QueryString(params);
            }
            break;
        /*case "POST-PARAMS":
            //非
            method = "POST";
            config.body = obj2QueryString(params);
            break;*/
        default:
            //其他情况,把参数序列化成json,request中已自动处理
            config.body = params;
            break;
    }
    config.method = method;
    return request(url, config).then((result) => {
        if (result.op && result.op === "suc") {
            //拥有op,并且op为suc才成功
            return Promise.resolve(result);
        }
        //其他的一律跳到catch中
        return Promise.reject(result);
    }).catch((result) => {
        if (warn) {
            //开启警告功能
            if (result.msg) {
                //有msg信息,提示msg
                message.warn(result.msg);
            } else {
                //没有msg,提示整个result对象
                message.warn(JSON.stringify(result));
            }
        }
        //同时把结果传到下一catch
        return Promise.reject(result);
    });
}

export default httpFetch;

/**
 * 把对象数据 查询字符串
 * <pre>
 *     使用于:
 *      get请求时,把对象传话成字符串,拼接到url
 *      post请求时,非json方式的content-type
 * </pre>
 * @param obj
 * @returns {string}
 */
function obj2QueryString(obj) {
    if (obj === undefined) {
        return "";
    }
    return typeof obj == "string" ? obj : Object.keys(obj).filter(key => !isEmpty(obj[key])).map((key) => {
        let value = obj[key];
        if (Array.isArray(value)) {
            //如果数组,改成 arr=1&arr=2&arr=3,后台会自动识别成一个数组
            let arr = [];
            value.forEach(v => arr.push(`${key}=${v}`));
            return arr.join("&");
        } else {
            return `${key}=${value}`;
        }
    }).join("&");
}


const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

const checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    /*const errortext = codeMessage[response.status] || response.statusText;
    notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: errortext,
    });*/
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
};

const cachedSave = (response, hashcode) => {
    /**
     * Clone a response data and store it in sessionStorage
     * Does not support data other than json, Cache only json
     */
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.match(/application\/json/i)) {
        // All data is saved as text
        response
            .clone()
            .text()
            .then(content => {
                sessionStorage.setItem(hashcode, content);
                sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
            });
    }
    return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
function request(
    url,
    options = {
        expirys: true,
    }
) {
    /**
     * Produce fingerprints based on url and parameters
     * Maybe url has the same parameters
     */
    const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
    const hashcode = hash
        .sha256()
        .update(fingerprint)
        .digest('hex');

    const defaultOptions = {
        credentials: 'include',
    };
    const newOptions = {...defaultOptions, ...options};
    if (
        newOptions.method === 'POST' ||
        newOptions.method === 'PUT' ||
        newOptions.method === 'PATCH' ||
        newOptions.method === 'DELETE'
    ) {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                ...newOptions.headers,
            };
            newOptions.body = JSON.stringify(newOptions.body);
        } else {
            // newOptions.body is FormData
            newOptions.headers = {
                Accept: 'application/json',
                ...newOptions.headers,
            };
        }
    }

    const expirys = options.expirys || 60;
    // options.expirys !== false, return the cache,
    if (options.expirys !== false) {
        const cached = sessionStorage.getItem(hashcode);
        const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
        if (cached !== null && whenCached !== null) {
            const age = (Date.now() - whenCached) / 1000;
            if (age < expirys) {
                const response = new Response(new Blob([cached]));
                return response.json();
            }
            sessionStorage.removeItem(hashcode);
            sessionStorage.removeItem(`${hashcode}:timestamp`);
        }
    }
    return fetch(url, newOptions)
        .then(checkStatus)
        .then(cachedSave)
        .then(response => {
            try {
                const res = response.json();
                if(res.op == 'fail' && res.code == '401'){
                    LoginCheck.check();
                }else{
                    return res
                }
            } catch (e) {
                return response.text();
            }
        })
        .catch(e => {
            // const status = e.name;
            // if (status === 401) {
            //     // @HACK
            //     /* eslint-disable no-underscore-dangle */
            //     window.g_app._store.dispatch({
            //         type: 'login/logout',
            //     });
            //     return;
            // }
            // // environment should not be used
            // if (status === 403) {
            //     router.push('/exception/403');
            //     return;
            // }
            // if (status <= 504 && status >= 500) {
            //     router.push('/exception/500');
            //     return;
            // }
            // if (status >= 404 && status < 422) {
            //     router.push('/exception/404');
            // }
            console.log("httpAjax-catch", e);
            return Promise.reject(e);
        });
}
import httpFetch from 'src/Ztools/httpFetch';

/**
 * 权限相关api
 */
export default {
    name: "user",
    apis: {
        login(params={}) {
            const {uid,pwd} = params;
            return httpFetch("post", `/servlet/WebRoleServlet?action=login&uid=${uid}&pwd=${pwd}`,params,{warn:false});
        },
    },
};

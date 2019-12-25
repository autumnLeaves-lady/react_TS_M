import React, { Component } from 'react';
import { createStore } from 'redux';

/*下面这个方法是一个Reducer函数*/
/*每个defaultState属性必须加注释和正确的初始值*/
const defaultState = {
    //路由
    history:null,

};
function reducer(state = defaultState,action){
    switch (action.type){
        case 'history':
        return Object.assign({},state,{
            history:action.history
        });
        default:
            return state;
    }
}
// let store = createStore(reducer);
// 监听state，变化执行函数
// store.subscribe(()=>alert(1));
// let unsubscribe = store.subscribe(()=>(
//     console.log(store.getState())
// ));
// unsubscribe(); //解除监听

export default reducer;

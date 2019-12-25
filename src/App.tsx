/** @format */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import 'antd/dist/antd.less'
// import Demo from 'src/Components/Demo/index';
import './App.less'
//按需加载
import Loadable from 'react-loadable';
//按需加载所有路由。
function Loading(props) {
    if (props.error) {
        throw props.error;
    } else {
        return <div style={{textAlign:'center',marginTop:30}}><span>加载中...</span></div>;
    }
}

const Demo = Loadable({
    loader: () => import('src/Components/Demo'),
    loading: Loading,
});
// Loadable.preloadAll();
const history = createBrowserHistory();
type MyProps = {
    dispatch: any;
};
type MyState = {};
class App extends Component<MyProps, MyState> {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.dispatch({
            type: 'history',
            history: history
        });
    }
    //预加载页面。
    preload = () => {
        const routes = {
            Demo
        };
        this.props.dispatch({
            type: 'preload',
            value: routes
        });
    };
    render() {
        return (
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/" component={Demo} />
                </Switch>
            </ConnectedRouter>
        );
    }
}

export default connect()(App);

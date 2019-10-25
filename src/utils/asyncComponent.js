/*
 * @Author: wqjiao 
 * @Date: 2018-11-30 17:29:32 
 * @Last Modified by:   wqjiao 
 * @Last Modified time: 2018-11-30 17:29:32 
 * @Description: 路由按需加载 
 */
import React, { Component } from "react";

export default function asyncComponent(importComponent) {
    class AsyncComponent extends Component {
        constructor(props) {
            super(props);

            this.state = {
                component: null
            };
        }

        async componentDidMount() {
            const { default: component } = await importComponent();

            this.setState({
                component: component
            });
        }

        render() {
            const C = this.state.component;

            return C ? <C {...this.props} /> : null;
        }
    }

    return AsyncComponent;
}

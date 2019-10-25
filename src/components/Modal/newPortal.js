/***
 * 传送门 16版本之后 createPortal
 * ReactDOM.createPortal(
        child,    // 要渲染的元素
        container // 指定渲染的父元素
    )
*/

import React from 'react';
import ReactDOM from 'react-dom';

class NewPortal extends React.Component {
    constructor(props) {
        super(props);
        this.node = document.createElement('div');
        this.node.style.position = 'absolute';
        this.node.style.top = '0';
        this.node.style.left = '0';
        this.node.style.width = '100%';
        document.body.appendChild(this.node);
    }

    render() {
        const { children } = this.props;
        return ReactDOM.createPortal(
            children,
            this.node
        );
    }
}
export default NewPortal;

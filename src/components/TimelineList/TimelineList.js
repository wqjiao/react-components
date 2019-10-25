/*
 * @Author: wqjiao
 * @Date: 2019-08-30 11:44:14
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-08-30 11:44:34
 * @Description: 时间轴List
 */
import React, {Component, Fragment} from 'react';
import classNames from 'classnames';
import {Icon} from 'antd';
import styles from './index.less';

class TimelineList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: props.isShow || false, // 默认超过两条隐藏
        };
    }

    // 点击展示全部
    showAllLine = () => {
        const {isShow} = this.state;
        this.setState({
            isShow: !isShow,
        });
    };

    render() {
        const {isShow} = this.state;
        const {className, children, ...restProps} = this.props;
        const childrenWithProps = React.Children.toArray(children);
        const childrenLength = childrenWithProps.length;

        return (
            <ul className={classNames(styles.timelineList, className)} {...restProps}>
                {/* 默认隐藏 & 大于两条数据 */}
                {!isShow && childrenLength > 2 ? (
                    <Fragment>
                        {React.Children.map(children, (child, index) =>
                            child && index < 2 ? React.cloneElement(child, {}) : null
                        )}
                        <li className={styles.hideTimeLine} onClick={this.showAllLine}>
                            <a className={styles.btnReadmore}>
                                查看全部{' '}
                                <Icon style={{transform: 'rotate(-90deg)'}} type="double-left" />
                            </a>
                        </li>
                    </Fragment>
                ) : (
                    React.Children.map(children, child =>
                        child ? React.cloneElement(child, {}) : child
                    )
                )}
            </ul>
        );
    }
}

export default TimelineList;

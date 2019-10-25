/*
 * @Author: wqjiao
 * @Date: 2019-08-30 11:43:57
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-09-06 11:12:11
 * @Description: 时间轴子项
 */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './index.less';

const TimelineItem = ({time, children, last = false, ...restProps}) => (
    <li className={classNames(styles.timelineItem, {[styles.last]: last})} {...restProps}>
        {/* {time && <div className={styles.timelineLeft}>{time}</div>} */}
        <div className={styles.timelineLeft}>{time}</div>
        <div className={styles.timelineMiddle}>
            <div className={styles.timelineTail} />
            <div className={classNames(styles.timelineHead, styles.blue)} />
        </div>
        {children !== null && children !== undefined && (
            <div className={styles.timelineRight}>{children}</div>
        )}
    </li>
);

TimelineItem.defaultProps = {
    time: '',
    last: false,
};

TimelineItem.propTypes = {
    time: PropTypes.node,
};

export default TimelineItem;

/*
 * @Author: wqjiao
 * @Date: 2019-06-11 10:59:12
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-09-11 11:42:49
 * @Description: BtnLink 列表按钮box
 * @use: <BtnLink><a>按钮</a></BtnLink>
 */
import React from 'react';
import styles from './index.less';

const BtnLink = ({children}) => (
    <div className={styles.btnLink}>{children}</div>
);

export default BtnLink;

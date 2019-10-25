/*
 * @Author: wqjiao 
 * @Date: 2018-11-30 17:29:17 
 * @Last Modified by:   wqjiao 
 * @Last Modified time: 2018-11-30 17:29:17 
 * @Description: 清除 sessionStorage
 */
// 清空react-router产生的多余的session
export default function () {
    try {
        let sessionLength = window.sessionStorage.length;
        let sessionKeys = [];
        // 遍历key中包含@@History的项
        for (let i = 0; i < sessionLength; i ++) {
            if (window.sessionStorage.key(i).match('@@History')) {
                sessionKeys.push(window.sessionStorage.key(i));
            }
        }
        // 删除该项session
        for (let j = 0; j < sessionKeys.length; j ++) {
            window.sessionStorage.removeItem(sessionKeys[j]);
        }
    } catch (err) {
        window.Raven && window.Raven.captureException(err);
    }
}
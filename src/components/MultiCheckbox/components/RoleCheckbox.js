/*
 * @Author: wqjiao 
 * @Date: 2019-07-23 15:19:21 
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-09-11 14:12:09
 * @Description: 多层级 Checkbox
 */
import React from 'react';
import { Checkbox } from 'antd';
import {getDifference, getIntersect} from '@/utils/funcUtils';
import styles from './RoleCheckbox.less';

const CheckboxGroup = Checkbox.Group;

class RoleCheckbox extends React.Component {
    state = {
        relationList: {}, // 关系对象
        checkedValues: [], // 选中的 value
    }

    componentDidMount() {
        const {list, checkedValues} = this.props;
        let relationObj = {};

        // 一级菜单
        for (let one of list) {
            relationObj[one.value] = {children: [], parent: []};
            
            // 二级菜单
            if (one.children) {
                for (let two of one.children) {
                    relationObj[one.value]['children'].push(two.value);
                    relationObj[two.value] = {parent: [one.value], children: []};
                    
                    // 三级菜单
                    if (two.children) {
                        for (let three of two.children) {
                            relationObj[one.value]['children'].push(three.value);
                            relationObj[two.value]['children'].push(three.value);
                            relationObj[three.value] = {parent: [one.value, two.value], children: []};
                        }
                    }
                }
            } 
        }

        this.setState({
            relationObj,
            checkedValues
        });
    }

    // 生成 Checkbox 子项
    checkboxChildren = (data=[]) => {
        // children 存在执行
        if (!data || data.length < 1) return null;

        return (
            data.map(item => {
                return(
                    <div className={styles.rightItem} key={item.value}>
                        <div className={styles.rightLabel}>
                            <Checkbox value={item.value}>{item.label}</Checkbox> 
                        </div>
                        <div className={styles.rightChildren}>
                            { item.children &&
                                item.children.map(i => {
                                    return (
                                        <Checkbox key={i.value} value={i.value}>{i.label}</Checkbox> 
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            })
        )
    }

    // 修改复选框内容
    onChange = (values) => {
        const {relationObj, checkedValues} = this.state;
        let newCheckedValues = [];
        const value = getDifference(checkedValues, values);

        // 选中,否则删除
        if (values.length > checkedValues.length) {
            // 融合并去重
            newCheckedValues = Array.from(new Set(
                [
                    ...checkedValues,
                    ...value,
                    ...relationObj[value].parent,
                    ...relationObj[value].children,
                ]
            ));
        } else {
            // 交集:包括当前选中的 value
            const intersectValues = getIntersect(checkedValues, [...value, ...relationObj[value].children])
            // 根据交集获取差集:需要删除的 value
            const differenceValues = getDifference(checkedValues, intersectValues);

            // console.log('***', value, intersectValues, differenceValues, checkedValues )
            // 过滤已删除的 value
            newCheckedValues = differenceValues.filter(item => item !== value);
        }

        this.setState({
            checkedValues: newCheckedValues
        });
        this.props.onChange(newCheckedValues);
    }

    render() {
        const {list=[]} = this.props;
        const {checkedValues} = this.state;

        return (
            <div className={styles.checkboxBox}>
                <CheckboxGroup
                    className={styles.checkboxList}
                    onChange={this.onChange}
                    value={checkedValues}
                >
                    {list.map(item => {
                        return(
                            <div className={styles.checkboxItem} key={item.value}>
                                <div className={styles.left}>
                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                </div>
                                <div className={styles.right}>
                                    {this.checkboxChildren(item.children)}
                                </div>
                            </div>
                        )
                    })}
                </CheckboxGroup>
            </div>
        );
    }
}

export default RoleCheckbox;

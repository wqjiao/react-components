/*
 * @Author: wqjiao 
 * @Date: 2019-07-23 15:37:05 
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-09-11 14:11:33
 * @Description: 多层次复选框
 */
import React from 'react';
import { Card } from 'antd';
import RoleCheckbox from './compontents/RoleCheckbox';

export default class DemoCheckbox extends React.Component {
    state = {
        checkedValues: [], // 选中的功能权限
    }

    // 修改复选框内容
    onCheckChange = (checkedValues) => {
        this.setState({
            checkedValues
        });
        console.log('checkedValues：', checkedValues)
    }

    render() {
        const treeData = [
            {
                label: '0-0',
                value: '0-0'
            },
            {
                label: '0-1',
                value: '0-1',
                children: [{
                    label: '0-1-0',
                    value: '0-1-0',
                    children: [{
                        label: '0-1-0-0',
                        value: '0-1-0-0'
                    }, {
                        label: '0-1-0-1',
                        value: '0-1-0-1'
                    }],
                }, {
                    label: '0-1-1',
                    value: '0-1-1',
                    children: [{
                        label: '0-1-1-0',
                        value: '0-1-1-0'
                    }, {
                        label: '0-1-1-1',
                        value: '0-1-1-1'
                    }, {
                        label: '添加、修改',
                        value: '0-1-1-2'
                    }, {
                        label: '删除、查看',
                        value: '0-1-1-3'
                    }],
                }],
            },
            {
                label: '0-2',
                value: '0-2',
                children: [{
                    label: '0-2-0',
                    value: '0-2-0',
                    children: [{
                        label: '0-2-0-0',
                        value: '0-2-0-0'
                    }],
                }],
            },
        ];
        const {checkedValues} = this.state;

        return (
            <Card style={{ width: '100%' }} title="功能配置">
                <RoleCheckbox checkedValues={checkedValues} list={treeData} onChange={this.onCheckChange} />
            </Card>
        );
    }
}

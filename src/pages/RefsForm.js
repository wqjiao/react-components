import React, { Component } from 'react';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import Refs from '@/components/RefsForm';

const FormItem = Form.Item;
const Option = Select.Option;

class RefsForm extends Component {

    componentWillMount() {
        const channel = new BroadcastChannel('app');
        channel.onmessage = function (event) {
            event.data.list.push('C');
            console.log('channel:', event, event.data);
        }
        console.log('FefsForm')

        // 构造函数的第二个参数是 Shared Worker 名称，也可以留空
        const sharedWorker = new SharedWorker('../util/shared.js', 'ctc');

        // 监听 get 消息的返回数据
        sharedWorker.port.addEventListener('message', (e) => {
            const data = e.data;
            const text = '[receive] ' + data.msg + ' —— tab ' + data.from;
            console.log('[Shared Worker] receive message:', text);
        }, false);
        sharedWorker.port.start();
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.history.push('/');

        // this.props.form.validateFields((err, fieldsValue) => {
        //     if (!err) {
        //         const values = {
        //             ...fieldsValue,
        //             // 时间类组件的 value 类型为 moment 对象，所以在提交服务器前需要预处理
        //             'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
        //         }
        //         console.log('Received values of form: ', values);
        //     }
        // });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item
                        label="Select"
                        hasFeedback
                    >
                        {getFieldDecorator('select', {
                            rules: [
                            { required: true, message: 'Please select your country!' },
                            ],
                        })(
                            <Select placeholder="Please select a country">
                                <Option value="china">China</Option>
                                <Option value="usa">U.S.A</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <FormItem label="输入1">
                        {getFieldDecorator('input2', {
                            rules: [
                                {
                                    required: true,
                                    message: '必填'
                                },
                                {
                                    validator: (rule, value, callback, source, options) => {
                                        console.log(value, source, options)
                                        callback();
                                    }
                                }
                            ]
                        })(<Input placeholder="请输入" />)}
                    </FormItem>
                    <FormItem label="输入1">
                        {getFieldDecorator('date-picker', {
                            rules: [{
                                required: true,
                                message: '必填'
                            }],
                            getValueFromEvent: (value) => {
                                const date = value.format('YYYY-MM-DD');
                                console.log('***', date)
                                let mydata = {};
                                const channel = new BroadcastChannel('app');
                                channel.onmessage = function (event) {
                                    event.data.list.push(date);
                                    console.log('channel:', event, event.data);
                                }

                                mydata.st = date;
                                window.localStorage.setItem('ctc-msg', JSON.stringify(mydata));

                                return value;
                            }
                        })(<DatePicker format="YYYY-MM-DD" />)}
                    </FormItem>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form>
                <Refs />
            </div>
        );
    }
}

export default Form.create()(RefsForm);
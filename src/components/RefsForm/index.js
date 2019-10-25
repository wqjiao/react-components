/*
 * @Author: wqjiao 
 * @Date: 2019-04-28 10:40:39 
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-06-25 14:45:30
 * @Description: RefsForm 手写Form 表单
 */
import React, { Component } from 'react';
import device from 'current-device';
// import { device } from 'device.js';
import './index.less';

class RefsForm extends Component {

    // 提交表单信息
    handleSubmit = (e) => {
        e.preventDefault();
        const formValues = this.getFormValues(this.form);
        console.log(formValues);

        // //  extract the node list from the form
        // //  it looks like an array, but lacks array methods
        // const { radio, check } = this.form;
        
        // // radio value
        // const radioValue = radio.value;

        // // convert node list to an array
        // const checkboxArray = Array.prototype.slice.call(check);
        // // extract only the checked checkboxes
        // const checkedCheckboxes = checkboxArray.filter(input => input.checked);
        // // use .map() to extract the value from each checked checkbox
        // const checkedCheckboxesValues = checkedCheckboxes.map(input => input.value);
    }

    // 重置表单
    handleReset = (e) => {
        console.log('reset', this.form)
        this.form.reset();
        const offset = e.target.getBoundingClientRect();
        const isMobile = device.mobile(), // 手机
            isTablet = device.tablet(), // 平板
            isDesktop = device.desktop(); // 电脑
        let scrollTop, scrollLeft;
        
        console.log('isMobile:', isMobile, 'isTablet:', isTablet, 'isDesktop:', isDesktop);

        // 手机/平板 || 电脑
        if (isMobile || isTablet) {
            scrollTop = document.body.scrollTop;
            scrollLeft = document.body.scrollLeft;
        } else {
            scrollTop = document.documentElement.scrollTop;
            scrollLeft = document.documentElement.scrollLeft;
        }

        console.log('scrollTop:', scrollTop, 'scrollLeft:', scrollLeft, offset, window.pageYOffset)
        let heightTop = document.documentElement.scrollTop || document.body.scrollTop;
        let widthLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        console.log('***', heightTop)
    }

    // 获取表单value
    getFormValues(form) {
        let toArray = Array.from,
            eles = toArray(form),
            body = {};

        for (let ele of eles) {
            // select 元素没有必要递归，表单包也暂时不用遍历
            if (ele.children.length && ele.nodeName !== 'SELECT' && ele.nodeName !== 'FIELDSET') {
                this.getFormValues(ele);
            } else {
                let nodeName = ele.nodeName.toLowerCase();
                let formElementp = (v) => v === 'input' || v === 'select' || v === 'textarea' || v === 'fieldset';

                // 确认元素是表单元素
                if (formElementp(nodeName)) {
                    // 如果元素为禁用则跳过
                    if (ele.disabled === true) continue;

                    let key = ele.name,
                        value;

                    // 没有name的表单元素跳过
                    if (!key) continue;

                    // 单选按钮时，需要判断是否为选中状态
                    if (ele.type === 'radio') {
                        if (!ele.checked) continue;
                        value = ele.value;
                    } else if (ele.type === 'checkbox') {
                        if (!ele.checked) continue;
                        value = ele.value;
                    } else {
                        if (nodeName === 'select' && ele.multiple) {
                            // 收集所有多选状态下的 selected 的value
                            let selected = [],
                                options = toArray(ele.children);

                            for (let v of options) {
                                selected.push(v.value);
                            }

                            value = selected;
                        } else if (nodeName === 'fieldset') {
                            this.getFormValues(ele);
                        } else {
                            value = ele.value;
                        }
                    }

                    if (value === undefined) continue;

                    // 判断是否已经存在相应的 name
                    if (key in body) {
                        let existValue = body[key];
                        if (Object.prototype.toString.call(body[key]) === '[object Array]') {
                            body[key] = existValue.concat(value)
                        } else {
                            body[key] = [existValue, value]
                        }
                    } else {
                        body[key] = value;
                    }
                }
            }
        }
        return body;
    }

    render() {
        return (
            <form
                onSubmit={this.handleSubmit}
                onReset={this.handleReset}
                ref={form => this.form = form}
                style={{paddingTop: 2000}}
            >
                <RadioSet
                    name={'radio'}
                    options={['cat', 'dog', 'ferret']}
                />
                <CheckboxSet
                    name={'check'}
                    options={['cat', 'dog', 'ferret']}
                />
                <InputSet label="测试" name="ceshi" value="" />
                <button type="submit" className="wqjiao-btn wqjiao-btn-primary">Submit</button>
                <button type="reset" className="wqjiao-btn">Reset</button>
            </form>
        );
    }
}

// Radio sets
function RadioSet(props) {
    return (
        <div className="wqjiao-check">
            {props.options.map(option => {
                return (
                    <label
                        key={option}
                        className="wqjiao-check-label"
                    >
                        <input
                            type="radio"
                            value={option}
                            name={props.name}
                            className="wqjiao-radio-input"
                        />
                        {option}
                    </label>
                )
            })}
        </div>
    );
}

// Checkbox sets
function CheckboxSet(props) {
    return (
        <div className="wqjiao-check">
            {props.options.map(option => {
                return (
                    <label
                        key={option}
                        className="wqjiao-check-label"
                    >
                        <input
                            type="checkbox"
                            value={option}
                            name={props.name}
                            className="wqjiao-checkbox-input"
                        />
                        {option}
                    </label>
                )
            })}
        </div>
    );
}

// Input sets
function InputSet(props) {
    return (
        <div className="wqjiao-form-item">
            <div className="form-item-label">{props.label}</div>
            <div className="form-item-wrapper">
                <input
                    type="text"
                    defaultValue={props.value}
                    name={props.name}
                    className="wqjiao-input"
                    placeholder="请输入"
                />
            </div>
        </div>
    );
}

export default RefsForm;
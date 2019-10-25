/*
 * @Author: wqjiao
 * @Date: 2019-06-28 15:34:41
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-07-01 14:54:25
 * @Description: 数字输入提示信息(默认银行卡)
 * @Use: 银行卡 <PopoverCard />
 *  身份证号 <PopoverCard getValue={getIdentityValue} spliceFunc={spliceIdentity} />
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Popover, Input} from 'antd';
import {spliceNumberFour, inputNumber} from '@/utils/funcUtils';

class PopoverCard extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        maxLength: PropTypes.number, // 最大length
        getValue: PropTypes.func, // 正则替换value
        spliceFunc: PropTypes.func, // 分割方法
    };

    static defaultProps = {
        placeholder: '请输入',
        maxLength: 20,
        getValue: inputNumber,
        spliceFunc: spliceNumberFour,
    };

    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            isFirst: true, // 第一次更新数据
            visible: false, // Popover提示
        };
    }

    componentDidUpdate(nextProps) {
        const{isFirst} = this.state;
        
        if (isFirst && nextProps.value) {
            this.setState({
                value: nextProps.value,
                isFirst: false,
            });
        }
    }

    // Focus
    handleFocus = () => {
        const {value} = this.state;
        
        this.setState({
            visible: value ? true : false,
        });
    }

    // Change
    handleChange = e => {
        const {getValue} = this.props;
        const value = getValue(e.target.value);
        this.setState({
            value,
            visible: value ? true : false
        });

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
    }

    // Blur
    handleBlur = () => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const {value, visible} = this.state;
        const {placeholder, maxLength, spliceFunc} = this.props;

        return (
            <Popover
                placement="topLeft"
                content={spliceFunc(value)}
                visible={visible}
            >
                <Input
                    value={value}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                />
            </Popover>
        );
    }
}

export default PopoverCard;

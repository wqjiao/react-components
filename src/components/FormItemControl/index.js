/*
 * @Author: wqjiao
 * @Date: 2019-08-02 18:42:08
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-09-11 12:01:10
 * @Description: 动态配置表单：输入方式、必选填、长度
 */
import React, {PureComponent} from 'react';
import {Row, Col, Form, Input, InputNumber, Radio, Checkbox, DatePicker} from 'antd';
import moment from 'moment';
import AntdSelect from '../AntdSelect';
import LocationCascader from '../LocationCascader';
import DoubleNumber from './components/DoubleNumber';
import TextInputNumber from './components/TextInputNumber';
import {
    addIsLeaf,
    limitDecimals,
    inputNumber,
    arrJoinStr,
    getPhoneValue,
    getIdentityValue,
    getFixedTelephone,
} from '@/utils/funcUtils';
import {MobileReg, IdentityReg, FixedTelephoneRge} from '@/utils/constants';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const CheckboxGroup = Checkbox.Group;
const {RangePicker} = DatePicker;
const maxLimit = {
    8: /^(\d{1,5})$/,
    10: /^(\d{1,7})$/,
    11: /^(\d{1,8})$/,
}; // 输入框限制
const inputTypes = [
    'TextArea',
    'Input',
    'InputPhone',
    'InputTelephone',
    'InputIdentity ',
    'InputIntNumber',
    'InputFloatNumber',
    'InputNumber',
    'DoubleNumber',
    'TextInputNumber',
];

class FormItemControl extends PureComponent {
    // 前者数值不能大于后者数值
    validatorRules(required, limit, rule, value, callback) {
        const hasLength = value && value.length > 0;
        // 用户做了输入操作
        if (required && hasLength && (value.length < 2 || !(value[0] + ''))) {
            callback('请输入相应数值');
        }
        if (hasLength && value[0] > value[1]) {
            callback('下限数值不能大于上限数值');
        }
        if (limit && hasLength && (value[0] < limit[0] || value[1] < limit[0])) {
            callback(`比例不能低于${limit[0]}`);
        }
        if (limit && hasLength && (value[0] > limit[1] || value[1] > limit[1])) {
            callback(`比例不能超过${limit[1]}`);
        }
        callback(); // 校验通过
    }

    // 渲染 FormItem
    renderFormItemChild() {
        const {
            formData,
            dispatch,
            form: {getFieldDecorator},
            formItemOptions,
        } = this.props;
        const dateFormat = 'YYYY-MM-DD';
        let {
                fieldName,
                name,
                formType,
                fieldValue,
                fieldCodes,
                dictList,
                validateType: {notNull, canEdit, maxLength, limit},
            } = formData,
            itemChild = '';
        const isInput = inputTypes.includes(formType);
        dictList = dictList.length < 1 ? [] : dictList; // 判断数组是否有值

        // 地区选择器+详情
        if (formType === 'CascaderInput') {
            return this.renderCascader();
        }

        // 是否必填规则
        const requiredRule =
            formType === 'Input'
                ? [
                      {
                          required: notNull,
                          whitespace: true,
                          message: `请输入${fieldName}`,
                      },
                  ]
                : [
                      {
                          required: notNull,
                          message: isInput ? `请输入${fieldName}` : `请选择${fieldName}`,
                      },
                  ];
        // 文本输入框最大长度提示
        const maxLengthRule =
            formType === 'TextArea' || formType === 'Input'
                ? [
                      {
                          max: maxLength || null,
                          message: `${fieldName}不能超过${maxLength}位！`,
                      },
                  ]
                : [];

        // 表单其他参数配置
        const options = {
            initialValue: fieldValue,
            rules: [...requiredRule, ...maxLengthRule, ...formItemOptions.rules],
            getValueFromEvent: formItemOptions.getValueFromEvent || null,
        };

        switch (formType) {
            case 'Text':
                itemChild = getFieldDecorator(name, {initialValue: fieldValue})(
                    <span>{fieldValue}</span>
                );
                break;
            case 'TextArea':
                itemChild = getFieldDecorator(name, options)(
                    <TextArea disabled={!canEdit} placeholder="请输入" autosize />
                );
                break;
            case 'Input': {
                itemChild = getFieldDecorator(name, options)(
                    <Input placeholder="请输入" disabled={!canEdit} />
                );
                break;
            }
            case 'InputPhone': {
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {
                            len: 11,
                            pattern: new RegExp(MobileReg, 'g'),
                            message: `请正确输入${fieldName}`,
                        },
                    ],
                    getValueFromEvent: e => getPhoneValue(e),
                })(<Input placeholder="请输入" maxLength={11} disabled={!canEdit} />);
                break;
            }
            case 'InputTelephone': {
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {
                            pattern: new RegExp(FixedTelephoneRge, 'g'),
                            message: `请正确输入${fieldName}`,
                        },
                    ],
                    getValueFromEvent: e => getFixedTelephone(e),
                })(<Input placeholder="请输入" maxLength={13} disabled={!canEdit} />);
                break;
            }
            case 'InputIdentity': {
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {
                            pattern: new RegExp(IdentityReg, 'g'),
                            message: '请正确输入18位证件号码',
                        },
                    ],
                    getValueFromEvent: e => getIdentityValue(e),
                })(<Input placeholder="请输入" maxLength={18} disabled={!canEdit} />);
                break;
            }
            case 'InputNumber':
                itemChild = getFieldDecorator(name, options)(
                    <InputNumber
                        placeholder="请输入"
                        style={{width: '100%'}}
                        formatter={value => limitDecimals(value)}
                        parser={value => limitDecimals(value)}
                        min={limit ? limit[0] : 0}
                        max={limit ? limit[1] : 1000000000}
                        maxLength={maxLength || 10}
                    />
                );
                break;
            case 'InputIntNumber':
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {
                            validator: (rule, value, callback) => {
                                if (value && maxLength && value > Math.pow(10, maxLength)) {
                                    callback(`${fieldName}不能超过${Math.pow(10, maxLength)}！`);
                                }
                                callback();
                            },
                        },
                    ],
                })(
                    <InputNumber
                        placeholder="请输入"
                        style={{width: '100%'}}
                        formatter={value => inputNumber(value)}
                        parser={value => inputNumber(value)}
                        min={limit ? limit[0] : 0}
                        max={limit ? limit[1] : 1000000000}
                        maxLength={maxLength || 10}
                        disabled={!canEdit}
                    />
                );
                break;
            case 'InputFloatNumber': {
                maxLength = maxLength || 10;
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {
                            validator: (rule, value, callback) => {
                                if (value && maxLength && value > Math.pow(10, maxLength - 2)) {
                                    callback(
                                        `${fieldName}不能超过${Math.pow(10, maxLength - 2)}！`
                                    );
                                }
                                callback();
                            },
                        },
                    ],
                })(
                    <InputNumber
                        placeholder="请输入"
                        style={{width: '100%'}}
                        formatter={value =>
                            limitDecimals(value, maxLimit[maxLength], maxLength - 3)
                        }
                        parser={value => limitDecimals(value, maxLimit[maxLength], maxLength - 3)}
                        min={limit ? limit[0] : 0}
                        max={limit ? limit[1] : 9999999.99}
                        maxLength={maxLength}
                        disabled={!canEdit}
                    />
                );
                break;
            }
            case 'TextInputNumber':
                itemChild = getFieldDecorator(name, options)(
                    <TextInputNumber
                        data={dictList}
                        maxLimit={maxLimit}
                        validateType={formData.validateType}
                    />
                );
                break;
            case 'DoubleNumber': {
                itemChild = getFieldDecorator(name, {
                    ...options,
                    rules: [
                        ...options.rules,
                        {validator: this.validatorRules.bind(this, notNull, limit)},
                    ],
                })(<DoubleNumber limit={limit || ''} />);
                break;
            }
            case 'Select': {
                itemChild = getFieldDecorator(name, {
                    ...options,
                    initialValue: (fieldCodes && fieldCodes.join(',')) || [],
                })(
                    <AntdSelect
                        data={dictList}
                        name={name}
                        disabled={!canEdit}
                        onChange={value => this.handleSelect(value, name)}
                    />
                );
                break;
            }
            case 'Cascader':
                itemChild = getFieldDecorator(name, {...options, initialValue: fieldCodes})(
                    <LocationCascader
                        locations={addIsLeaf(dictList)}
                        dispatch={dispatch}
                        isChooseCity={formData.isCity}
                        labelText={arrJoinStr(fieldValue, '/')}
                        disabled={!canEdit}
                    />
                );
                break;
            case 'Radio':
                itemChild = getFieldDecorator(name, {...options, initialValue: fieldCodes})(
                    <RadioGroup disabled={!canEdit}>
                        {dictList.map(item => {
                            return (
                                <Radio value={item.value} key={`${name}-${item.value}`}>
                                    {item.label}
                                </Radio>
                            );
                        })}
                    </RadioGroup>
                );
                break;
            case 'Checkbox':
                itemChild = getFieldDecorator(name, {...options, initialValue: fieldCodes})(
                    <CheckboxGroup disabled={!canEdit} style={{width: '100%'}}>
                        <Row>
                            {dictList.map(item => {
                                return (
                                    <Checkbox
                                        value={item.value}
                                        disabled={item.disabled}
                                        key={`${name}-${item.value}`}
                                    >
                                        {item.label}
                                    </Checkbox>
                                );
                            })}
                        </Row>
                    </CheckboxGroup>
                );
                break;
            case 'DatePicker':
                itemChild = getFieldDecorator(name, {
                    ...options,
                    initialValue: fieldValue ? moment(fieldValue, dateFormat) : undefined,
                })(<DatePicker format={dateFormat} disabled={!canEdit} />);
                break;
            case 'RangePicker': {
                fieldValue =
                    fieldValue && fieldValue.length > 0
                        ? [moment(fieldValue[0], dateFormat), moment(fieldValue[1], dateFormat)]
                        : undefined;
                itemChild = getFieldDecorator(name, {...options, initialValue: fieldValue})(
                    <RangePicker format={dateFormat} disabled={!canEdit} style={{width: 'auto'}} />
                );
                break;
            }
            default:
                itemChild = getFieldDecorator(name, options)(
                    <Input placeholder="请输入" maxLength={maxLength} disabled={!canEdit} />
                );
                break;
        }

        return <FormItem label={fieldName}>{itemChild}</FormItem>;
    }

    // 地区选择器+详情
    renderCascader = () => {
        const {
            dispatch,
            form: {getFieldDecorator},
            formData: {
                fieldName,
                name,
                dictList,
                fieldCodes,
                fieldValue,
                validateType: {notNull, canEdit, maxLength = 200},
                detail,
            },
        } = this.props;

        return (
            <Row gutter={{md: 8, lg: 24, xl: 24}}>
                {dictList.length > 0 && (
                    <Col lg={10} xs={14}>
                        <FormItem label={fieldName}>
                            {getFieldDecorator(name, {
                                initialValue: fieldCodes || [],
                                rules: [
                                    {
                                        required: notNull,
                                        message: `请选择${fieldName}`,
                                    },
                                ],
                            })(
                                <LocationCascader
                                    locations={addIsLeaf(dictList)}
                                    dispatch={dispatch}
                                    labelText={arrJoinStr(fieldValue, '/')}
                                    disabled={!canEdit}
                                />
                            )}
                        </FormItem>
                    </Col>
                )}
                <Col lg={14} xs={10}>
                    <FormItem>
                        {getFieldDecorator(detail.name, {
                            initialValue: detail.fieldValue || '',
                            rules: [
                                {
                                    required: notNull,
                                    whitespace: true,
                                    message: '请输入详细地址',
                                },
                                {
                                    max: maxLength || null,
                                    message: `详细地址不能超过${maxLength}位！`,
                                },
                            ],
                        })(
                            <Input
                                placeholder="请输入"
                                style={{width: '100%'}}
                                disabled={!detail.validateType.canEdit}
                            />
                        )}
                    </FormItem>
                </Col>
            </Row>
        );
    };

    // 选拉框改变
    handleSelect = (value, name) => {
        const {handleSelect} = this.props;

        // 判断是否存在回调
        if (handleSelect) {
            handleSelect(value, name);
        }
    };

    render() {
        const {width} = this.props.formData;
        let span = width === 3 ? 24 : width === 2 ? 16 : width === 1.5 ? 12 : 8;

        return (
            <Col xl={span} sm={24} xs={24}>
                {this.renderFormItemChild()}
            </Col>
        );
    }
}

export default FormItemControl;

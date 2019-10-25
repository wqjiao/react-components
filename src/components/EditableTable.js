import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import BtnLink from '@/widgets/BtnLink';
import AntdSelect from '@/widgets/AntdSelect';

const EditableContext = React.createContext();

class EditableCell extends React.Component {
    getInput = () => {
        const {inputtype, dataIndex} = this.props;

        if (inputtype === 'number') {
            return <InputNumber style={{width: '100%'}} />;
        }
        if (inputtype === 'select') {
            const {selectist, valuename='value', labelname='label'} = this.props;
            return <AntdSelect
                style={{width: '100%'}}
                name={dataIndex}
                data={selectist}
                valueName={valuename}
                labelName={labelname}
            />;
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            record,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `Please Input ${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                id: '1',
                periods: '3',
                feeRate: '10',
            }, {
                id: '2',
                periods: '6',
                feeRate: '10',
            }], // 列表数据
            editingId: '', // 当前编辑的id
            periods: [{
                key: '3',
                value: '3期',
            }, {
                key: '6',
                value: '6期',
            }, {
                key: '9',
                value: '9期',
            }], // 贷款期数
        };
        this.columns = [
            {
                title: '序号',
                width: 80,
                key: 'index',
                render: (text, record, index) => index + 1,
            },
            {
                title: '期数',
                dataIndex: 'periods',
                editable: true,
                inputType: 'select',
            },
            {
                title: '年利率%',
                dataIndex: 'feeRate',
                editable: true,
                inputType: 'number'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    const { editingId } = this.state;
                    const editable = this.isEditing(record);

                    return editable ? (
                        <BtnLink>
                            <EditableContext.Consumer>
                                {form => (
                                    <a onClick={() => this.save(form, record.id)}>
                                        保存
                                     </a>
                                )}
                            </EditableContext.Consumer>
                            <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
                                <a>取消</a>
                            </Popconfirm>
                        </BtnLink>
                    ) : (
                        <BtnLink>
                            <a disabled={editingId !== ''} onClick={() => this.edit(record.id)}>
                                编辑
                            </a>
                            <a disabled={editingId !== ''} onClick={() => this.delete(record.id)}>
                                移除
                            </a>
                        </BtnLink>
                    );
                },
            },
        ];
    }

    // 判断是否编辑中
    isEditing = record => record.id === this.state.editingId;

    // 取消编辑
    cancel = () => {
        this.setState({ editingId: '' });
    };

    // 保存编辑
    save(form, id) {
        form.validateFields((error, row) => {
            if (error) return;

            const newData = [...this.state.data];
            const index = newData.findIndex(item => id === item.id);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
            } else {
                newData.push(row);
            }
            this.setState({ data: newData, editingId: '' });
        });
    }

    // 点击编辑
    edit(id) {
        this.setState({ editingId: id });
    }

    // 点击移除
    delete(id) {
        console.log('点击移除：', id);
    }

    render() {
        const components = {
            body: {
                cell: EditableCell,
            },
        };
        let {data, editingId} = this.state;
        let periods = [...this.state.periods];

        // 编辑时，去除已有的且不是当编辑的
        if (editingId) {
            this.state.periods.forEach((item, index) => {
                data.forEach(_item => {
                    if(_item.periods === item.key && _item.id !== editingId) {
                        periods.splice(index, 1);
                    }
                });
            });
        }

        const columns = this.columns.map(col => {
            if (!col.editable) return col;

            // inputtype 为 select 时添加的选项
            const options = col.dataIndex === 'periods' ? {
                selectist: periods,
                valuename: 'key',
                labelname: 'value',
            } : {};

            return {
                ...col,
                onCell: record => ({
                    record,
                    inputtype: col.inputType || 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                    ...options,
                }),
            };
        });

        return (
            <EditableContext.Provider value={this.props.form}>
                <Table
                    rowKey="id"
                    components={components}
                    bordered
                    dataSource={data}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: this.cancel,
                    }}
                />
            </EditableContext.Provider>
        );
    }
}

export default Form.create()(EditableTable);

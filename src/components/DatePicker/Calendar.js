import * as React from 'react';
import * as moment from 'moment';
import * as classnames from 'classnames';
import daysInMonth from '../../utils';
import Header from './components/Header';

import './Calender.css';

const noop = () => { };

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        const isUnderControl = !!props.value;
        let value = props.value || props.defaultValue;
        let hasDefaultValue = false;

        if (!value) value = moment();
        else if (moment.isMoment(value)) hasDefaultValue = true;
        else {
            value = moment();
            console.warn('Value and default value must be instance of Moment');
        }

        const open = (props.disabled ? false : props.open) || false;
        const format = props.format || 'YYYY-MM-DD';
        const inputValue = value.format(format);

        this.state = {
            open,
            value,
            format,
            inputValue,
            isUnderControl,
            dirty: hasDefaultValue,
            year: value.year(),
            month: value.month(),
            date: value.date(),
            weeks: ['日', '一', '二', '三', '四', '五', '六']
        }
    }

    componentWillReceiveProps(nextProps) {
        let { value, format } = nextProps;

        if (typeof format !== 'string' || format.trim() === '') format = this.state.format;

        if (moment.isMoment(value) && !value.isSame(this.state.value)) {
            const year = value.year();
            const month = value.month();
            const date = value.date();
            this.setState({
                year,
                month,
                date,
                value,
                inputValue: value.format(format),
                format,
                dirty: true
            });
        }
    }

    onInputChange = (e) => {
        const inputValue = e.target.value;
        const value = moment(inputValue, this.state.format);

        if (value.isValid() && /^\s*\d{4}.+\d{2}.+\d{2}.*$/.test(inputValue)) {
            const onChange = this.props.onChange;

            typeof onChange === 'function' && onChange(value, inputValue)

            if (this.state.isUnderControl) return;

            const year = value.year();
            const month = value.month();
            const date = value.date();

            this.setState({
                year,
                month,
                date,
                value,
                dirty: true,
                inputValue
            });

        } else {
            this.setState({
                dirty: true,
                inputValue
            });
        }
    }

    onPick = (date, whichMonth) => {
        const { year, month, format } = this.state;
        const value = moment([year, month, date]);
        const inputValue = value.format(format);
        const disableDate = this.props.disabledDate;
        let disabled = false;

        if (typeof disableDate === 'function') disabled = disableDate(value, inputValue);

        this.onOpen(true);

        if (disabled) return;

        const onChange = this.props.onChange;
        typeof onChange === 'function' && onChange(value, inputValue)

        if (this.state.isUnderControl) return;

        this.setState({
            date,
            value,
            dirty: true,
            inputValue
        });

        if (whichMonth !== 0) whichMonth === 1 ? this.nextMonth() : this.preMonth();
    }

    preMonth = () => {
        const { month } = this.state;

        if (month === 0) {
            this.setState({ month: 11 });
            this.preYear();
            return;
        }

        this.setState({
            month: month - 1
        })
    }

    nextMonth = () => {
        const { month } = this.state;

        if (month === 11) {
            this.setState({ month: 0 });
            this.nextYear();
            return;
        }

        this.setState({
            month: month + 1
        })
    }

    preYear = () => this.setState({ year: this.state.year - 1 })

    nextYear = () => this.setState({ year: this.state.year + 1 })

    clear = (e) => {
        e.stopPropagation();

        const { disabled } = this.props;

        if (disabled) return;

        const value = moment();
        const inputValue = value.format(this.state.format);
        const year = value.year();
        const month = value.month();
        const date = value.date();
        this.setState({
            dirty: false,
            value,
            inputValue,
            year,
            month,
            date,
            open: false
        });
    }

    onOpen = (status) => {
        if (typeof status !== 'boolean') status = this.state.open;

        const onOpenChange = this.props.onOpenChange;
        typeof onOpenChange === 'function' && onOpenChange(!status)
        this.setState({ open: !status });
    }

    render() {

        const { value, year, month, dirty, open, inputValue, weeks } = this.state;
        const days = daysInMonth(year)[month];
        const {
            disabled = false,
            placeholder = 'Select date',
            allowClear = true,
            className = ''
        } = this.props;
        const calendarClass = classnames({ calendar: true, opened: open });
        const { onInputChange, onPick, preYear, nextYear, preMonth, nextMonth, clear, onOpen } = this;

        return (
            <div
                style={{
                    position: 'relative',
                }}
                className={className}
            >
                <div onClick={onOpen} style={{ width: 212 }}>
                    <input type="text"
                        style={{
                            boxSizing: 'border-box',
                            height: 28,
                            width: 212,
                            outline: 'none',
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            paddingLeft: 20,
                            color: 'rgba(0,0,0,0.6)'
                        }}
                        value={dirty ? inputValue : ''}
                        disabled={disabled}
                        onChange={noop}
                        placeholder={placeholder}
                    />
                    {dirty && allowClear && <div
                        onClick={clear}
                        style={{
                            position: 'absolute',
                            left: 190,
                            top: 6,
                            color: 'rgba(0,0,0,0.25)',
                            cursor: 'pointer'
                        }}
                    >清除</div>}
                </div>
                {
                    <div
                        className={calendarClass}
                        style={{
                            overflow: 'hidden',
                            transition: 'all 0.2s',
                            transitionTimingFunction: 'ease-in',
                            marginTop: -28,
                            zIndex: 1,
                            width: 214,
                            boxShadow: '0 1px 6px rgba(0,0,0,.2)',
                        }}
                    >
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                style={{
                                    boxSizing: 'border-box',
                                    height: 34,
                                    width: 212,
                                    outline: 'none',
                                    border: 'none',
                                    borderBottom: '1px solid #eee',
                                    paddingLeft: 20,
                                    color: 'rgba(0,0,0,0.6)'
                                }}
                                placeholder={placeholder}
                                value={dirty ? inputValue : ''}
                                onChange={onInputChange}
                            />
                        </div>
                        <div style={{
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: 212,
                                borderBottom: '1px solid #eee',
                                padding: '8px 50px',
                                position: 'relative',
                                boxSizing: 'border-box',
                                color: 'rgba(0,0,0,0.4)',
                            }}>
                                <div style={{ position: 'absolute', left: 4, top: 6 }}><span onClick={preYear}>双</span></div>
                                <div style={{ position: 'absolute', left: 26, top: 6 }}><span onClick={preMonth}>左</span></div>
                                <div style={{ textAlign: 'center', paddingTop: 4, fontSize: 12 }}>
                                    {year} - {month + 1}
                                </div>
                                <div style={{ position: 'absolute', right: 26, top: 6 }}><span onClick={nextMonth}>右</span></div>
                                <div style={{ position: 'absolute', right: 4, top: 6 }}><span onClick={nextYear}>双</span></div>
                            </div>
                            <div style={{
                                width: 210,
                                overflow: 'hidden',
                                padding: '0 8px'
                            }}>
                                {/* 头部星期 */}
                                <Header weeks={weeks} />

                                {days.map((day, index) => {
                                    let whichMonth = 0
                                    let active = false
                                    if (day > 15 && index < 15) whichMonth = -1
                                    if (day < 15 && index > 20) whichMonth = 1
                                    if (
                                        whichMonth === 0 &&
                                        value.date() === day &&
                                        value.month() === month &&
                                        value.year() === year
                                    ) active = true;
                                    return (
                                        <div
                                            style={{
                                                float: 'left',
                                                boxSizing: 'border-box',
                                                padding: '4px',
                                                width: 28,
                                                color: whichMonth === 0 ? 'rgba(0,0,0,.65)' : 'rgba(0,0,0,.25)'
                                            }}
                                            onClick={() => onPick(day, whichMonth)}
                                            key={index}
                                        >
                                            <div className={'calender-date'}
                                                style={{
                                                    fontSize: 12,
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    borderRadius: 4,
                                                    padding: '4px 0',
                                                    color: active ? 'white' : 'inherit',
                                                    backgroundColor: active ? '#108ee9' : ''
                                                }}>
                                                {day}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Calendar;

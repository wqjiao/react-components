/*
 * @Author: wqjiao 
 * @Date: 2019-09-11 11:43:33 
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-09-11 11:43:53
 * @Description: 手写日期选择器 
 */
import * as React from 'react';
import * as moment from 'moment';
import Calendar from './Calendar';

class DatePicker extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value: moment(),
			open: false
		}
	}

	onChange = (value, inputValue) => {
		console.log(value.format('YYYY-MM-DD'))
		this.setState({value})
	}

  	onOpenChange = (status) => {
    	console.log('open status: ' + status)
  	}

  	disabledDate = (currentDate, inputValue) => {
    	return false
  	}

	render() {
		const {onChange, onOpenChange, disabledDate} = this;
		const {value} = this.state;
		return (
			<div style={{
				width: 400,
				margin: '200px auto'
			}}>
				<Calendar
					onChange={onChange}
					allowClear={true}
					value={value}
					disabled={false}
					placeholder={'please input date'}
					format={'YYYY-MM-DD'}
					onOpenChange={onOpenChange}
					disabledDate={disabledDate}
				/>
			</div>
		)
	}
}

export default DatePicker;

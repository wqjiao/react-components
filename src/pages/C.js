// setTimeout -- setState
import React from 'react';
import {Button} from 'antd';

class SetState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            val: 0
        }
    }

    componentDidMount() {
        setTimeout(_ => {
            console.log('执行->第二步', this.state.val) // 输出更新前的值 --> 0
            this.setState({ val: this.state.val + 1 })
            console.log('执行->第三步', this.state.val) // 输出更新后的值 --> 1
        }, 0);
        console.log('执行->第一步', this.state.val) // 输出更新前的值 --> 0
    }

    render() {
        return (
            <Button type="primary" >
                {`Counter is: ${this.state.val}`}
            </Button>
        )
    }
}

export default SetState;
// 生命周期 -- setState
import React from 'react';
import {Button} from 'antd';

class SetState extends React.Component {

    state = { val: 0 }

    componentDidMount() {
        this.setState({ val: this.state.val + 1 })
       console.log(this.state.val) // 输出的还是更新前的值 --> 0
    }
    
    increment = () => {
        this.setState({ val: this.state.val + 1 })
        console.log(this.state.val) // 输出的是更新前的val --> 0
    }

    render() {
        return (
            <Button type="primary" onClick={this.increment}>
                {`Counter is: ${this.state.val}`}
            </Button>
        )
    }
}

export default SetState;
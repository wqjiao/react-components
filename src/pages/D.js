// 批量更新 -- setState
import React from 'react';
import {Button} from 'antd';

class SetState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            val: 0
        }
    }

    batchUpdates = () => {
        this.setState({ val: this.state.val + 1 })
        this.setState({ val: this.state.val + 1 })
        this.setState({ val: this.state.val + 1 })
    }

    render() {
        return (
            <Button type="primary" onClick={this.batchUpdates}>
                {`Counter is: ${this.state.val}`}
            </Button>
        )
    }
}

export default SetState;
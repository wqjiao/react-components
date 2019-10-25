// 原生 -- setState
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
       document.body.addEventListener('click', this.changeValue, false)
    }

    changeValue = () => {
        this.setState({ val: this.state.val + 1 })
        console.log(this.state.val) // 输出的是更新后的值 --> 1
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
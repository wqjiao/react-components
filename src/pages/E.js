// 钩子函数与 setTimeout -- setState
import React from 'react';
import {Button} from 'antd';

class SetState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            val: 0
        }
    }

    // 钩子函数中的 setState 无法立马拿到更新后的值;
    // setState 批量更新的策略;
    // setTimmout 中 setState 是可以同步拿到更新结果
    componentDidMount() {
        this.setState({ val: this.state.val + 1 })
        console.log('第一步：', this.state.val); // 0
    
        this.setState({ val: this.state.val + 1 })
        console.log('第二步：', this.state.val); // 0
    
        setTimeout(_ => {
            this.setState({ val: this.state.val + 1 })
            console.log('第三步：', this.state.val); // 2
        
            this.setState({ val: this.state.val + 1 })
            console.log('第四步：', this.state.val); //  3
        }, 0)
    }

    render() {
        return (
            <Button type="primary">
                {`Counter is: ${this.state.val}`}
            </Button>
        )
    }
}

export default SetState;
/*
 * @Author: wqjiao 
 * @Date: 2019-01-04 17:20:00 
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-01-04 17:44:28
 * @Description: ModalPic 图片弹窗 
 */
import React from 'react';
import NewPortal from './newPortal';
import Transition from './transition';
import './index.less';

class ModalPic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
        this.maskClick = this.maskClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    static defaultProps = {};
    
    static propTypes = {};

    componentDidMount() {
        this.setState({ visible: this.props.visible });
    }

    componentWillReceiveProps(props) {
        this.setState({ visible: props.visible });
    }

    closeModal() {
        this.setState({ visible: false });
    }

    maskClick() {
        this.setState({ visible: false });
    }

    render() {
        const { visible } = this.state;
        const { children } = this.props;

        return (
            <NewPortal>
                {/* 引入transition组件，去掉了外层的modal-wrapper */}
                <Transition
                    visible={visible}
                    transitionName="modal"
                    enterActiveTimeout={200}
                    enterEndTimeout={100}
                    leaveActiveTimeout={100}
                    leaveEndTimeout={200}
                >
                    <div className="modal">
                        <div className="modal-close" onClick={this.closeModal}>x</div>
                        <div className="modal-content">
                            {children}
                        </div>
                    </div>
                </Transition>
                <Transition
                    visible={visible}
                    transitionName="mask"
                    enterActiveTimeout={200}
                    enterEndTimeout={100}
                    leaveActiveTimeout={100}
                    leaveEndTimeout={200}
                >
                    <div
                        className="mask"
                        onClick={this.maskClick}
                    ></div>
                </Transition>
            </NewPortal>
        )
    }
}

export default ModalPic;

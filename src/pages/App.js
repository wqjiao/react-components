import React from 'react';
import { withRouter } from 'react-router-dom';
import Modal from '../components/Modal';
import Update from '../components/Update';
import WqjiaoEditor from '../components/WqjiaoEditor';
// import TuiImageEditor from '../components/TuiImageEditor';
import UploadImageModal from '../components/UploadImageModal/axiosQiniu';
import AppAPI from '../components/AppAPI';
import logo from '../assets/img/logo.svg';
import A from './A';
import B from './B';
import C from './C';
import D from './D';
import E from './E';
import { Button } from 'antd';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            role: 8,
            roles: []
        }
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    componentWillMount() {
        // 通信方式
        const channel = new BroadcastChannel('app');
        const list = ['A', 'B'];
        channel.postMessage({ list });
        console.log('App')

        window.addEventListener('storage', function (e) {

            this.console.log('*storage*', e)
            if (e.key === 'ctc-msg') {
                const data = JSON.parse(e.newValue);
                const text = '[receive] ' + data.msg + ' —— tab ' + data.from;
                console.log('[Storage I] receive message:', text);
            }
        });

        // // 构造函数的第二个参数是 Shared Worker 名称，也可以留空
        // const sharedWorker = new SharedWorker('../util/shared.js', 'ctc');


        // // 定时轮询，发送 get 指令的消息
        // setInterval(function () {
        //     sharedWorker.port.postMessage({get: true});
        // }, 1000);

        // // 监听 get 消息的返回数据
        // sharedWorker.port.addEventListener('message', (e) => {
        //     const data = e.data;
        //     const text = '[receive] ' + data.msg + ' —— tab ' + data.from;
        //     console.log('[Shared Worker] receive message:', text);
        // }, false);
        // sharedWorker.port.start();
    }

    componentDidMount() {
        let me = this;
        setTimeout(function() {
            me.setState({
                roles: [{
                    "text": "全部",
                    "id": 0
                }, {
                    "text": "经理",
                    "id": 1
                }, {
                    "text": "定价专员",
                    "id": 2
                }, {
                    "text": "超级管理员",
                    "id": 3
                }, {
                    "text": "主管",
                    "id": 4
                }, {
                    "text": "客服",
                    "id": 5
                }, {
                    "text": "金融机构业务查询",
                    "id": 6
                }, {
                    "text": "处置评估销售主管",
                    "id": 7
                }, {
                    "text": "处置评估销售专员",
                    "id": 8
                }, {
                    "text": "处置库存主管",
                    "id": 9
                }, {
                    "text": "处置库存专员",
                    "id": 10
                }]
            })
        }, 0);
    }

    showModal() {
        this.setState({ visible: true })
    }

    closeModal() {
        console.log('我是onClose回调')
    }

    confirm() {
        console.log('我是confirm回调')
    }

    _handleRole(value) {
		let me = this;

		me.setState({
			role: value
        });
    }
    
    /**
	 * 编辑图片后保存
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	ImageEditorCallback = data => {
		console.log("ImageEditorCallback", data);
    };
    
    handleGoRouter = () => {
        this.props.history.push('/RefsForm');
    }

    render () {
        let me = this;
        const { visible } = this.state;
        let originImage = {
            id: '1881',
            order_id: 'ABCD',
            orig_pic_url: {logo}
        }

        return (
            <div className="App">
                {/* <A /> */}
                {/* <B /> */}
                {/* <C /> */}
                {/* <D /> */}
                <E />
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <Button type="primary" onClick={this.handleGoRouter}>跳转</Button>

                {/* Modal */}
                <div className="modal-box componts-item">
                    <button className="form-button" onClick={this.showModal}>click here</button>
                    <Modal
                        visible={ visible }
                        title="这是自定义title"
                        confirm={this.confirm}
                        onClose={this.closeModal}
                    >
                        这是自定义content
                    </Modal>
                </div>

                {/* 图片上传 及 查看大图片弹窗 */}
                <div className="componts-item">
                    <Update />
                </div>
                
                {/* editor web 富文本编辑器 */}
				<div className="componts-item">
                    <WqjiaoEditor />
                </div>

                {/* 图片编辑 */}
                {/* <div className="componts-item">
                    <TuiImageEditor
                        originImage={originImage}
                        callback={me.ImageEditorCallback}
                        _key={1}
                        is_after_loan={true}
                    />
                </div> */}

                <div className="componts-item">
                    <UploadImageModal is_after_loan={true} order_id={10165} />
                </div>

                <AppAPI />
            </div>
        )
    }
}

export default withRouter(App);

import React from 'react';
import ModalPic from '../ModalPic';
import {stringify} from 'qs';
import './index.less';

class Update extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            srcData: [], // 图片路径
            largeSrc: '', // 大图片路径
            visible: false // 弹窗是否显示
        }
    }

    // 上传照片
    handleUpdatechange = (e) => {
        let fileList = e.target.files;
        const {srcData} = this.state;

        for(var i = 0; i < fileList.length; i ++) {
            let file = fileList[i];
            // 添加一层过滤
            var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
            
            if(!rFilter.test(file.type)) {
                alert('文件格式必须为图片');
                return;
            }

            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            // 文件加载完成
            fileReader.onload = () => {
                this.setState({
                    srcData: srcData.concat({
                        id: i,
                        src: fileReader.result
                    })
                });
            };
        }

        const formData = new FormData();
        formData.append('label', 'ID_photo-front');
        formData.append('subId', 'fa6abb94000a4ba1b19a43e60eba1516');
        formData.append('file', fileList[0]);

        fetch('http://192.168.1.128:5022/tool/file/upload', {
            method: 'POST',
            headers: {
                'Authorization': '89199cf3294520765904d47c2c570c1b',
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            body: formData,
            cridentials: 'include',
            mode: 'no-cors',
            processData: false,
            contentType: false,
        });
    }

    // 获取大图片路径
    handleLargeImage(src) {
        let me = this;

        me.setState({
            largeSrc: src,
            visible: true
        });
    }

	render() {
        let {srcData, visible, largeSrc} = this.state;

		return (
			<div className="landins-update">
				<div className="upload-btn">
                    <input
                        type="file"
                        multiple
                        id="imgLocal"
                        accept="image/*"
                        onChange={this.handleUpdatechange}
                    />上传
                </div>
                <div className="update-list">
                    <ul style={{display: 'flex',flexWrap: 'wrap'}}>
                        { srcData.length > 0 &&
                            srcData.map((item, index) => {
                                return (
                                    <li
                                        key={'src' + index}
                                        className="update-item"
                                        onClick={this.handleLargeImage.bind(this, item.src)}
                                    >
                                        <img className="update-img" src={item.src} alt="" />
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
                <ModalPic visible={visible}>
                    <img src={largeSrc} alt="" />
                </ModalPic>
			</div>
		);
	}
}

export default Update;

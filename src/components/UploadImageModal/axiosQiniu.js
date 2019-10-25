import React from "react";
import $ from 'jquery';
import "./index.less";
import { Button, notification, Modal, Select } from "antd";
import $axios from '../../utils/http';

const API_BASE_URL = 'http://localhost:800/';

export default class UploadImageModalToQiniu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_already_upload: false,
            uploadVisible: false,
            imageCats: [],
            fileList: [],
            currentImgCategory: "",
            selectedCat: {
                category: ""
            }
        };
    }

    componentWillMount() {
        // this.getImageTypes();
    }

    /**
     * 贷后获取该车型下所有类型
     * @return {[type]} [description]
     */
    getImageTypes() {
        let me = this,
            order_id = this.props.order_id;

        $axios({
            url: API_BASE_URL + "api/loan/getImageTypes",
            type: "get",
            params: {
                order_id: order_id
            }
        }).then(res => {
            let data = res.data.map(i => {
                return {
                    id: i.id,
                    name: i.comments
                };
            });
            me.setState({
                imageCats: data
            });
        });
    }

    /**
     * 贷后获取之前的照片
     * @return {[type]} [description]
     */
    getLoadRejectedImages() {
        let me = this,
            order_id = this.props.order_id;

        $axios({
            url: API_BASE_URL + "/loan/order/getRejectImages/" + order_id,
            type: "get",
            params: {}
        }).then(e => {
            let fileList = e.data.map(function(i) {
                i = {
                    ...i,
                    vid: i.id,
                    access_url: i.img_path
                };
                return i;
            });
            me.setState({
                fileList: fileList
            });
        });
    }

    uploadFile() {
        let me = this;

        if (!me.state.selectedCat.category) {
            notification["error"]({
                message: "提示",
                description: "请选择分类"
            });
            return;
        }

        $("#js-file")
            .off("change")
            .on("change", function(e) {
                var file = e.target.files[0];
                var reader = new FileReader();

                // 将文件读取为 DataURL
                reader.readAsDataURL(file);
                reader.onloadend = function() {
                    var dataURL = reader.result;

                    $axios({
                        url: API_BASE_URL + "/api/loan/upload/pic_base64",
                        params: {
                            pic_base64: dataURL
                        },
                        type: "POST",
                        dataType: "json"
                    }).then(e => {
                        let url =
                            e.data.domain + e.data.pic_prefix + e.data.pic;
                        let file_name = e.data.pic;
                        console.log("url", url);

                        let list = me.state.fileList || [];

                        list.push({
                            pic_name: file_name,
                            img_name: file_name,
                            access_url: url,
                            ...me.state.selectedCat
                        });

                        me.setState({
                            fileList: list,
                            is_already_upload: true
                        });
                    });
                };

                $("#form")[0].reset();
                return false;
            });

        setTimeout(function() {
            $("#js-file").click();
        }, 0);
    }

    uploadFileChange(pic_name) {
        let me = this;
        
        $("#js-file")
            .off("change")
            .on("change", function(e) {
                var file = e.target.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function() {
                    var dataURL = reader.result;

                    $axios({
                        url: API_BASE_URL + "/api/loan/upload/pic_base64",
                        params: {
                            pic_base64: dataURL
                        },
                        type: "POST",
                        dataType: "json"
                    }).then(e => {
                        let url =
                            e.data.domain + e.data.pic_prefix + e.data.pic;
                        let file_name = e.data.pic;
                        console.log("url", url);

                        let list = me.state.fileList || [];

                        list = list.map(function(ii) {
                            if (ii.pic_name === pic_name) {
                                ii = {
                                    ...ii,
                                    pic_name: file_name,
                                    img_name: file_name,
                                    access_url: url
                                };
                            }
                            return ii;
                        });
                        me.setState({
                            fileList: list,
                            is_already_upload: true
                        });
                    });
                };

                $("#form")[0].reset();
                return false;
            });

        setTimeout(function() {
            $("#js-file").click();
        }, 0);
    }

    handleUploadOk() {
        let me = this,
            order_id = this.props.order_id;

        if (!me.state.is_already_upload) {
            notification["info"]({
                message: "请上传图片",
                description: "请上传图片"
            });
            return;
        }

        let images = me.state.fileList.map(function(i) {
            return {
                id: i.id,
                img_name: i.pic_name,
                category_id: i.category
            };
        });

        $axios({
            url: API_BASE_URL + "/loan/order/updateImage",
            type: "post",
            params: {
                order_id: order_id,
                images: JSON.stringify(images)
            }
        }).then(e => {
            if (e.success) {
                notification["success"]({
                    message: "上传成功",
                    description: "上传成功"
                });
                me.setState({
                    uploadVisible: false,
                    selectedCat: {
                        category: ""
                    }
                });
            }
        });
    }

    handleUploadCancel() {
        let me = this;
        me.setState({
            uploadVisible: false
        });
    }

    // 选择图片分类
    selectedCat = v => {
        this.setState({
            selectedCat: {
                category: v
            }
        });
    };

    // 点击上传图片
    uploadImage() {
        let me = this;

        me.getLoadRejectedImages();
        me.setState({
            uploadVisible: true
        });
    }

    render() {
        let me = this;
        let imageCats = me.state.imageCats.map(i => (
            <Option key={i.id.toString()} value={i.id.toString()}>
                {i.name}
            </Option>
        ));

        return (
            <div className="uploadimagemodal" style={this.props.style}>
                <Modal
                    width={850}
                    className="uplaodModel"
                    title="上传图片"
                    visible={me.state.uploadVisible}
                    okText="开始上传"
                    onOk={me.handleUploadOk.bind(me)}
                    cancelText="取消"
                    onCancel={me.handleUploadCancel.bind(me)}
                >
                    <form id="form">
                        <input
                            id="js-file"
                            type="file"
                            style={{ display: "none" }}
                            accept="image/*"
                        />
                    </form>
                    <div className="upload-box">
                        {me.state.fileList.map(i => (
                            <div key={i.pic_name} className="upload-item">
                                <img
                                    src={i.access_url}
                                    className="upload-item-image"
                                    id={"uploadFile" + i.pic_name}
                                    onClick={this.uploadFileChange.bind(me, i.pic_name)}
                                />
                                <Select
                                    value={i.category}
                                    style={{ width: 180 }}
                                    allowClear
                                    disabled={true}
                                    className="upload-item-select"
                                    onFocus={this.getSelectedFocus}
                                >
                                    {imageCats}
                                </Select>
                            </div>
                        ))}
                        <div className="upload-item">
                            <img
                                id="uploadFile uploadFileAdd"
                                src="../../assets/1513842030877plus-big.png"
                                className="upload-item-image upload-item-image-add"
                                onClick={this.uploadFile.bind(me)}
                            />
                            <Select
                                defaultValue="请选择"
                                value={me.state.selectedCat.category}
                                style={{ width: 180 }}
                                onFocus={this.getSelectedFocus}
                                onChange={me.selectedCat.bind(me)}
                                allowClear
                                disabled={false}
                                className="upload-item-select"
                            >
                                <Option value="">请选择</Option>
                                {imageCats}
                            </Select>
                        </div>
                    </div>
                </Modal>
                <Button
                    type="primary"
                    size="large"
                    onClick={me.uploadImage.bind(me)}
                >
                    上传图片
                </Button>
            </div>
        );
    }
}

import React from "react";
import $ from 'jquery';
import CosCloud from 'cos-js-sdk-v4';
import "./index.less";
import { Button, notification, Modal, Select } from "antd";

const API_BASE_URL = 'http://localhost:8000/';

export default class UploadImageModal extends React.Component {
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
        if (this.props.is_after_loan) {
            this.getImageTypes();
        } else {
            this.getImageCats();
        }
    }

    /**
     * 贷后获取该车型下所有类型
     * @return {[type]} [description]
     */
    getImageTypes() {
        let me = this,
            order_id = this.props.order_id;

        $.ajax({
            url: API_BASE_URL + "api/loan/getImageTypes",
            type: "get",
            data: {
                order_id: order_id
            },
            success: function(e) {
                let data = e.data.map(i => {
                    return {
                        id: i.id,
                        name: i.comments
                    };
                });
                me.setState({
                    imageCats: data
                });
            }
        });
    }

    /**
     * 获取该车型下所有类型
     * @return {[type]} [description]
     */
    getImageCats() {
        let me = this,
            order_id = this.props.order_id;

        $.ajax({
            url: API_BASE_URL + "api/getImageCats",
            type: "get",
            data: {
                order_id: order_id
            },
            success: function(e) {
                me.setState({
                    imageCats: e.data
                });
            }
        });
    }

    /**
     * 获取之前的照片
     * @return {[type]} [description]
     */
    getRejectedImages() {
        let me = this,
            order_id = this.props.order_id;

        $.ajax({
            url: API_BASE_URL + "api/getRejectedImages/" + order_id,
            type: "get",
            data: {},
            success: function(e) {
                let fileList = e.data.map(function(i) {
                    i = {
                        ...i,
                        vid: i.id,
                        category: i.category,
                        access_url: i.pic_url,
                        storage: i.storage
                    };
                    return i;
                });
                me.setState({
                    fileList: fileList
                });
            }
        });
    }

    /**
     * 贷后获取之前的照片
     * @return {[type]} [description]
     */
    getLoadRejectedImages() {
        let me = this,
            order_id = this.props.order_id;

        $.ajax({
            url: API_BASE_URL + "/loan/order/getRejectImages/" + order_id,
            type: "get",
            data: {},
            success: function(e) {
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
            }
        });
    }

    // 上传图片至腾讯云
    uploadFile() {
        let me = this;
        var bucket = "xxx";
        var appid = "1252839326";
        var sid = "AKIDnTw5AJuRGyjMoKjPgniU5TggWBevJtfG";
        var skey = "rZ9Z0HLDtXhkcJrEoIqY4PaZMxNet45x";
        var region = "sh";

        var myFolder = "/inception_img/";

        me.cos = new CosCloud({
            appid: appid,
            bucket: bucket,
            region: region,
            getAppSign: function(callback) {
                $.get("/api/getQcloudUploadToken", function(res) {
                    callback(res.data.token);
                    console.log("cos token::", res.data.token);
                });
            },
            getAppSignOnce: function(callback) {}
        });

        var errorCallBack = function(result) {
            result = result || {};
            console.log("request error:", result && result.message);
        };

        var progressCallBack = function(curr, sha1) {
            var sha1CheckProgress = ((sha1 * 100).toFixed(2) || 100) + "%";
            var uploadProgress = ((curr || 0) * 100).toFixed(2) + "%";
            var msg =
                "upload progress:" +
                uploadProgress +
                "; sha1 check:" +
                sha1CheckProgress +
                ".";
            console.log(msg);
        };

        var lastTaskId;
        var taskReady = function(taskId) {
            lastTaskId = taskId;
        };

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
                let file_name =
                    new Date().getTime() + "." + file.name.split(".")[1];

                me.cos.uploadFile(
                    function(result) {
                        console.log("uploadfile result", result);

                        if (me.props.is_after_loan) {
                            let list = me.state.fileList || [];

                            list.push({
                                pic_name: file_name,
                                img_name: file_name,
                                ...result.data,
                                ...me.state.selectedCat
                            });

                            me.setState({
                                fileList: list,
                                is_already_upload: true
                            });
                        } else {
                            let list = me.state.fileList || [];
                            list.push({
                                pic_name: file_name,
                                ...result.data,
                                ...me.state.selectedCat
                            });

                            me.setState({
                                fileList: list,
                                is_already_upload: true
                            });
                        }
                    },
                    errorCallBack,
                    progressCallBack,
                    bucket,
                    myFolder + file_name,
                    file,
                    0,
                    taskReady
                );
                $("#form")[0].reset();
                return false;
            });

        setTimeout(function() {
            $("#js-file").click();
        }, 0);

        return false;
    }

    uploadFileChange(pic_name) {
        let me = this;
        var bucket = "xxx";
        var appid = "1252839326";
        var sid = "AKIDnTw5AJuRGyjMoKjPgniU5TggWBevJtfG";
        var skey = "rZ9Z0HLDtXhkcJrEoIqY4PaZMxNet45x";
        var region = "sh";

        var myFolder = "/inception_img/";
        me.cos = new CosCloud({
            appid: appid,
            bucket: bucket,
            region: region,
            getAppSign: function(callback) {
                $.get("/api/getQcloudUploadToken", function(res) {
                    callback(res.data.token);
                    console.log("cos token::", res.data.token);
                });
            },
            getAppSignOnce: function(callback) {}
        });

        var errorCallBack = function(result) {
            result = result || {};
            console.log("request error:", result && result.message);
        };

        var progressCallBack = function(curr, sha1) {
            var sha1CheckProgress = ((sha1 * 100).toFixed(2) || 100) + "%";
            var uploadProgress = ((curr || 0) * 100).toFixed(2) + "%";
            var msg =
                "upload progress:" +
                uploadProgress +
                "; sha1 check:" +
                sha1CheckProgress +
                ".";
            console.log(msg);
        };

        var lastTaskId;
        var taskReady = function(taskId) {
            lastTaskId = taskId;
        };

        $("#js-file")
            .off("change")
            .on("change", function(e) {
                var file = e.target.files[0];
                let new_file_name =
                    new Date().getTime() + "." + file.name.split(".")[1];
                me.cos.uploadFile(
                    function(result) {
                        if (me.props.is_after_loan) {
                            let list = me.state.fileList || [];
                            list = list.map(function(ii) {
                                if (ii.pic_name === pic_name) {
                                    ii = {
                                        ...ii,
                                        pic_name: new_file_name,
                                        img_name: new_file_name,
                                        ...result.data
                                    };
                                }
                                return ii;
                            });
                            me.setState({
                                fileList: list,
                                is_already_upload: true
                            });
                        } else {
                            let list = me.state.fileList || [];
                            list = list.map(function(ii) {
                                if (ii.pic_name === pic_name) {
                                    ii = {
                                        ...ii,
                                        pic_name: new_file_name,
                                        ...result.data
                                    };
                                }
                                return ii;
                            });
                            me.setState({
                                fileList: list,
                                is_already_upload: true
                            });
                        }
                    },
                    errorCallBack,
                    progressCallBack,
                    bucket,
                    myFolder + new_file_name,
                    file,
                    0,
                    taskReady
                ); //insertOnly==0 表示允许覆盖文件 1表示不允许
                $("#form")[0].reset();
                return false;
            });

        setTimeout(function() {
            $("#js-file").click();
        }, 0);

        return false;
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

        if (me.props.is_after_loan) {
            let images = me.state.fileList.map(function(i) {
                var storage = i.storage === 0 ? i.storage : 2;

                return {
                    id: i.id,
                    img_name: i.pic_name,
                    category_id: i.category,
                    storage: storage
                };
            });

            $.ajax({
                url: API_BASE_URL + "/loan/order/updateImage",
                type: "post",
                data: {
                    order_id: order_id,
                    images: JSON.stringify(images)
                },
                success: function(e) {
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
                }
            });
        } else {
            let images = me.state.fileList.map(function(i) {
                var storage = i.storage === 0 ? i.storage : 2;
                return {
                    id: i.id,
                    pic_name: i.pic_name,
                    category: i.category,
                    storage: storage
                };
            });

            $.ajax({
                url: API_BASE_URL + "/api/updateOrderImages/" + order_id,
                type: "post",
                data: {
                    images: JSON.stringify(images)
                },
                success: function(e) {
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
                }
            });
        }
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
        if (this.props.is_after_loan) {
            this.getLoadRejectedImages();
        } else {
            me.getRejectedImages();
        }
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
                    onOk={me.handleUploadOk.bind(me)}
                    onCancel={me.handleUploadCancel.bind(me)}
                    footer={[
                        <Button
                            key="cancel"
                            size="large"
                            onClick={this.handleUploadCancel.bind(me)}
                        >
                            取消
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            size="large"
                            onClick={this.handleUploadOk.bind(me)}
                        >
                            开始上传
                        </Button>
                    ]}
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
                                    onClick={this.uploadFileChange.bind(
                                        me,
                                        i.pic_name
                                    )}
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
                                id="uploadFile"
                                src="http://xxx-1252839326.file.myqcloud.com/inception_img/1513842030877plus-big.png"
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

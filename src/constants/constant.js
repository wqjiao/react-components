// 接口地址
export const API_BASE_URL = (function(){
	var basePath = '';
	if (window.location.href.indexOf("dd-") > 0) { // 兼容ie   
		if (window["context"] === undefined) {
			if (!window.location.origin) {
				window.location.origin = window.location.protocol + "//" 
					+ window.location.hostname + (window.location.port ? ':' + window.location.port : '');
			}
			window["context"] = location.origin + "/V6.0";
		}
		basePath = window.location.origin + "/" + window.location.pathname.split("/")[1] + "/";
	} else {
		basePath = window.location.origin + "/";
	}
	return basePath;
})();
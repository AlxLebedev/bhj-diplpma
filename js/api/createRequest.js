//Основная функция для совершения запросов на сервер

const createRequest = (options = {}, callback) => {

	let xhr = new XMLHttpRequest;
	xhr.withCredentials = true;

	let currentMethod = options.method;
	let currentUrl = null;
	let currentFormData = null;

	if (currentMethod === 'GET') {
		if(options.data) {
			let urlSettings = Object.entries(options.data).map(([key, value]) => `${key}=${value}`).join('&');
			currentUrl = `${options.url}?${urlSettings}`;
		}
  	} else {
		currentFormData = new FormData();
		currentUrl = options.url;
		for (let property in options.data) {
			currentFormData.append(property, options.data[property]);
		}
	};

	xhr.onreadystatechange = function () {
		if(this.readyState == 4) {
			if (this.status == 200) {
				callback(null, JSON.parse(this.responseText));
			} else {
				callback(this.responseType, null);
			}
		}
	};

	try {
		xhr.open(currentMethod, currentUrl);
		if (currentFormData != null) {
			xhr.send(currentFormData);
		} else {
			xhr.send();
		}		
	}
	catch (e) {
		callback(e);
	}

	return xhr;
};
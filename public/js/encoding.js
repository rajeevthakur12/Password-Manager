let getDataEncoding = (data) => {
    const enc = new TextEncoder();
    return enc.encode(data);
}

let getDataDecoding = (data) => {
    const dec = new TextDecoder('utf-8');
    return dec.decode(new Uint8Array(data));
}

let Uint8ArrayToBase64 = (data) => {
    return window.btoa(String.fromCharCode.apply(null, data));
}   

let base64ToUint8Array = (base64) => {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return new Uint8Array(bytes.buffer);
}

let encode = (record) => {
    
    return  {
		title: Uint8ArrayToBase64( getDataEncoding( record.title)),
		login: Uint8ArrayToBase64( getDataEncoding( record.login)),
		password: Uint8ArrayToBase64( getDataEncoding( record.password)),
		websiteAddress: Uint8ArrayToBase64( getDataEncoding( record.websiteAddress)),
		note: Uint8ArrayToBase64( getDataEncoding( record.note)),
		username: Uint8ArrayToBase64( getDataEncoding( record.username)),
		lastmodifiedat: Uint8ArrayToBase64( getDataEncoding( record.lastmodifiedat))      
	}
}

let decode = (record) => {
    
    return  {
		title: getDataDecoding( base64ToUint8Array( record.title)),
		login: getDataDecoding( base64ToUint8Array( record.login)),
		password: getDataDecoding( base64ToUint8Array( record.password)),
		websiteAddress: getDataDecoding( base64ToUint8Array( record.websiteAddress)),
		note: getDataDecoding( base64ToUint8Array( record.note)),
		username: getDataDecoding( base64ToUint8Array( record.username)),
		lastmodifiedat: getDataDecoding( base64ToUint8Array( record.lastmodifiedat))
	}
}

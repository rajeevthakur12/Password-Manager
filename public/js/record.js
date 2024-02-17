import { makeRequest } from '/js/request.js';
import { show } from '../partials/messages.js';
const log = console.log

let url = window.location.origin;
let insertForm = document.getElementById('add-secret');

insertForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	let input = insertForm.elements;
	let record = {
		title: encode( input[0].value),
		login: encode( encrypt(input[1].value)),
		password: encode( encrypt(input[2].value)),
		websiteAddress: encode( encrypt(input[3].value)),
		note: encode( input[4].value),
		username: 'NA'
	};

	record.username = getUsername();
	try {
		makeRequest({
			method: "POST",
			url: `/secret/add`,
			headers: { "Content-Type": "application/json;charset=UTF-8" },
			data: { secret: record }
		});
		document.getElementsByClassName('close')[0].click();
		insertForm.reset();
		viewVault()
	} catch (error) {
		// ohh no! something went wrong....
		console.log(error);
	}
});

// show decrypted secret
window.decryptSecret = async function (id) {
	let rwForm = document.getElementById('update-secret');
	document.getElementById('record-id').setAttribute("data-content", id);
	try {
		let secret = await getRecordById(id);
		var e = rwForm.elements;
		e[0].value = ( await decrypt( decode(secret.login), true)) || 'NA'
		e[1].value = ( await decrypt( decode(secret.password), true)) || 'NA'
		e[2].value = ( await decrypt( decode(secret.websiteAddress), true)) || 'NA'
		e[3].value = decode(secret.note);
		document.getElementById('record-title').innerHTML = `<span class="material-icons" style="vertical-align: middle; opacity: 0.5; color: black">text_snippet</span>` + decode(secret.title);

		if(e[0].value == 'NA'){
			e[3].value = 'TRY DIFFERENT MASTER KEY'
			e[3].style.color = 'red'
			document.getElementById('secretUpdate').disabled = true
			document.getElementById('record-title').innerHTML = `<span class="material-icons" style="vertical-align: middle; opacity: 0.5">text_snippet</span>` + 'unable to get record !';
			document.getElementById('record-title').style.color = 'red';
		}
		else{
			document.getElementById('record-title').style.color = 'black';
			document.getElementById('secretUpdate').disabled = false
			e[3].style.color = 'black'
		}
		viewVault();

		$('#update-secret-modal').modal('show');
	} catch (error) {
		show(error, "danger", "system-msg");
		console.log(error);
	}
}

function getUsername() {
	let username = document.getElementById('username').innerText;
	let parts = username.split(' ');

	return parts[1];
}

function encrypt(data) {
	return stringify(CryptoJS.AES.encrypt(
		data,
		document.getElementById("masterkey").value
	));
}

function decrypt(encrypted, parse = false) {

	if (parse == true) {
		encrypted = JSON.parse(encrypted)
	}

	try {
		let data = CryptoJS.AES.decrypt(
			encrypted,
			document.getElementById('masterkey').value
		).toString(CryptoJS.enc.Utf8);
		return data
	} catch (error) {
		return 'Try Different Key'
	}
}

function stringify(obj) {
	let cache = [];
	let str = JSON.stringify(obj, function (key, value) {
		if (typeof value === "object" && value !== null) {
			if (cache.indexOf(value) !== -1) {
				// Circular reference found, discard key
				return;
			}
			// Store value in our collection
			cache.push(value);
		}
		return value;
	});
	cache = null; // reset the cache
	return str;
}

async function getRecordById(id) {
	let record = await getAllRecord()
	for (let i = 0; i < record.length; i++) {
		if (id == record[i].id) {
			return record[i]
		}
	}
}

// view complete vault
window.viewVault = async function () {
	try {
		let secrets = await getAllRecord();
		let all = "";
		for (let i = 0; i < secrets.length; i++) {

			secrets[i].lastModifiedAt = timeSince(new Date(secrets[i].lastModifiedAt));
			all += `<tr class="table-row">
				<td onclick="decryptSecret(this.id)" id="${secrets[i].id}"  style="cursor: pointer;"> 
				<span class="material-icons" style="vertical-align: bottom;">text_snippet</span>
				${decode(secrets[i].title)}</td>
				<td onclick="decryptSecret(this.id)" id="${secrets[i].id}"  style="cursor: pointer;">${secrets[i].lastModifiedAt}</td>

				<td scope="row" onclick="decryptSecret(this.id)" id="${secrets[i].id}"  style="cursor: pointer;">
					${decode(secrets[i].note)}
				</td>

				<td  style="cursor: pointer;">
				<a class="dropdown-item" onclick="deleteRecord(this.name);" data-toggle="modal" data-target="#confirm-delete" name=${secrets[i].id}><i class="material-icons" style="color:black">delete</i></a>
                </td>

			</tr>`;
		}
		const tbody = document.getElementById('all-records');
		tbody.innerHTML = all;
	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
}

async function getAllRecord() {
	let username = getUsername();
	return (await makeRequest({
		method: "POST",
		url: `/secret/record`,
		headers: { "Content-Type": "application/json;charset=UTF-8" },
		data: { username: username }
	})).response;
}

window.deleteRecord = (id) => {
	if (!confirm('Are you sure you want to delete the secret permanently, Continue ?')) return;
    makeRequest({method: "DELETE", url: `/secret/${id}`});
	viewVault()
}

window.getDataEncoding = (data) => {
    const enc = new TextEncoder();
    return enc.encode(data);
}

window.getDataDecoding = (data) => {
    const dec = new TextDecoder('utf-8');
    return dec.decode(new Uint8Array(data));
}

window.Uint8ArrayToBase64 = (data) => {
    return window.btoa(String.fromCharCode.apply(null, data));
}   

window.base64ToUint8Array = (base64) => {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return new Uint8Array(bytes.buffer);
}

let encode = (data) => {
    
    return Uint8ArrayToBase64( getDataEncoding( data))
}

let decode = (data) => {
    
    return getDataDecoding( base64ToUint8Array( data))
}


function timeSince(date) {
	let val;

	let seconds = Math.floor((new Date() - date) / 1000);

	let interval = seconds / 31536000;

	if (interval > 1) {
		val = Math.floor(interval);
		if (val == 1) return "a year ago";
		else return val + " years ago";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		val = Math.floor(interval);
		if (val == 1) return "a month ago";
		else return val + " months ago";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		val = Math.floor(interval);
		if (val == 1) return "a day ago";
		else return val + " days ago";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		val = Math.floor(interval);
		if (val == 1) return "an hour ago";
		else return val + " hours ago";
	}
	interval = seconds / 60;
	if (interval > 1) {
		val = Math.floor(interval);
		if (val == 1) return "a minute ago";
		else return val + " minutes ago";
	}
	return "a few seconds ago";
}

window.test = () => {
	console.log('test')
}

// calling functions
viewVault()
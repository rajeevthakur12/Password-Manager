import {makeRequest} from '/js/request.js'
let url = window.location.origin;

export function genPasswordHash(data) {
    return new Promise(async (resolve, reject)=> {
        try {
            const msgUint8 = new TextEncoder().encode(data);                           // encode as (utf-8) Uint8Array
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
            const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
            resolve(hashHex);
        } catch (error) {
            reject(error);
        }
        
    });
}

export function Uint8ArrayToBase64(data) {
    return window.btoa(String.fromCharCode.apply(null, data));
}  
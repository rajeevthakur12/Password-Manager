import {
    genPasswordHash
} from '../js/crypto.js';
import {makeRequest} from '../js/request.js';
const url = window.location.origin;

export async function addUser(user) {
    user.password = await genPasswordHash(user.password);
    user.confirmPassword = await genPasswordHash(user.confirmPassword);
    return makeRequest({method: "POST", url: `${url}/join/register`, headers: {"Content-Type": "application/json;charset=UTF-8"}, data: user});
}
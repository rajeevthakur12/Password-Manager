import {genPasswordHash} from '../js/crypto.js';

const form = document.getElementById('form');
form.addEventListener('submit', async(event)=> {
    event.preventDefault();
    const password = document.getElementById('password');
    password.value = await genPasswordHash(password.value);
    form.submit();
});

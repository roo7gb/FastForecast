/*

    cookies.js

    A utility file defining a function to get the CSRF
    cookie for use in POSTs in other files.

    author: Jo Richmond

*/

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

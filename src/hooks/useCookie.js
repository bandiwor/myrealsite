import jwtDecode from 'jwt-decode';

function get(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}

function set(name, value, expirationSeconds) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (expirationSeconds * 1000));
    const expirationString = "expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + value + ";" + expirationString + ";path=/";
}

function getExpTime(jwt) {
    console.log(jwtDecode(jwt));
    let exp_time = jwtDecode(jwt).exp;
    return Date.now() - exp_time;
}

const functions = {set, get, getExpTime};

export default functions;
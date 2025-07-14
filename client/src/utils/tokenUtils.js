import jwtDecode from "jwt-decode";

export function isTokenExpired(token){
    try{
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000) ; // because Date.now() provided current time in milliseconds but jwt in seconds 
        return decoded.exp < now;
    }
    catch( e ){
        console.log( e.message());
        return false;  // if not valid 
    }
}


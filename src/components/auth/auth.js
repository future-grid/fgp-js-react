class Auth {
    constructor(){
        this.authenticated = localStorage.getItem('fgpReact_authoken')
    }



    login(creds, cb){
        if(creds.user==="admin" && creds.pass==="password"){
            localStorage.setItem('fgpReact_authoken', "true")
            this.authenticated = "true";
            cb();
        }else{

        }    
    }

    logout(cb){
        localStorage.setItem('fgpReact_authoken', "false")
        this.authenticated = "false";
        cb();
    }

    isAuthenticated() {
        let token = localStorage.getItem('fgpReact_authoken');
        if( token === "true"){
            return this.authenticated;
        }else{
            if(token === "false"){
                return this.authenticated;
            }else{
                localStorage.setItem('fgpReact_authoken', "false")
                return this.authenticated;
            }
        }
    }
}

export default new Auth()
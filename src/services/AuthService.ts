import { users } from "../data/users";

class AuthService{

    login(usuario:string,password:string){

        return users.find(

            user=>

                user.usuario===usuario &&

                user.password===password

        );

    }

}

export default new AuthService();
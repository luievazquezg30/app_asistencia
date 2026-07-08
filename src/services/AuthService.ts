import { users } from "../data/users";

class AuthService{

    login(usuario:string,password:string){

    const usuarioEncontrado = users.find(

        user=>
            user.usuario===usuario &&
            user.password===password

    );


    console.log("Usuario encontrado:", usuarioEncontrado);


    return usuarioEncontrado;

}

    }


export default new AuthService();
document.querySelector("#btnRegistro").addEventListener("click",Registro)

function Registro(){
    //Faltan las validaciones
    let nombre = document.querySelector("#name").value.trim();
    let apellido = document.querySelector("#apellido").value.trim();    
    let email = document.querySelector("#email").value.trim();
    let address = document.querySelector("#address").value.trim();
    let pasw = document.querySelector("#pasw").value.trim();

    let datos = {
        "nombre":nombre,
        "apellido":apellido,
        "email": email,
        "direccion":address,
        "password":pasw
        }


    fetch("https://recetas-api-taller.herokuapp.com/api/usuarios",
    {
        method: "POST",             //los parametros siempre viajan en el body
        body:JSON.stringify(datos),  //
        headers:{
            "content-type":"application/json"
        }

    })
    .then(function (response){        
        if(response.status !=200){
            throw new Error("Los datos no son correctos");
        }
        return response.json();
    })
    .then(function (data){
        console.log(data);        
    })
    .catch(function(error){
        console.log(error)
    })
}

document.querySelector("#btnSesion").addEventListener("click",iniciarSesion)

function iniciarSesion(){
    //Faltan las validaciones       
    let emailSesion = document.querySelector("#emailSesion").value.trim();    
    let paswSesion = document.querySelector("#paswSesion").value.trim();

    let datos = {        
        "email": emailSesion,        
        "password":paswSesion
        }


    fetch("https://recetas-api-taller.herokuapp.com/api/usuarios/session",
    {
        method: "POST",             //los parametros siempre viajan en el body
        body:JSON.stringify(datos),  //
        headers:{
            "content-type":"application/json"
        }

    })
    .then(function (response){        
        if(response.status != 200){
            throw new Error("Los datos no son correctos");
        }
        return response.json();
    })
    .then(function (data){
        console.log(data);
        localStorage.setItem("token",data.token)            //aqui almaceno en el navegador    
    })
    .catch(function(error){
        console.log(error)
    })
}
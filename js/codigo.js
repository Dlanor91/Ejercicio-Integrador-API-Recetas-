document.querySelector("#btnRegistro").addEventListener("click", Registro);
document.querySelector("#btnInicioSesion").addEventListener("click", IniciarSesion);
let menu = document.getElementById("Menu");
let ruteo = document.getElementById("miRuteo");
ruteo.addEventListener("ionRouteWillChange", QueMostrar);
document.querySelector("#Volver").addEventListener("click", VolveraPaginaAnterior);
let primerIngreso = false;
let latitudUsuario;
let longitudUsuario;
let map;
let direccionUsuario;

function VolveraPaginaAnterior() {
    ruteo.back();
}

navigator.geolocation.getCurrentPosition(GuardarPosicionUsuario, MostrarErrorUbicacion);

function GuardarPosicionUsuario(position) {
    latitudUsuario = position.coords.latitude;
    longitudUsuario = position.coords.longitude;
}
function MostrarErrorUbicacion(error) {
    console.log(error);
}
function closeMenu() {
    menu.close();
}


function loadRecetas() {
    fetch("https://recetas-api-taller.herokuapp.com/api/recetas",
        {
            headers:
            {
                "x-auth": localStorage.getItem("token")
            }
        }
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let datos = "";
            for (let i = 0; i < data.length; i++) {

                datos += `<ion-card><img src="${data[i].urlImagen}"/><ion-card-header><ion-card-subtitle>${data[i].nombre}</ion-card-subtitle><ion-card-title>${data[i].nombre}</ion-card-title>`;
                datos += `</ion-card-header><ion-card-content>${data[i].nombre}`;
                datos += `<ion-button onclick="MostrarDetalle('${data[i]._id}')">Detalle</ion-button></ion-card-content></ion-card>`;
            }
            document.querySelector("#recetas").innerHTML = datos;
        })
        .catch(function (error) {
            console.log(error.message);
        })
}

function MostrarDetalle(idReceta) {
    document.querySelector("#detalleReceta").innerHTML = "";
    console.log("El id de receta es " + idReceta);
    fetch("https://recetas-api-taller.herokuapp.com/api/recetas/" + idReceta,
        {
            headers: {
                "x-auth": localStorage.getItem("token"),
                "content-type": "application/json"
            },


        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let ingredientes = data.ingredientes;
            direccionUsuario = data.usuario.direccion;
            let item = document.createElement("ion-item");
            let itemLabel = document.createElement("ion-label");
            let parrafo = document.createElement("p");
            let texto = document.createTextNode(ingredientes);
            parrafo.appendChild(texto);
            itemLabel.appendChild(parrafo);
            item.appendChild(itemLabel);



            document.querySelector("#detalleReceta").appendChild(item);
            document.querySelector("#pagina-DetalleReceta").style.display = "block";

            let mapa = document.createElement("div");
            mapa.setAttribute("id", "map");
            mapa.style.height = "180px";

            document.querySelector("#detalleReceta").appendChild(mapa);

            if (map != null) {
                map.remove();
            }
            map = L.map('map').setView([latitudUsuario, longitudUsuario], 13);
        
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
                tileSize: 512,
                zoomOffset: -1,
            }).addTo(map);
        
            L.marker([latitudUsuario, longitudUsuario]).addTo(map)
                .bindPopup('Mi posición')
                .openPopup();
        
            agregarMarcadorUsuarioReceta(direccionUsuario);
            setTimeout(function () {
                let routeDetalle = document.createElement("ion-route");
                routeDetalle.setAttribute("url", "/Detalle-Receta");
                routeDetalle.setAttribute("component", "pagina-DetalleReceta");
                ruteo.appendChild(routeDetalle);
                ruteo.push("/Detalle-Receta");

                console.log("La latitud del usuario es " + latitudUsuario);
                console.log("La longitud es" + longitudUsuario);
            }, 500);



        })
}

function agregarMarcadorUsuarioReceta(direccion) {

    console.log(direccion);
    fetch("https://nominatim.openstreetmap.org/search?&street=Cuareim&city=Montevideo&country=Uruguay&format=json")

        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let latitudeUsuarioReceta = data[0].lat;
            let longitudUsuarioReceta = data[0].lon;

            L.marker([latitudeUsuarioReceta, longitudUsuarioReceta]).addTo(map)
                .bindPopup('Posicion del usuario de la receta')
                .openPopup();

            let distancia = map.distance([latitudUsuario, longitudUsuario], [latitudeUsuarioReceta, longitudUsuarioReceta]);
            console.log("La distancia es" + distancia);

        })
}


function QueMostrar(event) {
    console.log(event.detail);
    let paginas = document.getElementsByClassName("pagina");
    for (let i = 0; i < paginas.length; i++) {
        paginas[i].style.display = "none";
    }
    let paginaMostrar = event.detail.to;

    if (localStorage.getItem("token") != null && !primerIngreso) {
        loadRecetas();
        paginaMostrar = "/Recetas";
        primerIngreso = true;
    }

    if (paginaMostrar === "/") {
        document.querySelector("#pagina-Registro").style.display = "block";
    }
    else if (paginaMostrar === "/Login") {
        document.querySelector("#pagina-Login").style.display = "block";
    }
    else if (paginaMostrar === "/Recetas") {
        loadRecetas();
        document.querySelector("#pagina-Recetas").style.display = "block";
    }
    else if (paginaMostrar === "/Detalle-Receta") {       
        document.querySelector("#pagina-DetalleReceta").style.display = "block";
    }
    else if(paginaMostrar==="/Logout"){
        localStorage.clear(); //elimina todos las claves del localStorage
        localStorage.removeItem("token"); //elimina solo la clave indicada en los parametros de removeItem 
        document.querySelector("#pagina-Login").style.display = "block";
    }

}

function Registro() {
    //faltan agregar validaciones
    let nombre = document.querySelector("#nombre").value.trim();
    let apellido = document.querySelector("#apellido").value.trim();
    let direccion = document.querySelector("#direccion").value.trim();
    let email = document.querySelector("#email").value.trim();
    let password = document.querySelector("#password").value.trim();
    let datos = {
        "nombre": nombre,
        "apellido": apellido,
        "direccion": direccion,
        "email": email,
        "password": password
    }
    fetch("https://recetas-api-taller.herokuapp.com/api/usuarios",
        {
            method: "POST",
            body: JSON.stringify(datos),
            headers: {
                "content-type": "application/json"
            }

        })
        .then(function (response) {
            console.log("Los datos de la primera promise es " + response.status);
            if (response.status !== 200) {
                throw new Error("Los datos no son correctos");
            }
            return response.json();

        })
        .then(function (datos) {
            console.log("Los datos de la segunda promise es " + datos.error);
            presentToast();

        })
        .catch(function (error) {
            presentToast(error.message);
        })

}
function presentToast(error) {
    const toast = document.createElement('ion-toast');
    toast.message = error;
    toast.duration = 2000;
    toast.color = "warning";
    document.body.appendChild(toast);
    return toast.present();
}
function IniciarSesion() {
    let email = document.querySelector("#emailSesion").value.trim();
    let password = document.querySelector("#passwordSesion").value.trim();
    let datos = {
        "email": email,
        "password": password
    }
    fetch("https://recetas-api-taller.herokuapp.com/api/usuarios/session",
        {
            method: "POST",
            body: JSON.stringify(datos),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            localStorage.setItem("token", data.token);
            //presentAlert();
            ruteo.push("/Recetas");
        })
        .catch(function (error) {
            console.log(error.message);
        })

}
async function presentAlert() {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.message = 'El usuario inicio sesión correctamente.';
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    await alert.present();
}
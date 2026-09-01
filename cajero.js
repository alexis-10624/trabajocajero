// Variables iniciales declaradas donde se guardan los datos de la cuenta 
let nombre = "";
let clave = "";
let saldo = 0;
let bloqueado = "no";
let movimientos = [];
// se pone [] para que sea un array que nos deja guardar varias cosas


// localStorage nos guarda la informacion en el navegador 
// el get item recupera los datos guardados en el localStorage
// == esto se usa para comparar si es lo mismo que registro
if (localStorage.getItem("nombre") !== null) {
    nombre = localStorage.getItem("nombre");
    clave = localStorage.getItem("clave");
    saldo = Number(localStorage.getItem("saldo"));
    bloqueado = localStorage.getItem("bloqueado");
    
    // si existen movimientos guardados en el localStorage los traemos 
    // usamos JSON.parse para convertir el texto guardado de vuelta a un Array (lista)
    if (localStorage.getItem("movimientos") !== null) {
        movimientos = JSON.parse(localStorage.getItem("movimientos"));
    }
}

// utilizamos proomp para que salga el cuadro donde pedimos los datos 
// n\ usamos esta n para que aparezca arriba y abajo

function registrar() {
    let nom = prompt("REGISTRO\nUsuario:");
    let cla = prompt("Clave:");
    let cla2 = prompt("Repita la clave:");
    let ini = Number(prompt("Saldo inicial:"));
// aca validamos que las claves sean iguales
// y evitamos qe ingresen valores negativos
    if (cla !== cla2) {
        alert("Las claves no coinciden");
    } else if (ini >= 0) {
        //aca guardamos todo en las variables y en el localstorage 
        nombre = nom;
        clave = cla;
        saldo = ini;
        bloqueado = "no";
        movimientos = []; // reiniciamos la lista de movimientos para el nuevo registro
        //set item se usa para guardar los datos en el localStorage
        
        localStorage.setItem("nombre", nombre);
        localStorage.setItem("clave", clave);
        localStorage.setItem("saldo", saldo);
        localStorage.setItem("bloqueado", bloqueado);
        localStorage.setItem("movimientos", JSON.stringify(movimientos));
        //json .stringify se usa para convertir el array a texto y poder guardarlo en el localStorage
        alert("Usuario " + nombre + " registrado con exito");
    } else {
        alert("Saldo no valido");
    }
}

// aca se ve si la clave es correcta y si el usuario da
// si no es se crea una alerta donde dice que el usuario no existe
function iniciarSesion() {
    let nom = prompt("INICIO DE SESION\nUsuario:");

    if (nom !== nombre) {
        alert("El usuario no existe");
        return "no";
    }
    // aca === se usa para comparar estrictamente si es igual
    // si no lo bloquea y no deja ingresar a la cuenta
    if (bloqueado === "si") {
        alert("Cuenta bloqueada por 24 horas, comunicate con tu banco");
        return "no";
    }
//aca se colocamos los intentos y si es correcto o no 
// utilizamos while para que el ciclo cumpla la condicion especifica
    let intentos = 0;
    while (intentos < 3) {
        let cla = prompt("Clave (Intento " + (intentos + 1) + " de 3):");
        if (cla === clave) {
            alert("Bienvenido " + nombre);
            return "si";
        }
        intentos = intentos + 1;
        alert("Clave incorrecta. Intentos restantes: " + (3 - intentos));
    }
// si se pasa de 3 intentos bloqea la cuenta 
// si intenta refrescar la pagina no le va dar porque ya se guardo 
// le sale un mensaje dicienle que ya no hay nada que hacer
    bloqueado = "si";
    localStorage.setItem("bloqueado", "si");
    alert("Cuenta bloqueada por 24 horas, comunicate con tu banco");
    return "no";
}
// creamos un objeto con todos los datos del movimiento
// usamos push para meter ese objeto dentro de la lista (Array) de movimientos
// volvemos a guardar la lista actualizada en el localStorage
function agregarMovimiento(concepto, valor) {
let nuevoMovimiento = {
fechaHora: new Date().toLocaleString(),
tipo: concepto,
monto: valor,
saldoResultante: saldo
};

movimientos.push(nuevoMovimiento);
localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

// aca vemos que el monto sea mayor a 0 y menor o igual al saldo
// se hace la resta y se guarda
//ponemos && para ver que se cumplan las dos condiciones
//colocamos y agregarmovimiento para que muestre que se hizo

function retirar() {
let monto = Number(prompt("RETIRAR\nMonto:"));
if (monto > 0 && monto <= saldo) {
saldo = saldo - monto;
localStorage.setItem("saldo", saldo);
agregarMovimiento("Retiro", monto);
alert("Retiro exitoso. Nuevo saldo: " + saldo);
} else if (monto > saldo) {
alert("Fondos insuficientes. Saldo: " + saldo);
} else {
alert("Monto no valido");
}
}

// aca decimos que monto es mayor a 0
// sumamos monto y saldo y lo guardamos en el localstorage
// agregamos movimiento para que nos diga que se hizo
// y nos muestre el nuevo saldo con un mensaje
function consignar() {
let monto = Number(prompt("CONSIGNAR\nMonto:"));
if (monto > 0) {
saldo = saldo + monto;
localStorage.setItem("saldo", saldo);
agregarMovimiento("Consignacion", monto);
alert("Consignacion exitosa. Nuevo saldo: " + saldo);
} else {
alert("El monto debe ser positivo");
}
}

// aca nos muestra el saldo actual de la cuenta
function consultarSaldo() {
alert("Su saldo actual es: " + saldo);
}

// revisamos la cantidad de elementos en la lista con .length
// usamos un ciclo for para recorrer cada transaccion guardada en el Array
// mostramos todo el historial formateado en una sola ventana emergente (alert)

function consultarMovimientos() {
if (movimientos.length === 0) {
alert("No hay movimientos registrados");
} else {
let texto = "HISTORIAL DE MOVIMIENTOS DE " + nombre + ":\n\n";
for (let i = 0; i < movimientos.length; i++) {
let m = movimientos[i];
texto = texto + (i + 1) + ". [" + m.fechaHora + "] " + m.tipo + " de $" + m.monto + " | Saldo: $" + m.saldoResultante + "\n";
}
alert(texto);
}


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

    console.log("[CARGA] Cuenta encontrada en localStorage ->", { nombre, saldo, bloqueado, movimientos });
} else {
    console.log("[CARGA] No hay ninguna cuenta guardada todavia en localStorage");
}

// utilizamos proomp para que salga el cuadro donde pedimos los datos 
// n\ usamos esta n para que aparezca arriba y abajo

function registrar() {
    let nom = prompt("REGISTRO\nUsuario:");
    let cla = prompt("Clave:");
    let cla2 = prompt("Repita la clave:");
    let ini = Number(prompt("Saldo inicial:"));

    console.log("[REGISTRO] Datos ingresados ->", { nom, saldoInicial: ini, clavesCoinciden: cla === cla2 });
// aca validamos que las claves sean iguales
// y evitamos qe ingresen valores negativos
    if (cla !== cla2) {
        console.log("[REGISTRO] Rechazado: las claves no coinciden");
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
        console.log("[REGISTRO] Cuenta creada con exito ->", { nombre, saldo, bloqueado });
        alert("Usuario " + nombre + " registrado con exito");
    } else {
        console.log("[REGISTRO] Rechazado: saldo inicial no valido ->", ini);
        alert("Saldo no valido");
    }
}

// aca se ve si la clave es correcta y si el usuario da
// si no es se crea una alerta donde dice que el usuario no existe
function iniciarSesion() {
    let nom = prompt("INICIO DE SESION\nUsuario:");
    console.log("[LOGIN] Usuario ingresado:", nom);

    if (nom !== nombre) {
        console.log("[LOGIN] Rechazado: el usuario no existe");
        alert("El usuario no existe");
        return "no";
    }
    // aca === se usa para comparar estrictamente si es igual
    // si no lo bloquea y no deja ingresar a la cuenta
    if (bloqueado === "si") {
        console.log("[LOGIN] Rechazado: la cuenta esta bloqueada");
        alert("Cuenta bloqueada por 24 horas, comunicate con tu banco");
        return "no";
    }
//aca se colocamos los intentos y si es correcto o no 
// utilizamos while para que el ciclo cumpla la condicion especifica
    let intentos = 0;
    while (intentos < 3) {
        let cla = prompt("Clave (Intento " + (intentos + 1) + " de 3):");
        console.log("[LOGIN] Intento " + (intentos + 1) + " de 3 -> clave correcta:", cla === clave);
        if (cla === clave) {
            console.log("[LOGIN] Acceso concedido para", nombre);
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
    console.log("[LOGIN] Cuenta bloqueada tras 3 intentos fallidos");
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
    console.log("[MOVIMIENTO] Registrado ->", nuevoMovimiento);
}

// aca vemos que el monto sea mayor a 0 y menor o igual al saldo
// se hace la resta y se guarda
//ponemos && para ver que se cumplan las dos condiciones
//colocamos y agregarmovimiento para que muestre que se hizo

function retirar() {
    let monto = Number(prompt("RETIRAR\nMonto:"));
    console.log("[RETIRO] Monto solicitado:", monto, "| Saldo antes:", saldo);
    if (monto > 0 && monto <= saldo) {
        saldo = saldo - monto;
        localStorage.setItem("saldo", saldo);
        agregarMovimiento("Retiro", monto);
        console.log("[RETIRO] Exitoso. Saldo despues:", saldo);
        alert("Retiro exitoso. Nuevo saldo: " + saldo);
    } else if (monto > saldo) {
        console.log("[RETIRO] Rechazado: fondos insuficientes");
        alert("Fondos insuficientes. Saldo: " + saldo);
    } else {
        console.log("[RETIRO] Rechazado: monto no valido");
        alert("Monto no valido");
    }
}

// aca decimos que monto es mayor a 0
// sumamos monto y saldo y lo guardamos en el localstorage
// agregamos movimiento para que nos diga que se hizo
// y nos muestre el nuevo saldo con un mensaje
function consignar() {
    let monto = Number(prompt("CONSIGNAR\nMonto:"));
    console.log("[CONSIGNACION] Monto solicitado:", monto, "| Saldo antes:", saldo);
    if (monto > 0) {
        saldo = saldo + monto;
        localStorage.setItem("saldo", saldo);
        agregarMovimiento("Consignacion", monto);
        console.log("[CONSIGNACION] Exitosa. Saldo despues:", saldo);
        alert("Consignacion exitosa. Nuevo saldo: " + saldo);
    } else {
        console.log("[CONSIGNACION] Rechazada: el monto debe ser positivo");
        alert("El monto debe ser positivo");
    }
}

// aca nos muestra el saldo actual de la cuenta
function consultarSaldo() {
    console.log("[CONSULTA SALDO] Saldo actual:", saldo);
    alert("Su saldo actual es: " + saldo);
}

// length se usa para saber que hay en la lista
// === se usa para comparar si hay movimientos guardados o no
function consultarMovimientos() {
    console.log("[CONSULTA MOVIMIENTOS] Cantidad de movimientos:", movimientos.length, "| Detalle:", movimientos);
    if (movimientos.length === 0) {
        alert("No hay movimientos registrados");
    } else {
    //usamos i para asiganarle un contador 
    // ponemos length para que nos diga cuantos movimientos hay y nos los muestre
    //i++ para que vaya sumando uno a uno y nos muestre todos los movimientos
    //ponemos m para que nos muestre el orden de los movimientos
    //i + 1 para que nos muestre el numero de movimiento 


        let texto = "HISTORIAL DE MOVIMIENTOS DE " + nombre + ":\n\n";
        for (let i = 0; i < movimientos.length; i++) {
            let m = movimientos[i];
            texto = texto + (i + 1) + ". [" + m.fechaHora + "] " + m.tipo + " de $" + m.monto + " | Saldo: $" + m.saldoResultante + "\n";
        }
        alert(texto);
    }
}

// se usa swich para que sea ordenado
//se usa while para que cuandoo se salga del menu vuelva al menu de iniciar sesion

function menuTransacciones() {
    let op = "";
    while (op !== "5") {
        op = prompt("MENU " + nombre + "\n1. Retirar\n2. Consignar\n3. Consultar Saldo\n4. Movimientos\n5. Salir");
        console.log("[MENU TRANSACCIONES] Opcion seleccionada:", op);
        switch (op) {
            case "1": retirar();              break;
            case "2": consignar();            break;
            case "3": consultarSaldo();       break;
            case "4": consultarMovimientos(); break;
            case "5": alert("Sesion cerrada"); break;
            default:  alert("Opcion no valida");
        }
    }
}

// en este menu se usa lo mismo que en el anterior pero para iniciar sesion y registrar
// pero usamos if para que nos diga si es correcto o no y nos deje ingresar a la cuenta
//usamos === para comparar si es igual y !== para comparar si no es igual de manera mas estricta
function main() {
    let op = "";
    while (op !== "3") {
        op = prompt("BANCO MI PLATA\n1. Iniciar sesion\n2. Registrar\n3. Salir");
        console.log("[MENU PRINCIPAL] Opcion seleccionada:", op);
        if (op === "1") {
            if (iniciarSesion() === "si") { menuTransacciones(); }
        } else if (op === "2") {
            registrar();
        } else if (op === "3") {
            alert("Aplicacion finalizada");
        } else {
            alert("Opcion no valida");
        }
    }
}

main();

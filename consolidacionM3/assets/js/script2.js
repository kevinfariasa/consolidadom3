import { v4 as uuidv4 } from "https://jspm.dev/uuid";

class Finanzas {
    constructor(presupuesto = 0) {
        this.presupuesto = parseFloat(presupuesto);
        this.gastos = [];
    }

    agregarPresupuesto(monto) {
        if ((!/[\D]/gm.test(monto) && monto != '' && monto > 0)){
            this.presupuesto += parseFloat(monto);
        }
        else{
            alert ("Ingrese un monto válido")

        }
    }

    agregarGasto(gasto) {
        if ((!/[\D]/gm.test(gasto.valor) && gasto.valor != '' && gasto.valor > 0)){
            if (this.saldo() - gasto.valor < 0) {
                alert(
                    "No hay saldo suficiente para comprar este producto.\nSaldo: " +
                        this.saldo() +
                        "\nMonto compra: " +
                        gasto.valor
                );
            } else {
                this.gastos.push(gasto);
            }
        } else{
            alert("Ingresa un valor válido")
        }
    }

    saldo() {
        return this.presupuesto - this.matematicaGastos();
    }

    matematicaGastos() {
        let gastoTotal = 0;
        this.gastos.forEach((gasto) => {
            gastoTotal += gasto.valor;
        });        
        return gastoTotal;
    }

    eliminarGasto(filaID) {
        this.gastos = this.gastos.filter((gasto) => gasto.id != filaID);
    }
}

/* FIN CLASE FINANZAS */

class Producto {
    constructor(id, nombre, valor) {
        this.id = id;
        this.nombre = nombre;
        this.valor = parseFloat(valor);
    }
}

//Botón de agregar presupuesto
let miPresupuesto = new Finanzas();
$("#botonPresupuesto").click(function (evento) {
    evento.preventDefault();
    let presupuesto = parseInt($("#cantidadPresupuesto").val());
    miPresupuesto.agregarPresupuesto(presupuesto);    
    actualizarDatos(miPresupuesto);
});

function actualizarDatos(miPresupuesto) {
    //lógica actualiza primera tabla
    $("#ingresos").text( `$ ${(miPresupuesto.presupuesto).toLocaleString()}`);
    $("#gastos").text( `$ ${(miPresupuesto.matematicaGastos()).toLocaleString()}`);
    $("#saldo").text( `$ ${(miPresupuesto.saldo()).toLocaleString()}`);
    $("#disabled").removeAttr("disabled");

    //lógica actualiza segunda tabla
    let filas = "";
    miPresupuesto.gastos.forEach((gasto) => {
        filas += `<tr>
                    <td>${gasto.nombre}</td>
                    <td>${gasto.valor}</td>
                    <td><a href="" data-id="${gasto.id}" class="basurero"><img src="./assets/img/basurero.png" width="15px" alt="basurero"></a></td>
                </tr>`;
    });
    $("#tBody").html(filas);
}

//Botón de agregar gastos
$("#botonGasto").click(function (evento) {
    evento.preventDefault();
    let id = uuidv4();
    let nombre = $("#nombreGasto").val();
    let valor = $("#cantidadGasto").val();
    let item = new Producto(id, nombre, valor);
    miPresupuesto.agregarGasto(item);
    actualizarDatos(miPresupuesto);
});

//Botón borrar elementos de tabla
$("#tBody").on("click", "#fila", function () {
    $(this).parent().remove();
    miPresupuesto.eliminarGasto($(this).prev().text());
    actualizarDatos(miPresupuesto);
});

$("#tBody").on("click", ".basurero", function (evento) {
    evento.preventDefault();
    let elemento = $(this)[0];
    miPresupuesto.eliminarGasto(elemento.dataset.id);
    actualizarDatos(miPresupuesto);
});

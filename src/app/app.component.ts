import { Component, OnInit } from '@angular/core';
import { Diccionario } from './diccionario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  acumuladorALU: string = "00000000";
  contadorPrograma: number = 0;
  decodificador: string = "...";
  explication: string = "";
  instruccionesDecodificador: Diccionario = {
    '0000': '+',
    '0001': '-',
    '0010': '*',
    '0011': '^',
    '0100': '&',
    '0101': '|',
    '0110': 'M',
    '0111': '...',
  };
  sigueRealizaOperacion: boolean = false;
  memoria: Diccionario = {
    '0000': '00000101',
    '0001': '00010110',
    '0010': '00110110',
    '0011': '01100111',
    '0100': '01110000',
    '0101': '00001000',
    '0110': '00000011',
    '0111': '00000000',
  };
  registroDatoMemoria: string = "00000000";
  registroDireccionMemoria: string = "0000";
  registroInstruccion: string = "00000000";
  registroEntradaALU: string = "00000000";
  siguienteBloqueado: boolean = false;
  siguienteInstruccion: string = "usarContador";
  title = 'VonNeumann';

  constructor() {

  }

  ngOnInit(): void {

  }

  //Método que pone el contador en el registro de direcciones y lo aumenta
  buscarEnMemoria() {
    this.registroDatoMemoria = this.memoria[this.registroDireccionMemoria];
    this.explication = "Se buscó en la memoria con el registro de direcciones y se guardo el valor encontrado en el registro de datos.";
    if (this.sigueRealizaOperacion) {
      this.siguienteInstruccion = "realizaOperacion";
    } else {
      this.siguienteInstruccion = "leerInstruccion";
    }
  }

  leerInstruccion() {
    this.explication = "La unidad de control obtuvó el registro de instrucciones del registro de datos y lo interpretó obteniendo el decodificador y el registro de direcciones.";
    this.registroInstruccion = this.registroDatoMemoria;
    this.decodificador = this.instruccionesDecodificador[this.registroInstruccion.substring(0, 4)];
    this.registroDireccionMemoria = this.registroInstruccion.substring(4);
    //busca en memoria
    this.siguienteInstruccion = "buscarEnMemoria";
    this.sigueRealizaOperacion = true;
    if (this.decodificador == "...") {
      this.explication += " Se finalizó el programa."
      this.siguienteBloqueado = true;
    }
  }

  potenciaBinaria(baseBinaria: string, exponente: string): string {
    // Convertir la base binaria a decimal
    let baseDecimal = parseInt(baseBinaria, 2);
    let exponenteDecimal = parseInt(exponente, 2);
    // Calcular la potencia en decimal
    let resultadoDecimal = Math.pow(baseDecimal, exponenteDecimal);
    // Convertir el resultado de vuelta a binario
    let respuesta = resultadoDecimal.toString(2);
    return respuesta.padStart(8, '0');
  }

  realizaOperacion() {
    this.explication = "La ALU obtuvó el registro de entrada del registro de datos, realizó la operación que está en el decodificador entre el acumulador y el registro de entrada y se guardó el resultado en el acumulador.";
    this.registroEntradaALU = this.registroDatoMemoria;
    if (this.decodificador === "+") {
      this.acumuladorALU = this.registroEntradaALU; //En este caso lo dejó solo poniendo en registro de entrada en el de acumulado por que solo se hará en la primera operación pero lo ideal sería que aquí estuviera la lógica de sumar.
    } else if (this.decodificador == "-") {
      this.acumuladorALU = this.restarBinarios(this.acumuladorALU, this.registroEntradaALU);
    } else if (this.decodificador == "^") {
      this.acumuladorALU = this.potenciaBinaria(this.acumuladorALU, this.registroEntradaALU);
    } else if (this.decodificador == "M") {
      this.memoria[this.registroDireccionMemoria] = this.acumuladorALU;
      this.explication += " Se guardó el valor del acumulador en la memoria en la dirección del registro de direcciones.";
    } else if (this.decodificador == "...") {
      this.siguienteBloqueado = true;
    }
    this.siguienteInstruccion = "usarContador";
    this.sigueRealizaOperacion = false;
  }

  reiniciar() {
    this.acumuladorALU = "00000000";
    this.contadorPrograma = 0;
    this.decodificador = "...";
    this.explication = "";
    this.instruccionesDecodificador = {
      '0000': '+',
      '0001': '-',
      '0010': '*',
      '0011': '^',
      '0100': '&',
      '0101': '|',
      '0110': 'M',
      '0111': '...',
    };
    this.sigueRealizaOperacion = false;
    this.memoria = {
      '0000': '00000101',
      '0001': '00010110',
      '0010': '00110110',
      '0011': '01100111',
      '0100': '01110000',
      '0101': '00001000',
      '0110': '00000011',
      '0111': '00000000',
    };
    this.registroDatoMemoria = "00000000";
    this.registroDireccionMemoria = "0000";
    this.registroInstruccion = "00000000";
    this.registroEntradaALU = "00000000";
    this.siguienteBloqueado = false;
    this.siguienteInstruccion = "usarContador";
  }

  restarBinarios(binario1: string, binario2: string): string {
    // Convertir binarios a números decimales
    let numero1 = parseInt(binario1, 2);
    let numero2 = parseInt(binario2, 2);
    // Realizar la resta
    let resultado = numero1 - numero2;
    // Manejar el caso de resultado negativo
    if (resultado < 0) {
      throw new Error("El resultado de la resta es negativo, no se puede representar como binario sin signo.");
    }
    // Convertir el resultado de vuelta a binario
    let respuesta = resultado.toString(2);
    return respuesta.padStart(8, '0');
  }

  siguiente() {
    switch (this.siguienteInstruccion) {
      case "buscarEnMemoria":
        this.buscarEnMemoria();
        break;
      case "leerInstruccion":
        this.leerInstruccion();
        break;
      case "realizaOperacion":
        this.realizaOperacion();
        break;
      case "usarContador":
        this.usarContador();
        break;
      default:
        break;
    }
  }

  //Método que pone el contador en el registro de direcciones y lo aumenta
  usarContador() {
    this.registroDireccionMemoria = this.contadorPrograma.toString(2).padStart(4, '0');
    this.contadorPrograma++;
    //Sigue buscar en memoria.
    this.siguienteInstruccion = "buscarEnMemoria";
    this.explication = "La unidad de control emitió el contador de programa al registro de direcciones de memoría y aumentó el contador.";
  }

  //Poner el contador en registro de direcciones
  //Aumentar el contador en 1
  //Con el registro de direcciones se busca en la memoria
  //Ese dato se pone en registro de datos
  //registroInstrucciones = registroDatosMemoria;
  //Se busca el decodificador en las instrucciones con los 4 primeros bits de registroInstrucciones
  //Pongo en el registro de direcciones los 4 ultimos bits del registroInstrucciones
  //Voy a buscar en memoria con el regsitro de direcciones
  //Pone el valor encontrado en registroDatos
  //Pone registro datos en registro entrada ALU
  //Se realiza la operación que haya en el decodificador y se guarda el resultado en el acumulador ALU-
  //Se pone el contador nuevamente en el regsitro de direcciones
  //Aumenta el contador
  //Se busca en memoria con el registro de direcciones
  //El valor encontrado se pone en registroDatos
  //registroInstrucciones = registroDatosMemoria;
  //Se busca el decodificador en las instrucciones con los 4 primeros bits de registroInstrucciones
  //Pongo en el registro de direcciones los 4 ultimos bits del registroInstrucciones
  //Se busca en memoria con el registro de direcciones
  //El valor encontrado se pone en registroDatos
  //Pone registro datos en registro entrada ALU
  //Se realiza la operación que haya en el decodificador y se guarda el resultado en el acumulador ALU
  //Se pone el contador nuevamente en el regsitro de direcciones
  //Aumenta el contador
  //Se busca en memoria con el registro de direcciones
  //El valor encontrado se pone en registroDatos
  //registroInstrucciones = registroDatosMemoria;
  //Se busca el decodificador en las instrucciones con los 4 primeros bits de registroInstrucciones
  //Pongo en el registro de direcciones los 4 ultimos bits del registroInstrucciones
  //Se busca en memoria con el registro de direcciones
  //El valor encontrado se pone en registroDatos
  //Pone registro datos en registro entrada ALU
  //Se realiza la operación que haya en el decodificador y se guarda el resultado en el acumulador ALU
  //Se pone el contador nuevamente en el regsitro de direcciones
  //Aumenta el contador
  //Se busca en memoria con el registro de direcciones
  //El valor encontrado se pone en registroDatos
  //registroInstrucciones = registroDatosMemoria;
  //Se busca el decodificador en las instrucciones con los 4 primeros bits de registroInstrucciones
  //Pongo en el registro de direcciones los 4 ultimos bits del registroInstrucciones
  //Se busca en memoria con el registro de direcciones
  //Como la operación es mover a memoria lo que hace es que pone el acumulador en regitroDatos
  //Y pone registro de datos en la dirección de memoria que esta en registroDireccion
  //Se pone el contador nuevamente en el regsitro de direcciones
  //Aumenta el contador
  //Se busca en memoria con el registro de direcciones
  //El valor encontrado se pone en registroDatos
  //registroInstrucciones = registroDatosMemoria;
  //Detecta finalizar el programa.
}

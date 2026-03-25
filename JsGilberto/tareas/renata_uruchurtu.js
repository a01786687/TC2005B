/*
 * Example functions to practice JavaScript
 *
 * Renata Uruchurtu Ransom
 * 2026-02-24
 */

"use strict";

// firstNonReapiting: función que encuentra el primer carácter de una cadena de texto que no se repite.
function firstNonRepeating(str) {
    // quiero recorrer todo el string, es necesario un ciclo y una lista
    const candidates = []; // lista vacia
    // recorrer cada caracter en mi string
    for (let i = 0; i < str.length; i++) {
        // revisar que el caracter no este en mi lista con otro ciclo, se compara con cada uno de los candidatos

        // este for devolvera un elemento {char: 'a', count: '1'} lee cada elemento de la lista

        let found = false; // por default todos van a estar sin encontrarse
        for (let cand of candidates) { // of: regresa cada elemento del arreglo, in: da el indice del elemento
            if (cand.char == str[i]) { // si el candidato si esta en la lista, lo eliminamos
                cand.count += 1; // lo incrementa en cada encuentro
                found = true;
            }
        }
        if (!found) {
            candidates.push({ char: str[i], count: 1 }); // push inserta en una lista al final
        }
    } // ya tenemos el conteo listo para cada letra

    // for para encontrar que letra tiene el conteo = 1
    for (let index in candidates) { // ahora usamos in: da el indice de la letra que tiene el valor de 1 en el count
        if (candidates[index].count == 1) { //
            return candidates[index].char;

        }

    }
    return undefined;
}

// bubbleSort: función que implementa el algoritmo 'bubble-sort' para ordenar una lista de números.
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) { // for que recorre todo el arreglo

        // for para el elemento a lado del indice i que va a ser con el que se compara (j)
        for (let j = 0; j < (arr.length - i); j++) {

            // comparación: si el indice j del arreglo es mayor a j+1 guardamos j en una variable temporal e intercambiamos posiciones
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }

        }
    }

    return arr;
}


// invertArray: función que invierte un arreglo de números y regresa un nuevo arreglo con el resultado.
function invertArray(arr) {

    // creamos un arreglo nuevo en donde se van a almacenar los elementos en orden inverso
    let resultado = [];
    // ciclo for que recorre todo el arreglo desde el último indice hasta el primero
    // en cada iteracion se agrega el elemento actual al arreglo "resultado"
    for (let i = arr.length - 1; i >= 0; i--) {
        resultado.push(arr[i])
    }

    return resultado;
}

// invertArrayInplace: función que modifica el mismo arreglo que se pasa como argumento, se modifica el arreglo original .
function invertArrayInplace(arr) {
    let izq = 0;
    let der = arr.length - 1;
    while (izq < der) {
        [arr[izq], arr[der]] = [arr[der], arr[izq]];
        izq++;
        der--;
    }
}

// capitalize: función que recibe una cadena de texto y regrese una nueva con la primer letra de cada palabra en mayúscula.
function capitalize(str) {
    const palabras = str.split(/\s+/); // utilizamos el metodo .split("") que divide la cadena en un areglo de subcadenas, con /\s+/ es para manejar espacios y que no separe letra por letra sino palabra por palabra
    // creamos un arreglo vacío para guardar las palabras ya capitalizadas
    let resultado = [];
    // for que recorre el arreglo
    for (let i = 0; i < palabras.length; i++) { // iniciamos en 0, mientras i sea menor al tamaño de palabras, va a ir recorriendo
        // tomamos la palabra actual
        let palabra = palabras[i];

        // saltamos palabras vacias
        if (palabra.length == 0) continue;

        // tomamos la primera letra de la palabra para hacerla mayuscula con el metodo .toUpperCase();
        let primeraLetra = palabra[0].toUpperCase();

        // tomamos el resto de la palabra con el metodo .slice, omitimos el fin ya que queremos que tome desde el indice 1 hasta el final, es decir queremos todo menos la primera letra
        let resto = palabra.slice(1);

        // juntamos la primera letra ya mayuscula con el resto
        let palabraCapitalizada = primeraLetra + resto;

        // guardamos la palabra en el arreglo vacio de resultados con el metodo .push
        resultado.push(palabraCapitalizada);
    }

    // Unimos el arreglo en una frase para devolverla con el metodo .join ponemos comillas dobles en el parentesis por que si no agrega comas entre cada palabra, 
    return resultado.join(" ");

}

// mcd: función que calcula el máximo común divisor de dos números.
function mcd(a, b) {

    // checamos para caso especial de 0
    if (a == 0) return b;
    if (b == 0) return a;

    // primero debemos encontrar el menor de los 2 numeros
    let menor;
    if (a < b) {
        menor = a;
    } else {
        menor = b;
    }
    for (let i = menor; i > 0; i--) { // recorremos desde el menor y vamos disminuyendo hasta 1
        // checamos si i divide a a y b
        if (a % i == 0 && b % i == 0) { // si a dividido entre i es igual a 0 = true Y b % i es igual a 0 = true
            return i;
        }
    }
}

// hackerSpeak: función que cambia una cadena de texto a 'Hacker Speak'. Por ejemplo, para la cadena 'Javascript es divertido', su hacker speak es: 'J4v45c1pt 35 d1v3rt1d0'.
function hackerSpeak(str) {
    // creamos una variable donde se va a ir guardando el nuevo texto convertido con la función
    let resultado = "";
    // for que recorre el texto letra por letra con el ciclo for, donde i = 0, mientras i sea menor a la longitud del string
    for (let i = 0; i < str.length; i++) {

        // guardamos la letra actual del texto
        let letra = str[i];

        // comencamos if else.. caso por caso
        // si la letra es a agregamos 4 al resultado con el += es decir sumamos y 
        // guardamos en la misma variable, toma lo que ya tiene resultado, le agrega 
        // 4 y lo guarda nuevamente en resultado
        if (letra == "a") {
            resultado += "4";
        }
        else if (letra == "e") {
            resultado += "3";
        }
        else if (letra == "i") {
            resultado += "1";
        }
        else if (letra == "o") {
            resultado += "0";
        }
        else if (letra == "s") {
            resultado += "5";
        }
        else {
            resultado += letra;
        }

    }
    return resultado;
}

// factorize: función que recibe un número, y regresa una lista con todos sus factores
function factorize(int) {
    // creamos una lista vacía para guardar los factores es decir los numeros que dividen exactamente al numero pasado como parametro
    let factores = [];

    // ciclo for que prueba numeros, empieza con 1, sigue mientras 1 sea menor o igual que el int pasado como parámetro, cada iteracion aumenta en 1
    for (let i = 1; i <= int; i++) {
        if (int % i == 0) { // si i es factor, es decir al dividirlo da 0, se agrega a la lista de los factores
            factores.push(i);
        }
    }
    return factores;
}

// deduplicate: función que quita los elementos duplicados de un arreglo y regresa una lista con los elementos que quedan
function deduplicate(arr) {

    // creamos arreglo vacio para guardar los elementos no repetidos
    let resultado = [];
    // ciclo for que recorre todo el arreglo iniciando en 0, sigue mientras i sea menor a la longitud del arreglo, i cada iteracion aumenta en 1
    for (let i = 0; i < arr.length; i++) {
        if (!resultado.includes(arr[i])) { // si el valor NO esta dentro del arreglo resultado, lo agrega, si no lo ignora
            resultado.push(arr[i]);
        }
    }
    return resultado;
}

function findShortestString(arr) {
    // condicion para arreglo vacio
    if (arr.length == 0) {
        return 0;
    }

    // arreglo para guarar la longitud de la primera palabra
    let shortest = arr[0].length;

    // recorremos el arreglo con un ciclo for
    for (let i = 0; i < arr.length; i++) {

        // guardamos la longitud de la palabra actual del ciclo
        let longitudActual = arr[i].length;

        // if por si encontramos una mas corta para actualizar
        if (longitudActual < shortest) {
            shortest = longitudActual;
        }
    }

    return shortest;

}

// isPalindrome: función que revisa si una cadena de texto es un palíndromo o no.
function isPalindrome(str) {
    // creamos una variable nueva para guardar la palabra invertida
    let palabraInvertida = "";

    // ciclo for que recorre la longitud del string comenzando desde la ultima letra
    for (let i = str.length - 1; i >= 0; i--) {
        palabraInvertida += str[i]; // unimos las letras en i a palabraInvertida
    }

    // comparamos
    return str == palabraInvertida;

}

// sortStrings: función que toma una lista de cadena de textos y devuelve una nueva lista con todas las cadenas en orden alfabético.
function sortStrings(arr) {
    let sortedStrings = arr.sort();
    return sortedStrings;
}

// stats: función que toma una lista de números y devuelve una lista con dos elementos: el promedio y la moda.
function stats(arr) {
    let suma = 0; // iniciamos la variable de suma en 0

    // para caso de arreglo vacio no existe moda ni promedio por lo tanto devolvemos 0
    if (arr.length == 0) {
        return [0, 0];
    }

    // for que recorre el arreglo
    for (let i = 0; i < arr.length; i++) {
        suma += arr[i]; // sumamos cada elemento del arreglo a suma
    } // para este punto suma ya tiene la suma total de los numeros

    let promedio = suma / arr.length; // definimos nueva variable de promedio donde calculamos el promedio dividiendo la suma entre el numero de elementos del arreglo

    let cont = {}; // objeto vacio cont -> contador para contar cuantas veces aparece cada numero
    for (let i = 0; i < arr.length; i++) {
        let num = arr[i]; // nueva variable num = indice del arreglo
        if (cont[num]) { // si el numero ya existe en el arreglo, sumamos 1
            cont[num] += 1;
        } else { // si no existe lo inicializamos en 1 y es la primera vez que aparece
            cont[num] = 1;
        } // cont tiene cada numero y cuantas veces aparece
    }

    let moda = 0; // inicializamos variable moda
    let maxReps = 0; // inicializamos variable que guarda la cantidad max de repeticiones
    for (let flag in cont) { // recorremos cada bandera del objeto cont
        if (cont[flag] > maxReps) { // si la cantidad de veces que aparecio la bandera en el contador es mayor que maxReps
            maxReps = cont[flag]; // actualizamos maxReps con el valor
            moda = Number(flag) //guardamos la bandera en moda, esta siendo la nueva moda osea el numero que mas aparecio, usamos Number(flag)
        } // Number() es para convertir cualquier valor a un número, ya que la bandera queremos que sea un numero, ya que esta predeterminadamente como un string por que las claves de objetos siempre son strings
    }
    return [promedio, moda];

}

// popularString: función que toma una lista de cadenas de texto y devuelve la cadena más frecuente.
function popularString(arr) {
    // verificamos si el arreglo esta vacio, si no hay elementos devolvemos un string vacio
    if (arr.length == 0) {
        return "";
    }

    // contador para ver cuantas veces aparece cada cadena
    let cont = {}; // creamos un objeto vacio llamado cont, es para contar cuantas veces aparece cada palabra
    // ciclo for para recorrer cada elemento del arreglo,
    for (let i = 0; i < arr.length; i++) {
        let palabra = arr[i]; // palabra es el elemento que se revisa en la vuelta del ciclo for
        if (cont[palabra]) { // revisamos si la palabra ya existe en el contador,
            cont[palabra] += 1; // si existe sumamos 1 al contador
        } else {
            cont[palabra] = 1; // si no existe se inicializa con 1
        }
    } // aca ya esta cont con todas las palabras con su numero de reps
    // buscamos la cadena mas popular
    let masPopular = ""; // variable que guarda la palabra mas repetida
    let maxReps = 0; // variable que guarda cuantas veces se repite la palabra
    for (let palabra in cont) { // recorremos con un ciclo for todas las cuentas del objeto cont
        if (cont[palabra] > maxReps) { // palabra es la cuenta actual en cada vuelta, si la cantidad de reps es mayor a la palabra actual
            maxReps = cont[palabra]; // se actualiza max reps con la cantidad
            masPopular = palabra; // se guarda la palabra actual 
        } // al finalizar el loop masPopular es la de mas reps
    }
    return masPopular;

}

// isPowerOf2: función que toma un número y devuelve verdadero si es una potencia de dos, falso de lo contrario.
function isPowerOf2(n) {
    // condicion para numeros menores o igual a 0, no pueden ser potencia de 2
    if (n <= 0) {
        return false;
    }

    // definimos que x=1, que es 2^0
    let x = 1;
    // while x sea menor a n, es decir 1 menor a n
    while (x < n) {
        x = x * 2; // x * 2 en cada vuelta para generar todas las potencias de 2, osea 1, 2, 4, 16 etc
    }
    // loop termina cuando x es igual o mayor que n
    return x == n;


}

// sortDescending: función que toma una lista de números y devuelve una nueva lista con todos los números en orden descendente.
function sortDescending(arr) {

    // creamos una copia del arreglo original para no modificarlo con el metodo .slice();
    let copia = arr.slice();

    // usamos metodo sort con una funcion de comparacion (a,b) => b - a, donde a y b representan dos elementos del arreglo que sort compara, 
    // si b es > que a, b - a > 0 entonces b va primero y va de orden descendiente
    // si a es > que b, b - a < 0, a va primero y va descendiente
    copia.sort((a, b) => b - a);
    return copia;
}




export {
    firstNonRepeating,
    bubbleSort,
    invertArray,
    invertArrayInplace,
    capitalize,
    mcd,
    hackerSpeak,
    factorize,
    deduplicate,
    findShortestString,
    isPalindrome,
    sortStrings,
    stats,
    popularString,
    isPowerOf2,
    sortDescending,
};


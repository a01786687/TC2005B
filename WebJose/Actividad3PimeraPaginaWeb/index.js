function traducir() { // funcion 
    document.getElementById("par1").innerHTML = // buscamos el elemento que tenga el ID "par1", .innerHTML permite cambiar el contenido dentro de ese elemento, es decir se esta diciento que se va a cambiar el texto del elemento con id "par1"
        "Frida's House is a cozy place where the smell of fresh coffee mixes with soft purring and curious looks. Here you don't only come for coffee, you come to relax and spend time with our favorite feline owner.";
} // al ejecutarse la funcion, el párrafo cambia al texto de arriba

function filtrarMenu(tipo) { // funcion que recibe parametro llamado tipo, tipo puede valer todas, calientes, o frias

    // declaramos nueva variable "bebidas" que busca todos los elementos que tengan <li> de la pagina
    let bebidas = document.querySelectorAll("li"); // busca todos los elementos <li> y los guarda en variable bebidas

    // bebidas es una lista de elementos (NodeList)

    // Los objetos NodeList son colecciones de nodos como los devueltos por propiedades como Node.childNodes y el método document.querySelectorAll ()..

    // ciclo for que empieza desde el primer elemento, se repite mientras no termina la lista, avanza uno por uno, este for revisa cada <li>
    for (let i = 0; i < bebidas.length; i++) {

        // Caso 1: mostrar todas
        if (tipo == "todas") { // si el parámetro tipo es "todas"
            bebidas[i].style.display = "list-item"; // cambia el estilo de cada <li>, style.display = "list-item"; hace que el elemento se muestre como elemento de losta
        }

        // Caso 2: solo mostrar bebidas calientes
        else if (tipo == "calientes") { // si el parametro tipo es "calientes"

            if (bebidas[i].className == "calientes") { // revisa si el <li> tiene la clase "calientes"
                bebidas[i].style.display = "list-item"; // si es caliente lo muestra
            } else {
                bebidas[i].style.display = "none"; // si no es caliente no lo muestra
            }

        } // lo mismo para las frías

        else if (tipo == "frias") {

            if (bebidas[i].className == "frias") {
                bebidas[i].style.display = "list-item";
            } else {
                bebidas[i].style.display = "none";
            }

        }

    }
}
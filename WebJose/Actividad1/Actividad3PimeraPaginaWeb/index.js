function traducir() {
    document.getElementById("par1").innerHTML =
        "Frida's House is a cozy place where the smell of fresh coffee mixes with soft purring and curious looks. Here you don't only come for coffee, you come to relax and spend time with our favorite feline owner.";
}

function filtrarMenu(tipo) {

    let bebidas = document.querySelectorAll("li"); // busca todos los elementos <li> y los guarda en variable bebidas

    for (let i = 0; i < bebidas.length; i++) {

        if (tipo == "todas") {
            bebidas[i].style.display = "list-item";
        }

        else if (tipo == "calientes") {

            if (bebidas[i].className == "calientes") {
                bebidas[i].style.display = "list-item";
            } else {
                bebidas[i].style.display = "none";
            }

        }

        else if (tipo == "frias") {

            if (bebidas[i].className == "frias") {
                bebidas[i].style.display = "list-item";
            } else {
                bebidas[i].style.display = "none";
            }

        }

    }
}
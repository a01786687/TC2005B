$(document).ready(function () {

    // funcion para que el video haga slide down
    $(".row").hide();
    $(".row").slideDown("slow");

    let control = 0; // variable para contar cuantos clicks le di al boton
    $("#opcion1").click(function () {
        $("#tamaid").fadeOut();
        if (control == 0) { // secuencia de control
            $("#tamaid").fadeOut();
            control++;

        }
        else if (control == 1) {
            $("#tamaid").fadeIn();
            control++;
        }

        else if (control == 2) {
            $("#tamaid").hide();
            control++;
        }

        else {
            $("#tamaid").show();
            control = 0; // control 0 para que comienze el contador de nuevo
        }

    });

});

// # -> id
// . -> clases
// nada -> etiquetas
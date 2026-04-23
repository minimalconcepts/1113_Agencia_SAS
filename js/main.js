function mostrarInicio() {
    document.getElementById("contenido").innerHTML = "<h2>Bienvenido</h2>";
}

function mostrarCatalogo() {
    document.getElementById("contenido").innerHTML = "<h2>Catálogo</h2>";
}

function mostrarContacto() {
    document.getElementById("contenido").innerHTML = "<h2>Contacto</h2>";
}

function applyFilters() {
    alert("Filtros aplicados (lógica vendrá después)");
}

function reset() {
    document.getElementById("brandFilter").value = "";
    document.getElementById("typeFilter").value = "";
}

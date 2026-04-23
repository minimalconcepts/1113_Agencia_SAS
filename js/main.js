let autos = []; // Aquí tus compañeros cargarán datos

function renderAutos(lista) {
    const contenedor = document.getElementById("vehicle-list");
    contenedor.innerHTML = "";

    lista.forEach(auto => {
        contenedor.innerHTML += `
            <div>
                <h3>${auto.marca}</h3>
                <p>${auto.tipo}</p>
                <p>$${auto.precio}</p>
            </div>
        `;
    });
}

function applyFilters() {
    let marca = document.getElementById("brandFilter").value;
    let tipo = document.getElementById("typeFilter").value;

    let filtrados = autos.filter(auto => {
        return (!marca || auto.marca === marca) &&
               (!tipo || auto.tipo === tipo);
    });

    renderAutos(filtrados);
}

function reset() {
    document.getElementById("brandFilter").value = "";
    document.getElementById("typeFilter").value = "";
    renderAutos(autos);
}

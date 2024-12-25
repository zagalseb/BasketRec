// Variables globales
let jugadores = [];

// Cargar archivo TSV al iniciar
async function cargarJugadores() {
    try {
        const response = await fetch("jugadores.tsv");
        if (!response.ok) throw new Error("Error al cargar el archivo TSV");

        const data = await response.text();
        jugadores = procesarTSV(data);
        mostrarResultados(jugadores);
    } catch (error) {
        console.error("Error al cargar jugadores:", error);
    }
}

// Procesar contenido TSV
function procesarTSV(data) {
    const rows = data.split("\n");
    const headers = rows[0].split("\t");

    return rows.slice(1).map(row => {
        const values = row.split("\t");
        const jugador = {};
        headers.forEach((header, index) => {
            jugador[header.trim()] = values[index]?.trim() || "";
        });
        return jugador;
    }).filter(jugador => jugador.Nombre); // Filtrar filas vacías
}

// Filtrar y mostrar resultados
function filtrarJugadores() {
    const posicionPrincipal = document.getElementById("posicionPrincipalFiltro").value;
    const clase = document.getElementById("claseFiltro").value;
    const estado = document.getElementById("estadoFiltro").value;
    const alturaMin = parseFloat(document.getElementById("alturaMinFiltro").value) || 0;
    const alturaMax = parseFloat(document.getElementById("alturaMaxFiltro").value) || Infinity;
    const ppjMin = parseFloat(document.getElementById("ppjFiltro").value) || 0;

    const jugadoresFiltrados = jugadores.filter(jugador => {
        const cumplePosicion = !posicionPrincipal || jugador["Posición principal"] === posicionPrincipal;
        const cumpleClase = !clase || jugador["Clase (Año de graduación)"] === clase;
        const cumpleEstado = !estado || jugador["Estado"] === estado;
        const cumpleAltura = parseFloat(jugador["Altura"] || 0) >= alturaMin && parseFloat(jugador["Altura"] || 0) <= alturaMax;
        const cumplePPJ = parseFloat(jugador["PPJ"] || 0) >= ppjMin;

        return cumplePosicion && cumpleClase && cumpleEstado && cumpleAltura && cumplePPJ;
    });

    mostrarResultados(jugadoresFiltrados);
}

// Mostrar resultados
function mostrarResultados(lista) {
    const resultados = document.getElementById("resultados");
    resultados.innerHTML = "";

    if (lista.length === 0) {
        resultados.innerHTML = "<li>No se encontraron jugadores.</li>";
        return;
    }

    lista.forEach(jugador => {
        const li = document.createElement("li");

        li.innerHTML = `
            <img src="${jugador["Foto"] || "imagenes/default.jpg"}" alt="Foto de ${jugador.Nombre}">
            <div>
                <h3>${jugador.Nombre} ${jugador["Apellido Paterno"]}</h3>
                <p>Posición: ${jugador["Posición principal"] || "N/A"}</p>
                <p>Altura: ${jugador["Altura"] || "N/A"} m | Peso: ${jugador["Peso"] || "N/A"} kg</p>
                <p>Estado: ${jugador["Estado"] || "N/A"}</p>
                <p>Fecha de Nacimiento: ${jugador["Fecha de Nacimiento"] || "N/A"}</p>
                <p>PPJ: ${jugador["PPJ"] || "N/A"}</p>
            </div>
        `;

        resultados.appendChild(li);
    });
}

// Eventos de filtros
function filtrarPorPosicionPrincipal() { filtrarJugadores(); }
function filtrarPorClase() { filtrarJugadores(); }
function filtrarPorEstado() { filtrarJugadores(); }
function filtrarPorAltura() { filtrarJugadores(); }
function filtrarPorPPJ() { filtrarJugadores(); }

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    cargarJugadores();

    const filtrosContainer = document.getElementById("filtros-container");
    const filtros = document.getElementById("filtros");

    // Crear botón para mostrar/ocultar filtros
    const toggleFiltrosBtn = document.createElement("button");
    toggleFiltrosBtn.id = "toggle-filtros";
    toggleFiltrosBtn.textContent = "▲ Ocultar Filtros";
    filtrosContainer.prepend(toggleFiltrosBtn);

    toggleFiltrosBtn.addEventListener("click", () => {
        if (filtros.style.display === "none") {
            filtros.style.display = "grid";
            toggleFiltrosBtn.textContent = "▲ Ocultar Filtros";
        } else {
            filtros.style.display = "none";
            toggleFiltrosBtn.textContent = "▼ Mostrar Filtros";
        }
    });
});

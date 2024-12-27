document.addEventListener("DOMContentLoaded", () => {
    const formFiltros = document.getElementById("formFiltros");
    const ctx = document.getElementById("grafica").getContext("2d");
  
    let grafica;
    let jugadores = []; // Almacenará los datos del TSV
  
    // Leer el archivo TSV y procesarlo
    fetch("jugadores.tsv")
      .then(response => response.text())
      .then(data => {
        jugadores = procesarTSV(data);
        console.log("Datos cargados:", jugadores); // Verificar datos cargados
      })
      .catch(error => console.error("Error al cargar el TSV:", error));
  
    // Procesar el contenido del TSV a un objeto JSON
    function procesarTSV(data) {
      const rows = data.trim().split("\n");
      const headers = rows[0].split("\t").map(header => header.trim());
  
      return rows.slice(1).map(row => {
        const values = row.split("\t").map(value => value.trim());
        const jugador = {};
        headers.forEach((header, index) => {
          jugador[header] = values[index];
        });
        return jugador;
      });
    }
  
    // Generar gráfica al enviar el formulario
    formFiltros.addEventListener("submit", (event) => {
      event.preventDefault();
  
      // Obtener filtros seleccionados
      const ejeX = document.getElementById("ejeX").value;
      const ejeY = document.getElementById("ejeY").value;
      const estado = document.getElementById("estado").value;
      const posicion = document.getElementById("posicion").value;
  
      // Filtrar datos
      const datos = obtenerDatosFiltrados(estado, posicion);
  
      // Configurar rango de altura en los ejes
      const alturaMin = 1.50;
      const alturaMax = 2.20;
  
      const xScale = ejeX === "Altura" ? { min: alturaMin, max: alturaMax } : {};
      const yScale = ejeY === "Altura" ? { min: alturaMin, max: alturaMax } : {};
  
      // Configurar datos para la gráfica
      const data = {
        datasets: [{
          label: `${ejeY} vs ${ejeX}`,
          data: datos.map(d => ({
            x: parseFloat(d[ejeX]) || 0,
            y: parseFloat(d[ejeY]) || 0,
            name: `${d["Nombre"]} ${d["Apellido Paterno"]}`, // Guardar nombre completo
          })),
          backgroundColor: "rgba(0, 123, 255, 0.7)",
          borderColor: "rgba(0, 73, 146, 1)",
          borderWidth: 1,
        }],
      };
  
      // Crear o actualizar gráfica
      if (grafica) grafica.destroy();
      grafica = new Chart(ctx, {
        type: "scatter",
        data,
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const { name } = context.raw;
                  const xValue = context.raw.x;
                  const yValue = context.raw.y;
  
                  return [
                    `Nombre: ${name}`,
                    `${ejeX}: ${xValue}`,
                    `${ejeY}: ${yValue}`,
                  ].join("\n");
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: false,
              ...xScale, // Aplica el rango dinámico para el eje X
              title: {
                display: true,
                text: ejeX,
              },
            },
            y: {
              beginAtZero: false,
              ...yScale, // Aplica el rango dinámico para el eje Y
              title: {
                display: true,
                text: ejeY,
              },
            },
          },
        },
      });
    });
  
    // Filtrar datos con base en estado y posición
    function obtenerDatosFiltrados(estado, posicion) {
      return jugadores.filter(jugador => {
        // Normalizar valores (eliminar espacios y convertir a minúsculas)
        const estadoJugador = jugador["Estado"]?.trim().toLowerCase() || "";
        const posicionJugador = jugador["Posición principal"]?.trim().toLowerCase() || "";
        const estadoFiltro = estado.trim().toLowerCase();
        const posicionFiltro = posicion.trim().toLowerCase();
  
        // Filtros
        const estadoCoincide = (estadoFiltro === "todos" || estadoJugador === estadoFiltro);
        const posicionCoincide = (posicionFiltro === "todas" || posicionJugador === posicionFiltro);
  
        return estadoCoincide && posicionCoincide;
      });
    }
  });
  
  
  
  
  

  
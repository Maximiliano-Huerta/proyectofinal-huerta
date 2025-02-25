document.addEventListener("DOMContentLoaded", () => {
    cargarEPP(); // Cargar la lista de EPP cuando la página cargue
    document.getElementById("verificar").addEventListener("click", verificarEPP);
});

// Función para cargar la lista de EPP usando fetch
function cargarEPP() {
    fetch("./data/epp.json")
        .then(response => response.json()) // Convertir a JSON
        .then(data => {
            mostrarEPP(data); // Llamar a la función para mostrar los datos
        })
        .catch(error => console.error("Error al cargar el EPP:", error));
}

// Función para mostrar la lista de EPP en la interfaz
function mostrarEPP(equipos) {
    const equipoList = document.getElementById("equipo-list");
    equipoList.innerHTML = ""; // Limpiar lista antes de agregar elementos

    equipos.forEach((epp, index) => {
        let item = document.createElement("div");
        item.classList.add("equipo-item");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `epp-${index}`;
        checkbox.dataset.nombre = epp.nombre;
        checkbox.addEventListener("change", () => {
            item.classList.toggle("selected", checkbox.checked);
        });

        let label = document.createElement("label");
        label.htmlFor = `epp-${index}`;
        label.innerHTML = `<img src="${epp.imagen}" alt="${epp.nombre}" class="epp-icon"> ${epp.nombre}`;

        item.appendChild(checkbox);
        item.appendChild(label);
        equipoList.appendChild(item);
    });
}

// Función para verificar el EPP
function verificarEPP() {
    const nombre = document.getElementById("nombre").value.trim();
    const edad = document.getElementById("edad").value.trim();
    const puesto = document.getElementById("puesto").value.trim();
    const resultadoDiv = document.getElementById("resultado");

    if (!nombre || !edad || !puesto) {
        Swal.fire("⚠️ Error", "Por favor, completa todos los datos del trabajador.", "warning");
        return;
    }

    let cumpleTodo = true;
    let mensaje = `<strong>Resultados para ${nombre}:</strong><ul>`;
    let equipoUsado = [];

    document.querySelectorAll("#equipo-list input[type='checkbox']").forEach(checkbox => {
        if (checkbox.checked) {
            mensaje += `<li>✅ ${checkbox.dataset.nombre}: En buen estado.</li>`;
            equipoUsado.push(checkbox.dataset.nombre);
        } else {
            mensaje += `<li>❌ ${checkbox.dataset.nombre}: FALTA o en mal estado.</li>`;
            cumpleTodo = false;
        }
    });

    mensaje += "</ul>";
    mensaje += cumpleTodo
        ? "<p style='color: green;'>✔ Cumple con todos los EPP requeridos. Listo para trabajar.</p>"
        : "<p style='color: red;'>❌ No cumple con todos los EPP. Debe completar su equipo.</p>";

    resultadoDiv.innerHTML = mensaje;

    guardarEnHistorial(nombre, edad, puesto, equipoUsado, cumpleTodo);
}

// Función para guardar los resultados en el historial (localStorage)
function guardarEnHistorial(nombre, edad, puesto, equipo, cumpleTodo) {
    let historial = JSON.parse(localStorage.getItem("historialEPP")) || [];
    const nuevoRegistro = {
        nombre,
        edad,
        puesto,
        equipo,
        fecha: new Date().toLocaleString(),
        estado: cumpleTodo ? "Cumple" : "No Cumple"
    };
    historial.push(nuevoRegistro);
    localStorage.setItem("historialEPP", JSON.stringify(historial));

    Swal.fire({
        title: "✅ Registro Guardado",
        text: "El resultado del chequeo ha sido almacenado en el historial.",
        icon: "success"
    });
}

// Función para generar el PDF con los datos del trabajador y EPP
function generarPDF() {
    console.log("Generando PDF..."); // 👈 Verificar en consola si la función se ejecuta

    if (window.jspdf) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // 📌 Encabezado
        doc.setFont("times", "normal");
        doc.setFontSize(18);
        doc.text("Reporte de Verificación de EPP", 105, 15, null, null, "center");

        // 📌 Información del Trabajador
        const nombre = document.getElementById("nombre").value || "No especificado";
        const edad = document.getElementById("edad").value || "No especificado";
        const puesto = document.getElementById("puesto").value || "No especificado";

        doc.setFontSize(12);
        doc.text(`👷 Nombre: ${nombre}`, 20, 50);
        doc.text(`🎂 Edad: ${edad}`, 20, 60);
        doc.text(`💼 Puesto: ${puesto}`, 20, 70);

        // 📌 EPP Seleccionado
        let y = 90;
        doc.setFont("times", "normal");

        doc.text("✅ Elementos de Protección Personal:", 20, y);
        doc.setFont("times", "normal");

        y += 10;

        let elementosSeleccionados = document.querySelectorAll("#equipo-list input:checked");

        if (elementosSeleccionados.length === 0) {
            doc.text("⚠ No se seleccionó ningún EPP", 25, y);
        } else {
            elementosSeleccionados.forEach((checkbox) => {
                doc.text(`✔ ${checkbox.dataset.nombre}`, 25, y);
                y += 10;
            });
        }

        // 📌 Guardar el PDF
        doc.save(`reporte_EPP_${nombre}.pdf`);
        console.log("PDF Generado correctamente."); // 👈 Confirmar en consola
    } else {
        console.error("jsPDF no está cargado correctamente.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const botonPDF = document.getElementById("descargar-pdf");
    if (botonPDF) {
        botonPDF.addEventListener("click", generarPDF);
    }
});




document.addEventListener("DOMContentLoaded", () => {
    generarFormulario();
    document.getElementById("verificar").addEventListener("click", verificarEPP);
});

// Lista de elementos de protección personal requeridos
const equipoRequerido = [
    { nombre: "Casco", obligatorio: true },
    { nombre: "Botines", obligatorio: true },
    { nombre: "Lentes", obligatorio: true },
    { nombre: "Chaleco Reflectivo", obligatorio: true },
    { nombre: "Arnés de Seguridad", obligatorio: true }
];

// Función para generar los checkboxes en la interfaz
function generarFormulario() {
    const equipoList = document.getElementById("equipo-list");
    equipoRequerido.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "equipo-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `equipo-${index}`;
        checkbox.dataset.nombre = item.nombre;
        checkbox.title = `Selecciona si llevas ${item.nombre}`; // Agregar title para accesibilidad

        const label = document.createElement("label");
        label.htmlFor = `equipo-${index}`; // Asociar el label con el checkbox
        label.textContent = item.nombre;

        div.appendChild(checkbox);
        div.appendChild(label);
        equipoList.appendChild(div);
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

    resultadoDiv.innerHTML = ""; // Limpia el contenido previo

    let cumpleTodo = true;
    let mensaje = `<strong>Resultados para ${nombre}:</strong><ul>`;
    let equipoUsado = [];

    equipoRequerido.forEach((item, index) => {
        const checkbox = document.getElementById(`equipo-${index}`);
        if (checkbox.checked) {
            mensaje += `<li>✅ ${item.nombre}: En buen estado.</li>`;
            equipoUsado.push(item.nombre);
        } else {
            mensaje += `<li>❌ ${item.nombre}: FALTA o en mal estado.</li>`;
            cumpleTodo = false;
        }
    });

    mensaje += "</ul>";
    mensaje += cumpleTodo
        ? "<p style='color: green;'>✔ Cumple con todos los EPP requeridos. Listo para trabajar.</p>"
        : "<p style='color: red;'>❌ No cumple con todos los EPP. Debe completar su equipo.</p>";

    resultadoDiv.innerHTML = mensaje;

    // Guardar resultados en el historial
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

document.addEventListener("DOMContentLoaded", function () {
    const equipoItems = document.querySelectorAll(".equipo-item");

    equipoItems.forEach(item => {
        item.addEventListener("click", function () {
            const checkbox = item.querySelector("input");

            checkbox.checked = !checkbox.checked;

            // ✅ Agrega o quita la clase "selected" para que el color cambie
            if (checkbox.checked) {
                item.classList.add("selected");
            } else {
                item.classList.remove("selected");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Verifica que el botón existe antes de agregar el evento
    const botonPDF = document.getElementById("descargar-pdf");
    if (botonPDF) {
        botonPDF.addEventListener("click", generarPDF);
    }
});

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

        let elementosSeleccionados = document.querySelectorAll(".equipo-item input:checked");

        if (elementosSeleccionados.length === 0) {
            doc.text("⚠ No se seleccionó ningún EPP", 25, y);
        } else {
            elementosSeleccionados.forEach((checkbox) => {
                doc.text(`✔ ${checkbox.getAttribute("data-nombre")}`, 25, y);
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

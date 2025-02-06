document.addEventListener("DOMContentLoaded", () => {
    mostrarHistorialPersonal();
});

function mostrarHistorialPersonal() {
    const historialDiv = document.getElementById("historial");
    historialDiv.innerHTML = ""; // Limpiar contenido previo
    const historial = JSON.parse(localStorage.getItem("historialEPP")) || [];

    if (historial.length === 0) {
        historialDiv.innerHTML = "<p class='text-center text-muted'>No hay registros de personal.</p>";
        return;
    }

    historial.forEach((registro) => {
        const registroDiv = document.createElement("div");
        registroDiv.className = `history-card ${registro.estado === "Cumple" ? "cumple" : "no-cumple"}`;
        registroDiv.innerHTML = `
            <div class="history-header">
                <h3>👷 ${registro.nombre}</h3>
                <span class="status ${registro.estado === "Cumple" ? "status-green" : "status-red"}">
                    ${registro.estado === "Cumple" ? "✔ Cumple" : "❌ No Cumple"}
                </span>
            </div>
            <div class="history-info">
                <p><strong>🎂 Edad:</strong> ${registro.edad} años</p>
                <p><strong>💼 Puesto:</strong> ${registro.puesto}</p>
                <p><strong>📅 Fecha de Revisión:</strong> ${registro.fecha}</p>
            </div>
            <div class="history-results">
                <h4>🦺 EPP Utilizado:</h4>
                <ul>
                    ${registro.equipo.length > 0 ? registro.equipo.map(item => `<li>✅ ${item}</li>`).join("") : "<li>❌ No lleva EPP suficiente</li>"}
                </ul>
            </div>
        `;
        historialDiv.appendChild(registroDiv);
    });
}

function limpiarHistorial() {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará todo el historial de chequeos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, borrar historial"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("historialEPP");
            mostrarHistorialPersonal(); // Asegurar que se actualiza la vista
            Swal.fire("¡Eliminado!", "El historial ha sido borrado.", "success");
        }
    });
}

let teethState = {};
let historyEntries = [];

function initOdontograma() {
    const upperTeeth = document.getElementById('upperTeeth');
    const lowerTeeth = document.getElementById('lowerTeeth');

    const upperNumbers = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
    upperNumbers.forEach(num => {
        const tooth = createTooth(num);
        upperTeeth.appendChild(tooth);
    });

    const lowerNumbers = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
    lowerNumbers.forEach(num => {
        const tooth = createTooth(num);
        lowerTeeth.appendChild(tooth);
    });

    loadSavedState();
}

function createTooth(number) {
    const tooth = document.createElement('div');
    tooth.className = 'tooth sano';
    tooth.textContent = number;
    tooth.dataset.number = number;
    tooth.addEventListener('click', () => changeToothState(tooth, number));
    return tooth;
}

function changeToothState(toothElement, number) {
    const oldState = teethState[number] || 'sano';
    teethState[number] = currentTool;

    toothElement.className = `tooth ${currentTool}`;
    
    if (oldState !== currentTool) {
        addToHistory(`Diente ${number}: ${oldState} → ${currentTool}`);
    }
    
    // Guardar automáticamente en localStorage cada cambio
    saveToLocalStorage();
}

function addToHistory(entry) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-ES');
    const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const fullEntry = `${dateStr} ${timeStr} - ${entry}`;
    
    historyEntries.unshift(fullEntry);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    const existingEntries = historyList.querySelectorAll('.history-item');
    const originalEntries = Array.from(existingEntries).slice(-3);
    historyList.innerHTML = '';

    historyEntries.slice(0, 5).forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = entry;
        item.style.borderLeftColor = '#27ae60';
        historyList.appendChild(item);
    });

    originalEntries.forEach(entry => {
        historyList.appendChild(entry);
    });
}

// NUEVA FUNCIÓN: Guardar en localStorage
function saveToLocalStorage() {
    const odontogramaData = {
        teethState: teethState,
        historyEntries: historyEntries,
        notes: document.getElementById('treatmentNotes').value,
        lastModified: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('info_odontograma', JSON.stringify(odontogramaData));
        console.log('Datos guardados en localStorage:', odontogramaData);
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
        alert('Error al guardar los datos. Verifique el espacio disponible.');
    }
}

// Cargar desde localStorage
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('info_odontograma');
        if (savedData) {
            const odontogramaData = JSON.parse(savedData);
            return odontogramaData;
        }
    } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
        alert('Error al cargar los datos guardados.');
    }
    return null;
}

function saveChanges() {
    const notes = document.getElementById('treatmentNotes').value.trim();
    
    // Guardar en localStorage
    saveToLocalStorage();
    
    alert('¡Cambios guardados correctamente en localStorage!');

    if (notes) {
        addToHistory(`Notas actualizadas: ${notes.substring(0, 30)}${notes.length > 30 ? '...' : ''}`);
        // Guardar nuevamente después de agregar al historial
        saveToLocalStorage();
    }
}

// FUNCIÓN MODIFICADA: Cargar estado guardado
function loadSavedState() {
    // Intentar cargar desde localStorage primero
    const savedData = loadFromLocalStorage();
    
    if (savedData) {
        // Cargar datos desde localStorage
        teethState = savedData.teethState || {};
        historyEntries = savedData.historyEntries || [];
        
        // Cargar notas si existen
        if (savedData.notes) {
            const notesTextarea = document.getElementById('treatmentNotes');
            if (notesTextarea) {
                notesTextarea.value = savedData.notes;
            }
        }
        
        console.log('Datos cargados desde localStorage:', savedData);
    } else {
        // Datos por defecto solo si no hay nada guardado
        teethState = {
            16: 'caries',
            21: 'arreglado',
            32: 'faltante',
            47: 'caries'
        };
        console.log('Usando datos por defecto');
    }

    // Aplicar estados a los dientes
    Object.keys(teethState).forEach(toothNumber => {
        const toothElement = document.querySelector(`[data-number="${toothNumber}"]`);
        if (toothElement) {
            toothElement.className = `tooth ${teethState[toothNumber]}`;
        }
    });
    
    // Actualizar historial
    updateHistoryDisplay();
}

//Limpiar localStorage (opcional)
function clearLocalStorage() {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos guardados?')) {
        localStorage.removeItem('info_odontograma');
        location.reload(); // Recargar la página
    }
}

// Exportar datos
function exportData() {
    const savedData = loadFromLocalStorage();
    if (savedData) {
        const dataStr = JSON.stringify(savedData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'odontograma_backup.json';
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Event listeners o "escuchador de eventos"
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTool = this.dataset.state;

        const feedback = document.querySelector('.tooth-info');
        feedback.innerHTML = `<strong>Estado seleccionado: ${this.textContent}</strong><br>Ahora haz clic en cualquier diente para aplicar este estado`;
        feedback.style.color = '#e74c3c';

        setTimeout(() => {
            feedback.style.color = '#666';
        }, 2000);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    initOdontograma();

    // Obtener nombre del paciente desde localStorage
    const nombrePaciente = localStorage.getItem('pacienteActual');
    if (nombrePaciente) {
        const infoPaciente = document.querySelector('.patient-info');
        infoPaciente.textContent = nombrePaciente;
    }
});


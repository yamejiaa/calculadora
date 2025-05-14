document.addEventListener('DOMContentLoaded', function() {
  const inputsContainer = document.getElementById('inputs-container');
  const totalPercentageElement = document.getElementById('total-percentage');
  const weightedAverageElement = document.getElementById('weighted-average');
  
  // Porcentajes predefinidos
  const predefinedPercentages = [
    { value: 0.2, label: '20% (1.00)' },
    { value: 0.15, label: '15% (0.75)' },
    { value: 0.1, label: '10% (0.10)' },
    { value: 0.05, label: '5% (0.05)' }
  ];
  
  // Agregar primer input
  addInputRow();
  
  function addInputRow() {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group new-input';
    
    inputGroup.innerHTML = `
      <div class="input-row">
        <div class="input-container">
          <label class="input-label">Nota</label>
          <input type="number" min="0" max="10" step="0.01" 
                 class="note-input" placeholder="0.00 - 10.00">
        </div>
        
        <div class="input-container">
          <label class="input-label">Porcentaje</label>
          <select class="percentage-input">
            ${predefinedPercentages.map(p => 
              `<option value="${p.value}">${p.label}</option>`
            ).join('')}
          </select>
        </div>
        
        <div class="button-group">
          <button class="action-btn add-btn" title="Agregar fila">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    `;
    
    inputsContainer.appendChild(inputGroup);
    
    // Configurar eventos
    const addBtn = inputGroup.querySelector('.add-btn');
    addBtn.addEventListener('click', addInputRow);
    
    inputGroup.querySelector('.note-input').addEventListener('input', function() {
      calculateResults();
      updateButtons();
    });
    
    inputGroup.querySelector('.percentage-input').addEventListener('change', function() {
      calculateResults();
      updateButtons();
    });
    
    // Actualizar botones y cálculos
    updateButtons();
    calculateResults();
  }
  
  function updateButtons() {
    const allGroups = document.querySelectorAll('.input-group');
    
    allGroups.forEach((group, index) => {
      const isLast = index === allGroups.length - 1;
      const buttonGroup = group.querySelector('.button-group');
      
      // Limpiar botones existentes
      buttonGroup.innerHTML = '';
      
      // Solo agregar botón de eliminar si no es el último y hay más de 1
      if (!isLast && allGroups.length > 1) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'action-btn remove-btn';
        removeBtn.title = 'Eliminar fila';
        removeBtn.innerHTML = '<i class="fas fa-minus"></i>';
        removeBtn.addEventListener('click', function() {
          group.remove();
          updateButtons();
          calculateResults();
        });
        buttonGroup.appendChild(removeBtn);
      }
      
      // Agregar botón de agregar solo al último
      if (isLast) {
        const addBtn = document.createElement('button');
        addBtn.className = 'action-btn add-btn';
        addBtn.title = 'Agregar fila';
        addBtn.innerHTML = '<i class="fas fa-plus"></i>';
        addBtn.addEventListener('click', addInputRow);
        buttonGroup.appendChild(addBtn);
      }
    });
  }
  
  function calculateResults() {
    const noteInputs = document.querySelectorAll('.note-input');
    const percentageInputs = document.querySelectorAll('.percentage-input');
    
    let totalPercentage = 0;
    let weightedSum = 0;
    let hasErrors = false;
    
    // Resetear errores
    document.querySelectorAll('.note-input, .percentage-input').forEach(input => {
      input.classList.remove('input-error');
    });
    
    // Calcular
    noteInputs.forEach((input, index) => {
      const note = parseFloat(input.value) || 0;
      const percentage = parseFloat(percentageInputs[index].value) || 0;
      
      if (input.value && (note < 0 || note > 10)) {
        input.classList.add('input-error');
        hasErrors = true;
      }
      
      totalPercentage += percentage;
      weightedSum += note * percentage;
    });
    
    // Validar
    if (totalPercentage > 1) {
      percentageInputs.forEach(input => input.classList.add('input-error'));
      hasErrors = true;
    }
    
    // Actualizar UI
    updateTotalPercentage(totalPercentage);
    updateWeightedAverage(weightedSum, totalPercentage, hasErrors);
  }
  
  function updateTotalPercentage(total) {
    const percentage = Math.round(total * 100);
    totalPercentageElement.textContent = `${percentage}%`;
    
    // Resetear clases
    totalPercentageElement.className = 'total-percentage';
    
    // Añadir clase según porcentaje
    if (percentage === 100) {
      totalPercentageElement.classList.add('percentage-complete');
    } else if (percentage > 100) {
      totalPercentageElement.classList.add('percentage-danger');
    } else if (percentage >= 80) {
      totalPercentageElement.classList.add('percentage-warning');
    }
  }
  
  function updateWeightedAverage(sum, total, hasErrors) {
    if (hasErrors) {
      weightedAverageElement.textContent = 'Error';
      weightedAverageElement.className = 'weighted-average text-red-500';
      return;
    }
    
    const average = total ? (sum / total) : 0;
    weightedAverageElement.textContent = average.toFixed(2);
    
    // Resetear clases
    weightedAverageElement.className = 'weighted-average';
    
    // Añadir clase según nota
    if (average >= 7) {
      weightedAverageElement.classList.add('text-green-600');
    } else if (average >= 5) {
      weightedAverageElement.classList.add('text-yellow-500');
    } else {
      weightedAverageElement.classList.add('text-red-500');
    }
  }
});
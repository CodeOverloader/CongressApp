document.addEventListener('DOMContentLoaded', function() {
    var currentCycle = 1;
    var totalCycles = 6; // Change this value if you want more or fewer cycles
    var speakerOrder = {}; // Object to store randomized speaker order
  
    // Function to show/hide cycle containers based on current cycle
    function updateCycleVisibility() {
     for (var i = 1; i <= totalCycles; i++) {
      var cycleContainer = document.getElementById('cycle' + i);
      if (i === currentCycle) {
       cycleContainer.classList.add('active');
      } else {
       cycleContainer.classList.remove('active');
      }
     }
    }
  
    // Function to create a new cycle container with a table
    function createCycleContainer(cycleNumber) {
     var cycleContainer = document.createElement('div');
     cycleContainer.classList.add('cycle-container');
     cycleContainer.setAttribute('id', 'cycle' + cycleNumber);
  
     var cycleHeader = document.createElement('h2');
     cycleHeader.innerText = 'Cycle ' + cycleNumber;
  
     cycleContainer.appendChild(cycleHeader);
  
     // Create table
     var table = document.createElement('table');
     var tableRow = table.insertRow();
     var headers = ['Speaker (Affirmation)', 'Questioners (Affirmation)', 'Speaker (Negation)', 'Questioners (Negation)'];
     headers.forEach(function(headerText) {
      var headerCell = document.createElement('th');
      headerCell.innerText = headerText;
      tableRow.appendChild(headerCell);
     });
  
     // Add a row with empty cells to the table
     var tableRow = table.insertRow();
     for (var i = 0; i < headers.length; i++) {
      var cell = tableRow.insertCell();
      cell.innerText = '';
     }
  
     cycleContainer.appendChild(table);
     document.getElementById('cycles-container').appendChild(cycleContainer);
    }
  
    // Create cycle containers for all cycles
    for (var i = 1; i <= totalCycles; i++) {
     createCycleContainer(i);
    }
  
    // Initialize by showing the first cycle
    updateCycleVisibility();
  
    // Create speakers list divs
    var speakersListContainer = document.getElementById('speakers-list-container');
    for (var i = 1; i <= totalCycles; i++) {
     var speakersListDiv = document.createElement('div');
     speakersListDiv.classList.add('speakers-list');
     speakersListDiv.setAttribute('id', 'speakers-list' + i);
     speakersListContainer.appendChild(speakersListDiv);
    }
   // Function to update the list of speakers in the correct order
  function updateSpeakerOrder(codesArray) { // Add codesArray as a parameter 
    const codes = speakerOrder[currentCycle].codes;
    const speechCount = speakerOrder[currentCycle].speechCount;
  
    // Sort based on speechCount, then by original position
    codesArray.sort((a, b) => { // Use the passed codesArray
      if (speechCount[a] !== speechCount[b]) {
        return speechCount[a] - speechCount[b]; 
      } else {
        return codesArray.indexOf(a) - codesArray.indexOf(b); // Use codesArray here too!
      }
    });
  
      // Update the speaker list display
      const speakersList = document.getElementById('speakers-list' + currentCycle); 
      speakersList.innerHTML = '<h2>Order of Speakers</h2><ul>';
  
      codes.forEach(function(code, index) {
      speakersList.innerHTML += '<li>' + code + ' (Speeches: ' + speechCount[code] + ') ' + 
        '<button type="button" class="btn-affirmation" data-code="' + code + '">Affirmation Speaker</button>' +
        '<button type="button" class="btn-negation" data-code="' + code + '">Negation Speaker</button>' +
        '<button type="button" class="btn-affirmation-q" data-code="' + code + '">Affirmation Questioner</button>' +
        '<button type="button" class="btn-negation-q" data-code="' + code + '">Negation Questioner</button>' +
        '</li>';
      }); 
      speakersList.innerHTML += '</ul>';
    }
  
    // Function to update the table with speakers and questioners
    function updateCycle(cycleNumber, speakerAffirmation, questionersAffirmation, speakerNegation, questionersNegation) {
     var cycleContainer = document.getElementById('cycle' + cycleNumber);
     var table = cycleContainer.querySelector('table');
     var lastRow = table.rows[table.rows.length - 1];
     lastRow.cells[0].innerText = speakerAffirmation;
     lastRow.cells[1].innerText = questionersAffirmation.join(', ');
     lastRow.cells[2].innerText = speakerNegation;
     lastRow.cells[3].innerText = questionersNegation.join(', ');
    }
  
    // Function to add a new row to the table
    document.getElementById('add-row').addEventListener('click', function() {
     var table = document.getElementById('cycle' + currentCycle).querySelector('table');
     var newRow = table.insertRow(-1); 
     newRow.innerHTML = '<td></td><td></td><td></td><td></td>'; 
    });
  
    // Function to handle switching to the next cycle
    document.getElementById('next-cycle').addEventListener('click', function() {
     if (currentCycle < totalCycles) {
      currentCycle++;
      updateCycleVisibility();
     }
    });
  
    // Function to handle switching to the previous cycle
    document.getElementById('prev-cycle').addEventListener('click', function() {
     if (currentCycle > 1) {
      currentCycle--;
      updateCycleVisibility();
     }
    });
  
    // Function to randomize codes
  document.getElementById('randomize-codes').addEventListener('click', function() {
     var codesInput = document.getElementById('code-input').value;
     var codesArray = codesInput.split(',').map(function(code) {
        return code.trim();
     });
  
     // Randomize the codes
     for (var i = codesArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [codesArray[i], codesArray[j]] = [codesArray[j], codesArray[i]];
     }
  
     // Store randomized order
     speakerOrder[currentCycle] = {
        codes: codesArray,
        speechCount: {} 
     };
  
     // Initialize speech count
     codesArray.forEach(code => {
        speakerOrder[currentCycle].speechCount[code] = 0;
     }); 
  
     // Call the function to update the display initially 
     updateSpeakerOrder(codesArray); // Pass codesArray as an argument
  
  });
  // Event listener for preserve input order button
  document.getElementById('preserve-order').addEventListener('click', function(event) {
    event.preventDefault();
    var codesInput = document.getElementById('code-input').value;
    var codesArray = codesInput.split(',').map(function(code) {
      return code.trim();
    });
  
    // Store the order
    speakerOrder[currentCycle] = {
      codes: codesArray,
      speechCount: {} 
    };
  
    // Initialize speech count
    codesArray.forEach(code => {
      speakerOrder[currentCycle].speechCount[code] = 0;
    });
  
    // Call the function to update the display initially
    updateSpeakerOrder(codesArray);
  });
  
  // Event listener for the buttons next to each code
  document.getElementById('speakers-list-container').addEventListener('click', function(event) {
    var code = event.target.getAttribute('data-code');
    var table = document.getElementById('cycle' + currentCycle).querySelector('table');
    var lastRow = table.rows[table.rows.length - 1]; 
  
    if (event.target.classList.contains('btn-affirmation')) {
      lastRow.cells[0].innerText += (lastRow.cells[0].innerText === '') ? code : ', ' + code;
    } else if (event.target.classList.contains('btn-negation')) {
      lastRow.cells[2].innerText += (lastRow.cells[2].innerText === '') ? code : ', ' + code;
    } else if (event.target.classList.contains('btn-affirmation-q')) {
      lastRow.cells[1].innerText += (lastRow.cells[1].innerText === '') ? code : ', ' + code;
    } else if (event.target.classList.contains('btn-negation-q')) {
      lastRow.cells[3].innerText += (lastRow.cells[3].innerText === '') ? code : ', ' + code;
    }
  
    // Increment speech count
    speakerOrder[currentCycle].speechCount[code]++;
  
    // Re-calculate the order
    updateSpeakerOrder(); 
  });
   });
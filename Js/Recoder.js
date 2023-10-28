let mediaRecorder;
        let audioChunks = [];
        const audioPlayer = document.getElementById('audioPlayer');
        const startRecordingButton = document.getElementById('startRecordingButton');
        const stopRecordingButton = document.getElementById('stopRecordingButton');
        const playRecordingButton = document.getElementById('playRecordingButton');

        // Add event listeners
        startRecordingButton.addEventListener('click', startRecording);
        stopRecordingButton.addEventListener('click', stopRecording);
        playRecordingButton.addEventListener('click', playRecording);

        // Function to start recording
        async function startRecording() {
            try {
                // Request access to the user's microphone
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // Create a MediaRecorder instance to capture audio
                mediaRecorder = new MediaRecorder(stream);

                // Event handler for when data is available
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                // Event handler for when recording is stopped
                mediaRecorder.onstop = () => {
                    // Create a Blob from the recorded audio chunks
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

                    // Set the audio player source and enable controls
                    audioPlayer.src = URL.createObjectURL(audioBlob);
                    audioPlayer.controls = true;

                    // Enable the "Play Recording" button
                    playRecordingButton.disabled = false;
                };

                // Start recording
                mediaRecorder.start();

                // Disable the "Start Recording" button and enable the "Stop Recording" button
                startRecordingButton.disabled = true;
                stopRecordingButton.disabled = false;
            } catch (error) {
                console.error('Error starting recording:', error);
            }
        }

        // Function to stop recording
        function stopRecording() {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                // Stop recording
                mediaRecorder.stop();

                // Enable the "Start Recording" button and disable the "Stop Recording" button
                startRecordingButton.disabled = false;
                stopRecordingButton.disabled = true;
            }
        }

        // Function to play the recorded audio
        function playRecording() {
            if (audioPlayer.src) {
                // Play the recorded audio using the audio player
                audioPlayer.play();
            }
        }
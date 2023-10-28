// Import necessary modules
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { AnimationMixer, AnimationClip } from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

// Define an array to store instrument data
const instruments = [
  {
    name: "Daula",
    modelUrl: "Models/Animated_beats/Dawla_beats.gltf",
    position: new THREE.Vector3(0, -0.3, 0),
    rotation: new THREE.Euler(Math.PI / 1, 1.6, Math.PI),
    animations: [
      { name: "beat1", sound: "../Dawula/Dawla_beats/Dawla_beat_01.mp3" },
      { name: "beat2", sound: "../Dawula/Dawla_beats/Dawla_beat_02.mp3" },
      { name: "beat3", sound: "../Dawula/Dawla_beats/Dawla_beat_03.mp3" },
      { name: "beat4", sound: "../Dawula/Dawla_beats/Dawla_beat_04.mp3" },
      { name: "beat5", sound: "../Dawula/Dawla_beats/Dawla_beat_05.mp3" },
    ],
  },
  {
    name: "Geta-Beraya",
    modelUrl: "Models/Animated_beats/Geta bera_beats.gltf",
    position: new THREE.Vector3(0, -0.3, 0),
    rotation: new THREE.Euler(Math.PI / 1, 1.6, Math.PI),
    animations: [
      { name: "beat1", sound: "../Geta_beraya/Getabera_beats/Gata_Bera_beat_01.wav" },
      { name: "beat2", sound: "../Geta_beraya/Getabera_beats/Gata_Bera_beat_02.wav" },
      { name: "beat3", sound: "../Geta_beraya/Getabera_beats/Gata_Bera_beat_03.wav" },
      { name: "beat4", sound: "../Geta_beraya/Getabera_beats/Gata_Bera_beat_04.wav" },
      { name: "beat5", sound: "../Geta_beraya/Getabera_beats/Gata_Bera_beat_05.wav" },
    ], 
  },
  {
    name: "Udekkiya",
    modelUrl: "Models/Animated_beats/udakkiya _beats.gltf",
    position: new THREE.Vector3(0, -0.3, 0),
    rotation: new THREE.Euler(Math.PI / 1, 1.6, Math.PI),
    animations: [
      { name: "beat1", sound: "../Uddakkiya/Beats/Udakki_beat_01.wav" },
      { name: "beat2", sound: "../Uddakkiya/Beats/Udakki_beat_02.mp3" },
      { name: "beat3", sound: "../Uddakkiya/Beats/Udakki_beat_03.mp3" },
      { name: "beat4", sound: "../Uddakkiya/Beats/Udakki_beat_04.mp3" },
      { name: "beat5", sound: "../Uddakkiya/Beats/Udakki_beat_05.mp3" },
    ], 
  },
  { name: "thammattama",
  modelUrl: "Models/Animated_beats/Thammattama_beats.gltf",
  position: new THREE.Vector3(0, -0.3, 0),
  rotation: new THREE.Euler(Math.PI / 1, 1.6, Math.PI),
  animations: [
    { name: "beat1", sound: "../Thammattama/Beats/Thammatam_Beat_01.wav" },
    { name: "beat2", sound: "../Thammattama/Beats/Thammatam_Beat_02.wav"  },
    { name: "beat3", sound: "../Thammattama/Beats/Thammatam_Beat_03.wav"  },
    { name: "beat4", sound: "../Thammattama/Beats/Thammatam_Beat_04.wav"  },
    { name: "beat5", sound: "../Thammattama/Beats/Thammatam_Beat_05.mp3"  },
  ],
  },
  
  { name: "Rigs",
  modelUrl: "Models/Animated_beats/Rigs_beats.gltf",
  position: new THREE.Vector3(0, -0.3, 0),
  rotation: new THREE.Euler(Math.PI / 1, 1.6, Math.PI),
  animations: [
    { name: "beat1", sound: "../Rigs_beats/Rigs_beats_01.wav" },
    { name: "beat2", sound: "../Rigs_beats/Rigs_beats_02.wav"  },
    { name: "beat3", sound: "../Rigs_beats/Rigs_beats_03.wav"  },
    { name: "beat4", sound: "../Rigs_beats/Rigs_beats_04.wav"  },
    { name: "beat5", sound: "../Rigs_beats/Rigs_beats_05.wav"  },
  ],
  },

// Add other instruments and their data here
];

const currentSounds = {};
// Declare selectedInstrument in a higher scope
let selectedInstrument = null;

// Function to play the sound for the selected instrument and beat
function playSound(instrument, beat) {
  if (!instrument) {
    console.error('Instrument is undefined.');
    return;
  }

  if (!instrument.animations) {
    console.error('Instrument animations are undefined.');
    return;
  }

  if (!instrument.animations[beat - 1]) {
    console.error('Invalid beat selection.');
    return;
  }

  const soundFilename = instrument.animations[beat - 1].sound;

  if (!soundFilename) {
    console.error('Sound filename not found for the selected beat.');
    return;
  }

  // Check if a sound is currently playing for this instrument
  if (currentSounds[instrument.name]) {
    currentSounds[instrument.name].pause();
    currentSounds[instrument.name].currentTime = 0; // Rewind the sound
  }

  console.log(`Loading audio from: ./Instrument_Sound/${instrument.name}/${soundFilename}`);
  const audio = new Audio(`./Instrument_Sound/${instrument.name}/${soundFilename}`);
  
  audio.play();

  // Store the currently playing sound for this instrument
  currentSounds[instrument.name] = audio;
}


function stopSound(instrumentName) {
  if (currentSounds[instrumentName]) {
    currentSounds[instrumentName].pause();
    currentSounds[instrumentName].currentTime = 0; // Rewind the sound
    delete currentSounds[instrumentName]; // Remove the reference
  }
}

// Event listener to ensure the DOM is loaded before running the code
document.addEventListener('DOMContentLoaded', function () {
  // Get the canvas element
  const canvas = document.getElementById('myCanvas');
  if (!canvas) {
    console.error('Canvas element not found.');
    return;
  }

  // Create a WebGL renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, pixelRatio: window.devicePixelRatio });
  if (!renderer) {
    console.error('WebGLRenderer not created.');
    return;
  }
  renderer.setSize(800, 600);

  // Create a 3D scene
  const scene = new THREE.Scene();

  // Create a camera
  const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
  camera.position.z = 1;

  // Create a dat.GUI instance
  const gui = new dat.GUI({ autoPlace: false });
  if (!gui) {
    console.error('dat.GUI not created.');
    return;
  }

  // Get the gui-container div by its id
  const guiContainer = document.getElementById('gui-container');
  if (!guiContainer) {
    console.error('GUI container element not found.');
    return;
  }

  // Append the GUI to the container
  guiContainer.appendChild(gui.domElement);

  // Define an object to hold GUI controls
  const guiControls = {
    selectedOption: 'Beat 1', // Default selected beat
    selectedInstrument: 'Daula', // Default selected instrument
  };

  const dropdownController = gui.add(guiControls, 'selectedOption', ['Beat 1', 'Beat 2', 'Beat 3', 'Beat 4', 'Beat 5'])
  .name('Select Beat'); // Set the controller label
dropdownController.setValue(guiControls.selectedOption); // Set the initial value

  // Add a dropdown controller for instrument selection
  const instrumentController = gui.add(guiControls, 'selectedInstrument', instruments.map((instrument) => instrument.name)).name('Select Instrument');

  // Define a variable to store the currently playing animation action
  let currentAnimationAction = null;

  // Event listener for beat dropdown change
  dropdownController.onChange(function (selectedOption) {
    // Handle the selected beat change here
    console.log('Selected Beat:', selectedOption);

    // Get the currently selected instrument from the existing instrument dropdown
    const selectedInstrument = instrumentController.getValue();

    // Map the selected beat to the corresponding beat number
    let selectedBeat = null;
    switch (selectedOption) {
      case 'Beat 1':
        selectedBeat = 1;
        break;
      case 'Beat 2':
        selectedBeat = 2;
        break;
      case 'Beat 3':
        selectedBeat = 3;
        break;
      case 'Beat 4':
        selectedBeat = 4;
        break;
      case 'Beat 5':
        selectedBeat = 5;
        break;
      default:
        console.error('Invalid option:', selectedOption);
        break;
    }

    // Check if there is a currently playing animation action and stop it
    if (currentAnimationAction) {
      currentAnimationAction.stop();
    }

    // Play the corresponding animation based on the selected option
    if (animationsInitialized) {
      const keyframeRange = keyframeRanges[selectedOption];
      if (keyframeRange) {
        currentAnimationAction = playAnimation(keyframeRange.animationName);
      }
    }

    // Play the sound for the selected instrument and beat
    if (selectedBeat !== null) {
      const selectedInstrumentData = instruments.find((instrument) => instrument.name === selectedInstrument);
      if (selectedInstrumentData) {
        playSound(selectedInstrumentData, selectedBeat);
      }
    }
  });

  instrumentController.onChange(function (selectedInstrument) {
    // Handle the selected instrument change here
    console.log('Selected Instrument:', selectedInstrument);
  
    // Get the currently selected beat from guiControls.selectedOption
    const selectedBeat = guiControls.selectedOption;
  
    // Play the sound for the selected instrument and beat
    if (selectedBeat !== null) {
      const selectedInstrumentData = instruments.find((instrument) => instrument.name === selectedInstrument);
      if (selectedInstrumentData) {
        playSound(selectedInstrumentData, selectedBeat);
      }
    }
  });
  
  

  // Add directional lights from different directions
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight1.position.set(1, 1, 1);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-1, -1, -1);
  scene.add(directionalLight2);

  // Create a GLTF loader
  const loader = new GLTFLoader();

  let mixer;
  let previousTime = 0; // Initialize the previous time
  let animationsInitialized = false; // Track animation initialization
  let gltf; // Declare it here to make it accessible globally

 // Get all buttons with the class 'button'
const buttons = document.querySelectorAll('.button');
if (!buttons) {
  console.error('Buttons not found.');
  return;
}

// Modify the event listener for instrument buttons
buttons.forEach(button => {
  button.addEventListener('click', function (event) {
    event.preventDefault();

    const instrumentName = this.getAttribute('data-instrument-name');
    const instrumentData = instruments.find((instrument) => instrument.name === instrumentName);

    if (!instrumentData) {
      console.error(`Instrument data not found for instrument: ${instrumentName}`);
      return;
    }

    // Check if a different instrument is currently selected
    if (selectedInstrument !== instrumentData) {
      // Stop the audio for the previously selected instrument
      if (selectedInstrument) {
        stopSound(selectedInstrument.name);
      }

      // Load the 3D model for the selected instrument
      loadInstrumentModel(instrumentData);
      // Update the selected instrument
      selectedInstrument = instrumentData;
    }

    // Scroll to the canvas element
    canvas.scrollIntoView({ behavior: 'smooth' });
  });
});

  // Add orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);

  let currentInstrument = null; // Track the current loaded instrument

  // Define keyframe ranges for each animation
  let keyframeRanges = {
    'Beat 1': { animationName: 'beat1' },
    'Beat 2': { animationName: 'beat2' },
    'Beat 3': { animationName: 'beat3' },
    'Beat 4': { animationName: 'beat4' },
    'Beat 5': { animationName: 'beat5' },
  };

  // Function to play an animation by name
  function playAnimation(animationName) {
    if (!mixer || !gltf.animations) {
      console.error('Mixer or animations not initialized.');
      return null;
    }

    // Find the animation clip by name
    const clip = THREE.AnimationClip.findByName(gltf.animations, animationName);

    if (!clip) {
      console.error('Animation clip not found for:', animationName);
      return null;
    }

    // Create a new animation action and play it
    const animationAction = mixer.clipAction(clip);
    animationAction.reset();
    animationAction.setLoop(THREE.LoopOnce, 1); // Play the animation once
    animationAction.clampWhenFinished = true; // Keep the animation within the specified frame range
    animationAction.play();
    console.log('Animation Duration:', clip.duration);

    return animationAction; // Return the animation action
  }

  // Function to load the 3D model
  function loadInstrumentModel(instrumentData) {
    loader.load(
      instrumentData.modelUrl,
      function (loadedGltf) {
        // Remove the existing instrument from the scene
        if (currentInstrument) {
          scene.remove(currentInstrument);
        }

        const model = loadedGltf.scene;
        model.position.copy(instrumentData.position);
        model.rotation.copy(instrumentData.rotation);
        scene.add(model);

        currentInstrument = model; // Update the current loaded instrument
        gltf = loadedGltf; // Update the global gltf object

        // Initialize animations if available
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).stop();
          });
          animationsInitialized = true;
        } else {
          console.warn('No animations found in the loaded model.');
          animationsInitialized = false;
        }
      },
      undefined,
      function (error) {
        console.error('Error loading the 3D model:', error);
      }
    );
  }

  // Add ambient light to improve shading
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light to cast shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Add top light
  const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
  topLight.position.set(10, 10, 10); // top-left-ish
  topLight.castShadow = true;
  scene.add(topLight);

  // Function to handle window resize
  function onWindowResize() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Add a listener for the 'resize' event
  window.addEventListener('resize', onWindowResize);

  function animate() {
    requestAnimationFrame(animate);

    const currentTime = performance.now(); // Get the current time in milliseconds
    const deltaTime = (currentTime - previousTime) * 0.001; // Convert milliseconds to seconds

    if (mixer) {
      mixer.update(deltaTime); // Update the animation mixer with the elapsed time
    }

    renderer.render(scene, camera);

    previousTime = currentTime; // Update the previous time for the next frame
  }

  // Start the animation loop
  animate();
});

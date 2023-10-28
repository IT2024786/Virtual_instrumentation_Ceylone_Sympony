import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { AnimationMixer } from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";


document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('myCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, pixelRatio: window.devicePixelRatio });
  renderer.setSize(800, 600);
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
  camera.position.z = 1;

  const audioContext = new AudioContext();

  const controls = new OrbitControls(camera, renderer.domElement);

  const loader = new GLTFLoader();

  let currentInstrument = null;
  let mixer;
  let mixerRight;
  let animationAction;
  let animationActionRight;
  let animationsInitialized = false; // Track animation initialization
  let activeInstrument = 'Geta-Beraya'; // Default active instrument
  let gltf; // Declare it here to make it accessible globally


  const buttons = document.querySelectorAll('.button');

  buttons.forEach(button => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
  
      const instrumentId = this.getAttribute('data-instrument-id');

      if (instrumentId === 'Daula') {
        loadSecondInstrumentModel('Models/Dawla.gltf', new THREE.Vector3(0, -0.3, 0), new THREE.Euler(Math.PI / 1, 1.6, Math.PI));
        (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
       canvas.scrollIntoView({ behavior: 'smooth' });

      } else if (instrumentId === 'Geta-Beraya') {
        loadInstrumentModel('Models/Geta_beraya.gltf', new THREE.Vector3(0, -0.3, 0), new THREE.Euler(Math.PI / 1, 1.6, Math.PI));
        (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
      canvas.scrollIntoView({ behavior: 'smooth' });

      } else if (instrumentId === 'thammattama') {
        loadThirdInstrumentModel('Models/Thammattama.gltf', new THREE.Vector3(0, -0.3, 0), new THREE.Euler(Math.PI / 1, 1.6, Math.PI));
        (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
        canvas.scrollIntoView({ behavior: 'smooth' });    
      }
      else if (instrumentId === 'Udekkiya') {
        loadFourthInstrumentModel('Models/Udakkiya.gltf', new THREE.Vector3(0, -0.3, 0), new THREE.Euler(Math.PI / 1, 1.6, Math.PI));
        (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
        canvas.scrollIntoView({ behavior: 'smooth' });    

      }
      else if (instrumentId === 'Rabana') {
        loadFifthInstrumentModel('Models/Rabana.gltf', new THREE.Vector3(0, -0.3, 0), new THREE.Euler(Math.PI / 1, 1.6, Math.PI));
        (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
        canvas.scrollIntoView({ behavior: 'smooth' });    

      }

      changeActiveInstrument(instrumentId); // Change the active instrument
    });
  });
  


  function changeActiveInstrument(instrumentId) {
    activeInstrument = instrumentId;
  }
  
  function playSoundAndChangeColor(objectName) {
    let soundUrl;
    let animationName;
    let drumMesh;
  
    switch (objectName) {
      case 'Left_drum_head':
        soundUrl = 'Instrument_Sound/Geta_beraya/gatabera sound 3.wav';
        animationName = 'Geta_Bera_Left_Main';
        break;
      case 'Right_drum_head':
        soundUrl = 'Instrument_Sound/Geta_beraya/gatabera sound 4.wav';
        animationName = 'Geta_Bera_Right_Main.001';
        break;
      case 'num1':
        soundUrl = Geta_bera_Variations[0].soundUrl;
        animationName = Geta_bera_Variations[0].animationName;
        break;
      case 'num2':
        soundUrl = Geta_bera_Variations[1].soundUrl;
        animationName = Geta_bera_Variations[1].animationName;
        break;
      case 'num3':
        soundUrl = Geta_bera_Variations[2].soundUrl;
        animationName = Geta_bera_Variations[2].animationName;
        break;
      case 'num4':
        soundUrl = Geta_bera_Variations[3].soundUrl;
        animationName = Geta_bera_Variations[3].animationName;
        break;
      case 'num5':
        soundUrl = Geta_bera_Variations[4].soundUrl;
        animationName = Geta_bera_Variations[4].animationName;
        break;
      case 'num6':
        soundUrl = Geta_bera_Variations[5].soundUrl;
        animationName = Geta_bera_Variations[5].animationName;
        break;
      default:
        break;
    }
  
    if (soundUrl && animationName) {
      fetch(soundUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          return audioContext.decodeAudioData(buffer);
        })
        .then(decodedData => {
          const source = audioContext.createBufferSource();
          source.buffer = decodedData;
          source.connect(audioContext.destination);
          source.start();
  
          if (drumMesh) {
            drumMesh.material.emissive.set(0x0000ff);
            drumMesh.material.emissiveIntensity = 1;
          }
  
          if (animationAction) {
            animationAction.stop();
            animationAction = mixer.clipAction(gltf.animations.find(clip => clip.name === animationName));
            animationAction.setLoop(THREE.LoopOnce);
            animationAction.clampWhenFinished = true;
            animationAction.play();
          }
  
          animationsInitialized = true;
        })
        .catch(error => {
          console.error('Error loading sound:', error);
        });
    }
  }

  function playSoundAndChangeColorSecond(objectName) {
    let soundUrl;
    let animationName;
    let drumMesh;
  
    switch (objectName) {
      case 'Dawla_Left_drum_head':
        soundUrl = 'Instrument_Sound/Dawula/Dawula_Left%20side.wav';
        animationName = 'Dawula_Left_Main';
        break;
      case 'Dawla_Right_drum_head':
        soundUrl = 'Instrument_Sound/Dawula/Dawula_Right%20side.wav';
        animationName = 'Dawula_Right_Main';
        break;
      case 'num1':
        soundUrl = dawlaVariations[0].soundUrl;
        animationName = dawlaVariations[0].animationName;
        break;
      case 'num2':
        soundUrl = dawlaVariations[1].soundUrl;
        animationName = dawlaVariations[1].animationName;
        break;
      case 'num3':
        soundUrl = dawlaVariations[2].soundUrl;
        animationName = dawlaVariations[2].animationName;
        break;
      case 'num4':
        soundUrl = dawlaVariations[3].soundUrl;
        animationName = dawlaVariations[3].animationName;
        break;
      case 'num5':
        soundUrl = dawlaVariations[4].soundUrl;
        animationName = dawlaVariations[4].animationName;
        break;
      case 'num6':
        soundUrl = dawlaVariations[5].soundUrl;
        animationName = dawlaVariations[5].animationName;
        break;
      default:
        break;
    }
  
    if (soundUrl && animationName) {
      fetch(soundUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          return audioContext.decodeAudioData(buffer);
        })
        .then(decodedData => {
          const source = audioContext.createBufferSource();
          source.buffer = decodedData;
          source.connect(audioContext.destination);
          source.start();
  
          if (drumMesh) {
            drumMesh.material.emissive.set(0x0000ff);
            drumMesh.material.emissiveIntensity = 1;
          }
  
          if (animationAction) {
            animationAction.stop();
            animationAction = mixer.clipAction(gltf.animations.find(clip => clip.name === animationName));
            animationAction.setLoop(THREE.LoopOnce);
            animationAction.clampWhenFinished = true;
            animationAction.play();
          }
  
          animationsInitialized = true;
        })
        .catch(error => {
          console.error('Error loading sound:', error);
        });
    }
  }
  
//////////////////////////////////////////////////////////////////////////////
  function playSoundAndChangeColorThird(objectName) {
    let soundUrl;
    let animationName;
    let drumMesh;
    
  
    switch (objectName) {
      case 'Thammattama_left_drum_head':
        soundUrl = 'Instrument_Sound/Thammattama/Thammattama_Left.wav';
        animationName = 'Thammattama_Left';
        break;
      case 'Thammattama_Right_drum_head':
        soundUrl = 'Instrument_Sound/Thammattama/Thammattama_Right.wav';
        animationName = 'Thammattama_Right';
        break;
      case 'num1':
        soundUrl = Thammattama_Variations[0].soundUrl;
        animationName = Thammattama_Variations[0].animationName;
        break;
      case 'num2':
        soundUrl = Thammattama_Variations[1].soundUrl;
        animationName = Thammattama_Variations[1].animationName;
        break;
      case 'num3':
        soundUrl = Thammattama_Variations[2].soundUrl;
        animationName = Thammattama_Variations[2].animationName;
        break;
      case 'num4':
        soundUrl = Thammattama_Variations[3].soundUrl;
        animationName = Thammattama_Variations[3].animationName;
        break;
      case 'num5':
        soundUrl = Thammattama_Variations[4].soundUrl;
        animationName = Thammattama_Variations[4].animationName;
        break;
      case 'num6':
        soundUrl = Thammattama_Variations[5].soundUrl;
        animationName = Thammattama_Variations[5].animationName;
        break;
      default:
        break;
    }
  
    if (soundUrl && animationName) {
      fetch(soundUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          return audioContext.decodeAudioData(buffer);
        })
        .then(decodedData => {
          const source = audioContext.createBufferSource();
          source.buffer = decodedData;
          source.connect(audioContext.destination);
          source.start();
  
          if (drumMesh) {
            drumMesh.material.emissive.set(0x0000ff);
            drumMesh.material.emissiveIntensity = 1;
          }
  
          if (animationAction) {
            animationAction.stop();
            animationAction = mixer.clipAction(gltf.animations.find(clip => clip.name === animationName));
            animationAction.setLoop(THREE.LoopOnce);
            animationAction.clampWhenFinished = true;
            animationAction.play();
          }
  
          animationsInitialized = true;
        })
        .catch(error => {
          console.error('Error loading sound:', error);

          
        });
    }
  }
  
  function playSoundAndChangeColorFourth(objectName) {
    let soundUrl;
    let animationName;
    let drumMesh;
  
    switch (objectName) {
      case 'Uddakkiya_top':
        soundUrl = 'Instrument_Sound/Uddakkiya/Udakki_top_sound.wav';
        animationName = 'Udakkiya_top_animation';
        break;
      case 'Uddakkiya_bottom':
        soundUrl = 'Instrument_Sound/Uddakkiya/Udakki_bottom_sound.wav';
        animationName = 'Udakkiya_Bottom_animation';
        break;
      case 'num1':
        soundUrl = Uddakkiya_Variations[0].soundUrl;
        animationName = Uddakkiya_Variations[0].animationName;
        break;
      case 'num2':
        soundUrl = Uddakkiya_Variations[1].soundUrl;
        animationName = Uddakkiya_Variations[1].animationName;
        break;
      case 'num3':
        soundUrl = Uddakkiya_Variations[2].soundUrl;
        animationName = Uddakkiya_Variations[2].animationName;
        break;
      case 'num4':
        soundUrl = Uddakkiya_Variations[3].soundUrl;
        animationName = Uddakkiya_Variations[3].animationName;
        break;
      case 'num5':
        soundUrl = Uddakkiya_Variations[4].soundUrl;
        animationName = Uddakkiya_Variations[4].animationName;
        break;
      case 'num6':
        soundUrl = Uddakkiya_Variations[5].soundUrl;
        animationName = Uddakkiya_Variations[5].animationName;
        break;
      default:
        break;
    }
  
    if (soundUrl && animationName) {
      fetch(soundUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          return audioContext.decodeAudioData(buffer);
        })
        .then(decodedData => {
          const source = audioContext.createBufferSource();
          source.buffer = decodedData;
          source.connect(audioContext.destination);
          source.start();
  
          if (drumMesh) {
            drumMesh.material.emissive.set(0x0000ff);
            drumMesh.material.emissiveIntensity = 1;
          }
  
          if (animationAction) {
            animationAction.stop();
            animationAction = mixer.clipAction(gltf.animations.find(clip => clip.name === animationName));
            animationAction.setLoop(THREE.LoopOnce);
            animationAction.clampWhenFinished = true;
            animationAction.play();
          }
  
          animationsInitialized = true;
        })
        .catch(error => {
          console.error('Error loading sound:', error);
        });
    }
  }
  
  function playSoundAndChangeColorFifth(objectName) {
    let soundUrl;
    let animationName;
    let drumMesh;
    
    switch (objectName) {
      case 'Rabana_Head001':
        soundUrl = 'Instrument_Sound/Rabana/Rabana_Sound_01.wav';
        animationName = 'Rabana_Animation_01.001';
        break;
      case 'Rabana_Head002':
        soundUrl = 'Instrument_Sound/Rabana/Rabana_Sound_02.wav';
        animationName = 'Rabana_Animation_02';
        break;
      case 'num1':
        soundUrl = Rabana_Variations[0].soundUrl;
        animationName = Rabana_Variations[0].animationName;
        break;
      case 'num2':
        soundUrl = Rabana_Variations[1].soundUrl;
        animationName = Rabana_Variations[1].animationName;
        break;
      case 'num3':
        soundUrl = Rabana_Variations[2].soundUrl;
        animationName = Rabana_Variations[2].animationName;
        break;
      case 'num4':
        soundUrl = Rabana_Variations[3].soundUrl;
        animationName = Rabana_Variations[3].animationName;
        break;
      case 'num5':
        soundUrl = Rabana_Variations[4].soundUrl;
        animationName = Rabana_Variations[4].animationName;
        break;
      case 'num6':
        soundUrl = Rabana_Variations[5].soundUrl;
        animationName = Rabana_Variations[5].animationName;
        break;
      default:
        break;
    }
  
    if (soundUrl && animationName) {
      fetch(soundUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          return audioContext.decodeAudioData(buffer);
        })
        .then(decodedData => {
          const source = audioContext.createBufferSource();
          source.buffer = decodedData;
          source.connect(audioContext.destination);
          source.start();
  
          if (drumMesh) {
            drumMesh.material.emissive.set(0x0000ff);
            drumMesh.material.emissiveIntensity = 1;
          }
  
          if (animationAction) {
            animationAction.stop();
            animationAction = mixer.clipAction(gltf.animations.find(clip => clip.name === animationName));
            animationAction.setLoop(THREE.LoopOnce);
            animationAction.clampWhenFinished = true;
            animationAction.play();
          }
  
          animationsInitialized = true;
        })
        .catch(error => {
          console.error('Error loading sound:', error);
        });
    }
  }

  const Geta_bera_Variations = [
    { animationName: 'Gata Bera_Animation_Variation_01', soundUrl: 'Instrument_Sound/Geta_beraya/Getabera Variations/Gata Bera_Variation_01.wav' },
    { animationName: 'Gata Bera_Animation_Variation_02', soundUrl: 'Instrument_Sound/Geta_beraya/Getabera Variations/Gata Bera_Variation_02.wav' },
    { animationName: 'Gata Bera_Animation_Variation_03', soundUrl: 'Instrument_Sound/Geta_beraya/Getabera Variations/Gata Bera_Variation_03.wav' },
    { animationName: 'Gata Bera_Animation_Variation_04', soundUrl: 'Instrument_Sound/Geta_beraya/Getabera Variations/Gata Bera_Variation_04.wav' },
    { animationName: 'Gata Bera_Animation_Variation_05', soundUrl: 'Instrument_Sound/Geta_beraya/Getabera Variations/Gata Bera_Variation_05.wav' },
    { animationName: 'Gata Bera_Animation_Variation_06', soundUrl: 'Instrument_Sound/Geta_beraya/Getabera Variations/Gata Bera_Variation_06.wav' },
  ];

  function loadInstrumentModel(modelUrl, position, rotation) {
    loader.load(
      modelUrl,
      function (loadedGltf) {
        if (currentInstrument) {
          scene.remove(currentInstrument);
        }
  
        const model = loadedGltf.scene;
        model.position.copy(position);
        model.rotation.copy(rotation);
        scene.add(model);
  
        mixer = new AnimationMixer(model);
        mixerRight = new AnimationMixer(model);
  
        animationAction = mixer.clipAction(loadedGltf.animations.find(clip => clip.name === "Geta_Bera_Left_Main"));
        animationActionRight = mixerRight.clipAction(loadedGltf.animations.find(clip => clip.name === "Geta_Bera_Right_Main.001"));
  
        // Set loop properties to prevent looping
        animationAction.setLoop(THREE.LoopOnce);
        animationAction.clampWhenFinished = true;
  
        animationActionRight.setLoop(THREE.LoopOnce);
        animationActionRight.clampWhenFinished = true;
  
        // Play animations
        animationAction.play();
        animationActionRight.play();
  
        currentInstrument = model;
  
        // Assign the loaded gltf to the global variable
        gltf = loadedGltf;
  
      },
      undefined,
      function (error) {
        console.error('Error loading the 3D model:', error);
      }
    );
  }
//The Array of Variation of Dawla Animations & Audio URL's
  const dawlaVariations = [
    { animationName: 'Dawula_Animation_Variation_01', soundUrl: 'Instrument_Sound/Dawula/Dawla_Variation/Dawula_Variation_01.wav' },
    { animationName: 'Dawula_Animation_Variation_02', soundUrl: 'Instrument_Sound/Dawula/Dawla_Variation/Dawula_Variation_02.wav' },
    { animationName: 'Dawula_Animation_Variation_03', soundUrl: 'Instrument_Sound/Dawula/Dawla_Variation/Dawula_Variation_03.wav' },
    { animationName: 'Dawula_Animation_Variation_04', soundUrl: 'Instrument_Sound/Dawula/Dawla_Variation/Dawula_Variation_04.wav' },
    { animationName: 'Dawula_Animation_Variation_05', soundUrl: 'Instrument_Sound/Dawula/Dawla_Variation/Dawula_Variation_05.wav' },
    { animationName: 'Dawula_Animation_Variation_06', soundUrl: 'Instrument_Sound/Dawula/Dawla_Variation/Dawula_Variation_06.wav' },
  ];


  function loadSecondInstrumentModel(modelUrl, position, rotation) {
    loader.load(
      modelUrl,
      function (loadedGltf) {
        if (currentInstrument) {
          scene.remove(currentInstrument);
        }
  
        const model = loadedGltf.scene;
        model.position.copy(position);
        model.rotation.copy(rotation);
        scene.add(model);
  
        mixer = new AnimationMixer(model);
        mixerRight = new AnimationMixer(model);
  
        animationAction = mixer.clipAction(loadedGltf.animations.find(clip => clip.name === "Dawula_Left_Main"));
        animationActionRight = mixerRight.clipAction(loadedGltf.animations.find(clip => clip.name === "Dawula_Right_Main"));
  
        // Set loop properties to prevent looping
        animationAction.setLoop(THREE.LoopOnce);
        animationAction.clampWhenFinished = true;
  
        animationActionRight.setLoop(THREE.LoopOnce);
        animationActionRight.clampWhenFinished = true;
  
        // Play animations
        animationAction.play();
        animationActionRight.play();
  
        currentInstrument = model;
  
        // Assign the loaded gltf to the global variable
        gltf = loadedGltf;
      },
      undefined,
      function (error) {
        console.error('Error loading the 3D model:', error);
      }
    );
  }


  const Thammattama_Variations = [
    { animationName: 'Thammattama_Animation_Variation_01', soundUrl: 'Instrument_Sound/Thammattama/Thammattama_Variations/Thammattama_Variation_01.wav' },
    { animationName: 'Thammattama_Animation_Variation_02', soundUrl: 'Instrument_Sound/Thammattama/Thammattama_Variations/Thammattama_Variation_02.wav' },
    { animationName: 'Thammattama_Animation_Variation_03', soundUrl: 'Instrument_Sound/Thammattama/Thammattama_Variations/Thammattama_Variation_03.wav' },
    { animationName: 'Thammattama_Animation_Variation_04', soundUrl: 'Instrument_Sound/Thammattama/Thammattama_Variations/Thammattama_Variation_04.wav' },
    { animationName: 'Thammattama_Animation_Variation_05', soundUrl: 'Instrument_Sound/Thammattama/Thammattama_Variations/Thammattama_Variation_05.wav' },
    { animationName: 'Thammattama_Animation_Variation_06', soundUrl: 'Instrument_Sound/Thammattama/Thammattama_Variations/Thammattama_Variation_06.wav' },
  ];


  
  function loadThirdInstrumentModel(modelUrl, position, rotation) {
    loader.load(
      modelUrl,
      function (loadedGltf) {
        if (currentInstrument) {
          scene.remove(currentInstrument);
        }
  
        const model = loadedGltf.scene;
        model.position.copy(position);
        model.rotation.copy(rotation);
        scene.add(model);
  
        mixer = new AnimationMixer(model);
        mixerRight = new AnimationMixer(model);
  
        animationAction = mixer.clipAction(loadedGltf.animations.find(clip => clip.name === "Thammattama_Left"));
        animationActionRight = mixerRight.clipAction(loadedGltf.animations.find(clip => clip.name === "Thammattama_Right"));
  
        // Set loop properties to prevent looping
        animationAction.setLoop(THREE.LoopOnce);
        animationAction.clampWhenFinished = true;
  
        animationActionRight.setLoop(THREE.LoopOnce);
        animationActionRight.clampWhenFinished = true;
  
        // Play animations
        animationAction.play();
        animationActionRight.play();
  
        currentInstrument = model;
  
        // Assign the loaded gltf to the global variable
        gltf = loadedGltf;
  
      },
      undefined,
      function (error) {
        console.error('Error loading the 3D model:', error);
      }
    );
  }

  const Uddakkiya_Variations = [
    { animationName: 'Udakki __Animation_Variation_01', soundUrl: 'Instrument_Sound/Uddakkiya/Udakki_Variations/Udakki_Variation_01.wav' },
    { animationName: 'Udakki __Animation_Variation_02', soundUrl: 'Instrument_Sound/Uddakkiya/Udakki_Variations/Udakki_Variation_02.wav' },
    { animationName: 'Udakki __Animation_Variation_03', soundUrl: 'Instrument_Sound/Uddakkiya/Udakki_Variations/Udakki_Variation_03.wav' },
    { animationName: 'Udakki __Animation_Variation_04', soundUrl: 'Instrument_Sound/Uddakkiya/Udakki_Variations/Udakki_Variation_04.wav' },
    { animationName: 'Udakki __Animation_Variation_05', soundUrl: 'Instrument_Sound/Uddakkiya/Udakki_Variations/Udakki_Variation_05.wav' },
    { animationName: 'Udakki __Animation_Variation_06', soundUrl: 'Instrument_Sound/Uddakkiya/Udakki_Variations/Udakki_Variation_06.wav' },
  ];

  function loadFourthInstrumentModel(modelUrl, position, rotation) {
    loader.load(
      modelUrl,
      function (loadedGltf) {
        if (currentInstrument) {
          scene.remove(currentInstrument);
        }
  
        const model = loadedGltf.scene;
        model.position.copy(position);
        model.rotation.copy(rotation);
        scene.add(model);
  
        mixer = new AnimationMixer(model);
        mixerRight = new AnimationMixer(model);
  
        animationAction = mixer.clipAction(loadedGltf.animations.find(clip => clip.name === "Udakkiya_top_animation"));
        animationActionRight = mixerRight.clipAction(loadedGltf.animations.find(clip => clip.name === "Udakkiya_Bottom_animation"));
  
        // Set loop properties to prevent looping
        animationAction.setLoop(THREE.LoopOnce);
        animationAction.clampWhenFinished = true;
  
        animationActionRight.setLoop(THREE.LoopOnce);
        animationActionRight.clampWhenFinished = true;
  
        // Play animations
        animationAction.play();
        animationActionRight.play();
  
        currentInstrument = model;
  
        // Assign the loaded gltf to the global variable
        gltf = loadedGltf;
  
      },
      undefined,
      function (error) {
        console.error('Error loading the 3D model:', error);
      }
    );
  }
  
  const Rabana_Variations = [
    { animationName: 'Rabana_Animation_Variation_01', soundUrl: 'Instrument_Sound/Rabana/Rabana_Variation/Rabana_Variation_01.wav' },
    { animationName: 'Rabana_Animation_Variation_02', soundUrl: 'Instrument_Sound/Rabana/Rabana_Variation/Rabana_Variation_02.wav' },
    { animationName: 'Rabana_Animation_Variation_03', soundUrl: 'Instrument_Sound/Rabana/Rabana_Variation/Rabana_Variation_03.wav' },
    { animationName: 'Rabana_Animation_Variation_04', soundUrl: 'Instrument_Sound/Rabana/Rabana_Variation/Rabana_Variation_04.wav' },
    { animationName: 'Rabana_Animation_Variation_05', soundUrl: 'Instrument_Sound/Rabana/Rabana_Variation/Rabana_Variation_05.wav' },
    { animationName: 'Rabana_Animation_Variation_06', soundUrl: 'Instrument_Sound/Rabana/Rabana_Variation/Rabana_Variation_06.wav' },
  ];


  function loadFifthInstrumentModel(modelUrl, position, rotation) {
    loader.load(

      
      modelUrl,
      function (loadedGltf) {
        if (currentInstrument) {
          scene.remove(currentInstrument);
        }

        const model = loadedGltf.scene;
        model.position.copy(position);
        model.rotation.copy(rotation);
        scene.add(model);
  
        mixer = new AnimationMixer(model);
        mixerRight = new AnimationMixer(model);
  
        animationAction = mixer.clipAction(loadedGltf.animations.find(clip => clip.name === "Rabana_Animation_01.001"));
        animationActionRight = mixerRight.clipAction(loadedGltf.animations.find(clip => clip.name === "Rabana_Animation_02"));
  
        // Set loop properties to prevent looping
        animationAction.setLoop(THREE.LoopOnce);
        animationAction.clampWhenFinished = true;
  
        animationActionRight.setLoop(THREE.LoopOnce);
        animationActionRight.clampWhenFinished = true;
  
        // Play animations
        animationAction.play();
        animationActionRight.play();
  
        currentInstrument = model;
  
        // Assign the loaded gltf to the global variable
        gltf = loadedGltf;
  
      },
      undefined,
      function (error) {
        console.error('Error loading the 3D model:', error);
      }
    );
  }


  const keyMappings = {
    KeyW: 'Left_drum_head',
    KeyQ: 'Right_drum_head',
    Digit1: 'num1', // Map to num1 (top row)
    Digit2: 'num2', // Map to num2 (top row)
    Digit3: 'num3', // Map to num3 (top row)
    Digit4: 'num4', // Map to num4 (top row)
    Digit5: 'num5', // Map to num5 (top row)
    Digit6: 'num6', // Map to num6 (top row)
    Numpad1: 'num1', // Map to num1 (number pad)
    Numpad2: 'num2', // Map to num2 (number pad)
    Numpad3: 'num3', // Map to num3 (number pad)
    Numpad4: 'num4', // Map to num4 (number pad)
    Numpad5: 'num5', // Map to num5 (number pad)
    Numpad6: 'num6', // Map to num6 (number pad)
  };
    
 
  const keyMappingsSecond = {
    KeyW: 'Dawla_Left_drum_head',
    KeyQ: 'Dawla_Right_drum_head',
    Digit1: 'num1', // Map to num1 (top row)
    Digit2: 'num2', // Map to num2 (top row)
    Digit3: 'num3', // Map to num3 (top row)
    Digit4: 'num4', // Map to num4 (top row)
    Digit5: 'num5', // Map to num5 (top row)
    Digit6: 'num6', // Map to num6 (top row)
    Numpad1: 'num1', // Map to num1 (number pad)
    Numpad2: 'num2', // Map to num2 (number pad)
    Numpad3: 'num3', // Map to num3 (number pad)
    Numpad4: 'num4', // Map to num4 (number pad)
    Numpad5: 'num5', // Map to num5 (number pad)
    Numpad6: 'num6', // Map to num6 (number pad)
  };
  
  
  

  const keyMappingsThird = {
    KeyW: 'Thammattama_left_drum_head',
    KeyQ: 'Thammattama_Right_drum_head',
    Digit1: 'num1', // Map to num1 (top row)
    Digit2: 'num2', // Map to num2 (top row)
    Digit3: 'num3', // Map to num3 (top row)
    Digit4: 'num4', // Map to num4 (top row)
    Digit5: 'num5', // Map to num5 (top row)
    Digit6: 'num6', // Map to num6 (top row)
    Numpad1: 'num1', // Map to num1 (number pad)
    Numpad2: 'num2', // Map to num2 (number pad)
    Numpad3: 'num3', // Map to num3 (number pad)
    Numpad4: 'num4', // Map to num4 (number pad)
    Numpad5: 'num5', // Map to num5 (number pad)
    Numpad6: 'num6', // Map to num6 (number pad)
  };


  const keyMappingsFourth = {
    KeyW: 'Uddakkiya_top',
    KeyQ: 'Uddakkiya_bottom',
    Digit1: 'num1', // Map to num1 (top row)
    Digit2: 'num2', // Map to num2 (top row)
    Digit3: 'num3', // Map to num3 (top row)
    Digit4: 'num4', // Map to num4 (top row)
    Digit5: 'num5', // Map to num5 (top row)
    Digit6: 'num6', // Map to num6 (top row)
    Numpad1: 'num1', // Map to num1 (number pad)
    Numpad2: 'num2', // Map to num2 (number pad)
    Numpad3: 'num3', // Map to num3 (number pad)
    Numpad4: 'num4', // Map to num4 (number pad)
    Numpad5: 'num5', // Map to num5 (number pad)
    Numpad6: 'num6', // Map to num6 (number pad)
  };

  const keyMappingsFifth = {
    KeyW: 'Rabana_Head001',
    KeyQ: 'Rabana_Head002',
    Digit1: 'num1', // Map to num1 (top row)
    Digit2: 'num2', // Map to num2 (top row)
    Digit3: 'num3', // Map to num3 (top row)
    Digit4: 'num4', // Map to num4 (top row)
    Digit5: 'num5', // Map to num5 (top row)
    Digit6: 'num6', // Map to num6 (top row)
    Numpad1: 'num1', // Map to num1 (number pad)
    Numpad2: 'num2', // Map to num2 (number pad)
    Numpad3: 'num3', // Map to num3 (number pad)
    Numpad4: 'num4', // Map to num4 (number pad)
    Numpad5: 'num5', // Map to num5 (number pad)
    Numpad6: 'num6', // Map to num6 (number pad)
  };
  
  document.addEventListener('keydown', (event) => {
    const key = event.code;
  
    // Check which instrument's drum heads to use based on the active instrument
    let drumHeadMappings;
    if (activeInstrument === 'Geta-Beraya') {
      drumHeadMappings = keyMappings;
    } else if (activeInstrument === 'Daula') {
      drumHeadMappings = keyMappingsSecond;
    } else if (activeInstrument === 'thammattama') {
      drumHeadMappings = keyMappingsThird;
    } else if (activeInstrument === 'Udekkiya') {
      drumHeadMappings = keyMappingsFourth;
    } else if (activeInstrument === 'Rabana') {
      drumHeadMappings = keyMappingsFifth;
    }
  
    // Get the drum head name from the mappings
    const drumHeadName = drumHeadMappings[key] || drumHeadMappings[event.key];
  
    // Call the appropriate function based on the active instrument
    if (drumHeadName) {
      if (activeInstrument === 'Geta-Beraya') {
        playSoundAndChangeColor(drumHeadName);
      } else if (activeInstrument === 'Daula') {
        playSoundAndChangeColorSecond(drumHeadName);
      } else if (activeInstrument === 'thammattama') {
        playSoundAndChangeColorThird(drumHeadName);
      } else if (activeInstrument === 'Udekkiya') {
        playSoundAndChangeColorFourth(drumHeadName);
      } else if (activeInstrument === 'Rabana') {
        playSoundAndChangeColorFifth(drumHeadName);
      }
    }
  });
  
  
 // const firstObjectButton = document.getElementById('Geta-Beraya');
 // const secondObjectButton = document.getElementById('Daula');

 

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }

  function onClick(event) {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
  
    for (let i = 0; i < intersects.length; i++) {
      const clickedMesh = intersects[i].object;
      const objectName = clickedMesh.name;
      console.log('Clicked object name:', objectName);
  
      // Update the conditions to include the new object names
      if (
        objectName === 'Left_drum_head' ||
        objectName === 'Right_drum_head' ||
        objectName === 'Dawla_Left_drum_head' ||
        objectName === 'Dawla_Right_drum_head' ||
        objectName === 'Thammattama_left_drum_head' || // Update 'left' to lowercase 'l'
        objectName === 'Thammattama_Right_drum_head' ||  // Update 'right' to lowercase 'r'
        objectName === 'Uddakkiya_top' || 
        objectName === 'Uddakkiya_bottom' ||
        objectName ==='Rabana_Head001'||
        objectName ==='Rabana_Head002'


      ) {
        // Update the function to use the appropriate playSound function
        if (objectName === 'Left_drum_head' || objectName === 'Right_drum_head') {
          playSoundAndChangeColor(objectName);
        } else if (
          objectName === 'Dawla_Left_drum_head' ||
          objectName === 'Dawla_Right_drum_head'
        ) {
          playSoundAndChangeColorSecond(objectName);
        } else if (
          objectName === 'Thammattama_left_drum_head' ||
          objectName === 'Thammattama_Right_drum_head'
        ) {
          playSoundAndChangeColorThird(objectName);
        }
        else if (
          objectName === 'Uddakkiya_top' ||
          objectName === 'Uddakkiya_bottom'
        ) {
          playSoundAndChangeColorFourth(objectName);
        }
        else if (
          objectName === 'Rabana_Head001' ||
          objectName === 'Rabana_Head002'
        ) {
          playSoundAndChangeColorFifth(objectName);
        }


      }
    }
  }
  
  

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('click', onClick);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(10, 10, 10);
  topLight.castShadow = true;
  scene.add(topLight);

  let lastTime = 0;

  function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) * 0.001;
    lastTime = currentTime;
  
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  
    if (animationsInitialized) {
      mixer.update(deltaTime);
      mixerRight.update(deltaTime);
  
      // Check if animationAction is defined and has a clip
      if (animationAction && animationAction.getClip()) {
        if (animationAction.time === animationAction.getClip().duration) {
          animationAction.stop();
        }
      }
  
      // Check if animationActionRight is defined and has a clip
      if (animationActionRight && animationActionRight.getClip()) {
        if (animationActionRight.time === animationActionRight.getClip().duration) {
          animationActionRight.stop();
        }
      }
    }
  }
  
  

  function onWindowResize() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize);
  animate();
});
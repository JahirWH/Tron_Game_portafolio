// Archivo portfolio-3d.js - Renderiza el portafolio como un cartel 3D con Three.js

// Variables principales de la escena
let scene, camera, renderer;
let frames = []; // Array para los marcos
let trashCan;
let isTrashHovered = false;
let mousePosition = { x: 0, y: 0 };
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let controls; // Controles de órbita

// Variables para la moto
let motorcycle;
let motorcycleControls = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  speed: 0,
  rotationSpeed: 0
};

// Variables para los árboles
let trees = [];

// Variables para la cámara
let cameraControls = {
  up: false,
  down: false,
  left: false,
  right: false,
  cameraOffset: new THREE.Vector3(0, 3, -5),
  cameraLookAt: new THREE.Vector3(0, 1, 3),
  followingMotorcycle: false
};

// Añadir constante para la altura del suelo
const FLOOR_HEIGHT = -1.2;
const OBJECT_BASE_HEIGHT = FLOOR_HEIGHT + 0.01;

// Inicializar la escena
function init() {
  console.log("Iniciando escena 3D...");
  
  // Crear contenedor para Three.js
  const container = document.createElement('div');
  container.id = 'three-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = '1';
  document.body.prepend(container);

  // Configurar escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Configurar cámara
  camera = new THREE.PerspectiveCamera(
    50, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  );
  camera.position.set(10, 2, 10);

  // Configurar renderizador
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Inicializar controles de órbita
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = 0;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 1;
  controls.enabled = true; // Habilitado por defecto para cámara libre

  // Añadir elementos a la escena
  addLights();
  createFrames();
  createTrashCan();
  createFloor();
  createLamp();
  createTrees();
  adjustOriginalContent();
  createConnectionLines();

  // Eventos del mouse
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onMouseClick);
  window.addEventListener('resize', onWindowResize);

  // Iniciar animación
  animate();
  
  console.log("Escena 3D lista");
}

// Ajustar contenido HTML
function adjustOriginalContent() {
  const content = document.querySelector('.container');
  if (content) {
    content.style.position = 'absolute';
    content.style.top = '50%';
    content.style.left = '50%';
    content.style.transform = 'translate(-50%, -50%)';
    content.style.zIndex = '2';
    content.style.pointerEvents = 'all';
    content.style.opacity = '1';
    content.style.transition = 'opacity 1s ease';
  }

  function addMotorcycleToScene() {
    createMotorcycle();
    initMotorcycleControls();
  }

  addMotorcycleToScene();
}
// Cargar modelo de motocicleta GLTF
function createMotorcycle() {
  const loader = new THREE.GLTFLoader();
  
  loader.load(
    'modelos/motorcycle-minecraft/source/model.gltf',  // Asegúrate de que esta ruta sea correcta
    function (gltf) {
      motorcycle = gltf.scene;
      
      // Posicionar la moto al nivel del suelo
      motorcycle.position.set(0, OBJECT_BASE_HEIGHT, 0);
      motorcycle.scale.set(0.5, 0.5, 0.5);
      
      // Ajustar rotación inicial si es necesario
      motorcycle.rotation.y = Math.PI / 2;  // Girar 90 grados si es necesario
      
      // Configurar sombras
      motorcycle.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Mejorar materiales para que coincidan con el estilo
          child.material.metalness = 0.5;
          child.material.roughness = 0.5;
        }
      });
      
      scene.add(motorcycle);
      console.log('Modelo de motocicleta Minecraft cargado correctamente');
    },
    function (xhr) {
      console.log('Cargando modelo...', (xhr.loaded / xhr.total * 100) + '%');
    },
    function (error) {
      console.error('Error al cargar el modelo de motocicleta:', error);
    }
  );
}

// Crear árboles en la escena
function createTrees() {
  const loader = new THREE.GLTFLoader();
  
  // Posiciones para los dos árboles
  const treePositions = [
    { x: -5, z: -6, rotation: 0 },
    { x: -5, z: 1, rotation: Math.PI / 2 }
  ];
  
  treePositions.forEach((pos, index) => {
    loader.load(
      'modelos/arbol_low_poly/scene.gltf',
      function (gltf) {
        const tree = gltf.scene.clone();
        tree.position.set(pos.x, 0, pos.z);
        tree.rotation.y = pos.rotation;
        tree.scale.set(0.5, 0.5, 0.5); // Escalar el árbol para que sea visible
        
        // Configurar sombras para todos los meshes del árbol
        tree.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        scene.add(tree);
        trees.push(tree);
        console.log(`Árbol ${index + 1} cargado correctamente`);
      },
      function (progress) {
        console.log(`Cargando árbol ${index + 1}...`, (progress.loaded / progress.total * 100) + '%');
      },
      function (error) {
        console.error(`Error al cargar el árbol ${index + 1}:`, error);
      }
    );
  });
}

// Posicionar cámara en la motocicleta
function camaraenmoto() {
  if (!motorcycle) return;

  // Solo deshabilitar controles si se está siguiendo a la motocicleta
  if (cameraControls.followingMotorcycle) {
    controls.enabled = false;
  } else {
    controls.enabled = true;
    return; // Si no está siguiendo, usar controles libres
  }

  // Actualizar posición de la cámara basada en controles
  const cameraSpeed = 0.1;
  if (cameraControls.up) {
    cameraControls.cameraOffset.y += cameraSpeed;
  }
  if (cameraControls.down) {
    cameraControls.cameraOffset.y -= cameraSpeed;
  }
  if (cameraControls.left) {
    cameraControls.cameraOffset.x -= cameraSpeed;
  }
  if (cameraControls.right) {
    cameraControls.cameraOffset.x += cameraSpeed;
  }

  // Limitar el rango de la cámara
  cameraControls.cameraOffset.y = Math.max(1, Math.min(8, cameraControls.cameraOffset.y));
  cameraControls.cameraOffset.x = Math.max(-8, Math.min(8, cameraControls.cameraOffset.x));

  // Offset relativo a la orientación de la motocicleta
  const offset = cameraControls.cameraOffset.clone();
  offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), motorcycle.rotation.y);

  // Nueva posición de la cámara
  const cameraPosition = motorcycle.position.clone().add(offset);
  camera.position.copy(cameraPosition);

  // Mira hacia adelante de la motocicleta
  const lookAtOffset = cameraControls.cameraLookAt.clone();
  lookAtOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), motorcycle.rotation.y);
  const lookAt = motorcycle.position.clone().add(lookAtOffset);
  camera.lookAt(lookAt);

  camera.updateMatrix();
}

// Alternar entre cámara libre y cámara de seguimiento
function toggleCameraMode() {
  cameraControls.followingMotorcycle = !cameraControls.followingMotorcycle;
  
  if (cameraControls.followingMotorcycle) {
    console.log("Cámara: Siguiendo a la motocicleta");
    controls.enabled = false;
  } else {
    console.log("Cámara: Modo libre (mouse)");
    controls.enabled = true;
  }
}

// Inicializar controles de la motocicleta
function initMotorcycleControls() {
  window.addEventListener('keydown', (event) => {
    switch(event.key.toLowerCase()) {
      case 'w':
        motorcycleControls.forward = true;
        break;
      case 's':
        motorcycleControls.backward = true;
        break;
      case 'a':
        motorcycleControls.left = true;
        break;
      case 'd':
        motorcycleControls.right = true;
        break;
      case 'arrowup':
        cameraControls.up = true;
        break;
      case 'arrowdown':
        cameraControls.down = true;
        break;
      case 'arrowleft':
        cameraControls.left = true;
        break;
      case 'arrowright':
        cameraControls.right = true;
        break;
      case ' ': // Espacio para frenar
        motorcycleControls.speed *= 0.9;
        break;
      case 'c': // C para cambiar modo de cámara
        toggleCameraMode();
        break;
    }
  });

  window.addEventListener('keyup', (event) => {
    switch(event.key.toLowerCase()) {
      case 'w':
        motorcycleControls.forward = false;
        break;
      case 's':
        motorcycleControls.backward = false;
        break;
      case 'a':
        motorcycleControls.left = false;
        break;
      case 'd':
        motorcycleControls.right = false;
        break;
      case 'arrowup':
        cameraControls.up = false;
        break;
      case 'arrowdown':
        cameraControls.down = false;
        break;
      case 'arrowleft':
        cameraControls.left = false;
        break;
      case 'arrowright':
        cameraControls.right = false;
        break;
    }
  });
}

// Actualizar movimiento de la motocicleta
function updateMotorcycle() {
  if (!motorcycle) return;

  // Parámetros de movimiento para motocicleta terrestre
  const acceleration = 0.01;
  const deceleration = 0.95;
  const maxSpeed = 0.3;
  const rotationAcceleration = 0.02;
  const maxRotationSpeed = 0.08;

  // Aceleración y frenado
  if (motorcycleControls.forward) {
    motorcycleControls.speed += acceleration;
  } else if (motorcycleControls.backward) {
    motorcycleControls.speed -= acceleration;
  } else {
    motorcycleControls.speed *= deceleration;
  }

  // Limitar velocidad
  motorcycleControls.speed = Math.max(
    Math.min(motorcycleControls.speed, maxSpeed),
    -maxSpeed * 0.5
  );

  // Girar (inclinación de la motocicleta)
  if (motorcycleControls.left) {
    motorcycleControls.rotationSpeed += rotationAcceleration;
    motorcycle.rotation.z = Math.min(motorcycle.rotation.z + 0.05, 0.4);
  } else if (motorcycleControls.right) {
    motorcycleControls.rotationSpeed -= rotationAcceleration;
    motorcycle.rotation.z = Math.max(motorcycle.rotation.z - 0.05, -0.4);
  } else {
    motorcycleControls.rotationSpeed *= 0.9;
    motorcycle.rotation.z *= 0.9;
  }

  // Limitar velocidad de giro
  motorcycleControls.rotationSpeed = Math.max(
    Math.min(motorcycleControls.rotationSpeed, maxRotationSpeed),
    -maxRotationSpeed
  );

  // Aplicar rotación Y (dirección)
  motorcycle.rotation.y += motorcycleControls.rotationSpeed;

  // Calcular dirección de movimiento
  const moveX = Math.sin(motorcycle.rotation.y) * motorcycleControls.speed;
  const moveZ = Math.cos(motorcycle.rotation.y) * motorcycleControls.speed;

  // Mover motocicleta manteniendo altura constante
  motorcycle.position.x += moveX;
  motorcycle.position.z -= moveZ;
  motorcycle.position.y = OBJECT_BASE_HEIGHT; // Mantener al nivel del suelo

  // Limitar área de movimiento
  const boundaryLimit = 15;
  if (Math.abs(motorcycle.position.x) > boundaryLimit) {
    motorcycle.position.x = Math.sign(motorcycle.position.x) * boundaryLimit;
  }
  if (Math.abs(motorcycle.position.z) > boundaryLimit) {
    motorcycle.position.z = Math.sign(motorcycle.position.z) * boundaryLimit;
  }
}


// lapmra

function createLamp() {
  const lamp = new THREE.Group();
  lamp.position.set(-2, 0, 2);
  
  // Base de la lámpara
  const baseGeometry = new THREE.CylinderGeometry(0.15, 0.2, 4, 16);
  const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0x111111,
    shininess: 30
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = 1.5;
  lamp.add(base);
  
  // Brazo horizontal
  const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8);
  const armMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0x111111,
    shininess: 30
  });
  const arm = new THREE.Mesh(armGeometry, armMaterial);
  arm.position.y = 3.2;
  arm.rotation.z = Math.PI / 2;
  arm.position.x = 0.7;
  lamp.add(arm);
  
  // Luminaria
  const lampShadeGeometry = new THREE.CylinderGeometry(0.35, 0.5, 0.7, 16);
  const lampShadeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0x111111,
    shininess: 30
  });
  const lampShade = new THREE.Mesh(lampShadeGeometry, lampShadeMaterial);
  lampShade.position.y = 3.2;
  lampShade.position.x = 1.4;
  lampShade.rotation.x = Math.PI / 2;
  lamp.add(lampShade);
  
  // Luz
  const lampLight = new THREE.SpotLight(0x000000, 4.0, 15, Math.PI/3, 0.5, 1);
  lampLight.position.y = 3.2;
  lampLight.position.x = 1.4;
  lampLight.target.position.set(1.4, -2, 0);
  lamp.add(lampLight);
  lamp.add(lampLight.target);
  
  // Configurar sombras
  lampLight.castShadow = true;
  lampLight.shadow.mapSize.width = 2048;
  lampLight.shadow.mapSize.height = 2048;
  lampLight.shadow.camera.near = 0.5;
  lampLight.shadow.camera.far = 20;
  lampLight.shadow.bias = -0.0001;
  
  // Lente de la luz
  const lensGeometry = new THREE.CircleGeometry(0.3, 16);
  const lensMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });
  const lens = new THREE.Mesh(lensGeometry, lensMaterial);
  lens.position.y = 3.2;
  lens.position.x = 1.4;
  lens.rotation.x = -Math.PI / 2;
  lens.position.y -= 0.35;
  lamp.add(lens);
  
  // Animar brillo
  const animateLamp = () => {
    const pulseIntensity = 3.0 + Math.sin(Date.now() * 0.002) * 0.5;
    lampLight.intensity = pulseIntensity;
    requestAnimationFrame(animateLamp);
  };
  animateLamp();
  
  return lamp;
}

// Añadir luces a la escena
function addLights() {
  // Luz ambiental
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Luz principal
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);

  // Luz de relleno
  const fillLight = new THREE.PointLight(0xffffff, 0.5, 10);
  fillLight.position.set(-2, 3, -2);
  scene.add(fillLight);
  
  // Luz de acento
  const accentLight = new THREE.SpotLight(0xffffff, 1.0);
  accentLight.position.set(0, 4, 0);
  accentLight.angle = 0.3;
  accentLight.penumbra = 0.8;
  accentLight.castShadow = true;
  scene.add(accentLight);
}

// Crear marcos
function createFrames() {
  const frameSize = { width: 3.7, height: 2.5 };
  const cubeSize = 4;
  
  // Posiciones de las caras
  const positions = [
    { x: 0, y: 0, z: cubeSize/2, rotation: { x: 0, y: 0, z: 0 }, size: { width: 3.7, height: 2.5 } },
    { x: 0, y: 0, z: -cubeSize/2, rotation: { x: 0, y: Math.PI, z: 0 }, size: { width: 3.7, height: 2.5 } },
    { x: cubeSize/2, y: 0, z: 0, rotation: { x: 0, y: Math.PI/2, z: 0 }, size: { width: 3.7, height: 2.5 } },
    { x: -cubeSize/2, y: 0, z: 0, rotation: { x: 0, y: -Math.PI/2, z: 0 }, size: { width: 3.7, height: 2.5 } },
    { x: 0, y: cubeSize/2, z: 0, rotation: { x: -Math.PI/2, y: 0, z: 0 }, size: { width: 3.7, height: 3.7 } },
    { x: 0, y: -cubeSize/2, z: 0, rotation: { x: Math.PI/2, y: 0, z: 0 }, size: { width: 3.7, height: 3.7 } }
  ];

  // Grupo del cubo
  const cubeGroup = new THREE.Group();
  scene.add(cubeGroup);

  // Crear marcos
  positions.forEach((pos, index) => {
    const frame = createFrame(pos.size.width, pos.size.height, index);
    frame.position.set(pos.x, pos.y, pos.z);
    frame.rotation.set(pos.rotation.x, pos.rotation.y, pos.rotation.z);
    cubeGroup.add(frame);
    frames.push(frame);
  });

  // Bordes del cubo
  const edgesGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize));
  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
  const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  cubeGroup.add(edges);

  // Posición del cubo
  cubeGroup.position.y = 8.8;
}

// Crear textura HTML
function createHTMLTexture(htmlContent, width, height, frameIndex) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    const contentDiv = document.getElementById('content-3d');
    if (!contentDiv) {
      reject(new Error('No se encontró el contenedor #content-3d'));
      return;
    }

    // Clonar contenido
    const contentClone = contentDiv.cloneNode(true);
    contentClone.style.width = width + 'px';
    contentClone.style.height = height + 'px';
    contentClone.style.position = 'absolute';
    contentClone.style.left = '0';
    contentClone.style.top = '0';
    contentClone.style.zIndex = '-1';
    contentClone.style.display = 'block';
    contentClone.style.backgroundColor = '#ffffff';
    contentClone.style.color = '#000000';

    // Modificar contenido según el marco
    const container = contentClone.querySelector('.container');
    if (container) {
      container.style.width = '100%';
      container.style.scale = '1';
      container.style.height = '100%';
      container.style.padding = '0px';
      container.style.margin = 'auto';
      container.style.display = 'flex';
      container.style.boxSizing = 'border-box';
      
      switch(frameIndex) {
        case 0: // Cara frontal
          container.innerHTML = `
            <div class="container">
             <h3>Visita</h3>
             <h1>WWW.portafolio.icu</h1>
            </div>
          `;
          break;
        
        case 1: // Cara trasera
          container.innerHTML = `
            <div style="padding: 20px;">
              <h3 style="color: #000000; margin-bottom: 20px;"><i class="fas fa-code"></i> Lenguajes</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div style="background: rgba(0,0,0,0.1); padding: 10px; text-align: center;">
                  <i class="fab fa-python" style="font-size: 2em; color: #000000;"></i>
                  <p style="color: #000000;">Python</p>
                </div>
                <div style="background: rgba(0,0,0,0.1); padding: 10px; text-align: center;">
                  <i class="fas fa-terminal" style="font-size: 2em; color: #000000;"></i>
                  <p style="color: #000000;">Bash</p>
                </div>
                <div style="background: rgba(0,0,0,0.1); padding: 10px; text-align: center;">
                  <i class="fab fa-js-square" style="font-size: 2em; color: #000000;"></i>
                  <p style="color: #000000;">JavaScript</p>
                </div>
                <div style="background: rgba(0,0,0,0.1); padding: 10px; text-align: center;">
                  <i class="fab fa-java" style="font-size: 2em; color: #000000;"></i>
                  <p style="color: #000000;">Java</p>
                </div>
              </div>
            </div>
          `;
          break;
        case 2: // Cara derecha
          container.innerHTML = `
            <div style="padding: 20px;">
              <div style="display: flex; flex-direction: column; gap: 15px;">
                <div style="background: rgba(0,0,0,0.2); padding: 15px; text-align: center;">
                  <i class="fab fa-github" style="font-size: 2em; color: #00ff88;"></i>
                  <p>Github</p>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 15px; text-align: center;">
                  <i class="fas fa-file-pdf" style="font-size: 2em; color: #00ff88;"></i>
                  <p>CV</p>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 15px; text-align: center;">
                  <i class="fas fa-envelope" style="font-size: 2em; color: #00ff88;"></i>
                  <p>Contacto</p>
                </div>
              </div>
            </div>
          `;
          break;
        case 3: // Cara izquierda
          container.innerHTML = `
            <div style="padding: 20px;">
              <h3 style="color: #00ff88; margin-bottom: 20px;"><i class="fas fa-project-diagram"></i> Proyectos</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div style="background: rgba(0,0,0,0.2); padding: 15px; text-align: center;">
                  <i class="fas fa-code" style="font-size: 2em; color: #00ff88;"></i>
                  <p>Desarrollo Web</p>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 15px; text-align: center;">
                  <i class="fas fa-robot" style="font-size: 2em; color: #00ff88;"></i>
                  <p>Automatización</p>
                </div>
              </div>
            </div>
          `;
          break;
        case 4: // Cara superior
          container.innerHTML = `
            <div style="padding: 20px; text-align: center;">
              <h3 style="color: #00ff88;"><i class="fas fa-hand-peace"></i> ¡Bienvenido!</h3>
              <p style="margin-top: 20px;">Soy <strong>Jahir</strong>, desarrollador de software autodidacta apasionado por la eficiencia y la automatización.</p>
            </div>
          `;
          break;
      }
    }

    document.body.appendChild(contentClone);

    // Asegurar que Font Awesome esté cargado
    const fontAwesomeLink = document.querySelector('link[href*="font-awesome"]');
    if (fontAwesomeLink) {
      contentClone.appendChild(fontAwesomeLink.cloneNode(true));
    }

    html2canvas(contentClone, {
      canvas: canvas,
      backgroundColor: '#ffffff',
      scale: 1,
      logging: false,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      onclone: (clonedDoc) => {
        const clonedContent = clonedDoc.getElementById('content-3d');
        if (clonedContent) {
          clonedContent.style.width = width + 'px';
          clonedContent.style.height = height + 'px';
          clonedContent.style.position = 'absolute';
          clonedContent.style.left = '0';
          clonedContent.style.top = '0';
          clonedContent.style.backgroundColor = '#ffffff';
          clonedContent.style.color = '#000000';
        }
      }
    }).then(canvas => {
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      document.body.removeChild(contentClone);
      resolve(texture);
    }).catch(error => {
      console.error('Error al crear la textura HTML:', error);
      document.body.removeChild(contentClone);
      reject(error);
    });
  });
}

// Crear marco individual
function createFrame(width, height, index) {
  const frame = new THREE.Group();

  // Marco exterior
  const frameGeometry = new THREE.BoxGeometry(width, height, 0.1);
  const frameMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0x333333,
    shininess: 30,
  });
  const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
  frameMesh.castShadow = true;
  frameMesh.receiveShadow = true;
  frame.add(frameMesh);

  // Superficie del marco
  const surfaceGeometry = new THREE.PlaneGeometry(width - 0.2, height - 0.2);
  const surfaceMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });
  const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  surface.position.z = 0.051;
  frame.add(surface);

  // Crear y aplicar textura
  createHTMLTexture(null, 512, 384, index)
    .then(texture => {
      surfaceMaterial.map = texture;
      surfaceMaterial.needsUpdate = true;
    })
    .catch(error => {
      console.error('Error al crear la textura inicial:', error);
    });

  return frame;
}

// Crear el buzón 3D
function createTrashCan() {
  // Grupo para el buzón
  trashCan = new THREE.Group();
  trashCan.position.set(3, -0.7, 1.8);
  scene.add(trashCan);
  
  // Cuerpo principal del buzón
  const bodyGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.4);
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x444444,
    specular: 0x222222,
    shininess: 30
  });
  
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  trashCan.add(body);
  
  // Ranura para cartas
  const slotGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.05);
  const slotMaterial = new THREE.MeshPhongMaterial({
    color: 0x222222,
    specular: 0x111111,
    shininess: 50
  });
  
  const slot = new THREE.Mesh(slotGeometry, slotMaterial);
  slot.position.y = 0.2;
  slot.position.z = 0.21;
  trashCan.add(slot);
  
  // Tapa del buzón
  const lidGeometry = new THREE.BoxGeometry(0.45, 0.1, 0.45);
  const lidMaterial = new THREE.MeshPhongMaterial({
    color: 0x333333,
    specular: 0x111111,
    shininess: 50
  });
  
  const lid = new THREE.Mesh(lidGeometry, lidMaterial);
  lid.position.y = 0.45;
  lid.castShadow = true;
  trashCan.add(lid);
  
  // Símbolo de correo en el frente
  const mailSymbolGeometry = new THREE.CircleGeometry(0.1, 32);
  const mailSymbolMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
  });
  
  const mailSymbol = new THREE.Mesh(mailSymbolGeometry, mailSymbolMaterial);
  mailSymbol.position.set(0, 0, 0.21);
  mailSymbol.rotation.x = Math.PI / 2;
  trashCan.add(mailSymbol);
  
  // Hacer el buzón interactivo
  trashCan.userData = { clickable: true, type: 'trashCan' };
}

// Crear el suelo
function createFloor() {
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  const floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0
  });
  
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = Math.PI / 2;
  floor.position.y = -1.2;
  floor.receiveShadow = true;
  scene.add(floor);
  
  // Añadir cuadrícula para efecto visual
  const gridHelper = new THREE.GridHelper(30, 30 , 0x444444, 0x222222);
  gridHelper.position.y = -1.19;
  scene.add(gridHelper);

  // --- PAREDES NEGRAS CON BORDE NEÓN ---
  const wallHeight = 4;
  const wallThickness = 0.3;
  const wallLength = 30;
  const wallY = wallHeight / 2 - 1.2; // Centrado sobre el suelo

  // Material oscuro para la pared
  const wallMaterial = new THREE.MeshPhongMaterial({
    color: 0x444233,
    shininess: 80,
    specular: 0x00ff88 // Le da un toque neón en reflejos
  });

  // Material neón para el borde superior
  const neonMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    emissive: 0x00ff88,
    emissiveIntensity: 1,
  });

  // Crear las 4 paredes
  const wallPositions = [
    { x: 0, z: wallLength/2, rot: 0 }, // Norte
    { x: 0, z: -wallLength/2, rot: 0 }, // Sur
    { x: wallLength/2, z: 0, rot: Math.PI/2 }, // Este
    { x: -wallLength/2, z: 0, rot: Math.PI/2 }, // Oeste
  ];

  wallPositions.forEach(pos => {
    // Pared principal
    const wallGeometry = new THREE.BoxGeometry(wallLength, wallHeight, wallThickness);
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(pos.x, wallY, pos.z);
    wall.rotation.y = pos.rot;
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);

    // Borde neón superior
    const neonGeometry = new THREE.BoxGeometry(wallLength, 0.1, wallThickness + 0.05);
    const neon = new THREE.Mesh(neonGeometry, neonMaterial);
    neon.position.set(pos.x, wallY + wallHeight/2 - 0.05, pos.z);
    neon.rotation.y = pos.rot;
    scene.add(neon);
  });
}

// Manejar el redimensionamiento de la ventana
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Manejar el movimiento del ratón
function onMouseMove(event) {
  // Actualizar la posición del ratón
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Actualizar el raycaster
  mouse.x = mousePosition.x;
  mouse.y = mousePosition.y;
  raycaster.setFromCamera(mouse, camera);
  
  // Verificar intersecciones con objetos clickeables
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  // Cambiar el cursor si se encuentra una intersección con un objeto clickeable
  document.body.style.cursor = 'default';
  isTrashHovered = false;
  
  for (let i = 0; i < intersects.length; i++) {
    let object = intersects[i].object;
    
    // Buscar un objeto clickeable en la jerarquía
    while (object && !object.userData?.clickable) {
      object = object.parent;
    }
    
    if (object && object.userData?.clickable) {
      document.body.style.cursor = 'pointer';
      
      if (object.userData.type === 'trashCan') {
        isTrashHovered = true;
        
        // Efecto de resaltado
        object.children.forEach(child => {
          if (child.material && !child.userData.originalColor) {
            child.userData.originalColor = child.material.color.clone();
            child.material.color.set(0x00ff88);
          }
        });
      }
      break;
    }
  }
  
  // Restaurar colores si no está hover
  if (!isTrashHovered && trashCan) {
    trashCan.children.forEach(child => {
      if (child.material && child.userData.originalColor) {
        child.material.color.copy(child.userData.originalColor);
        delete child.userData.originalColor;
      }
    });
  }
}

// lineas de neutroon
function createConnectionLines() {
  // Grupo para las líneas
  const linesGroup = new THREE.Group();
  scene.add(linesGroup);
  
  // Material para las líneas con efecto brillante
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  
  // Crear 4 líneas que conectan las esquinas inferiores del cubo con el suelo
  const cubeSize = 2.5;
  const cubeY = 1; // Altura del cubo
  const floorY = -1.2; // Altura del suelo
  
  // Puntos para las cuatro esquinas inferiores del cubo
  const cornerPositions = [
    new THREE.Vector3(cubeSize/2, cubeY - cubeSize/2, cubeSize/2),
    new THREE.Vector3(cubeSize/2, cubeY - cubeSize/2, -cubeSize/2),
    new THREE.Vector3(-cubeSize/2, cubeY - cubeSize/2, cubeSize/2),
    new THREE.Vector3(-cubeSize/2, cubeY - cubeSize/2, -cubeSize/2)
  ];
  
  // Crear las líneas
  cornerPositions.forEach((cornerPos) => {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      cornerPos,
      new THREE.Vector3(cornerPos.x * 1.5, floorY, cornerPos.z * 1.5) // Punto en el suelo
    ]);
    
    const line = new THREE.Line(lineGeometry, lineMaterial);
    linesGroup.add(line);
  });
  
  // Línea vertical central para darle un punto de anclaje
  const centerLineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, cubeY, 0),
    new THREE.Vector3(0, floorY, 0)
  ]);
  
  const centerLine = new THREE.Line(centerLineGeometry, lineMaterial);
  linesGroup.add(centerLine);
  
  // Animar las líneas
  const animateLines = () => {
    linesGroup.children.forEach((line, index) => {
      const material = line.material;
      // Pulso de opacidad en las líneas
      material.opacity = 0.3 + Math.sin(Date.now() * 0.002 + index * 0.5) * 0.3;
    });
    
    requestAnimationFrame(animateLines);
  };
  
  animateLines();
  
  return linesGroup;
}

// Manejar los clics del ratón
function onMouseClick(event) {
  // Actualizar el raycaster
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  
  // Verificar intersecciones con objetos clickeables
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  for (let i = 0; i < intersects.length; i++) {
    let object = intersects[i].object;
    while (object && !object.userData?.clickable) {
      object = object.parent;
    }
    
    if (object && object.userData?.clickable) {
      if (object.userData.type === 'trashCan') {
        // Animación de tirar a la basura
        animateTrashAction();
      }
      break;
    }
  }
}
// Animar la acción del buzón y rotar el cubo
function animateTrashAction() {
  // Animación de la tapa abriéndose
  const lid = trashCan.children[2];
  const originalRotation = lid.rotation.x;
  
  // Obtener referencia al grupo del cubo
  const cubeGroup = frames[0].parent;
  const currentRotation = cubeGroup.rotation.y;
  
  // Animación de apertura de la tapa
  let openingTime = 0;
  const animateOpening = () => {
    openingTime += 0.1; // Velocidad rápida de apertura
    lid.rotation.x = originalRotation + Math.sin(openingTime) * 0.5;
    
    if (openingTime < Math.PI) {
      requestAnimationFrame(animateOpening);
    } else {
      // Restaurar la rotación después de completar la animación
      setTimeout(() => {
        let closingTime = Math.PI;
        const animateClosing = () => {
          closingTime -= 0.15; // Velocidad rápida de cierre
          lid.rotation.x = originalRotation + Math.sin(closingTime) * 0.5;
          
          if (closingTime > 0) {
            requestAnimationFrame(animateClosing);
          } else {
            lid.rotation.x = originalRotation;
          }
        };
        animateClosing();
        
        // Rotar el cubo a la siguiente cara (90 grados)
        const targetRotation = currentRotation + Math.PI/2;
        let rotationTime = 0;
        const animateRotation = () => {
          rotationTime += 0.02; // Aumentamos la velocidad de rotación
          const progress = Math.sin(rotationTime * Math.PI/2);
          
          if (rotationTime <= 1) {
            cubeGroup.rotation.y = currentRotation + (targetRotation - currentRotation) * progress;
            requestAnimationFrame(animateRotation);
          } else {
            cubeGroup.rotation.y = targetRotation;
          }
        };
        animateRotation();
      }, 100);
    }
  };
  
  animateOpening();
}
// Animación principal
function animate() {
  requestAnimationFrame(animate);
  
  // Llamar a la función de la cámara en moto
  camaraenmoto();
  
  // Actualizar controles de órbita
  controls.update();
  
  // Rotación suave del cubo con una velocidad más constante
  // if (frames.length > 0) {
  //   const cubeGroup = frames[0].parent;
  //   cubeGroup.rotation.y += 0.001; // Reducida la velocidad de rotación
  //   cubeGroup.rotation.x = Math.sin(Date.now() * 0.0003) * 0.05; // Reducida la amplitud de oscilación
  // }
  
  
  // Animación suave del bote de basura con menos frecuencia
  if (trashCan) {
    trashCan.rotation.y = Math.sin(Date.now() * 0.0005) * 0.01; // Reducida la velocidad y amplitud
  }
  
  // Animación sutil de los árboles (balanceo suave)
  trees.forEach((tree, index) => {
    if (tree) {
      const swayAmount = 0.02;
      const swaySpeed = 0.001;
      tree.rotation.z = Math.sin(Date.now() * swaySpeed + index * Math.PI / 2) * swayAmount;
    }
  });
  // Efectos adicionales de animación
  if (frames.length > 0) {
    const cubeGroup = frames[0].parent;
    
    // Efecto de "respiración" para el cubo - sutilmente pulsante
    const pulseScale = 1 + Math.sin(Date.now() * 0.001) * 0.01;
    cubeGroup.scale.set(pulseScale, pulseScale, pulseScale);
    
    // Movimiento suave (flotación)
    cubeGroup.position.y = 5 + Math.sin(Date.now() * 0.0005) * 0.2;
  }
  updateMotorcycle();
  renderer.render(scene, camera);
}

// Esperar a que todo esté cargado antes de inicializar
window.addEventListener('DOMContentLoaded', () => {
  console.log("Documento cargado, verificando Three.js...");
  
  // Verificar si THREE está disponible
  if (typeof THREE === 'undefined') {
    console.error("THREE.js no encontrado, cargando desde CDN...");
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      console.log("THREE.js cargado correctamente desde CDN");
      init();
    };
    script.onerror = () => {
      console.error("Error al cargar THREE.js desde CDN");
      document.body.innerHTML += '<p style="color: white; position: absolute; top: 10px; left: 10px;">Error al cargar THREE.js. Por favor, verifica tu conexión a internet.</p>';
    };
    document.head.appendChild(script);
  } else {
    console.log("THREE.js ya está disponible");
    init();
  }
});

// Crear un CSS básico si no existe
(() => {
  if (!document.querySelector('link[href="cs.css"]')) {
    console.log("Creando CSS básico...");
    const style = document.createElement('style');
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #1e2130;
        color: #fff;
        font-family: 'IBM Plex Mono', monospace;
      }
      
      .container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        width: 80%;
        max-width: 800px;
        pointer-events: all;
      }
      
      .skills-container {
        display: none;
      }
      
      .skills-container.active {
        display: block;
      }
      
      .skill-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }
      
      .skill-card {
        text-align: center;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
      }
    `;
    document.head.appendChild(style);
  }
})();



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
  controls.dampingFactor = 1.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 20;
  controls.maxPolarAngle = Math.PI / 0;
  controls.minPolarAngle = Math.PI / 30;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 1;
  controls.enabled = true;

  // Añadir elementos a la escena
  addLights();
  createFrames();
  createTrashCan();
  createFloor();
  createLamp();
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

// Crear la moto
function createMotorcycle() {
  // Grupo principal de la moto
  motorcycle = new THREE.Group();
  motorcycle.position.set(0, 0, -5);
  scene.add(motorcycle);

  // Materiales
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a1a1a,
    specular: 0x00ff88,
    shininess: 100,
    emissive: 0x00ff88,
    emissiveIntensity: 0.2
  });

  const detailMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff88,
    emissive: 0x00ff88,
    emissiveIntensity: 0.8,
    specular: 0xffffff,
    shininess: 100
  });

  const wheelMaterial = new THREE.MeshPhongMaterial({
    color: 0x111111,
    specular: 0x00ff88,
    shininess: 50,
    emissive: 0x00ff88,
    emissiveIntensity: 0.1
  });

  // Cuerpo principal de la moto (más aerodinámico y minimalista)
  const bodyGeometry = new THREE.BoxGeometry(0.8, 0.3, 2.5);
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.4;
  body.castShadow = true;
  motorcycle.add(body);

  // Detalles del cuerpo con líneas neón
  const bodyDetailGeometry = new THREE.BoxGeometry(0.82, 0.05, 2.52);
  const bodyDetail = new THREE.Mesh(bodyDetailGeometry, detailMaterial);
  bodyDetail.position.y = 0.4;
  motorcycle.add(bodyDetail);

  // Ruedas con diseño futurista
  const wheelRadius = 0.4;
  const wheelThickness = 0.15;

  // Rueda delantera con detalles neón
  const frontWheelGeometry = new THREE.CylinderGeometry(
    wheelRadius, wheelRadius, wheelThickness, 32
  );
  
  frontWheelGeometry.rotateZ(Math.PI / 2);
  const frontWheel = new THREE.Mesh(frontWheelGeometry, wheelMaterial);
  frontWheel.position.set(0, 0.3, 0.8);
  frontWheel.castShadow = true;
  motorcycle.add(frontWheel);

  // Rueda trasera con detalles neón
  const backWheelGeometry = new THREE.CylinderGeometry(
    wheelRadius, wheelRadius, wheelThickness, 32
  );
  backWheelGeometry.rotateZ(Math.PI / 2);
  const backWheel = new THREE.Mesh(backWheelGeometry, wheelMaterial);
  backWheel.position.set(0, 0.3, -0.8);
  backWheel.castShadow = true;
  motorcycle.add(backWheel);

  // Detalles de las llantas con efecto neón
  const wheelDetailGeometry = new THREE.TorusGeometry(0.3, 0.03, 16, 32);
  
  const frontWheelDetail = new THREE.Mesh(wheelDetailGeometry, detailMaterial);
  frontWheelDetail.position.set(0, 0.3, 0.8);
  frontWheelDetail.rotation.y = Math.PI / 2;
  motorcycle.add(frontWheelDetail);
  
  const backWheelDetail = new THREE.Mesh(wheelDetailGeometry, detailMaterial);
  backWheelDetail.position.set(0, 0.3, -0.8);
  backWheelDetail.rotation.y = Math.PI / 2;
  motorcycle.add(backWheelDetail);

  // Luces futuristas
  const headlightGeometry = new THREE.SphereGeometry(0.12, 16, 16);
  const headlightMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x00ff88,
    emissiveIntensity: 1,
    specular: 0xffffff,
    shininess: 100
  });
  const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
  headlight.position.set(0, 0.4, 1.2);
  motorcycle.add(headlight);

  const tailLightGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const tailLightMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 1,
    specular: 0xffffff,
    shininess: 100
  });
  const tailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
  tailLight.position.set(0, 0.4, -1.2);
  motorcycle.add(tailLight);

  // Luz del faro con efecto neón
  const headlightSpot = new THREE.SpotLight(0x00ff88, 3, 15, Math.PI / 6, 0.5, 1);
  headlightSpot.position.set(0, 0.4, 1.2);
  headlightSpot.target.position.set(0, 0, 5);
  motorcycle.add(headlightSpot);
  motorcycle.add(headlightSpot.target);

  // Configurar sombras
  headlightSpot.castShadow = true;
  headlightSpot.shadow.mapSize.width = 1024;
  headlightSpot.shadow.mapSize.height = 1024;
  headlightSpot.shadow.camera.near = 0.5;
  headlightSpot.shadow.camera.far = 15;

  // Efectos visuales mejorados
  createMotorcycleTrail();
  createExhaustParticles();

  return motorcycle;
}

// Crear estela de la moto
function createMotorcycleTrail() {
  // Material para la estela con efecto neón
  const trailMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });

  // Geometría de la estela
  const trailGeometry = new THREE.PlaneGeometry(0.15, 3);
  const trail = new THREE.Mesh(trailGeometry, trailMaterial);
  trail.position.set(0, 0.2, -2);
  trail.rotation.x = Math.PI / 2;
  motorcycle.add(trail);

  // Animar estela con efecto pulsante
  const animateTrail = () => {
    if (motorcycleControls.speed > 0.02) {
      trail.visible = true;
      trail.scale.y = Math.min(motorcycleControls.speed * 25, 6);
      trailMaterial.opacity = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
      trailMaterial.color.setHSL(0.3 + Math.sin(Date.now() * 0.001) * 0.1, 1, 0.5);
    } else {
      trail.visible = false;
    }
    
    requestAnimationFrame(animateTrail);
  };
  
  animateTrail();
}

// Crear partículas de escape
function createExhaustParticles() {
  const exhaustGeometry = new THREE.SphereGeometry(0.06, 16, 16);
  const exhaustMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
  exhaust.position.set(0.2, 0.4, -1);
  motorcycle.add(exhaust);
  
  // Animar escape con efectos mejorados
  const animateExhaust = () => {
    if (motorcycleControls.speed > 0.02) {
      exhaust.visible = true;
      const scale = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
      exhaust.scale.set(scale, scale, scale);
      exhaustMaterial.opacity = 0.4 + Math.sin(Date.now() * 0.02) * 0.3;
      exhaustMaterial.color.setHSL(0.3 + Math.sin(Date.now() * 0.002) * 0.1, 1, 0.5);
    } else {
      exhaust.visible = false;
    }
    
    requestAnimationFrame(animateExhaust);
  };
  
  animateExhaust();
}

// Posicionar cámara en la moto
function camaraenmoto() {
  if (!motorcycle) return;

  controls.enabled = false;

  // Offset relativo a la orientación de la moto (atrás y arriba)
  const offset = new THREE.Vector3(0, 1.2, -1.8); // Y: altura, Z: atrás (negativo)
  offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), motorcycle.rotation.y); // Aplica la rotación de la moto

  // Nueva posición de la cámara
  const cameraPosition = motorcycle.position.clone().add(offset);
  camera.position.copy(cameraPosition);

  // Mira hacia adelante de la moto (un poco más arriba para mejor vista)
  const lookAtOffset = new THREE.Vector3(0, 1, 2);
  lookAtOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), motorcycle.rotation.y);
  const lookAt = motorcycle.position.clone().add(lookAtOffset);
  camera.lookAt(lookAt);

  camera.updateMatrix();
}

// Inicializar controles de la moto
function initMotorcycleControls() {
  window.addEventListener('keydown', (event) => {
    switch(event.key) {
      case 'ArrowUp':
      case 'w':
        motorcycleControls.forward = true;
        break;
      case 'ArrowDown':
      case 's':
        motorcycleControls.backward = true;
        break;
      case 'ArrowLeft':
      case 'a':
        motorcycleControls.left = true;
        break;
      case 'ArrowRight':
      case 'd':
        motorcycleControls.right = true;
        break;
      case ' ': // Espacio para frenar
        motorcycleControls.speed *= 0.9;
        break;
    }
  });

  window.addEventListener('keyup', (event) => {
    switch(event.key) {
      case 'ArrowUp':
      case 'w':
        motorcycleControls.forward = false;
        break;
      case 'ArrowDown':
      case 's':
        motorcycleControls.backward = false;
        break;
      case 'ArrowLeft':
      case 'a':
        motorcycleControls.left = false;
        break;
      case 'ArrowRight':
      case 'd':
        motorcycleControls.right = false;
        break;
    }
  });
}

// Actualizar movimiento de la moto
function updateMotorcycle() {
  if (!motorcycle) return;

  // Parámetros de movimiento
  const acceleration = 0.0005;
  const deceleration = 0.99;
  const maxSpeed = 0.5;
  const rotationAcceleration = 0.003;
  const maxRotationSpeed = 0.05;

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
    -maxSpeed * 1.5 
  );

  // Girar
  if (motorcycleControls.left) {
    motorcycleControls.rotationSpeed += rotationAcceleration;
  } else if (motorcycleControls.right) {
    motorcycleControls.rotationSpeed -= rotationAcceleration;
  } else {
    motorcycleControls.rotationSpeed *= 0.95;
  }

  // Limitar velocidad de giro
  motorcycleControls.rotationSpeed = Math.max(
    Math.min(motorcycleControls.rotationSpeed, maxRotationSpeed),
    -maxRotationSpeed
  );

  // Aplicar rotación
  motorcycle.rotation.y += motorcycleControls.rotationSpeed;

  // Calcular dirección
  const moveX = Math.sin(motorcycle.rotation.y) * motorcycleControls.speed;
  const moveZ = Math.cos(motorcycle.rotation.y) * motorcycleControls.speed;

  // Mover moto
  motorcycle.position.x += moveX;
  motorcycle.position.z -= moveZ;

  // Inclinación en curvas
  const leanAmount = motorcycleControls.rotationSpeed * 10;
  motorcycle.rotation.z = -leanAmount;

  // Animar ruedas
  if (motorcycle.children) {
    const frontWheel = motorcycle.children[3];
    const backWheel = motorcycle.children[4];
    
    if (frontWheel && backWheel) {
      const wheelSpeed = motorcycleControls.speed * 10;
      frontWheel.rotation.x += wheelSpeed;
      backWheel.rotation.x += wheelSpeed;
    }
  }

  // Limitar área de movimiento
  const boundaryLimit = 12;
  if (Math.abs(motorcycle.position.x) > boundaryLimit) {
    motorcycle.position.x = Math.sign(motorcycle.position.x) * boundaryLimit;
  }
  if (Math.abs(motorcycle.position.z) > boundaryLimit) {
    motorcycle.position.z = Math.sign(motorcycle.position.z) * boundaryLimit;
  }
}

function contador(){
  const contador = new THREE.Group();
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
  const contadorMesh = new THREE.Mesh(geometry, material);
  contador.position.set(0, 0, 5);

  
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
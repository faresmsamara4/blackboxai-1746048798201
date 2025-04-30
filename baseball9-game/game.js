const container = document.getElementById('game-container');
const inningEl = document.getElementById('inning');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('game-message');

let scene, camera, renderer, controls;
let field, players = [], ball, bat;
let inning = 1;
let score = [0, 0];
let gamePhase = 'pitching'; // pitching, batting, fielding

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1e3a1e);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 100, 200);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(100, 200, 100);
  scene.add(directionalLight);

  // Field (green plane)
  const fieldGeometry = new THREE.PlaneGeometry(200, 200);
  const fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x2f6f2f });
  field = new THREE.Mesh(fieldGeometry, fieldMaterial);
  field.rotation.x = -Math.PI / 2;
  scene.add(field);

  // Bases (white squares)
  const baseGeometry = new THREE.BoxGeometry(10, 1, 10);
  const baseMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const bases = [];
  const basePositions = [
    new THREE.Vector3(0, 0.5, 75),   // Home plate
    new THREE.Vector3(75, 0.5, 0),   // 1st base
    new THREE.Vector3(0, 0.5, -75),  // 2nd base
    new THREE.Vector3(-75, 0.5, 0),  // 3rd base
  ];
  basePositions.forEach(pos => {
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.copy(pos);
    scene.add(base);
    bases.push(base);
  });

  // Players (simple humanoid shapes)
  const playerGeometry = new THREE.CylinderGeometry(5, 5, 20, 8);
  const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
  for (let i = 0; i < 5; i++) {
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set((i - 2) * 30, 10, 0);
    scene.add(player);
    players.push(player);
  }

  // Ball (small white sphere)
  const ballGeometry = new THREE.SphereGeometry(3, 16, 16);
  const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0, 3, 70);
  scene.add(ball);

  // Bat (brown cylinder)
  const batGeometry = new THREE.CylinderGeometry(1, 1, 30, 8);
  const batMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
  bat = new THREE.Mesh(batGeometry, batMaterial);
  bat.position.set(0, 15, 80);
  bat.rotation.z = Math.PI / 2;
  scene.add(bat);

  window.addEventListener('resize', onWindowResize, false);

  updateGameInfo();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // TODO: Add game logic and animations here

  renderer.render(scene, camera);
}

function updateGameInfo() {
  inningEl.textContent = inning;
  scoreEl.textContent = `${score[0]} - ${score[1]}`;
  messageEl.textContent = `Phase: ${gamePhase}`;
}

init();
animate();

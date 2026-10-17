import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const $ = (id) => document.getElementById(id);
const START_NG = 'https://start.ng';
const LANES = [-2.35, 0, 2.35];
const scene = new THREE.Scene();
scene.background = new THREE.Color('#080d18');
scene.fog = new THREE.Fog('#080d18', 18, 78);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, .1, 120);
camera.position.set(0, 6.1, 11.5);
camera.lookAt(0, 1.15, -10);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.outputColorSpace = THREE.SRGBColorSpace;
$('game').append(renderer.domElement);

scene.add(new THREE.HemisphereLight('#b5d3ff', '#101521', 2.1));
const keyLight = new THREE.DirectionalLight('#d5faff', 3.2);
keyLight.position.set(-4, 10, 7); keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024); scene.add(keyLight);
const pinkLight = new THREE.PointLight('#ff326e', 26, 30); pinkLight.position.set(-7, 2, -14); scene.add(pinkLight);
const blueLight = new THREE.PointLight('#2b58ff', 30, 36); blueLight.position.set(8, 4, -22); scene.add(blueLight);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 140), new THREE.MeshStandardMaterial({ color: '#111a2d', roughness: .84, metalness: .16 }));
floor.rotation.x = -Math.PI / 2; floor.position.set(0, -.04, -38); floor.receiveShadow = true; scene.add(floor);
const grid = new THREE.GridHelper(200, 50, '#265277', '#15223a'); grid.position.set(0, .015, -35); grid.scale.z = .72; scene.add(grid);
const laneLines = [];
for (const x of [-1.18, 1.18]) {
  const line = new THREE.Mesh(new THREE.BoxGeometry(.018, .012, 90), new THREE.MeshBasicMaterial({ color: '#47f6dc', transparent: true, opacity: .48 }));
  line.position.set(x, .025, -36); scene.add(line); laneLines.push(line);
}
const edgeLights = [];
for (const side of [-1, 1]) for (let i = 0; i < 17; i++) {
  const light = new THREE.Mesh(new THREE.BoxGeometry(.09, .045, .72), new THREE.MeshBasicMaterial({ color: side < 0 ? '#ff477e' : '#47f6dc', toneMapped: false }));
  light.position.set(side * 5.25, .035, 3 - i * 4.8); scene.add(light); edgeLights.push(light);
}
// Distant skyline keeps the horizon legible while adding a little neon depth.
for (let i = 0; i < 28; i++) {
  const h = 3 + Math.random() * 11, x = (i % 2 ? 1 : -1) * (8 + Math.floor(i / 2) * .9);
  const building = new THREE.Mesh(new THREE.BoxGeometry(1.4 + Math.random() * 2, h, 2 + Math.random() * 3), new THREE.MeshStandardMaterial({ color: i % 3 ? '#101a30' : '#18213c', roughness: .6, metalness: .3, emissive: i % 3 ? '#060b16' : '#11112b', emissiveIntensity: .8 }));
  building.position.set(x, h / 2 - .04, -24 - Math.random() * 48); scene.add(building);
}

const mat = (color, metalness = .1, roughness = .6, emissive = null) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...(emissive ? { emissive: color, emissiveIntensity: emissive } : {}) });
const skinFallback = '#b77b5e', topFallback = '#e65062', pantsFallback = '#294e91', hairFallback = '#25212b';
const character = new THREE.Group(); scene.add(character);
const parts = {};
function addPart(name, geometry, material, parent = character, pos = [0, 0, 0]) {
  const m = new THREE.Mesh(geometry, material); m.name = name; m.position.set(...pos); m.castShadow = true; m.receiveShadow = true; parent.add(m); parts[name] = m; return m;
}
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
addPart('torso', box(.76, .82, .42), mat(topFallback, .35, .38), character, [0, 1.48, 0]);
addPart('chestPlate', box(.45, .16, .035), mat('#c9f9f5', .78, .2, .15), character, [0, 1.55, -.23]);
addPart('belt', box(.79, .13, .44), mat('#0a1421', .55, .35), character, [0, 1.02, 0]);
addPart('head', new THREE.BoxGeometry(.57, .55, .53, 1, 1, 1), mat(skinFallback, .18, .5), character, [0, 2.18, -.015]);
addPart('face', box(.37, .24, .035), mat('#11192b', .7, .23), character, [0, 2.17, -.29]);
addPart('eyeL', new THREE.BoxGeometry(.08, .045, .025), mat('#47f6dc', .2, .16, 2.2), character, [-.095, 2.19, -.316]);
addPart('eyeR', new THREE.BoxGeometry(.08, .045, .025), mat('#47f6dc', .2, .16, 2.2), character, [.095, 2.19, -.316]);
const armL = new THREE.Group(); armL.position.set(-.49, 1.78, 0); character.add(armL);
const armR = new THREE.Group(); armR.position.set(.49, 1.78, 0); character.add(armR);
addPart('arm', box(.24, .66, .3), mat(topFallback, .28, .4), armL, [0, -.35, 0]); addPart('hand', new THREE.SphereGeometry(.145, 10, 8), mat(skinFallback, .2, .45), armL, [0, -.73, 0]);
addPart('arm', box(.24, .66, .3), mat(topFallback, .28, .4), armR, [0, -.35, 0]); addPart('hand', new THREE.SphereGeometry(.145, 10, 8), mat(skinFallback, .2, .45), armR, [0, -.73, 0]);
const legL = new THREE.Group(); legL.position.set(-.21, .98, 0); character.add(legL);
const legR = new THREE.Group(); legR.position.set(.21, .98, 0); character.add(legR);
addPart('leg', box(.29, .61, .35), mat(pantsFallback, .3, .5), legL, [0, -.34, 0]); addPart('boot', box(.36, .19, .52), mat('#101722', .55, .35), legL, [0, -.69, -.08]);
addPart('leg', box(.29, .61, .35), mat(pantsFallback, .3, .5), legR, [0, -.34, 0]); addPart('boot', box(.36, .19, .52), mat('#101722', .55, .35), legR, [0, -.69, -.08]);
// Decorative seams make the synced clothes visible at runner scale.
addPart('beltLight', box(.18, .05, .025), mat('#47f6dc', .2, .15, 1.8), character, [0, 1.02, -.23]);
const hairRoot = new THREE.Group(); character.add(hairRoot); parts.hairRoot = hairRoot;
const hatRoot = new THREE.Group(); character.add(hatRoot); parts.hatRoot = hatRoot;
const accessoryRoot = new THREE.Group(); character.add(accessoryRoot); parts.accessoryRoot = accessoryRoot;
const makeMesh = (geo, material, parent, pos) => { const m = new THREE.Mesh(geo, material); m.position.set(...pos); m.castShadow = true; parent.add(m); return m; };
let style = {};
function clearGroup(g) { while (g.children.length) { const c = g.children.pop(); c.parent = null; } }
function colorizeStyle(s = {}) {
  style = s;
  const top = /^#[0-9a-f]{6}$/i.test(s.primaryColor) ? s.primaryColor : topFallback;
  const pants = /^#[0-9a-f]{6}$/i.test(s.secondaryColor) ? s.secondaryColor : pantsFallback;
  const skin = /^#[0-9a-f]{6}$/i.test(s.skinColor) ? s.skinColor : skinFallback;
  const hairColor = /^#[0-9a-f]{6}$/i.test(s.hairColor) ? s.hairColor : hairFallback;
  parts.torso.material.color.set(top);
  for (const arm of [armL, armR]) arm.children.find((child) => child.name === 'arm').material.color.set(top);
  for (const n of ['leg']) parts[n].material.color.set(pants);
  for (const n of ['head', 'hand']) parts[n].material.color.set(skin);
  clearGroup(hairRoot); clearGroup(hatRoot); clearGroup(accessoryRoot);
  const hairMat = mat(hairColor, .08, .76);
  const hair = ['short', 'afro', 'braids', 'bun', 'ponytail', 'dreads'].includes(s.hair) ? s.hair : 'short';
  if (hair !== 'bald') {
    if (hair === 'afro') makeMesh(new THREE.SphereGeometry(.37, 12, 9), hairMat, hairRoot, [0, 2.48, .01]);
    else {
      makeMesh(box(.6, .12, .56), hairMat, hairRoot, [0, 2.47, 0]);
      if (hair === 'braids' || hair === 'dreads') for (const x of [-.24, -.08, .08, .24]) makeMesh(new THREE.CylinderGeometry(.035, .045, .55, 6), hairMat, hairRoot, [x, 2.18, .19]);
      if (hair === 'bun') makeMesh(new THREE.SphereGeometry(.13, 9, 7), hairMat, hairRoot, [0, 2.5, .29]);
      if (hair === 'ponytail') makeMesh(new THREE.CylinderGeometry(.055, .075, .42, 7), hairMat, hairRoot, [0, 2.23, .32]);
    }
  }
  const hat = ['cap', 'beanie', 'tophat', 'crown'].includes(s.hat) ? s.hat : 'none';
  if (hat === 'cap') { makeMesh(box(.62, .15, .59), mat(top), hatRoot, [0, 2.53, 0]); makeMesh(box(.48, .045, .27), mat(top), hatRoot, [0, 2.48, -.35]); }
  if (hat === 'beanie') { makeMesh(new THREE.SphereGeometry(.34, 12, 8), mat(top), hatRoot, [0, 2.48, .01]); makeMesh(box(.59, .1, .54), mat(top), hatRoot, [0, 2.43, 0]); }
  if (hat === 'tophat') { makeMesh(box(.65, .08, .61), mat('#182033', .4), hatRoot, [0, 2.48, .01]); makeMesh(new THREE.CylinderGeometry(.21, .24, .42, 8), mat('#182033', .4), hatRoot, [0, 2.7, .01]); }
  if (hat === 'crown') { const crown = makeMesh(new THREE.CylinderGeometry(.19, .28, .24, 5), mat('#f3c85e', .7, .22), hatRoot, [0, 2.59, .01]); crown.rotation.y = .3; }
  if (s.accessory === 'glasses') { makeMesh(box(.49, .075, .055), mat('#dffbff', .65, .2), accessoryRoot, [0, 2.2, -.32]); }
  if (s.accessory === 'earrings') for (const x of [-.32, .32]) makeMesh(new THREE.TorusGeometry(.065, .016, 5, 10), mat('#f3c85e', .7, .2), accessoryRoot, [x, 2.03, -.01]);
  if (s.accessory === 'beard') makeMesh(new THREE.SphereGeometry(.21, 10, 7, 0, Math.PI * 2, .4, 1.8), hairMat, accessoryRoot, [0, 1.98, -.04]);
  if (s.accessory === 'scarf') { makeMesh(box(.69, .16, .48), mat(top), accessoryRoot, [0, 1.9, 0]); makeMesh(box(.15, .43, .12), mat(top), accessoryRoot, [.2, 1.64, -.19]); }
  if (s.accessory === 'backpack') makeMesh(box(.46, .56, .22), mat(pants), accessoryRoot, [0, 1.47, .31]);
  // Male/female silhouettes are a small proportion variation, while colors and items remain style-led.
  const female = s.body === 'female'; parts.torso.scale.x = female ? .88 : 1; parts.head.scale.setScalar(1);
  character.userData.bodyType = female ? 'female' : 'male';
}
colorizeStyle({});

let player = null, guest = { name: 'Guest', style: {}, face: null }, userId = null;
let framePromise;
function connectFrame() {
  if (!framePromise) framePromise = new Promise((resolve, reject) => {
    const el = document.createElement('iframe'); el.src = `${START_NG}/connect`; el.hidden = true;
    el.onload = () => resolve(el); el.onerror = reject; document.body.append(el);
  });
  return framePromise;
}
async function askStartNg(message, replyType, timeoutMs = 5000) {
  try {
    const el = await connectFrame();
    return await new Promise((resolve) => {
      const requestId = Math.random().toString(36).slice(2);
      const timer = setTimeout(() => done(null), timeoutMs);
      function done(reply) { clearTimeout(timer); removeEventListener('message', onMessage); resolve(reply); }
      function onMessage(e) { if (e.origin === START_NG && e.source === el.contentWindow && e.data?.type === replyType && e.data.requestId === requestId) done(e.data); }
      addEventListener('message', onMessage); el.contentWindow.postMessage({ ...message, requestId }, START_NG);
    });
  } catch { return null; }
}
function signIn() { location.href = `${START_NG}/?return_to=${encodeURIComponent(location.origin + location.pathname)}`; }
function applyPlayer(info) {
  player = info?.user ?? info?.guest ?? guest; userId = info?.user?.id ?? null;
  colorizeStyle(player.style ?? {});
  $('player-name').textContent = player.name || 'Guest';
  $('player-account').textContent = info?.user?.account ? `@${info.user.account}` : 'GUEST';
  $('sign-in').hidden = !!info?.user;
}
async function syncPlayer() { const info = await askStartNg({ type: 'startng:whoami' }, 'startng:user'); applyPlayer(info); }
$('sign-in').addEventListener('click', signIn);
syncPlayer();
document.addEventListener('visibilitychange', () => { if (!document.hidden) syncPlayer(); });
addEventListener('focus', syncPlayer);

const obstacles = [];
const obstacleGeo = new THREE.BoxGeometry(1.16, 1.35, .95);
const obstacleMaterials = [mat('#ff477e', .55, .26, .5), mat('#f3b84c', .5, .3, .38), mat('#aa5bff', .48, .3, .45)];
function spawnObstacle() {
  const lane = Math.floor(Math.random() * 3), m = new THREE.Mesh(obstacleGeo, obstacleMaterials[Math.floor(Math.random() * obstacleMaterials.length)]);
  m.position.set(LANES[lane], .66, -55); m.castShadow = true; m.receiveShadow = true; scene.add(m);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(obstacleGeo), new THREE.LineBasicMaterial({ color: '#fff2f8', transparent: true, opacity: .72 })); m.add(edge);
  obstacles.push({ mesh: m, lane, counted: false, hit: false });
}
const particles = [];
function burst() {
  for (let i = 0; i < 22; i++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(.08, .08, .08), new THREE.MeshBasicMaterial({ color: i % 2 ? '#47f6dc' : '#ff477e' }));
    p.position.copy(character.position).add(new THREE.Vector3((Math.random() - .5) * .7, 1 + Math.random(), -.3)); scene.add(p);
    particles.push({ mesh: p, v: new THREE.Vector3((Math.random() - .5) * 6, Math.random() * 5, (Math.random() - .5) * 4), life: .65 });
  }
}

let state = 'ready', laneIndex = 1, distance = 0, dodges = 0, speed = 17, spawnTimer = 0, jump = 0, jumpVelocity = 0;
let best = Number(localStorage.getItem('robot-dodge-best') || 0);
$('best').textContent = String(best).padStart(4, '0');
function startRun() {
  for (const o of obstacles) scene.remove(o.mesh); obstacles.length = 0;
  laneIndex = 1; distance = 0; dodges = 0; speed = 17; spawnTimer = .6; jump = 0; jumpVelocity = 0;
  character.position.set(0, 0, 1.5); state = 'playing';
  $('pace').textContent = 'x1.0'; $('distance').textContent = '0000';
  $('start-screen').hidden = true; $('end-screen').hidden = true; $('leaderboard-screen').hidden = true;
}
function stopRun() {
  state = 'ready'; laneIndex = 1; jump = 0; jumpVelocity = 0;
  for (const obstacle of obstacles) scene.remove(obstacle.mesh);
  obstacles.length = 0; distance = 0; dodges = 0; speed = 17;
  character.position.set(0, 0, 1.5); character.rotation.set(0, 0, 0);
  $('distance').textContent = '0000'; $('pace').textContent = 'x1.0';
  $('end-screen').hidden = true; $('leaderboard-screen').hidden = true; $('start-screen').hidden = false;
}
function finishRun() {
  if (state !== 'playing') return;
  state = 'over'; burst();
  const finalDistance = Math.floor(distance);
  if (finalDistance > best) { best = finalDistance; localStorage.setItem('robot-dodge-best', String(best)); }
  $('best').textContent = String(best).padStart(4, '0'); $('run-result').textContent = `Distance: ${finalDistance}m  ·  Obstacles dodged: ${dodges}`;
  $('end-screen').hidden = false;
  if (userId) askStartNg({ type: 'startng:score', stats: { distance: finalDistance, dodges } }, 'startng:scoreSaved', 6000);
}
function switchLane(delta) { if (state === 'playing') laneIndex = THREE.MathUtils.clamp(laneIndex + delta, 0, 2); }
function jumpNow() { if (state === 'playing' && jump <= 0) jumpVelocity = 8.2; }
addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(e.key)) e.preventDefault();
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') switchLane(-1);
  if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') switchLane(1);
  if (e.key === 'ArrowUp' || e.key === ' ') jumpNow();
  if ((e.key === 'Enter') && state !== 'playing') startRun();
});
let touchX = null;
renderer.domElement.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
renderer.domElement.addEventListener('touchend', (e) => {
  if (touchX === null) return; const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 28) switchLane(dx < 0 ? -1 : 1); else jumpNow(); touchX = null;
}, { passive: true });
$('start-button').addEventListener('click', startRun); $('restart-button').addEventListener('click', startRun); $('stop-button').addEventListener('click', stopRun);
$('leaderboard-button').addEventListener('click', async () => {
  $('leaderboard-screen').hidden = false; $('leaderboard-list').innerHTML = '<li class="muted">Loading…</li>';
  const reply = await askStartNg({ type: 'startng:leaderboard', limit: 10 }, 'startng:leaderboardData', 7000);
  const entries = reply?.entries ?? [];
  $('leaderboard-list').innerHTML = entries.length ? entries.map((entry, i) => `<li><span>${i + 1}. ${escapeHtml(entry.name || 'Runner')}</span> <span>${Number(entry.stats?.distance ?? entry.score ?? 0)}m</span></li>`).join('') : '<li class="muted">No runs yet. Be the first!</li>';
});
$('close-board').addEventListener('click', () => $('leaderboard-screen').hidden = true);
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }

const clock = new THREE.Clock(); let totalTime = 0;
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), .04); totalTime += dt;
  character.position.x = THREE.MathUtils.damp(character.position.x, LANES[laneIndex], 11, dt);
  if (state === 'playing') {
    distance += speed * dt * .72; speed = Math.min(29, speed + dt * .3); spawnTimer -= dt;
    if (spawnTimer <= 0) { spawnObstacle(); spawnTimer = Math.max(.64, 1.25 - (speed - 17) * .035) + Math.random() * .5; }
    jumpVelocity -= 21 * dt; jump = Math.max(0, jump + jumpVelocity * dt); if (jump === 0) jumpVelocity = Math.max(0, jumpVelocity);
    character.position.y = jump; character.rotation.z = THREE.MathUtils.damp(character.rotation.z, (LANES[laneIndex] - character.position.x) * -.055, 10, dt);
    for (const group of [armL, armR]) group.rotation.x = Math.sin(totalTime * 12) * .18;
    legL.rotation.x = Math.sin(totalTime * 12) * .35; legR.rotation.x = -legL.rotation.x;
    for (const obstacle of obstacles) {
      obstacle.mesh.position.z += speed * dt;
      if (obstacle.lane === laneIndex && Math.abs(obstacle.mesh.position.z - character.position.z) < .74 && jump < .48) { finishRun(); break; }
      if (!obstacle.counted && obstacle.mesh.position.z > character.position.z + .7) { obstacle.counted = true; dodges++; }
    }
    for (let i = obstacles.length - 1; i >= 0; i--) if (obstacles[i].mesh.position.z > 13) { scene.remove(obstacles[i].mesh); obstacles.splice(i, 1); }
    $('distance').textContent = String(Math.floor(distance)).padStart(4, '0');
    $('pace').textContent = `x${(speed / 17).toFixed(1)}`;
  } else {
    character.position.y = Math.sin(totalTime * 2) * .04;
    character.rotation.y = Math.sin(totalTime * .55) * .09;
    armL.rotation.z = Math.sin(totalTime * 1.5) * .04; armR.rotation.z = -armL.rotation.z;
  }
  for (const p of particles) { p.life -= dt; p.mesh.position.addScaledVector(p.v, dt); p.v.y -= 12 * dt; p.mesh.material.transparent = true; p.mesh.material.opacity = Math.max(0, p.life / .65); }
  for (let i = particles.length - 1; i >= 0; i--) if (particles[i].life <= 0) { scene.remove(particles[i].mesh); particles.splice(i, 1); }
  for (const light of edgeLights) { light.position.z += (state === 'playing' ? speed : 3) * dt; if (light.position.z > 5) light.position.z -= 81.6; }
  renderer.render(scene, camera);
}
animate();
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); });

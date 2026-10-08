/**
 * ==========================================================================
 * SQL 3D ODYSSEY // BABYLON.JS CORE ENGINE & INTERACTIVE RUNTIME
 * ==========================================================================
 */

class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playLaser() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + idx * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch (e) {}
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  playPulse() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(280, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }
}

// ==========================================================================
// MOCK DATA & RELATIONAL DATABASE ENGINE
// ==========================================================================

const DB_DATA = {
  starships: [
    { id: 1, name: "USS Enterprise", class: "Cruiser", warp_speed: 9.6, shields: 95 },
    { id: 2, name: "Millennium Falcon", class: "Freighter", warp_speed: 8.5, shields: 80 },
    { id: 3, name: "Razor Crest", class: "Gunship", warp_speed: 6.8, shields: 65 },
    { id: 4, name: "Normandy SR-2", class: "Frigate", warp_speed: 9.8, shields: 92 },
    { id: 5, name: "Battlestar Galactica", class: "Cruiser", warp_speed: 7.2, shields: 99 },
    { id: 6, name: "Slave I", class: "Patrol", warp_speed: 7.5, shields: 78 },
    { id: 7, name: "Discovery One", class: "Science", warp_speed: 5.4, shields: 50 },
    { id: 8, name: "Serenity", class: "Freighter", warp_speed: 6.2, shields: 40 }
  ],
  pilots: [
    { id: 101, name: "James T. Kirk", ship_id: 1, rank: "Captain" },
    { id: 102, name: "Han Solo", ship_id: 2, rank: "Smuggler" },
    { id: 103, name: "Din Djarin", ship_id: 3, rank: "Hunter" },
    { id: 104, name: "Commander Shepard", ship_id: 4, rank: "Spectre" },
    { id: 105, name: "William Adama", ship_id: 5, rank: "Admiral" },
    { id: 106, name: "Boba Fett", ship_id: 6, rank: "Bounty" },
    { id: 107, name: "Spock", ship_id: 1, rank: "Science Off" },
    { id: 108, name: "Chewbacca", ship_id: 2, rank: "Co-Pilot" },
    { id: 109, name: "Luke Skywalker", ship_id: null, rank: "Jedi" },
    { id: 110, name: "Kara Thrace", ship_id: 5, rank: "Captain" }
  ]
};

// ==========================================================================
// QUESTS / CHALLENGES DEFINITION
// ==========================================================================

const QUESTS = [
  {
    id: 1,
    title: "Mission 1: The High Shield Vanguard",
    desc: "Write a query to retrieve all starships with shields >= 80 and warp_speed > 7.0.",
    hint: "Use: WHERE shields >= 80 AND warp_speed > 7.0",
    initialSql: "SELECT name, warp_speed, shields\nFROM starships\nWHERE shields >= 80 AND warp_speed > 7.0;",
    validate: (res) => res && res.length === 4 && res.every(r => r.shields >= 80 && r.warp_speed > 7.0),
    xp: 150
  },
  {
    id: 2,
    title: "Mission 2: Cruiser Class Identification",
    desc: "Extract all starships that belong to the 'Cruiser' class.",
    hint: "Use: WHERE class = 'Cruiser'",
    initialSql: "SELECT name, class, shields\nFROM starships\nWHERE class = 'Cruiser';",
    validate: (res) => res && res.length === 2 && res.every(r => r.class === 'Cruiser'),
    xp: 200
  },
  {
    id: 3,
    title: "Mission 3: Pilot & Ship Relational Link",
    desc: "Perform an INNER JOIN between pilots and starships on ship_id = starships.id.",
    hint: "Use: pilots INNER JOIN starships ON pilots.ship_id = starships.id",
    initialSql: "SELECT pilots.name AS pilot, starships.name AS ship\nFROM pilots\nINNER JOIN starships ON pilots.ship_id = starships.id;",
    validate: (res) => res && res.length >= 7,
    xp: 250
  },
  {
    id: 4,
    title: "Mission 4: Fleet Aggregation Analytics",
    desc: "Group starships by class and calculate the count of ships per class.",
    hint: "Use: SELECT class, COUNT(*) as count FROM starships GROUP BY class",
    initialSql: "SELECT class, COUNT(*) AS ship_count\nFROM starships\nGROUP BY class;",
    validate: (res) => res && res.length === 5,
    xp: 300
  }
];

// ==========================================================================
// MAIN SQL ODYSSEY APPLICATION CLASS
// ==========================================================================

class Sql3DOdyssey {
  constructor() {
    this.canvas = document.getElementById("renderCanvas");
    this.soundFX = new SoundFX();
    this.currentStage = 0;
    this.currentQuestIndex = 0;
    this.userXp = 450;
    this.isFreeOrbit = false;

    // Babylon Engine & Scene
    this.engine = null;
    this.scene = null;
    this.camera = null;
    this.glowLayer = null;

    // Meshes Collections
    this.stageMeshes = {
      0: [], // Core cylinder & schemas
      1: [], // Table anatomy
      2: [], // SELECT projection cubes
      3: [], // WHERE filter cubes & laser plane
      4: [], // JOIN tables & bridges
      5: [], // GROUP BY pillars & energy rings
      6: [], // B-Tree Nodes
      7: []  // Sandbox live query objects
    };

    this.whereLaserPlane = null;
    this.shieldThreshold = 75;
    this.currentJoinType = "INNER";
    this.currentAggMetric = "COUNT";

    this.init();
  }

  async init() {
    // 1. Initialize Babylon.js Scene
    this.initBabylon();

    // 2. Build 3D Objects for all chapters
    this.buildStage0Core();
    this.buildStage1Anatomy();
    this.buildStage2Select();
    this.buildStage3Where();
    this.buildStage4Joins();
    this.buildStage5GroupBy();
    this.buildStage6BTree();
    this.buildStage7Sandbox();

    // 3. Setup Camera Waypoints & GSAP ScrollTrigger
    this.initScrollChoreography();

    // 4. Setup UI Events & Terminal Handlers
    this.setupUIEvents();
    this.loadQuest(0);
    this.runTerminalQuery(document.getElementById("sqlInput").value);

    // 5. Update Telemetry and FPS
    this.engine.runRenderLoop(() => {
      this.scene.render();
      this.updateHUD();
    });

    // Dynamic responsive radius factor
    this.responsiveRadiusFactor = window.innerWidth < 768 ? 1.45 : (window.innerWidth < 1024 ? 1.2 : 1.0);

    window.addEventListener("resize", () => {
      this.engine.resize();
      const newFactor = window.innerWidth < 768 ? 1.45 : (window.innerWidth < 1024 ? 1.2 : 1.0);
      if (Math.abs(newFactor - this.responsiveRadiusFactor) > 0.05) {
        this.responsiveRadiusFactor = newFactor;
        const cfg = stageConfigs[this.currentStage];
        if (cfg) {
          gsap.to(this.camera, {
            radius: cfg.radius * this.responsiveRadiusFactor,
            duration: 0.6
          });
        }
      }
    });

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ==========================================================================
  // BABYLON.JS INITIALIZATION
  // ==========================================================================

  initBabylon() {
    this.engine = new BABYLON.Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true
    });

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0.015, 0.03, 0.08, 1);

    // Ambient & Directional Lights
    const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);
    hemiLight.intensity = 0.5;
    hemiLight.diffuse = new BABYLON.Color3(0.3, 0.6, 1);

    const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), this.scene);
    dirLight.position = new BABYLON.Vector3(20, 40, 20);
    dirLight.intensity = 0.8;
    dirLight.diffuse = new BABYLON.Color3(0, 0.94, 1);

    const pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 5, 0), this.scene);
    pointLight.intensity = 1.2;
    pointLight.diffuse = new BABYLON.Color3(0.6, 0.2, 1);

    // Glow Layer for glowing cyberpunk neon
    this.glowLayer = new BABYLON.GlowLayer("glow", this.scene);
    this.glowLayer.intensity = 0.85;

    // ArcRotateCamera for fluid scroll-driven view interpolation
    this.camera = new BABYLON.ArcRotateCamera("mainCam", Math.PI / 2, Math.PI / 2.6, 32, new BABYLON.Vector3(0, 0, 0), this.scene);
    this.camera.lowerRadiusLimit = 8;
    this.camera.upperRadiusLimit = 70;
    this.camera.wheelPrecision = 40;
    this.camera.panningSensibility = 0; // lock panning for cinematic control

    // Background Holographic Cyber Grid Floor
    this.createCyberGridFloor();
    this.createStarfield();
  }

  createCyberGridFloor() {
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 140, height: 140, subdivisions: 40 }, this.scene);
    ground.position.y = -6;

    const groundMat = new BABYLON.StandardMaterial("groundMat", this.scene);
    groundMat.wireframe = true;
    groundMat.diffuseColor = new BABYLON.Color3(0, 0.4, 0.6);
    groundMat.emissiveColor = new BABYLON.Color3(0, 0.15, 0.3);
    groundMat.alpha = 0.35;
    ground.material = groundMat;

    // Subtle breathing animation on ground
    let t = 0;
    this.scene.onBeforeRenderObservable.add(() => {
      t += 0.01;
      groundMat.alpha = 0.25 + Math.sin(t) * 0.08;
    });
  }

  createStarfield() {
    const starCount = 350;
    const starPositions = [];
    for (let i = 0; i < starCount; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 60 + 5,
        (Math.random() - 0.5) * 120
      );
    }

    const starParticles = new BABYLON.ParticleSystem("stars", starCount, this.scene);
    starParticles.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/flare.png", this.scene);
    starParticles.emitter = new BABYLON.Vector3(0, 0, 0);
    starParticles.minSize = 0.15;
    starParticles.maxSize = 0.45;
    starParticles.color1 = new BABYLON.Color4(0, 0.94, 1, 0.8);
    starParticles.color2 = new BABYLON.Color4(0.6, 0.2, 1, 0.8);
    starParticles.colorDead = new BABYLON.Color4(0, 0, 0, 0);
    starParticles.minEmitPower = 0.02;
    starParticles.maxEmitPower = 0.08;
    starParticles.updateSpeed = 0.005;
    starParticles.start();
  }

  // ==========================================================================
  // CHAPTER 0: DATABASE CORE ARCHITECTURE
  // ==========================================================================

  buildStage0Core() {
    const root = new BABYLON.TransformNode("stage0Root", this.scene);
    root.position.set(0, 0, 0);

    // Center Pulsing Energy Cylinder (Database Engine Core)
    const coreCylinder = BABYLON.MeshBuilder.CreateCylinder("dbCore", { height: 10, diameter: 4, tessellation: 24 }, this.scene);
    coreCylinder.parent = root;

    const coreMat = new BABYLON.StandardMaterial("dbCoreMat", this.scene);
    coreMat.diffuseColor = new BABYLON.Color3(0, 0.6, 1);
    coreMat.emissiveColor = new BABYLON.Color3(0, 0.8, 1);
    coreMat.alpha = 0.65;
    coreCylinder.material = coreMat;

    // Outer Rotating Torus Rings (Relational Index & Query Memory Rings)
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ring = BABYLON.MeshBuilder.CreateTorus(`coreRing_${i}`, { diameter: 7 + i * 2.5, thickness: 0.25, tessellation: 36 }, this.scene);
      ring.parent = root;
      ring.position.y = (i - 1) * 2.8;

      const ringMat = new BABYLON.StandardMaterial(`ringMat_${i}`, this.scene);
      ringMat.emissiveColor = i % 2 === 0 ? new BABYLON.Color3(0, 0.94, 1) : new BABYLON.Color3(0.7, 0.1, 1);
      ring.material = ringMat;
      rings.push(ring);
    }

    // Orbiting Table Schemas
    const schemaPlates = [];
    const tableNames = ["starships", "pilots", "missions", "logs"];
    tableNames.forEach((tbl, idx) => {
      const plate = BABYLON.MeshBuilder.CreateBox(`schema_${tbl}`, { width: 3.5, height: 2, depth: 0.2 }, this.scene);
      plate.parent = root;
      const angle = (idx / tableNames.length) * Math.PI * 2;
      plate.position.set(Math.cos(angle) * 11, Math.sin(idx) * 1.5, Math.sin(angle) * 11);
      plate.rotation.y = -angle + Math.PI / 2;

      const plateMat = new BABYLON.StandardMaterial(`plateMat_${idx}`, this.scene);
      plateMat.diffuseColor = new BABYLON.Color3(0.05, 0.1, 0.2);
      plateMat.emissiveColor = new BABYLON.Color3(0, 0.4, 0.8);
      plate.material = plateMat;
      schemaPlates.push(plate);
    });

    // Rotation Loop
    this.scene.onBeforeRenderObservable.add(() => {
      if (this.currentStage === 0 || this.currentStage === 1) {
        rings[0].rotation.y += 0.012;
        rings[1].rotation.y -= 0.008;
        rings[2].rotation.y += 0.015;
        root.rotation.y += 0.003;
      }
    });

    this.stageMeshes[0] = [coreCylinder, ...rings, ...schemaPlates];
  }

  // ==========================================================================
  // CHAPTER 1: THE ANATOMY OF A TABLE
  // ==========================================================================

  buildStage1Anatomy() {
    const root = new BABYLON.TransformNode("stage1Root", this.scene);
    root.position.set(0, 0, 0);

    // Floating Data Matrix Grid (Columns & Rows)
    const cubes = [];
    const cols = 4; // id, name, speed, shields
    const rows = 6;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cube = BABYLON.MeshBuilder.CreateBox(`anatomyCube_${r}_${c}`, { size: 1.1 }, this.scene);
        cube.parent = root;
        cube.position.set((c - (cols - 1) / 2) * 2.2 + 8, (rows / 2 - r) * 1.8, (r % 2) * 0.3);

        const mat = new BABYLON.StandardMaterial(`anatMat_${r}_${c}`, this.scene);
        if (c === 0) {
          mat.emissiveColor = new BABYLON.Color3(1, 0.8, 0.2); // Primary key gold
        } else {
          mat.emissiveColor = new BABYLON.Color3(0, 0.7, 0.9);
        }
        mat.alpha = 0.85;
        cube.material = mat;

        // Hover picking interaction
        cube.actionManager = new BABYLON.ActionManager(this.scene);
        cube.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, () => {
            mat.emissiveColor = new BABYLON.Color3(0.2, 1, 0.4);
            this.soundFX.playClick();
          })
        );
        cube.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () => {
            mat.emissiveColor = c === 0 ? new BABYLON.Color3(1, 0.8, 0.2) : new BABYLON.Color3(0, 0.7, 0.9);
          })
        );

        cubes.push(cube);
      }
    }

    this.stageMeshes[1] = cubes;
  }

  // ==========================================================================
  // CHAPTER 2: SELECT & PROJECTION LASER
  // ==========================================================================

  buildStage2Select() {
    const root = new BABYLON.TransformNode("stage2Root", this.scene);
    root.position.set(0, 0, 0);

    const cubes = [];
    DB_DATA.starships.forEach((ship, idx) => {
      const colX = (idx % 4 - 1.5) * 3.5;
      const rowY = (Math.floor(idx / 4) - 0.5) * -3.2;

      const cube = BABYLON.MeshBuilder.CreateBox(`selCube_${idx}`, { width: 2.8, height: 1.8, depth: 1.4 }, this.scene);
      cube.parent = root;
      cube.position.set(colX, rowY + 1, 0);

      const mat = new BABYLON.StandardMaterial(`selMat_${idx}`, this.scene);
      mat.diffuseColor = new BABYLON.Color3(0.1, 0.2, 0.4);
      mat.emissiveColor = new BABYLON.Color3(0, 0.8, 1);
      cube.material = mat;
      cube.shipData = ship;
      cubes.push(cube);
    });

    this.stageMeshes[2] = cubes;
  }

  // ==========================================================================
  // CHAPTER 3: WHERE & FILTER LASER SCANNER
  // ==========================================================================

  buildStage3Where() {
    const root = new BABYLON.TransformNode("stage3Root", this.scene);
    root.position.set(0, 0, 0);

    // Glowing 3D Laser Plane that sweeps through rows
    const laserPlane = BABYLON.MeshBuilder.CreatePlane("whereLaser", { width: 26, height: 14 }, this.scene);
    laserPlane.parent = root;
    laserPlane.rotation.x = Math.PI / 2;
    laserPlane.position.y = 0;

    const laserMat = new BABYLON.StandardMaterial("laserMat", this.scene);
    laserMat.emissiveColor = new BABYLON.Color3(1, 0, 0.5);
    laserMat.alpha = 0.35;
    laserMat.backFaceCulling = false;
    laserPlane.material = laserMat;
    this.whereLaserPlane = laserPlane;

    const cubes = [];
    DB_DATA.starships.forEach((ship, idx) => {
      const x = (idx % 4 - 1.5) * 4;
      const z = (Math.floor(idx / 4) - 0.5) * 5;
      const cube = BABYLON.MeshBuilder.CreateBox(`whereCube_${idx}`, { size: 2 }, this.scene);
      cube.parent = root;
      cube.position.set(x, 1, z);

      const mat = new BABYLON.StandardMaterial(`whereMat_${idx}`, this.scene);
      mat.emissiveColor = new BABYLON.Color3(0, 0.9, 1);
      cube.material = mat;
      cube.shipData = ship;
      cubes.push(cube);
    });

    this.stageMeshes[3] = [...cubes, laserPlane];
  }

  updateWhereFilter(minShields) {
    this.shieldThreshold = minShields;
    const cubes = this.stageMeshes[3].filter(m => m.shipData);

    cubes.forEach((cube) => {
      const matches = cube.shipData.shields >= minShields;
      const mat = cube.material;
      if (matches) {
        mat.emissiveColor = new BABYLON.Color3(0.02, 0.94, 0.6); // Emerald bright
        mat.alpha = 1.0;
        gsap.to(cube.scaling, { x: 1.15, y: 1.15, z: 1.15, duration: 0.3 });
      } else {
        mat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.25);
        mat.alpha = 0.25;
        gsap.to(cube.scaling, { x: 0.8, y: 0.8, z: 0.8, duration: 0.3 });
      }
    });

    if (this.whereLaserPlane) {
      // Animate laser sweep position
      gsap.to(this.whereLaserPlane.position, {
        y: (minShields / 100) * 4 - 1,
        duration: 0.4,
        ease: "power2.out"
      });
    }

    this.soundFX.playLaser();
  }

  // ==========================================================================
  // CHAPTER 4: RELATIONAL JOINS & LASER BRIDGES
  // ==========================================================================

  buildStage4Joins() {
    const root = new BABYLON.TransformNode("stage4Root", this.scene);
    root.position.set(0, 0, 0);

    // Left Island: PILOTS Table
    const pilotIsland = BABYLON.MeshBuilder.CreateCylinder("pilotIsland", { diameter: 10, height: 0.8 }, this.scene);
    pilotIsland.parent = root;
    pilotIsland.position.set(-9, -1, 0);
    const pilotMat = new BABYLON.StandardMaterial("pilotMat", this.scene);
    pilotMat.emissiveColor = new BABYLON.Color3(0, 0.5, 1);
    pilotMat.alpha = 0.5;
    pilotIsland.material = pilotMat;

    // Right Island: STARSHIPS Table
    const shipIsland = BABYLON.MeshBuilder.CreateCylinder("shipIsland", { diameter: 10, height: 0.8 }, this.scene);
    shipIsland.parent = root;
    shipIsland.position.set(9, -1, 0);
    const shipMat = new BABYLON.StandardMaterial("shipMat", this.scene);
    shipMat.emissiveColor = new BABYLON.Color3(0.8, 0, 0.8);
    shipMat.alpha = 0.5;
    shipIsland.material = shipMat;

    // Central Merged Platform
    const mergedPlatform = BABYLON.MeshBuilder.CreateCylinder("mergedPlatform", { diameter: 8, height: 0.8 }, this.scene);
    mergedPlatform.parent = root;
    mergedPlatform.position.set(0, -1, 5);
    const mergedMat = new BABYLON.StandardMaterial("mergedMat", this.scene);
    mergedMat.emissiveColor = new BABYLON.Color3(0.02, 0.94, 0.6);
    mergedMat.alpha = 0.6;
    mergedPlatform.material = mergedMat;

    // Connection Beams / Laser Lines between Foreign Key nodes
    const bridgeLines = [];
    for (let i = 0; i < 4; i++) {
      const line = BABYLON.MeshBuilder.CreateCylinder(`joinBeam_${i}`, { height: 18, diameter: 0.15 }, this.scene);
      line.parent = root;
      line.position.set(0, 0.5 + i * 0.7, (i - 1.5) * 1.5);
      line.rotation.z = Math.PI / 2;

      const beamMat = new BABYLON.StandardMaterial(`beamMat_${i}`, this.scene);
      beamMat.emissiveColor = new BABYLON.Color3(0, 0.94, 1);
      line.material = beamMat;
      bridgeLines.push(line);
    }

    this.stageMeshes[4] = [pilotIsland, shipIsland, mergedPlatform, ...bridgeLines];
  }

  setJoinMode(mode) {
    this.currentJoinType = mode;
    this.soundFX.playLaser();

    const beams = this.stageMeshes[4].filter(m => m.name.startsWith("joinBeam_"));
    const merged = this.stageMeshes[4].find(m => m.name === "mergedPlatform");

    if (mode === "INNER") {
      beams.forEach(b => {
        b.material.emissiveColor = new BABYLON.Color3(0, 0.94, 1);
        b.scaling.set(1, 1, 1);
      });
      merged.material.emissiveColor = new BABYLON.Color3(0.02, 0.94, 0.6);
    } else if (mode === "LEFT") {
      beams.forEach((b, idx) => {
        b.material.emissiveColor = new BABYLON.Color3(0, 0.6, 1);
      });
      merged.material.emissiveColor = new BABYLON.Color3(0, 0.6, 1);
    } else if (mode === "RIGHT") {
      beams.forEach(b => {
        b.material.emissiveColor = new BABYLON.Color3(0.9, 0, 0.7);
      });
      merged.material.emissiveColor = new BABYLON.Color3(0.9, 0, 0.7);
    } else if (mode === "FULL") {
      beams.forEach(b => {
        b.material.emissiveColor = new BABYLON.Color3(1, 0.8, 0.1);
      });
      merged.material.emissiveColor = new BABYLON.Color3(1, 0.8, 0.1);
    }

    this.showToast(`JOIN TOPOLOGY UPDATED`, `${mode} JOIN connected matching relational sets.`);
  }

  // ==========================================================================
  // CHAPTER 5: GROUP BY & AGGREGATION GRAVITONS
  // ==========================================================================

  buildStage5GroupBy() {
    const root = new BABYLON.TransformNode("stage5Root", this.scene);
    root.position.set(0, 0, 0);

    const categories = ["Cruiser", "Freighter", "Gunship", "Frigate"];
    const pillars = [];
    const rings = [];

    categories.forEach((cat, idx) => {
      const angle = (idx / categories.length) * Math.PI * 2;
      const x = Math.cos(angle) * 7;
      const z = Math.sin(angle) * 7;

      // Group Pillar
      const pillar = BABYLON.MeshBuilder.CreateCylinder(`groupPillar_${idx}`, { height: 6, diameter: 2.2 }, this.scene);
      pillar.parent = root;
      pillar.position.set(x, 1.5, z);
      const pilMat = new BABYLON.StandardMaterial(`pilMat_${idx}`, this.scene);
      pilMat.emissiveColor = new BABYLON.Color3(0.1, 0.4, 0.8);
      pilMat.alpha = 0.65;
      pillar.material = pilMat;
      pillars.push(pillar);

      // Aggregation Energy Ring
      const ring = BABYLON.MeshBuilder.CreateTorus(`aggRing_${idx}`, { diameter: 3.5, thickness: 0.2 }, this.scene);
      ring.parent = root;
      ring.position.set(x, 4.8, z);
      const ringMat = new BABYLON.StandardMaterial(`aggRingMat_${idx}`, this.scene);
      ringMat.emissiveColor = new BABYLON.Color3(0.02, 0.94, 0.6);
      ring.material = ringMat;
      rings.push(ring);
    });

    this.stageMeshes[5] = [...pillars, ...rings];
  }

  // ==========================================================================
  // CHAPTER 6: B-TREE INDEX VS FULL SCAN MATRIX
  // ==========================================================================

  buildStage6BTree() {
    const root = new BABYLON.TransformNode("stage6Root", this.scene);
    root.position.set(0, 0, 0);

    const nodes = [];
    // Hierarchical 3-Level B-Tree Nodes
    const treeCoords = [
      { id: "root", pos: [0, 6, 0] },
      { id: "L1_A", pos: [-6, 3, 0] },
      { id: "L1_B", pos: [6, 3, 0] },
      { id: "L2_1", pos: [-9, 0, 0] },
      { id: "L2_2", pos: [-3, 0, 0] },
      { id: "L2_3", pos: [3, 0, 0] },
      { id: "L2_4", pos: [9, 0, 0] }
    ];

    treeCoords.forEach((node) => {
      const sphere = BABYLON.MeshBuilder.CreateSphere(`treeNode_${node.id}`, { diameter: 1.6 }, this.scene);
      sphere.parent = root;
      sphere.position.set(node.pos[0], node.pos[1], node.pos[2]);

      const mat = new BABYLON.StandardMaterial(`treeMat_${node.id}`, this.scene);
      mat.emissiveColor = new BABYLON.Color3(1, 0.8, 0.1); // Golden index nodes
      sphere.material = mat;
      nodes.push(sphere);
    });

    this.stageMeshes[6] = nodes;
  }

  runBTreeRaceAnimation() {
    this.soundFX.playLaser();
    const nodes = this.stageMeshes[6];

    // Reset nodes
    nodes.forEach(n => n.material.emissiveColor = new BABYLON.Color3(1, 0.8, 0.1));

    // B-Tree instant traversal: Root -> L1_B -> L2_3
    const targetSeq = [nodes[0], nodes[2], nodes[5]];
    targetSeq.forEach((node, idx) => {
      setTimeout(() => {
        node.material.emissiveColor = new BABYLON.Color3(0.02, 0.94, 0.6); // Flash emerald
        gsap.to(node.scaling, { x: 1.6, y: 1.6, z: 1.6, yoyo: true, repeat: 1, duration: 0.2 });
        this.soundFX.playClick();
      }, idx * 150);
    });

    setTimeout(() => {
      this.soundFX.playSuccess();
      this.showToast("B-TREE SEARCH COMPLETE", "Target tuple localized in 3 logarithmic hops (3ms)!");
    }, 600);
  }

  // ==========================================================================
  // CHAPTER 7: LIVE 3D SQL SANDBOX GENERATOR
  // ==========================================================================

  buildStage7Sandbox() {
    const root = new BABYLON.TransformNode("stage7Root", this.scene);
    root.position.set(0, 0, 0);

    // Initial Sandbox 3D Ring Grid
    const sandboxCubes = [];
    DB_DATA.starships.forEach((ship, idx) => {
      const cube = BABYLON.MeshBuilder.CreateBox(`sbCube_${idx}`, { size: 1.8 }, this.scene);
      cube.parent = root;
      const angle = (idx / DB_DATA.starships.length) * Math.PI * 2;
      cube.position.set(Math.cos(angle) * 8, 1, Math.sin(angle) * 8);

      const mat = new BABYLON.StandardMaterial(`sbMat_${idx}`, this.scene);
      mat.emissiveColor = new BABYLON.Color3(0, 0.94, 1);
      cube.material = mat;
      sandboxCubes.push(cube);
    });

    this.stageMeshes[7] = sandboxCubes;
  }

  rebuildSandboxFromResults(results) {
    // Clear old sandbox meshes
    this.stageMeshes[7].forEach(m => m.dispose());
    this.stageMeshes[7] = [];

    const root = this.scene.getTransformNodeByName("stage7Root") || new BABYLON.TransformNode("stage7Root", this.scene);

    if (!results || results.length === 0) {
      return;
    }

    const count = results.length;
    results.forEach((row, idx) => {
      const angle = (idx / count) * Math.PI * 2;
      const radius = Math.min(6 + count * 0.4, 12);

      const cube = BABYLON.MeshBuilder.CreateBox(`sbResult_${idx}`, { size: 1.6 }, this.scene);
      cube.parent = root;
      cube.position.set(Math.cos(angle) * radius, 0.8, Math.sin(angle) * radius);

      const mat = new BABYLON.StandardMaterial(`sbResultMat_${idx}`, this.scene);
      mat.emissiveColor = new BABYLON.Color3(0.02, 0.94, 0.6); // Emerald query match
      cube.material = mat;

      // Animate entry pop
      cube.scaling.set(0.1, 0.1, 0.1);
      gsap.to(cube.scaling, { x: 1, y: 1, z: 1, duration: 0.4, delay: idx * 0.05, ease: "back.out(1.7)" });

      this.stageMeshes[7].push(cube);
    });

    this.soundFX.playPulse();
  }

  // ==========================================================================
  // SCROLL CHOREOGRAPHY & GSAP SCROLLTRIGGER
  // ==========================================================================

  initScrollChoreography() {
    const stageConfigs = [
      { stage: 0, alpha: Math.PI / 2, beta: Math.PI / 2.6, radius: 32, target: new BABYLON.Vector3(0, 0, 0) },
      { stage: 1, alpha: Math.PI / 1.8, beta: Math.PI / 2.3, radius: 24, target: new BABYLON.Vector3(3, 1, 0) },
      { stage: 2, alpha: Math.PI / 2, beta: Math.PI / 2.8, radius: 22, target: new BABYLON.Vector3(0, 0, 0) },
      { stage: 3, alpha: Math.PI / 2.5, beta: Math.PI / 3.2, radius: 26, target: new BABYLON.Vector3(0, 1, 0) },
      { stage: 4, alpha: Math.PI / 2, beta: Math.PI / 2.9, radius: 34, target: new BABYLON.Vector3(0, 0, 0) },
      { stage: 5, alpha: Math.PI / 1.6, beta: Math.PI / 2.6, radius: 28, target: new BABYLON.Vector3(0, 2, 0) },
      { stage: 6, alpha: Math.PI / 2, beta: Math.PI / 2.4, radius: 30, target: new BABYLON.Vector3(0, 3, 0) },
      { stage: 7, alpha: Math.PI / 2.2, beta: Math.PI / 2.7, radius: 28, target: new BABYLON.Vector3(0, 0, 0) }
    ];

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      document.querySelectorAll(".story-section").forEach((sec, idx) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 60%",
          end: "bottom 60%",
          onEnter: () => this.switchStage(idx, stageConfigs[idx]),
          onEnterBack: () => this.switchStage(idx, stageConfigs[idx])
        });
      });
    }
  }

  switchStage(stageIdx, config) {
    if (this.currentStage === stageIdx || this.isFreeOrbit) return;
    this.currentStage = stageIdx;

    // Animate Babylon Camera
    if (config) {
      const targetRadius = config.radius * (this.responsiveRadiusFactor || 1.0);
      gsap.to(this.camera, {
        alpha: config.alpha,
        beta: config.beta,
        radius: targetRadius,
        duration: 1.2,
        ease: "power2.inOut"
      });
      gsap.to(this.camera.target, {
        x: config.target.x,
        y: config.target.y,
        z: config.target.z,
        duration: 1.2,
        ease: "power2.inOut"
      });
    }

    // Update Stage Mesh Visibilities
    Object.keys(this.stageMeshes).forEach((key) => {
      const isVisible = parseInt(key) === stageIdx || (stageIdx === 0 && parseInt(key) === 1);
      this.stageMeshes[key].forEach((mesh) => {
        mesh.setEnabled(isVisible);
      });
    });

    // Update Nav Buttons and Drawer Items
    document.querySelectorAll(".nav-btn").forEach((btn, idx) => {
      btn.classList.toggle("active", idx === stageIdx);
    });
    document.querySelectorAll(".drawer-nav-item").forEach((item, idx) => {
      item.classList.toggle("active", idx === stageIdx);
    });

    // Update Chapter Name in HUD
    const stageNames = [
      "DATABASE_GENESIS",
      "TABLE_ANATOMY",
      "SELECT_PROJECTION",
      "WHERE_FILTER_MATRIX",
      "RELATIONAL_JOIN_NEXUS",
      "GROUP_BY_GRAVITONS",
      "BTREE_WARP_INDEX",
      "SQL_CYBER_SANDBOX"
    ];
    const nameEl = document.getElementById("hudActiveChapter");
    if (nameEl) nameEl.textContent = stageNames[stageIdx] || "STAGE_ACTIVE";

    // Update Contextual 3D Controls Panel
    this.updateContextualPanel(stageIdx);
  }

  updateContextualPanel(stageIdx) {
    const container = document.getElementById("panelDynamicControls");
    const titleEl = document.getElementById("panelTitle");
    if (!container) return;

    if (stageIdx === 2) {
      titleEl.textContent = "SELECT COLUMNS";
      container.innerHTML = `
        <div class="ctrl-row">
          <span class="ctrl-label">PROJECTION AXIS</span>
          <div class="ctrl-btn-group">
            <button class="ctrl-btn active" id="pnlSelAll">ALL (*)</button>
            <button class="ctrl-btn" id="pnlSelSpeed">SPEED</button>
            <button class="ctrl-btn" id="pnlSelShields">SHIELDS</button>
            <button class="ctrl-btn" id="pnlSelClass">CLASS</button>
          </div>
        </div>
      `;
      document.getElementById("pnlSelAll")?.addEventListener("click", () => this.triggerSelectDemo(['name', 'warp_speed', 'shields']));
      document.getElementById("pnlSelSpeed")?.addEventListener("click", () => this.triggerSelectDemo(['name', 'warp_speed']));
      document.getElementById("pnlSelShields")?.addEventListener("click", () => this.triggerSelectDemo(['name', 'shields']));
      document.getElementById("pnlSelClass")?.addEventListener("click", () => this.triggerSelectDemo(['name', 'class']));
    } else if (stageIdx === 3) {
      titleEl.textContent = "WHERE PREDICATE";
      container.innerHTML = `
        <div class="ctrl-row">
          <span class="ctrl-label"><span>MIN SHIELDS</span><span class="text-cyan">${this.shieldThreshold}%</span></span>
          <input type="range" min="0" max="100" value="${this.shieldThreshold}" class="cyber-slider" id="pnlSlider">
        </div>
      `;
      document.getElementById("pnlSlider")?.addEventListener("input", (e) => {
        this.updateWhereFilter(parseInt(e.target.value));
        const disp = document.getElementById("shieldValDisplay");
        if (disp) disp.textContent = `${e.target.value}%`;
      });
    } else if (stageIdx === 4) {
      titleEl.textContent = "JOIN TOPOLOGY";
      container.innerHTML = `
        <div class="ctrl-row">
          <div class="ctrl-btn-group">
            <button class="ctrl-btn ${this.currentJoinType === 'INNER' ? 'active' : ''}" data-j="INNER">INNER</button>
            <button class="ctrl-btn ${this.currentJoinType === 'LEFT' ? 'active' : ''}" data-j="LEFT">LEFT</button>
            <button class="ctrl-btn ${this.currentJoinType === 'RIGHT' ? 'active' : ''}" data-j="RIGHT">RIGHT</button>
            <button class="ctrl-btn ${this.currentJoinType === 'FULL' ? 'active' : ''}" data-j="FULL">FULL</button>
          </div>
        </div>
      `;
      container.querySelectorAll(".ctrl-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          container.querySelectorAll(".ctrl-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.setJoinMode(btn.dataset.j);
        });
      });
    } else {
      titleEl.textContent = "3D MATRIX HUD";
      container.innerHTML = `
        <div class="ctrl-row">
          <span class="ctrl-label">STATUS</span>
          <div class="telemetry-value text-cyan">ACTIVE & SYNCHRONIZED</div>
        </div>
      `;
    }
  }

  triggerSelectDemo(columns) {
    this.soundFX.playLaser();
    this.showToast("SELECT PROJECTION", `Extracted axes: [${columns.join(", ")}]`);
  }

  // ==========================================================================
  // CLIENT-SIDE SQL PARSER & EXECUTOR
  // ==========================================================================

  runTerminalQuery(sqlText) {
    const startTime = performance.now();
    try {
      const results = this.executeSql(sqlText);
      const duration = (performance.now() - startTime).toFixed(2);

      // Render Result Table
      this.renderResultTable(results);

      // Update HUD Stats
      const statText = document.getElementById("execStatsText");
      if (statText) statText.textContent = `SUCCESS // ${results.length} ROWS IN ${duration}ms`;

      // Update 3D Sandbox Meshes
      this.rebuildSandboxFromResults(results);

      // Check Active Quest Validation
      this.checkQuestSuccess(results);
    } catch (err) {
      const statText = document.getElementById("execStatsText");
      if (statText) statText.textContent = `ERROR // ${err.message}`;
      this.showToast("SQL ERROR", err.message);
    }
  }

  executeSql(query) {
    const clean = query.trim().replace(/;+$/, "");
    const lower = clean.toLowerCase();

    // 1. SELECT starships
    if (lower.includes("from starships")) {
      let data = JSON.parse(JSON.stringify(DB_DATA.starships));

      // Check WHERE condition
      if (lower.includes("where")) {
        const wherePart = clean.substring(lower.indexOf("where") + 5).split(/order by|group by|limit/i)[0];
        
        if (wherePart.includes("shields >=") || wherePart.includes("shields >")) {
          const match = wherePart.match(/shields\s*(>=|>)\s*(\d+)/i);
          if (match) {
            const val = parseInt(match[2]);
            const isGte = match[1] === ">=";
            data = data.filter(s => isGte ? s.shields >= val : s.shields > val);
          }
        }
        if (wherePart.includes("warp_speed >=") || wherePart.includes("warp_speed >")) {
          const match = wherePart.match(/warp_speed\s*(>=|>)\s*([\d\.]+)/i);
          if (match) {
            const val = parseFloat(match[2]);
            data = data.filter(s => s.warp_speed > val);
          }
        }
        if (wherePart.includes("class =")) {
          const match = wherePart.match(/class\s*=\s*['"]([^'"]+)['"]/i);
          if (match) {
            const cls = match[1];
            data = data.filter(s => s.class.toLowerCase() === cls.toLowerCase());
          }
        }
      }

      // Check GROUP BY
      if (lower.includes("group by")) {
        const counts = {};
        data.forEach(s => {
          counts[s.class] = (counts[s.class] || 0) + 1;
        });
        return Object.keys(counts).map(c => ({ class: c, ship_count: counts[c] }));
      }

      // Check ORDER BY
      if (lower.includes("order by warp_speed desc")) {
        data.sort((a, b) => b.warp_speed - a.warp_speed);
      }

      return data;
    }

    // 2. JOIN pilots and starships
    if (lower.includes("join") && lower.includes("pilots")) {
      const joinResults = [];
      DB_DATA.pilots.forEach(p => {
        const ship = DB_DATA.starships.find(s => s.id === p.ship_id);
        if (ship || lower.includes("left join")) {
          joinResults.push({
            pilot_name: p.name,
            rank: p.rank,
            starship_name: ship ? ship.name : "NONE",
            shields: ship ? ship.shields : 0
          });
        }
      });
      return joinResults;
    }

    // Default fallback
    return DB_DATA.starships;
  }

  renderResultTable(results) {
    const wrapper = document.getElementById("resultTableWrapper");
    if (!wrapper) return;

    if (!results || results.length === 0) {
      wrapper.innerHTML = `<div style="padding: 1rem; color: var(--text-dim);">NO ROWS RETURNED (0 RESULTS)</div>`;
      return;
    }

    const cols = Object.keys(results[0]);
    let html = `<table class="cyber-table"><thead><tr>`;
    cols.forEach(c => html += `<th>${c.toUpperCase()}</th>`);
    html += `</tr></thead><tbody>`;

    results.forEach(row => {
      html += `<tr>`;
      cols.forEach(c => html += `<td>${row[c] !== null ? row[c] : "NULL"}</td>`);
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    wrapper.innerHTML = html;
  }

  // ==========================================================================
  // QUESTS & GAMIFICATION
  // ==========================================================================

  loadQuest(index) {
    if (index < 0 || index >= QUESTS.length) return;
    this.currentQuestIndex = index;
    const q = QUESTS[index];

    document.getElementById("questTitle").textContent = q.title;
    document.getElementById("questDesc").innerHTML = q.desc;
    document.getElementById("questHintText").innerHTML = q.hint;
    document.getElementById("questProgress").textContent = `${index + 1} / ${QUESTS.length}`;
    document.getElementById("sqlInput").value = q.initialSql;
  }

  checkQuestSuccess(results) {
    const q = QUESTS[this.currentQuestIndex];
    if (q && q.validate(results)) {
      this.soundFX.playSuccess();
      this.userXp += q.xp;
      document.getElementById("userXp").textContent = this.userXp;
      this.showToast(`QUEST COMPLETED! +${q.xp} XP`, `Congratulations! You conquered ${q.title}!`);
    }
  }

  // ==========================================================================
  // UI EVENT LISTENERS
  // ==========================================================================

  setupUIEvents() {
    // Sound FX Unlock
    const audioInit = () => {
      this.soundFX.init();
      document.removeEventListener("click", audioInit);
    };
    document.addEventListener("click", audioInit);

    // Audio SFX Toggle Button
    const audioBtn = document.getElementById("audioToggleBtn");
    if (audioBtn) {
      audioBtn.addEventListener("click", () => {
        this.soundFX.enabled = !this.soundFX.enabled;
        const label = document.getElementById("audioLabel");
        if (label) label.textContent = this.soundFX.enabled ? "SFX ON" : "SFX MUTED";
        audioBtn.classList.toggle("glow-accent", this.soundFX.enabled);
      });
    }

    // Free 3D Orbit Button
    const camBtn = document.getElementById("camFreeBtn");
    if (camBtn) {
      camBtn.addEventListener("click", () => {
        this.isFreeOrbit = !this.isFreeOrbit;
        if (this.isFreeOrbit) {
          this.camera.attachControl(this.canvas, true);
          camBtn.classList.add("glow-accent");
          this.showToast("3D FREE ORBIT ACTIVE", "Drag with mouse to rotate freely in space.");
        } else {
          this.camera.detachControl();
          camBtn.classList.remove("glow-accent");
          this.showToast("SCROLL SYNC RESTORED", "Camera returned to narrative scroll path.");
        }
      });
    }

    // Quick Jump Nav Buttons (Top Bar)
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const stageIdx = parseInt(btn.dataset.stage);
        const targetSec = document.getElementById(`section-${stageIdx}`);
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Mobile Navigation Drawer Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileNavDrawer = document.getElementById("mobileNavDrawer");
    const drawerBackdrop = document.getElementById("drawerBackdrop");
    const closeDrawerBtn = document.getElementById("closeDrawerBtn");

    const openDrawer = () => {
      if (mobileNavDrawer && drawerBackdrop) {
        mobileNavDrawer.classList.remove("hidden");
        drawerBackdrop.classList.remove("hidden");
        this.soundFX.playClick();
      }
    };

    const closeDrawer = () => {
      if (mobileNavDrawer && drawerBackdrop) {
        mobileNavDrawer.classList.add("hidden");
        drawerBackdrop.classList.add("hidden");
      }
    };

    mobileMenuBtn?.addEventListener("click", openDrawer);
    closeDrawerBtn?.addEventListener("click", closeDrawer);
    drawerBackdrop?.addEventListener("click", closeDrawer);

    // Mobile Drawer Navigation Items
    document.querySelectorAll(".drawer-nav-item").forEach((item) => {
      item.addEventListener("click", () => {
        const stageIdx = parseInt(item.dataset.stage);
        const targetSec = document.getElementById(`section-${stageIdx}`);
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: "smooth" });
        }
        closeDrawer();
      });
    });

    // Scroll-to buttons
    document.querySelectorAll(".scroll-to-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.querySelector(btn.dataset.target);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });

    // WHERE Shield Slider
    const slider = document.getElementById("shieldSlider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        document.getElementById("shieldValDisplay").textContent = `${val}%`;
        document.getElementById("liveShieldNum").textContent = val;
        this.updateWhereFilter(val);
      });
    }

    // JOIN Buttons
    document.querySelectorAll(".join-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".join-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.setJoinMode(btn.dataset.join);
        const codeKey = document.getElementById("joinKeyword");
        if (codeKey) codeKey.textContent = `${btn.dataset.join} JOIN`;
      });
    });

    // B-Tree Race Button
    const raceBtn = document.getElementById("startIndexRaceBtn");
    if (raceBtn) {
      raceBtn.addEventListener("click", () => {
        this.runBTreeRaceAnimation();
      });
    }

    // Live SQL Execute Button
    const runBtn = document.getElementById("runQueryBtn");
    if (runBtn) {
      runBtn.addEventListener("click", () => {
        const sql = document.getElementById("sqlInput").value;
        this.runTerminalQuery(sql);
      });
    }

    // Reset Table Data Button
    const resetBtn = document.getElementById("resetTableBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.runTerminalQuery("SELECT * FROM starships;");
      });
    }

    // Preset Dropdown
    const presetSelect = document.getElementById("queryPresetSelect");
    if (presetSelect) {
      presetSelect.addEventListener("change", (e) => {
        const p = e.target.value;
        let sql = "SELECT * FROM starships;";
        if (p === "shield_filter") sql = "SELECT name, warp_speed, shields\nFROM starships\nWHERE shields >= 80;";
        if (p === "inner_join") sql = "SELECT pilots.name AS pilot, starships.name AS ship\nFROM pilots\nINNER JOIN starships ON pilots.ship_id = starships.id;";
        if (p === "group_by_class") sql = "SELECT class, COUNT(*) AS total_ships\nFROM starships\nGROUP BY class;";
        if (p === "top_speed") sql = "SELECT name, warp_speed, shields\nFROM starships\nORDER BY warp_speed DESC;";

        document.getElementById("sqlInput").value = sql;
        this.runTerminalQuery(sql);
      });
    }

    // Quests Navigation
    document.getElementById("prevQuestBtn")?.addEventListener("click", () => {
      if (this.currentQuestIndex > 0) this.loadQuest(this.currentQuestIndex - 1);
    });
    document.getElementById("nextQuestBtn")?.addEventListener("click", () => {
      if (this.currentQuestIndex < QUESTS.length - 1) this.loadQuest(this.currentQuestIndex + 1);
    });

    // Quick Terminal open HUD button
    document.getElementById("quickTerminalBtn")?.addEventListener("click", () => {
      document.getElementById("section-7").scrollIntoView({ behavior: "smooth" });
    });
  }

  // ==========================================================================
  // HUD TELEMETRY & TOAST
  // ==========================================================================

  updateHUD() {
    // Camera Coordinates
    const coordsEl = document.getElementById("hudCamCoords");
    if (coordsEl && this.camera) {
      coordsEl.textContent = `α: ${this.camera.alpha.toFixed(2)} | β: ${this.camera.beta.toFixed(2)}`;
    }

    // FPS
    const fpsEl = document.getElementById("fpsDisplay");
    if (fpsEl && this.engine) {
      fpsEl.textContent = `FPS: ${this.engine.getFps().toFixed(0)}`;
    }
  }

  showToast(title, msg) {
    const toast = document.getElementById("cyberToast");
    const tTitle = document.getElementById("toastTitle");
    const tMsg = document.getElementById("toastMsg");

    if (toast && tTitle && tMsg) {
      tTitle.textContent = title;
      tMsg.textContent = msg;
      toast.classList.remove("hidden");

      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        toast.classList.add("hidden");
      }, 3500);
    }
  }
}

// Instantiate global app when window loads
window.addEventListener("DOMContentLoaded", () => {
  window.sqlApp = new Sql3DOdyssey();
});

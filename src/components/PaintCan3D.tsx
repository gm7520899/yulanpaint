import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface PaintCan3DProps {
  labelTextureUrl: string;
  className?: string;
}

const PaintCan3D: React.FC<PaintCan3DProps> = ({ labelTextureUrl, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Delay initialization to ensure modal transition is finished and DOM is stable
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Fallback if container is still 0
    if (width === 0 || height === 0) {
      width = 400; height = 400;
    }

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0; // Balanced brightness
    
    // Enable Shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 5, 25);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0; // Slower, more elegant
    controls.enablePan = false; 

    // --- High-End Studio Lighting Setup (Extremely Soft) ---
    // Soft ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Warm hemisphere light for extremely soft gradient overhead
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xc0c0c0, 1.0);
    scene.add(hemiLight);

    // Main Key Light - wide and soft, casting shadows
    const mainLight = new THREE.DirectionalLight(0xfffbf5, 1.6);
    mainLight.position.set(20, 30, 20);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -15;
    mainLight.shadow.camera.right = 15;
    mainLight.shadow.camera.top = 15;
    mainLight.shadow.camera.bottom = -15;
    mainLight.shadow.bias = -0.001;
    mainLight.shadow.radius = 8; // Extra soft shadow edges
    scene.add(mainLight);

    // Fill Light - cool and soft
    const fillLight = new THREE.DirectionalLight(0xf0f5ff, 1.0);
    fillLight.position.set(-15, 10, 15);
    scene.add(fillLight);

    // Rim/Back Light for profile definition but kept very diffused
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(0, 10, -20);
    scene.add(rimLight);

    // --- Floor for Shadow ---
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.12 }); 
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5.26; // Just below the bottom rim
    floor.receiveShadow = true;
    scene.add(floor);

    // --- Model ---
    const canGroup = new THREE.Group();
    scene.add(canGroup);

    const metalMat = new THREE.MeshStandardMaterial({ 
      color: 0xdfdfdf, // Elegant subtle gray metal
      metalness: 0.8, 
      roughness: 0.3 
    });
    
    // Label Material - matching 15-25% gloss (roughness ~0.75-0.85), diffuse reflection, zero harsh highlights
    const labelMat = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      roughness: 0.82, 
      metalness: 0.05
    });

    if (labelTextureUrl) {
      new THREE.TextureLoader().load(labelTextureUrl, (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = THREE.RepeatWrapping;
        // Keep artwork naturally centered, adjust based on your texture's visual layout
        t.offset.x = 0; 
        labelMat.map = t;
        labelMat.needsUpdate = true;
      });
    }

    const radius = 4.8;
    const canHeight = 10.5;

    // Body (Main Cylinder)
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, canHeight, 64),
      [labelMat, metalMat, metalMat]
    );
    body.castShadow = true;
    body.receiveShadow = true;
    canGroup.add(body);

    // Rims
    const rimGeo = new THREE.TorusGeometry(radius, 0.15, 12, 64);
    const topRim = new THREE.Mesh(rimGeo, metalMat);
    topRim.position.y = canHeight / 2;
    topRim.rotation.x = Math.PI / 2;
    topRim.castShadow = true;
    topRim.receiveShadow = true;
    canGroup.add(topRim);

    const bottomRim = new THREE.Mesh(rimGeo, metalMat);
    bottomRim.position.y = -canHeight / 2;
    bottomRim.rotation.x = Math.PI / 2;
    bottomRim.castShadow = true;
    bottomRim.receiveShadow = true;
    canGroup.add(bottomRim);

    // Small High-End Metallic Ears
    const handleGroup = new THREE.Group();
    canGroup.add(handleGroup);

    const earBaseGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32);
    const earNubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16);
    
    // Left Ear
    const earL = new THREE.Group();
    earL.position.set(-radius, 0, 0);
    const baseL = new THREE.Mesh(earBaseGeo, metalMat);
    baseL.rotation.z = Math.PI / 2;
    baseL.castShadow = true;
    baseL.receiveShadow = true;
    earL.add(baseL);
    const nubL = new THREE.Mesh(earNubGeo, metalMat);
    nubL.rotation.z = Math.PI / 2;
    nubL.position.x = -0.15;
    nubL.castShadow = true;
    earL.add(nubL);
    handleGroup.add(earL);

    // Right Ear
    const earR = new THREE.Group();
    earR.position.set(radius, 0, 0); 
    const baseR = new THREE.Mesh(earBaseGeo, metalMat);
    baseR.rotation.z = Math.PI / 2;
    baseR.castShadow = true;
    baseR.receiveShadow = true;
    earR.add(baseR);
    const nubR = new THREE.Mesh(earNubGeo, metalMat);
    nubR.rotation.z = Math.PI / 2;
    nubR.position.x = 0.15;
    nubR.castShadow = true;
    earR.add(nubR);
    handleGroup.add(earR);

    // Position ears near the top rim
    handleGroup.position.y = canHeight / 2 - 0.7; 

    // Lid (Recessed style)
    const lidPoints = [
      new THREE.Vector2(0, 0.1),
      new THREE.Vector2(radius * 0.7, 0.1),
      new THREE.Vector2(radius * 0.75, 0),
      new THREE.Vector2(radius * 0.9, 0),
      new THREE.Vector2(radius * 0.95, 0.2),
      new THREE.Vector2(radius, 0.2)
    ];
    const lidGeo = new THREE.LatheGeometry(lidPoints, 64);
    const lid = new THREE.Mesh(lidGeo, metalMat);
    lid.position.y = canHeight / 2;
    lid.receiveShadow = true;
    canGroup.add(lid);

    // Handle (Aligned)
    class CustomHandleCurve extends THREE.Curve<THREE.Vector3> {
        constructor(private r: number) { super(); }
        getPoint(t: number, optionalTarget = new THREE.Vector3()) {
            const angle = Math.PI * t;
            const x = Math.cos(angle + Math.PI) * (this.r + 0.3); 
            const arcH = 6.2;
            const y = Math.sin(angle) * arcH;
            return optionalTarget.set(x, y, 0);
        }
    }
    const betterHandlePath = new CustomHandleCurve(radius);
    const handleMesh = new THREE.Mesh(
      new THREE.TubeGeometry(betterHandlePath, 64, 0.08, 12, false),
      metalMat
    );
    handleMesh.castShadow = true;
    handleGroup.add(handleMesh);

    // Handle Plastic Grip
    class GripCurve extends THREE.Curve<THREE.Vector3> {
        constructor(private r: number) { super(); }
        getPoint(t: number, optionalTarget = new THREE.Vector3()) {
            const u = 0.42 + t * 0.16; // Center grip
            const angle = Math.PI * u;
            const x = Math.cos(angle + Math.PI) * (this.r + 0.3); 
            const arcH = 6.2;
            const y = Math.sin(angle) * arcH;
            return optionalTarget.set(x, y, 0);
        }
    }
    const gripPath = new GripCurve(radius);
    const gripMat = new THREE.MeshStandardMaterial({
      color: 0x5a758e, // Elegant muted blue/gray
      roughness: 0.8,
      metalness: 0.1
    });
    const gripMesh = new THREE.Mesh(
      new THREE.TubeGeometry(gripPath, 32, 0.18, 16, false),
      gripMat
    );
    gripMesh.castShadow = true;
    handleGroup.add(gripMesh);

    // Start with a slight angle so the handle is beautifully positioned, and the label faces forward
    canGroup.rotation.y = -Math.PI / 8;

    // --- Animation Loop ---
    let frameId: number;
    const render = () => {
      frameId = requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    // --- Observer ---
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w === 0 || h === 0) continue;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    obs.observe(container);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(frameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Cleanup
      scene.traverse((o: any) => {
        if (o.isMesh) {
          o.geometry.dispose();
          if (Array.isArray(o.material)) o.material.forEach((m: any) => m.dispose());
          else o.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [isReady, labelTextureUrl]);

  return (
    <div 
      ref={containerRef} 
      className={`${className} relative`} 
      style={{ touchAction: 'none' }} 
    />
  );
};

export default PaintCan3D;

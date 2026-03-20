import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AnimatedBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 60);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.zIndex = "0";
    renderer.domElement.style.pointerEvents = "none";

    mount.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(50, 50, 50);
    scene.add(dir);

    // Create a subtle gradient-like background using a large plane with a shader-like material
    const bgGeo = new THREE.PlaneGeometry(200, 100);
    const bgMat = new THREE.MeshBasicMaterial({ color: 0x0f1724, transparent: true, opacity: 0.65 });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 0, -100);
    scene.add(bgMesh);

    // Helper: create stylized waste objects
    const items = new THREE.Group();
    scene.add(items);

    function createBottle() {
      const group = new THREE.Group();
      const bodyGeo = new THREE.CylinderGeometry(1.2, 1.2, 6, 16);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x66ccff, metalness: 0.1, roughness: 0.3 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0;
      group.add(body);

      const neckGeo = new THREE.CylinderGeometry(0.6, 1.0, 1.6, 12);
      const neck = new THREE.Mesh(neckGeo, bodyMat);
      neck.position.y = 3.2;
      group.add(neck);

      return group;
    }

    function createCan() {
      const geo = new THREE.CylinderGeometry(1.4, 1.4, 3.2, 20);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffcc66, metalness: 0.9, roughness: 0.25 });
      return new THREE.Mesh(geo, mat);
    }

    function createPaper() {
      const geo = new THREE.PlaneGeometry(3.6, 2.6);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, roughness: 0.9 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI * 0.5 * 0.2;
      return mesh;
    }

    function createBox() {
      const geo = new THREE.BoxGeometry(3, 2.2, 2);
      const mat = new THREE.MeshStandardMaterial({ color: 0x8fd694, roughness: 0.6 });
      return new THREE.Mesh(geo, mat);
    }

    const creators = [createBottle, createCan, createPaper, createBox];

    const count = 60;
    for (let i = 0; i < count; i++) {
      const fn = creators[Math.floor(Math.random() * creators.length)];
      const mesh = fn();
      mesh.position.x = (Math.random() - 0.5) * 140;
      mesh.position.y = (Math.random() - 0.5) * 60;
      mesh.position.z = (Math.random() - 0.5) * 80;
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      const scale = 0.6 + Math.random() * 1.4;
      mesh.scale.set(scale, scale, scale);

      // store some custom data for animation
      mesh.userData = {
        speed: 0.2 + Math.random() * 0.8,
        bobAmp: 0.6 + Math.random() * 1.5,
        rotSpeed: 0.001 + Math.random() * 0.006,
        baseY: mesh.position.y,
      };

      items.add(mesh);
    }

    // camera parallax via mouse
    let mouseX = 0;
    let mouseY = 0;
    function onMove(e) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX = nx * 10;
      mouseY = -ny * 6;
    }
    window.addEventListener("mousemove", onMove);

    let frameId;
    const clock = new THREE.Clock();

    function animate() {
      const t = clock.getElapsedTime();

      // animate items
      items.children.forEach((m, idx) => {
        const d = m.userData;
        m.rotation.y += d.rotSpeed * d.speed;
        m.position.y = d.baseY + Math.sin(t * d.speed) * d.bobAmp;
        m.rotation.x += d.rotSpeed * 0.2;
      });

      // smooth camera follow
      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (mouseY - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      // dispose geometry/materials
      items.traverse((c) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) {
          if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
          else c.material.dispose();
        }
      });
      bgGeo.dispose();
      bgMat.dispose();
      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0 }} aria-hidden="true" />;
}

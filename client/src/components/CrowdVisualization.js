import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CrowdVisualization = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const cameraRef = useRef({
    rotation: { x: 0, y: 0 },
    position: { x: 0, y: 5, z: 10 },
    target: new THREE.Vector3(0, 0, 0)
  });

  useEffect(() => {
    const container = mountRef.current;
    const { clientWidth: width, clientHeight: height } = container;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a365d);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(
      cameraRef.current.position.x,
      cameraRef.current.position.y,
      cameraRef.current.position.z
    );

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3f83f8,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0xffffff, 0x2563eb);
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create crowd representation
    const people = [];
    const createPerson = (x, z) => {
      const group = new THREE.Group();

      // Body
      const bodyGeometry = new THREE.CapsuleGeometry(0.2, 0.5, 4, 8);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x60a5fa });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.castShadow = true;
      group.add(body);

      // Head
      const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0x93c5fd });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 0.5;
      head.castShadow = true;
      group.add(head);

      group.position.set(x, 0.6, z);
      return group;
    };

    // Add multiple people in a pattern
    for (let i = -3; i <= 3; i += 1.5) {
      for (let j = -3; j <= 3; j += 1.5) {
        const person = createPerson(i, j);
        people.push(person);
        scene.add(person);
      }
    }

    // Custom camera controls
    const handleMouseDown = (event) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.isDown = true;
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const handleMouseMove = (event) => {
      if (mouseRef.current.isDown) {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const deltaX = (x - mouseRef.current.x) * 0.01;
        const deltaY = (y - mouseRef.current.y) * 0.01;

        cameraRef.current.rotation.y += deltaX;
        cameraRef.current.rotation.x = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, cameraRef.current.rotation.x + deltaY)
        );

        const radius = Math.sqrt(
          camera.position.x * camera.position.x +
          camera.position.z * camera.position.z
        );

        camera.position.x = radius * Math.sin(cameraRef.current.rotation.y);
        camera.position.z = radius * Math.cos(cameraRef.current.rotation.y);
        camera.position.y = 5 + radius * Math.sin(cameraRef.current.rotation.x);

        camera.lookAt(cameraRef.current.target);

        mouseRef.current.x = x;
        mouseRef.current.y = y;
      }
    };

    const handleWheel = (event) => {
      event.preventDefault();
      const zoomSpeed = 0.1;
      const minDistance = 5;
      const maxDistance = 20;

      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);

      const distance = camera.position.distanceTo(cameraRef.current.target);
      const newDistance = Math.max(
        minDistance,
        Math.min(maxDistance, distance + event.deltaY * zoomSpeed)
      );

      camera.position.copy(cameraRef.current.target)
        .add(direction.multiplyScalar(-newDistance));
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate people
      people.forEach((person, index) => {
        person.position.y = 0.6 + Math.sin(Date.now() * 0.002 + index) * 0.1;
        person.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };

    // Handle container resize
    const handleResize = () => {
      const { clientWidth: newWidth, clientHeight: newHeight } = container;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Start animation
    animate();

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-96 relative rounded-lg overflow-hidden"
    >
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Interactive Controls</h3>
        <ul className="space-y-1 text-sm">
          <li>• Click + Drag to rotate camera</li>
          <li>• Scroll to zoom in/out</li>
        </ul>
      </div>
    </div>
  );
};

export default CrowdVisualization;
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function useOutfitVisualizer(containerRef: React.RefObject<HTMLDivElement>) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameId = useRef<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the 3D scene
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8f9fa);
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        45,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      camera.position.y = 1.5;
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;

      // Add renderer to DOM
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(renderer.domElement);

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Add a simple floor
      const floorGeometry = new THREE.PlaneGeometry(10, 10);
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        side: THREE.DoubleSide,
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      // Add a simple mannequin (placeholder)
      const geometry = new THREE.BoxGeometry(1, 2, 0.5);
      const material = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
      const mannequin = new THREE.Mesh(geometry, material);
      mannequin.position.y = 1;
      mannequin.castShadow = true;
      scene.add(mannequin);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 2;
      controls.maxDistance = 10;
      controls.maxPolarAngle = Math.PI / 2;
      controlsRef.current = controls;

      // Handle window resize
      const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;

        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      // Animation loop
      const animate = () => {
        animationFrameId.current = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
      setIsLoading(false);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        controls.dispose();
        renderer.dispose();
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    } catch (err) {
      console.error('Error initializing 3D scene:', err);
      setError('Failed to initialize 3D viewer');
      setIsLoading(false);
    }
  }, [containerRef]);

  return { isLoading, error };
}

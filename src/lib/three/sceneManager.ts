import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface SceneManagerOptions {
  container: HTMLElement;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface ISceneManager {
  dispose: () => void;
  addToScene: (object: THREE.Object3D) => void;
  removeFromScene: (object: THREE.Object3D) => void;
  update: (callback: (scene: THREE.Scene, camera: THREE.Camera) => void) => void;
}

class SceneManager implements ISceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private animationFrameId: number | null = null;
  private container: HTMLElement;
  private onLoad?: () => void;
  private onError?: (error: Error) => void;
  private resizeObserver!: ResizeObserver;

  constructor({ container, onLoad, onError }: SceneManagerOptions) {
    this.container = container;
    this.onLoad = onLoad;
    this.onError = onError;

    try {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf8f9fa);

      this.camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      this.camera.position.z = 5;
      this.camera.position.y = 1.5;

      this.renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.shadowMap.enabled = true;
      container.appendChild(this.renderer.domElement);

      this.addLights();
      this.addSceneElements();

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.screenSpacePanning = false;
      this.controls.minDistance = 2;
      this.controls.maxDistance = 10;
      this.controls.maxPolarAngle = Math.PI / 2;

      this.setupResizeObserver();
      this.animate();
      this.onLoad?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to initialize 3D scene');
      this.onError?.(err);
      throw err;
    }
  }

  private addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  private addSceneElements() {
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const geometry = new THREE.BoxGeometry(1, 2, 0.5);
    const material = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
    const mannequin = new THREE.Mesh(geometry, material);
    mannequin.position.y = 1;
    mannequin.castShadow = true;
    this.scene.add(mannequin);
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.container) {
          this.handleResize();
        }
      }
    });
    this.resizeObserver.observe(this.container);
  }

  private handleResize() {
    const { clientWidth, clientHeight } = this.container;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else if (object.material) {
          object.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    this.controls.dispose();
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }

  public addToScene(object: THREE.Object3D) {
    this.scene.add(object);
  }

  public removeFromScene(object: THREE.Object3D) {
    this.scene.remove(object);
  }

  public update(callback: (scene: THREE.Scene, camera: THREE.Camera) => void) {
    callback(this.scene, this.camera);
  }
}

export default SceneManager;
export type { ISceneManager as SceneManagerType };

declare const _default: typeof SceneManager;
export { _default as SceneManager };

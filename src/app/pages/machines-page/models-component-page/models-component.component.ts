import {
  Component,
  inject,
  ElementRef,
  OnInit,
  ViewChild,
  signal,
  Renderer2,
  viewChildren,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { Object3d } from '../../../interfaces/objects3d.interface';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import machinesdata from '../../../data/machines-data/machines-data.json';

@Component({
  selector: 'app-models-component',
  imports: [],
  templateUrl: './models-component.component.html',
})
export default class ModelsComponentComponent implements OnInit, AfterViewInit {
  router = inject(Router);

  constructor(private renderer2: Renderer2) {}

  @ViewChild('firstElement', { static: true }) firstElement!: ElementRef;
  @ViewChild('informativeElements', { static: true })
  textContainer!: ElementRef;
  @ViewChild('modelthree') canvasContainer!: ElementRef;

  idModel: number = 0;
  modelo3dTest: Object3d | null | undefined = null;
  actualElementAnimate: HTMLElement | null = null;
  actualObjPosition = signal<number>(0);
  animateState: boolean = false;
  activeRoute = inject(ActivatedRoute);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Mesh;
  private controls!: OrbitControls;

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  ngOnInit() {
    this.idModel = parseInt(this.activeRoute.snapshot.paramMap.get('idModel')!);
    this.modelo3dTest = machinesdata.find((model) => model.id === this.idModel);
  }

  ngAfterViewInit() {
    if (this.modelo3dTest && this.modelo3dTest.isAnimated) {
      this.initScene();
      this.loadSTLModel();
      this.animate();
      this.actualElementAnimate = this.firstElement.nativeElement;
    } else if (!this.modelo3dTest) {
      console.warn('El modelo no existe');
    }
    console.log(this.actualElementAnimate);
  }

  ngOnDestroy(): void {
    // 1. Limpiar el renderizador (libera el contexto WebGL)
    if (this.renderer) {
      this.renderer.dispose();
    }

    // 2. Limpiar la escena y sus objetos (geometrías y materiales)
    if (this.scene) {
      this.scene.traverse((object: any) => {
        // Si el objeto es un Mesh (un modelo 3D)
        if (object.isMesh) {
          // Disponer de la geometría
          if (object.geometry) {
            object.geometry.dispose();
          }
          // Disponer del material (puede ser un array de materiales)
          if (object.material) {
            if (Array.isArray(object.material)) {
              for (const material of object.material) {
                material.dispose();
              }
            } else {
              object.material.dispose();
            }
          }
        }
      });
    }
    // Limpiar los hijos de la escena para asegurar que no queden referencias
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    // 3. Opcional: Limpiar los controles de órbita si los has inicializado
    if (this.controls) {
      this.controls.dispose();
    }
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvasContainer.nativeElement.clientWidth /
        this.canvasContainer.nativeElement.clientHeight,
      0.1,
      500
    );
    this.camera.position.set(0, 100, 400);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasContainer.nativeElement,
      antialias: true,
    });
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.setSize(
      this.canvasContainer.nativeElement.clientWidth,
      this.canvasContainer.nativeElement.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);

    //Controles de camara
    this.controls = new OrbitControls(
      this.camera,
      this.canvasContainer.nativeElement
    );
    this.controls.enableDamping = true; // Activa el damping (inercia)
    this.controls.dampingFactor = 0.05; // Ajusta el factor de damping
    this.controls.enabled = false;
    this.controls.screenSpacePanning = false; // Desactiva paneo en espacio de pantalla
    this.controls.minDistance = 1;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI / 2; // Limita el ángulo vertical
    this.controls.saveState();

    //Cambios de color de la escena
    this.scene.background = new THREE.Color(0xffffff);

    //Ejes de ayuda donde rojo=x, verde=y y azul=z
    const axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(axesHelper);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10).normalize();
    this.scene.add(light);
  }

  private loadSTLModel(): void {
    const loader = new STLLoader();

    //El objeto se puede girar solo al momento de su carga
    loader.load(
      machinesdata[this.idModel - 1].path,
      (geometry) => {
        const material = new THREE.MeshStandardMaterial({
          color: 0xe2e0e0,
          metalness: 0.5,
          roughness: 0.5,
        });
        this.model = new THREE.Mesh(geometry, material);
        this.model.rotation.x = Math.PI / -2;
        this.scene.add(this.model);
      },
      (xhr) => {
        console.log(`Carga: ${(xhr.loaded / xhr.total) * 100}% completada`);
      },
      (error) => {
        console.error('Error al cargar el modelo STL', error);
      }
    );
  }

  //Animar camara de movimiento por frame
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    // this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  //Habilitar controles de movimiento
  free3dMovement(): void {
    this.controls.target.set(0, 0, 0);
    this.controls.enabled
      ? (this.controls.enabled = false)
      : (this.controls.enabled = true);
  }

  //botones para mover camara en escena
  nextCameraPosition(): void {
    if (this.animateState) return;

    //Retornamos los controles a su estabo base y bloqueamos el boton
    if (this.controls.enabled) {
      this.controls.reset();
      this.controls.enabled = false;
    }

    //Estado de animacion y aparicion de siguiente cuadro
    this.animateState = true;
    this.nextInformativeSquare();

    if (this.actualObjPosition() == this.modelo3dTest!.positions!.length) {
      console.log('Terminaron los movimientos');
      return;
    }
    const targetPosition = new THREE.Vector3(
      ...this.modelo3dTest!.positions![this.actualObjPosition()]
    );
    const speed = 0.05; // Velocidad de interpolación
    console.log(...this.modelo3dTest!.positions![this.actualObjPosition()]);
    this.smoothCameraMovement(targetPosition, speed);
  }

  //Movimiento fluido de la camara
  smoothCameraMovement(vector: THREE.Vector3, speed: number): void {
    let animationId = requestAnimationFrame(() =>
      this.smoothCameraMovement(vector, speed)
    );
    this.camera.position.lerp(vector, speed);
    console.log('Pase por la actualizacion');

    if (this.camera.position.distanceTo(vector) < 0.01) {
      console.log('terminando la animacion de la camara');
      cancelAnimationFrame(animationId); //animacion no se quede en bucle
      this.animateState = false;
      this.actualObjPosition.update((pos) => pos + 1);
    }
  }

  //Siguiente cuadro informativo
  nextInformativeSquare(){
    if(this.actualObjPosition() === this.modelo3dTest!.positions!.length) return;

    this.animateCardElementsPrevious(this.actualElementAnimate);

    //arreglar en una funcion mas pequeña
    let genericDivCard: HTMLElement = this.createCardInformative();

    const newElement = this.renderer2.createElement('div');
    this.renderer2.appendChild(newElement, genericDivCard);

    this.renderer2.addClass(newElement, 'absolute');
    this.renderer2.addClass(newElement, 'w-full');
    this.renderer2.addClass(newElement, 'h-full');
    this.renderer2.addClass(newElement, 'flex');
    this.renderer2.addClass(
      newElement,
      `justify-${
        this.modelo3dTest!.content!.contentCard[this.actualObjPosition()]
          .textPosition
      }`
    );

    this.renderer2.appendChild(this.textContainer.nativeElement, newElement);

    this.actualElementAnimate = newElement;
  }

  //Creacion tarjeta
  createCardInformative(): HTMLElement {
    let card = this.renderer2.createElement('div');
    ['card', 'card-dash', 'bg-base-100', 'w-96', 'my-auto'].forEach(
      (classDOM) => {
        this.renderer2.addClass(card, classDOM);
      }
    );

    let cardBody = this.renderer2.createElement('div');
    this.renderer2.addClass(cardBody, 'card-body');

    const title = this.renderer2.createElement('h2');
    this.renderer2.addClass(title, 'card-title');
    this.renderer2.setProperty(
      title,
      'innerText',
      this.modelo3dTest!.content!.title
    );

    const paragraph = this.renderer2.createElement('p');
    this.renderer2.setProperty(
      paragraph,
      'innerText',
      this.modelo3dTest!.content!.contentCard[this.actualObjPosition()].text
    );

    this.renderer2.appendChild(card, cardBody);
    this.renderer2.appendChild(cardBody, title);
    this.renderer2.appendChild(cardBody, paragraph);

    if (this.actualObjPosition() < this.modelo3dTest!.positions!.length - 1) {
      const button = this.renderer2.createElement('button');
      this.renderer2.addClass(button, 'btn');
      this.renderer2.addClass(button, 'pointer-events-auto');
      this.renderer2.setProperty(button, 'innerText', 'Siguiente');
      this.renderer2.listen(button, 'click', () => this.nextCameraPosition());
      this.renderer2.appendChild(cardBody, button);
    }
    return card;
  }

  //animacion para tarjetas
  animateCardElementsPrevious(element: HTMLElement | null) {
    console.log(element);
    if (!element) return;

    this.renderer2.setStyle(element, 'transform', 'translateX(-100%)');
  }

  //Funcion para detectar espacios tridimensionales
  detectObject(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      console.log('Objeto detectado:', intersects[0].object.name);
      console.log('Posición en el espacio 3D:', intersects[0].point);
    }
  }
}

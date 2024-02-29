import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  ViewChild,
} from '@angular/core';

import {
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { LoadersService } from '../loaders.service';

export interface SceneOptions {
  width?: number;
  height?: number;
}

@Component({
  selector: 'art-scene',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss',
})
export class SceneComponent {
  // @ts-ignore
  public camera: PerspectiveCamera;
  public clock = new Clock();
  public scene: Scene = new Scene();
  private defaultOptions: SceneOptions = {
    width: window.innerWidth || 800,
    height: window.innerHeight || 600,
  };
  // @ts-ignore
  private renderer: WebGLRenderer;
  private renderFunctions: Function[] = [];

  @Input({ required: false }) options: SceneOptions = {};

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private get canvasEl(): HTMLCanvasElement {
    return this.canvas?.nativeElement;
  }

  constructor(private ngZone: NgZone, public loadersService: LoadersService) {}

  ngAfterViewInit(): void {
    this.options = Object.assign({}, this.defaultOptions, this.options);
    const w = this.options.width || this.canvasEl.width;
    const h = this.options.height || this.canvasEl.height;

    // Camera
    this.camera = new PerspectiveCamera(75, w / h, 0.1, 1000);
    this.scene.add(this.camera);
    this.scene.background = new Color('black');

    // Renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvasEl,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(w, h);

    // Lights
    const ambient = new HemisphereLight(0xffffff, 0xbbbbff, 3);
    this.scene.add(ambient);

    const light = new DirectionalLight();
    light.position.set(0.2, 1, 1);
    this.scene.add(light);

    // Controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Animation Loop
    this.ngZone.runOutsideAngular(() =>
      this.renderer.setAnimationLoop(() => this.render())
    );
  }

  // Add a function to the render loop
  addToRender(f: Function) {
    this.renderFunctions.push(f);
  }

  removeFromRender(f: Function) {
    this.renderFunctions = this.renderFunctions.filter((fn) => fn !== f);
  }

  // Render function runs on each frame
  render() {
    const delta = this.clock.getDelta();
    this.renderFunctions.forEach((f) => f(delta));
    this.renderer.render(this.scene, this.camera);
  }

  // Add an object to the scene
  addToScene(obj: Object3D) {
    this.scene.add(obj);
  }

  removeFromScene(obj: Object3D) {
    this.scene.remove(obj);
  }

  // Resize the canvas when the window is resized
  onResize(e: Event) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Set the camera's aspect ratio
    this.camera.aspect = w / h;

    // update the camera's frustum
    this.camera.updateProjectionMatrix();

    // update the size of the renderer & the canvas
    this.renderer.setSize(w, h);

    // set the pixel ratio (for mobile devices)
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
}

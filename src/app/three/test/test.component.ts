import { Component, effect, inject, input, InputSignal, NgZone } from '@angular/core';

import { Color, DirectionalLight, DirectionalLightHelper, Group, HemisphereLight, HemisphereLightHelper, Mesh, MeshPhongMaterial, Object3D, PlaneGeometry } from 'three';
import { animate, easeIn, easeInOut } from 'popmotion';

import { LayoutButtonsComponent } from '../../layout-buttons/layout-buttons.component';
import { LayoutService } from '../layout.service';
import { LoadersService } from '../loaders.service';
import { PrimitivesService } from '../primitives.service';
import { RenderTargetService } from '../render-target.service';
import { SceneComponent } from '../scene/scene.component';
import { XRService } from '../xr.service';
import { FrameService } from '../frame.service';
import { Artwork, ArtworksService } from '../../artworks.service';

@Component( {
  selector: 'art-test',
  standalone: true,
  imports: [LayoutButtonsComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
} )
export class TestComponent extends SceneComponent {
  man: any;
  frames: Object3D[] = [];
  private frameService = inject( FrameService );
  private artworksService = inject( ArtworksService );

  fa: InputSignal<Artwork> = input.required();
  focusArtwork = this.artworksService.getFocusedArtwork();
  private focusedFrame: any;

  constructor(
    ngZone: NgZone,
    loadersService: LoadersService,
    private primitives: PrimitivesService,
    xrService: XRService,
    private renderTargetService: RenderTargetService,
    private layout: LayoutService

  ) {
    super( ngZone, loadersService, xrService );
    effect( () => {
      console.log( `The current focused is: ${this.fa().url}` );
      this.frameService.updateFrame( { texture: this.fa().url, frame: this.focusedFrame } );
    } );
  }


  ngOnInit () {

    // Layout test
    this.createBoxes();

  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // Focus frame
    this.focusFrame();


    // Load the Man model
    this.man = this.loadersService.loadGLTF( {
      path: '/assets/models/man.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );

    // Environment
    this.addEnvironment();

    // Lights
    this.addLights();

  };

  focusFrame () {
    this.focusArtwork = this.artworksService.getFocusedArtwork();
    const focusedFrame = this.frameService.createFrame( this.focusArtwork );
    focusedFrame.position.z = -10;
    this.scene.add( focusedFrame );

    animate( {
      from: focusedFrame.position.z,
      to: -4,
      duration: 3000,
      ease: easeInOut,
      onUpdate: latest => focusedFrame.position.z = latest//console.log( "Updating the focused frame position ", focusedFrame.position.z )
    } );

    this.focusedFrame = focusedFrame;
    //TODO: get the texture from the gen result
    this.frameService.updateFrame( { texture: 'assets/artworks/Designer_2.webp', frame: focusedFrame } );
  }

  createLayout () {

    this.layout.sphereLayout( {
      objects: this.frames,
      n: 4,
      width: 100,
      height: 100,
      depth: 300
    } );
  }

  createBoxes () {
    const n = 20;
    let w = 800 / n;
    let h = 600 / n;
    let d = 800 / n;
    const boxes: Object3D[] = [];
    for ( let i = 0; i < 30; i++ ) {
      const box = this.primitives.createBox( { x: 2, y: 2, z: 0.5 } );
      box.position.x = w * Math.random() - w / 2;
      box.position.y = h * Math.random() - h / 2;
      box.position.z = d * Math.random() - d / 2;
      boxes.push( box );
      this.addToScene( box );
    }

    this.frames = boxes;

    // this.addToRender( () => {
    //   // const vec = new Vector3();
    //   this.frames.forEach( ( obj ) => {
    //     obj.lookAt( this.camera.position );
    //   } );
    // } );


    setTimeout( () => {
      this.createLayout();
    }, 500 );

  }

  createRenderTarget ( ops: any ) {
    const [targetRenderFunction, targetPlane, targetScene] = this.renderTargetService.createRenderTarget( ops );

    const aLogo = this.loadersService.loadGLTF( {
      path: 'assets/models/dark-objects.glb',
      onLoadCB: ( model: Object3D ) => {
        model.position.z = -5;
        model.position.x = -2;
        model.position.y = -2;
        // @ts-ignore
        targetScene.add( model );
        console.log( 'targetScene, model ', targetScene, model );
      }
    } );

    const man = this.loadersService.loadGLTF( {
      path: '/assets/models/man.glb',
      onLoadCB: ( model: Object3D ) => {
        model.position.z = -5;
        model.position.x = 0;
        model.position.y = 0;
        model.rotation.y = Math.PI / 4;
        // @ts-ignore
        targetScene.add( model );
        console.log( 'targetScene, model ', targetScene, model );
      }
    } );

    const dirLight = new DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 3, 10, 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    // @ts-ignore
    targetScene.add( dirLight );

    // @ts-ignore
    this.addToRender( () => targetRenderFunction() );

  }

  addEnvironment () {

    // Scene background
    this.scene.background = new Color( 0xa8def0 );
    // this.scene.fog = new Fog( 0xa0a0a0, 10, 50 );

    // ground
    const mesh = new Mesh( new PlaneGeometry( 20, 20 ), new MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add( mesh );
  }

  addLights () {
    const hemiLight = new HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
    hemiLight.position.set( 0, 20, 0 );

    const hHelper = new HemisphereLightHelper( hemiLight, 5, 'orange' );
    this.scene.add( hemiLight, hHelper );

    const dirLight = new DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 3, 10, 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;

    const dHelper = new DirectionalLightHelper( dirLight, 5, );
    this.scene.add( dirLight, dHelper );


    const light = new DirectionalLight();
    light.position.set( 0.2, 1.5, -2 );

    const helper = new DirectionalLightHelper( light, 5, 'red' );
    this.scene.add( light, helper );
  }

  onLoad ( model: Object3D ) {
    model.position.z = -5;
    this.scene.add( model );
  }

}

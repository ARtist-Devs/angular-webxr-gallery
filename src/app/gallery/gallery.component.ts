import { Component } from '@angular/core';

import { Object3D } from 'three';

import { ImageGenComponent } from '../ai/image-gen/image-gen.component';
import { LoadingComponent } from '../loading/loading.component';
import { SceneComponent } from '../three/scene/scene.component';
import { TestComponent } from '../three/test/test.component';

@Component( {
  selector: 'art-gallery',
  standalone: true,
  imports: [SceneComponent, LoadingComponent, TestComponent, ImageGenComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
} )

export class GalleryComponent extends SceneComponent {
  // TODO: @Input() artworks = [];
  constructor() {
    super();
  }

  override ngAfterViewInit (): void {
    super.ngAfterViewInit();

    // Load the logo
    const model = this.loadersService.loadGLTF( {
      path: '/assets/models/aLogo.glb',
      onLoadCB: this.onLoad.bind( this ),
    } );

    this.createEnv();
    // Add Camera movement
  }

  createEnv () {
    this.addLights();

    // Add Model
    // Add Frames
    // Add UI

    // this.debug();
  }

  addLights () {

  }

  // Place and animate the logo when loaded
  onLoad ( model: Object3D ) {
    model.position.z = -50;
    model.position.y = 1;
    model.name = 'aLogo';
    this.addToScene( model );
    this.addToRender( () => {
      model.rotation.y += 0.01;
    } );
  }
}

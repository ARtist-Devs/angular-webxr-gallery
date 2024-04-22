import { inject, Injectable } from '@angular/core';

import { CylinderGeometry, Group, MeshBasicMaterial, MeshPhongMaterial, SRGBColorSpace, UVMapping } from 'three';

import { Artwork } from '../artworks.service';
import { PrimitivesService } from './primitives.service';
import { LoadersService } from './loaders.service';
import { texture } from 'three/examples/jsm/nodes/nodes';

@Injectable( {
  providedIn: 'root'
} )
export class FrameService {
  private primitivesService = inject( PrimitivesService );
  private loadersService = inject( LoadersService );
  canvasMaterial = new MeshBasicMaterial();//new MeshPhongMaterial();
  // TODO: move to primitives service
  // frameGeometry: any = new CylinderGeometry( 0.8, 0.7, 0.1, 64, 5 );

  createCanvas ( artwork: Artwork ) {
    const texture = this.loadersService.loadTexture( artwork.url );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = UVMapping;
    const canvasMaterial = this.canvasMaterial.clone();
    canvasMaterial.map = texture;

    const canvas = this.primitivesService.createBox( { x: 2, y: 2, z: 0.6, material: canvasMaterial } );
    canvas.name = `Focused Canvas`;
    return canvas;

  }

  createFrame ( artwork: Artwork ) {
    const frame = new Group();
    frame.name = `Focused Frame`;

    const canvas = this.createCanvas( artwork );
    const box = this.primitivesService.createBox( { x: 4, y: 4, z: 0.5 } );
    frame.add( box, canvas );
    frame.position.y = 1;
    return frame;
  }

  updateFrame ( ops: any ) {

    const material = ops.frame.children[1].getObjectByName( `Focused Canvas` ).material;
    const texture = this.loadersService.loadTexture( ops.texture );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = UVMapping;
    material.map = texture;
    material.map.userData = { url: ops.texture };
    material.needsUpdate = true;
    // console.log( 'ops.frame', ops.frame.children[1].getObjectByName( `Focused Canvas` ).material.map, texture );

  }
}

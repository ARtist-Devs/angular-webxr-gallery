import { inject, Injectable } from '@angular/core';

import { BoxGeometry, CylinderGeometry, Group, MathUtils, Mesh, MeshPhongMaterial, SRGBColorSpace, UVMapping, Vector3 } from 'three';
import { animate, easeIn, easeInOut } from 'popmotion';

import { Artwork } from '../artworks.service';
import { LoadersService } from './loaders.service';
import { PrimitivesService } from './primitives.service';

@Injectable( {
  providedIn: 'root'
} )
export class FrameService {
  private primitivesService = inject( PrimitivesService );
  private loadersService = inject( LoadersService );

  angle = Math.PI * 6;
  canvasMaterial: MeshPhongMaterial = new MeshPhongMaterial();
  frameDistance = 7;
  frames = new Group();
  frameGeometry: any = new CylinderGeometry( 1, 0.85, 0.1, 64, 5 );
  phongMaterial = new MeshPhongMaterial();
  focusFactor = 4;

  // TODO: move materials and Meshes to their services
  createFrames ( artworks: Artwork[] ) {
    this.frames.name = 'Frames Group';

    // Angle between frames
    this.angle = ( Math.PI * 2 ) / artworks.length;

    const frames = artworks.map( ( artwork, i ) => {
      const f = this.placeFrame( this.createFrame( artwork ), i );
      f.name = `Frame ${i}`;
      return f;
    } );

    this.frames.add( ...frames );

    this.frames.position.set( 0, 1.6, 0 );
    this.focusFrame( 0 );

    return this.frames;
  }

  createFrame ( artwork: Artwork ) {
    const frame = new Group();
    frame.name = `${artwork.title} frame group`;

    // Create the frame geometry & canvas geometry
    this.frameGeometry.rotateX( Math.PI / 2 );
    const canvasGeometry = new BoxGeometry( 1, 1, 0.12 );

    // Create the canvas material with the texture
    const texture = this.loadersService.loadTexture( artwork.url );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = UVMapping;
    const canvasMaterial = this.phongMaterial.clone();
    canvasMaterial.map = texture;

    // Create the frame & canvas mesh
    const frameMaterial = this.phongMaterial.clone();
    frameMaterial.color.set( artwork.colors[0] );
    frameMaterial.needsUpdate = true;
    const frameMesh = new Mesh( this.frameGeometry, frameMaterial );

    const canvasMesh = new Mesh( canvasGeometry, canvasMaterial );
    frameMesh.name = `${artwork.title} frame mesh` || 'frame';
    canvasMesh.name = `${artwork.title} canvas mesh` || 'frame canvas';

    frame.add( frameMesh, canvasMesh );
    frame.rotateY( Math.PI );

    return frame;

  }

  createCanvas ( options: any ) {
    const ops = Object.assign( {}, { x: 2, y: 2, z: 0.6 }, options, );
    const texture = this.loadersService.loadTexture( ops.artwork.url );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = UVMapping;
    const canvasMaterial = this.canvasMaterial.clone();
    canvasMaterial.map = texture;

    const canvas = this.primitivesService.createBox( { x: ops.x, y: ops.y, z: ops.z, material: canvasMaterial } );
    canvas.name = `Focused Canvas`;

    return canvas;

  }


  updateFrame ( ops: any ) {

    const material = ops.frame.children[1].getObjectByName( `Focused Canvas` ).material;
    const texture = this.loadersService.loadTexture( ops.texture );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = UVMapping;
    material.map = texture;
    material.map.userData = { url: ops.texture };
    material.needsUpdate = true;

  }

  /**
   * Distributes frames based on their index
   * @param frame artframe
   * @param i index
   * @returns frame with location
   */
  placeFrame ( frame: Group, i: number = 0 ) {

    const alpha = i * this.angle;
    const x = Math.sin( alpha ) * this.frameDistance;// 0 - 1
    const z = -Math.cos( alpha ) * this.frameDistance;// 0 - 0
    frame.position.set( x, 0, z );
    frame.scale.set( 1.3, 1.3, 1.3 );
    frame.rotation.y = alpha;
    frame.userData['originalPosition'] = frame.position.clone();

    return frame;

  }

  moveFrame ( f: any, p: any ) {

    const to = new Vector3( p.x, p.y, p.z );
    animate( {
      from: f.position,
      to: to,
      duration: 2500,
      ease: easeInOut,
      onUpdate: latest => {
        f.position.x = latest.x;
        f.position.y = latest.y;
        f.position.z = latest.z;
      }
    } );

  }

  focusFrame ( i: number ) {

    const f = this.frames.children[i];
    const x = f.position.x / this.frameDistance * this.focusFactor;
    const z = f.position.z / this.frameDistance * this.focusFactor;
    const p = new Vector3( x, f.position.y, z );
    this.moveFrame( f, p );

  }

  resetPosition ( i: number ) {

    const f = this.frames.children[i];
    const p = f.userData['originalPosition'];
    this.moveFrame( f, p );

  }

  rotateFrames ( angle: number = 72 ) {

    // angle between frames and the current group rotation
    const y = MathUtils.degToRad( angle ) + this.frames.rotation.y;
    animate( {
      from: this.frames.rotation.y,
      to: y,
      duration: 1000,
      ease: easeInOut,
      onUpdate: latest => this.frames.rotation.y = latest
    } );

  }


  //===== For Test Component
  createFocusFrame ( artwork: Artwork ) {
    const frame = new Group();
    frame.name = `Focused Frame`;

    const canvas = this.createCanvas( { artwork: artwork } );
    const box = this.primitivesService.createBox( { x: 4, y: 4, z: 0.5 } );
    frame.add( box, canvas );
    frame.position.y = 1;

    return frame;
  }

  createSmallFrame ( ops: any ) {

    const frame = new Group();
    frame.name = 'Small frame group';
    const box = this.primitivesService.createBox( { x: 2, y: 2, z: 0.3 } );

    const canvas = this.createCanvas( { artwork: ops.artwork, x: 1, y: 1, z: 0.35 } );
    frame.add( box, canvas );

    return frame;

  }
}

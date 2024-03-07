import { Injectable } from '@angular/core';
import { BoxGeometry, DynamicDrawUsage, InstancedMesh, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry } from 'three';

@Injectable( {
  providedIn: 'root'
} )
export class PrimitivesService {
  public material = new MeshBasicMaterial( { color: 0x00ff00 } );
  public floorMaterial = new MeshPhongMaterial( { color: 'white', depthWrite: false } );
  constructor() { }

  createInstancedMesh ( options: any ) {
    const ops = Object.assign( {}, { geometry: new BoxGeometry(), material: this.material, count: 100 } );
    // ops.geometry.scale( 0.2, 0.2, 0.2 );
    const mesh = new InstancedMesh( ops.geometry, ops.material, ops.count );
    // mesh.instanceMatrix.setUsage( DynamicDrawUsage );
    mesh.matrixWorldNeedsUpdate = true;
    console.log( 'Mesh ', mesh );
    return mesh;
  }

  createPlane ( ops: any ) {
    const geo = ops.size ? new PlaneGeometry( ops.width, ops.height ) : new PlaneGeometry();
    const mesh = new Mesh( geo, ops.material || this.floorMaterial );
    return mesh;
  }

  createBox () {
    const boxGeo = new BoxGeometry( 10, 10, 10 );
    const material = new MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new Mesh( boxGeo, material );
    cube.position.y = 1;
    return cube;
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgZone,
} from '@angular/core';

import { MeshBasicMaterial } from 'three';

import { LoadersService } from '../three/loaders.service';
import { SceneComponent } from '../three/scene/scene.component';

@Component({
  selector: 'art-loading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent extends SceneComponent {
  //  loadersService = inject(LoadersService)
  @Input() delta = 0;
  constructor(ngZone: NgZone, loadersService: LoadersService) {
    super(ngZone, loadersService);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    const mesh = this.loadersService.loadGLTF({
      path: '/assets/models/aLogo.glb',
      onLoadCB: this.onLoad.bind(this),
    });
  }

  onLoad(model: any) {
    console.log('Model loaded on loading', model);
    // @ts-ignore
    model.material = new MeshBasicMaterial({ color: 0x00ff00 });
    model.position.z = -30;
    this.addToScene(model);
    // @ts-ignore
    this.addToRender(() => {
      model.rotation.y += 0.01;
    });
  }
}

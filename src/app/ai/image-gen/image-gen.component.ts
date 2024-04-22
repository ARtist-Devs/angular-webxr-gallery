import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Artwork } from '../../artworks.service';
import { GenerativeService } from '../generative.service';
import { SpeechService } from '../speech.service';


@Component( {
  selector: 'art-image-gen',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './image-gen.component.html',
  styleUrl: './image-gen.component.scss'
} )
export class ImageGenComponent {
  protected prompt = '';
  private speech = inject( SpeechService );
  private generative = inject( GenerativeService );
  // TODO: do I need generated Image here?
  public generatedImage: Artwork;

  newArtworkEvent = output<Artwork>();
  async generateImage () {
    console.log( 'Querying the model with prompt', this.prompt );
    this.generatedImage = await this.generative.generateImage( this.prompt );
    this.newArtworkEvent.emit( this.generatedImage );
  }

  // TODO
  speechInput () { }

};

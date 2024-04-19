import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpeechService } from '../speech.service';
import { GenerativeService } from '../generative.service';


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
  public generatedImage = { url: '', description: '', title: '', width: 500, height: 500 };

  async generateImage () {
    console.log( 'Querying the model with prompt', this.prompt );
    this.generatedImage.url = await this.generative.generateImage( this.prompt );
  }

  speechInput () { }

}

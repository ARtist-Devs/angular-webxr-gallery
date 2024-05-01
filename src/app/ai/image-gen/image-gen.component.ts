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
  private generative = inject( GenerativeService );
  private speech = inject( SpeechService );

  newArtworkEvent = output<Artwork>();
  newArtworksEvent = output<Artwork[]>();

  prompt = '';
  question: string = '';


  genImage () {

    this.prompt = this.prompt == '' ? 'A steampunk era science lab with a stylish figure in silhouette with dramatic lighting and vibrant colors dominated with copper hue' : this.prompt;
    this.question = this.question == '' ? 'Describe the image and tell me what makes this artwork beautiful' : this.question;

    // Call the service to generate image and emit the new image info
    this.generative.generateImage( { prompt: this.prompt, question: this.question } ).subscribe( ( response ) => {
      console.log( response );
      const image = {
        // @ts-expect-error
        url: `data:image/png;base64,${response.image}`,
        // @ts-expect-error
        description: response.caption
      };

      this.newArtworkEvent.emit( image );

    } );

  }

  genImages () {

    this.prompt = this.prompt == '' ? 'A steampunk era science lab with a stylish figure in silhouette with dramatic lighting and vibrant colors dominated with copper hue' : this.prompt;
    this.question = this.question == '' ? 'Describe the image and tell me what makes this artwork beautiful' : this.question;

    // Call the service to generate image and emit the new image info
    this.generative.generateImages( { prompt: this.prompt, question: this.question } ).subscribe( ( response ) => {
      console.log( response );
      let images: Artwork[] = [];
      let i = 0;
      for ( const [key, value] of Object.entries( response ) ) {
        console.log( `${key}: ${value}` );
        const image = {
          id: i,
          url: `data:image/png;base64,${value.image}`,
          description: `${value.caption}`
        };
        images.push( image );
        i++;
      }


      this.newArtworksEvent.emit( images );

    } );

  }

  // TODO
  speechInput () { }

};

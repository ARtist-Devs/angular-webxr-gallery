import { Injectable } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class GenerativeService {


  async generateImage ( prompt: string ) {
    const imageUrl = 'assets/artworks/almond_blossom.webp';
    return imageUrl;
  }
}

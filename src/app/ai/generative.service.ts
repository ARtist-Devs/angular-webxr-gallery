import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable( {
      providedIn: 'root'
} )
export class GenerativeService {

      private http = inject( HttpClient );
      private url = environment.GEMINI_API_URL;

      generateImages ( ops: any ) {

            const imagePrompt = ops.prompt;
            const question = ops.question;
            const params = {
                  image_prompt: encodeURIComponent( imagePrompt ),
                  desc_prompt: encodeURIComponent( question ),
                  image_count: 5
            };
            const options = {
                  params: params,
                  headers: new HttpHeaders( { 'Content-Type': 'header' } )
            };

            return this.http.get( `https://us-central1-imagenio.cloudfunctions.net/xr-gallery-py-staging-2`, options );
            // return this.http.get( `${this.url}-staging`, options );
      }

}

import { Injectable } from '@angular/core';

@Injectable( {
      providedIn: 'root'
} )
export class GenerativeService {


      async generateImage ( prompt: string ) {
            // TODO: get from Vertex
            const image = {
                  id: 4,
                  title: "Roman Forum",
                  audio: "assets/audio/1.mp3",
                  date: "1889",
                  description:
                        "Van Gogh painted this still life in the psychiatric hospital in Saint-Remy. For him, the painting was mainly a study in color. He set out to achieve a powerful color contrast. By placing the purple flowers against a yellow background, he made the decorative forms stand out even more strongly. The irises were originally purple. But as the red pigment has faded, they have turned blue. Van Gogh made two paintings of this bouquet. In the other still life, he contrasted purple and pink with green.",
                  height: 93,
                  url: "assets/artworks/Designer_15.jpeg",
                  prompt: 'Streets of of Roma Forum in year 300',
                  votes: 56,
                  width: 74,
                  wiki: "https://en.wikipedia.org/wiki/Vase_with_Irises_Against_a_Yellow_Background",
                  colors: [
                        "rgb(16, 96, 139)",
                        "rgb(92, 139, 148)",
                        "rgb(63, 107, 72)",
                        "rgb(134, 120, 165)",
                        "rgb(12, 46, 87)",
                        "rgb(243, 232, 85)",
                        "rgb(124, 158, 162)",
                        "rgb(246, 242, 132)",
                        "rgb(227, 208, 101)",
                        "rgb(168, 128, 183)",
                  ],
            };
            return image;
      }
}

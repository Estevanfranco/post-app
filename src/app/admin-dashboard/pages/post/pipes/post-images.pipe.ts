import { Pipe, PipeTransform } from '@angular/core';
import { environments } from 'src/app/environments/environments.development';


const baseUrl = environments.apiURL;

@Pipe({
    name: 'PostImages',
})
export class PostImagesPipe implements PipeTransform {
    transform(value: string): string {
        if(value === 'new'){
            return './assets/images/post/post-image.png'
        }
        return `${baseUrl}/posts/images/${value}`;
    }


}
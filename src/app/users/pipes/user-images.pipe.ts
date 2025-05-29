import { Pipe, PipeTransform } from '@angular/core';
import { environments } from '../../environments/environments.development';

const baseUrl = environments.apiURL;

@Pipe({
    name: 'UserImages',
})
export class UserImagesPipe implements PipeTransform {
    transform(value: string): string {
        if(value === 'new'){
            return './assets/images/avatar/avatar-user.png'
        }
        return `${baseUrl}/users/avatar/${value}`;
    }


}
import { Component, inject, input } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { User } from '@users/interfaces/user.interfaces';
import { UserImagesPipe } from '@users/pipes/user-images.pipe';
import { UserService } from '@users/services/user.service';
import { RolesService } from '@roles/services/roles.service';


@Component({
  selector: 'user-detail',
  standalone: true,
  imports: [ReactiveFormsModule , UserImagesPipe],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent {
  user = input.required<User>();
  router = inject(Router);
  fb = inject(FormBuilder);
  previeIMG = false;
  previewURL: string | null = null;
  avatarFile: File | null = null;

  UserService = inject(UserService);
  RoleService = inject(RolesService);


  userForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    role_id: ['', Validators.required],
    password: [''],
    avatar: [''],
  });

  rolesResource = rxResource({
    request: () => ({limit: 50 }),
    loader: ({ request }) => {
      return this.RoleService.getRoles({ limit: request.limit});
    }
  });

  ngOnInit() {
    this.userForm.patchValue({
      first_name: this.user().first_name,
      last_name: this.user().last_name,
      email: this.user().email,
      telephone: this.user().telephone,
      role_id: this.user().Role.id ?? this.user().Role.id ?? 0,
      avatar: this.user().avatar,
      password: this.user().password,
    });
  }

  onSubmit() {
    const isValid = this.userForm.valid;
    if (!isValid) return;

    const formValue = this.userForm.value;

    if (this.user().id === 'new') {
      this.UserService.created(formValue).subscribe((resp) => {
        if(this.avatarFile){
          this.UserService.uploadAvatar(resp.data.id, this.avatarFile).subscribe(() =>{
            Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Product created',
            showConfirmButton: false,
            timer: 1500,
          });
          })
        }
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Product created',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/dashboard/users', resp.data.id]);
      });
    } else {
      this.UserService.updated(this.user().id, formValue).subscribe((resp) => {
        if(this.avatarFile){
          this.UserService.uploadAvatar(this.user().id, this.avatarFile).subscribe(() =>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Prodcut Updated',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
       Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Prodcut Updated',
            showConfirmButton: false,
            timer: 1500,
        });
    });
  }
}

  onFIlesChange(event: Event){
    const file = (event.target as HTMLInputElement).files;
    if(file && file.length > 0){
      this.previeIMG = true;
      this.previewURL = URL.createObjectURL(file[0])
      this.avatarFile = file[0];
    }
  }
}

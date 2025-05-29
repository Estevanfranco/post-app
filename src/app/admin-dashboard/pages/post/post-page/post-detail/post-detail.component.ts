import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '@post/interfaces/post.interfaces';
import Swal from 'sweetalert2';
import { PostImagesPipe } from '../../pipes/post-images.pipe';
import { PostService } from '@post/services/post.service';
import { UserService } from '@users/services/user.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'post-detail',
  imports: [ReactiveFormsModule, PostImagesPipe],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent {
  post = input.required<Post>();
  router = inject(Router);
  fb = inject(FormBuilder);
  previeIMG = false;
  previewURL: string | null = null;
  imageFile: File | null = null;

  PostService = inject(PostService)
  UserService = inject(UserService);
  


  postForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    author_id: ['', Validators.required],
    image: [''],
  });

  usersResource = rxResource({
    request: () => ({limit: 50 }),
    loader: ({ request }) => {
      return this.UserService.getUsers({ limit: request.limit});
    }
  });

  ngOnInit() {
    this.postForm.patchValue({
      title: this.post().title,
      content: this.post().content,
      author_id: this.post()?.author_id ?? this.post().Author.id ?? 0, 
      image: this.post().image,
    });
  }

  onSubmit() {
    const isValid = this.postForm.valid;
    if (!isValid) return;

    const formValue = this.postForm.value;

    if (this.post().id === 'new') {
      this.PostService.created(formValue).subscribe((resp) => {
        if(this.imageFile){
          this.PostService.uploadImage(resp.data.id, this.imageFile).subscribe(() =>{
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
        this.router.navigate(['/dashboard/posts', resp.data.id]);
      });
    } else {
      this.PostService.updated(this.post().id, formValue).subscribe((resp) => {
        if(this.imageFile){
          this.PostService.uploadImage(this.post().id, this.imageFile).subscribe(() =>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Post Updated',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
       Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Post Updated',
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
      this.imageFile = file[0];
    }
  }
}

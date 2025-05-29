import { Component, effect, inject, input, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PostService } from '@post/services/post.service';
import { PostDetailComponent } from './post-detail/post-detail.component';

@Component({
  selector: 'app-post-page',
  imports: [PostDetailComponent],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.css'
})
export class PostPageComponent {
  id = input.required<string>();
  postSevice = inject(PostService);
  router = inject(Router);

  postId = linkedSignal(this.id);

  postResource = rxResource({
    request: () => ({ id: this.postId() }),
    loader: ({ request }) => {
      return this.postSevice.getPost(request.id);
    }
  });

  redirectEffect = effect(() => {
    if (this.postResource.error()) {
      this.router.navigate(['/dashboard/posts']);
    }
  });
}

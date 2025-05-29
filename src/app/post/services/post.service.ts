import { Injectable } from '@angular/core';
import { PostsResponse, PostResponse, Post } from '@post/interfaces/post.interfaces';
import { Options } from '@shared/interfaces/shared.interfaces';
import { BaseHttpService } from '@shared/services/base-http.service';
import { User } from '@users/interfaces/user.interfaces';
import { Observable, of, tap } from 'rxjs';

const emptyPost: Post = {
  id: 'new',
  title: '',
  content: '',
  image: 'post-image.png',
  createdAt: new Date(),
  updatedAt: new Date(),
  Author: {} as User
};

@Injectable({
  providedIn: 'root'
})
export class PostService  extends BaseHttpService {
    private postCache = new Map<string, PostResponse>();
    private postsCache = new Map<string, PostsResponse>();

    getPosts(options: Options): Observable<PostsResponse> {
      const { limit = 4, page = 1} = options;
      const key = `posts-${page}-${limit}`;

      if(this.postsCache.has(key)) {
        return of(this.postsCache.get(key)!);
      }

      return this.http
      .get<PostsResponse>(`${this.apiUrl}/posts`,{params: { limit, page }})
      .pipe(tap((resp) => this.postsCache.set(key, resp)));
    }

    getPost(id: string): Observable<PostResponse> {
    if (id === 'new') {
        return of({
        success: false,
        message: '',
        data: emptyPost, 
      });
    }
    if (this.postCache.has(id)) {
      return of(this.postCache.get(id)!);
    }
    return this.http
      .get<PostResponse>(`${this.apiUrl}/posts/${id}`)
      .pipe(tap((resp) => this.postCache.set(id, resp)));
  }

  created(data: any): Observable<PostResponse> {
      return this.http
        .post<PostResponse>(`${this.apiUrl}/posts`, data)
        .pipe(tap((resp) => this.addPostToCache(resp)));
    }
  
    updated(id: string, data: any): Observable<PostResponse> {
      return this.http
        .put<PostResponse>(`${this.apiUrl}/posts/${id}`, data)
        .pipe(tap((resp) => this.updatePostCache(id, data)));
    }

    addPostToCache(postResponse: PostResponse) {
        if (!postResponse.data.id) return;
    
        this.postCache.set(postResponse.data.id, postResponse);
        this.postsCache.forEach((postsResponse) => {
          postsResponse.data.posts= [
            postResponse.data,
            ...postsResponse.data.posts,
          ];
        });
      }
      updatePostCache(id: any, post: any) {
        post.id = id;
        const data: PostResponse = {
          success: true,
          message: '',
          data: post,
        };
        this.postCache.set(id, post);
    
        this.postsCache.clear();
      }

    deletedPost(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${id}`);
  }

  uploadImage(id: string, image: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.put<string>(`${this.apiUrl}/posts/image/${id}`, formData);
  }
}

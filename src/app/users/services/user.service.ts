import { inject, Injectable } from '@angular/core';
import { forkJoin ,Observable, of, tap } from 'rxjs';
import { BaseHttpService } from '@shared/services/base-http.service';
import {
  User,
  UserResponse,
  UsersResponse,
} from '../interfaces/user.interfaces';
import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Options } from '@shared/interfaces/shared.interfaces';
import { Role } from '@roles/interfaces/role.interfaces';
const emptyUser: User = {
  id: 'new',
  first_name: '',
  last_name: '',
  email: '',
  telephone: '',
  avatar: 'avatar-user.png',
  password: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  Role: {} as Role,
};

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseHttpService {
  private UserCache = new Map<string, UserResponse>();
  private UsersCache = new Map<string, UsersResponse>();
  authService = inject(AuthService);
  router = inject(Router);

  getUsers(options: Options): Observable<UsersResponse> {
    const { limit = 4, page = 1 } = options;
    const key = `products-${page}-${limit}`;

    if (this.UsersCache.has(key)) {
      return of(this.UsersCache.get(key)!);
    }

    return this.http
      .get<UsersResponse>(`${this.apiUrl}/users`, { params: { limit, page } })
      .pipe(tap((resp) => this.UsersCache.set(key, resp)));
  }

  getUser(id: string): Observable<UserResponse> {
    if (id === 'new')
      return of({
        success: false,
        message: '',
        data: emptyUser,
      });

    if (this.UserCache.has(id)) {
      return of(this.UserCache.get(id)!);
    }
    return this.http
      .get<UserResponse>(`${this.apiUrl}/users/${id}`)
      .pipe(tap((resp) => this.UserCache.set(id, resp)));
  }
  created(data: any): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(`${this.apiUrl}/users`, data)
      .pipe(tap((resp) => this.addUserToCache(resp)));
  }

  updated(id: string, data: any): Observable<UserResponse> {
    return this.http
      .patch<UserResponse>(`${this.apiUrl}/users/${id}`, data)
      .pipe(tap((resp) => this.updateUserCache(id, data)));
  }

  addUserToCache(userResponse: UserResponse) {
    if (!userResponse.data.id) return;

    this.UserCache.set(userResponse.data.id, userResponse);
    this.UsersCache.forEach((usersResponse) => {
      usersResponse.data.users = [
        userResponse.data,
        ...usersResponse.data.users,
      ];
    });
  }
  updateUserCache(id: any, user: any) {
    user.id = id;
    const data: UserResponse = {
      success: true,
      message: '',
      data: user,
    };
    this.UserCache.set(id, user);

    this.UsersCache.forEach((usersResponse) => {
      usersResponse.data.users = usersResponse.data.users.map((currentUser) =>
        currentUser.id === id ? user : currentUser,
      );
    });

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parseUser = JSON.parse(storedUser);
      if (parseUser.id === id) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  }

  uploadAvatar(id: string, image: File): Observable<string> {
    const formData = new FormData();
    formData.append('avatar', image);
    return this.http.put<string>(`${this.apiUrl}/users/avatar/${id}`, formData);
  }

  deletedUser(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/users/${id}`)
      .pipe(tap((resp) => this.removeIfSameUser(id)));
  }

  removeIfSameUser(id: string) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parseUser = JSON.parse(storedUser);
      if (parseUser.id === id) {
        this.authService.logout();
        Swal.fire({
          position: 'center',
          icon: 'info',
          title: 'Tu cuenta ha sido eliminada, Has sido Desconectado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/auth/login']);
      } else {
        Swal.fire({
          title: 'Borrado!!',
          text: 'Cuenta borrada con exito',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Eliminar Perfil',
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      }
    }
  }
}

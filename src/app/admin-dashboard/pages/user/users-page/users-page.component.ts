import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UserTableComponent } from '@users/components/user-table/user-table.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { UserService } from '@users/services/user.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-user-page',
  imports: [
    UserTableComponent,
    PaginationComponent,
    RouterLink,
    PaginationComponent,
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
})
export class UsersPageComponent {
  userService = inject(UserService);
  paginationService = inject(PaginationService);
  limit = signal(4);

  setLimit = (limit: string) => {
    this.limit.set(Number(limit));
  };

  userResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage(),
      limit: this.limit(),
    }),
    loader: ({ request }) => {
      return this.userService.getUsers({
        limit: request.limit,
        page: request.page,
      });
    },
  });

  deletedUser(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deletedUser(id).subscribe(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Usuario Eliminado Correctamente',
            showConfirmButton: false,
            timer: 1500,
          });
        });
        location.reload();
      }
    });
  }
}

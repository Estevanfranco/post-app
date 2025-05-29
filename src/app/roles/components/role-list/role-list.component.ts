import { Component, input, output, signal } from '@angular/core';

import { RoleModalComponent } from '../role-modal/role-modal.component';
import { Role } from '@roles/interfaces/role.interfaces';

@Component({
  selector: 'role-list',
  imports: [RoleModalComponent],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent {
  roles = input.required<Role[]>()
  openModal = signal(false);
  currentRole = signal({} as Role);
  delete = output<string>();

  emitDeleted(id: string){
    this.delete.emit(id);
  }
  editRole(role: Role){
    this.openModal.set(true)
    this.currentRole.set(role);
  }
}

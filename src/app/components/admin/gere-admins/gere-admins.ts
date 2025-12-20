import { Component } from '@angular/core';

type ModalMode = 'create' | 'edit' | 'delete' | null;

type Admin = {
  id: number;
  username: string;
  passwordUpdatedAt?: string;
};

type AdminDraft = {
  username: string;
  password: string;
  confirmPassword: string;
};

@Component({
  selector: 'app-gere-admins',
  standalone: true,
  imports: [],
  templateUrl: './gere-admins.html',
  styleUrl: './gere-admins.scss',
})
export class GereAdmins {
  admins: Admin[] = [
    { id: 1, username: 'jeanne.doe' },
    { id: 2, username: 'pierre.martin' },
    { id: 3, username: 'aline.bernard' },
  ];

  activeModal: ModalMode = null;
  selectedAdmin: Admin | null = null;
  draft: AdminDraft = { username: '', password: '', confirmPassword: '' };

  private nextId = 4;

  get isFormModalOpen(): boolean {
    return this.activeModal === 'create' || this.activeModal === 'edit';
  }

  get isDeleteModalOpen(): boolean {
    return this.activeModal === 'delete';
  }

  get draftValid(): boolean {
    return this.draft.username.trim().length > 0;
  }

  get passwordValid(): boolean {
    return (
      this.draft.password.length > 0 && this.draft.password === this.draft.confirmPassword
    );
  }

  get hasPasswordInput(): boolean {
    return this.draft.password.length > 0 || this.draft.confirmPassword.length > 0;
  }

  get canSubmit(): boolean {
    if (!this.draftValid) {
      return false;
    }

    if (this.activeModal === 'create' || this.activeModal === 'edit') {
      return this.passwordValid;
    }

    return false;
  }

  openCreateModal(): void {
    this.activeModal = 'create';
    this.selectedAdmin = null;
    this.draft = { username: '', password: '', confirmPassword: '' };
  }

  openEditModal(admin: Admin): void {
    this.activeModal = 'edit';
    this.selectedAdmin = admin;
    this.draft = { username: admin.username, password: '', confirmPassword: '' };
  }

  openDeleteModal(admin: Admin): void {
    this.activeModal = 'delete';
    this.selectedAdmin = admin;
  }

  closeModal(): void {
    this.activeModal = null;
    this.selectedAdmin = null;
  }

  saveAdmin(event?: Event): void {
    event?.preventDefault();
    if (!this.draftValid || !this.passwordValid) {
      return;
    }

    const username = this.draft.username.trim();
    if (this.activeModal === 'create') {
      this.admins = [...this.admins, { id: this.nextId++, username }];
      this.closeModal();
      return;
    }

    if (this.activeModal === 'edit' && this.selectedAdmin) {
      const targetId = this.selectedAdmin.id;
      this.admins = this.admins.map((admin) =>
        admin.id === targetId
          ? { ...admin, username, passwordUpdatedAt: new Date().toISOString() }
          : admin,
      );
    }

    this.closeModal();
  }

  confirmDelete(): void {
    if (!this.selectedAdmin) {
      this.closeModal();
      return;
    }

    const targetId = this.selectedAdmin.id;
    this.admins = this.admins.filter((admin) => admin.id !== targetId);
    this.closeModal();
  }
}

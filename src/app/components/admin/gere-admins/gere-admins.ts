import { Component, OnInit, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Admin, AdminDraft, ModalMode } from '../../../models/admin.models';
import { Api } from '../../../services/api/api';


@Component({
  selector: 'app-gere-admins',
  imports: [FormsModule],
  templateUrl: './gere-admins.html',
  styleUrl: './gere-admins.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GereAdmins implements OnInit {
  readonly admins = signal<Admin[]>([]);
  readonly activeModal = signal<ModalMode>(null);
  readonly selectedAdmin = signal<Admin | null>(null);
  readonly draft = signal<AdminDraft>({ username: '', password: '', confirmPassword: '' });
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly statusMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);

  constructor(protected api: Api){}

  readonly isFormModalOpen = computed(() => {
    const modal = this.activeModal();
    return modal === 'create' || modal === 'edit';
  });

  ngOnInit(): void {
    this.getAdminList();
  }

  getAdminList(): void {
    this.loading.set(true);
    this.loadError.set(null);
    
    this.api.getAdminList().subscribe({
      next: (data) => {
        this.admins.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[GereAdmins] Erreur:', err);
        this.loadError.set('Impossible de charger la liste des administrateurs.');
        this.loading.set(false);
      }
    });
  }
  
  retry(): void {
    this.getAdminList();
  }

  readonly isDeleteModalOpen = computed(() => this.activeModal() === 'delete');

  readonly draftValid = computed(() => this.draft().username.trim().length > 0);

  readonly passwordValid = computed(() => {
    const current = this.draft();
    return current.password.length > 0 && current.password === current.confirmPassword;
  });

  readonly hasPasswordInput = computed(() => {
    const current = this.draft();
    return current.password.length > 0 || current.confirmPassword.length > 0;
  });

  readonly canSubmit = computed(() => {
    if (!this.draftValid()) {
      return false;
    }

    const modal = this.activeModal();
    if (modal === 'create' || modal === 'edit') {
      return this.passwordValid();
    }

    return false;
  });

  openCreateModal(): void {
    this.activeModal.set('create');
    this.selectedAdmin.set(null);
    this.resetDraft();
  }

  openEditModal(admin: Admin): void {
    this.activeModal.set('edit');
    this.selectedAdmin.set(admin);
    this.draft.set({ username: admin.username, password: '', confirmPassword: '' });
  }

  openDeleteModal(admin: Admin): void {
    this.activeModal.set('delete');
    this.selectedAdmin.set(admin);
  }

  closeModal(): void {
    this.activeModal.set(null);
    this.selectedAdmin.set(null);
    this.resetDraft();
  }

  updateDraft(patch: Partial<AdminDraft>): void {
    this.draft.update((current) => ({ ...current, ...patch }));
  }

  private showStatusMessage(type: 'success' | 'error', text: string): void {
    this.statusMessage.set({ type, text });
    setTimeout(() => {
      this.statusMessage.set(null);
    }, 5000);
  }

  saveAdmin(event?: Event): void {
    event?.preventDefault();
    if (!this.draftValid() || !this.passwordValid()) {
      return;
    }

    const currentDraft = this.draft();
    const username = currentDraft.username.trim();
    const password = currentDraft.password;
    const modal = this.activeModal();

    if (modal === 'create') {
      this.api.addAdmin({ username, password }).subscribe({
        next: (created) => {
          this.admins.update((admins) => [...admins, created]);
          this.showStatusMessage('success', `Administrateur "${username}" créé avec succès.`);
          this.closeModal();
        },
        error: (error) => {
          console.error("Erreur lors de la création de l'administrateur :", error);
          this.showStatusMessage('error', 'Erreur lors de la création de l\'administrateur.');
        },
      });
      return;
    }

    if (modal === 'edit') {
      const target = this.selectedAdmin();
      if (!target) {
        this.closeModal();
        return;
      }

      const payload: Partial<{ username: string; password: string }> = { username };
      if (password.length > 0) {
        payload.password = password;
      }

      this.api.updateAdmin(target.id, payload).subscribe({
        next: (updated) => {
          this.admins.update((admins) =>
            admins.map((admin) => (admin.id === updated.id ? updated : admin)),
          );
          this.showStatusMessage('success', `Administrateur "${username}" mis à jour avec succès.`);
          this.closeModal();
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour de l'administrateur :", error);
          this.showStatusMessage('error', 'Erreur lors de la mise à jour de l\'administrateur.');
        },
      });
    }

  }

  confirmDelete(): void {
    const target = this.selectedAdmin();
    if (!target) {
      this.closeModal();
      return;
    }

    this.api.deleteAdmin(target.id).subscribe({
      next: () => {
        this.admins.update((admins) => admins.filter((admin) => admin.id !== target.id));
        this.showStatusMessage('success', `Administrateur "${target.username}" supprimé avec succès.`);
        this.closeModal();
      },
      error: (error) => {
        console.error("Erreur lors de la suppression de l'administrateur :", error);
        this.showStatusMessage('error', 'Erreur lors de la suppression de l\'administrateur.');
      },
    });
  }

  private resetDraft(): void {
    this.draft.set({ username: '', password: '', confirmPassword: '' });
  }
}

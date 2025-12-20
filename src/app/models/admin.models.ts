export type Admin = {
    id: number;
    username: string;
    passwordUpdatedAt?: string;
};

export type AdminDraft = {
    username: string;
    password: string;
    confirmPassword: string;
};

export type ModalMode = 'create' | 'edit' | 'delete' | null;
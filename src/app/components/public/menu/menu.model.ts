<<<<<<< HEAD
// menu.model.ts (recommandé pour séparer les modèles)
export interface Menu {
    id: number;
    jour: string;
    periode: Periode;
    entree: string;
    plats: string;
    accompagnement: string;
    fromage: string;
    dessert: string;
}

export enum Periode {
    MIDI = "midi",
    Soir = "soir",
}
=======
// menu.model.ts (recommandé pour séparer les modèles)
export interface Menu {
    id: number;
    jour: string;
    periode: Periode;
    entree: string;
    plats: string;
    accompagnement: string;
    fromage: string;
    dessert: string;
}

export enum Periode {
    MIDI = "midi",
    Soir = "soir",
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a

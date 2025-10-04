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

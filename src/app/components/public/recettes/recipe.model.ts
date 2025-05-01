export interface recipe {
    id:           number;
    nom:          string;
    slug:         string;
    intro:        string;
    ingredients:  string[];
    ustensiles:   string[];
    preparation:  string[];
    conseil:      string;
    presentation: string;
    image:        string;
}

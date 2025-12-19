export interface menus {
  id: number
  jour: string
  periode: string
  entree: string
  plat: string
  fromage: string
  dessert: string
}

export interface createMenuPayload {
  jour: string
  periode: string
  entree: string
  plat: string
  fromage: string
  dessert: string
}

export interface MenuResponse {
  message: string
  menu: menus | null
}

export interface AddMenuResponse extends MenuResponse {
  created: boolean
}

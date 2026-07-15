import type {
  Activity,
  Household,
  HouseLocation,
  InventoryItem,
  Member,
  Recipe,
  ServiceExpense,
  ShoppingItem,
} from './types'

/** "Hoy" de referencia para los datos de ejemplo: 14/07/2026 */
export const TODAY = '2026-07-14'

export const household: Household = {
  name: 'Casa de los Fernández',
  code: 'HOGAR-7K3M',
}

export const members: Member[] = [
  { id: 'm1', name: 'Sofía', initials: 'SO', color: 'oklch(0.61 0.15 42)', online: true },
  { id: 'm2', name: 'Mateo', initials: 'MA', color: 'oklch(0.68 0.16 52)', online: true },
  { id: 'm3', name: 'Valen', initials: 'VA', color: 'oklch(0.63 0.13 150)', online: false },
]

export const locations: HouseLocation[] = [
  { id: 'l1', name: 'Heladera', icon: 'fridge' },
  { id: 'l2', name: 'Alacena', icon: 'pantry' },
  { id: 'l3', name: 'Baño', icon: 'bath' },
  { id: 'l4', name: 'Lavadero', icon: 'laundry' },
  { id: 'l5', name: 'Freezer', icon: 'freezer' },
]

export const inventory: InventoryItem[] = [
  // Heladera
  { id: 'i1', name: 'Leche La Serenísima', quantity: 1, unit: 'l', locationId: 'l1', minStock: 3, expiry: '2026-07-16', updatedBy: 'm1', updatedAt: '2026-07-13' },
  { id: 'i2', name: 'Huevos', quantity: 12, unit: 'unidades', locationId: 'l1', minStock: 6, expiry: '2026-07-28', updatedBy: 'm2', updatedAt: '2026-07-12' },
  { id: 'i3', name: 'Queso cremoso', quantity: 500, unit: 'g', locationId: 'l1', minStock: 200, expiry: '2026-07-20', updatedBy: 'm1', updatedAt: '2026-07-11' },
  { id: 'i4', name: 'Yogur Ser', quantity: 2, unit: 'unidades', locationId: 'l1', minStock: 4, expiry: '2026-07-15', updatedBy: 'm3', updatedAt: '2026-07-10' },
  { id: 'i5', name: 'Manteca', quantity: 200, unit: 'g', locationId: 'l1', expiry: '2026-08-05', updatedBy: 'm2', updatedAt: '2026-07-09' },
  { id: 'i6', name: 'Jamón cocido', quantity: 300, unit: 'g', locationId: 'l1', minStock: 150, expiry: '2026-07-17', updatedBy: 'm1', updatedAt: '2026-07-13' },
  { id: 'i7', name: 'Tomate', quantity: 4, unit: 'unidades', locationId: 'l1', expiry: '2026-07-19', updatedBy: 'm2', updatedAt: '2026-07-12' },

  // Alacena
  { id: 'i8', name: 'Fideos Matarazzo', quantity: 3, unit: 'paquetes', locationId: 'l2', minStock: 2, updatedBy: 'm1', updatedAt: '2026-07-08' },
  { id: 'i9', name: 'Arroz Gallo Oro', quantity: 1, unit: 'kg', locationId: 'l2', minStock: 1, updatedBy: 'm2', updatedAt: '2026-07-05' },
  { id: 'i10', name: 'Aceite Natura', quantity: 1, unit: 'l', locationId: 'l2', minStock: 1, updatedBy: 'm1', updatedAt: '2026-07-06' },
  { id: 'i11', name: 'Yerba Playadito', quantity: 1, unit: 'kg', locationId: 'l2', minStock: 1, updatedBy: 'm3', updatedAt: '2026-07-07' },
  { id: 'i12', name: 'Azúcar Ledesma', quantity: 1, unit: 'kg', locationId: 'l2', minStock: 1, updatedBy: 'm2', updatedAt: '2026-07-04' },
  { id: 'i13', name: 'Harina 000', quantity: 2, unit: 'kg', locationId: 'l2', minStock: 1, updatedBy: 'm1', updatedAt: '2026-07-03' },
  { id: 'i14', name: 'Puré de tomate', quantity: 4, unit: 'unidades', locationId: 'l2', minStock: 2, updatedBy: 'm2', updatedAt: '2026-07-09' },
  { id: 'i15', name: 'Café La Virginia', quantity: 1, unit: 'paquetes', locationId: 'l2', minStock: 1, updatedBy: 'm1', updatedAt: '2026-07-02' },
  { id: 'i16', name: 'Sal fina', quantity: 1, unit: 'kg', locationId: 'l2', updatedBy: 'm3', updatedAt: '2026-06-28' },

  // Baño
  { id: 'i17', name: 'Papel higiénico Higienol', quantity: 1, unit: 'paquetes', locationId: 'l3', minStock: 2, updatedBy: 'm1', updatedAt: '2026-07-12' },
  { id: 'i18', name: 'Shampoo Sedal', quantity: 1, unit: 'unidades', locationId: 'l3', minStock: 1, updatedBy: 'm2', updatedAt: '2026-07-01' },
  { id: 'i19', name: 'Jabón Dove', quantity: 3, unit: 'unidades', locationId: 'l3', minStock: 2, updatedBy: 'm3', updatedAt: '2026-07-05' },
  { id: 'i20', name: 'Pasta dental Colgate', quantity: 2, unit: 'unidades', locationId: 'l3', minStock: 1, updatedBy: 'm1', updatedAt: '2026-06-30' },

  // Lavadero
  { id: 'i21', name: 'Detergente Magistral', quantity: 1, unit: 'unidades', locationId: 'l4', minStock: 2, updatedBy: 'm2', updatedAt: '2026-07-11' },
  { id: 'i22', name: 'Jabón en polvo Ala', quantity: 1, unit: 'kg', locationId: 'l4', minStock: 1, updatedBy: 'm1', updatedAt: '2026-07-06' },
  { id: 'i23', name: 'Lavandina Ayudín', quantity: 2, unit: 'l', locationId: 'l4', minStock: 1, updatedBy: 'm3', updatedAt: '2026-07-08' },
  { id: 'i24', name: 'Esponjas', quantity: 4, unit: 'unidades', locationId: 'l4', minStock: 2, updatedBy: 'm2', updatedAt: '2026-07-02' },

  // Freezer
  { id: 'i25', name: 'Milanesas de pollo', quantity: 8, unit: 'unidades', locationId: 'l5', minStock: 4, expiry: '2026-09-15', updatedBy: 'm1', updatedAt: '2026-07-10' },
  { id: 'i26', name: 'Hamburguesas', quantity: 2, unit: 'unidades', locationId: 'l5', minStock: 4, expiry: '2026-10-01', updatedBy: 'm2', updatedAt: '2026-07-09' },
  { id: 'i27', name: 'Arvejas congeladas', quantity: 500, unit: 'g', locationId: 'l5', expiry: '2026-11-20', updatedBy: 'm3', updatedAt: '2026-07-01' },
  { id: 'i28', name: 'Helado Grido', quantity: 1, unit: 'kg', locationId: 'l5', expiry: '2026-12-01', updatedBy: 'm1', updatedAt: '2026-07-04' },
]

export const shopping: ShoppingItem[] = [
  { id: 's1', name: 'Pan lactal Bimbo', quantity: 1, unit: 'unidades', urgency: 'urgente', bought: false, addedBy: 'm1', source: 'manual' },
  { id: 's2', name: 'Detergente Magistral', quantity: 2, unit: 'unidades', urgency: 'alto', bought: false, addedBy: 'm2', source: 'stock' },
  { id: 's3', name: 'Coca-Cola 2.25L', quantity: 2, unit: 'unidades', urgency: 'medio', bought: false, addedBy: 'm3', source: 'manual' },
  { id: 's4', name: 'Manzanas', quantity: 1, unit: 'kg', urgency: 'bajo', bought: false, addedBy: 'm1', source: 'manual' },
  { id: 's5', name: 'Rollo de cocina', quantity: 2, unit: 'unidades', urgency: 'medio', bought: true, addedBy: 'm2', source: 'manual' },
  { id: 's6', name: 'Papel higiénico Higienol', quantity: 4, unit: 'paquetes', urgency: 'urgente', bought: false, addedBy: 'm1', source: 'stock' },
]

export const recipes: Recipe[] = [
  {
    id: 'r1',
    name: 'Milanesas con puré',
    photo: '/images/recipes/milanesas.png',
    servings: 4,
    minutes: 45,
    ingredients: [
      { name: 'Milanesas de pollo', quantity: 4, unit: 'unidades' },
      { name: 'Huevos', quantity: 2, unit: 'unidades' },
      { name: 'Papa', quantity: 1, unit: 'kg' },
      { name: 'Manteca', quantity: 50, unit: 'g' },
      { name: 'Leche La Serenísima', quantity: 0.2, unit: 'l' },
    ],
    steps: [
      'Hervir las papas en agua con sal hasta que estén tiernas.',
      'Pisar las papas con la manteca y la leche hasta lograr un puré cremoso.',
      'Cocinar las milanesas en horno a 200°C por 20 minutos, dándolas vuelta a la mitad.',
      'Servir las milanesas acompañadas del puré caliente.',
    ],
  },
  {
    id: 'r2',
    name: 'Fideos con tuco',
    photo: '/images/recipes/fideos.png',
    servings: 4,
    minutes: 30,
    ingredients: [
      { name: 'Fideos Matarazzo', quantity: 1, unit: 'paquetes' },
      { name: 'Puré de tomate', quantity: 2, unit: 'unidades' },
      { name: 'Cebolla', quantity: 1, unit: 'unidades' },
      { name: 'Aceite Natura', quantity: 0.05, unit: 'l' },
      { name: 'Queso cremoso', quantity: 100, unit: 'g' },
    ],
    steps: [
      'Rehogar la cebolla picada en aceite hasta que esté transparente.',
      'Agregar el puré de tomate, sal y una pizca de azúcar. Cocinar 15 minutos.',
      'Hervir los fideos en abundante agua con sal según el paquete.',
      'Mezclar los fideos con el tuco y espolvorear queso rallado.',
    ],
  },
  {
    id: 'r3',
    name: 'Tortilla de papa',
    photo: '/images/recipes/tortilla.png',
    servings: 4,
    minutes: 40,
    ingredients: [
      { name: 'Papa', quantity: 0.8, unit: 'kg' },
      { name: 'Huevos', quantity: 6, unit: 'unidades' },
      { name: 'Cebolla', quantity: 1, unit: 'unidades' },
      { name: 'Aceite Natura', quantity: 0.1, unit: 'l' },
    ],
    steps: [
      'Cortar las papas en rodajas finas y freírlas a fuego medio.',
      'Agregar la cebolla en juliana y cocinar hasta que estén doradas.',
      'Batir los huevos, incorporar las papas y salpimentar.',
      'Cocinar la tortilla de ambos lados hasta que esté firme.',
    ],
  },
  {
    id: 'r4',
    name: 'Ensalada César',
    photo: '/images/recipes/cesar.png',
    servings: 2,
    minutes: 20,
    ingredients: [
      { name: 'Lechuga', quantity: 1, unit: 'unidades' },
      { name: 'Milanesas de pollo', quantity: 2, unit: 'unidades' },
      { name: 'Queso cremoso', quantity: 80, unit: 'g' },
      { name: 'Pan lactal', quantity: 2, unit: 'unidades' },
    ],
    steps: [
      'Cocinar el pollo y cortarlo en tiras.',
      'Tostar los cubos de pan para los croutons.',
      'Mezclar la lechuga con el aderezo césar.',
      'Sumar el pollo, los croutons y el queso en escamas.',
    ],
  },
  {
    id: 'r5',
    name: 'Arroz con pollo',
    photo: '/images/recipes/arroz-pollo.png',
    servings: 4,
    minutes: 50,
    ingredients: [
      { name: 'Arroz Gallo Oro', quantity: 0.5, unit: 'kg' },
      { name: 'Milanesas de pollo', quantity: 3, unit: 'unidades' },
      { name: 'Arvejas congeladas', quantity: 200, unit: 'g' },
      { name: 'Cebolla', quantity: 1, unit: 'unidades' },
      { name: 'Puré de tomate', quantity: 1, unit: 'unidades' },
    ],
    steps: [
      'Dorar el pollo trozado en una olla con aceite.',
      'Agregar la cebolla y el puré de tomate.',
      'Sumar el arroz y el doble de agua caliente. Cocinar 18 minutos.',
      'Incorporar las arvejas al final y dejar reposar.',
    ],
  },
]

export const services: ServiceExpense[] = [
  { id: 'e1', category: 'Supermercado', icon: 'cart', provider: 'Coto', amount: 185400, dueDate: '2026-07-05', status: 'pagado', recurrence: 'mensual' },
  { id: 'e2', category: 'Luz', icon: 'zap', provider: 'Edenor', amount: 24500, dueDate: '2026-07-18', status: 'pendiente', recurrence: 'mensual' },
  { id: 'e3', category: 'Agua', icon: 'droplet', provider: 'Aysa', amount: 12300, dueDate: '2026-07-22', status: 'pendiente', recurrence: 'mensual' },
  { id: 'e4', category: 'Internet', icon: 'wifi', provider: 'Fibertel', amount: 21900, dueDate: '2026-07-08', status: 'pagado', recurrence: 'mensual' },
  { id: 'e5', category: 'Gas', icon: 'flame', provider: 'Metrogas', amount: 15600, dueDate: '2026-07-16', status: 'pendiente', recurrence: 'mensual' },
  { id: 'e6', category: 'Celular', icon: 'phone', provider: 'Personal', amount: 13400, dueDate: '2026-07-10', status: 'pagado', recurrence: 'mensual' },
  { id: 'e7', category: 'Expensas', icon: 'building', provider: 'Consorcio', amount: 98000, dueDate: '2026-07-15', status: 'pendiente', recurrence: 'mensual' },
]

/** Gasto por categoría del mes anterior (junio) para comparación */
export const lastMonthTotal = 358900

export const activity: Activity[] = [
  { id: 'a1', memberId: 'm2', text: 'agregó Milanesas de pollo al Freezer', section: 'inventario', timestamp: 'hace 20 min' },
  { id: 'a2', memberId: 'm1', text: 'sumó Pan lactal a la lista de compras', section: 'compras', timestamp: 'hace 1 h' },
  { id: 'a3', memberId: 'm3', text: 'marcó la factura de Internet como pagada', section: 'servicios', timestamp: 'hace 3 h' },
  { id: 'a4', memberId: 'm1', text: 'creó la receta Arroz con pollo', section: 'recetero', timestamp: 'ayer' },
  { id: 'a5', memberId: 'm2', text: 'actualizó el stock de Leche', section: 'inventario', timestamp: 'ayer' },
]

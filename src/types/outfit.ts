export interface Outfit {
  id: string
  name: string
  description?: string
  userId: string
  createdAt: Date
  updatedAt: Date
  items: OutfitItem[]
}

export interface OutfitItem {
  id: string
  clothingItemId: string
  outfitId: string
  createdAt: Date
  updatedAt: Date
}

export interface OutfitCalendarEvent {
  id: string
  date: string
  notes?: string
  isCompleted: boolean
  outfitId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  outfit?: Outfit
}

export interface CreateCalendarEventInput {
  date: string
  notes?: string
  outfitId: string
}

export interface UpdateCalendarEventInput {
  id: string
  notes?: string
  outfitId: string
}

export interface OutfitGeneratorParams {
  userId: string
  age: number
  ageCategory: 'teen' | 'young-adult' | 'adult' | 'mature' | 'senior'
  baseStylePreferences: string[]
  occasion?: string
  season?: string[]
  weather?: string[]
  preferredStyles?: string[]
  outfitName?: string
  description?: string
  preferredColors?: string[]
  excludeItems?: string[]
  gender?: 'male' | 'female' | 'unisex'
  bodyType?: string
  height?: number
}

export interface OutfitRules {
  maxItems: number
  requiredPositions: string[]
  styleCompatibility: Record<string, string[]>
  colorCompatibility: Record<string, string[]>
  seasonalRules: Record<string, string[]>
}

export interface ExternalTip {
  source: 'reddit' | 'pinterest' | 'instagram'
  tip: string
  category: string
  style: string[]
  ageRange?: {
    min: number
    max: number
  }
}

export interface GenerationResult {
  success: boolean
  errors: Array<{
    code: string
    message: string
    severity: 'low' | 'medium' | 'high'
  }>
}
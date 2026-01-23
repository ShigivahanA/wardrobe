import { request } from './apiClient'

/* ======================
   Types
====================== */
export type WardrobeCategory =
  | 'shirt'
  | 'tshirt'
  | 'pant'
  | 'jeans'
  | 'jacket'
  | 'shoes'
  | 'other'

export type WardrobeOccasion =
  | 'beach'
  | 'casual'
  | 'ethnic'
  | 'festival'
  | 'formal'
  | 'other'
  | 'party'
  | 'sports'
  | 'travel'
  | 'work'

export type WardrobeSeason =
  | 'all'
  | 'autumn'
  | 'monsoon'
  | 'spring'
  | 'summer'
  | 'winter'

export interface AddWardrobeItemPayload {
  imageUrl: string
  imagePublicId: string
  category: WardrobeCategory
  colors?: string[]
  size?: string
  brand?: string

  // ✅ UPDATED: multi-select
  occasion: WardrobeOccasion[]
  season: WardrobeSeason[]

  isFavorite?: boolean
  tags?: string[]
  notes?: string
}

/* ======================
   Service
====================== */

const addItem = async (payload: AddWardrobeItemPayload) => {
  const res = await request('/wardrobe', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return res.data
}

const getItems = async (query = '') => {
  const res = await request(`/wardrobe${query}`, {
    method: 'GET',
  })

  return res.data
}

const getItemById = async (id: string) => {
  const res = await request(`/wardrobe/${id}`, {
    method: 'GET',
  })

  return res.data
}

const deleteItem = async (id: string) => {
  await request(`/wardrobe/${id}`, {
    method: 'DELETE',
  })
}

const updateItem = async (
  id: string,
  payload: Partial<AddWardrobeItemPayload>
) => {
  const res = await request(`/wardrobe/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

  return res.data
}

const toggleFavorite = async (id: string) => {
  const res = await request(`/wardrobe/${id}/favorite`, {
    method: 'PATCH',
  })

  return res.data
}

/* ======================
   Default export
====================== */
const wardrobeService = {
  addItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  toggleFavorite,
}

export default wardrobeService

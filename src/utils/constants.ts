export const ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    DASHBOARD: '/dashboard',
    WARDROBE: '/wardrobe',
    OUTFITS: '/outfits',
    SETTINGS: '/settings',
    PROFILE: '/profile',
  };
  
  export const API_ROUTES = {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      SESSION: '/api/auth/session',
    },
    WARDROBE: {
      ITEMS: '/api/wardrobe/items',
      ITEM: (id: string) => `/api/wardrobe/items/${id}`,
      CATEGORIES: '/api/wardrobe/categories',
    },
    OUTFITS: {
      BASE: '/api/outfits',
      SINGLE: (id: string) => `/api/outfits/${id}`,
      GENERATE: '/api/outfits/generate',
    },
  };
  
  export const QUERY_KEYS = {
    WARDROBE: {
      ALL: 'wardrobe',
      SINGLE: (id: string) => `wardrobe-${id}`,
      CATEGORIES: 'wardrobe-categories',
    },
    OUTFITS: {
      ALL: 'outfits',
      SINGLE: (id: string) => `outfits-${id}`,
    },
  };
  
  export const ERROR_MESSAGES = {
    DEFAULT: 'Something went wrong. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  };
  
  export const SUCCESS_MESSAGES = {
    ITEM_ADDED: 'Item added successfully!',
    ITEM_UPDATED: 'Item updated successfully!',
    ITEM_DELETED: 'Item deleted successfully!',
    OUTFIT_GENERATED: 'Outfit generated successfully!',
  };
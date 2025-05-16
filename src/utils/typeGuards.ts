import { Types } from 'mongoose';
import { IClothing } from '@/models/Clothing';

// Type guard to check if an object has a Mongoose ObjectId
export function hasMongoId(obj: any): obj is { _id: Types.ObjectId } {
  return obj && '_id' in obj && obj._id instanceof Types.ObjectId;
}

// Type guard for checking if an object matches IClothing interface shape
export function isIClothing(obj: any): obj is IClothing {
  // First check if it's a valid object with _id
  if (!obj || typeof obj !== 'object' || !hasMongoId(obj)) {
    return false;
  }

  // Check required array properties
  if (!('color' in obj && Array.isArray(obj.color)) ||
      !('season' in obj && Array.isArray(obj.season)) ||
      !('style' in obj && Array.isArray(obj.style))) {
    return false;
  }

  // Check required string properties
  if (!('category' in obj && typeof obj.category === 'string') ||
      !('subCategory' in obj && typeof obj.subCategory === 'string')) {
    return false;
  }

  return true;
}

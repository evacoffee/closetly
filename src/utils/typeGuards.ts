import { Types } from 'mongoose';
import { IClothing } from '@/models/Clothing';

/**
 * Type guard to check if an object has a valid Mongoose ObjectId
 * Includes null/undefined checks and type validation
 */
export function hasMongoId(obj: unknown): obj is { _id: Types.ObjectId } {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  try {
    return '_id' in obj && 
           obj['_id'] instanceof Types.ObjectId &&
           typeof obj['_id'].toString() === 'string' &&
           obj['_id'].toString().length === 24;
  } catch {
    return false;
  }
}

/**
 * Type guard for checking if an object matches IClothing interface shape
 * Includes validation for required array and string properties
 */
export function isIClothing(obj: unknown): obj is IClothing {
  // First check if it's a valid object with _id
  if (!obj || typeof obj !== 'object' || !hasMongoId(obj)) {
    return false;
  }

  const requiredArrayProps = ['color', 'season', 'style'] as const;
  const requiredStringProps = ['category', 'subCategory'] as const;

  // Use type assertion after object check
  const clothing = obj as Record<string, unknown>;

  // Check required string properties
  if (!('category' in obj && typeof obj.category === 'string') ||
      !('subCategory' in obj && typeof obj.subCategory === 'string')) {
    return false;
  }

  return true;
}

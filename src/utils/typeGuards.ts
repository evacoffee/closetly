import { Types } from 'mongoose';
import { IClothing } from '@/models/Clothing';

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

export function isIClothing(obj: unknown): obj is IClothing {
  if (!obj || typeof obj !== 'object' || !hasMongoId(obj)) {
    return false;
  }

  const requiredArrayProps = ['color', 'season', 'style'] as const;
  const requiredStringProps = ['category', 'subCategory'] as const;

  const clothing = obj as Record<string, unknown>;

  if (!('category' in obj && typeof obj.category === 'string') ||
      !('subCategory' in obj && typeof obj.subCategory === 'string')) {
    return false;
  }

  return true;
}

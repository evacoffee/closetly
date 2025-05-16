import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfit extends Document {
  userId: string;
  name: string;
  description?: string;
  clothes: {
    itemId: string;
    position: string; // e.g., 'top', 'bottom', 'outer', 'shoes', 'accessory'
  }[];
  occasion: string[];
  season: string[];
  style: string[];
  weather: string[];
  favorite: boolean;
  rating: number;
  timesWorn: number;
  lastWorn?: Date;
  publicVisibility: boolean;
  aiGenerated: boolean;
  likes: number;
  savedBy: string[];
  imageUrl?: string;
}

const OutfitSchema = new Schema<IOutfit>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  clothes: [{
    itemId: { type: String, required: true },
    position: { type: String, required: true }
  }],
  occasion: [{ type: String }],
  season: [{ type: String }],
  style: [{ type: String }],
  weather: [{ type: String }],
  favorite: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  timesWorn: { type: Number, default: 0 },
  lastWorn: { type: Date },
  publicVisibility: { type: Boolean, default: false },
  aiGenerated: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  savedBy: [{ type: String }],
  imageUrl: { type: String }
}, {
  timestamps: true
});

// Indexes for efficient querying
OutfitSchema.index({ userId: 1, style: 1 });
OutfitSchema.index({ userId: 1, season: 1 });
OutfitSchema.index({ publicVisibility: 1, likes: -1 });
OutfitSchema.index({ userId: 1, favorite: 1 });

export const Outfit = mongoose.models.Outfit || mongoose.model<IOutfit>('Outfit', OutfitSchema);

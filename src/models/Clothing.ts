import mongoose, { Schema, Document } from 'mongoose';

export interface IClothing extends Document {
  userId: string;
  name: string;
  category: string;
  subCategory: string;
  color: string[];
  brand: string;
  size: string;
  season: string[];
  occasion: string[];
  style: string[];
  imageUrl: string;
  purchaseDate: Date;
  purchasePrice?: number;
  storageLocation: string;
  favorite: boolean;
  lastWorn?: Date;
  timesWorn: number;
  publicVisibility: boolean;
  metadata: {
    weather: string[];
    material: string[];
    care: string[];
    tags: string[];
  };
}

const ClothingSchema = new Schema<IClothing>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  color: [{ type: String, required: true }],
  brand: { type: String, required: true },
  size: { type: String, required: true },
  season: [{ type: String, required: true }],
  occasion: [{ type: String }],
  style: [{ type: String }],
  imageUrl: { type: String, required: true },
  purchaseDate: { type: Date, default: Date.now },
  purchasePrice: { type: Number },
  storageLocation: { type: String, required: true },
  favorite: { type: Boolean, default: false },
  lastWorn: { type: Date },
  timesWorn: { type: Number, default: 0 },
  publicVisibility: { type: Boolean, default: false },
  metadata: {
    weather: [String],
    material: [String],
    care: [String],
    tags: [String]
  }
}, {
  timestamps: true
});

// Index for efficient querying
ClothingSchema.index({ userId: 1, category: 1 });
ClothingSchema.index({ userId: 1, style: 1 });
ClothingSchema.index({ userId: 1, color: 1 });
ClothingSchema.index({ userId: 1, season: 1 });

export const Clothing = mongoose.models.Clothing || mongoose.model<IClothing>('Clothing', ClothingSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfitTip extends Document {
  userId: string;
  title: string;
  description: string;
  ageRange: {
    min: number;
    max: number;
  };
  styles: string[];
  occasions: string[];
  seasons: string[];
  likes: number;
  dislikes: number;
  reports: number;
  status: 'pending' | 'approved' | 'rejected';
  moderatorNotes?: string;
  verifiedByExperts: boolean;
  combinations: {
    topType: string[];
    bottomType: string[];
    shoesType: string[];
    accessoryType: string[];
    colorCombinations: string[][];
  };
  metadata: {
    bodyTypes?: string[];
    heightRange?: {
      min: number;
      max: number;
    };
    gender?: 'male' | 'female' | 'unisex';
  };
}

const OutfitTipSchema = new Schema<IOutfitTip>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  ageRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  styles: [{ type: String, required: true }],
  occasions: [{ type: String }],
  seasons: [{ type: String }],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  reports: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderatorNotes: { type: String },
  verifiedByExperts: { type: Boolean, default: false },
  combinations: {
    topType: [String],
    bottomType: [String],
    shoesType: [String],
    accessoryType: [String],
    colorCombinations: [[String]]
  },
  metadata: {
    bodyTypes: [String],
    heightRange: {
      min: Number,
      max: Number
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unisex']
    }
  }
}, {
  timestamps: true
});

OutfitTipSchema.index({ status: 1, 'ageRange.min': 1, 'ageRange.max': 1 });
OutfitTipSchema.index({ styles: 1, status: 1 });
OutfitTipSchema.index({ likes: -1, status: 1 });
OutfitTipSchema.index({ reports: 1 });

OutfitTipSchema.pre('save', function(next) {
  if (this.reports >= 5 && this.status === 'approved') {
    this.status = 'rejected';
    this.moderatorNotes = 'Automatically rejected due to high number of reports';
  }
  next();
});

export const OutfitTip = mongoose.models.OutfitTip || mongoose.model<IOutfitTip>('OutfitTip', OutfitTipSchema);

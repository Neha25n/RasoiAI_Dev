import mongoose from "mongoose";

const PantrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "Other" },
    quantity: { type: String, default: "" },
    unit: { type: String, default: "" },
    expiresAt: Date,
  },
  { timestamps: true }
);

PantrySchema.index({ userId: 1, name: 1 });

export const PantryItem = mongoose.model("PantryItem", PantrySchema);

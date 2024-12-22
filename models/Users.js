const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, default: "" },
        avatar: { type: String, default: "" },
        address : { type: String, default: "Việt Nam" },
        coverAvatar: { type: String, default: "" },
        isAdmin: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("User", UserSchema)
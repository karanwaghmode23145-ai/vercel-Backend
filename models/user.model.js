import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6, // ✅ use "minlength" not "minLength"
  },

  mobile: {
    type: String,
    required: [true, "Mobile number is required."],
    unique: true,
    minlength: 10, // ✅ usually 10 digits, not 11
    maxlength: 10,
  },
});

const User = mongoose.model("User", userSchema);

export default User;

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    age: {
      type: Number,
      default: 20,
      default:21,
      validate(value) {
        if (value <= 20) {
          throw new Error("Yor age must be above 20 years");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    tokens: [
      {
        type: String,
        required: true,
      },
    ],
    phone: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "ar-EG")) {
          throw new Error("Please enter an egyption phone number");
        }
      },
    },
  },
  {
    timestamps: {
      currentTime: () =>
        Math.floor(new Date().setHours(new Date().getHours() + 2)),
    },
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  // to prevent hashing when password isn't changing
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Faild to login ..please check the credentials");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Faild to login ..please check the credentials");
  }
  return user;
};

// Generate Token
userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "backend");
  user.tokens = user.tokens.concat(token);
  await user.save();
  return token;
};


const User = mongoose.model("User", userSchema);
module.exports = User;

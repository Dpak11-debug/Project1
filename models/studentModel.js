const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: String,
  duration: Number,
  fee: Number,
  isDeleted: { type: Boolean, default: false } // ✅ soft delete for course
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  courses: [courseSchema],
  isDeleted: { type: Boolean, default: false } // ✅ soft delete for student
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
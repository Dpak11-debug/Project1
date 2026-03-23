
const {request} = require("express");
const Student = require("../models/studentModel");

exports.createStudent = async (req,res) => {
    try {
        const records = req.body.records ;
        const students = await Student.insertMany(records);
        res.status(201).json({
            success : true,
            count : students.length,
            data : students
        });
    }catch(err){
        res.status(400).json({
            success: false,
            message : err.message
        })
    }
}



exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ isDeleted: false });

    // filter out deleted courses for each student
    const cleanedStudents = students.map(student => {
      const activeCourses = student.courses.filter(course => !course.isDeleted);
      return { ...student.toObject(), courses: activeCourses };
    });

    res.status(200).json({
      success: true,
      count: cleanedStudents.length,
      data: cleanedStudents
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateStudentAndCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // ✅ update student
    if (req.body.studentName) {
      student.name = req.body.studentName;
    }

    if (req.body.age) {
      student.age = req.body.age;
    }

    // ✅ update course
    if (courseId) {
      const course = student.courses.id(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      if (req.body.courseName) {
        course.name = req.body.courseName;
      }

      if (req.body.duration) {
        course.duration = req.body.duration;
      }

      if (req.body.fee) {
        course.fee = req.body.fee;
      }
    }

    await student.save();

    res.status(200).json({
      success: true,
      data: student
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};



exports.softDelete = async (req, res) => {
  try {
    const { studentId, courseId, id } = req.params;

    // 👉 find student
    const student = await Student.findById(studentId || id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // 👉 check if student already deleted
    if (student.isDeleted) {
      return res.status(409).json({
        success: false,
        message: "Student already deleted"
      });
    }

    // 👉 if courseId exists → delete course
    if (courseId) {
      const course = student.courses.id(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      // 👉 check if course already deleted
      if (course.isDeleted) {
        return res.status(409).json({
          success: false,
          message: "Course already deleted"
        });
      }

      // 👉 soft delete course
      course.isDeleted = true;
      await student.save();

      return res.status(200).json({
        success: true,
        message: "Course soft deleted",
        data: student
      });
    }

    // 👉 soft delete student
    student.isDeleted = true;
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student soft deleted",
      data: student
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
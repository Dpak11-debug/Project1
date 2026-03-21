const express = require("express");
const router = express.Router();

const controller = require("../controllers/studentController");


router.post("/students", controller.createStudent);

router.get("/students",controller.getStudents);

router.put("/students/:studentId/:courseId?", controller.updateStudentAndCourse);


router.delete("/students/:id", controller.softDeleteStudent);

router.delete("/students/:studentId/courses/:courseId", controller.softDeleteCourse);

module.exports = router;
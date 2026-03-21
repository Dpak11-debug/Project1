const express = require("express");
const router = express.Router();

const controller = require("../controllers/studentController");


router.post("/students", controller.createStudent);

router.get("/students",controller.getStudents);

router.put("/students/:studentId/:courseId?", controller.updateStudentAndCourse);

router.delete("/students/:studentId", controller.softDelete);

router.delete("/students/:studentId/courses/:courseId", controller.softDelete);

module.exports = router;
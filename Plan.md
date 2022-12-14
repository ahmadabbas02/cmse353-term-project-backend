# Routes

## admin (/admin)

- [x] /users
- [x] /users/:id - GET, PUT, DELETE
- [x] /courses
- [x] /courses/create
- [x] /courses/addStudentToCourse
- [x] /courses/removeStudentFromCourse

## Auth (/auth)

- [x] /login
- [x] /logout
- [x] /studentSignup
- [x] /parentSignup
- [x] /teacherSignup
- [x] /chairSignup
- [x] /adminSignup

## Teachers (/teachers)

- [x] /courses
- [x] /course/:id
- [ ] /course/records/:id - should return all attendance records for the specified course
- [x] /course/createAttendanceRecords
- [x] /course/markAttendanceRecordPresent

## Chair (/chair)

- [x] /students
- [ ] /students/:id - should show the attendance for student

## Students (/students)

- [x] /courses
- [x] /courses/:id

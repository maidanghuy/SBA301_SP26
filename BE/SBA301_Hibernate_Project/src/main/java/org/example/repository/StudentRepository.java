package org.example.repository;


import org.example.dao.StudentDAO;
import org.example.entity.Student;

import java.util.List;

public class StudentRepository implements IStudentRepository {

    private StudentDAO studentDAO = new StudentDAO();

    @Override
    public void save(Student student) {
        studentDAO.save(student);
    }

    @Override
    public void update(Student student) {
        studentDAO.update(student);
    }

    @Override
    public void delete(Student student) {
        studentDAO.delete(student);
    }

    @Override
    public Student findById(int studentId) {
        return studentDAO.getById(studentId);
    }

    @Override
    public Student findByEmail(String email) {
        return studentDAO.findByEmail(email);
    }

    @Override
    public List<Student> findAll() {
        return studentDAO.getAll();
    }
}

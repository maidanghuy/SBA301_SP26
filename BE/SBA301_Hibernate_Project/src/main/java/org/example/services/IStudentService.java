package org.example.services;

import org.example.entity.Student;

import java.util.List;

public interface IStudentService {

    void save(Student student);
    void update(Student student);
    void delete(Student student);

    Student findById(int studentId);
    Student findByEmail(String email);
    List<Student> findAll();
}


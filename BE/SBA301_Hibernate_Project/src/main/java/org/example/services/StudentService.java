package org.example.services;

import org.example.config.HibernateUtil;
import org.example.entity.Student;
import org.example.repository.IStudentRepository;
import org.example.repository.StudentRepository;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class StudentService implements IStudentService {

    private IStudentRepository studentRepository = new StudentRepository();

    @Override
    public void save(Student student) {
        Student existingStudent = studentRepository.findByEmail(student.getEmail());
        if (existingStudent != null) {
            throw new RuntimeException("Lỗi Nghiệp vụ: Email '" + student.getEmail() + "' đã được đăng ký.");
        }

        if (student.getMarks() == null || student.getMarks() < 0 || student.getMarks() > 10) {
            throw new IllegalArgumentException("Lỗi Dữ liệu: Điểm sinh viên phải nằm trong khoảng từ 0.0 đến 10.0.");
        }

        studentRepository.save(student);
    }

    @Override
    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    @Override
    public Student findById(int studentId) {
        if (studentId <= 0) {
            throw new IllegalArgumentException("ID sinh viên không hợp lệ.");
        }
        return studentRepository.findById(studentId);
    }

    @Override
    public Student findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email không được để trống.");
        }
        return studentRepository.findByEmail(email);
    }

    @Override
    public void update(Student student) {
        Transaction transaction = null;

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();

            session.merge(student);   // QUAN TRỌNG
            transaction.commit();

        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            throw e;
        }
    }

    @Override
    public void delete(Student student) {
        Transaction transaction = null;

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();

            Student managedStudent = session.get(Student.class, student.getId());

            if (managedStudent.getBooks() != null &&
                    !managedStudent.getBooks().isEmpty()) {

                throw new RuntimeException(
                        "Không thể xóa sinh viên này vì họ vẫn đang mượn sách.");
            }

            session.remove(managedStudent);

            transaction.commit();

        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            throw e;
        }
    }
}

package org.example.dao;

import org.example.entity.Student;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.query.Query;

import java.util.List;

public class StudentDAO {
    private SessionFactory factory;

    public StudentDAO(){
        try{
            Configuration cfg = new Configuration().configure("hibernate.cfg.xml");
            this.factory = cfg.buildSessionFactory();
        }
        catch(Exception e){
            System.err.println("Error intializing Session Factory"+ e.getMessage());
            e.printStackTrace();
        }
    }
    public void save(Student student){
        Session session = factory.openSession();
        Transaction tx= null;
        try{
            tx = session.beginTransaction();
            session.save(student);
            tx.commit();
        }
        catch (Exception e){
            if(tx!=null) tx.rollback();
            System.err.println("Error saving student: "+e.getMessage());
        }
        finally {
            session.close();
        }
    }
    public List<Student> getAll() {
        List<Student> students = null;
        Session session = factory.openSession();
        try {
            Query<Student> query = session.createQuery("FROM Student", Student.class);
            students = query.list();
        } catch (Exception e) {
            System.err.println("Error getting all students: " + e.getMessage());
        } finally {
            session.close();
        }
        return students;
    }
    public Student getById(int id) {
        Student student = null;
        Session session = factory.openSession();
        try {
            student = session.get(Student.class, id);


        } catch (Exception e) {
            System.err.println("Error finding student by ID: " + e.getMessage());
        } finally {
            session.close();
        }
        return student;
    }
    public Student findByEmail(String email) {
        Student student = null;
        Session session = factory.openSession();
        try {
            String hql = "FROM Student WHERE email = :email";
            Query<Student> query = session.createQuery(hql, Student.class);
            query.setParameter("email", email);

            student = query.uniqueResult();
        } catch (Exception e) {
            System.err.println("Error finding student by email: " + e.getMessage());
        } finally {
            session.close();
        }
        return student;
    }
    public void update(Student student) {
        Session session = factory.openSession();
        Transaction tx = null;
        try {
            tx = session.beginTransaction();
            session.update(student);
            tx.commit();
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            System.err.println("Error updating student: " + e.getMessage());
        } finally {
            session.close();
        }
    }

    public void delete(Student student) {
        Session session = factory.openSession();
        Transaction tx = null;
        try {
            tx = session.beginTransaction();
            session.delete(student);
            tx.commit();
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            System.err.println("Error deleting student: " + e.getMessage());
        } finally {
            session.close();
        }
    }
}


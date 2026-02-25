module SBA301_Hibernate_project {

    // JavaFX
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.base;

    // JDBC
    requires java.sql;
    requires java.naming;

    // JPA + Hibernate
    requires jakarta.persistence;
    requires org.hibernate.orm.core;
    requires static lombok;

    // ===== Open cho Hibernate (rất quan trọng) =====
    opens org.example.entity to org.hibernate.orm.core, javafx.base;

    // ===== Nếu dùng FXML sau này =====
    opens org.example.controller to javafx.fxml;

    // ===== Export =====
    exports org.example;
    exports org.example.dao;
    exports org.example.repository;
    exports org.example.services;
    exports org.example.entity;
    opens org.example to javafx.fxml;
}
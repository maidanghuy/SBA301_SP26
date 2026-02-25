package org.example.controller;


import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import org.example.entity.Student;
import org.example.services.StudentService;

import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;

public class StudentController implements Initializable {
    @FXML private TableView<Student> studentTable;
    @FXML private TableColumn<Student, Integer> idColumn;
    @FXML private TableColumn<Student, String> emailColumn;
    @FXML private TableColumn<Student, String> firstNameColumn;
    @FXML private TableColumn<Student, String> lastNameColumn;
    @FXML private TableColumn<Student, Double> marksColumn;

    @FXML private javafx.scene.control.TextField txtEmail;
    @FXML private javafx.scene.control.TextField txtFirstName;
    @FXML private javafx.scene.control.TextField txtLastName;
    @FXML private javafx.scene.control.TextField txtMarks;
    @FXML private javafx.scene.control.PasswordField txtPassword;

    private final StudentService studentService = new StudentService();

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        idColumn.setCellValueFactory(new PropertyValueFactory<>("id"));
        emailColumn.setCellValueFactory(new PropertyValueFactory<>("email"));
        firstNameColumn.setCellValueFactory(new PropertyValueFactory<>("firstName"));
        lastNameColumn.setCellValueFactory(new PropertyValueFactory<>("lastName"));
        marksColumn.setCellValueFactory(new PropertyValueFactory<>("marks"));
        refreshStudentTable();

        studentTable.getSelectionModel().selectedItemProperty().addListener((obs, oldSelection, newSelection) -> {
            if (newSelection != null) {
                displayStudentDetails(newSelection);
            }
        });



    }
    private void refreshStudentTable() {
        try{
            List<Student> students = studentService.findAll();
            ObservableList<Student> studentObservableList = javafx.collections.FXCollections.observableArrayList(students);
            studentTable.setItems(studentObservableList);
            studentTable.refresh();
        }
        catch(Exception e){
            showAlert(Alert.AlertType.ERROR, "Lỗi", "Không thể tải danh sách sinh viên: " + e.getMessage());
        }
    }
    private void displayStudentDetails(Student student) {
        txtEmail.setText(student.getEmail());
        txtPassword.setText(student.getPassword());
        txtFirstName.setText(student.getFirstName());
        txtLastName.setText(student.getLastName());
        txtMarks.setText(String.valueOf(student.getMarks()));
    }
    private void clearForm() {
        txtEmail.clear();
        txtPassword.clear();
        txtFirstName.clear();
        txtLastName.clear();
        txtMarks.clear();
        studentTable.getSelectionModel().clearSelection();
    }


    private void showAlert(Alert.AlertType alertType, String lỗi, String s) {
        Alert alert = new Alert(alertType);
        alert.setTitle(lỗi);
        alert.setHeaderText(null);
        alert.setContentText(s);
        alert.showAndWait();
    }

    @FXML
    private void handleAddStudent() {
        try {
            if (txtEmail.getText().isBlank() ||
                    txtFirstName.getText().isBlank() ||
                    txtLastName.getText().isBlank() ||
                    txtMarks.getText().isBlank()) {

                showAlert(Alert.AlertType.WARNING,
                        "Thiếu dữ liệu",
                        "Vui lòng nhập đầy đủ thông tin.");
                return;
            }

            String email = txtEmail.getText();
            String password = txtPassword.getText();
            String firstName = txtFirstName.getText();
            String lastName = txtLastName.getText();
            Double marks = Double.parseDouble(txtMarks.getText());

            Student newStudent = new Student(email, password, firstName, lastName, marks);

            studentService.save(newStudent);

            showAlert(Alert.AlertType.INFORMATION,
                    "Thành công",
                    "Sinh viên đã được thêm thành công.");

            refreshStudentTable();
            clearForm();

        } catch (NumberFormatException nfe) {
            showAlert(Alert.AlertType.ERROR,
                    "Lỗi",
                    "Điểm phải là một số hợp lệ.");
        } catch (Exception e) {
            showAlert(Alert.AlertType.ERROR,
                    "Lỗi",
                    "Không thể thêm sinh viên: " + e.getMessage());
        }
    }
    @FXML
    private void handleUpdateStudent() {
        try {
            Student selectedStudent = studentTable.getSelectionModel().getSelectedItem();
            if (selectedStudent == null) {
                showAlert(Alert.AlertType.WARNING, "Cảnh báo", "Vui lòng chọn một sinh viên để cập nhật.");
                return;
            }
            selectedStudent.setEmail(txtEmail.getText());
            selectedStudent.setFirstName(txtFirstName.getText());
            selectedStudent.setPassword(txtPassword.getText());
            selectedStudent.setLastName(txtLastName.getText());
            selectedStudent.setMarks(Double.parseDouble(txtMarks.getText()));
            selectedStudent.setId(selectedStudent.getId());
            studentService.update(selectedStudent);
            showAlert(Alert.AlertType.INFORMATION, "Thành công", "Sinh viên đã được cập nhật thành công.");
            refreshStudentTable();
            clearForm();
        } catch (NumberFormatException nfe) {
            showAlert(Alert.AlertType.ERROR, "Lỗi", "Điểm phải là một số hợp lệ.");
        } catch (Exception e) {
            showAlert(Alert.AlertType.ERROR, "Lỗi", "Không thể cập nhật sinh viên: " + e.getMessage());
        }

    }
    @FXML
    private void handleDeleteStudent() {
        try {
            Student selectedStudent = studentTable.getSelectionModel().getSelectedItem();
            if (selectedStudent == null) {
                showAlert(Alert.AlertType.WARNING, "Cảnh báo", "Vui lòng chọn một sinh viên để xóa.");
                return;
            }
            studentService.delete(selectedStudent);
            showAlert(Alert.AlertType.INFORMATION, "Thành công", "Sinh viên đã được xóa thành công.");
            refreshStudentTable();
            clearForm();
        } catch (Exception e) {
            showAlert(Alert.AlertType.ERROR, "Lỗi", "Không thể xóa sinh viên: " + e.getMessage());
        }
    }
}

package com.app.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dto.*;
import com.app.entities.Course;
import com.app.entities.Role;
import com.app.entities.Student;
import com.app.entities.User;
import com.app.exceptions.ResourceNotFoundException;
import com.app.repository.ItemDailyRepository;
import com.app.repository.OrderRepository;
import com.app.repository.StudentRepository;
import com.app.security.JwtUtils;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final ItemDailyRepository itemDailyRepository;
    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public StudentServiceImpl(
            StudentRepository studentRepository,
            ItemDailyRepository itemDailyRepository,
            OrderRepository orderRepository,
            ModelMapper modelMapper,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils) {

        this.studentRepository = studentRepository;
        this.itemDailyRepository = itemDailyRepository;
        this.orderRepository = orderRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    // ================= REGISTER =================
    @Override
    public String registerStudent(RegisterStudentDTO dto) {

        if (studentRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Student already exists");
        }

        // ===== STUDENT =====
        Student student = new Student();
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setMobileNo(dto.getMobileNo());
        student.setPassword(passwordEncoder.encode(dto.getPassword()));
        student.setBalance(0);
        student.setDob(dto.getDob());
        student.setCourseName(dto.getCourseName());

        // ===== USER (SECURITY) =====
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(student.getPassword()); // already encoded
        user.setRole(Role.STUDENT);

        // ===== LINK =====
        student.setUser(user);

        // ===== SAVE =====
        studentRepository.save(student); // cascade saves User

        return "Student registered successfully";
    }

    // ================= LOGIN =================
    @Override
    public String login(SignInDTO dto) {

        Student student = studentRepository
                .findByEmail(dto.getUserName())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(dto.getPassword(), student.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtils.generateToken(
                student.getUser().getEmail(),
                student.getUser().getRole().name());
    }

    // ================= PASSWORD =================
    @Override
    public String changePassword(Long id, UpdatePasswordDTO dto) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), student.getPassword())) {
            return "Invalid old password";
        }

        student.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        student.getUser().setPassword(student.getPassword());

        return "Password updated successfully";
    }

    // ================= LOGOUT =================
    @Override
    public ApiResponse logout() {
        return new ApiResponse("Student logged out successfully");
    }

    // ================= BALANCE =================
    @Override
    public int getBalanceById(Long studentId) {
        return getStudent(studentId).getBalance();
    }

    @Override
    public ApiResponse setBalanceById(Long studentId, Integer newBalance) {
        Student student = getStudent(studentId);
        student.setBalance(newBalance);
        return new ApiResponse("Balance updated successfully");
    }

    // ================= GETTERS =================
    @Override
    public String getEmailByStudentID(Long id) {
        return getStudent(id).getEmail();
    }

    @Override
    public String getNameByStudentID(Long id) {
        return getStudent(id).getName();
    }

    @Override
    public LocalDate getDobByStudentID(Long id) {
        return getStudent(id).getDob();
    }

    @Override
    public String getMobileNoByStudentID(Long id) {
        return getStudent(id).getMobileNo();
    }

    private Student getStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    // ================= CRUD =================
    @Override
    public StudentDTO getStudentByEmail(String email) {
        return modelMapper.map(
                studentRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found")),
                StudentDTO.class);
    }

    @Override
    public StudentDTO getStudentDetails(Long studentId) {
        return modelMapper.map(getStudent(studentId), StudentDTO.class);
    }

    @Override
    public StudentDTO updateStudent(Long studentId, StudentDTO dto) {
        Student student = getStudent(studentId);

        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setMobileNo(dto.getMobileNo());
        student.setBalance(dto.getBalance());
        student.setDob(dto.getDob());
        student.setCourseName(
                Course.valueOf(dto.getCourseName().toUpperCase()));

        return modelMapper.map(student, StudentDTO.class);
    }

    @Override
    public ApiResponse deleteStudentDetails(Long studentId) {
        studentRepository.delete(getStudent(studentId));
        return new ApiResponse("Student deleted successfully");
    }

    @Override
    public List<GetAllStudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(s -> modelMapper.map(s, GetAllStudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Long getTotalRegisteredStudents() {
        return studentRepository.count();
    }

    @Override
    public boolean studentExists(Long studentId) {
        return studentRepository.existsById(studentId);
    }
}

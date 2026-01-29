package com.app.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dto.ApiResponse;
import com.app.dto.RechargeHistoryDTO;
import com.app.entities.RechargeHistory;
import com.app.entities.Student;
import com.app.exceptions.ResourceNotFoundException;
import com.app.repository.RechargeHistoryRepository;
import com.app.repository.StudentRepository;

@Service
@Transactional
public class RechargeHistoryServiceImpl implements RechargeHistoryService {

	@Autowired
	private RechargeHistoryRepository rechargeRepo;

	@Autowired
	private StudentRepository studRepo;

	@Autowired
	private ModelMapper mapper;

	@Override
	public List<RechargeHistoryDTO> getAllRechargeHistoryOfStudent(Long studId) {
		List<RechargeHistory> rechargeList = rechargeRepo.findByStudentStudentId(studId);

		return rechargeList.stream().map(recharge -> {
			RechargeHistoryDTO rechargeDTO = mapper.map(recharge, RechargeHistoryDTO.class);

			if (recharge.getStudent() != null) {
				// Set Student information in RechargeHistoryDTO
				rechargeDTO.setStudentId(recharge.getStudent().getStudentId());
			}

			return rechargeDTO;
		}).collect(Collectors.toList());
	}

	@Override
	public RechargeHistoryDTO addRecharge(RechargeHistoryDTO dto) {
		// 1. Validation
		if (dto.getStudentId() == null) {
			throw new ResourceNotFoundException("Student ID cannot be null");
		}
		if (dto.getAmountAdded() == null || dto.getAmountAdded() <= 0) {
			// Throwing RuntimeException which rolls back transaction
			throw new RuntimeException("Invalid Recharge Amount: " + dto.getAmountAdded());
		}
		if (dto.getPaymentId() == null || dto.getPaymentId().trim().isEmpty()) {
			throw new RuntimeException("Payment ID (Transaction ID) is missing!");
		}

		Student stud = studRepo.findById(dto.getStudentId())
				.orElseThrow(() -> new ResourceNotFoundException("Invalid Student Id: " + dto.getStudentId()));

		try {
			// 2. Map DTO to Entity
			RechargeHistory rechEntity = mapper.map(dto, RechargeHistory.class);

			// 3. Manual Safety Mapping
			rechEntity.setPaymentId(dto.getPaymentId());
			// Ensure timestamp is set if not present (though typically sent from frontend)
			if (rechEntity.getTimestamp() == null) {
				rechEntity.setTimestamp(java.time.LocalDateTime.now());
			}

			// 4. Update Balance (Atomic operation due to @Transactional)
			// Balance is primitive int, no null check needed
			int currentBalance = stud.getBalance();
			stud.setBalance(currentBalance + dto.getAmountAdded());

			// 5. Link and Save
			stud.addRechargeHistory(rechEntity); // This sets the relationship both ways

			RechargeHistory savedRecharge = rechargeRepo.save(rechEntity);

			System.out.println("Recharge Successful -> Student: " + stud.getStudentId() +
					", Amount: " + dto.getAmountAdded() +
					", PaymentId: " + savedRecharge.getPaymentId() +
					", New Balance: " + stud.getBalance());

			return mapper.map(savedRecharge, RechargeHistoryDTO.class);

		} catch (Exception e) {
			System.err.println("Recharge Failed: " + e.getMessage());
			throw new RuntimeException("Failed to process recharge: " + e.getMessage());
		}
	}

	@Override
	public RechargeHistoryDTO updateRecharge(Long tranId, RechargeHistoryDTO dto) {
		RechargeHistory recharge = rechargeRepo.findById(tranId)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid transaction ID !!"));

		Student stud = studRepo.findById(dto.getStudentId())
				.orElseThrow(() -> new ResourceNotFoundException("Invalid Student Id!!!"));
		mapper.map(dto, recharge);
		stud.addRechargeHistory(recharge);
		dto.setTransactionId(tranId);
		return dto;
	}

	@Override
	public RechargeHistoryDTO getRechargeDetails(Long tranId) {
		RechargeHistory recharge = rechargeRepo.findById(tranId)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid Transaction Id !!!!"));

		RechargeHistoryDTO rechargeDTO = mapper.map(recharge, RechargeHistoryDTO.class);

		if (recharge.getStudent() != null) {
			// Set Student information in RechargeHistoryDTO
			rechargeDTO.setStudentId(recharge.getStudent().getStudentId());

		}

		return rechargeDTO;
	}

	@Override
	public ApiResponse deleteRechargeHistory(Long tranId) {
		RechargeHistory recharge = rechargeRepo.findById(tranId)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid transaction ID !!"));
		rechargeRepo.delete(recharge);
		return new ApiResponse("Recharge Details of Student with ID " + recharge.getTransactionId() + " deleted....");
	}

}

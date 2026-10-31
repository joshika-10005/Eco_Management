package com.ewaste.service;

import com.ewaste.model.EWasteRequest;
import com.ewaste.repository.EWasteRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EWasteRequestService {

    private final EWasteRequestRepository requestRepository;
    private final UserService userService;

    public EWasteRequestService(EWasteRequestRepository requestRepository, UserService userService) {
        this.requestRepository = requestRepository;
        this.userService = userService;
    }

    public EWasteRequest createRequest(EWasteRequest request) {
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());

        // Calculate dynamic reward points based on category & weight
        int basePoints = 50;
        if (request.getEstimatedWeightKg() > 0) {
            basePoints += (int) (request.getEstimatedWeightKg() * 20);
        }
        if (request.getQuantity() > 1) {
            basePoints += (request.getQuantity() - 1) * 25;
        }
        request.setRewardPoints(basePoints);

        return requestRepository.save(request);
    }

    public List<EWasteRequest> getRequestsByUser(String userId) {
        return requestRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<EWasteRequest> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<EWasteRequest> getRequestById(String id) {
        return requestRepository.findById(id);
    }

    public EWasteRequest updateStatus(String id, String newStatus, String notes) {
        EWasteRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Request not found with id: " + id));

        String oldStatus = request.getStatus();
        request.setStatus(newStatus.toUpperCase());
        request.setUpdatedAt(LocalDateTime.now());
        if (notes != null && !notes.isBlank()) {
            request.setNotes(notes);
        }

        EWasteRequest saved = requestRepository.save(request);

        // If newly marked as RECYCLED, credit points to user
        if (!"RECYCLED".equalsIgnoreCase(oldStatus) && "RECYCLED".equalsIgnoreCase(newStatus)) {
            if (request.getUserId() != null) {
                userService.addEcoPoints(request.getUserId(), request.getRewardPoints());
            }
        }

        return saved;
    }

    public void deleteRequest(String id) {
        requestRepository.deleteById(id);
    }

    public long count() {
        return requestRepository.count();
    }

    public long countByStatus(String status) {
        return requestRepository.countByStatus(status.toUpperCase());
    }
}

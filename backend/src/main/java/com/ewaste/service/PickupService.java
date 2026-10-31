package com.ewaste.service;

import com.ewaste.dto.PickupScheduleRequest;
import com.ewaste.model.EWasteRequest;
import com.ewaste.model.PickupDetails;
import com.ewaste.repository.PickupDetailsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class PickupService {

    private final PickupDetailsRepository pickupRepository;
    private final EWasteRequestService requestService;

    public PickupService(PickupDetailsRepository pickupRepository, EWasteRequestService requestService) {
        this.pickupRepository = pickupRepository;
        this.requestService = requestService;
    }

    public PickupDetails schedulePickup(String requestId, PickupScheduleRequest scheduleReq) {
        EWasteRequest request = requestService.getRequestById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid request ID: " + requestId));

        // Generate 4-digit OTP for secure pickup verification
        int otp = 1000 + new Random().nextInt(9000);

        PickupDetails pickup = pickupRepository.findByRequestId(requestId).orElse(new PickupDetails());
        pickup.setRequestId(requestId);
        pickup.setUserId(request.getUserId());
        pickup.setUserName(request.getUserName());
        pickup.setUserPhone(request.getUserPhone());
        pickup.setPickupAddress(request.getPickupAddress());
        pickup.setScheduledDate(scheduleReq.getScheduledDate());
        pickup.setTimeSlot(scheduleReq.getTimeSlot());
        pickup.setAgentName(scheduleReq.getAgentName() != null ? scheduleReq.getAgentName() : "Green Fleet Logistics #04");
        pickup.setAgentPhone(scheduleReq.getAgentPhone() != null ? scheduleReq.getAgentPhone() : "+1 (800) 456-7890");
        pickup.setVehicleNumber(scheduleReq.getVehicleNumber() != null ? scheduleReq.getVehicleNumber() : "EV-RECYCLE-99");
        pickup.setInstructions(scheduleReq.getInstructions());
        pickup.setConfirmationOtp(String.valueOf(otp));
        pickup.setPickupStatus("SCHEDULED");
        pickup.setScheduledAt(LocalDateTime.now());

        PickupDetails saved = pickupRepository.save(pickup);

        // Update request status to SCHEDULED
        requestService.updateStatus(requestId, "SCHEDULED", "Pickup assigned for " + scheduleReq.getScheduledDate());

        return saved;
    }

    public Optional<PickupDetails> getPickupByRequestId(String requestId) {
        return pickupRepository.findByRequestId(requestId);
    }

    public List<PickupDetails> getAllPickups() {
        return pickupRepository.findAllByOrderByScheduledAtDesc();
    }

    public PickupDetails updatePickupStatus(String pickupId, String status) {
        PickupDetails pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new IllegalArgumentException("Pickup not found with id: " + pickupId));

        pickup.setPickupStatus(status.toUpperCase());
        if ("COMPLETED".equalsIgnoreCase(status)) {
            pickup.setCompletedAt(LocalDateTime.now());
            // also update request status to PICKED_UP
            if (pickup.getRequestId() != null) {
                requestService.updateStatus(pickup.getRequestId(), "PICKED_UP", "Completed pickup from citizen site");
            }
        }
        return pickupRepository.save(pickup);
    }

    public long count() {
        return pickupRepository.count();
    }
}

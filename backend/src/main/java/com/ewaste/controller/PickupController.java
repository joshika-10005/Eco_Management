package com.ewaste.controller;

import com.ewaste.dto.PickupScheduleRequest;
import com.ewaste.dto.StatusUpdateRequest;
import com.ewaste.model.PickupDetails;
import com.ewaste.service.PickupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pickups")
@CrossOrigin(origins = "*")
public class PickupController {

    private final PickupService pickupService;

    public PickupController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @PostMapping("/schedule/{requestId}")
    public ResponseEntity<?> schedulePickup(@PathVariable String requestId,
                                            @RequestBody PickupScheduleRequest scheduleRequest) {
        try {
            PickupDetails pickup = pickupService.schedulePickup(requestId, scheduleRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(pickup);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<?> getByRequestId(@PathVariable String requestId) {
        return pickupService.getPickupByRequestId(requestId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<PickupDetails>> getAllPickups() {
        return ResponseEntity.ok(pickupService.getAllPickups());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePickupStatus(@PathVariable String id, @RequestBody StatusUpdateRequest statusReq) {
        try {
            PickupDetails updated = pickupService.updatePickupStatus(id, statusReq.getStatus());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

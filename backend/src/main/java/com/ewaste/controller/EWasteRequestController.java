package com.ewaste.controller;

import com.ewaste.dto.StatusUpdateRequest;
import com.ewaste.model.EWasteRequest;
import com.ewaste.service.EWasteRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ewaste-requests")
@CrossOrigin(origins = "*")
public class EWasteRequestController {

    private final EWasteRequestService requestService;

    public EWasteRequestController(EWasteRequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public ResponseEntity<EWasteRequest> createRequest(@RequestBody EWasteRequest request) {
        EWasteRequest created = requestService.createRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<EWasteRequest>> getAllRequests(@RequestParam(required = false) String userId) {
        if (userId != null && !userId.isBlank()) {
            return ResponseEntity.ok(requestService.getRequestsByUser(userId));
        }
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(@PathVariable String id) {
        return requestService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody StatusUpdateRequest statusReq) {
        try {
            EWasteRequest updated = requestService.updateStatus(id, statusReq.getStatus(), statusReq.getNotes());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable String id) {
        requestService.deleteRequest(id);
        return ResponseEntity.ok(Map.of("message", "Request deleted successfully"));
    }
}

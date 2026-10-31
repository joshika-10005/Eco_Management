package com.ewaste.controller;

import com.ewaste.service.EWasteRequestService;
import com.ewaste.service.PickupService;
import com.ewaste.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserService userService;
    private final EWasteRequestService requestService;
    private final PickupService pickupService;

    public AdminController(UserService userService,
                           EWasteRequestService requestService,
                           PickupService pickupService) {
        this.userService = userService;
        this.requestService = requestService;
        this.pickupService = pickupService;
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.count());
        stats.put("totalRequests", requestService.count());
        stats.put("pendingRequests", requestService.countByStatus("PENDING"));
        stats.put("approvedRequests", requestService.countByStatus("APPROVED"));
        stats.put("scheduledPickups", requestService.countByStatus("SCHEDULED"));
        stats.put("recycledCompleted", requestService.countByStatus("RECYCLED"));
        stats.put("totalPickups", pickupService.count());

        // Environmental Impact calculations
        long recycledCount = requestService.countByStatus("RECYCLED");
        double estimatedKgDiverted = recycledCount * 14.5; // ~14.5kg avg per recycled item
        double co2AvoidedKg = estimatedKgDiverted * 1.82; // ~1.82kg CO2 saved per kg recycled
        double toxicLeadPreventedGrams = estimatedKgDiverted * 45; // ~45g toxic elements prevented

        stats.put("kgDivertedFromLandfills", Math.round(estimatedKgDiverted * 10.0) / 10.0);
        stats.put("co2AvoidedKg", Math.round(co2AvoidedKg * 10.0) / 10.0);
        stats.put("toxicLeadPreventedGrams", Math.round(toxicLeadPreventedGrams * 10.0) / 10.0);

        return ResponseEntity.ok(stats);
    }
}

package com.ewaste.config;

import com.ewaste.model.EWasteRequest;
import com.ewaste.model.PickupDetails;
import com.ewaste.model.User;
import com.ewaste.repository.EWasteRequestRepository;
import com.ewaste.repository.PickupDetailsRepository;
import com.ewaste.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final EWasteRequestRepository requestRepository;
    private final PickupDetailsRepository pickupRepository;

    public DataInitializer(UserRepository userRepository,
                           EWasteRequestRepository requestRepository,
                           PickupDetailsRepository pickupRepository) {
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
        this.pickupRepository = pickupRepository;
    }

    @Override
    public void run(String... args) {
        try {
            if (userRepository.count() == 0) {
                log.info("Seeding initial users into MongoDB Atlas...");

                User admin = new User("Dr. Elena Vance (Admin)", "admin@ecodrop.org", "admin123", "ADMIN", "+1-555-0199", "EcoDrop Headquarters, Sector 7");
                admin.setEcoPoints(500);
                userRepository.save(admin);

                User citizen = new User("Alex Rivera (Citizen)", "citizen@ecodrop.org", "citizen123", "CITIZEN", "+1-555-0144", "442 Greenway Blvd, Austin TX");
                citizen.setEcoPoints(280);
                User savedCitizen = userRepository.save(citizen);

                User recycler = new User("Marcus Reed (Recycler Agent)", "recycler@ecodrop.org", "recycler123", "RECYCLER", "+1-555-0188", "Urban Depot 3, Austin TX");
                userRepository.save(recycler);

                // Seed sample e-waste requests
                EWasteRequest req1 = new EWasteRequest();
                req1.setUserId(savedCitizen.getId());
                req1.setUserName(savedCitizen.getFullName());
                req1.setUserEmail(savedCitizen.getEmail());
                req1.setUserPhone(savedCitizen.getPhone());
                req1.setDeviceCategory("Laptops & Computers");
                req1.setBrandModel("Dell Precision Tower 3620 + ThinkPad X1");
                req1.setQuantity(2);
                req1.setEstimatedWeightKg(12.5);
                req1.setCondition("Damaged");
                req1.setHazardLevel("Medium");
                req1.setPickupAddress(savedCitizen.getAddress());
                req1.setPreferredDate("2026-11-05");
                req1.setStatus("SCHEDULED");
                req1.setRewardPoints(220);
                req1.setNotes("Has cracked screen and old lithium pack removed.");
                req1.setCreatedAt(LocalDateTime.now().minusDays(2));
                EWasteRequest savedReq1 = requestRepository.save(req1);

                PickupDetails pickup1 = new PickupDetails();
                pickup1.setRequestId(savedReq1.getId());
                pickup1.setUserId(savedCitizen.getId());
                pickup1.setUserName(savedCitizen.getFullName());
                pickup1.setUserPhone(savedCitizen.getPhone());
                pickup1.setPickupAddress(savedCitizen.getAddress());
                pickup1.setScheduledDate("2026-11-05");
                pickup1.setTimeSlot("Morning (09:00 - 12:00)");
                pickup1.setAgentName("Marcus Reed (Green Fleet)");
                pickup1.setAgentPhone("+1-555-0188");
                pickup1.setVehicleNumber("EV-RECYCLE-42");
                pickup1.setConfirmationOtp("4819");
                pickup1.setPickupStatus("SCHEDULED");
                pickup1.setInstructions("Ring doorbell at back gate.");
                pickupRepository.save(pickup1);

                EWasteRequest req2 = new EWasteRequest();
                req2.setUserId(savedCitizen.getId());
                req2.setUserName(savedCitizen.getFullName());
                req2.setUserEmail(savedCitizen.getEmail());
                req2.setUserPhone(savedCitizen.getPhone());
                req2.setDeviceCategory("Smartphones & Tablets");
                req2.setBrandModel("iPhone 11 & iPad Air 2");
                req2.setQuantity(2);
                req2.setEstimatedWeightKg(0.8);
                req2.setCondition("Dead / Scrap");
                req2.setHazardLevel("High (Toxic/Battery)");
                req2.setPickupAddress(savedCitizen.getAddress());
                req2.setPreferredDate("2026-11-03");
                req2.setStatus("PENDING");
                req2.setRewardPoints(140);
                req2.setNotes("Swollen battery warning sticker attached.");
                req2.setCreatedAt(LocalDateTime.now().minusHours(8));
                requestRepository.save(req2);

                log.info("MongoDB Atlas seeding complete! Default admin: admin@ecodrop.org / admin123");
            }
        } catch (Exception e) {
            log.warn("Database initialization skipped or pending connection: {}", e.getMessage());
        }
    }
}

package com.ewaste.repository;

import com.ewaste.model.PickupDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupDetailsRepository extends MongoRepository<PickupDetails, String> {
    Optional<PickupDetails> findByRequestId(String requestId);
    List<PickupDetails> findByUserId(String userId);
    List<PickupDetails> findAllByOrderByScheduledAtDesc();
    long countByPickupStatus(String pickupStatus);
}

package com.ewaste.repository;

import com.ewaste.model.EWasteRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EWasteRequestRepository extends MongoRepository<EWasteRequest, String> {
    List<EWasteRequest> findByUserIdOrderByCreatedAtDesc(String userId);
    List<EWasteRequest> findAllByOrderByCreatedAtDesc();
    List<EWasteRequest> findByStatusOrderByCreatedAtDesc(String status);
    long countByStatus(String status);
}

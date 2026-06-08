package com.sankalpsetu.ngo.repository;

import com.sankalpsetu.ngo.entity.NgoDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NgoDocumentRepository extends JpaRepository<NgoDocument, UUID> {
    List<NgoDocument> findByNgoId(UUID ngoId);
}

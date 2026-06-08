package com.sankalpsetu.ngo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ngo_documents")
@Getter @Setter
public class NgoDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "ngo_id", nullable = false)
    private Ngo ngo;

    @Column(name = "document_type", length = 100)
    private String documentType;

    @Column(name = "file_url")
    private String fileUrl;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;
}

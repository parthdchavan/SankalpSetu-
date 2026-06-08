package com.sankalpsetu.notification.entity;

import com.sankalpsetu.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "notification_preferences")
@Getter @Setter
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "email_enabled")
    private Boolean emailEnabled = true;

    @Column(name = "sms_enabled")
    private Boolean smsEnabled = false;

    @Column(name = "whatsapp_enabled")
    private Boolean whatsappEnabled = false;

    @Column(name = "push_enabled")
    private Boolean pushEnabled = true;
}

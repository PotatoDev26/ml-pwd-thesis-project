// File: src/main/java/com/lgu/pwd/config/FirebaseConfig.java
package com.lgu.pwd.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Configuration
public class FirebaseConfig {
    private static final List<Path> LOCAL_CREDENTIAL_PATHS = List.of(
            Path.of("backend/src/main/resources/firebase-service-account.json"),
            Path.of("src/main/resources/firebase-service-account.json"));

    @PostConstruct
    public void initialize() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(loadCredentials())
                .build();
        FirebaseApp.initializeApp(options);
    }

    private GoogleCredentials loadCredentials() throws IOException {
        if (System.getenv("GOOGLE_APPLICATION_CREDENTIALS") != null) {
            return GoogleCredentials.getApplicationDefault();
        }

        for (Path credentialPath : LOCAL_CREDENTIAL_PATHS) {
            if (Files.isRegularFile(credentialPath)) {
                try (InputStream credentials = Files.newInputStream(credentialPath)) {
                    return GoogleCredentials.fromStream(credentials);
                }
            }
        }

        return GoogleCredentials.getApplicationDefault();
    }

    @Bean
    public Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }
}
package com.lgu.pwd.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.lgu.pwd.model.PWDProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:5173") // Allow React Access
public class PWDProfileController {

    @Autowired
    private Firestore firestore;

    @PostMapping
    public String saveProfile(@RequestBody PWDProfile profile) throws Exception {
        firestore.collection("pwd_profiles").add(profile);
        return "Profile saved successfully";
    }

    @GetMapping
    public List<Map<String, Object>> getProfiles() throws Exception {
        ApiFuture<QuerySnapshot> future = firestore.collection("pwd_profiles").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Map<String, Object>> profiles = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            Map<String, Object> data = document.getData();
            data.put("id", document.getId());
            profiles.add(data);
        }

        return profiles;
    }
}

package com.smart.hire.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "users")
public class User {

    @Id
    private String id;   // MongoDB will generate ObjectId automatically if null

    private String username;
    private String email;
    private String password; // hashed
}

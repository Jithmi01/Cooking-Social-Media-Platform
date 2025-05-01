package com.example.cookingsystem.dtos;

public class CreateUserDto {

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isPublicStatus() {
        return publicStatus;
    }

    public void setPublicStatus(boolean publicStatus) {
        this.publicStatus = publicStatus;
    }

    private String firstName;


    private String lastName;

    private String bio;

    private String profileImageUrl;

    private String username;

    private String email;

    private String contactNumber;

    private String password;

    private boolean publicStatus = true;

    public com.example.cookingsystem.models.User toUser() {
        com.example.cookingsystem.models.User user = new com.example.cookingsystem.models.User();


        user.setName(this.firstName + " " + this.lastName);


        user.setUsername(this.username);
        user.setEmail(this.email);
        user.setPassword(this.password);
        user.setPublic(this.publicStatus);


        return user;
    }
}
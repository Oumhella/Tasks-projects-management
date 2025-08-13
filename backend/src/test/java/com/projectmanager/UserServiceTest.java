//package com.projectmanager;
//
//import com.projectmanager.dto.response.UserResponse;
//import com.projectmanager.entity.User;
//import com.projectmanager.repository.UserRepository;
//import com.projectmanager.service.user.UserService;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.util.Collections;
//import java.util.List;
//import java.util.UUID;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//import static org.mockito.Mockito.when;
//
///**
// * Unit tests for the UserService class using Mockito.
// * We use @ExtendWith to enable Mockito annotations for this test class.
// */
//@ExtendWith(MockitoExtension.class)
//public class UserServiceTest {
//
//    // @Mock creates a mock instance of UserRepository, simulating its behavior.
//    @Mock
//    private UserRepository userRepository;
//
//    // @InjectMocks creates an instance of UserService and injects the mocks
//    // (in this case, the userRepository mock) into it.
//    @InjectMocks
//    private UserService userService;
//
//    @Test
//    public void testGetAllUsers_shouldReturnAllUsersFromRepository() {
//        // Arrange: Create a mock user list that our mocked repository will return.
//        User user = new User();
//        // Correction : Utiliser un UUID pour l'identifiant.
//        user.setId(UUID.fromString(UUID.randomUUID().toString()));
//        user.setFirstName("Jane");
//
//        List<User> expectedUsers = Collections.singletonList(user);
//
//        // Configure the mocked repository behavior:
//        // When userRepository.findAll() is called, return our prepared user list.
//        when(userRepository.findAll()).thenReturn(expectedUsers);
//
//        // Act: Call the service method we want to test.
//        List<UserResponse> actualUsers = userService.getAllUsers();
//
//        // Assert: Verify the result is what we expect.
//        assertNotNull(actualUsers);
//        assertEquals(expectedUsers.size(), actualUsers.size());
//        assertEquals(expectedUsers.get(0).getFirstName(), actualUsers.get(0).getFirstName());
//    }
//
//    @Test
//    public void testCreateUser_shouldSaveAndReturnUser() {
//        // Arrange: Create a user to be saved.
//        User newUser = new User();
//        newUser.setFirstName("Peter");
//        newUser.setEmail("peter.smith@example.com");
//
//        // Mock the repository behavior:
//        // When userRepository.save() is called with any User object,
//        // we'll return a user with an assigned ID to simulate a database save.
//        User savedUser = new User();
//        // Correction : Utiliser un UUID pour l'identifiant.
//        savedUser.setId(UUID.fromString(UUID.randomUUID().toString()));
//        savedUser.setFirstName(newUser.getFirstName());
//        savedUser.setEmail(newUser.getEmail());
//        when(userRepository.save(newUser)).thenReturn(savedUser);
//
//
//        // Act: Call the service method.
//        User result = userService.createUser(newUser);
//
//        // Assert: Verify the returned user is correct.
//        assertNotNull(result.getId());
//        assertEquals(savedUser.getId(), result.getId());
//        assertEquals(newUser.getFirstName(), result.getFirstName());
//    }
//}

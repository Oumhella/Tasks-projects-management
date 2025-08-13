//package com.projectmanager;
//
//import com.projectmanager.controller.UserController;
//import com.projectmanager.entity.User;
//import com.projectmanager.service.user.UserService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//
//import java.util.Collections;
//import java.util.List;
//import java.util.UUID;
//
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//
///**
// * Unit tests for the UserController class using a pure Mockito setup.
// * This approach avoids loading a Spring application context, making the tests faster and more isolated.
// */
//@ExtendWith(MockitoExtension.class)
//public class UserControllerTest {
//
//    // InjectMocks injects the mocked dependencies into the controller instance.
//    @InjectMocks
//    private UserController userController;
//
//    // Mock creates a mock instance of the UserService.
//    @Mock
//    private UserService userService;
//
//    private MockMvc mockMvc; // Used to perform simulated HTTP requests.
//
//    /**
//     * This method is executed before each test. It sets up MockMvc
//     * using a standalone configuration with our mocked controller.
//     */
//    @BeforeEach
//    public void setup() {
//        this.mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
//    }
//
//    @Test
//    public void testGetAllUsers_shouldReturnListOfUsers() throws Exception {
//        // Arrange: Create a mock user list that our mocked service will return.
//        User user = new User();
//        String userId = UUID.randomUUID().toString();
//        user.setId(userId);
//        user.setFirstName("John");
//        user.setLastName("Doe");
//        user.setEmail("john.doe@example.com");
//        user.setRole("developer");
//
//        List<User> userList = Collections.singletonList(user);
//
//        // Act & Assert:
//        // 1. Configure the mocked service behavior: when getAllUsers() is called,
//        //    return our prepared userList.
//        when(userService.getAllUsers()).thenReturn(userList);
//
//        // 2. Perform a GET request to the /api/v1/users endpoint.
//        mockMvc.perform(get("/api/v1/users"))
//                .andExpect(status().isOk()) // 3. Expect a 200 OK status.
//                .andExpect(jsonPath("$.size()").value(userList.size())) // 4. Check the size of the returned JSON list.
//                .andExpect(jsonPath("$[0].firstName").value("John")) // 5. Verify a value in the first item.
//                .andExpect(jsonPath("$[0].id").value(userId)); // 6. Verify the UUID.
//    }
//
//    @Test
//    public void testGetAllUsers_shouldReturnEmptyListIfNoUsers() throws Exception {
//        // Arrange: Configure the mocked service to return an empty list.
//        when(userService.getAllUsers()).thenReturn(Collections.emptyList());
//
//        // Act & Assert:
//        // 1. Perform a GET request.
//        mockMvc.perform(get("/api/v1/users"))
//                .andExpect(status().isOk()) // 2. Expect a 200 OK status.
//                .andExpect(jsonPath("$.size()").value(0)); // 3. Verify the JSON list is empty.
//    }
//
//    @Test
//    public void testCreateUser_shouldReturnCreatedUserWith201() throws Exception {
//        // Arrange:
//        // Create a user object to send in the request body.
//        User newUser = new User();
//        newUser.setFirstName("Jane");
//        newUser.setLastName("Smith");
//        newUser.setEmail("jane.smith@example.com");
//
//        // Mock the service's behavior to return the created user.
//        User savedUser = new User();
//        String userId = UUID.randomUUID().toString();
//        savedUser.setId(UUID.fromString(userId));
//        savedUser.setFirstName("Jane");
//        savedUser.setLastName("Smith");
//        savedUser.setEmail("jane.smith@example.com");
//        when(userService.createUser(newUser)).thenReturn(savedUser);
//
//        String userJson = "{\"firstName\":\"Jane\",\"lastName\":\"Smith\",\"email\":\"jane.smith@example.com\"}";
//
//        // Act & Assert:
//        mockMvc.perform(post("/api/v1/users")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(userJson))
//                .andExpect(status().isCreated()) // Expect a 201 Created status.
//                .andExpect(jsonPath("$.id").value(userId)) // Check that the returned user has the ID.
//                .andExpect(jsonPath("$.firstName").value("Jane")); // Verify a specific field.
//    }
//}

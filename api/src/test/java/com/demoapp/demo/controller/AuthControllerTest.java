package com.demoapp.demo.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.demoapp.demo.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository userRepository;

  @BeforeEach
  void setUp() {
    userRepository.deleteAll();
  }

  @Test
  @DisplayName("sucesso: cadastra usuario com email e senha validos")
  void signupCreatesUserWithValidData() throws Exception {
    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "sucesso@example.com",
              "password": "Senha123!"
            }
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.email").value("sucesso@example.com"));
  }

  @Test
  @DisplayName("sucesso: autentica usuario cadastrado com credenciais validas")
  void signinAuthenticatesRegisteredUser() throws Exception {
    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "login@example.com",
              "password": "Senha123!"
            }
            """))
        .andExpect(status().isOk());

    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "login@example.com",
              "password": "Senha123!"
            }
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("login@example.com"));
  }

  @Test
  @DisplayName("bug: API deveria aceitar os mesmos caracteres especiais aceitos pelo frontend")
  void signupShouldAcceptHashAsSpecialCharacter() throws Exception {
    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "bug-password@example.com",
              "password": "Senha123#"
            }
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("bug-password@example.com"));
  }

  @Test
  @DisplayName("bug: login com senha incorreta deveria retornar credenciais invalidas")
  void signinWithWrongPasswordShouldReturnInvalidCredentials() throws Exception {
    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "login-bug@example.com",
              "password": "Senha123!"
            }
            """))
        .andExpect(status().isOk());

    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "login-bug@example.com",
              "password": "errada"
            }
            """))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
  }
}

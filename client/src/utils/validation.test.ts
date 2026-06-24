import { isEmailValid, getEmailValidationMessage } from "./email";
import { isPasswordValid, getPasswordValidationMessage } from "./password";

describe("funcoes puras de validacao", () => {
  it("sucesso: valida emails no formato usuario@dominio.com", () => {
    expect(isEmailValid("aluno@example.com")).toBe(true);
    expect(getEmailValidationMessage("aluno@example.com")).toBe("");
  });

  it("bug: uma senha com exatamente 8 caracteres deveria respeitar o minimo informado na tela", () => {
    expect(isPasswordValid("Aa1@aaaa")).toBe(true);
    expect(getPasswordValidationMessage("Aa1@aaaa")).toBe("");
  });
});

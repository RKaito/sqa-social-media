import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./Button";
import Input from "./Input";

describe("componentes isolados", () => {
  it("sucesso: Input renderiza label, valor digitado e mensagem de erro", () => {
    const handleChange = jest.fn();

    render(
      <Input
        label="Email"
        value="aluno@example.com"
        onChange={handleChange}
        error="Email invÃ¡lido"
      />
    );

    const input = screen.getByDisplayValue("aluno@example.com");

    expect(input).toHaveValue("aluno@example.com");
    expect(screen.getByText("Email invÃ¡lido")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "novo@example.com" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("sucesso: Button mostra estado de carregamento e fica desabilitado", () => {
    render(<Button isLoading>Criar Conta</Button>);

    const button = screen.getByRole("button", { name: "Carregando..." });

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Carregando...");
  });
});

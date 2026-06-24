import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignUp from "./page";
import { authService } from "@/service/auth/auth";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";

const pushMock = jest.fn();
const loginMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/components/Header", () => ({
  __esModule: true,
  default: () => <header data-testid="header" />,
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signUp: jest.fn(),
  },
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

function fillSignUpForm(container: HTMLElement, password = "Senha123@") {
  const inputs = container.querySelectorAll("input");

  fireEvent.change(inputs[0], { target: { value: "aluno@example.com" } });
  fireEvent.change(inputs[1], { target: { value: password } });
  fireEvent.change(inputs[2], { target: { value: password } });
}

describe("fluxos de integracao da tela de cadastro", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ login: loginMock });
  });

  it("sucesso: cadastra usuario, salva autenticacao e redireciona para home", async () => {
    (authService.signUp as jest.Mock).mockResolvedValue({
      id: 1,
      email: "aluno@example.com",
    });

    const { container } = render(<SignUp />);

    fillSignUpForm(container);
    fireEvent.click(screen.getByRole("button", { name: "Criar Conta" }));

    await waitFor(() => {
      expect(authService.signUp).toHaveBeenCalledWith({
        email: "aluno@example.com",
        password: "Senha123@",
      });
    });

    expect(loginMock).toHaveBeenCalledWith({
      id: 1,
      email: "aluno@example.com",
    });
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("bug: deveria exibir a mensagem de E-mail já cadastrado", async () => {
    (authService.signUp as jest.Mock).mockRejectedValue(
  new AxiosError(
    "Request failed",
    "409",
    undefined,
    undefined,
    {
      data: {
        message: "E-mail já está em uso",
      },
      status: 409,
      statusText: "Conflict",
      headers: {},
      config: {} as any,
    }
  )
);

    const { container } = render(<SignUp />);

    fillSignUpForm(container);
    fireEvent.click(screen.getByRole("button", { name: "Criar Conta" }));

    expect(await screen.findByText("E-mail já cadastrado")).toBeInTheDocument();
  });
});

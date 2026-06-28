import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./Button";
import Input from "./Input";
import PostCard from "./PostCard"; 

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

  it("sucesso: PostCard exibe likes e dislikes do post", () => {
    const post = {
      id: 1,
      title: "Post de teste",
      body: "Conteúdo do post de teste",
      liked: false,
      reactions: {
        likes: 10,
        dislikes: 2,
      },
  };

  render(
    <PostCard
      post={post}
      isAuthenticated={false}
      onLike={jest.fn()}
    />
  );

    expect(screen.getByText("Post de teste")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do post de teste")).toBeInTheDocument();
    expect(screen.getByText("Likes: 10")).toBeInTheDocument();
    expect(screen.getByText("Dislikes: 2")).toBeInTheDocument();
  });
});

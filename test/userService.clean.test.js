const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpa e Refatorada', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('deve criar um novo usuário com sucesso', () => {
    // Arrange: A preparação é mínima, pois os dados já estão definidos.

    // Act
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Assert
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(dadosUsuarioPadrao.nome);
    expect(usuarioCriado.email).toBe(dadosUsuarioPadrao.email);
    expect(usuarioCriado.idade).toBe(dadosUsuarioPadrao.idade);
    expect(usuarioCriado.status).toBe('ativo');
    expect(usuarioCriado.isAdmin).toBe(false); 
  });

  test('deve buscar um usuário existente pelo ID', () => {
    // Arrange
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado).toBeDefined();
    expect(usuarioBuscado).not.toBeNull();
    expect(usuarioBuscado.id).toBe(usuarioCriado.id);
    expect(usuarioBuscado.nome).toBe(usuarioCriado.nome);
  });

  test('deve desativar um usuário comum com sucesso', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar um usuário que seja administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo'); // O status não deve mudar
  });

  test('deve gerar um relatório contendo os nomes dos usuários cadastrados', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).toContain(usuario1.nome); // Verifica o conteúdo, não a formatação
    expect(relatorio).toContain(usuario2.nome); // Verifica o conteúdo, não a formatação
  });

  test('deve lançar um erro ao tentar criar um usuário menor de idade', () => {
    const acaoDeCriarMenor = () => {
      userService.createUser('Menor', 'menor@email.com', 17);
    };

    // Assert
    expect(acaoDeCriarMenor).toThrow('O usuário deve ser maior de idade.');
  });

  
  test('deve gerar um relatório informando que não há usuários quando o banco de dados está vazio', () => {
    // Arrange: Nenhuma preparação necessária, pois o beforeEach já limpou o banco.

    // Act
    const relatorio = userService.generateUserReport();
    
    // Assert
    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });
});
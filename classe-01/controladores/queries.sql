DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id serial primary key,
    nome varchar(30) not null,
    idade smallint,
    email not null unique,
    telefone char(11),
    cpf char(11) not null unique
);

DROP TABLE IF EXISTS status_empréstimos;
CREATE TABLE status_empréstimos (
    status_empréstimo text
);

INSERT INTO status_empréstimos
(status_empréstimo)
VALUES
('pendente'),
('devolvido')

DROP TABLE IF EXISTS emprestimos;
CREATE TABLE emprestimos (
    id_emprestimo serial primary key,
    id_usuario not null,
    id_livro not null,
    status_empréstimo default 'devolvido'
    foreign key (status_empréstimo) references status_empréstimos (status_empréstimo)
    foreign key (id_usuario) references usuarios (id)
    foreign key (id_livro) references livros (id)
);
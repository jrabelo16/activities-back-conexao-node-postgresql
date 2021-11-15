const conexao = require('../conexao')

const listarEmprestimos = async (req, res) => {
    try {
        const { rows: emprestimos } = await conexao.query('select id_emprestimo, status_emprestimo from emprestimos');
        
        for (let emprestimo of emprestimos) {
            emprestimo.usuario = conexao.query('select nome from usuarios where id = $1', [emprestimo.id_usuario])
            emprestimo.telefone = conexao.query('select telefone from usuarios where id = $1', [emprestimo.id_usuario])
            emprestimo.email = conexao.query('select email from usuarios where id = $1', [emprestimo.id_usuario])
            emprestimo.livro = conexao.query('select nome from livros where id = $1', [emprestimo.id_livro])
        }
        
        return res.status(200).json(emprestimos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterEmprestimo = async (req, res) => {
    const { id } = req.params;
    try {
        const emprestimo = await conexao.query('select * from emprestimos where id = $1', [id]);
        
        emprestimo.usuario = conexao.query('select nome from usuarios where id = $1', [emprestimo.id_usuario])
        emprestimo.telefone = conexao.query('select telefone from usuarios where id = $1', [emprestimo.id_usuario])
        emprestimo.email = conexao.query('select email from usuarios where id = $1', [emprestimo.id_usuario])
        emprestimo.livro = conexao.query('select nome from livros where id = $1', [emprestimo.id_livro])

        if (emprestimo.rowCount === 0) {
            return res.status(404).json('Empréstimo não encontrado');
        }

        return res.status(200).json(emprestimo.rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarEmprestimo = async (req, res) => {
    const { id_usuario, id_livro, status_empréstimo } = req.body;

    if (!id_usuario) {
        return res.status(400).json("O campo id do usuario é obrigatório.");
    }

    if (!id_livro) {
        return res.status(400).json("O campo id do livro é obrigatório.");
    }
       
    try {
        const query = 'insert into emprestimos (id_usuario, id_livro, status_empréstimo) values ($1, $2, $3, $4, $5)';
        const emprestimo = await conexao.query(query, [id_usuario, id_livro, status_empréstimo]);
        
        if (emprestimo.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastrar o empréstimo');
        }
        
        return res.status(200).json('Empréstimo cadastrado com sucesso.')
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarEmprestimo = async (req, res) => {
    const { id } = req.params;
    const { status_empréstimo } = req.body;
    
    try {
        const emprestimo = await conexao.query('select * from emprestimos where id = $1', [id]);
        
        if (emprestimo.rowCount === 0) {
            return res.status(404).json('Empréstimo não encontrado');
        }

        const query = 'update emprestimos set status_empréstimo = $1 where id = $2';
        const emprestimoAtualizado = await conexao.query(query, [status_empréstimo, id]);

        if (emprestimoAtualizado.rowCount === 0) {
            return res.status(404).json('Não foi possível atualizar o emprestimo');
        }

        return res.status(200).json('Empréstimo atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirEmprestimo = async (req, res) => {
    const { id } = req.params;

    try {
        const emprestimo = await conexao.query('select * from emprestimos where id = $1', [id]);

        if (emprestimo.rowCount === 0) {
            return res.status(404).json('Empréstimo não encontrado');
        }

        const query = 'delete from emprestimos where id = $1';
        const emprestimoExcluido = await conexao.query(query, [id]);

        if (emprestimoExcluido.rowCount === 0) {
            return res.status(404).json('Não foi possível excluir o empréstimo');
        }

        return res.status(200).json('Empréstimo excluido com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarEmprestimos,
    obterEmprestimo,
    cadastrarEmprestimo,
    atualizarEmprestimo,
    excluirEmprestimo
}
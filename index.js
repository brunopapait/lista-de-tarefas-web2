const axios = require('axios');
const restify = require('restify');
const errors = require('restify-errors');

const server = restify.createServer({
    name: 'Meu app',
    version: '1.0.0'
});

const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '57a8tycd',
        database: 'db',
        port: 3306
    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
    console.log('%s está rodando na porta %s', server.name, server.url);
});

server.get('/', restify.plugins.serveStatic({
    directory: './src/',
    file: 'index.html'
}));

server.post('/create', async (req, res, next) => {
    const { id, name, description, start_date, end_date, priority } = req.body;
    await knex('task').insert({ id, name, description, start_date, end_date, priority });
    return res.json('Salvo com sucesso');
});

server.get('/read', function (req, res, next) {
    knex('task').then((dados) => {
        res.send(dados)
    }, next);
    return next();
});

server.del('/delete/:id', (req, res, next) => {
    const { id } = req.params;
    knex('task')
        .where('id', id)
        .del()
        .then((dados) => {
            if (!dados) {
                return res.send(new errors.BadRequestError(`Registro de id ${id} não encontrado !`));
            }
            res.send(`Registro de id ${id} excluido com sucesso !`);
        }, next);
    return next();
});

server.get('/task/:id', (req, res, next) => {
    const { id } = req.params;
    knex('task')
        .where('id', id).first()
        .then((dados) => {
            if (!dados) {
                return res.send(new errors.BadRequestError(`Registro de id ${id} não encontrado !`));
            }
            res.send(dados);
        }, next);
    return next();
});

server.put('/update/:id', (req, res, next) => {
    const { id } = req.params;
    const { name, description, start_date, end_date, priority } = req.body;
    knex('task')
        .where('id', id)
        .update({ name, description, start_date, end_date, priority })
        .then((dados) => {
            if (!dados) {
                return res.send(new errors.BadRequestError(`Registro de id ${id} não encontrado !`));
            }
            res.send(`Registro de id ${id} atualizado com sucesso !`);
        }, next);
    return next();
});
module.exports.setup = function (app, handlers) {
	app.get('/games', handlers.entities.list);
	app.get('/games/:id', handlers.entities.get);
	app.post('/games', handlers.entities.create);
	app.put('/games/:id', handlers.entities.update);
	app.delete('/games/:id', handlers.entities.remove);
};
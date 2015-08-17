var path = require('path');

module.exports = function (mongoose) {
	
	//Обьявляем схему для Mongoose
	var Schema = new mongoose.Schema({
		steps: { type: String, default: '' }
	});
	// Инициализируем модель с именем файла, в котором она находится
	return mongoose.model(path.basename(module.filename, '.js'), Schema);
};
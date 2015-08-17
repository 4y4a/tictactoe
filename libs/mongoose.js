var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var async = require('async');
var config = require('./config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

var models = {};

//Инициализируем все схемы
var init = function (modelsDirectory, callback) {
  //Считываем список файлов из modelsDirectory
  var schemaList = fs.readdirSync(modelsDirectory);
  //Создаем модели Mongoose и вызываем callback, когда все закончим
  async.each(schemaList, function (item, cb) {
    var modelName = path.basename(item, '.js');
    models[modelName] = require(path.join(modelsDirectory, modelName))(mongoose);
    cb();
  }, callback);
};

//Возвращаем уже созданные модели из списка
var model = function (modelName) {
  var name = modelName.toLowerCase();
  if (typeof models[name] == "undefined") {
    // Если модель на найдена то создаем ошибку
    throw "Model '" + name + "' is not exist";
  }
  return models[name];
};

module.exports.init = init;
module.exports.model = model;
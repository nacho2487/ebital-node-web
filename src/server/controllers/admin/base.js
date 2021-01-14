var _ = require('lodash');
var localImagesManager = require('./../../helpers/localImagesManager');
var path = require('path');

var baseController = function (Model, url, modelKey) {
  var get = function () {
    return new Promise(function (resolve, reject) {
      Model.find()
        .sort('position')
        .populate('service')
        .exec(function (err, items) {
          if (err) {
            reject(err);
          }
          resolve(items);
        });
    });
  };

  var getById = function (req, res) {
    return new Promise(function (resolve, reject) {
      Model.findById(req.params.id).exec(function (err, item) {
        if (err) {
          reject(err);
        } else if (item) {
          resolve(item);
        } else {
          res.status(404).send('Not found');
        }
      });
    });
  };

  var put = function (req, res) {
    return new Promise(function (resolve, reject) {
      _.merge(req.item, req.body);
      req.item.save(function (err) {
        if (err) {
          reject(err);
        }
        if (req.validationErrors()) {
          req.flash('errors', req.validationErrors());
          return res.redirect(
            `/${req.getLocale()}/${url}/${req.item._id}/edit`
          );
        }
        req.flash('success', {
          msg: req.__n(
            'UpdatedMessage %%s',
            'UpdatedMessage %%s',
            1,
            req.__n(modelKey, 1)
          ),
        });
        resolve(req);
      });
    });
  };

  var post = function (req, res) {
    return new Promise(function (resolve, reject) {
      var model = new Model(req.body);
      model.save(function (err) {
        if (err) {
          reject(err);
        }
        if (req.validationErrors()) {
          req.flash('errors', req.validationErrors());
          return res.redirect(`/${req.getLocale()}/${url}/${model._id}/edit`);
        }
        req.flash('success', {
          msg: req.__n(
            'AddedMessage %%s',
            'AddedMessage %%s',
            1,
            req.__n(modelKey, 1)
          ),
        });
        resolve(model);
      });
    });
  };

  var remove = function (req) {
    return new Promise(function (resolve, reject) {
      Model.remove({ _id: req.params.id }, function (err, model) {
        if (err) {
          reject(err);
        }
        req.flash('info', {
          msg: req.__n(
            'DeletedMessage %%s',
            'DeletedMessage %%s',
            1,
            req.__n(modelKey, 1)
          ),
        });
        resolve(model);
      });
    });
  };

  var updatePosition = function (id, position) {
    return new Promise(function (resolve, reject) {
      Model.update({ _id: id }, { position: position }).exec(function (
        err,
        data
      ) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };

  var updateAllPositions = function () {
    return new Promise(function (resolve, reject) {
      Model.where('position')
        .gte(0)
        .exec(function (err, data) {
          if (err) {
            reject(err);
          }
          _.forEach(data, function (item) {
            Model.update(
              { _id: item._id },
              { position: item.position + 1 }
            ).exec();
          });
          resolve(data);
        });
    });
  };

  var addSingleImage = function (file) {
    return new Promise(function (resolve, reject) {
      try {
        var originalFilename = file.filename;
        var filenameSplitted = file.filename.split('.');
        var filename = filenameSplitted[0];
        var fileext = filenameSplitted[1];
        var url = `/${originalFilename}`;
        resolve({ filename: filename, fileext: fileext, url: url });
      } catch (e) {
        reject(e);
      }
    });
  };

  var removeSingleImage = function (filename) {
    return new Promise(function (resolve, reject) {
      var imagePath = path.join(__dirname, `../../../../uploads/${filename}`);
      localImagesManager.remove(imagePath).then(
        function (result) {
          resolve(result);
        },
        function () {
          resolve();
        }
      );
    });
  };

  var addMultipleImages = function (images) {
    return new Promise(function (resolve, reject) {
      var imagesToAdd = [];
      _.map(images, function (file) {
        try {
          var originalFilename = file.filename;
          var filenameSplitted = file.filename.split('.');
          var filename = filenameSplitted[0];
          var fileext = filenameSplitted[1];
          var url = `/${originalFilename}`;
          imagesToAdd.push({ filename: filename, fileext: fileext, url: url });
          if (imagesToAdd.length === images.length) {
            resolve(imagesToAdd);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  var removeMultipleImages = function (images) {
    return new Promise(function (resolve, reject) {
      var imagesToRemove = [];
      _.map(images, function (image) {
        var filename = `${image.filename}.${image.fileext}`;
        var imagePath = path.join(__dirname, `../../../../uploads/${filename}`);
        localImagesManager.remove(imagePath).then(
          function () {
            imagesToRemove.push({ filename: filename });
            if (imagesToRemove.length === images.length) {
              resolve(imagesToRemove);
            }
          },
          function (err) {
            imagesToRemove.push({ filename: filename });
            if (imagesToRemove.length === images.length) {
              resolve(imagesToRemove);
            }
          }
        );
      });
    });
  };

  return {
    get: get,
    getById: getById,
    post: post,
    put: put,
    remove: remove,
    updatePosition: updatePosition,
    updateAllPositions: updateAllPositions,
    addSingleImage: addSingleImage,
    removeSingleImage: removeSingleImage,
    addMultipleImages: addMultipleImages,
    removeMultipleImages: removeMultipleImages,
  };
};

module.exports = baseController;

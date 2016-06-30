var chai = require('chai');

var expect = chai.expect;
var should = chai.should();

var newsMock = require('../mocks/news').News;
var controller = require('../../controllers/admin/base');

var Model = {};



describe('Base Controller', function() {
	
	describe('News with base Controller', function() {
		
		it('Should get all items', function(done){
			Model.find = function() {
				return {
					sort: function(){
						return {
							populate: function(){
								return {
									exec: function(callback){
										callback(null, newsMock);
									}
								};
							}
						};
					}
				};		
			};
			var newsController = controller(Model, '/', 'News');
			var req = {};
			var res = {};
			newsController.get(req, res).then(function(items){
				try{
					should.exist(items);
					expect(items).to.be.a('array');
					expect(items).to.have.lengthOf(2);
					done();
				} catch(e){
					return done(e);
				}				
			});
		});

		it('Should get only one item', function(done){
			Model.findById = function() {
				return {
					exec: function(callback){
						callback(null, newsMock[0]);
					}
				};       		
			};
			var newsController = controller(Model, '/', 'News');
			var req = { params: 1};
			var res = {};
			newsController.getById(req, res).then(function(item){
				try{
					should.exist(item);
					expect(item).to.be.an('object');
					expect(item).to.have.property('title');
					done();
				} catch(e) {
					return done(e);
				}
			});
		});

		it('Should update model', function(done){			
			var newsController = controller(Model, '/', 'News');
			var req = { 
				item: newsMock[0],
				body: newsMock[1],
				flash: function(){},
				validationErrors: function(){},
				__n: function(){}
			};
			req.item.save = function(callback){
				callback(null);
			};
			req.body.save = function(callback){
				callback(null);
			};
			var res = {};
			newsController.put(req, res).then(function(reqRes){
				try{
					//should.exist(res.messages.success);
					should.exist(reqRes.item);
					expect(reqRes.item.title.es).to.equal(reqRes.body.title.es);
					expect(reqRes.item).to.deep.equal(reqRes.body);
					done();
				} catch(e) {
					return done(e);
				}				
			});
		});

		it('Should update all positions', function(done){
			Model.where = function() {
				return {
					gte: function(){
						return {
							exec: function(callback){
								callback(null, newsMock);
							}
						};
					}
				};
			};
			Model.update = function() {
				return {
					exec: function(){
					}
				};
			};
			var newsController = controller(Model, '/', 'News');
			var req = { 
				item: newsMock[0],
				body: newsMock[1],
				flash: function(){},
				validationErrors: function(){},
				__n: function(){}
			};
			var res = {};
			newsController.updateAllPositions(req, res).then(function(){
				try{				  	
					done();
				} catch(e) {
					return done(e);
				}				
			});
		});
	});
});
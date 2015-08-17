;(function($, undefined){

	$.Loader = function( config ){
		var div = '<div id="loader"><div></div></div>';
		$('body').append(div);

		return $.ajax(config)
					.always(function(){
						$('#loader').remove();
					}.bind(this));
	};

	window.Game = Class.extend({

		init: function( config ) {
			this.length = 9; // количество клеток
			this.isXturn = true; // true - ход Х, false - ход 0
			this.config = config;
			this.status = $('.status');
			this.templates = {
				cell: $('#cell-view-teplate').tmpl(),
			}
			this.view(config);
		},

		view: function() {
			this.config.container.html('');
			for ( var i = 0; i < this.length; i++ ) {
				this.cell(i);
			}
			var wins = this.checkWining();
			switch(wins){
				case 'x':
					this.status.html('Крестики выиграли');
					this.config.game = false;
					break;
				case 'o':
					this.config.game = false;
					this.status.html('Нолики выиграли');
					break;
				case false:
					if ( this.config.data.steps == this.length) {
						this.status.html('Ничья');
						this.config.game = false;
					} else {
						if (this.isXturn) {
							this.status.html('Ход крестиков');
						} else {
							this.status.html('Ход ноликов');
						}
					}
					break;
			}
		},

		cell: function(i) {
			var cellClass = '';
			var index = this.config.data.steps.indexOf(i);
			if ( index != -1 ) {
				if ( index % 2 )
					cellClass = 'o';
				else 
					cellClass = 'x';
			}
			var cell = this.templates.cell({
				class: cellClass,
				index: i
			});
			this.config.container.append(cell);
			cell.on('click', this.step.bind(this));
		},

		step: function( e ) {
			var element = $(e.delegateTarget);
			if ( !this.config.game ) return false;
			if ( element.hasClass('x') || element.hasClass('o') ) return false;

			$.Loader({
				url: /games/ + this.config.data._id,
				type: "PUT",
				data: {
					'steps': this.config.data.steps+element.data('index')
				}
			})
			.done(function(data){
				if ( data.length ) { 
					this.isXturn = !this.isXturn;
					this.config.data = data[0];
					this.view();
				}
				
			}.bind(this));	
		},

		checkWining: function() {
			var xArr = [];
			var oArr = [];
			var flag = true;
			for ( var i = 0; i < this.config.data.steps.length; i++ ) {
				if ( flag ) {
					xArr.push(parseInt(this.config.data.steps[i]));
				} else {
					oArr.push(parseInt(this.config.data.steps[i]));
				}
				flag = !flag;
			}

			if ( this.checkWiningArr(xArr) && xArr.length ) {
				return 'x';
			}
			if ( this.checkWiningArr(oArr) && oArr.length ) {
				return 'o';
			}
			return false;
		},

		checkWiningArr: function( arr ) {
			
			var winCombinations = [
				[0,1,2],
				[3,4,5],
				[6,7,8],
				[0,3,6],
				[1,4,7],
				[2,5,8],
				[0,4,8],
				[2,4,6],
			];
			for ( var i = 0; i < winCombinations.length; i++ ) {
				if (this.contains(arr, winCombinations[i]))	return true;
			}
			return false;
		},

		contains: function( arr, subarr ) {
			for(var i=0; i<subarr.length; i++){
		        if(arr.indexOf(subarr[i]) == -1) return false;
		    }
		    return true;
		}
	});
	
	window.gameList = Class.extend({

		init: function( config ) {
			this.config = config;
			this.activeClass = 'active';
			this.templates = {
				row: $('#game-list-row-template').tmpl()
			}
			$('.game-list-wrap p i').on('click', this.load.bind(this))
			this.load();
		},

		view: function(data) {
			var row;
			this.config.container.html('');
			for ( var i = 0; i < data.length; i++ ) {
				row = this.templates.row(data[i]);
				row.data('item', data[i]);
				this.config.container.append(row);
				$('i', row).on('click', this.del.bind(this));
				$(row).on('click', this.show.bind(this));
			}
		},

		load: function() {
			$.ajax({
				url:'/games/',
				type: 'GET'
			})
			.done(this.view.bind(this))
		},

		del: function(e) {
			var element = $(e.delegateTarget);
			var row = element.parent();
			$.ajax({
				type: 'DELETE',
				url: '/games/' + row.data('id')
			})
			.done(function(data){
				row.remove();
			});
			e.stopPropagation();
			e.preventDefault();
			return false;
		},

		show: function(e){
			var element = $(e.delegateTarget);
			$('li', this.config.container).removeClass(this.activeClass);
			element.addClass(this.activeClass);
			game = new Game({
				container: $(".tic-tac-toe"),
				data: element.data('item'),
				game: false
			});
		}

	});

	$(document).on('ready', function(){

		var game;

		function init(){
			$.Loader({
				url: '/games/',
				type: 'POST'
			})
			.done(function(data){
				game = new Game({
					container: $(".tic-tac-toe"),
					data: data,
					game: true
				});
			});
			new gameList({
				container: $('.game-list'),
			});	
		};

		init();

		$('.new-game-butt').on('click', init);
		

	});

})(jQuery)
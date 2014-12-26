$.fn.exists = function(){
	return $(this).length > 0;
}

$('document').ready(function(){
	
	var Move = {
		UP:38,
		RIGHT:39,
		DOWN:40,
		LEFT:37
	};
    var message = {
        GAMEOVER: 1,
        RESUME: 2
    };
    var button = {
        START: 1,
        PAUSE: 2,
        RESUME: 3
    };
	
	var Snake = {
		gameContext: "",
		currentPosition: {X:50,Y:100},
        foodPosition: [],
		snakeSize: 10,
        startLength: 3,
        snakeLength : 3,
		direction: 'right',
        body: [],
        randomPoint: [],
        allowPressKeys: false,
        score: 0,
        movement: null,
        status: "start",
		init: function(){
			Snake.gameContext.fillStyle = "#000";

			var x = 50;
			var y = 50;
			var w = 10;
			var h = 10;
            /*
            for (i = 1; i <= Snake.startLength; i++){
                Snake.body.push([Snake.currentPosition.X-(i*Snake.snakeSize), Snake.currentPosition.Y]);
                alert(1);
            }
            */
			Snake.draw();

		},
		draw: function(){
            if (Snake.status != "playing"){
                return false;
            }
            if ( Snake.body.some(Snake.snakeEaten) ){
                Snake.gameOver();
                return false;
            }
            
            if ( Snake.currentPosition.X > $('#gameScreen').width()-2 || Snake.currentPosition.X < 0 ||
                 Snake.currentPosition.Y > $('#gameScreen').height()-2 || Snake.currentPosition.Y < 0 ){
                Snake.gameOver();
                return false;
            }

            //alert( Snake.currentPosition.X + ' ' + $('#gameScreen').width() );
            Snake.body.push([Snake.currentPosition.X, Snake.currentPosition.Y]);
            Snake.gameContext.fillStyle = "#000";
			Snake.gameContext.fillRect(Snake.currentPosition.X, Snake.currentPosition.Y, Snake.snakeSize, Snake.snakeSize);
            if ( Snake.body.length > Snake.snakeLength ){
                var itemToRemove = Snake.body.shift();
                Snake.gameContext.clearRect(itemToRemove[0], itemToRemove[1], Snake.snakeSize, Snake.snakeSize);
            }

            if ( Snake.currentPosition.X == Snake.foodPosition[0] && Snake.currentPosition.Y == Snake.foodPosition[1]){
                Snake.placeFood();
                Snake.snakeLength += 1;
                Snake.score = (Snake.snakeLength - 3)*10;
                $('#score').text(Snake.score);
            }
		},
		handleMove: function(){
			$(document).keydown(function(e){
                if ( !Snake.allowPressKeys ){
                    return false;
                }
				var key = e.charCode || e.keyCode || 0;
				if ( key == null){
					key = window.event.charCode || window.event.keyCode || 0;
				}
				switch(key){
					case Move.UP:
                        if ( Snake.direction != 'down' && Snake.direction != 'up'){
						    Snake.direction = 'up';
                            //Snake.currentPosition.Y = Snake.currentPosition.Y - Snake.snakeSize;
                        }
						//Snake.currentPosition.Y = Snake.currentPosition.Y - Snake.snakeSize;
						//Snake.gameContext.fillRect(Snake.currentPosition.X, Snake.currentPosition.Y, Snake.snakeSize, Snake.snakeSize);
						break;
					case Move.RIGHT:
                        //$("ul#list").append("<li><h1>" + element[0] + " == " + Snake.currentPosition.X + " && " + element[1] + " == " + Snake.currentPosition.Y + "</h1></li>");
						if ( Snake.direction != 'left' && Snake.direction != 'right'){
                            Snake.direction = 'right';
                            //Snake.currentPosition.X = Snake.currentPosition.X + Snake.snakeSize;
                        }
						//Snake.currentPosition.X = Snake.currentPosition.X + Snake.snakeSize;
						//Snake.gameContext.fillRect(Snake.currentPosition.X, Snake.currentPosition.Y, Snake.snakeSize, Snake.snakeSize);
						break;
					case Move.DOWN:
						if ( Snake.direction != 'up' && Snake.direction != 'down'){
                            Snake.direction = 'down';
                            //Snake.currentPosition.Y = Snake.currentPosition.Y + Snake.snakeSize;
                        }
						//Snake.currentPosition.Y = Snake.currentPosition.Y + Snake.snakeSize;
						//Snake.gameContext.fillRect(Snake.currentPosition.X, Snake.currentPosition.Y, Snake.snakeSize, Snake.snakeSize);
						break;
					case Move.LEFT:
						if ( Snake.direction != 'right' && Snake.direction != 'left'){
                            Snake.direction = 'left';
                            //Snake.currentPosition.X = Snake.currentPosition.X - Snake.snakeSize;
                        }
						//Snake.currentPosition.X = Snake.currentPosition.X - Snake.snakeSize;
						//Snake.gameContext.fillRect(Snake.currentPosition.X, Snake.currentPosition.Y, Snake.snakeSize, Snake.snakeSize);
						break;
					default:
						break;
				}

			});
		},
		move: function(){

			switch(Snake.direction){
				case 'up':
					Snake.currentPosition.Y = Snake.currentPosition.Y - Snake.snakeSize;
					//Snake.gameContext.fillRect(Snake.currentPosition.X, Snake.currentPosition.Y, Snake.snakeSize, Snake.snakeSize);
					break;
				case 'right':
					Snake.currentPosition.X = Snake.currentPosition.X + Snake.snakeSize;
					//Snake.gameContext.fillRect(Snake.currentPosition.X, Snake.currentPosition.Y, Snake.snakeSize, Snake.snakeSize);
					break;
				case 'down':
					Snake.currentPosition.Y = Snake.currentPosition.Y + Snake.snakeSize;
					//Snake.gameContext.fillRect(Snake.currentPosition.X, Snake.currentPosition.Y, Snake.snakeSize, Snake.snakeSize);
					break;
				case'left':
					Snake.currentPosition.X = Snake.currentPosition.X - Snake.snakeSize;
					//Snake.gameContext.fillRect(Snake.currentPosition.X, Snake.currentPosition.Y, Snake.snakeSize, Snake.snakeSize);
					break;
				default:
					break;
			}

			Snake.draw();
		},
        getRandomPoint: function(){
            var randomX = Math.floor(Math.random()*($('#gameScreen').width()/Snake.snakeSize))*Snake.snakeSize;
            var randomY = Math.floor(Math.random()*($('#gameScreen').height()/Snake.snakeSize))*Snake.snakeSize;
            return [randomX, randomY];
        },
        placeFood: function(){
            if (Snake.status != "playing"){
                return false;
            }
            Snake.randomPoint = Snake.getRandomPoint();

            while ( Snake.body.some(Snake.positionTaken) ){
                Snake.randomPoint = Snake.getRandomPoint();
            }
            Snake.foodPosition = Snake.randomPoint;
            Snake.gameContext.fillStyle = "#FFA500";
            Snake.gameContext.fillRect(Snake.randomPoint[0], Snake.randomPoint[1], Snake.snakeSize, Snake.snakeSize);
        },
        positionTaken: function(element){
            return ( element[0] == Snake.randomPoint[0] && element[1] == Snake.randomPoint[1] );
        },
        snakeEaten: function(element, index, array){
            //alert( element[0] + ' ' + Snake.currentPosition.X + '\n' + element[1] +' ' + Snake.currentPosition.Y);
            //$("ul#list").append("<li>" + element + " " + " " + index + " " + array + "  " + "</li>");

            if ( element[0] == Snake.currentPosition.X && element[1] == Snake.currentPosition.Y ){
                //$("ul#list").append("<li><h1>" + element[0] + " == " + Snake.currentPosition.X + " && " + element[1] + " == " + Snake.currentPosition.Y + "</h1></li>");
                return true;
            } else {
                //return false;
                return false;
            }
        },
        start: function(){
            Snake.status = "playing";
            $("#score").text("0");
            Snake.movement = setInterval(Snake.move,100);
            Snake.allowPressKeys = true;
            Snake.showButton(button.PAUSE);
            Snake.placeFood();
        },
        reset: function(){
            Snake.currentPosition = {X:50,Y:100};
            Snake.foodPosition = [];
            Snake.snakeLength = 3;
            Snake.body = [];
            Snake.randomPoint = [];
            Snake.score = 0;
            Snake.gameContext.clearRect(0,0, $('#gameScreen').width(), $('#gameScreen').height());
            Snake.showButton(button.START);
            Snake.status = "start";
            Snake.direction = "right";
        },
        pause: function(){
          clearInterval(Snake.movement);
          Snake.allowPressKeys = false;
          Snake.showButton(button.RESUME);
        },
        resume: function(){
            Snake.movement = setInterval(Snake.move,100);
            Snake.allowPressKeys = true;
            Snake.showButton(button.PAUSE);
        },
        gameOver: function(){
            Snake.reset();
            Snake.pause();
            Snake.showMessage(message.GAMEOVER);
            Snake.showButton(button.START);

        },
        showMessage: function(type){

            switch ( type ){
                case message.GAMEOVER:
                    $("#message").text("Perdiste!");
                    break;
                case message.RESUME:
                    $("#message").text("click Resume to Continue");
                    break;
            }
            $("#message").fadeIn('fast');
            $("#messageBackground").fadeIn('fast');
        },
        hideMessage: function(){
          $("#message").fadeOut('fast');
          $("#messageBackground").fadeOut('fast');
        },
        showButton: function(type){
            switch(type){
                case button.START:
                    $("#pauseStart").attr('value','Start');
                    break;
                case button.PAUSE:
                    $("#pauseStart").attr('value','Pause');
                    break;
                case button.RESUME:
                    $("#pauseStart").attr('value','Resume');
                    break;
            }
        }
	};

	if ( $('#gameScreen').exists() ){
		Snake.gameContext = $('#gameScreen').get(0).getContext('2d');
	} else {
		$("#gameScreen").before("<h1>Que Carajo, tu explorador web no soporta HTML5, seguro usas IE</h1>");
	}

    $("#restart").click(function(){
            Snake.pause();
            Snake.reset();
            Snake.start();
            Snake.hideMessage();

    });

    $("#pauseStart").click(function(){

        switch (Snake.status){
            case "start":
                Snake.status = "playing";
                Snake.start();
                Snake.hideMessage();
                break;
            case "playing":
                Snake.status = "pause";
                Snake.pause();
                Snake.showMessage(message.RESUME);
                break;
            case "pause":
                Snake.status = "playing";
                Snake.resume();
                Snake.hideMessage();
        }

    });
	
	Snake.init();
	Snake.handleMove();

});
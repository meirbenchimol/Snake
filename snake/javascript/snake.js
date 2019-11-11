console.log('hello2');

var name="john";

console.log(name);


/*
    Debut du Snake
 */

window.onload = function () {

    var canvas_width = 900;
    var canvas_height = 600;
    var bloc_size = 30;
    var ctx;
    var delay=100;
    var snakee;
    var apllee;
    var widthInBloc = canvas_width / bloc_size;
    var heightInBloc = canvas_height / bloc_size;
    var score;
    var timeout;


    init();

    function init() {
        var canvas = document.createElement("canvas");
        canvas.width = canvas_width;
        canvas.height= canvas_height;
        canvas.style.border = '4px solid #080744';
        canvas.style.display = 'flex';
        canvas.style.margin = '20px auto';
        canvas.style.backgroundColor = 'darkslateblue'
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[10,4],[9,4],[8,4],[7,4],[6,4],[5,4],[4,4]],'right');
        apllee = new Apple([10,10]);
        score = 0;
        refresh()

    }

    function refresh() {
        snakee.advance();
        if (snakee.checkCollision()){
            //game over
            gameOver();
        }
        else{
            if (snakee.isEatingApple(apllee)){
                score++;
                snakee.eatApple=true;
                do {
                    apllee.setNewPosition();
                }while (apllee.onSnake(snakee))
            }
            ctx.clearRect(0,0,canvas_width,canvas_height);
            snakee.draw();
            apllee.draw();
            drawScore();
            timeout = setTimeout(refresh,delay);
        }

    }

    //   -------------------     object snake  --------------------------------

    function Snake(body,direction) {

        this.body = body;
        this.direction = direction;
        this.eatApple = false;

        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (var i=0 ; i < this.body.length ; i++)
            {
                drawBloc(ctx,this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function () {
            var next_position = this.body[0].slice();
            switch (this.direction) {
                case "right":
                    next_position[0]++;
                    break;
                case "left":
                    next_position[0]--;
                    break;
                case "up":
                    next_position[1]--;
                    break;
                case "down":
                    next_position[1]++;
                    break;
                default :
                    throw ('invalide direction')
            }
            this.body.unshift(next_position);
            if (!this.eatApple){
                this.body.pop();
            }else {
                this.eatApple = false;
            }
        };

        this.setdirection = function (newdirection) {
            var alloDirection;
            switch (this.direction) {
                case "right":
                case "left":
                    alloDirection = ["up","down"];
                    break;
                case "up":
                case "down":
                    alloDirection = ["right","left"] ;
                    break;
                default:
                    throw ('invalide direction');

            }
            if (alloDirection.indexOf(newdirection)> -1){
                this.direction = newdirection;
            }
            
        };

        this.checkCollision=function () {
            var wallCollision=false;
            var snakeCollision=false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBloc - 1;
            var maxY = heightInBloc - 1;
            var isNotBetweenHorizontalWall = snakeX < minX || snakeX > maxX ;
            var isNotBetweenVerticalWall = snakeY < minY || snakeY > maxY ;

            if (isNotBetweenHorizontalWall || isNotBetweenVerticalWall){
                wallCollision = true;
            }

            for (var i=0 ; i < rest.length ; i++){
                if (snakeX === rest[i][0] && snakeY ===rest[i][1]){
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision ;
        };
        this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1]===appleToEat.position[1]){
                return true;
            }
            else {
                return false;
            }
        };

    }
    
    // ------------------------------ Apple --------------------------------------------
    
    function Apple(position) {
        this.position = position;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = bloc_size/2 ;
            var x = this.position[0]*bloc_size+radius;
            var y = this.position[1]*bloc_size+radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function () {
            var newX = Math.round(Math.random()* (widthInBloc-1));
            var newY = Math.round(Math.random()*(heightInBloc -1));
            this.position =[newX,newY];
        };
        this.onSnake=function (snake) {
            var isOnSnake = false;
            for (var i= 0;i < snake.body.length ;i++){
                if (this.position[0]=== snake.body[i][0] && this.position[1]===snake.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }

    // -------------------------------   draw bloc  ---------------------------------------

    function drawBloc(ctx,position) {
        var x = position[0]*bloc_size;
        var y = position[1] * bloc_size;
        ctx.fillRect(x,y,bloc_size,bloc_size)
    }

    // -------------------------------- game over ----------------------------------------
    function gameOver(){
        ctx.save();
        ctx.font = " bold 40px sans-serif";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        var centerX = canvas_width/2;
        var centerY = canvas_height/2;
        ctx.fillText("GAME OVER",centerX,centerY-30);
        ctx.font = "  20px sans-serif";
        ctx.fillText("Your Final Score is :"+score.toString(),centerX,centerY+20);
        ctx.fillText("You can do better ! press space nowww !",centerX,centerY+70);
        ctx.restore();
    }

    // -------------------------------- restart -------------------------------------------

    function restart(){
        snakee = new Snake([[10,4],[9,4],[8,4],[7,4],[6,4],[5,4],[4,4]],'right');
        apllee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refresh()
    }
// -------------------------------- restart -------------------------------------------

    function drawScore(){
        ctx.save();
        ctx.font = "  20px sans-serif";
        ctx.fillText("Score : "+score.toString(),800,30);
        ctx.restore();
    }


    // -------------------------------- event keyboard --------------------------------------



    document.onkeydown = function handleKeyDown(e) {
        var key = e.key;
        var newDirection;
        switch (key) {
            case 'ArrowLeft':
                newDirection = "left";
                break;
            case 'ArrowUp':
                newDirection = "up";
                break;
            case 'ArrowRight':
                newDirection = "right";
                break;
            case 'ArrowDown':
                newDirection = "down";
                break;
            case ' ':
                restart()
                return;
            default:
                return;
        }

        snakee.setdirection(newDirection)
    }

}











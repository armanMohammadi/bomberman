//$(document).on("ready", function () {
//    var wall = $('.wall-block');
//    for (var i = 0; i < 5; i++) {
//        wall.after(wall.clone());
//    }
//    var counter =0;
//    wall.css("background-color", "yellow");
//    $('#main-background').children('.wall-block').each(function (i) {
//
//        $(this).css('left',counter+ 'px');
//        $(this).css('top', '30px');
//        counter += 35;
//
//
//    });
//});


/**
 * Created by ÂÑãÇä on 04/03/2016.
 */
$(document).ready(function () {
    //Canvas stuff
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    //Lets save the cell width in a variable for easy control
    var cw = 30;
    var d;
    var bomberman;
    var b;
    var score;
    var zombies;
    var zombies_num = 2;
    var tem = 1;
    //Lets create the snake now
    var grasses; //an array of cells to make up the snake
    var blocks;
    var map;
    var timer;
    var bombs;
    var itemr;

    function init() {
        d = ""; //default direction
        b = false;
        score = 0;
        zombies = [];
        blocks = [];
        grasses = [];
        timer = 0;
        bombs = [];
        itemr = 2;

        make_map();

        make_zombies();

        make_bomberman();
        ////every 60ms
        if (typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 30);
    }

    init();
    //Lets paint the snake now
    function make_map() {
        map = new Array(Math.floor(h / cw));
        for (var i = 0; i < map.length; i++) {
            map[i] = new Array(Math.floor(w / cw));
            for (var j = 0; j < map.length; j++) {
                map[i][j] = "grass";
            }
        }
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {
                if (i == 0 || j == 0 || i + 1 >= map.length || j + 1 >= map[i].length || (i % 2 == 0 && j % 2 == 0)) {
                    map[i][j] = "block";
                    blocks.push({x: i * cw, y: j * cw, id: i + "," + j});
                }
                else {
                    grasses.push({x: i * cw, y: j * cw})
                }
            }
        }
        var wall = $('.wall-block');
        for (var i = 0; i < blocks.length - 1; i++) {
            wall.after(wall.clone());
        }
        var counter = 0;
        wall = $('.wall-block');
        $('#main-background').children('.wall-block').each(function (i) {
            //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
            $(this).css('position', 'absolute');
            $(this).css('left', blocks[counter].x + 'px');
            $(this).css('top', blocks[counter].y + 'px');
            $(this).css('id', blocks[counter].id);
            counter++;

        });


    }

    function make_zombies() {

        for (var i = 0; i < zombies_num; i++) {
            while (true) {
                temp1 = Math.floor(Math.random() * map.length);
                temp2 = Math.floor(Math.random() * map[temp1].length);
                if (map[temp1][temp2] != "block") {
                    var temp_add_zombies_con = true;
                    for (var j = 0; j < zombies.length; j++) {
                        if (zombies[j].px == temp1 * 3 && zombies[j].py == temp2 * 3)
                            temp_add_zombies_con = false;
                    }
                    if (temp_add_zombies_con) {
                        zombies.push({
                            x: temp1 * cw,
                            y: temp2 * cw,
                            dir: "right",
                            px: temp1 * 3,
                            py: temp2 * 3,
                            id: "zombie" + i + ""
                        });
                        break;
                    }
                }

            }
        }
        var zombie = $('.zombie-block');
        for (var i = 0; i < zombies.length - 1; i++) {
            zombie.after(zombie.clone());
        }
        var counter = 0;
        zombie = $('.zombie-block');
        $('#main-background').children('.zombie-block').each(function (i) {
            //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
            $(this).css('position', 'absolute');
            $(this).css('visibility', 'visible');
            $(this).css('left', zombies[counter].x + 'px');
            $(this).css('top', zombies[counter].y + 'px');
            $(this).css('id', zombies[counter].id);
            counter++;

        });

    }

    function make_bomberman() {
        while (true) {
            temp1 = Math.floor(Math.random() * map.length);
            temp2 = Math.floor(Math.random() * map[temp1].length);
            if (map[temp1][temp2] != "block") {
                var temp_add_bomberman_con = true;
                for (var j = 0; j < zombies.length; j++) {
                    if (zombies[j].px == temp1 * 3 && zombies[j].py == temp2 * 3)
                        temp_add_bomberman_con = false;
                }
                if (temp_add_bomberman_con) {
                    bomberman = {x: temp1 * cw, y: temp2 * cw, dir: "null", px: temp1 * 3, py: temp2 * 3};
                    break;
                }
            }
        }
        var bomberman_block = $('.bomberman-block');
        //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
        bomberman_block.css('position', 'absolute');
        bomberman_block.css('visibility', 'visible');
        bomberman_block.css('left', bomberman.x + 'px');
        bomberman_block.css('top', bomberman.y + 'px');


    }

    function paint_zombies() {


        var counter = 0;
        $('#main-background').children('.zombie-block').each(function (i) {
            //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
            $(this).css('position', 'absolute');
            $(this).css('left', zombies[counter].x + 'px');
            $(this).css('top', zombies[counter].y + 'px');

            counter++;

        });

    }

    function paint_bomberman() {
        var bomberman_block = $('.bomberman-block');
        //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
        bomberman_block.css('left', bomberman.x + 'px');
        bomberman_block.css('top', bomberman.y + 'px');

    }

    function paint_bombs() {
        var bomb_num=0;
        var explosion_num=0;
        for(var i=0;i<bombs.length;i++){
            if(bombs[i].mode=="pre_explosion"){
                bomb_num++;
            }else{
                explosion_num+=bombs[i].explosions.length;
            }
        }
        //$('#main-background').children('.zombie-block').count();
        //var counter = 0;
        //$('#main-background').children('.zombie-block').each(function (i) {
        //    //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
        //    if(counter<bombs.length) {
        //        if(bombs[counter].mode=="pre_explosion"){
        //
        //        }
        //        $(this).css('position', 'absolute');
        //        $(this).css('left', zombies[counter].x + 'px');
        //        $(this).css('top', zombies[counter].y + 'px');
        //    }else{
        //        $(this).remove();
        //    }
        //    counter++;
        //
        //});
    }

    function paint_exploration(x, y) {
        ctx.beginPath();
        ctx.arc(x + Math.floor(cw / 2), y + Math.floor(cw / 2), Math.floor(cw / 2), 0, 2 * Math.PI, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + Math.floor(cw / 2), y + Math.floor(cw / 2), Math.floor(cw / 4), 0, 2 * Math.PI, false);
        ctx.fillStyle = 'orange';
        ctx.fill();
    }

    function set_zombies_dir() {
        for (var i = 0; i < zombies.length; i++) {

            random_dir = Math.floor(Math.random() * 4);

            if (random_dir == 0)
                zombies[i].dir = "right";
            else if (random_dir == 1)
                zombies[i].dir = "left";
            else if (random_dir == 2)
                zombies[i].dir = "up";
            else if (random_dir == 3)
                zombies[i].dir = "down";
            var nx = zombies[i].x;
            var ny = zombies[i].y;
            if (zombies[i].dir == "right") nx += Math.floor(cw / 3);
            else if (zombies[i].dir == "left") nx -= Math.floor(cw / 3);
            else if (zombies[i].dir == "up") ny -= Math.floor(cw / 3);
            else if (zombies[i].dir == "down") ny += Math.floor(cw / 3);
            if (map[Math.floor((nx + 1) / cw)][Math.floor((ny + 1) / cw)] != "block") {
                if (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + 1) / cw)] != "block") {
                    if (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block") {
                        if (map[Math.floor((nx + 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block") {
                            continue;
                        }
                    }
                }

            }
            i--;

        }
    }

    function move_bomberman() {
        var nx = bomberman.x;
        var ny = bomberman.y;
        var step;
        if (timer % 3 != 0)
            step = Math.floor(cw / 9);
        else
            step = Math.floor(cw / 3) - 2 * Math.floor(cw / 9);
        if (bomberman.dir == "right") nx += step;
        else if (bomberman.dir == "left") nx -= step;
        else if (bomberman.dir == "up") ny -= step;
        else if (bomberman.dir == "down") ny += step;
        if ((map[Math.floor((nx + 1) / cw)][Math.floor((ny + 1) / cw)] != "block") &&
            (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + 1) / cw)] != "block") &&
            (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block") &&
            (map[Math.floor((nx + 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block")) {

            bomberman.x = nx;
            bomberman.y = ny;
            bomberman.px = Math.floor((nx * 3) / cw);
            bomberman.py = Math.floor((ny * 3) / cw);
        }
        paint_bomberman();

    }

    function move_zombieses() {
        for (var i = 0; i < zombies.length; i++) {
            var nx = zombies[i].x;
            var ny = zombies[i].y;
            var step;
            if (timer % 3 != 0)
                step = Math.floor(cw / 9);
            else
                step = Math.floor(cw / 3) - 2 * Math.floor(cw / 9);
            if (zombies[i].dir == "right") nx += step;
            else if (zombies[i].dir == "left") nx -= step;
            else if (zombies[i].dir == "up") ny -= step;
            else if (zombies[i].dir == "down") ny += step;
            if ((map[Math.floor((nx + 1) / cw)][Math.floor((ny + 1) / cw)] != "block") &&
                (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + 1) / cw)] != "block") &&
                (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block") &&
                (map[Math.floor((nx + 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block")) {
                var breakcon = false;
                for (var j = 0; j < zombies.length; j++) {
                    if (j != i && ((Math.floor((nx * 3) / cw) <= zombies[j].px + 3 && Math.floor((nx * 3) / cw) >= zombies[j].px - 3) &&
                        (Math.floor((ny * 3) / cw) <= zombies[j].py + 3 && Math.floor((ny * 3) / cw) >= zombies[j].py - 3))) {
                        breakcon = true;
                    }
                }
                if (j != i && ((Math.floor((nx * 3) / cw) <= bomberman.px + 3 && Math.floor((nx * 3) / cw) >= bomberman.px - 3) &&
                    (Math.floor((ny * 3) / cw) <= bomberman.py + 3 && Math.floor((ny * 3) / cw) >= bomberman.py - 3))) {
                    console.log("game over");
                    // init();
                    return;
                }
                if (!breakcon) {
                    zombies[i].x = nx;
                    zombies[i].y = ny;
                    zombies[i].px = Math.floor((nx * 3) / cw);
                    zombies[i].py = Math.floor((ny * 3) / cw);
                }

            }


        }
        paint_zombies();

    }

    function check_bombs() {
        for (var i = 0; i < bombs.length; i++) {
            if (bombs[i].time > timer - 200) {
                bombs[i].mode="pre_explosion";
            }
            else if (bombs[i].time < timer - 200 && bombs[i].time > timer - 230) {
                bombs[i].mode="post_explosion";
                for (var j = 0; j <= bombs[i].r; j++) {
                    if (map[Math.floor(bombs[i].x / cw) + j][Math.floor(bombs[i].y / cw)] == "block") {
                        break;
                    }
                    bombs[i].explosions.push({x:bombs[i].x + j * cw, y:bombs[i].y, t:timer-bombs[i].time});
                    for (var k = 0; k < zombies.length; k++) {
                        if (3 * (Math.floor(bombs[i].x / cw) + j) == zombies[k].px && 3 * (Math.floor(bombs[i].y / cw)) == zombies[k].py) {
                            zombies.splice(k, 1);
                        }
                    }
                    if (3 * (Math.floor(bombs[i].x / cw) + j) == bomberman.px && 3 * (Math.floor(bombs[i].y / cw)) == bomberman.py) {
                        console.log("game over");
                        // init();
                        return;
                    }
                }
                for (var j = 1; j <= bombs[i].r; j++) {
                    if (map[Math.floor(bombs[i].x / cw) - j][Math.floor(bombs[i].y / cw)] == "block") {
                        break;
                    }
                    bombs[i].explosions.push({x:bombs[i].x - j * cw,y:bombs[i].y, t:timer-bombs[i].time});
                    for (var k = 0; k < zombies.length; k++) {
                        if (3 * (Math.floor(bombs[i].x / cw) - j) == zombies[k].px && 3 * (Math.floor(bombs[i].y / cw)) == zombies[k].py) {
                            zombies.splice(k, 1);
                        }
                    }
                    if (3 * (Math.floor(bombs[i].x / cw) - j) == bomberman.px && 3 * (Math.floor(bombs[i].y / cw)) == bomberman.py) {
                        console.log("game over");
                        // init();
                        return;
                    }


                }
                for (var j = 1; j <= bombs[i].r; j++) {
                    if (map[Math.floor(bombs[i].x / cw)][Math.floor(bombs[i].y / cw) + j] == "block") {
                        break;
                    }
                    bombs[i].explosions.push({x:bombs[i].x, y:bombs[i].y + j * cw, t:timer-bombs[i].time});
                    for (var k = 0; k < zombies.length; k++) {
                        if (3 * (Math.floor(bombs[i].x / cw)) == zombies[k].px && 3 * (Math.floor(bombs[i].y / cw) + j) == zombies[k].py) {
                            zombies.splice(k, 1);
                        }
                    }
                    if (3 * (Math.floor(bombs[i].x / cw) ) == bomberman.px && 3 * (Math.floor(bombs[i].y / cw) + j) == bomberman.py) {
                        console.log("game over");
                        //init();
                        return;
                    }


                }
                for (var j = 1; j <= bombs[i].r; j++) {
                    if (map[Math.floor(bombs[i].x / cw)][Math.floor(bombs[i].y / cw) - j] == "block") {
                        break;
                    }
                    bombs[i].explosions.push({x:bombs[i].x, y:bombs[i].y - j * cw, t:timer-bombs[i].time});

                    for (var k = 0; k < zombies.length; k++) {
                        if (3 * (Math.floor(bombs[i].x / cw)) == zombies[k].px && 3 * (Math.floor(bombs[i].y / cw) - j) == zombies[k].py) {
                            zombies.splice(k, 1);
                        }
                    }

                    if (3 * (Math.floor(bombs[i].x / cw) ) == bomberman.px && 3 * (Math.floor(bombs[i].y / cw) - j) == bomberman.py) {
                        console.log("game over");
                        //init();
                        return;
                    }

                }


            }
            else {
                bombs.splice(i, 1);
                $('.bomb-block')[i].remove();
            }


        }
        paint_bombs();
    }

    function paint() {
        //To avoid the snake trail we need to paint the BG on every frame
        //Lets paint the canvas now
        if (timer % 3 == 0) {
            bomberman.dir = d;
            d = "";
        }
        if (b) {
            b = false;
            bombs.push({
                x: Math.round(bomberman.px / 3) * cw,
                y: Math.round(bomberman.py / 3) * cw,
                time: timer,
                r: itemr,
                explosions: [],
                mode:"pre_explosion"
            });
        }
        check_bombs();
        if (timer % 9 == 0) {
            set_zombies_dir();
        }

        //
        move_bomberman();
        //
        move_zombieses();
        timer++;
    }


    $(document).keydown(function (e) {
        var key = e.which;
        console.log("e.which : " + key);
        //We will add another clause to prevent reverse gear
        if (key == "37") d = "left";
        else if (key == "38") d = "up";
        else if (key == "39") d = "right";
        else if (key == "40") d = "down";
        else if (key == "32") b = true;
        else d = "";
        //The snake is now keyboard controllable
    })
})

///*******************
//
//$(document).ready(function () {
//    //Canvas stuff
//    var canvas = $("#canvas")[0];
//    var ctx = canvas.getContext("2d");
//    var w = $("#canvas").width();
//    var h = $("#canvas").height();
//
//    //Lets save the cell width in a variable for easy control
//    var cw = 30;
//    var d;
//    var food;
//    var score;
//    var zombies;
//    var tem = 1;
//    //Lets create the snake now
//    var snake_array; //an array of cells to make up the snake
//    var sang;
//    var map;
//    function init() {
//        d = "right"; //default direction
//        create_snake();
//        create_food(); //Now we can see the food particle
//        //finally lets display the score
//        score = 0;
//        sang = [];
//        map=[];
//        //zombies = [];
//        //for (var i = 0; i < 3 * cw; i++) {
//        //    for (var j = 0; j < 3 * cw; j++) {
//        //        if ((i < cw || i > 2 * cw) ^ (j < cw || j > cw))
//        //            zombies.push({x: i, y: j, c: "red"});
//        //    }
//        //}
//        //var whilecon=true;
//        //while(whilecon){
//        //    whilecon=false;
//        //    var tempH =Math.round(Math.random() *h);
//        //    var tempW =Math.round(Math.random() *w);
//        //
//        //}
//
//
//        for (var i = 0; i < h / (3 * cw); i++) {
//            for (var j = 0; j < w / (3 * cw); j++) {
//                if (i == 0 || j == 0 || (i + 1) >= h / (3 * cw) || (j + 1) >= w / (3 * cw) || (i % 2 == 0 && j % 2 == 0))
//                    sang.push({x: i * 3 * cw, y: j * 3 * cw});
//            }
//        }
//        //Lets move the snake now using a timer which will trigger the paint function
//        //every 60ms
//        if (typeof game_loop != "undefined") clearInterval(game_loop);
//        game_loop = setInterval(paint, 60);
//    }
//
//    init();
//
//    function create_snake() {
//        var length = 5; //Length of the snake
//        snake_array = []; //Empty array to start with
//        for (var i = length - 1; i >= 0; i--) {
//            //This will create a horizontal snake starting from the top left
//            snake_array.push({x: i, y: 0});
//        }
//    }
//
//    //Lets create the food now
//    function create_food() {
//        food = {
//            x: Math.round(Math.random() * (w - cw) / cw),
//            y: Math.round(Math.random() * (h - cw) / cw),
//        };
//        //This will create a cell with x/y between 0-44
//        //Because there are 45(450/10) positions accross the rows and columns
//    }
//
//    //Lets paint the snake now
//    function paint() {
//        //To avoid the snake trail we need to paint the BG on every frame
//        //Lets paint the canvas now
//        ctx.fillStyle = "white";
//        ctx.fillRect(0, 0, w, h);
//        ctx.strokeStyle = "black";
//        ctx.strokeRect(0, 0, w, h);
//        for (var i = 0; i < sang.length; i++) {
//            ctx.fillStyle = "green";
//            ctx.fillRect(sang[i].x, sang[i].y, 3 * cw, 3 * cw);
//            ctx.strokeStyle = "white";
//            ctx.strokeRect(sang[i].x, sang[i].y, 3 * cw, 3 * cw);
//        }
//
//        //The movement code for the snake to come here.
//        //The logic is simple
//        //Pop out the tail cell and place it infront of the head cell
//        var nx = snake_array[0].x;
//        var ny = snake_array[0].y;
//        //These were the position of the head cell.
//        //We will increment it to get the new head position
//        //Lets add proper direction based movement now
//        if (d == "right") nx++;
//        else if (d == "left") nx--;
//        else if (d == "up") ny--;
//        else if (d == "down") ny++;
//
//        //Lets add the game over clauses now
//        //This will restart the game if the snake hits the wall
//        //Lets add the code for body collision
//        //Now if the head of the snake bumps into its body, the game will restart
//        if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || check_collision(nx, ny, snake_array)) {
//            //restart game
//            init();
//            //Lets organize the code a bit now.
//            return;
//        }
//
//        //Lets write the code to make the snake eat the food
//        //The logic is simple
//        //If the new head position matches with that of the food,
//        //Create a new head instead of moving the tail
//        if (nx == food.x && ny == food.y) {
//            var tail = {x: nx, y: ny};
//            score++;
//            //Create new food
//            create_food();
//        }
//        else {
//            var tail = snake_array.pop(); //pops out the last cell
//            tail.x = nx;
//            tail.y = ny;
//        }
//        //The snake can now eat the food.
//
//        snake_array.unshift(tail); //puts back the tail as the first cell
//
//        for (var i = 0; i < snake_array.length; i++) {
//            var c = snake_array[i];
//            //Lets paint 10px wide cells
//            paint_cell(c.x, c.y);
//        }
//
//        //Lets paint the food
//        paint_cell(food.x, food.y);
//        //Lets paint the score
//        var score_text = "Score: " + score;
//        ctx.fillText(score_text, 5, h - 5);
//    }
//
//    //Lets first create a generic function to paint cells
//    function paint_cell(x, y) {
//        ctx.fillStyle = "blue";
//        ctx.fillRect(x * cw, y * cw, cw, cw);
//        ctx.strokeStyle = "white";
//        ctx.strokeRect(x * cw, y * cw, cw, cw);
//    }
//
//    function check_collision(x, y, array) {
//        //This function will check if the provided x/y coordinates exist
//        //in an array of cells or not
//        for (var i = 0; i < array.length; i++) {
//            if (array[i].x == x && array[i].y == y)
//                return true;
//        }
//        return false;
//    }
//
//    //Lets add the keyboard controls now
//    $(document).keydown(function (e) {
//        var key = e.which;
//        //We will add another clause to prevent reverse gear
//        if (key == "37" && d != "right") d = "left";
//        else if (key == "38" && d != "down") d = "up";
//        else if (key == "39" && d != "left") d = "right";
//        else if (key == "40" && d != "up") d = "down";
//        //The snake is now keyboard controllable
//    })
//})
//*****************************
//$(document).ready(function () {
//    //Canvas stuff
//    var canvas = $("#canvas")[0];
//    var ctx = canvas.getContext("2d");
//    var w = $("#canvas").width();
//    var h = $("#canvas").height();
//
//    //Lets save the cell width in a variable for easy control
//    var cw = 30;
//    var d;
//    var bomberman;
//    var b;
//    var score;
//    var zombies;
//    var zombies_num = 2;
//    var tem = 1;
//    //Lets create the snake now
//    var snake_array; //an array of cells to make up the snake
//    var sang;
//    var map;
//    var timer;
//    var bombs;
//    var itemr;
//
//    function init() {
//        d = ""; //default direction
//        b = false;
//        score = 0;
//        zombies = [];
//        timer = 0;
//        bombs = [];
//        itemr = 2;
//        map = new Array(Math.floor(h / cw));
//        for (var i = 0; i < map.length; i++) {
//            map[i] = new Array(Math.floor(w / cw));
//            for (var j = 0; j < map.length; j++) {
//                map[i][j] = "grass";
//            }
//        }
//        for (var i = 0; i < map.length; i++) {
//            for (var j = 0; j < map[i].length; j++) {
//                if (i == 0 || j == 0 || i + 1 >= map.length || j + 1 >= map[i].length || (i % 2 == 0 && j % 2 == 0)) {
//                    map[i][j] = "block";
//                }
//            }
//        }
//        for (var i = 0; i < zombies_num; i++) {
//            while (true) {
//                temp1 = Math.floor(Math.random() * map.length);
//                temp2 = Math.floor(Math.random() * map[temp1].length);
//                if (map[temp1][temp2] != "block") {
//                    var temp_add_zombies_con = true;
//                    for (var j = 0; j < zombies.length; j++) {
//                        if (zombies[j].px == temp1 * 3 && zombies[j].py == temp2 * 3)
//                            temp_add_zombies_con = false;
//                    }
//                    if (temp_add_zombies_con) {
//                        zombies.push({x: temp1 * cw, y: temp2 * cw, dir: "right", px: temp1 * 3, py: temp2 * 3});
//                        break;
//                    }
//                }
//
//            }
//        }
//        while (true) {
//            temp1 = Math.floor(Math.random() * map.length);
//            temp2 = Math.floor(Math.random() * map[temp1].length);
//            if (map[temp1][temp2] != "block") {
//                var temp_add_bomberman_con = true;
//                for (var j = 0; j < zombies.length; j++) {
//                    if (zombies[j].px == temp1 * 3 && zombies[j].py == temp2 * 3)
//                        temp_add_zombies_con = false;
//                }
//                if (temp_add_zombies_con) {
//                    bomberman = {x: temp1 * cw, y: temp2 * cw, dir: "null", px: temp1 * 3, py: temp2 * 3};
//                    break;
//                }
//            }
//        }
//        //every 60ms
//        if (typeof game_loop != "undefined") clearInterval(game_loop);
//        game_loop = setInterval(paint, 30);
//    }
//
//    init();
//    //Lets paint the snake now
//    function paint_map() {
//        ctx.fillStyle = "green";
//        ctx.fillRect(0, 0, w, h);
//        ctx.strokeStyle = "black";
//        ctx.strokeRect(0, 0, w, h);
//
//        for (var i = 0; i < map.length; i++) {
//            for (var j = 0; j < map[i].length; j++) {
//                if (map[i][j] == "block") {
//                    ctx.fillStyle = "gray";
//                    ctx.fillRect(i * cw, j * cw, cw, cw);
//                    ctx.strokeStyle = "black";
//                    ctx.strokeRect(i * cw, j * cw, cw, cw);
//                }
//            }
//
//        }
//    }
//
//    function paint_zombies(x, y) {
//        ctx.fillStyle = "red";
//        ctx.fillRect(x, y, Math.floor(cw / 3), Math.floor(cw / 3));
//        ctx.strokeStyle = "white";
//        ctx.strokeRect(x, y, Math.floor(cw / 3), Math.floor(cw / 3));
//
//        ctx.fillStyle = "red";
//        ctx.fillRect(x + 2 * Math.floor(cw / 3), y, Math.floor(cw / 3), Math.floor(cw / 3));
//        ctx.strokeStyle = "white";
//        ctx.strokeRect(x + 2 * Math.floor(cw / 3), y, Math.floor(cw / 3), Math.floor(cw / 3));
//
//        ctx.fillStyle = "red";
//        ctx.fillRect(x + 2 * Math.floor(cw / 3), y + 2 * Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//        ctx.strokeStyle = "white";
//        ctx.strokeRect(x + 2 * Math.floor(cw / 3), y + 2 * Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//
//        ctx.fillStyle = "red";
//        ctx.fillRect(x, y + 2 * Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//        ctx.strokeStyle = "white";
//        ctx.strokeRect(x, y + 2 * Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//
//        ctx.fillStyle = "red";
//        ctx.fillRect(x + Math.floor(cw / 3), y + Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//        ctx.strokeStyle = "white";
//        ctx.strokeRect(x + Math.floor(cw / 3), y + Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//    }
//
//    function paint_bomberman(x, y) {
//        ctx.fillStyle = "blue";
//        ctx.fillRect(x, y, Math.floor(cw / 3), Math.floor(cw / 3));
//        ctx.strokeStyle = "white";
//        ctx.strokeRect(x, y, Math.floor(cw / 3), Math.floor(cw / 3));
//
//        ctx.fillStyle = "green";
//        ctx.fillRect(x + 2 * Math.floor(cw / 3), y, Math.floor(cw / 3), Math.floor(cw / 3));
//        ctx.strokeStyle = "white";
//        ctx.strokeRect(x + 2 * Math.floor(cw / 3), y, Math.floor(cw / 3), Math.floor(cw / 3));
//
//        ctx.fillStyle = "blue";
//        ctx.fillRect(x + 2 * Math.floor(cw / 3), y + 2 * Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//        ctx.strokeStyle = "white";
//        ctx.strokeRect(x + 2 * Math.floor(cw / 3), y + 2 * Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//
//        ctx.fillStyle = "green";
//        ctx.fillRect(x, y + 2 * Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//        ctx.strokeStyle = "white";
//        ctx.strokeRect(x, y + 2 * Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//
//        ctx.fillStyle = "blue";
//        ctx.fillRect(x + Math.floor(cw / 3), y + Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//        ctx.strokeStyle = "white";
//        ctx.strokeRect(x + Math.floor(cw / 3), y + Math.floor(cw / 3), Math.floor(cw / 3), Math.floor(cw / 3));
//    }
//
//    function paint_bomb(x, y) {
//        ctx.beginPath();
//        ctx.arc(x + Math.floor(cw / 2), y + Math.floor(cw / 2), Math.floor(cw / 2), 0, 2 * Math.PI, false);
//        ctx.fillStyle = 'black';
//        ctx.fill();
//    }
//
//    function paint_exploration(x, y) {
//        ctx.beginPath();
//        ctx.arc(x + Math.floor(cw / 2), y + Math.floor(cw / 2), Math.floor(cw / 2), 0, 2 * Math.PI, false);
//        ctx.fillStyle = 'yellow';
//        ctx.fill();
//        ctx.beginPath();
//        ctx.arc(x + Math.floor(cw / 2), y + Math.floor(cw / 2), Math.floor(cw / 4), 0, 2 * Math.PI, false);
//        ctx.fillStyle = 'orange';
//        ctx.fill();
//    }
//
//    function set_zombies_dir() {
//        for (var i = 0; i < zombies.length; i++) {
//
//            random_dir = Math.floor(Math.random() * 4);
//
//            if (random_dir == 0)
//                zombies[i].dir = "right";
//            else if (random_dir == 1)
//                zombies[i].dir = "left";
//            else if (random_dir == 2)
//                zombies[i].dir = "up";
//            else if (random_dir == 3)
//                zombies[i].dir = "down";
//            var nx = zombies[i].x;
//            var ny = zombies[i].y;
//            if (zombies[i].dir == "right") nx += Math.floor(cw / 3);
//            else if (zombies[i].dir == "left") nx -= Math.floor(cw / 3);
//            else if (zombies[i].dir == "up") ny -= Math.floor(cw / 3);
//            else if (zombies[i].dir == "down") ny += Math.floor(cw / 3);
//            if (map[Math.floor((nx + 1) / cw)][Math.floor((ny + 1) / cw)] != "block") {
//                if (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + 1) / cw)] != "block") {
//                    if (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block") {
//                        if (map[Math.floor((nx + 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block") {
//                            continue;
//                        }
//                    }
//                }
//
//            }
//            i--;
//
//        }
//    }
//
//    function move_bomberman() {
//        var nx = bomberman.x;
//        var ny = bomberman.y;
//        var step;
//        if (timer % 3 != 0)
//            step = Math.floor(cw / 9);
//        else
//            step = Math.floor(cw / 3) - 2 * Math.floor(cw / 9);
//        if (bomberman.dir == "right") nx += step;
//        else if (bomberman.dir == "left") nx -= step;
//        else if (bomberman.dir == "up") ny -= step;
//        else if (bomberman.dir == "down") ny += step;
//        if ((map[Math.floor((nx + 1) / cw)][Math.floor((ny + 1) / cw)] != "block") &&
//            (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + 1) / cw)] != "block") &&
//            (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block") &&
//            (map[Math.floor((nx + 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block")) {
//
//            bomberman.x = nx;
//            bomberman.y = ny;
//            bomberman.px = Math.floor((nx * 3) / cw);
//            bomberman.py = Math.floor((ny * 3) / cw);
//        }
//        paint_bomberman(bomberman.x, bomberman.y);
//
//    }
//
//    function move_zombieses() {
//        for (var i = 0; i < zombies.length; i++) {
//            var nx = zombies[i].x;
//            var ny = zombies[i].y;
//            var step;
//            if (timer % 3 != 0)
//                step = Math.floor(cw / 9);
//            else
//                step = Math.floor(cw / 3) - 2 * Math.floor(cw / 9);
//            if (zombies[i].dir == "right") nx += step;
//            else if (zombies[i].dir == "left") nx -= step;
//            else if (zombies[i].dir == "up") ny -= step;
//            else if (zombies[i].dir == "down") ny += step;
//            if ((map[Math.floor((nx + 1) / cw)][Math.floor((ny + 1) / cw)] != "block") &&
//                (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + 1) / cw)] != "block") &&
//                (map[Math.floor((nx + cw - 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block") &&
//                (map[Math.floor((nx + 1) / cw)][Math.floor((ny + cw - 1) / cw)] != "block")) {
//                var breakcon = false;
//                for (var j = 0; j < zombies.length; j++) {
//                    if (j != i && ((Math.floor((nx * 3) / cw) <= zombies[j].px + 3 && Math.floor((nx * 3) / cw) >= zombies[j].px - 3) &&
//                        (Math.floor((ny * 3) / cw) <= zombies[j].py + 3 && Math.floor((ny * 3) / cw) >= zombies[j].py - 3))) {
//                        breakcon = true;
//                    }
//                }
//                if (j != i && ((Math.floor((nx * 3) / cw) <= bomberman.px + 3 && Math.floor((nx * 3) / cw) >= bomberman.px - 3) &&
//                    (Math.floor((ny * 3) / cw) <= bomberman.py + 3 && Math.floor((ny * 3) / cw) >= bomberman.py - 3))) {
//                    console.log("game over");
//                    init();
//                    return;
//                }
//                if (!breakcon) {
//                    zombies[i].x = nx;
//                    zombies[i].y = ny;
//                    zombies[i].px = Math.floor((nx * 3) / cw);
//                    zombies[i].py = Math.floor((ny * 3) / cw);
//                }
//
//            }
//            paint_zombies(zombies[i].x, zombies[i].y);
//
//        }
//
//    }
//
//    function check_bombs() {
//        for (var i = 0; i < bombs.length; i++) {
//            if (bombs[i].time > timer - 200) {
//                paint_bomb(bombs[i].x, bombs[i].y);
//            }
//            else if (bombs[i].time < timer - 200 && bombs[i].time > timer - 230) {
//                for (var j = 0; j <= bombs[i].r; j++) {
//                    if (map[Math.floor(bombs[i].x / cw) + j][Math.floor(bombs[i].y / cw)] == "block") {
//                        break;
//                    }
//                    paint_exploration(bombs[i].x + j * cw, bombs[i].y);
//                    for (var k = 0; k < zombies.length; k++) {
//                        if (3 * (Math.floor(bombs[i].x / cw) + j) == zombies[k].px && 3 * (Math.floor(bombs[i].y / cw)) == zombies[k].py) {
//                            zombies.splice(k, 1);
//                        }
//                    }
//                    if (3 * (Math.floor(bombs[i].x / cw) + j) == bomberman.px && 3 * (Math.floor(bombs[i].y / cw)) == bomberman.py) {
//                        console.log("game over");
//                        init();
//                        return;
//                    }
//                }
//                for (var j = 1; j <= bombs[i].r; j++) {
//                    if (map[Math.floor(bombs[i].x / cw) - j][Math.floor(bombs[i].y / cw)] == "block") {
//                        break;
//                    }
//                    paint_exploration(bombs[i].x - j * cw, bombs[i].y);
//                    for (var k = 0; k < zombies.length; k++) {
//                        if (3 * (Math.floor(bombs[i].x / cw) - j) == zombies[k].px && 3 * (Math.floor(bombs[i].y / cw)) == zombies[k].py) {
//                            zombies.splice(k, 1);
//                        }
//                    }
//                    if (3 * (Math.floor(bombs[i].x / cw) - j) == bomberman.px && 3 * (Math.floor(bombs[i].y / cw)) == bomberman.py) {
//                        console.log("game over");
//                        init();
//                        return;
//                    }
//
//
//                }
//                for (var j = 1; j <= bombs[i].r; j++) {
//                    if (map[Math.floor(bombs[i].x / cw)][Math.floor(bombs[i].y / cw) + j] == "block") {
//                        break;
//                    }
//                    paint_exploration(bombs[i].x, bombs[i].y + j * cw);
//                    for (var k = 0; k < zombies.length; k++) {
//                        if (3 * (Math.floor(bombs[i].x / cw)) == zombies[k].px && 3 * (Math.floor(bombs[i].y / cw) + j) == zombies[k].py) {
//                            zombies.splice(k, 1);
//                        }
//                    }
//                    if (3 * (Math.floor(bombs[i].x / cw) ) == bomberman.px && 3 * (Math.floor(bombs[i].y / cw) + j) == bomberman.py) {
//                        console.log("game over");
//                        init();
//                        return;
//                    }
//
//
//                }
//                for (var j = 1; j <= bombs[i].r; j++) {
//                    if (map[Math.floor(bombs[i].x / cw)][Math.floor(bombs[i].y / cw) - j] == "block") {
//                        break;
//                    }
//                    paint_exploration(bombs[i].x, bombs[i].y - j * cw);
//                    for (var k = 0; k < zombies.length; k++) {
//                        if (3 * (Math.floor(bombs[i].x / cw)) == zombies[k].px && 3 * (Math.floor(bombs[i].y / cw) - j) == zombies[k].py) {
//                            zombies.splice(k, 1);
//                        }
//                    }
//
//                    if (3 * (Math.floor(bombs[i].x / cw) ) == bomberman.px && 3 * (Math.floor(bombs[i].y / cw) - j) == bomberman.py) {
//                        console.log("game over");
//                        init();
//                        return;
//                    }
//
//                }
//
//
//            }
//
//        }
//    }
//
//    function paint() {
//        //To avoid the snake trail we need to paint the BG on every frame
//        //Lets paint the canvas now
//        paint_map();
//        if (timer % 3 == 0) {
//            bomberman.dir = d;
//            d = "";
//        }
//        if (b) {
//            b = false;
//            bombs.push({
//                x: Math.round(bomberman.px / 3) * cw,
//                y: Math.round(bomberman.py / 3) * cw,
//                time: timer,
//                r: itemr
//            });
//        }
//        check_bombs();
//        if (timer % 9 == 0) {
//            set_zombies_dir();
//        }
//
//        //
//        move_bomberman();
//        //
//        move_zombieses();
//        timer++;
//    }
//
//
//    $(document).keydown(function (e) {
//        var key = e.which;
//        console.log("e.which : " + key);
//        //We will add another clause to prevent reverse gear
//        if (key == "37") d = "left";
//        else if (key == "38") d = "up";
//        else if (key == "39") d = "right";
//        else if (key == "40") d = "down";
//        else if (key == "32") b = true;
//        else d = "";
//        //The snake is now keyboard controllable
//    })
//})

/**
 * Created by ����� on 04/03/2016.
 */
$(document).ready(function () {
    //Canvas stuff
    var $canvas = $("#canvas");
    var canvas = $canvas[0];
    var ctx = canvas.getContext("2d");
    var w = $canvas.width();
    var h = $canvas.height();

    //Lets save the cell width in a variable for easy control
    var cw = 30;
    var d;
    var bomberman;
    var b;
    var score;
    var zombies;
    var zombies_num = 2;

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
        var game_loop;
        if (typeof game_loop != "undefined")
            clearInterval(game_loop);
        setInterval(paint, 30);
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
                    bomberman = {
                        x: temp1 * cw,
                        y: temp2 * cw,
                        dir: "null",
                        px: temp1 * 3,
                        py: temp2 * 3
                    };
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
        var bomb_num = 0;
        var explosion_num = 0;
        for (var i = 0; i < bombs.length; i++) {
            if (bombs[i].mode == "pre_explosion") {
                bomb_num++;
            } else {
                explosion_num += bombs[i].explosions.length;
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

    function move_zombies() {
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
                bombs[i].mode = "pre_explosion";
            }
            else if (bombs[i].time < timer - 200 && bombs[i].time > timer - 230) {
                bombs[i].mode = "post_explosion";
                for (var j = 0; j <= bombs[i].r; j++) {
                    if (map[Math.floor(bombs[i].x / cw) + j][Math.floor(bombs[i].y / cw)] == "block") {
                        break;
                    }
                    bombs[i].explosions.push({
                        x: bombs[i].x + j * cw,
                        y: bombs[i].y,
                        t: timer - bombs[i].time
                    });
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
                    bombs[i].explosions.push({
                        x: bombs[i].x - j * cw,
                        y: bombs[i].y,
                        t: timer - bombs[i].time
                    });
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
                    bombs[i].explosions.push({
                        x: bombs[i].x,
                        y: bombs[i].y + j * cw,
                        t: timer - bombs[i].time
                    });
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
                    bombs[i].explosions.push({
                        x: bombs[i].x,
                        y: bombs[i].y - j * cw,
                        t: timer - bombs[i].time
                    });

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
                mode: "pre_explosion"
            });
        }
        check_bombs();
        if (timer % 9 == 0) {
            set_zombies_dir();
        }

        //
        move_bomberman();
        //
        move_zombies();
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
    })
})

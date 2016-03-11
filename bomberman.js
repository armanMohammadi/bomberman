/**
 * Created by ����� on 04/03/2016.
 */
run_game = function () {
    //Game variables
    var game_ground = $('.game');
    var each_cell_length = 30;
    var width = $('input[name=game-width]').val();
    var height = $('input[name=game-height]').val();
    var zombies_num = $('input[name=game-zombies]').val();
    var w = width * each_cell_length;
    var h = height * each_cell_length;

    //Lets save the cell width in a variable for easy control
    var d;
    var bomberman;
    var b;
    var score;
    var zombies;

    //Lets create the snake now
    var grasses; //an array of cells to make up the snake
    var blocks;
    var map;
    var timer;
    var bombs;

    var item_range;
    var item_teleport;
    var range;
    var boxes;

    function init() {
        d = ""; //default direction
        b = false;
        score = 0;
        zombies = [];
        blocks = [];
        grasses = [];
        timer = 0;
        bombs = [];
        range = 2;
        item_range = {x: each_cell_length, y: each_cell_length};
        item_teleport = {x: 3 * each_cell_length, y: each_cell_length};
        boxes = [];
        make_map();
        make_zombies();
        make_bomberman();

        ////every 60msw
        var game_loop;
        if (typeof game_loop != "undefined")
            clearInterval(game_loop);
        setInterval(paint, 30);
    }

    init();
    //Lets paint the snake now
    function make_map() {
        var i, j;
        map = new Array(Math.floor(h / each_cell_length));
        for (i = 0; i < map.length; i++)
            map[i] = new Array(Math.floor(w / each_cell_length));

        map[Math.floor(item_range.x / each_cell_length)][Math.floor(item_range.y / each_cell_length)] = "box";
        boxes.push({x: item_range.x, y: item_range.y})
        map[Math.floor(item_teleport.x / each_cell_length)][Math.floor(item_teleport.y / each_cell_length)] = "box";
        boxes.push({x: item_teleport.x, y: item_teleport.y})
        var item_block = $('.item-range-block');
        game_ground.append(item_block);
        item_block.css('position', 'absolute');
        item_block.css('visibility', 'visible');
        item_block.css('left', item_range.x + 'px');
        item_block.css('top', item_range.y + 'px');
        item_block = $('.item-teleport-block');
        game_ground.append(item_block);
        item_block.css('position', 'absolute');
        item_block.css('visibility', 'visible');
        item_block.css('left', item_teleport.x + 'px');
        item_block.css('top', item_teleport.y + 'px');
        for (i = 0; i < map.length; i++) {
            for (j = 0; j < map[i].length; j++) {
                if (map[i][j] != "box") {
                    if (i == 0 || j == 0 || i + 1 >= map.length || j + 1 >= map[i].length || (i % 2 == 0 && j % 2 == 0)) {
                        map[i][j] = "block";
                        blocks.push({
                            x: i * each_cell_length,
                            y: j * each_cell_length,
                            id: i + "," + j
                        });
                    } else {
                        if (Math.random() > 0.10) {
                            map[i][j] = "grass";
                            grasses.push({x: i * each_cell_length, y: j * each_cell_length})
                        } else {
                            map[i][j] = "box";
                            boxes.push({x: i * each_cell_length, y: j * each_cell_length})
                        }
                    }
                }
            }
        }


        var wall = $('.wall-block');
        for (i = 0; i < blocks.length; i++) {
            game_ground.append(wall.clone());
        }
        var counter = 0;
        $('#main-background').children('.wall-block').each(function () {
            $(this).css('position', 'absolute');
            $(this).css('left', blocks[counter].x + 'px');
            $(this).css('top', blocks[counter].y + 'px');
            $(this).css('id', blocks[counter].id);
            counter++;
        });
        var box = $('.box-block');
        for (i = 0; i < boxes.length; i++) {
            game_ground.append(box.clone());
        }
        counter = 0;
        $('#main-background').children('.box-block').each(function () {
            $(this).css('position', 'absolute');
            $(this).css('visibility', 'visible');
            $(this).css('left', boxes[counter].x + 'px');
            $(this).css('top', boxes[counter].y + 'px');
            $(this).css('id', boxes[counter].id);
            counter++;
        });
    }

    function make_zombies() {
        var i;
        for (i = 0; i < zombies_num; i++) {
            while (true) {
                var temp1 = Math.floor(Math.random() * map.length);
                var temp2 = Math.floor(Math.random() * map[temp1].length);
                if (map[temp1][temp2] == "grass") {
                    var temp_add_zombies_con = true;
                    for (var j = 0; j < zombies.length; j++) {
                        if (zombies[j].px == temp1 * 3 && zombies[j].py == temp2 * 3)
                            temp_add_zombies_con = false;
                    }
                    if (temp_add_zombies_con) {
                        zombies.push({
                            x: temp1 * each_cell_length,
                            y: temp2 * each_cell_length,
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
        for (i = 0; i < zombies.length; i++)
            game_ground.append(zombie.clone());
        var counter = 0;
        $('#main-background').children('.zombie-block').each(function () {
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
            var temp1 = Math.floor(Math.random() * map.length);
            var temp2 = Math.floor(Math.random() * map[temp1].length);
            if (map[temp1][temp2] == "grass") {
                var temp_add_bomberman_con = true;
                for (var j = 0; j < zombies.length; j++) {
                    if (zombies[j].px == temp1 * 3 && zombies[j].py == temp2 * 3)
                        temp_add_bomberman_con = false;
                }
                if (temp_add_bomberman_con) {
                    bomberman = {
                        x: temp1 * each_cell_length,
                        y: temp2 * each_cell_length,
                        dir: "null",
                        px: temp1 * 3,
                        py: temp2 * 3
                    };
                    break;
                }
            }
        }
        var bomberman_block = $('.bomberman-block');
        game_ground.append(bomberman_block);
        bomberman_block.css('position', 'absolute');
        bomberman_block.css('visibility', 'visible');
        bomberman_block.css('left', bomberman.x + 'px');
        bomberman_block.css('top', bomberman.y + 'px');
    }

    function paint_zombies() {
        var counter = 0;
        $('#main-background').children('.zombie-block').each(function () {
                //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
                if (counter < zombies.length) {

                    $(this).css('position', 'absolute');
                    $(this).css('left', zombies[counter].x + 'px');
                    $(this).css('top', zombies[counter].y + 'px');
                }
                else if (counter == zombies.length) {
                    $(this).css('visibility', 'hidden');
                }
                else {
                    $(this).remove();
                }
                counter++;

            }
        )
        ;

    }

    function paint_bomberman() {
        var bomberman_block = $('.bomberman-block');
        bomberman_block.css('left', bomberman.x + 'px');
        bomberman_block.css('top', bomberman.y + 'px');
    }

    function paint_bombs() {
        var explosion_num = 0;
        for (var i = 0; i < bombs.length; i++) {
            if (bombs[i].mode == "pre_explosion") {
                if (!bombs[i].visibility) {
                    game_ground.append($('.bomb-block').clone());
                    bombs[i].visibility = true;
                }
            } else {
                explosion_num += bombs[i].explosions.length;
                for (var j = 0; j < bombs[i].explosions.length; j++) {
                    game_ground.append($('.explosion-block').clone());
                }
            }
        }
        //console.log("explosion_num  "+explosion_num);
        var counter = 0;
        $('#main-background').children('.bomb-block').each(function () {
            //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
            if (counter < bombs.length) {
                $(this).css('position', 'absolute');
                $(this).css('visibility', 'visible');
                $(this).css('left', bombs[counter].x + 'px');
                $(this).css('top', bombs[counter].y + 'px');
            } else {
                $(this).remove();
            }
            counter++;
        });
        var all_counter = 0;
        counter = 0;
        var bomb_counter = 0;
        $('#main-background').children('.explosion-block').each(function (i) {

                if (all_counter < explosion_num) {
                    $(this).css('position', 'absolute');
                    $(this).css('visibility', 'visible');
                    console.log("&&&&  bomb_counter" + bomb_counter + "   bombs[bomb_counter] " + bombs[bomb_counter] + "   counter " + counter + "  explosion_num" + explosion_num);
                    $(this).css('left', bombs[bomb_counter].explosions[counter].x + 'px');
                    $(this).css('top', bombs[bomb_counter].explosions[counter].y + 'px');
                    counter++;
                    if (counter == bombs[bomb_counter].explosions.length) {
                        bomb_counter++;
                        counter = 0;
                    }
                } else {
                    $(this).remove();
                }
                all_counter++;

            }
        )
        ;

    }

    function set_zombies_dir() {
        for (var i = 0; i < zombies.length; i++) {
            var random_dir = Math.floor(Math.random() * 4);
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
            if (zombies[i].dir == "right") nx += Math.floor(each_cell_length / 3);
            else if (zombies[i].dir == "left") nx -= Math.floor(each_cell_length / 3);
            else if (zombies[i].dir == "up") ny -= Math.floor(each_cell_length / 3);
            else if (zombies[i].dir == "down") ny += Math.floor(each_cell_length / 3);
            if (map[Math.floor((nx + 1) / each_cell_length)][Math.floor((ny + 1) / each_cell_length)] == "grass") {
                if (map[Math.floor((nx + each_cell_length - 1) / each_cell_length)][Math.floor((ny + 1) / each_cell_length)] == "grass") {
                    if (map[Math.floor((nx + each_cell_length - 1) / each_cell_length)][Math.floor((ny + each_cell_length - 1) / each_cell_length)] == "grass") {
                        if (map[Math.floor((nx + 1) / each_cell_length)][Math.floor((ny + each_cell_length - 1) / each_cell_length)] == "grass") {
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
            step = Math.floor(each_cell_length / 9);
        else
            step = Math.floor(each_cell_length / 3) - 2 * Math.floor(each_cell_length / 9);
        if (bomberman.dir == "right") nx += step;
        else if (bomberman.dir == "left") nx -= step;
        else if (bomberman.dir == "up") ny -= step;
        else if (bomberman.dir == "down") ny += step;
        if ((map[Math.floor((nx + 1) / each_cell_length)][Math.floor((ny + 1) / each_cell_length)] == "grass") &&
            (map[Math.floor((nx + each_cell_length - 1) / each_cell_length)][Math.floor((ny + 1) / each_cell_length)] == "grass") &&
            (map[Math.floor((nx + each_cell_length - 1) / each_cell_length)][Math.floor((ny + each_cell_length - 1) / each_cell_length)] == "grass") &&
            (map[Math.floor((nx + 1) / each_cell_length)][Math.floor((ny + each_cell_length - 1) / each_cell_length)] == "grass")) {

            bomberman.x = nx;
            bomberman.y = ny;
            bomberman.px = Math.floor((nx * 3) / each_cell_length);
            bomberman.py = Math.floor((ny * 3) / each_cell_length);
        }
        paint_bomberman();

    }

    function move_zombies() {
        for (var i = 0; i < zombies.length; i++) {
            var nx = zombies[i].x;
            var ny = zombies[i].y;
            var step;
            if (timer % 3 != 0)
                step = Math.floor(each_cell_length / 9);
            else
                step = Math.floor(each_cell_length / 3) - 2 * Math.floor(each_cell_length / 9);
            if (zombies[i].dir == "right") nx += step;
            else if (zombies[i].dir == "left") nx -= step;
            else if (zombies[i].dir == "up") ny -= step;
            else if (zombies[i].dir == "down") ny += step;
            if ((map[Math.floor((nx + 1) / each_cell_length)][Math.floor((ny + 1) / each_cell_length)] == "grass") &&
                (map[Math.floor((nx + each_cell_length - 1) / each_cell_length)][Math.floor((ny + 1) / each_cell_length)] == "grass") &&
                (map[Math.floor((nx + each_cell_length - 1) / each_cell_length)][Math.floor((ny + each_cell_length - 1) / each_cell_length)] == "grass") &&
                (map[Math.floor((nx + 1) / each_cell_length)][Math.floor((ny + each_cell_length - 1) / each_cell_length)] == "grass")) {
                var breakcon = false;
                for (var j = 0; j < zombies.length; j++) {
                    if (j != i && ((Math.floor((nx * 3) / each_cell_length) <= zombies[j].px + 3 && Math.floor((nx * 3) / each_cell_length) >= zombies[j].px - 3) &&
                        (Math.floor((ny * 3) / each_cell_length) <= zombies[j].py + 3 && Math.floor((ny * 3) / each_cell_length) >= zombies[j].py - 3))) {
                        breakcon = true;
                    }
                }
                if (j != i && ((Math.floor((nx * 3) / each_cell_length) <= bomberman.px + 3 && Math.floor((nx * 3) / each_cell_length) >= bomberman.px - 3) &&
                    (Math.floor((ny * 3) / each_cell_length) <= bomberman.py + 3 && Math.floor((ny * 3) / each_cell_length) >= bomberman.py - 3))) {
                    console.log("game over");
                    // init();
                    return;
                }
                if (!breakcon) {
                    zombies[i].x = nx;
                    zombies[i].y = ny;
                    zombies[i].px = Math.floor((nx * 3) / each_cell_length);
                    zombies[i].py = Math.floor((ny * 3) / each_cell_length);
                }
            }
        }
        paint_zombies();
    }

    function check_bombs() {
        var i, j, k, counter;
        for (i = 0; i < bombs.length; i++) {
            if (bombs[i].time > timer - 200) {
                bombs[i].mode = "pre_explosion";
            }
            else if (bombs[i].time <= timer - 200 && bombs[i].time > timer - 230) {
                bombs[i].mode = "post_explosion";
                console.log("timer *** " + timer);
                if (!bombs[i].exp) {
                    bombs[i].exp = true;

                    for (j = 0; j <= bombs[i].r; j++) {
                        if (map[Math.floor(bombs[i].x / each_cell_length) + j][Math.floor(bombs[i].y / each_cell_length)] == "block") {
                            break;
                        }
                        bombs[i].explosions.push({
                            x: bombs[i].x + j * each_cell_length,
                            y: bombs[i].y,
                            t: timer - bombs[i].time
                        });
                        for (k = 0; k < zombies.length; k++) {
                            if (3 * (Math.floor(bombs[i].x / each_cell_length) + j) == zombies[k].px && 3 * (Math.floor(bombs[i].y / each_cell_length)) == zombies[k].py) {
                                zombies.splice(k, 1);
                            }
                        }
                        $('#main-background').children('.box-block').each(function () {
                            //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
                            if ((bombs[i].x + j * each_cell_length == parseInt($(this).css('left').replace('px', ''))) && (bombs[i].y == parseInt($(this).css('top').replace('px', '')))) {
                                map[(Math.floor(bombs[i].x / each_cell_length) + j)][(Math.floor(bombs[i].y / each_cell_length))] = "grass";
                                $(this).remove();
                            }
                        });
                        if (3 * (Math.floor(bombs[i].x / each_cell_length) + j) == bomberman.px && 3 * (Math.floor(bombs[i].y / each_cell_length)) == bomberman.py) {
                            console.log("game over");
                            return;
                        }
                    }
                    for (j = 1; j <= bombs[i].r; j++) {
                        if (map[Math.floor(bombs[i].x / each_cell_length) - j][Math.floor(bombs[i].y / each_cell_length)] == "block") {
                            break;
                        }
                        bombs[i].explosions.push({
                            x: bombs[i].x - j * each_cell_length,
                            y: bombs[i].y,
                            t: timer - bombs[i].time
                        });
                        for (k = 0; k < zombies.length; k++) {
                            if (3 * (Math.floor(bombs[i].x / each_cell_length) - j) == zombies[k].px && 3 * (Math.floor(bombs[i].y / each_cell_length)) == zombies[k].py) {
                                zombies.splice(k, 1);
                            }
                        }
                        $('#main-background').children('.box-block').each(function () {
                            //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
                            if ((bombs[i].x - j * each_cell_length == parseInt($(this).css('left').replace('px', ''))) && (bombs[i].y == parseInt($(this).css('top').replace('px', '')))) {
                                map[(Math.floor(bombs[i].x / each_cell_length) - j)][(Math.floor(bombs[i].y / each_cell_length))] = "grass";
                                $(this).remove();
                            }
                        });
                        if (3 * (Math.floor(bombs[i].x / each_cell_length) - j) == bomberman.px && 3 * (Math.floor(bombs[i].y / each_cell_length)) == bomberman.py) {
                            console.log("game over");
                            return;
                        }
                    }
                    for (j = 1; j <= bombs[i].r; j++) {
                        if (map[Math.floor(bombs[i].x / each_cell_length)][Math.floor(bombs[i].y / each_cell_length) + j] == "block") {
                            break;
                        }
                        bombs[i].explosions.push({
                            x: bombs[i].x,
                            y: bombs[i].y + j * each_cell_length,
                            t: timer - bombs[i].time
                        });
                        for (k = 0; k < zombies.length; k++) {
                            if (3 * (Math.floor(bombs[i].x / each_cell_length)) == zombies[k].px && 3 * (Math.floor(bombs[i].y / each_cell_length) + j) == zombies[k].py) {
                                zombies.splice(k, 1);
                            }
                        }
                        $('#main-background').children('.box-block').each(function () {
                            //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
                            if ((bombs[i].x == parseInt($(this).css('left').replace('px', '')) ) && (bombs[i].y + j * each_cell_length == parseInt($(this).css('top').replace('px', '')))) {
                                map[(Math.floor(bombs[i].x / each_cell_length))][(Math.floor(bombs[i].y / each_cell_length) + j)] = "grass";
                                $(this).remove();
                            }
                        });

                        if (3 * (Math.floor(bombs[i].x / each_cell_length) ) == bomberman.px && 3 * (Math.floor(bombs[i].y / each_cell_length) + j) == bomberman.py) {
                            console.log("game over");
                            return;
                        }
                    }

                    for (j = 1; j <= bombs[i].r; j++) {
                        if (map[Math.floor(bombs[i].x / each_cell_length)][Math.floor(bombs[i].y / each_cell_length) - j] == "block") {
                            break;
                        }
                        bombs[i].explosions.push({
                            x: bombs[i].x,
                            y: bombs[i].y - j * each_cell_length,
                            t: timer - bombs[i].time
                        });

                        for (k = 0; k < zombies.length; k++) {
                            if (3 * (Math.floor(bombs[i].x / each_cell_length)) == zombies[k].px && 3 * (Math.floor(bombs[i].y / each_cell_length) - j) == zombies[k].py) {
                                zombies.splice(k, 1);
                            }
                        }

                        $('#main-background').children('.box-block').each(function () {
                            //  console.log(blocks[counter]+"  "+counter+"  "+blocks.length);
                            if ((bombs[i].x == parseInt($(this).css('left').replace('px', ''))) && (bombs[i].y - j * each_cell_length == parseInt($(this).css('top').replace('px', '')))) {
                                map[(Math.floor(bombs[i].x / each_cell_length))][(Math.floor(bombs[i].y / each_cell_length) - j)] = "grass";
                                $(this).remove();
                            }
                        });

                        if (3 * (Math.floor(bombs[i].x / each_cell_length) ) == bomberman.px && 3 * (Math.floor(bombs[i].y / each_cell_length) - j) == bomberman.py) {
                            console.log("game over");
                            //init();
                            return;
                        }

                    }
                }
                console.log("bombes[" + i + "].explosion.length" + bombs[i].explosions.length);


            }
            else {
                bombs.splice(i, 1);
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
                x: Math.round(bomberman.px / 3) * each_cell_length,
                y: Math.round(bomberman.py / 3) * each_cell_length,
                time: timer,
                r: range,
                explosions: [],
                mode: "pre_explosion",
                visibility: false,
                exp: false
            });
        }
        check_bombs();
        if (timer % 9 == 0) {
            set_zombies_dir();
        }
        move_bomberman();
        move_zombies();
        timer++;
    }


    $(document).keydown(function (e) {
        var key = e.which;
        //console.log("e.which : " + key);
        //We will add another clause to prevent reverse gear
        if (key == "37") d = "left";
        else if (key == "38") d = "up";
        else if (key == "39") d = "right";
        else if (key == "40") d = "down";
        else if (key == "32") b = true;
        else d = "";
    });
}
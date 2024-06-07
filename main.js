kaboom({
    background  : [177,162,202],
    width       : 1792,
    height      : 1024,
    letterbox   : true,
})

setGravity(500);
const W = width();
const H = height();
const INGR_SCALE = 0.2;
const PIE_SCALE = 0.32;
const CLICK_JUMP = 1.05;
let nextIngr = 0;
let score = 0;
let time = 90;

loadRoot('assets/');
loadSprite('empty',"empty.png");
loadSprite('phase_0',"phase_0.png");
loadSprite('phase_1',"phase_1.png");
loadSprite('phase_2',"phase_2.png");
loadSprite('phase_3',"phase_3.png");
loadSprite('phase_4',"phase_4.png");
loadSprite('phase_5',"phase_5.png");
loadSprite('phase_6',"phase_6.png");
loadSprite('x',"x.png");
loadSprite('v',"v.png");
loadSprite('crust',"crust.png");
loadSprite('pastry_cream',"pastry_cream.png");
loadSprite('strawberry',"strawberry.png");
loadSprite('blueberry',"blueberry.png");
loadSprite('whipped_cream',"whipped_cream.png");
loadSprite('mint',"mint.png");
loadSprite('oven_off',"oven_off.png");
loadSprite('oven_on',"oven_on.png");
loadSprite('oven_finished',"oven_finished.png");
loadSprite('main_bg',"main_bg.jpeg");
loadSprite('title_bg',"title_bg.jpeg");

let order = ["crust","pastry_cream","strawberry","blueberry","oven_off","oven_on","oven_finished","whipped_cream","mint"];
let ingr = ["crust","pastry_cream","strawberry","blueberry","whipped_cream","mint"];

scene("startMenu", () => {
    const bg = add([
        sprite("title_bg"),
        anchor("center"),
        pos(W/2, H/2),
        scale(1),
        z(0),
        "bg",
     ]);
     const startButton = add([
        rect(400, 100, { radius: 15 }),
        anchor("center"),
        pos(W/2, H/2 + 50),
        z(1),
        outline(4),
        area(),
        "startButton",
        "button,"
    ])
    const startButtonText = add([
        text("Commencer", {size : 65}),
        color(BLACK),
        anchor("center"),
        pos(startButton.pos),
        z(1),
        outline(4),
        area(),
        "startButton",
        "button,"
    ])
    onClick("startButton", () => {
        go("game");
    });
});

scene("game", () => {
    score = 0;
    const bg = add([
        sprite("main_bg"),
        anchor("center"),
        pos(W/2, H/2),
        scale(1),
        z(0),
        "bg",
     ]);
     // Timer
     const text_time = add([
        text(`Temps restant : ` + fancyTimeFormat(time),{
            width : W,
            size : 60,
        }),
        anchor("left"),
        pos(20,H - 30),
        z(100),
        {
            update(){
                if (time >= 0) {
                    this.text = `Temps restant : ` + fancyTimeFormat(time);
                }else{
                    this.text="";
                }
            }
        },
    ]);
     const scoreTxt = add([
        text(`Score : ${score}`,{size : 80,}),
        color(BLACK),
        anchor("center"),
        pos(W/2, 50),
        z(100),
        {
           update(){
            this.text = `Score : ${score}`;
           }
        },]);
     const nextBox = add([
        rect(500, 250, { radius: 15 }),
        anchor("center"),
        pos(W/2, H/2 - 150),
        z(1),
        outline(4),
    ])
    const nextBoxText = nextBox.add([
        text("Prochain Ingrédient :", {size : 36}),
        color(BLACK),
        anchor("center"),
        pos(0,-60),
        z(1),
        outline(4),
    ])
    const nextBoxIngr = nextBox.add([
        sprite(order[nextIngr]),
        {
            update(){
                this.use(sprite(order[nextIngr]));
            }
        },
        anchor("center"),
        scale(0.17),
        pos(0,35),
        z(1),
    ])
    const oven = add([
        sprite("oven_off"),
        anchor("left"),
        scale(0.6),
        pos(15,H/2),
        z(2),
        area(),
        "oven",
        "oven_off",
        "jumpIngr"
    ])
    const pie = add([
        sprite("empty"),
        anchor("center"),
        scale(PIE_SCALE),
        pos(W/2, H/2 + 270),
        z(2),
    ])
    loop(0.75, () => {
        time--;
        for (let i = 0; i < randi(0,4); i++) {
            let randIngr = choose(ingr)
            const jumpIngr = add([
                pos(rand(W), H-25),
                z(10),
                sprite(randIngr),
                anchor("center"),
                scale(INGR_SCALE),
                area({collisionIgnore:["jumpIngr"],scale:0.75}),
                body(),
                move(choose([LEFT, RIGHT]), rand(30, 150)),
                rotate(rand(0, 360)),
                offscreen({destroy: true}),
                "jumpIngr",
                randIngr,
            ])
            jumpIngr.jump(rand(670, 1050))
        }
        if(time < 1){
            go("gameOver");
        }
    })
    onClick("jumpIngr", (t) => {
        zoomIn();
        if(t.is(order[nextIngr])){
            if(nextIngr == 0){
                pie.use(sprite("phase_0"));
            } else if(nextIngr == 1){
                pie.use(sprite("phase_1"));
            } else if(nextIngr == 2){
                pie.use(sprite("phase_2"));
            } else if(nextIngr == 3){
                pie.use(sprite("phase_3"));
            }else if(nextIngr == 4){
                pie.use(sprite("empty"));
                oven.unuse("oven_off");
                oven.use("oven_on");
                oven.use(sprite("oven_on"));
            } else if(nextIngr == 5){
                pie.use(sprite("empty"));
                oven.unuse("oven_on");
                oven.use("oven_finished");
                oven.use(sprite("oven_finished"));
            } else if(nextIngr == 6){
                pie.use(sprite("phase_4"));
                oven.unuse("oven_finished");
                oven.use("oven_off");
                oven.use(sprite("oven_off"));
            } else if(nextIngr == 7){
                pie.use(sprite("phase_5"));
            } else if(nextIngr == 8){
                pie.use(sprite("phase_6"));
                wait(0.5, () =>{
                    yep();
                    wait(0.5, () =>{
                        pie.use(sprite("empty"));
                    })
                })
                nextIngr = -1;
                score++;
            }
            if (!t.is("oven")) {
                t.destroy();
            }
            nextIngr++;
        } else if(!t.is(order[nextIngr]) && !t.is("oven")){
            nextIngr = 0;
            nope();
            pie.use(sprite("empty"));
        } 
    })
    function nope(){
        const nope = add([
            sprite("x"),
            anchor("center"),
            scale(PIE_SCALE),
            pos(W/2, H/2 + 270),
            z(2),
            lifespan(1, { fade: 0.5 }),
        ])
    }
    function yep(){
        const yep = add([
            sprite("v"),
            anchor("center"),
            scale(PIE_SCALE),
            pos(W/2, H/2 + 270),
            z(2),
            lifespan(1, { fade: 0.5 }),
        ])
    }
})

scene("gameOver", () => {
    const bg = add([
        sprite("main_bg"),
        anchor("center"),
        pos(W/2, H/2),
        scale(1),
        z(0),
        "bg",
     ]);
     const nextBox = add([
        rect(500, 250, { radius: 15 }),
        anchor("center"),
        pos(W/2, H/2 - 150),
        z(1),
        outline(4),
    ])
     const nextBoxText = nextBox.add([
        text("Score :", {size : 36}),
        color(BLACK),
        anchor("center"),
        pos(0,-60),
        z(1),
        outline(4),
    ])
    const nextBoxIngr = nextBox.add([
        text(score, {size : 69}),
        color(BLACK),
        anchor("center"),
        pos(0,35),
        z(1),
    ])
    const pie = add([
        sprite("phase_6"),
        anchor("center"),
        scale(PIE_SCALE),
        pos(W/2, H/2 + 270),
        z(2),
    ])

    const buttonYPos = 50;
    // Replay button
    const replayButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("topright"),
        pos(W / 2 - 10, buttonYPos),
        outline(4),
        area(),
        "replayButton",
        "button",
    ]);

    const replayButtonText = replayButton.add([
        text("Rejouer", {size: 30 }),
        color(BLACK),
        pos(-10,18),
        anchor("topright"),
        area(),
        "replayButton",
        "button",
    ]);
    onClick("replayButton", () => {
        time = 90;
        go("game");
    });
    // Menu button
    const menuButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("topleft"),
        pos(W / 2 + 10, buttonYPos),
        outline(4),
        area(),
        "menuButton",
        "button",
    ]);
    const menuButtonText = menuButton.add([
        text("Menu", {size: 30 }),
        color(BLACK),
        pos(40,18),
        anchor("topleft"),
        area(),
        "menuButton",
        "button",
    ]);

    onClick("menuButton", () => {
        go("startMenu");
    });
})

onClick("button", () => {
    zoomIn();
});
function zoomIn(t){
    if (t != undefined) {
        t.width  = t.width   / CLICK_JUMP;
        t.height = t.height  / CLICK_JUMP;
    }            
    wait(0.1, () => {
        if (t != undefined) {
            t.width  = t.width  * CLICK_JUMP;
            t.height = t.height * CLICK_JUMP;
        }
    })
}
// From https://stackoverflow.com/a/11486026 (answered Jul 14, 2012 at 20:48 by Vishal)
function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
    
    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";
    
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    
    return ret;
    }
function startGame() {
    go("startMenu");
}
startGame();
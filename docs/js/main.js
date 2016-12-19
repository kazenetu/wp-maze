enchant();
var screenWidth = 640;
var screenHeight = 480;
// Start
var game = new enchant.Core(screenWidth, screenHeight);
game.fps = 30;
game.preload(['./assets/resources/goal.png', './assets/resources/number.png', './assets/resources/map.png', './assets/resources/buttons.png', './assets/resources/map1.json']);
// ロード完了イベント
game.onload = function () {
    var GameMode;
    (function (GameMode) {
        GameMode[GameMode["main"] = 0] = "main";
        GameMode[GameMode["goal"] = 1] = "goal";
    })(GameMode || (GameMode = {}));
    ;
    var scale = 2;
    var tipSize = 32;
    var displayW = 10;
    var displayH = 4;
    var manualMainMode = "ゴール(G)まで移動してください　";
    var manualGoalMode = "タップしてください　";
    var gameMode = GameMode.main;
    var mainPanel = new enchant.Group();
    game.currentScene.addChild(mainPanel);
    // CreateStage
    var stage = new enchant.Group();
    mainPanel.addChild(stage);
    var stagebg = new enchant.Sprite(screenWidth, screenHeight);
    stagebg.backgroundColor = "rgb(128,128,128)";
    stage.addChild(stagebg);
    var wpMazeLogo = new enchant.Label("WpMaze");
    wpMazeLogo.font = "32px cursive";
    stage.addChild(wpMazeLogo);
    var manual = new enchant.Label(manualMainMode);
    manual.width = screenWidth;
    manual.font = "32px cursive";
    manual.textAlign = "right";
    manual.y = 16;
    stage.addChild(manual);
    // CreateGroup
    var group = new enchant.Group();
    group.y = 64;
    stage.addChild(group);
    //背景インスタンス作成
    var surface = new enchant.Sprite(displayW * tipSize * scale, displayH * tipSize * scale);
    surface.image = new enchant.Surface(surface.width, surface.height);
    surface.image.context.beginPath();
    surface.image.context.fillStyle = "rgb(157,166,97)";
    surface.image.context.rect(0, 0, surface.width, surface.height);
    surface.image.context.fill();
    group.addChild(surface);
    // ロジック生成
    var logic = new WpMaze.Logic();
    // マップデータ読み込み
    var mapJson = game.assets['./assets/resources/map1.json'];
    if (logic.Load(mapJson) === false) {
    }
    // マップイメージ取得
    var mapImage = game.assets['./assets/resources/map.png'];
    // マップ作成
    var mapSurface = new enchant.Surface(logic.MapWidth * tipSize * scale, logic.MapHeight * tipSize * scale);
    for (var y = 0; y < logic.MapHeight; y++) {
        for (var x = 0; x < logic.MapWidth; x++) {
            switch (logic.GetMapData()[y][x]) {
                case WpMaze.Logic.Obstacle:
                    mapSurface.draw(mapImage, 32, 0, 32, 32, x * 32 * scale, y * 32 * scale, 32 * scale, 32 * scale);
                    break;
                case WpMaze.Logic.Goal:
                    mapSurface.draw(mapImage, 64, 0, 32, 32, x * 32 * scale, y * 32 * scale, 32 * scale, 32 * scale);
                    break;
            }
        }
    }
    // マップスプライト作成
    var cursorWait = 0;
    var mapCanvas = new enchant.Sprite(displayW * tipSize * scale, displayH * tipSize * scale);
    mapCanvas.image = new enchant.Surface(mapCanvas.width, mapCanvas.height);
    group.addChild(mapCanvas);
    var redrawMapCanvas = function () {
        mapCanvas.image.clear();
        var nowPos = logic.NowPos;
        var dstX = nowPos.x - displayW / 2;
        if (dstX <= 0) {
            dstX = 0;
        }
        if (dstX + displayW >= logic.MapWidth) {
            dstX = logic.MapWidth - displayW;
        }
        var dstY = nowPos.y - displayH / 2;
        if (dstY <= 0) {
            dstY = 0;
        }
        if (dstY + displayH >= logic.MapHeight) {
            dstY = logic.MapHeight - displayH;
        }
        mapCanvas.image.draw(mapSurface, -dstX * tipSize * scale, -dstY * tipSize * scale);
        if (cursorWait < 30) {
            mapCanvas.image.draw(mapImage, 0, 0, tipSize, tipSize, (nowPos.x - dstX) * tipSize * scale, (nowPos.y - dstY) * tipSize * scale, tipSize * scale, tipSize * scale);
        }
        cursorWait++;
        if (cursorWait >= 40) {
            cursorWait -= 40;
        }
    };
    // 再描画
    redrawMapCanvas();
    // ボタン作成
    var buttonGroup = new enchant.Group();
    buttonGroup.y = displayH * tipSize * scale + 32;
    group.addChild(buttonGroup);
    var inputUp = false, inputDown = false, inputLeft = false, inputRight = false;
    var buttonImages = game.assets['./assets/resources/buttons.png'];
    var createButton = function (initFrame, touchFrame, setInputFlag) {
        var button = new enchant.Sprite(32, 32);
        button.touchEnabled = true;
        button.scale(2, 2);
        button.image = buttonImages;
        button.frame = initFrame;
        button.on(enchant.Event.TOUCH_START, function (e) {
            button.frame = touchFrame;
            setInputFlag(true);
        });
        button.on(enchant.Event.TOUCH_END, function (e) {
            button.frame = initFrame;
            setInputFlag(false);
        });
        buttonGroup.addChild(button);
        return button;
    };
    var upButon = createButton(0, 4, function (value) { inputUp = value; });
    upButon.x = screenWidth / 2;
    upButon.y = 0;
    var downButon = createButton(1, 5, function (value) { inputDown = value; });
    downButon.x = screenWidth / 2;
    downButon.y = 1 * tipSize * scale;
    var rightButon = createButton(2, 6, function (value) { inputRight = value; });
    rightButon.x = screenWidth / 2 + tipSize * scale;
    rightButon.y = 1 * tipSize * scale;
    var leftButon = createButton(3, 7, function (value) { inputLeft = value; });
    leftButon.x = screenWidth / 2 - tipSize * scale;
    leftButon.y = 1 * tipSize * scale;
    // ゴール
    var goalGroup = new enchant.Group();
    var goalImage = game.assets['./assets/resources/goal.png'];
    var numberImage = game.assets['./assets/resources/number.png'];
    var goalSprite = new enchant.Sprite(displayW * tipSize * scale, displayH * tipSize * scale);
    goalSprite.image = new enchant.Surface(goalSprite.width, goalSprite.height);
    goalSprite.touchEnabled = true;
    goalGroup.addChild(goalSprite);
    var drawGoal = function () {
        goalSprite.image.context.beginPath();
        goalSprite.image.context.fillStyle = "rgb(157,166,97)";
        goalSprite.image.context.rect(0, 0, goalSprite.width, goalSprite.height);
        goalSprite.image.context.fill();
        goalSprite.image.draw(goalImage, 0, 0, 128, 64, 96, 64, 96 * scale, 64 * scale);
        var walkCount = logic.WalkCount.toString(10);
        for (var numIndex = 0; numIndex < walkCount.length; numIndex++) {
            var numberX = parseInt(walkCount[numIndex]);
            goalSprite.image.draw(numberImage, 16 * numberX, 0, 16, 32, 96 + 96 * scale + (16 * numIndex) * scale, 64 + 32 * scale, 16 * scale, 32 * scale);
        }
    };
    goalSprite.on(enchant.Event.TOUCH_START, function (e) {
        group.removeChild(goalGroup);
        gameMode = GameMode.main;
        logic.Reset();
        manual.text = manualMainMode;
    });
    var waitCount = 0;
    game.on(enchant.Event.ENTER_FRAME, function () {
        if (gameMode === GameMode.main) {
            var addX = 0;
            var addY = 0;
            if (game.input.up || inputUp) {
                addX = 0;
                addY = -1;
            }
            if (game.input.down || inputDown) {
                addX = 0;
                addY = 1;
            }
            if (game.input.left || inputLeft) {
                addX = -1;
                addY = 0;
            }
            if (game.input.right || inputRight) {
                addX = 1;
                addY = 0;
            }
            if (addX != 0 || addY != 0) {
                waitCount--;
                if (waitCount <= 0) {
                    waitCount = 5;
                    var result = logic.Move(addX, addY);
                    if (result == WpMaze.MoveResult.goal) {
                        group.addChild(goalGroup);
                        gameMode = GameMode.goal;
                        manual.text = manualGoalMode;
                    }
                }
            }
            else {
                waitCount = 0;
            }
            // 再描画
            redrawMapCanvas();
        }
        if (gameMode === GameMode.goal) {
            drawGoal();
        }
    });
};
game.start();

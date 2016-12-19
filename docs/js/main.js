enchant();
var screenWidth = 640;
var screenHeight = 640;
// Start
var game = new enchant.Core(screenWidth, screenHeight);
game.fps = 30;
game.preload(['./assets/resources/map.png', './assets/resources/buttons.png', './assets/resources/map1.json']);
// ロード完了イベント
game.onload = function () {
    var scale = 2;
    var tipSize = 32;
    var displayW = 10;
    var displayH = 4;
    var mainPanel = new enchant.Group();
    game.currentScene.addChild(mainPanel);
    // CreateStage
    var stage = new enchant.Group();
    mainPanel.addChild(stage);
    // CreateGroup
    var group = new enchant.Group();
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
        group.addChild(button);
        return button;
    };
    var upButon = createButton(0, 4, function (value) { inputUp = value; });
    upButon.x = screenWidth / 2;
    upButon.y = (displayH + 1) * tipSize * scale;
    var downButon = createButton(1, 5, function (value) { inputDown = value; });
    downButon.x = screenWidth / 2;
    downButon.y = (displayH + 2) * tipSize * scale;
    var rightButon = createButton(2, 6, function (value) { inputRight = value; });
    rightButon.x = screenWidth / 2 + tipSize * scale;
    rightButon.y = (displayH + 2) * tipSize * scale;
    var leftButon = createButton(3, 7, function (value) { inputLeft = value; });
    leftButon.x = screenWidth / 2 - tipSize * scale;
    leftButon.y = (displayH + 2) * tipSize * scale;
    var waitCount = 0;
    game.on(enchant.Event.ENTER_FRAME, function () {
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
            }
        }
        else {
            waitCount = 0;
        }
        // 再描画
        redrawMapCanvas();
    });
};
game.start();

enchant();
var screenWidth = 640;
var screenHeight = 640;
// Start
var game = new enchant.Core(screenWidth, screenHeight);
game.fps = 30;
game.preload(['./assets/resources/map.png', './assets/resources/map1.json']);
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
    var surface = new enchant.Sprite(10 * tipSize * scale, 3 * tipSize * scale);
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
            if (logic.GetMapData()[y][x] === WpMaze.Logic.Obstacle)
                mapSurface.draw(mapImage, 32, 0, 32, 32, x * 32 * scale, y * 32 * scale, 32 * scale, 32 * scale);
        }
    }
    // マップスプライト作成
    var mapCanvas = new enchant.Sprite(displayW * tipSize * scale, displayH * tipSize * scale);
    mapCanvas.image = new enchant.Surface(mapCanvas.width, mapCanvas.height);
    group.addChild(mapCanvas);
    var redrawMapCanvas = function () {
        mapCanvas.image.clear();
        var nowPos = logic.NowPos;
        var dstX = nowPos.x - displayW + 1;
        if (dstX <= 0) {
            dstX = 0;
        }
        var dstY = nowPos.y - displayH + 1;
        if (dstY <= 0) {
            dstY = 0;
        }
        mapCanvas.image.draw(mapSurface, -dstX * tipSize * scale, -dstY * tipSize * scale);
        mapCanvas.image.draw(mapImage, 0, 0, tipSize, tipSize, (nowPos.x - dstX) * tipSize * scale, (nowPos.y - dstY) * tipSize * scale, tipSize * scale, tipSize * scale);
    };
    // 再描画
    redrawMapCanvas();
    var waitCount = 0;
    game.on(enchant.Event.ENTER_FRAME, function () {
        var addX = 0;
        var addY = 0;
        if (game.input.up) {
            addX = 0;
            addY = -1;
        }
        if (game.input.down) {
            addX = 0;
            addY = 1;
        }
        if (game.input.left) {
            addX = -1;
            addY = 0;
        }
        if (game.input.right) {
            addX = 1;
            addY = 0;
        }
        if (addX != 0 || addY != 0) {
            waitCount--;
            if (waitCount <= 0) {
                waitCount = 5;
                var result = logic.Move(addX, addY);
                if (result !== WpMaze.MoveResult.obst) {
                    // 再描画
                    redrawMapCanvas();
                }
            }
        }
        else {
            waitCount = 0;
        }
    });
};
game.start();

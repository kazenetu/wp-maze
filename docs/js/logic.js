var WpMaze;
(function (WpMaze) {
    /**
     * 移動結果
     * @memberof WpMaze
     */
    var MoveResult;
    (function (MoveResult) {
        MoveResult[MoveResult["Moved"] = 0] = "Moved";
        MoveResult[MoveResult["obst"] = 1] = "obst";
        MoveResult[MoveResult["goal"] = 2] = "goal";
    })(MoveResult = WpMaze.MoveResult || (WpMaze.MoveResult = {}));
    ;
    /**
     * ロジック
     * @classdesc ロジッククラス
     * @constructor
     * @memberof WpMaze.Logic
     */
    var Logic = (function () {
        /**
         * コンストラクタ
         * @method
         * @name WpMaze.Logic#Logic
         */
        function Logic() {
            this.mapData = null;
            this.startPos = null;
            this.goalPos = null;
            this.walkCount = 0;
        }
        Object.defineProperty(Logic.prototype, "MapWidth", {
            /**
             * マップ幅
             * @returns マップの幅
             */
            get: function () {
                return this.mapWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Logic.prototype, "MapHeight", {
            /**
             * マップ高さ
             * @returns マップの高さ
             */
            get: function () {
                return this.mapHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Logic.prototype, "NowPos", {
            /**
             * 現在位置
             * @returns 現在位置
             */
            get: function () {
                return { x: this.nowPos[0], y: this.nowPos[1] };
            },
            enumerable: true,
            configurable: true
        });
        /**
         * マップデータのロード
         * @method
         * @name WpMaze.Logic#Load
         * @param src マップデータのjson
         */
        Logic.prototype.Load = function (src) {
            this.mapData = null;
            this.mapHeight = 0;
            this.mapWidth = 0;
            this.startPos = null;
            this.goalPos = null;
            this.walkCount = 0;
            // マップデータ生成と読み込み
            var srcDara = JSON.parse(src);
            this.mapData = new Array(srcDara.length);
            this.mapHeight = srcDara.length;
            for (var y = 0; y < srcDara.length; y++) {
                this.mapData[y] = new Array(srcDara[y].length);
                if (this.mapWidth <= 0) {
                    this.mapWidth = srcDara[y].length;
                }
                for (var x = 0; x < srcDara[y].length; x++) {
                    this.mapData[y][x] = srcDara[y][x].value;
                    // スタートとゴール位置の取得
                    switch (srcDara[y][x].value) {
                        case "S":
                            this.startPos = [x, y];
                            break;
                        case "G":
                            this.goalPos = [x, y];
                            break;
                    }
                }
            }
            // スタートとゴール位置がない場合は失敗
            if (this.startPos === null || this.goalPos === null) {
                return false;
            }
            // 現在位置をスタート位置に初期化する
            this.nowPos = this.startPos;
            return true;
        };
        /**
         * マップデータの取得
         * @method
         * @name WpMaze.Logic#GetMapData
         * @returns マップデータ
         */
        Logic.prototype.GetMapData = function () {
            // マップロードができているか確認する
            if (this.mapData === null) {
                return null;
            }
            return this.mapData;
        };
        /**
         * 移動
         * @method
         * @name WpMaze.Logic#Move
         * @param addX 移動X
         * @param addY 移動Y
         * @returns 移動結果
         */
        Logic.prototype.Move = function (addX, addY) {
            // マップロードができているか確認する
            if (this.mapData === null) {
                return MoveResult.obst;
            }
            // 移動後の位置を取得する
            var _a = this.nowPos, x = _a[0], y = _a[1];
            x += addX;
            y += addY;
            // 移動不可の場合はfalseを返す
            if (this.mapData[y][x] === Logic.Obstacle) {
                return MoveResult.obst;
            }
            // 移動結果を反映
            this.nowPos = [x, y];
            // 歩数をインクリメントする
            this.walkCount++;
            // ゴールにたどり着いたらtrueを返す
            if (x === this.goalPos[0] || y === this.goalPos[1]) {
                return MoveResult.goal;
            }
            return MoveResult.Moved;
        };
        return Logic;
    }());
    /**
     * 障害物文字列
     */
    Logic.Obstacle = "X";
    WpMaze.Logic = Logic;
})(WpMaze || (WpMaze = {}));

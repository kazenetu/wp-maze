namespace WpMaze {

    /**
     * 移動結果
     * @memberof WpMaze
     */
    export enum MoveResult {
        Moved
        , obst
        , goal
    };

    /**
     * ロジック
     * @classdesc ロジッククラス
     * @constructor
     * @memberof WpMaze.Logic
     */
    export class Logic {

        /**
         * 障害物文字列
         */
        public static Obstacle: string = "X";

        /**
         * ゴール文字列
         */
        public static Goal: string = "G";

        /**
         * マップデータ
         */
        private mapData: string[][] | null;

        /**
         * マップデータ:幅
         */
        private mapWidth: number;

        /**
         * マップデータ:高さ
         */
        private mapHeight: number;

        /**
         * スタート位置
         */
        private startPos: [number, number] | null;

        /**
         * ゴール位置
         */
        private goalPos: [number, number] | null;

        /**
         * 現在位置
         */
        private nowPos: [number, number] | null;

        /**
         * 歩数
         */
        private walkCount: number;

        /**
         * マップ幅
         * @returns マップの幅
         */
        public get MapWidth():number {
            return this.mapWidth;
        }

        /**
         * マップ高さ
         * @returns マップの高さ
         */
        public get MapHeight():number {
            return this.mapHeight;
        }

        /**
         * 現在位置
         * @returns 現在位置
         */
        public get NowPos():{x,y} {
            return { x: this.nowPos[0], y: this.nowPos[1] };
        }

        /**
         * 歩数
         * @returns 歩数
         */
        public get WalkCount():number {
            return this.walkCount;
        }

        /**
         * コンストラクタ
         * @method
         * @name WpMaze.Logic#Logic
         */
        public constructor() {
            this.mapData = null;
            this.startPos = null;
            this.goalPos = null;
            this.walkCount = 0;
        }

        /**
         * マップデータのロード
         * @method
         * @name WpMaze.Logic#Load
         * @param src マップデータのjson
         */
        public Load(src): boolean {
            this.mapData = null;
            this.mapHeight = 0;
            this.mapWidth = 0;
            this.startPos = null;
            this.goalPos = null;
            this.walkCount = 0;

            // マップデータ生成と読み込み
            let srcDara = JSON.parse(src);
            this.mapData = new Array(srcDara.length);
            this.mapHeight = srcDara.length;
            for (let y = 0; y < srcDara.length; y++) {
                this.mapData[y] = new Array(srcDara[y].length);
                if (this.mapWidth <= 0) {
                    this.mapWidth = srcDara[y].length;
                }
                for (let x = 0; x < srcDara[y].length; x++) {
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
        }

        /**
         * マップデータの取得
         * @method
         * @name WpMaze.Logic#GetMapData
         * @returns マップデータ
         */
        public GetMapData(): string[][] | null {
            // マップロードができているか確認する
            if (this.mapData === null) {
                return null;
            }

            return this.mapData;
        }

        /**
         * 移動
         * @method
         * @name WpMaze.Logic#Move
         * @param addX 移動X
         * @param addY 移動Y
         * @returns 移動結果
         */
        public Move(addX: number, addY: number): MoveResult {
            // マップロードができているか確認する
            if (this.mapData === null) {
                return MoveResult.obst;
            }

            // 移動後の位置を取得する
            let [x, y] = this.nowPos;
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
            if (x === this.goalPos[0] && y === this.goalPos[1]) {
                return MoveResult.goal;
            }

            return MoveResult.Moved;
        }

        /**
        * 現在位置をスタート位置に戻す
        * @method
        * @name WpMaze.Logic#Reset
        */
        public Reset(): void {
            this.nowPos = this.startPos;
            this.walkCount = 0;
        }
    }
}
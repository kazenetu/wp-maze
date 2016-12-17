<mapData>
    <div show={this.mode === "load"}>
        <div>
            <textarea onchange={changeInputJson}></textarea>
            <button onclick={load}>読み込み</button>
        </div>
        <div>
            幅：<input type="number" ref="loadWidth" value="20">
            高さ:<input type="number" ref="loadHeight" value="10">
            <button onclick={create}>新規作成</button>
        </div>
    </div>

    <div show={this.mode === "edit"}>
        <button onclick={renew}>新規作成</button>
        <button onclick={output}>出力</button>
    
        <div>
            <label><input type="radio" name="maptype" value="X" checked = {this.maptype==='X'} onchange={changeMapType}>X</label>
            <label><input type="radio" name="maptype" value="S" checked = {this.maptype==='S'} onchange={changeMapType}>Start</label>
            <label><input type="radio" name="maptype" value="G" checked = {this.maptype==='G'} onchange={changeMapType}>Goal</label>
        </div>
        <div>
            <table>
                <tr each={ row in mapData }>
                    <td each={ cell in row } onclick={changeCell} class={"data"+cell.value} }>
                        { (cell.value==="S" || cell.value==="G")?cell.value:"" }
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <div show={this.mode === "output"}>
        <textarea>{outputJson}</textarea>
        <button onclick={outputReturn}>戻る</button>
    </div>

<script>
    this.mode = "load";
    this.maptype= 'X';
    this.mapData = new Array();
    this.inputJson = "";
    this.outputJson = "";

    var that = this;

    changeInputJson(e){
        that.inputJson = e.target.value;
    }

    renew(){
        this.mode = "load";
    }

    load(){
        that.mapData = JSON.parse(that.inputJson);
        this.mode = "edit";
    }

    create(e){
        e.preventDefault();
        var width = this.refs.loadWidth.value;
        var height = this.refs.loadHeight.value;
        if(width!=="" && height!==""){
            initMapData(Number(width),Number(height));
            this.mode = "edit";
        }
    }

    function initMapData(width,height){
        that.mapData = new Array(height);
        for(var y=0;y<height;y++){
            that.mapData[y] = new Array(width);
            for(var x=0;x<width;x++){
                that.mapData[y][x] = {value:"0"};
                if(y===0 || y===height-1 || x===0 || x===width-1){
                    that.mapData[y][x].value="X";
                }
            }
        }
    }
    initMapData(20,10);

    function resetType(targetType){
        for(var y=0; y < that.mapData.length;y++ ){
            for(var x=0; x < that.mapData[y].length;x++ ){
                if(that.mapData[y][x].value === targetType){
                    that.mapData[y][x].value = "0";
                }
            }
        }
    }

    changeMapType(e){
        this.maptype = e.target.value;
    }

    changeCell(e){
        var cell = e.item.cell;
        if(cell.value === "0"){
            if(this.maptype !=="X"){
                resetType(this.maptype);
            }
            cell.value=this.maptype;
        }
        else{
            cell.value="0";
        }
    }

    output(e){
        that.outputJson = JSON.stringify(that.mapData);
        this.mode = "output";
    }

    outputReturn(e){
        this.mode = "edit";
    }

</script>

<style>
    :scope td{
        border-style: solid;
        border-width: 1px;
        width:16px;
        height:16px;
    }
    :scope .data0{
        background-color:white;
    }
    :scope .dataX{
        background-color:gray;
    }
    :scope .dataS,.dataG{
        background-color:white;
        color:red;
    }
<style>

</mapData>

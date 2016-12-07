<mapData>
    <div>
        <button onclick={init}>初期化</button>
    </div>
    <table>
        <tr each={ row in mapData }>
            <td each={ cell in row } onclick={changeCell} class={"data"+cell.value} }>
                { cell.value }
            </td>
        </tr>
    </table>
    <div>
        <button onclick={output}>出力</button>
        <br>
        {outputJson}
    </div>

<script>
    this.mapData = new Array();
    this.outputJson = "";

    var that = this;
    function initMapData(width,height){
        that.mapData = new Array(height);
        for(var y=0;y<height;y++){
            that.mapData[y] = new Array(width);
            for(var x=0;x<width;x++){
                that.mapData[y][x] = {value:0};
            }
        }
    }
    initMapData(20,10);

    init(){
        initMapData(20,10);
    }

    changeCell(e){
        var cell = e.item.cell;
        if(cell.value === 0){
            cell.value=1;
        }
        else{
            cell.value=0;
        }
    }

    output(e){
        that.outputJson = JSON.stringify(that.mapData);
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
    :scope .data1{
        background-color:gray;
    }
<style>

</mapData>

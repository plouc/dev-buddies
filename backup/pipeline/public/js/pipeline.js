var Pipeline = function(rows, columns) {

    this.rows    = rows;
    this.columns = columns;

    this.grid = [];

    this.tools = ['—', '|', '+'];
    this.currentTool = null;
};

Pipeline.prototype.buildEmptyGrid = function() {
    this.grid = [];

    var row;
    for (var y = 0; y < this.rows; y++) {
        row = [];
        for (var x = 0; x < this.columns; x++) {
            row.push(false);
        }
        this.grid.push(row);
    }
};

Pipeline.prototype.isFreeAtPos = function(x, y) {
    return this.grid[y][x] === false;
};

Pipeline.prototype.markOccupiedAtPos = function(x, y) {
    this.grid[y][x] = true;
    return this;
};

Pipeline.prototype.setCurrentTool = function(tool) {
    this.currentTool = tool;
    return this;
};
$(document).ready(function() {

    var $container = $('#container');
    var $map       = $container.find('.map');
    var $toolbar   = $container.find('.toolbar');

    var pipeline = new Pipeline(8, 24);
    pipeline.buildEmptyGrid();

    var tileWidth  = (100 / pipeline.columns);
    var tileHeight = (100 / pipeline.rows);

    var $tile;
    for (var y = 0; y < pipeline.rows; y++) {
        for (var x = 0; x < pipeline.columns; x++) {
            $tile = $('<div class="tile"/>')
                .css({
                    'top':    (tileHeight * y) + '%',
                    'left':   (tileWidth  * x) + '%',
                    'width':  tileWidth  + '%',
                    'height': tileHeight + '%'
                });

            $.data($tile.get(0), 'meta', {
                'x': x,
                'y': y
            });

            $map.append($tile);
        }
    }

    pipeline.tools.forEach(function(tool) {
        var $tool = $('<div class="tool"/>')
            .text(tool);
        $toolbar.append($tool);
    });

    var $tools = $toolbar.find('.tool');
    $toolbar.on('click', '.tool', function(e) {
        var $tool = $(this);
        pipeline.setCurrentTool($(this).text());
        $tools.removeClass('active');
        $tool.addClass('active');
    });

    $map.on('mouseenter', '.tile', function(e) {
        $(this).addClass('over');
    }).on('mouseleave', '.tile', function(e) {
        $(this).removeClass('over');
    }).on('click', '.tile', function(e) {
        var meta = $.data(this, 'meta');
        if (pipeline.isFreeAtPos(meta.x, meta.y)) {
            pipeline.markOccupiedAtPos(meta.x, meta.y);
            $(this).addClass('occupied');
        } else {
        }
    });
});
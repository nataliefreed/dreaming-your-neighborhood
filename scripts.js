$(function () {

// create a wrapper around native canvas element (with id="c")
    var canvas = new fabric.Canvas('canvas');
    //var menuCanvas = new fabric.Canvas('menuCanvas');

    canvas.setHeight(550);
    canvas.setWidth(1050);
    canvas.renderAll();

    canvas.backgroundColor = '#8E8C84';

    //menuCanvas.backgroundColor = 'white';
    //menuCanvas.stroke = 'black';

    var menuWidth = 200;
    var gapWidth = 10;

    var menu = new fabric.Rect({
        left: canvas.width-menuWidth+gapWidth,
        top: 0,
        fill: 'white',
        stroke: 'black',
        width: menuWidth-gapWidth-1,
        height: canvas.height-1,
        selectable: false
    });
    canvas.add(menu);

    var gap = new fabric.Rect({
        left: canvas.width-menuWidth,
        top: 0,
        fill: '#F8F5F0',
        width: gapWidth,
        height: canvas.height,
        selectable: false
    });
    canvas.add(gap);

    var neighborhoodWidth = 400;
    var neighborhoodHeight = 300;
    var nbX = canvas.width-30-neighborhoodWidth-menuWidth;
    var nbY = 30;
    var numRows = 6;
    var numCols = 6;
    var streetWidth = 10;
    var blockWidth = (neighborhoodWidth - (numCols-1)*streetWidth)/numCols;
    var blockHeight = (neighborhoodHeight - (numRows-1)*streetWidth)/numRows;

    var streetBackground = new fabric.Rect({
        left: nbX,
        top: nbY,
        fill: 'white',
        stroke: '#CEC2AE',
        width: neighborhoodWidth,
        height: neighborhoodHeight,
        selectable: false
    });

    var firstBlock = new fabric.Rect({
        left: nbX,
        top: nbY,
        fill: '#DFD7CA',
        stroke: '#CEC2AE',
        width: blockWidth,
        height: blockHeight,
        selectable: false
    });

    canvas.add(streetBackground);
    for(var row=0;row<numRows;row++) {
        for(var col=0;col<numCols;col++) {
            var block = fabric.util.object.clone(firstBlock);
            block.set("top", firstBlock.top + (blockHeight+streetWidth) * col);
            block.set("left", firstBlock.left + (blockWidth+streetWidth) * row);
            canvas.add(block);
        }
    }

    addImage('images/playground.jpg', 50, 50);
    addImage('images/mural.jpg', 75, 300);

    var margin = 10;

    var icons = ["icons/simple_house.svg",
                "icons/apartment_modern.svg",
                "icons/gas_pump.svg",
                "icons/office_fancy.svg",
                "icons/church.svg",
                "icons/house_garage.svg",
                "icons/school.svg",
                "icons/police_station.svg" ];

    for(var i=0;i<icons.length;i++) {
        addMapIcon(icons[i], canvas.width-menuWidth+gapWidth+margin, 10+(margin+40)*i);
    }

    function addMapIcon(url, left, top) {
        fabric.Image.fromURL(url, function (img) {
            img.scaleToHeight(30);
            img.hasControls = false;
            img.selectable = false;
            img.left = left;
            img.top = top;
            img.on('mousedown', function() {
                var newItem = fabric.util.object.clone(img);
                newItem.selectable = true;
                canvas.add(newItem);
            });
            var topItem = fabric.util.object.clone(img);
            topItem.selectable = true;
            canvas.add(img);
            canvas.add(topItem);
        });
    }



     function addImage(url, left, top) {
        fabric.Image.fromURL(url, function(oImg) {
            // scale image down, and flip it, before adding it onto canvas
            oImg.scaleToHeight(200);
            oImg.left = left;
            oImg.top = top;
            canvas.add(oImg);
        });
    };
    canvas.selection = false;

    var imageText = new fabric.Text("Add image", {
        fontFamily: 'Arial',
        left: 100,
        top: 100,
        selectable: false,
        textDecoration: 'underline',
        fontSize: 20
    });
    imageText.on('mousedown', function() {
        console.log("text clicked");

    });
    var imageText2 = fabric.util.object.clone(imageText);
    imageText2.left = 150;
    imageText2.top = 400;

    canvas.add(imageText);
    canvas.add(imageText2);

    //$("#houseButton").click(function() {
    //    var newHouse = fabric.util.object.clone(house);
    //    newHouse.left = nbX;
    //    newHouse.top = nbY;
    //    canvas.add(newHouse);
    //});

});




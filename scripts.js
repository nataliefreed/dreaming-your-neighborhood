$(function () {

// create a wrapper around native canvas element (with id="c")
    var canvas = new fabric.Canvas('canvas');
    //var menuCanvas = new fabric.Canvas('menuCanvas');

    canvas.setHeight(600);
    canvas.setWidth(900);
    canvas.renderAll();

    //canvas.backgroundColor = '#8E8C84';

    //canvas.backgroundColor = 'white';
    //canvas.stroke = 'black';

    //menuCanvas.backgroundColor = 'white';
    //menuCanvas.stroke = 'black';

    var menuHeight = 50;
    var menuWidth = 200;
    var gapWidth = 10;
    var drawingArea

    var drawingArea = new fabric.Rect({
        left: 0,
        top: menuHeight+gapWidth+1,
        fill: 'white',
        stroke: '#838383',
        width: canvas.width-1-5,
        height: canvas.height-menuHeight-gapWidth-2-5,
        shadow:{ color:"gray",blur:3,offsetX:4,offsetY:4 },
        selectable: false
    });
    canvas.add(drawingArea);

    canvas.on('mouse:up', function(options) {
        if (options.target) {
            console.log('an object was released ', options.target.type);
            console.log(options.e.layerY);
            if(options.e.layerY < menuHeight) {
                canvas.getActiveObject().remove();
            }
        }
    });

    var menu = new fabric.Rect({
        left: 0,
        top: 0,
        fill: '#c0c0c0',
        width: canvas.width-1-5,
        height: menuHeight-1,
        rx: 3,
        ry: 3,
        selectable: false
    });
    canvas.add(menu);

    var gap = new fabric.Rect({
        left: 0,
        top: menuHeight,
        fill: '#F8F5F0',
        width: canvas.width,
        height: gapWidth,
        selectable: false
    });
    canvas.add(gap);

    var neighborhoodWidth = 480;
    var neighborhoodHeight = 480;
    var nbX = 30;
    var nbY = menuHeight+gapWidth+30;
    var numRows = 7;
    var numCols = 5;
    var streetWidth = 10;
    var blockWidth = (neighborhoodWidth - (numCols-1)*streetWidth) / numCols;
    var blockHeight = (neighborhoodHeight - (numRows-1)*streetWidth) / numRows;

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
            block.set("top", firstBlock.top + (blockHeight+streetWidth) * row);
            block.set("left", firstBlock.left + (blockWidth+streetWidth) * col);
            canvas.add(block);
        }
    }

    addImage('images/playground.jpg', 560, menuHeight+gapWidth+30);
    addImage('images/mural.jpg', 560, 300);

    var margin = 10;

    var icons = ["icons/simple_house.svg",
                "icons/gas_pump.svg",
                "icons/office_fancy.svg",
                "icons/synagogue.svg",
                "icons/house_garage.svg",
                "icons/school.svg",
                "icons/market.svg",
                "icons/mosque.svg",
                "icons/bench.svg",
                "icons/tree.svg",
                "icons/pinetree.svg",
                "icons/palmtree.svg",
                "icons/library.svg",
                "icons/govt.svg",
                "icons/office.svg",
            ];

    for(var i=0;i<icons.length;i++) {
        addMapIcon(icons[i], 10+i*(margin+40), 10);
    }

    var park = new fabric.Rect({
        fill: '#87D37C',
        //stroke: 'green',
        //strokeWidth: 0.5,
        width: 10,
        height: 8,
        selectable: false
    });
    addShapeIcon(park, icons.length*(margin+40), 10, park.height, park.width);

    var text = new fabric.IText("text", {
        fontFamily: 'Helvetica',
        fontSize: 25,
        hasControls: false,
        top: 10,
        left: 10+(icons.length+1)*(margin+40)
    });
    canvas.add(text);
    //addShapeIcon(text, canvas.width-menuWidth+gapWidth+margin, 10+(margin+40)*(icons.length+1), 5, 5);

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

    function addShapeIcon(shape, left, top, fullheight, fullwidth) {
            shape.hasControls = false;
            shape.selectable = true;
            shape.left = left;
            shape.cornerSize = 15;
            shape.top = top;
            shape.on('mousedown', function() {
                console.log("mousedown");
                var newItem = fabric.util.object.clone(shape);
                newItem.height = fullheight;
                newItem.width = fullwidth;
                newItem.selectable = true;
                newItem.hasControls = true;
                canvas.add(newItem);
            });
            shape.scaleToHeight(30);
            var topItem = fabric.util.object.clone(shape);
            topItem.selectable = true;
            topItem.on('mousedown', function() {
                console.log("mousedown top item");
                topItem.height = fullheight;
                topItem.width = fullwidth;
                topItem.hasControls = true;
            });
            canvas.add(shape);
            canvas.add(topItem);
        }


     function addImage(url, left, top) {
        fabric.Image.fromURL(url, function(oImg) {
            // scale image down, and flip it, before adding it onto canvas
            oImg.scaleToWidth(300);
            oImg.left = left;
            oImg.top = top;
            canvas.add(oImg);
        });
    };
    canvas.selection = false;

    for(var category in categoryLists) {
        var dropdown = $("#photo-menu");
        var categoryInList = document.createElement('li');
        var categoryLink = document.createElement('a');
        categoryLink.textContent = category;
        categoryInList.appendChild(categoryLink);
        dropdown.append(categoryInList);
    }

    $('div.dropdown ul.dropdown-menu li a').click(function (e) {
        $("#photo-menu").dropdown("toggle");
        console.log($(this).text());
        var category = $(this).text();

        var listArea = $("#image-lists");
        listArea.empty();
        var list = $('<ul>');
        listArea.append(list);
        var imageUrls = categoryLists[category];
        for(var i in imageUrls) {
            var listItem = document.createElement('li');
            var image = document.createElement('img');
            image.setAttribute('src',imageUrls[i]);
            image.setAttribute('width',150);
            $(image).click(function (e) {
                console.log(this.src);
                addImage(this.src, 560, menuHeight+gapWidth+30);
            });
            listItem.appendChild(image);
            list.append(listItem);
        }
        return false;
    });



    //var imageText = new fabric.Text("Add image", {
    //    fontFamily: 'Arial',
    //    left: 100,
    //    top: 100,
    //    selectable: false,
    //    textDecoration: 'underline',
    //    fontSize: 20
    //});
    //imageText.on('mousedown', function() {
    //    console.log("text clicked");
    //
    //});
    //var imageText2 = fabric.util.object.clone(imageText);
    //imageText2.left = 150;
    //imageText2.top = 400;
    //
    //canvas.add(imageText);
    //canvas.add(imageText2);
    //
    //$("#houseButton").click(function() {
    //    var newHouse = fabric.util.object.clone(house);
    //    newHouse.left = nbX;
    //    newHouse.top = nbY;
    //    canvas.add(newHouse);
    //});

});




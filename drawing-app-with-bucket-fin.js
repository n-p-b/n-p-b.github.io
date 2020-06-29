var drawingApp = (function () {

	"use strict";

	var contexts = {},
		context,
		canvasWidth = 1000,
		canvasHeight = 500,
		outlineImage = new Image(),
		crayonImage = new Image(),
		markerImage = new Image(),
		eraserImage = new Image(),
		crayonBackgroundImage = new Image(),
		markerBackgroundImage = new Image(),
		eraserBackgroundImage = new Image(),
		crayonTextureImage = new Image(),
		clickX = [],
		clickY = [],
		clickColor = [],
		clickTool = [],
		clickSize = [],
		clickDrag = [],
		paint = false,
		curTool = "marker",
		curSize = "large",
		mediumStartX = 18,
		mediumStartY = 19,
		mediumImageWidth = 93,
		mediumImageHeight = 46,
		drawingAreaX = 230,
		drawingAreaY = 15,
		drawingAreaWidth = 540,
		drawingAreaHeight = 460,
		toolHotspotStartY = 23,
		toolHotspotHeight =70,
		sizeHotspotStartY = 370,
		sizeHotspotHeight = 70,
		sizeLineStartY = 440,
		totalLoadResources = 10,
		curLoadResNum = 0,
		sizeHotspotWidthObject = {
			huge: 70,
			large: 50,
			normal: 40,
			small: 30
		},

		swatchImage = new Image(),
		swatchImageWidth = 93,
		swatchImageHeight = 46,
		colorLayerData,
		outlineLayerData,
		bucketBackgroundImage = new Image(),
		colorPurple = {
			r: 221,
			g: 100,
			b: 191
		},
		colorGreen = { 
			r: 0,
			g: 250,
			b: 154
			
		},
		colorYellow = { 
			r: 255,
			g: 250,
			b: 115
		},
		colorBlue = {//blue
			r: 100,
			g: 149,
			b: 237
		},
		curColor = colorGreen,
// рисуются кружочки цветов
drawColorSwatch = function (color, x, y) {

	context.beginPath();
	context.arc(x + 46, y + 23, 18, 0, Math.PI * 2, true);
	context.closePath();
	context.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
	context.fill();

	if (curColor === color) {
		context.drawImage(swatchImage, 0, 0, 59, swatchImageHeight, x, y, 59, swatchImageHeight);
	} else {
		context.drawImage(swatchImage, x, y, swatchImageWidth, swatchImageHeight);
	}
},
	
		// заполнение массива информацией
		addClick = function (x, y, dragging) {

			clickX.push(x);
			clickY.push(y);
			clickTool.push(curTool);
			clickColor.push(curColor);
			clickSize.push(curSize);
			clickDrag.push(dragging);
		},
		clearClick = function () {

			clickX = [clickX[clickX.length -1]];
			clickY = [clickY[clickY.length - 1]];
			clickTool = [clickTool[clickTool.length - 1]];
			clickColor = [clickColor[clickColor.length - 1]];
			clickSize = [clickSize[clickSize.length - 1]];
			clickDrag = [clickDrag[clickDrag.length - 1]];
		},
		
		// прорисовка кистей
		redraw = function () {

			var locX,
				locY,
				radius,
				i,
				selected,
				
				// рисует маркер цветной
				drawMarker = function (x, y, color, selected) {

					context.beginPath();
					context.moveTo(x + 10, y + 24);
					context.lineTo(x + 10, y + 24);
					context.lineTo(x + 22, y + 16);
					context.lineTo(x + 22, y + 31);
					context.closePath();
					context.fillStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
					context.fill();

					if (selected) {
						context.drawImage(markerImage, x, y, mediumImageWidth, mediumImageHeight);
					} else {
						context.drawImage(markerImage, 0, 0, 59, mediumImageHeight, x, y, 59, mediumImageHeight);
					}
				};

	
 //проверка на наличие всех картинок
			if (curLoadResNum < totalLoadResources) {

				return;
			}

			// прорисовка карандашей

				if (curTool === "marker") {

				context.drawImage(markerBackgroundImage, 0, 0, canvasWidth, canvasHeight);


				selected = (curColor === colorPurple);
				locX = selected ? 132 : 165;
				locY = 19;
				drawMarker(locX, locY, colorPurple, selected);


				selected = (curColor === colorGreen);
				locX = selected ? 132 : 165;
				locY += 46;
				drawMarker(locX, locY, colorGreen, selected);


				selected = (curColor === colorYellow);
				locX = selected ? 132 : 165;
				locY += 46;
				drawMarker(locX, locY, colorYellow, selected);


				selected = (curColor === colorBlue);
				locX = selected ? 132 : 165;
				locY += 46;
				drawMarker(locX, locY, colorBlue, selected);

			} else if (curTool === "eraser") {
				// закрашивает все прошлые кисти
				context.drawImage(eraserBackgroundImage, 0, 0, canvasWidth, canvasHeight);
				// рисует картинку ластика
				context.drawImage(eraserImage, 135, 35, mediumImageWidth, mediumImageHeight);

			}
			if (curTool === "bucket") {
				context.drawImage(bucketBackgroundImage, 0, 0, canvasWidth, canvasHeight);
				contexts.drawing.putImageData(colorLayerData, 0, 0, 0, 0, drawingAreaWidth, drawingAreaHeight);
				// рисует цвета
				locX = 52;
				locY = 19;
				drawColorSwatch(colorPurple, locX, locY);

				locY += 46;
				drawColorSwatch(colorGreen, locX, locY);

				locY += 46;
				drawColorSwatch(colorYellow, locX, locY);

				locY += 46;
				drawColorSwatch(colorBlue, locX, locY);

				} else {
	 

				//установка метки размера
				switch (curSize) {
				case "small":
					locX = 953;
					break;
				case "normal":
					locX = 918;
					break;
				case "large":
					locX = 873;
					break;
				case "huge":
					locX = 815;
					break;
				default:
					break;
				}
				
				locY = sizeLineStartY;

				
				context.beginPath();
				context.rect(locX, locY, 3, 25);
				context.closePath();
				context.fillStyle = '#3c3c3c';
				context.fill();

				// расставляем соответствие размера инструмента по координатам
				if (clickX.length) {				
					// размер кисти
					for (i = 0; i < clickX.length; i += 1) {

						

						contexts.drawing.beginPath();

						
						switch (clickSize[i]) {
						case "small":
							radius = 2;
							break;
						case "normal":
							radius = 5;
							break;
						case "large":
							radius = 10;
							break;
						case "huge":
							radius = 20;
							break;
						default:
							break;
						}

						// проверяем точка или драгинг и ставим точку или рисуем линию
						
				
						if (clickDrag[i] /*&& i*/) {		
							contexts.drawing.moveTo(clickX[i - 1], clickY[i - 1]);
						} else {
						
							contexts.drawing.moveTo(clickX[i] - 1, clickY[i]);
						}
						
						contexts.drawing.lineTo(clickX[i], clickY[i]);

						// белый цвет для резинки
						if (curTool === "eraser") {
							contexts.drawing.strokeStyle = 'white';
						} else {
							contexts.drawing.strokeStyle = "rgb(" + clickColor[i].r + ", " + clickColor[i].g + ", " + clickColor[i].b + ")";
						}

						contexts.drawing.lineCap = "round";
						contexts.drawing.lineJoin = "round";
						contexts.drawing.lineWidth = radius;
						contexts.drawing.stroke();
						contexts.drawing.closePath();
					}

					clearClick();
				}
			

			// убирает ТЕКСТУРу КАРАНДАША
	
				contexts.texture.canvas.style.display = "none";
			}	
		},
		matchOutlineColor = function (r, g, b, a) {

			return (r + g + b < 100 && a === 255);
		},

		matchStartColor = function (pixelPos, startR, startG, startB) {

			var r = outlineLayerData.data[pixelPos],
				g = outlineLayerData.data[pixelPos + 1],
				b = outlineLayerData.data[pixelPos + 2],
				a = outlineLayerData.data[pixelPos + 3];


			if (matchOutlineColor(r, g, b, a)) {
				return false;
			}

			r = colorLayerData.data[pixelPos];
			g = colorLayerData.data[pixelPos + 1];
			b = colorLayerData.data[pixelPos + 2];


			if (r === startR && g === startG && b === startB) {
				return true;
			}


			if (r === curColor.r && g === curColor.g && b === curColor.b) {
				return false;
			}


			return (Math.abs(r - startR) + Math.abs(g - startG) + Math.abs(b - startB) < 255);
		},

		colorPixel = function (pixelPos, r, g, b, a) {

			colorLayerData.data[pixelPos] = r;
			colorLayerData.data[pixelPos + 1] = g;
			colorLayerData.data[pixelPos + 2] = b;
			colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
		},

		floodFill = function (startX, startY, startR, startG, startB) {

			var newPos,
				x,
				y,
				pixelPos,
				reachLeft,
				reachRight,
				drawingBoundLeft = 0,
				drawingBoundTop = 0,
				drawingBoundRight = drawingAreaWidth - 1,
				drawingBoundBottom = drawingAreaHeight - 1,
				pixelStack = [[startX, startY]];

			while (pixelStack.length) {

				newPos = pixelStack.pop();
				x = newPos[0];
				y = newPos[1];


				pixelPos = (y * drawingAreaWidth + x) * 4;


				while (y >= drawingBoundTop && matchStartColor(pixelPos, startR, startG, startB)) {
					y -= 1;
					pixelPos -= drawingAreaWidth * 4;
				}

				pixelPos += drawingAreaWidth * 4;
				y += 1;
				reachLeft = false;
				reachRight = false;


				while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB)) {
					y += 1;

					colorPixel(pixelPos, curColor.r, curColor.g, curColor.b);

					if (x > drawingBoundLeft) {
						if (matchStartColor(pixelPos - 4, startR, startG, startB)) {
							if (!reachLeft) {

								pixelStack.push([x - 1, y]);
								reachLeft = true;
							}
						} else if (reachLeft) {
							reachLeft = false;
						}
					}

					if (x < drawingBoundRight) {
						if (matchStartColor(pixelPos + 4, startR, startG, startB)) {
							if (!reachRight) {

								pixelStack.push([x + 1, y]);
								reachRight = true;
							}
						} else if (reachRight) {
							reachRight = false;
						}
					}

					pixelPos += drawingAreaWidth * 4;
				}
			}
		},




		paintAt = function (startX, startY) {

			var pixelPos = (startY * drawingAreaWidth + startX) * 4,
				r = colorLayerData.data[pixelPos],
				g = colorLayerData.data[pixelPos + 1],
				b = colorLayerData.data[pixelPos + 2],
				a = colorLayerData.data[pixelPos + 3];

			if (r === curColor.r && g === curColor.g && b === curColor.b) {

				return;
			}

			if (matchOutlineColor(r, g, b, a)) {

				return;
			}

			floodFill(startX, startY, r, g, b);

			redraw();
		},

		

		// Добавляем отслеживание событий на канвас
		createUserEvents = function () {

			var press = function (e) {

				// чекаем где кликнули
				var sizeHotspotStartX,
					mouseX = e.pageX - this.offsetLeft,
					mouseY = e.pageY - this.offsetTop;
					
					//если клик перед началом зоны рисования, то мы пытаемся выбрать цвет

				if (mouseX < drawingAreaX) { 
					if (mouseX > mediumStartX) {
						if (mouseY > mediumStartY && mouseY < mediumStartY + mediumImageHeight) {
							curColor = colorPurple;
						} else if (mouseY > mediumStartY + mediumImageHeight && mouseY < mediumStartY + mediumImageHeight * 2) {
							curColor = colorGreen;
						} else if (mouseY > mediumStartY + mediumImageHeight * 2 && mouseY < mediumStartY + mediumImageHeight * 3) {
							curColor = colorYellow;
						} else if (mouseY > mediumStartY + mediumImageHeight * 3 && mouseY < mediumStartY + mediumImageHeight * 4) {
							curColor = colorBlue;
						}
					}
				} 
				//если клик после конца зоны рисования, то мы пытаемся выбрать инструмент

				else if (mouseX > drawingAreaX + drawingAreaWidth) { 
					
					
					if (mouseY > toolHotspotStartY) {
						if (mouseY > sizeHotspotStartY) {
							sizeHotspotStartX = drawingAreaX + drawingAreaWidth;

								//расставляем координаты для реагирования на изменение размера
							if (mouseY < sizeHotspotStartY + sizeHotspotHeight && mouseX > sizeHotspotStartX) {
								
								
								if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.huge) {
									
									curSize = "huge";
								} else if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge) {
									
									curSize = "large";
								} else if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge) {
									
									curSize = "normal";
								} else if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.small + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge) {
									
									curSize = "small";
								}
							}
						} 
						//расставляем координаты для реагирования на изменение инструмента
						else {
							
							console.log(mouseY);
							console.log(toolHotspotStartY);
							console.log(toolHotspotHeight);			

							if (mouseY < toolHotspotStartY + toolHotspotHeight * 2) {
								curTool = "marker";
						
							} else if (mouseY < toolHotspotStartY + toolHotspotHeight * 3+10) {
								curTool = "eraser";
							} else if (mouseY < toolHotspotStartY + toolHotspotHeight * 4) {

								if (curTool !== "bucket") {
									curTool = "bucket";
									colorLayerData = contexts.drawing.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
								}
							}
						}
					}
				}
			},
				//отслеживание перемещения мыши по холсту
				drag = function (e) {
					if (curTool !== "bucket") {
						if (paint) {
							addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
							redraw();
						}
					}

					e.preventDefault();
				},

				release = function () {
					if (curTool !== "bucket") {
						paint = false;
					}
					redraw();
				},

				cancel = function () {
					if (curTool !== "bucket") {
						paint = false;
					}
				},

				pressDrawing = function (e) {


					var mouseX = e.pageX - this.offsetLeft,
						mouseY = e.pageY - this.offsetTop;

					if (curTool === "bucket") {

						paintAt(mouseX, mouseY);
					} else {
						paint = true;
						addClick(mouseX, mouseY, false);
					}

					redraw();
				},

				dragDrawing = function (e) {
					if (curTool !== "bucket") {
						if (paint) {
							addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
							redraw();
						}
					}


					e.preventDefault();
				},

				releaseDrawing = function () {
					if (curTool !== "bucket") {
						paint = false;
						redraw();
					}
				},

				cancelDrawing = function () {
					if (curTool === "bucket") {
						paint = false;
					}
				};

			
			context.canvas.addEventListener("mousedown", press, false);
			context.canvas.addEventListener("mousemove", drag, false);
			context.canvas.addEventListener("mouseup", release);

			context.canvas.addEventListener("touchstart", press, false);
			context.canvas.addEventListener("touchmove", drag, false);
			context.canvas.addEventListener("touchend", release, false);
	
			contexts.outline.canvas.addEventListener("mousedown", pressDrawing, false);
			contexts.outline.canvas.addEventListener("mousemove", dragDrawing, false);
			contexts.outline.canvas.addEventListener("mouseup", releaseDrawing);
			contexts.outline.canvas.addEventListener("mouseout", cancelDrawing, false);

			contexts.outline.canvas.addEventListener("touchstart", pressDrawing, false);
			contexts.outline.canvas.addEventListener("touchmove", dragDrawing, false);
			contexts.outline.canvas.addEventListener("touchend", releaseDrawing, false);
			contexts.outline.canvas.addEventListener("touchcancel", cancelDrawing, false);
		},

		resourceLoaded = function () {

			curLoadResNum += 1;
			if (curLoadResNum === totalLoadResources) {
				redraw();
				createUserEvents();
			}
		},

		init = function (width, height) {

			var canvasElement;
			if (width && height) {
				canvasWidth = width;
				canvasHeight = height;
			}

			canvasElement = document.createElement('canvas');
			canvasElement.setAttribute('width', canvasWidth);
			canvasElement.setAttribute('height', canvasHeight);
			canvasElement.setAttribute('id', 'gui');
			document.getElementById('canvasDiv').appendChild(canvasElement);
			if (typeof G_vmlCanvasManager !== "undefined") {
				canvasElement = G_vmlCanvasManager.initElement(canvasElement);
			}
			context = canvasElement.getContext("2d"); // Grab the 2d canvas context
			
			canvasElement = document.createElement('canvas');
			canvasElement.setAttribute('width', drawingAreaWidth);
			canvasElement.setAttribute('height', drawingAreaHeight);
			canvasElement.setAttribute('id', 'drawing');
			canvasElement.style.marginLeft = drawingAreaX + "px";
			canvasElement.style.marginTop = drawingAreaY + "px";
			document.getElementById('canvasDiv').appendChild(canvasElement);
			if (typeof G_vmlCanvasManager !== "undefined") {
				canvasElement = G_vmlCanvasManager.initElement(canvasElement);
			}
			contexts.drawing = canvasElement.getContext("2d"); // Grab the 2d canvas context

			canvasElement = document.createElement('canvas');
			canvasElement.setAttribute('width', drawingAreaWidth);
			canvasElement.setAttribute('height', drawingAreaHeight);
			canvasElement.setAttribute('id', 'outline');
			canvasElement.style.marginLeft = drawingAreaX + "px";
			canvasElement.style.marginTop = drawingAreaY + "px";
			document.getElementById('canvasDiv').appendChild(canvasElement);
			if (typeof G_vmlCanvasManager !== "undefined") {
				canvasElement = G_vmlCanvasManager.initElement(canvasElement);
			}
			contexts.texture = canvasElement.getContext("2d"); // Grab the 2d canvas context

			canvasElement = document.createElement('canvas');
			canvasElement.setAttribute('width', drawingAreaWidth);
			canvasElement.setAttribute('height', drawingAreaHeight);
			canvasElement.setAttribute('id', 'outline');
			canvasElement.style.marginLeft = drawingAreaX + "px";
			canvasElement.style.marginTop = drawingAreaY + "px";
			document.getElementById('canvasDiv').appendChild(canvasElement);
			if (typeof G_vmlCanvasManager !== "undefined") {
				canvasElement = G_vmlCanvasManager.initElement(canvasElement);
			}
			contexts.outline = canvasElement.getContext("2d"); // Grab the 2d canvas context
			
			
			crayonImage.onload = resourceLoaded;
			crayonImage.src = "images/crayon-outline.png";

			markerImage.onload = resourceLoaded;
			markerImage.src = "images/marker-outline.png";

			eraserImage.onload = resourceLoaded;
			eraserImage.src = "images/eraser-outline.png";

			crayonBackgroundImage.onload = resourceLoaded;
			crayonBackgroundImage.src = "images/crayon-background.png";

			markerBackgroundImage.onload = resourceLoaded;
			markerBackgroundImage.src = "images/marker-background.png";
			bucketBackgroundImage.onload = resourceLoaded;
			bucketBackgroundImage.src = "images/bucket-background.png";
			eraserBackgroundImage.onload = resourceLoaded;
			eraserBackgroundImage.src = "images/eraser-background.png";

			

			crayonTextureImage.onload = function () {
				contexts.texture.drawImage(crayonTextureImage, 0, 0, drawingAreaWidth, drawingAreaHeight);
				resourceLoaded();
			};
			crayonTextureImage.src = "images/crayon-texture.png";

			swatchImage.onload = resourceLoaded;
			swatchImage.src = "images/paint-outline.png";

			outlineImage.onload = function () {

				contexts.outline.drawImage(outlineImage, 0, 0, drawingAreaWidth, drawingAreaHeight);

				try {
					outlineLayerData = contexts.outline.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
					colorLayerData = contexts.drawing.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
				} catch (ex) {

				}
				resourceLoaded();
			};
			outlineImage.src = "images/canvas1.png";
		};

	return {
		init: init
	};
}());
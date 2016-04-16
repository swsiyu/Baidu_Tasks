/*
wf:1.0.0 edit by liutong;
对外提供一个对象wf,wf上有两个函数waterfall和load，由于时间原因load没有实现;
*/

var wf = (function() {
	var _wf_ = {};
	//单例模式 
	function overLayer(id) {
		var x = document.body.getElementsByClassName("overLayer")[0];
		if (x) {
			x.style.display = "block";
			return x
		};
		var y = document.createElement("div");
		y.className = "overLayer";
		y.style.height = window.document.body.scrollHeight + "px";
		y.style.width = window.getComputedStyle(document.body).width;
		y.style.background = "rgba(153,153,153,0.8)";
		y.style.overflow = "hidden";
		y.style.position = "absolute";
		y.style.left = "0";
		y.style.top = "0";
		y.style.zIndex = "998";
		y.addEventListener("click", function() {
			this.style.display = "none";
		})
		document.body.appendChild(y);
		return y;
	}
	waterfall.prototype.targetEvent = function(array, adjust) {
		var _this = this;
		for (var i = 0; i < array.length; i++) {
			array[i].addEventListener('click', function(e) {
				console.log(e.target.src);
				var layer = overLayer(_this.id);
				layer.innerHTML = '';
				var ele = document.createElement("img");
				ele.style.position = "fixed";
				ele.style.border = "5px solid #fff";
				ele.style.boxShadow = "0 0 10px #000";
				ele.style.webkitBoxShadow = "0 0 10px #000";
				ele.src = e.target.src;
				ele.className = "img";
				layer.appendChild(ele);
				var top = eval(parseInt(window.outerHeight - 50) / 2 - parseInt(layer.getElementsByTagName("img")[0].naturalHeight) / 2);
				if (top > 0) {
					ele.style.left = eval(parseInt(window.getComputedStyle(layer).width) / 2 - parseInt(layer.getElementsByTagName("img")[0].naturalWidth) / 2) + "px";
					ele.style.top = top + "px";
				} else {
					ele.style.height = parseInt(window.outerHeight - adjust * 2) + "px";
					ele.style.top = eval(parseInt(window.outerHeight - 50) / 2 - parseInt(layer.getElementsByTagName("img")[0].height) / 2) + "px";
					ele.style.left = eval(parseInt(window.getComputedStyle(layer).width) / 2 - parseInt(layer.getElementsByTagName("img")[0].width) / 2) + "px";
				}
				ele.addEventListener("click", function(e) {
					e.stopPropagation();
				});

			});
		}
	}
	waterfall.prototype.cutWidth = function(id, tag, count, gap) {
		var width = 0;
		var container = id;
		for (var i = 0; i < container.childNodes.length; i++) {
			if (container.childNodes[i].tagName == "LI") {
				if (container.childNodes[i].childNodes[0].tagName == tag) {
					this.targetElems.push(container.childNodes[i].childNodes[0]);
					var height = container.childNodes[i].childNodes[0].height;
					width = eval((parseInt(window.getComputedStyle(container).width) - (count - 1) * gap) / count);
					container.childNodes[i].childNodes[0].style.width = width + "px";
					container.childNodes[i].childNodes[0].height = height;
				}
			}
		}
		return width;
	}

	waterfall.prototype.getShortCol = function(column) {
		var short = Math.min.apply(null, column);
		for (var i = 0; i < column.length; i++) {
			if (short == column[i])
				return i;
		};
	}

	waterfall.prototype.init = function() {
		var _this = this;
		var colHeight = [];
		for (var i = 0; i < _this.columnCount; i++) {
			colHeight[i] = 0;
		}
		var arrayNodes = [];
		for (var i = 0; i < _this.elements.length; i++) {
			arrayNodes[i] = _this.elements[i];
			arrayNodes[i].het = arrayNodes[i].offsetHeight + parseInt(window.getComputedStyle(arrayNodes[i]).marginBottom);
		}

		for (var i = 0; i < arrayNodes.length; i++) {
			var shortPos = _this.getShortCol(colHeight);
			arrayNodes[i].style.left = shortPos * _this.columnWidth + _this.columnGap * shortPos + "px";
			arrayNodes[i].style.top = colHeight[shortPos] + "px";
			colHeight[shortPos] += arrayNodes[i].het;
		}
		_this.id.style.height = Math.max.apply(null, colHeight) + "px";
	}

	function waterfall(obj, option) {
		this.id = document.getElementById(obj.id) != undefined ? document.getElementById(obj.id) : document.getElementsByTagName('body')[0];
		this.elements = obj.elements && obj.elements != '' ? this.id.getElementsByClassName(obj.elements) : this.id.childNodes;
		this.columnGap = obj.columnGap || 20;
		this.columnCount = obj.columnCount || 4;
		this.targetElems = [];
		this.columnWidth = this.cutWidth(this.id, "IMG", this.columnCount, this.columnGap);
		this.init();
		this.targetEvent(this.targetElems, 100);
		return this;
	}

	function load(url, imgCount) {
		// TODO
		return;
	}
	_wf_ = {
		"waterfall": waterfall,
		"load": load
	};

	return _wf_;

}());
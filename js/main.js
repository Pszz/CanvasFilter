/*
 * Date:2015-08-25 18:46:41
 * LastUpdate : 2017-02-24 13:18:01
 * Author:pszz
 */


function $(s){
	return typeof s == "string" ? document.getElementById(s) : s;
};
//on事件
$.on = function(element, type, handler){    
    if(element.addEventListener) {    
       element.addEventListener(type, handler, false);    
    } else {    
       element.attachEvent('on'+ type, handler); // for IE6,7,8  
    }    
}; 
//return ie version
$.msie = function(){
	var browser=navigator.appName 
	var b_version=navigator.appVersion 
	var version=b_version.split(";"); 
	var trim_Version=version[1].replace(/[ ]/g,""); 
	if(browser == "Microsoft Internet Explorer"){
		if(trim_Version=="MSIE6.0"){
			return 6;
		}else if(trim_Version=="MSIE7.0"){
			return 7;
		}else if(trim_Version=="MSIE8.0"){
			return 8;
		}else if(trim_Version=="MSIE9.0"){
			return 9;
		}else{
			//default 10.0
			return 10;			
		}
	}
	return false;
}();
//set init Image 
$("reqImage").innerHTML='<img id="img" src="1.jpg?t'+ new Date().getTime() +'"/>';
$("pullSource").innerHTML='<img src="1.jpg?t'+ new Date().getTime() +'"/>';
//原图返回成功之后。
$.on($("img"),"load",function(){
	$.filter.init(this,$("pullSource"));
});
$.on($("reset"),"click",function(){
	$.filter.init($("img"),$("pullSource"));
});
//上传参数
$.on($("file"),"change",function(){	
		var img = $("img");
		if ($.msie) {//判断是否是IE
			//IE下，使用滤镜
			this.select();
			var imgSrc = document.selection.createRange().text;
			var localImagId = document.createElement("div");
			//var localImagId = document.getElementById("localImag");
			//必须设置初始大小
			localImagId.style.width = "1920px";
			localImagId.style.height = "592px";
			//图片异常的捕捉，防止用户修改后缀来伪造图片
			try {
				localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
				localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
			} catch (e) {
				img.src = this.value;
				return false;
			}
			document.selection.empty();
		} else {
			try {
				img.src = this.files[0].getAsDataURL();
			} catch (e) {
				//火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式 
				img.src = window.URL.createObjectURL(this.files[0]);
			}
		}
});

//负片
$.on($("inver"),"click",function(){
	$.filter("inver");		
});
//灰色调
$.on($("adjust"),"click",function(){
	 $.filter("gray");	
});
//模糊
$.on($("blur"),"click",function(){
	 $.filter("blur");
});
//浮雕
$.on($("relief"),"click",function(){
	 $.filter("relief");
});
//黑白
$.on($("heibai"),"click",function(){
	 $.filter("baw");
});
//镜像
$.on($("mirror"),"click",function(){
	 $.filter("mirror");
});
//loading...
$.loading = function(){
	if($.loading.dom){
		$.loading.dom.style.display = "block";
	}else{
		var div = document.createElement("div");
			div.className = "mask";
			div.innerHTML = [
				'<div class="spinner">',
					'<div class="cube1">Image</div>',
					'<div class="cube2">Canvas</div>',
				'</div>'
			].join("");
		$.loading.dom = div;
		document.body.appendChild(div);
	}
};
$.loading.remove = function(){
	if($.loading.dom){
		$.loading.dom.style.display = "none";
	}
};
//滤镜效果
$.filter = function(){
	//滤镜算法集
	var filters = {
		//Canvas object
		data : null,
		//负片-反色
		inver : function(context,data, c){			
			var dd = data.data
			   ,len = c.height * c.width * 4;
			for(var i = 0; i < len; i+=4){
				var r = dd[i];
				var g = dd[i + 1];
				var b = dd[i + 2];

				dd[i] = 255 - r;
				dd[i + 1] = 255 - g;
				dd[i + 2] = 255 - b;
			}
			
		},
		//灰色调
		gray : function(context,data, c){
			var dd = data.data
			   ,len = c.height * c.width * 4;
			for(var i = 0; i< len; i += 4){
				var r = dd[i]
				,g = dd[i + 1]
				,b = dd[i + 2];				
				//--算法一
				var cl = (0.299 * r) + (0.587 * g)  + (0.114 * b);
				//--算法二(ps内置算法)
				//var cl = Math.pow((Math.pow(r,2.2) * 0.2973 + Math.pow(g,2.2) * 0.6274 + Math.pow(b,2.2) * 0.0753),(1/2.2));
				dd[i] = dd[i+1] = dd[i+2] = cl;
			}
			
		},
		//模糊
		blur : function(context, data){
			var temp = this.copyLayer(context, data);
			var red = 0.0, green = 0.0, blue = 0.0;
			for(var x = 0; x < temp.width; x++){
				for(var y = 0; y < temp.height; y++){
					
					var idx = (x + y * temp.width) * 4;
					for(var subCol = -2; subCol <= 2; subCol++){
						var colOff = subCol + x;
						if(colOff < 0 || colOff >= temp.width){
							colOff = 0;						
						}
						for(var subRow = -2; subRow <= 2; subRow++){
							var rowOff = subRow + y;
							if(rowOff < 0 || rowOff >= temp.height){
								rowOff = 0;							
							}
							var idx2 = (colOff + rowOff * temp.width) * 4;
							var r = temp.data[idx2 + 0];
							var g = temp.data[idx2 + 1];
							var b = temp.data[idx2 + 2];
							red += r;
							green += g;
							blue += b;
						}
					}

					data.data[idx + 0] = red / 25.0;//红色通道
					data.data[idx + 1] = green / 25.0;//绿色通道
					data.data[idx + 2] = blue / 25.0; //蓝色通道
					data.data[idx + 3] = 255; //透明度通道
					red = green = blue = 0;
					
				}
			}
		},
		//浮雕
		relief : function(context, data){
			var temp = this.copyLayer(context, data);
			var h = temp.height,w = temp.width;
			for(var x = 1; x < temp.width - 1 ; x++){
				for(var y = 1; y < temp.height -1; y++){
					var idx = (x + y * temp.width) * 4;
					var bidx = ((x - 1) + y * temp.width) * 4;
					var aidx = ((x + 1) + y * temp.width) * 4;
					
					var nr = temp.data[aidx + 0] - temp.data[bidx + 0] + 128;
					var ng = temp.data[aidx + 1] - temp.data[bidx + 1] + 128;
					var nb = temp.data[aidx + 2] - temp.data[bidx + 2] + 128;
					nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr);
					ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng);
					nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb);
					
					data.data[idx + 0] = nr;
					data.data[idx + 1] = ng;
					data.data[idx + 2] = nb;
					data.data[idx + 3] = 255;
				}
			}
		},
		//雕刻
		diaoke : function(context, data){
			var temp = this.copyLayer(context, data);
			var h = temp.height,w = temp.width;
			for(var x = 1; x < temp.width - 1 ; x++){
				for(var y = 1; y < temp.height -1; y++){
					var idx = (x + y * temp.width) * 4;
					var bidx = ((x - 1) + y * temp.width) * 4;
					var aidx = ((x + 1) + y * temp.width) * 4;
					
					var nr = temp.data[bidx + 0] - temp.data[aidx + 0] + 128;
					var ng = temp.data[bidx + 1] - temp.data[aidx + 1] + 128;
					var nb = temp.data[bidx + 2] - temp.data[aidx + 2] + 128;
					nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr);
					ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng);
					nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb);
					
					data.data[idx + 0] = nr;
					data.data[idx + 1] = ng;
					data.data[idx + 2] = nb;
					data.data[idx + 3] = 255;
				}
			}
			
		},
		//镜像
		mirror : function(context, data){
			var temp = this.copyLayer(context,data);
			for(var x = 0; x < temp.width; x++){
				for(var y = 0; y < temp.height; y++){
					var idx = (x + y * temp.width) * 4;
					var midx = (((temp.width - 1) - x) + y * temp.width) * 4;
					
					data.data[midx + 0] = temp.data[idx + 0];
					data.data[midx + 1] = temp.data[idx + 1];
					data.data[midx + 2] = temp.data[idx + 2];
					data.data[midx + 3] = 255;
					
				}
				
			}
			
		},
		//黑白
		baw : function(context , data){
				var temp = this.copyLayer(context,data);
				var color = 0;
				for(var x = 0; x < temp.width; x++){
					for(var y = 0; y < temp.height; y++){
						var idx = (x + y * temp.width) * 4;
						var nr = temp.data[idx + 0];
						var ng = temp.data[idx + 1];
						var nb = temp.data[idx + 2];
						
						var avg = (nr + ng + nb) / 3;
						if(avg >= 128){
							color = 255;
						}else{
							color = 0;						
						}
					
						data.data[idx + 0] = color;
						data.data[idx + 1] = color;
						data.data[idx + 2] = color;
						data.data[idx + 3] = 255;
					}
					
				}
		},
		//复制图层
		copyLayer : function(context, src){  
			var img = context.createImageData(src.width, src.height);
			img.data.set(src.data);
			return img;  
		}
	};
	//filterName：滤镜名称
	function entry(filterName){
		var canvas = filters.data;
		if($.msie &&  $.msie< 10){
			alert("Update your browser,Please.\n Think You.");
			return false;
		}
		if(canvas == null){
			alert("wait for loading image");
			return false;
		}
			$.loading();
			context = canvas.getContext("2d");
			//获取Canvas图像数据
			canvasData = context.getImageData(0,0,canvas.width,canvas.height);			
			//处理图像
			filters[filterName] && filters[filterName](context,canvasData,canvas);
			//将数据重新给画布			
			setTimeout(function(){
				context.putImageData(canvasData,0,0);
				$.loading.remove();
			},500);
	}
	//初始化画布[img:需要滤镜的源图，存放canvas的父层]
	entry.init = function(img,canvasBox){
		$.loading();
		var c = document.createElement("canvas"),
			context = c.getContext("2d");
			if(!c.getContext){
				alert("浏览器不支持Canvas");
				return ;
			}
		 	c.width = img.clientWidth;  
			c.height = img.clientHeight; 	
			//初始化绘制到canvas
			context.drawImage(img,0,0,c.width,c.height);
			//save canvas object to filter
			filters.data = c;
			setTimeout(function(){
				canvasBox.innerHTML = "";
				canvasBox.appendChild(c);
				$.loading.remove();
			},500);
			
	}
	return entry;
}();
var myHeaders = new Headers();
	myHeaders.append("Secret-Key", "$2b$10$XnRQ8lXD0phXmFoYQp5.VOBeiO3TmKBs8hfmZ2Uw04Ju3rpP/Bi6i");
	myHeaders.append("Cookie", "__cfduid=d5267e5e8d4f6957a965a4cb6b70f7d941616783282");

	var requestOptions = {
	  method: 'GET',
	  headers: myHeaders,
	  redirect: 'follow'
	};

	// fetch data from the API
	fetch("https://api.jsonbin.io/b/5ff7e18809f7c73f1b6f05e3/2", requestOptions)
	  .then(response => response.text())
	  .then(result => {
	  	//debugger;
			res = JSON.parse(result);
			filteredRes = res;
			filter = false;
			// initializes all the values on page load
			function init(){
				var check = (6 < filteredRes.length == true) ? 6 : filteredRes.length;
				for (var i = 0 ; i < check ; i++){  //load the initial 6 cars on page1
					document.getElementsByClassName("header"+(i+1))[0].innerText = filteredRes[i].Name;
					document.getElementsByClassName("carImages"+(i+1))[0].src = filteredRes[i].Image;
				}
				if (check < 6){  // load blank divs if res count is lesser than 6
					for (var i = check ; i < 6 ; i++){
						document.getElementsByClassName("header"+(i+1))[0].innerText = "";
						document.getElementsByClassName("carImages"+(i+1))[0].src = "";
					}	
				}
				//load price values of all cars
				var minRate = res[0].Rate;
				var maxRate = res[0].Rate;
				for (let i = 1 ; i < res.length ; i++){
					if (res[i].Rate > maxRate){
						maxRate = res[i].Rate;
					}
					if (res[i].Rate < minRate){
						minRate = res[i].Rate;
					}
				}
				maxRate = minRate+50
				
				document.getElementById("minPrice").innerText = "$" + minRate + "/day";
				document.getElementById("maxPrice").innerText = "$" + maxRate + "/day";
				var len = filteredRes.length;
				document.getElementsByClassName("carsCount")[0].innerText = len;
				var updatedLen = len-6;    // 6 cars have been displayed already, rest are to be displayed on separate pages
				var pageCount = len%6 == 0 ? len/6 : parseInt(len/6) + 1;

				var node = document.createElement('div');
				node.setAttribute("id", "pagesCount");
				document.getElementById("pagination").appendChild(node);
				// create the page number divs at runtime
				for (let i = 0 ; i < pageCount ; i++){
					//debugger;
					node = document.createElement('span');
					node.setAttribute("id", "page"+(i+1));
					node.setAttribute("class", "pageNumbers");
					node.setAttribute("style", "padding: 4px; border: 1px solid gainsboro;");
					var textnode = document.createTextNode(i+1);         // Create a text node
					node.appendChild(textnode);
					document.getElementById("pagesCount").appendChild(node);
				}
				document.getElementById("page1").style.background = "#0c74f6";
			}
			init();
			var elements = document.getElementsByClassName("pageNumbers");
			for (let i = 0 ; i < elements.length ; i++){
				elements[i].addEventListener("click",function(){  //onclick of page numbers at the bottom, this will be invoked
					//debugger;
					for (let j = 0 ; j < elements.length ; j++){
						document.getElementsByClassName("pageNumbers")[j].setAttribute("style", "padding: 4px; background-color: white");
					}
					this.setAttribute("style", "padding: 4px; background-color: #0c74f6;");
					var len = filteredRes.length;
					document.getElementsByClassName("carsCount")[0].innerText = len;  // update the available count at the top
					let val = parseInt(this.innerText);
					
					let rangeMax = 6*val;
					let rangeMin = 6*(val-1);
					if (filter && filter == true){
						rangeMax = 6;
						rangeMin = 0;

					}
					// replace the content of the cars onchange of the page number
					let count = 1;
					let counter = (rangeMax < filteredRes.length == true) ? rangeMax : filteredRes.length
					for (let x = rangeMin ; x < counter ; x++){
						document.getElementsByClassName("header"+count)[0].innerText = filteredRes[x].Name;
						document.getElementsByClassName("carImages"+count)[0].src = filteredRes[x].Image;
						document.getElementsByClassName("priceValue"+count)[0].innerText = "$"+filteredRes[x].Rate;
						count++;
					}
				})
				
			}
			//This will be invoked on apply filter button click
			document.getElementsByClassName("applyFilterSpan")[0].addEventListener("click", function(){
				//debugger;
				filteredRes = [];
				var inputSliderMin = parseInt(document.getElementById("minPrice").innerText.split("/")[0].substring(1))
				var inputSliderMax = parseInt(document.getElementsByClassName("sliderInput")[0].value) + inputSliderMin;
				var gearType = document.getElementsByClassName("selectGear")[0].value;
				var fuelType = document.getElementsByClassName("selectFuel")[0].value;
				filter = true;
				// if geartype and fueltype are not selected
				if (gearType.trim() == "gearbox" && fuelType.trim() == "fuelbox"){
					for(var i = 0 ; i < res.length ; i++){
						if (res[i].Rate > inputSliderMin && res[i].Rate < inputSliderMax){
							filteredRes.push(res[i])
						}
					}
				}
				// if geartype is not selected
				else if (gearType.trim() == "gearbox"){
					for(var i = 0 ; i < res.length ; i++){
						if (res[i].Fuel_type.toLowerCase() == fuelType.toLowerCase() && res[i].Rate > inputSliderMin && res[i].Rate < inputSliderMax){
							filteredRes.push(res[i])
						}
					}
				}
				// if fueltype are not selected
				else if (fuelType.trim() == "fuelbox"){
					for(var i = 0 ; i < res.length ; i++){
						if (res[i].Gearbox_type.toLowerCase() == gearType.toLowerCase() && res[i].Rate > inputSliderMin && res[i].Rate < inputSliderMax){
							filteredRes.push(res[i])
						}
					}
				}
				// if both geartype and fueltype are set
				else{
					for(var i = 0 ; i < res.length ; i++){
						if (res[i].Gearbox_type.toLowerCase() == gearType.toLowerCase() && res[i].Fuel_type.toLowerCase() == fuelType.toLowerCase() && res[i].Rate > inputSliderMin && res[i].Rate < inputSliderMax){
							filteredRes.push(res[i])
						}
					}
				}
				init();
				document.getElementById('page1').click()
				//document.getElementById("page1").trigger("click");
			})
			

		})
	  .catch(error => console.log('error', error));
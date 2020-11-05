$(function(){
	//to fix dropdown menu
	$("#navbartoggle").blur(function(event){

		var screenwidth=window.innerWidth;
		if(screenwidth<768){

			$("#collapsable-nav").collapse('hide');
		}
	});
	
	$("#navbartoggle").click(function(event){
		$(event.target).focus();
	});
});

(function(global){
var ds = {};
var homehtml = "snips/home_snip.html";
var allCategoriesUrl =
  "js/categories_data.json";
var categoriesTitleHtml = "snips/categories_title_snip.html";
var categoryHtml = "snips/categories_snip.html";


// function to insert innerHTML
var insertHTML = function(selector,html){
	var target = document.querySelector(selector);
	target.innerHTML = html;
};

// function to show loading icons 

var showloadingicons = function(selector){
	var html = "<div class='text-center'>";
	html+="<img src = 'images/img_load.gif'></div>";
	insertHTML(selector,html);
};


// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}


// on page load

document.addEventListener("DOMContentLoaded",function(event){

//on first laod show home view
showloadingicons("#main-content");
$ajaxUtils.sendGetRequest(homehtml, 
	function(responseText){
	document.querySelector("#main-content").innerHTML = responseText;
},
false);
});

// load menu categories view

ds.loadMenuCategories = function() {
	showloadingicons("#main-content");
	$ajaxUtils.sendGetRequest(allCategoriesUrl,buildAndShowCategoriesHTML);
};

// Builds HTML for the categories page based on the data
// from the server

function buildAndShowCategoriesHTML (categories) {
	// load category title snip
	$ajaxUtils.sendGetRequest(categoriesTitleHtml,
		function (categoriesTitleHtml) {
			//single category snip
			$ajaxUtils.sendGetRequest(categoryHtml,
				function(categoryHtml) {
					var categoriesViewhtml = 
					buildCategoriesViewHtml(categories,
						categoriesTitleHtml,
						categoryHtml);
					insertHTML("#main-content",categoriesViewhtml);
				},false);
		}, false);
}


// Using categories data and snippets html
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  console.log(finalHtml);
  return finalHtml;
}

global.$ds = ds;
})(window);
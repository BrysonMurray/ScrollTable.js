$(function ($) {

	// this is for future functionality 
	var setInitialWidth = function(propertyString, initialWidth) {
		var allWidthCount = propertyString.match(/width/g).length;			// counts all occurances of 'width'
		var otherWidthPropCount = propertyString.match(/-width/g).length;	// counts all occurances of '-width'
		if (allWidthCount == 0 || allWidthCount == otherWidthPropCount) {
			var regex = '/style="/';
			propertyString = propertyString.replace(regex, 'style="width: ' + initialWidth + '; ');
		}
		return propertyString;
	}

	$.fn.PrependHtml = function (newHtml) {
		this.html(newHtml + this.html());
		return this;
	}

	$.fn.AppendHtml = function (newHtml) {
		this.html(this.html() + newHtml);
		return this;
	}

	$.fn.outerHTML = function() {
		return $(this).clone().wrap('<p>').parent().html();
	};

	var GetAllAttributes = function(obj) {
		var element = $(obj);
		var attributeString = element.outerHTML().replace(element.html(), " ");
		//remove the first id attribute  ' id="test-id5"
		var regex1 = /\sid\s*=\s*"(\w*\d*-*)*"/;
		attributeString = attributeString.replace(regex1, " ");
		//remove all '>'
		attributeString = attributeString.replace(/>/g, " ");
		//remove all tags like '<div'
		attributeString = attributeString.replace(/<\S+/g, " ");
		attributeString = $.trim(attributeString);
		return attributeString;
	}

	var BuildScrollTable = function(origTable, settings) {
		//create headerTable
		var tableContainerId = origTable.attr("id") + '-ScrollTable-Container';
		var tableTitleId = origTable.attr("id") + '-ScrollTable-Title';
		var headerTableId = origTable.attr("id") + '-ScrollTable-Header';
		var bodyTableDivId = origTable.attr("id") + '-ScrollTableDiv';

		origTable.wrap('<div id="' + tableContainerId + '"></div>');
		var container = $('#' + tableContainerId);


		var tableTitleHeaderString = "";
		if (settings.title != null && $.trim(settings.title) != "") {
			tableTitleHeaderString = ('<div id="' + tableTitleId + '" class="scrollTableSectionHeader">' + settings.title + '</div>');
		}
		tableTitleHeaderString += '<table id="' + headerTableId + '" ' + GetAllAttributes(origTable) + '></table>';
		// append header table with id
		container.PrependHtml(tableTitleHeaderString);
		var headerTable = $('#' + headerTableId);

		origTable.wrap('<div id="' + bodyTableDivId + '" class="scrollTableBodyContainer table-responsive"></div>');
		var bodyTableDiv = $('#' + bodyTableDivId);

		//add ScrollTable classes to tables
		headerTable.addClass("scrollTableHeaders table table-striped table-hover table-responsive");
		$('#'+origTable.attr('id')).addClass("scrollTableBody table table-striped table-hover table-responsive");


		//add headers to the tables
		var origTableHeader = origTable.find("thead").outerHTML();
		headerTable.AppendHtml(origTableHeader);

		return container;
	};

	var SetupScrollTableClickEvents = function (obj, settings) {

		for (var columnNo in settings.clickableColumns) {
			$(obj).find("tr td:nth-child(" + (columnNo + 1) + ")").addClass("scrollTable-clickable");
		}
	
		if (settings.headerRowsClickable) {
			$(obj).find("thead tr").addClass("scrollTable-clickable");
		}
		
		if (settings.tableRowsClickable) {
			$(obj).find("tr").addClass("scrollTable-clickable");
		}

		$(".scrollTable-clickable").click(function (event) {
			event.stopPropagation();
			alert(event.currentTarget.textContent);
			window.document.location = $(this).data("href");
		});
	}

	var AlignTableHeaders = function(headerTableId, contentTableId) {
		var headerTableHeaders = headerTableId + " th";
		var contentTableHeaders = contentTableId + " th";
		var headerTableThs = $(headerTableHeaders);
		var contentTableThs = $(contentTableHeaders);
		$(headerTableThs).each(function (index) {
			//if (index < headerTableThs.length - 1) {  not sure why but firefox 2 needs the last item to be sized.
			if (index < headerTableThs.length) {  //	this might cause isues in chrome and other latest browsers we may need to 
												  //	size the last col first and then the rest of the columns to fix this if it causes an issue
				$(this).css("width", $($(contentTableThs).get(index)).css("width"));
			}
		});
	}
    
    	$.fn.DOSify = function() {
    		this.css( "color", "green" );
    		this.css( "backgroundColor", "black" );
    	};

    	$.fn.ScrollTable = function( options ) {

		    var settings = $.extend({
			    title: "",
			    headerColor: "black",
			    headerBacgroundColor: "white",
			    tableColor: "black",
			    tableAltColor: "black",
			    tableBacgroundColor: "white",
			    tableAltBacgroundColor: "grey",
			    alternateBackground: true,

			    // comming soon features
			    //useCustomColumnOrder: false,
			    //customColOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			    //clickableColumns: [], // columns need data-href property
			    //columns: [],
			    //headerRowsClickable: false,
			    //tableRowsClickable: true,//the data-href prop must be set fot this to work
			    //rowProperties: []
		    }, options);
    		
    		var scrollTable = BuildScrollTable(this, settings);

    		SetupScrollTableClickEvents(scrollTable, settings);

		    var headerTableId = '#' + this.attr("id") + '-ScrollTable-Header';
		    var origTableId = '#' + this.attr("id");

		    $(headerTableId + ' thead tr th').click(function (e) {
		    	var col = $(this).parent().children().index($(this));
			    var corespondingHeader = $(origTableId).find("thead tr th:nth-child(" + (col - 1) + ")");
		    	$(corespondingHeader).click();
		    });

		    AlignTableHeaders(headerTableId, origTableId);

    		return this;
    	};
}(jQuery));

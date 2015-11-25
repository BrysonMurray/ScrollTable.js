$(function ($) {

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
		if (element.html() !== undefined) {
			var attributeString = element.outerHTML().replace(element.html(), " ");
			//remove the first id attribute  ' id="test-id5"
			var regex1 = /\sid\s*=\s*"(\w*\d*-*)*"/;
			attributeString = attributeString.replace(regex1, " ");
			//var remove width this will be calculated later
			var regex2 = /\swidth\s*:\s*(\w*\d*-*)*%*;/;
			attributeString = attributeString.replace(regex2, " ");
			var regex3 = /"width\s*:\s*(\w*\d*-*)*%*;/;
			attributeString = attributeString.replace(regex3, "\"");
			//remove all '>'
			attributeString = attributeString.replace(/>/g, " ");
			//remove all tags like '<div'
			attributeString = attributeString.replace(/<\S+/g, " ");
			attributeString = $.trim(attributeString);
			return attributeString;
		}
		return "";
	}

	var BuildScrollTable = function(origTable, settings) {
		//create headerTable
		var tableContainerId = origTable.attr("id") + '-ScrollTable-Container';
		var tableTitleId = origTable.attr("id") + '-ScrollTable-Title';
		var headerTableId = origTable.attr("id") + '-ScrollTable-Header';
		var bodyTableDivId = origTable.attr("id") + '-ScrollTableDiv';

		origTable.wrap('<div id="' + tableContainerId + '" class="ScrollTable-Container" ></div>');
		var container = $('#' + tableContainerId);
		origTable = $('#' + origTable.attr('id'));


		var tableTitleHeaderString = "";
		if (settings.title != null && $.trim(settings.title) != "") {
			tableTitleHeaderString = ('<div id="' + tableTitleId + '" class="scrollTableSectionHeader">' + settings.title + '</div>');
		}
		tableTitleHeaderString += '<table id="' + headerTableId + '" ' + GetAllAttributes(origTable) + ' class="scrollTableHeaders" style" width: '+$(tableContainerId).css("width")+'; max-width: '+$(tableContainerId).css("width")+';"></table>';
		// append header table with id
		container.PrependHtml(tableTitleHeaderString);
		var headerTable = $('#' + headerTableId);
		$('#' + origTable.attr('id')).wrap('<div id="' + bodyTableDivId + '" style=" max-height: ' + settings.height + '; width: ' + ($('#' + origTable.attr('id')).width() - 2) + 'px  ;"class="scrollTableBodyContainer table-responsive"></div>');
		var bodyTableDiv = $('#' + bodyTableDivId);
		origTable = $('#' + origTable.attr('id'));

		//toScrollOrNotToScroll
		if (settings.height !== "auto" && $('#' + origTable.attr('id')).height() > $('#' + bodyTableDivId).height) {
			$('#' + bodyTableDivId).css('overflow-y','scroll');
		}

		//add ScrollTable classes to tables
		headerTable.addClass("scrollTableHeaders table table-striped table-hover table-responsive");

		

		$('#' + origTable.attr('id')).addClass("scrollTableBody table table-striped table-hover table-responsive");

		//add headers to the tables
		var origTableHeader = origTable.find("thead").outerHTML();

		headerTable.AppendHtml(origTableHeader);

		$(headerTable).find('th').first().addClass("firstTh");
		$(headerTable).find('th').last().addClass("lastTh");

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
		var contentTableHeaders = contentTableId + " tbody tr:first td";
		var headerTableThs = $(headerTableHeaders);
		var contentTableThs = $(contentTableHeaders);

		var indexOffset = 1;

		$(headerTableThs).each(function (index) {
			
			$(this).css("padding-left", $($(contentTableThs).get(index)).css("padding-left"));
			$(this).css("padding-right", $($(contentTableThs).get(index)).css("padding-right"));
			if (index < headerTableThs.length - indexOffset) {
				// this not is the last th
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
			    height: "auto",
			    fontSize: "9pt",
				padding: "2px 6px"

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

			// Apply Settings
			var bodyTableDivId = origTableId + '-ScrollTableDiv';

    		$(bodyTableDivId + " table tbody tr td").css('font-size', settings.fontSize);
    		$(bodyTableDivId + " table tbody tr td").css('padding', settings.padding);

		    
		    var origTableId = '#' + this.attr("id");
		    var tableContainerId = origTableId + '-ScrollTable-Container';
		    var headerTableId = '#' + this.attr("id") + '-ScrollTable-Header';
			
		    $(headerTableId).css("width", $(tableContainerId).css("width"));
		    $(headerTableId).css("max-width", $(tableContainerId).css("width"));

		    $(headerTableId + ' thead tr th').click(function (e) {
		    	var col = $(this).parent().children().index($(this));
			    var corespondingHeader = $(origTableId).find("thead tr th:nth-child(" + (col + 1) + ")");
		    	$(corespondingHeader).click();
		    });

		    $(origTableId).attr('style', 'border: 0px; border-spacing: 0 !important; ');
		    $(origTableId + ' thead').addClass('hiddenOrigTableHeader');
		    $(origTableId + ' thead tr').addClass('hiddenOrigTableHeader');
		    $(origTableId + ' td').css('padding-top', '2px');
		    $(origTableId + ' td').css('padding-bottom', '2px');

		    $(headerTableId + ' th').css('vertical-align', 'middle');
			
		    AlignTableHeaders(headerTableId, origTableId, true);
    		return this;
    	};
}(jQuery));

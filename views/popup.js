/*
The MIT License (MIT)

Copyright (c) 2014 Tobias Scholze

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* Constant values */
const googleServiceUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=';
const feedUrl = googleServiceUrl + encodeURIComponent('http://www.mobilegeeks.de/feed/');
const forumUrl = googleServiceUrl + encodeURIComponent('http://forum.mobilegeeks.de/external.php?type=RSS2');
const limit = 5;
const version = '0.2';

/* 
 * On document loaded, parse Feed.
 * - Set version number.
 * - Parse feed.
*/
$(document).ready(function() 
{
	document.getElementById("label-feed").addEventListener("click", onFeedNavClick); 
	document.getElementById("label-forum").addEventListener("click", onForumNavClick); 
	// E.g. Output: (v 0.1) 
	$('#version').html('(v' + version + ')');
	
	// Parse the feed.
	parseFeed(feedUrl, true);
	parseFeed(forumUrl, false);
});

/**
 * Raised on "Lates: News" click.
*/
function onFeedNavClick(e)
{
	if ($("#forum-entries").hasClass("hidden")) return;
	toggleContentViewVisibilities();
}

/**
 * Raised on "Lates: Community" click.
*/
function onForumNavClick(e)
{
	if ($("#feed-entries").hasClass("hidden")) return;
	toggleContentViewVisibilities();
}

/**
 * Just a helper to toggle some css classes.
*/
function toggleContentViewVisibilities()
{
	$("#feed-entries").toggleClass("hidden");
	$("#label-feed").toggleClass("nonactive-nav");
	$("#forum-entries").toggleClass("hidden");	
	$("#label-forum").toggleClass("nonactive-nav");
}

/*
 * Parses the feed and returns a callback to
 * format output as html dom elements.
*/
function parseFeed(url, isFeed)
{	
	$.ajax(
		{
			url: url,
			dataType: 'json',
			success: function(data)
			{
				/* Object structure:
				 *	1. data = http response
				 *	2. responseData = feed + javascript methods
				 *	3. feed = parsed feed (blog meta infos, entries, etc)
				 *	4. entries = blog entries
				*/
				return formatJsonToHtmlDomElements(data.responseData.feed.entries, isFeed);
			}
		}
	);
}

/*
 * Formats an entry object into a html dom element.
 * entries = json object list.
 * isFeed = true if it is the feed, false of not.
*/
function formatJsonToHtmlDomElements(entries, isFeed)
{	
	// Contains all generated elements.
	var list = '';
	
	// Apply limit.
	entries = entries.slice(0,5);
	
	// Iterate the array.
	entries.forEach(function(entry)
	{ 
		// Open tag.
		var element = '<li>';
		
		// Build title
		var date =  new Date(entry.publishedDate).toLocaleString();		
		var title = entry.author + ' - '+ date;
		
		// Link.
		var link = '<a href="'+ entry.link +'" target="_blank" title="'+title+'">'+ trim(entry.title, 75, " ...")+'</a>';
		element = element.concat(link);
		
		// Closing tag.
		element = element.concat('</li>');
		
		// Append to list.
		list = list.concat(element);
	});
	
	// Append to existing html dom.	
	if (isFeed)
	{
		$('#feed-entries').append(list);
	}
	else
	{
		$('#forum-entries').append(list);
	}
	
}

/**
* If text is longer as the given length, shorten the text
* and append the given postfix.
* Usecase: 'Hello world' -> 'Hello ...'
*/
function trim(text, length, postfix)
{
	if (text.length <= length)
	{
		return text;
	}
	else
	{
		/*
		 * 1. trim()		->	remove bad symbols
		 * 2. substring()	->	shortens the string
		 * 3. split()		-> 	converts a string in 
		 *						an array (words)
		 * 4. slice()		-> 	removes the last (incomplete)
		 *						word
		 * 5. join()		->	converts the array back to 
		 *						a string
		 * + postfix		->	appends the given postfix
		*/ 
		return $.trim(text)
				.substring(0,(length - postfix.length))
				.split(" ")
				.slice(0, -1)
				.join(" ") + postfix;
	}
}

/* 
 * Just a simple console logger.
*/
function log(msg)
{
	console.log(msg);
}
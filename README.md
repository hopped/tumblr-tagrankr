# Synopsis

## Name
TagRankr --- yet another simple tag cloud for tumblr blogs

## What do you need it for?

We started to append tags such as **#new zealand** to our tumblr
<a href="http://blog.boxofbirds.net">blog</a> posts in order to maintain some 
**level of categorisation**. However, the tumblr theme we used was missing that 
kind of information, and thus our "categories" weren't visible to the users. 
After some researching, I did not succeed in finding a simple extension in 
order to display our most used tags in the sidebar like a **category tree**. 
Hence, I wrote a small **JavaScript plugin** that retrieves all available tags 
of a given tumblr blog, and then sorts them into a **standard HTML list** --- 
tags are sorted either by frequency or alphabetically; each tag links to all 
relevant posts.

## What does it do?

The JavaScript plugin requests **up to 20 posts** (the limit will be increased 
in the next version of TagRankr) of a given tumblr blog using Tumblr's API. 
Then, the tags associated with these posts are extracted, **sorted**, and 
appended to a standard **HTML list**.

## What does it not do?

TagRankr just retrieves the basic information, i.e., the tag list. You are 
still in charge to do the **CSS styling** of the simple tag list on your own 
(e.g. adding pagination via another JavaScript extension such as 
[jQuery.flexipage](flexipage.vieron.net)) in order to adapt the list to your 
theme.


# Usage

## Prerequisites

  1. You'll need a [tumblr blog](www.tumblr.com), of course.
  2. You'll have to [register](http://www.tumblr.com/docs/en/api/v2) at tumblr 
  in order to retrieve a tumblr **API key**.


## Integration into a Tumblr theme


Access your theme's **HTML code** as follows:

  1. Tumblr Dashboard > Settings
  2. Theme > Customize
  3. Edit HTML

Verify, that the **jQuery library** is loaded. Search for the term 'jQuery'; 
you should find something like:

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>

If not, please include the following line into your head section:

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

In general, jQuery UI is not included in tumblr theme. Hence, ensure that it is also loaded:

    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>

Now, include **TagRankr** at some place within the head section. Example:

    <script src="http://code.boxofbirds.net/js/libs/tagrankr/tagrankr.min.js"></script>
 
Locate the end of your **sidebar** (or any other suitable section) by searching 
for the term

    {/block:IfNotHideSidebar}

From there, go up and locate a suitable location for your tag list, for example 
after pages, and insert the following div element:

    <div id="tagRankr"></div>

You may need to add some **CSS classes** to the block element. In case of the 
[Effector theme (http://tumblr.com/themes/by/pixelunion), these are:

    <div id="tagRankr" class="side-box ruled-top"></div>

When you're ready, scroll down to the bottom of your HTML, and insert the 
following **snippet**:

    <script>
        $(document).ready(function() {
            $('.tagRankr').tagRankr({
                blog     : '<INSERT_YOUR_BLOG_BASENAME>',
                api_key  : '<INSERT_YOUR_API_KEY>'
            });
        });
    </script>


Please do not forget to update your blog address and your tumblr API key in the 
snippet above.

Press **Update Preview** and then **Save**. Have a look at your tumblr blog, 
which should now be extended by a simple category list based upon your 
previously assigned tags.

For more configuration options, please refer to the section after next.

## Integration into a stand-alone page

In order to use **TagRankr**, download the plugin, unzip it and copy the files 
within the source folder to your website directory. Load the plugin in the head 
section of your HTML document; please make sure that you also include a current 
version of the jQuery library:

    <head>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
        <script src="tumblr.tagrankr.min.js"></script>
    </head>

Determine the position, where the tag list should appear on your site, and 
include the following block element:

    <div id="tagRankr"></div>

Initialise the script as follows at the end of your body:

    <script>
        $(document).ready(function() {
            $('.tagRankr').tagRankr({
                blog    : '<INSERT_YOUR_BLOG_BASENAME_HERE>',
                api_key : '<INSERT_YOUR_API_KEY_HERE>'
            });
        });
    </script>

## Advanced configuration

You may also pass some optional parameters to the function:

    <script>
        $(document).ready(function() {
            $('.tagRankr').tagRankr({
                blog     : '<INSERT_YOUR_BLOG_BASENAME>',
                api_key  : '<INSERT_YOUR_API_KEY>',
                defaults : {
                    prefix     : '<string>',
                    show_count : (true|false),
                    sorting    : '(frequency|alphabetically)'
                },
              callback : <INSERT_YOUR_CALLBACK_FUNCTION>
            });
        });
    </script>

Learn more on the parameters in the section after next.


## Examples

### Simple setup

        <html>
        <head>
            <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
            <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
            <script src="../src/tumblr.tagrankr.js"></script>
        </head>
        <body>
            <div id="tagRankr"></div>

            <script type="text/javascript">
                $(document).ready(function() {
                    $("#tagRankr").tagRankr({
                        api_key  : 'hKrSgR1AeyHhosts41...',
                        blog     : 'box-of-birds.tumblr.com',
                    });
                });
            </script>
        </body>
        </html>

### Detailed setup

        <html>
        <head>
            <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
            <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
            <script src="../src/tumblr.tagrankr.js"></script>
        </head>
        <body>
            <div id="tagRankr"></div>

            <script type="text/javascript">
                function pagerCallback() {
                    // do something on $('#tagRankr ul')
                };

                $(document).ready(function() {
                    $("#tagRankr").tagRankr({
                        api_key  : 'hKrSgR1AeyHhosts41...',
                        blog     : 'box-of-birds.tumblr.com',
                      callback : pagerCallback,
                      defaults :  {
                          prefix     : '#',
                          show_count : false,
                          sorting    : 'alphabetically'
                      }
                    });
                });
            </script>
        </body>
        </html>


# Parameters

## Required parameters

<table>
<tr>
  <th>Name</th>
  <th>Type</th>
  <th>Description</th>
  <th>Example</th>
</tr>
<tr>
  <td>blog</td>
  <td>hostname</td>
  <td>The basename of your Tumblr blog without http://</td>
  <td>box-of-birds.tumblr.com</td>
</tr>
<tr>
  <td>api_key</td>
  <td>string</td>
  <td>Your personal Tumblr API key. If you don't have a key yet, please 
    register <a href="http://www.tumblr.com/docs/en/api/v2">here</a>.</td>
  <td>hKrSgR1AeyHhosts41...</td>
</tr>
</table>

## Optional parameters

<table>
<tr>
  <th>Name</th>
  <th>Parameter
  <th>Type</th>
  <th>Description</th>
  <th>Example</th>
</tr>
<tr>
  <td colspan="2">callback</td>
  <td>function</td>
  <td>You can pass a callback function to TagRankr, which is immediately called 
    after all requested tags are retrieved and analysed. For instance, you can 
    call another plugin to perform pagination on the results.</td>
  <td>myCallbackFunc</td>
</tr>
<tr>
  <td>defaults</td>
  <td>prefix</td>
  <td>string</td>
  <td>This string will prefix each tag, i.e. choosing '#' will display '#tag' 
    instead of 'tag'. The default value is an empty string.</td>
  <td>#</td>
</tr>
<tr>
  <td></td>
  <td>show_count</td>
  <td>boolean</td>
  <td>Show or hide the number of occurrences of the given tag. Valid values are 
    <b>true</b> and <b>false</b>. The default value is true.</td>
  <td>true</td>
</tr>
<tr>
  <td></td>
  <td>sorting</td>
  <td>string</td>
  <td>You can choose the order of sorting. Valid values are <b>frequency</b> 
    and <b>alphabetically</b>. The default sorting order is by frequency.</td>
  <td>frequency</td>
</tr>
</table>


# Author

Dennis Hoppe ([dennis-hoppe.com](http://www.dennis-hoppe.com))


# Final remarks

For demonstration purposes, the example provided in the download package of 
TagRankr includes a simple pager for **ul** lists: 
[jQuery.flexipage](http://flexipage.vieron.net). Since I am not affiliated with 
that library, please contact the author of flexipage directly, if you have
any questions or [issues](http://github.com/vieron/flexipage/issues) with 
flexipage.


# Copyright and Licence

Copyright (c) 2013 Dennis Hoppe

This content is released under the MIT Licence.






/*!
 * tumblr.TagRankr - jQuery UI Widget
 * version: 1.0 (30th May 2013)
 * @requires jQuery UI v1.9 or later
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013 Dennis Hoppe (github.com/hopped)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function( $ ) {
    "use strict";

    $.widget("hopped.tagRankr", {
        options: {
            api_key  : undefined,
            blog     : undefined,
            callback : undefined,
            defaults : {
                sorting    : 'frequency',
                prefix     : '',
                show_count : 'true'
            }
        },
        vars: {
            base_url    : "http://api.tumblr.com/v2/blog",
            tagrankr_id : "tagRankr-list"
        },
        version: "1.0",

        _create: function() {
            var self    = this.element,
                options = this.options;

            $("<ul></ul>")
                .attr( "id", this.vars.tagrankr_id )
                .appendTo( self );

            if ( this._validateOptions( options ) ) {
                options.blog = options.blog.replace( /^http:\/\//, '' );
                this._process( options );
            }
        },

        _validateOptions: function( options ) {
            if ( options.api_key === undefined ) {
                /*global console */
                console.error("Tumblr API key is missing.");
                this._handleError();
                return false;
            }

            if ( options.blog === undefined ) { 
                /*global console */
                console.error( "The parameter 'blog' is missing." );
                this._handleError();
                return false;
            }

            if ( options.defaults.sorting   !== 'frequency'
                && options.defaults.sorting !== 'alphabetically' ) {
                /*global console */
                console.error( "The parameter 'sorting' is invalid (frequency or alphabetically)." );
                this._handleError();
                return false;
            }

            options.defaults.show_count = options.defaults.show_count.toLowerCase();
            if ( options.defaults.show_count !== 'true'
                && options.defaults.show_count !== 'false' ) {
                /*global console */
                console.error( "The parameter 'show_count' is invalid (true or false)." );
                this._handleError();
                return false;
            }

            return true;
        },

        _process: function( params ) {
            var that = this,
                link = that.vars.base_url + "/"
                    + params.blog    + "/posts?api_key="
                    + params.api_key + "&callback=?";

            $.getJSON( link, {
                format: "json"
            })
            .done(function( data, textStatus ) {
                if ( textStatus === "success" && data.meta.status === 200 ) {
                    that._addTags( data, "#" + that.vars.tagrankr_id, params );
                    if ( that.options.callback !== undefined ) {
                        that.options.callback();
                    }
                    return;
                }
                that._handleError( data.meta, link, params );
            });
        },

        _addTags: function( data, parent, params ) {
            var tag_count = {};

            /*jslint unparam: true*/
            $.each( data.response.posts, function( i, item ) {
                   $.each( item.tags, function( j, tag ) {
                       var count = tag_count[tag] || 0;
                       count += 1;
                       tag_count[tag] = count;
                   });
            });
            /*jslint unparam: false*/

            if ( this.options.defaults.sorting === 'alphabetically' ) {
                this._sortAlphabetically( parent, params, tag_count );
            } else {
                this._sortByFrequency( parent, params, tag_count );
            }
        },

        _sortByFrequency: function( parent, params, tag_count ) {
            var that = this;
            Object.keys( tag_count ).sort(function( a, b ) {
                return tag_count[b] - tag_count[a];
            }).forEach(function( key ) { 
                that._addListElement( parent, params, key, tag_count[key] );
            });
        },

       _sortAlphabetically: function( parent, params, tag_count ) {
            var that = this;
            Object.keys( tag_count ).sort(function( a, b ) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            }).forEach(function( key ) { 
                that._addListElement( parent, params, key, tag_count[key] );
            });
        },

        _addListElement: function( parent, params, key, value ) {
            var strText = this.options.defaults.prefix + key;
            if ( this.options.defaults.show_count !== 'false' ) {
                strText = strText + " (" + value + ")";
            }
            $( "<a></a>", {
                href: "http://" + params.blog + "/tagged/" + key,
                text: strText
            })
            .appendTo( parent )
            .wrap( "<li></li>" );
        },

        _handleError: function( data, link, params ) {
            console.log(this.vars.tagrankr_id);
            $( "<li></li>" )
                .text( "Sorry, tag list could not be retrieved (cf. console)" )
                .appendTo( "#" + this.vars.tagrankr_id );

            if ( data === undefined ) {
                return;
            }

            switch ( data.status ) {
                case 401:
                    /*global console */
                    console.error(
                        "Failed request: %s. Is your Tumblr API key valid? %s",
                        data.msg, params.api_key
                    );
                    break;
                case 404:
                    console.error(
                        "Failed request: %s. Is this your blog? %s", data.msg, params.blog );
                    break;
                default:
                    console.error(
                        "Failed request: %s, Status: %s, Message: %s",
                        link, data.status, data.msg
                    );
                    break;
            }
        },

        _destroy: function() {
            return this._super();
        }

    });

/*global jQuery */
}( jQuery ) );
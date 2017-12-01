import React from "react";
import QuoteList from "./QuoteList";
import Constants from "./Constants";

/*
This is meant as an abstract class for components that intend to request and keep track of quotes data.
*/
export default class QuotePage extends React.Component
{
    constructor( props )
    {
        super( props );
        this.state = {};
    }

    //rendering is to be handled by child classes
    render() 
    {
       throw new Error('render() must be handled by subclass,it is not implemented by QuotePage class');
    }

    //sends an ajax request for quotes with the parameters given
    getData( fromQuoteUrl, fromQuoteParams )
    {
        var self = this;
        //sends ajax get request to server for all the quotes
        $.get( fromQuoteUrl , fromQuoteParams, function( data, status )
        {
            if ( data.length == 0 )
            {
                self.setState( { quotes: [] } );
                self.setState( { requestDone: true } );
                self.setState( { quoteUser: "???" } );
                return;
            }

            self.setState( { quotes: data } );
            self.setState( { requestDone: true } );
            self.setState( { quoteUser: data[ 0 ].creatorName } );
        });
    }

    updateQuote( qid, newData )
    {
        //make a copy of the quotes for modification so as to update state later
        var quotesCopy = this.state.quotes.slice();
        //go through all the quotes,find the quote that has the updated quote's qid
        //once found,overwrite that position with the updated quote
        for ( var i = 0; i < quotesCopy.length; i++ )
        {
            let atQuote = quotesCopy[ i ];
            if ( atQuote.qid === qid )
            {
                let prevQuote = quotesCopy[ i - 1 ];
                let nextQuote = quotesCopy[ i + 1 ];
                let swapIndex = i;
                //if the previous quote in the list has lower score than the updated quote then need to swap them
                if ( prevQuote && prevQuote.score <= newData.score )
                {
                    swapIndex = i - 1;
                }
                //if the next quote in the list has higher score than the updated quote then need to swap them
                else if ( nextQuote && nextQuote.score >= newData.score )
                {
                    swapIndex = i + 1;
                }

                //swap the elements and break out of the loop
                prevQuote = quotesCopy[ swapIndex ];
                quotesCopy[ swapIndex ] = newData;
                if ( i != swapIndex )
                {
                    quotesCopy[ i ] = prevQuote;
                }
                break;
            }
        }

        //update the state if and only if the for loop did not go to end of the quotes array
        if ( i < quotesCopy.length )
        {
            this.setState( { "quotes" : quotesCopy } );
        }
    }

    voteQuote( qid, href )
    {
        var self = this;
        $.post( href , { "qid" : qid } , function( data, status )
        {
            if ( data.qid )
            {
                self.updateQuote( qid, data );
            }
            else
            {
                //TODO: show error message
                console.log( "BAD " + href + ",No qid" );
            }
        });
    }

    upvoteQuote( qid )
    {
        this.voteQuote( qid, "/upvoteQuote" );
    }

    downvoteQuote( qid )
    {
        this.voteQuote( qid, "/downvoteQuote" );
    }
}

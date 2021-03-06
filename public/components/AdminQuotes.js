import React from "react";
import QuoteList from "./QuoteList";
import Constants from "./Constants";
import QuotePage from "./QuotePage";

export default class NavBar extends QuotePage
{
    constructor( props )
    {
        super( props );
        if ( props.finishedLoginCheck )
        {
            this.getData( "/flagged" , {} );
        }
    }

    componentDidUpdate(prevProps, prevState)
    {
        super.componentDidUpdate( prevProps, prevState );
        if ( prevProps.finishedLoginCheck != true && this.props.finishedLoginCheck )
        {
            this.getData( "/flagged" , {} );
        }
    }

    render()
    {
        return (
            <div>
                <h1> Flagged Quotes </h1>
                <QuoteList quotes={this.state.quotes} 
                    requestDone={this.state.requestDone} 
                    loggedInAs={this.props.userName} 
                    downvoteQuote={this.downvoteQuote.bind( this )} upvoteQuote={this.upvoteQuote.bind( this )} />
            </div>
        );
    }

    shouldAddQuote( newQuote )
    {
        if ( newQuote === undefined || newQuote.creatorId === undefined )
        {
            console.log( "newQuote undefined or newQuote.creatorId undefined" );
            return false;
        }

        return !!newQuote.flagged;
    }
}

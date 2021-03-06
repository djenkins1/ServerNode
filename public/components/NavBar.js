import React from "react";
import ReactDOM from "react-dom";
import Constants from "./Constants";
import { NavLink } from 'react-router-dom';
import NavLinks from "./NavLinks";

export default class NavBar extends React.Component
{
    render()
    {
        return (
            <nav className="navbar sticky-top navbar-dark bg-primary justify-content-between navbar-expand-lg">
                <a className="navbar-brand"> {Constants.TXT_TITLE_APP} </a>
                <button type="button" className="navbar-toggler hidden-sm-up" data-toggle="collapse" data-target="#navBarTop" >
                    <span className="navbar-toggler-icon"></span>
                </button>
                {this.getNavLinks()}
            </nav>
        );
    }

    navLinksIfAdmin()
    {
        if ( this.props.userName && this.props.userName.role && this.props.userName.role === Constants.ROLE_USER_ADMIN )
        {
            return (
                <NavLink to="/flagged" className="nav-item nav-link" activeClassName="active" > {Constants.TXT_QUOTES_FLAGGED} </NavLink> 
            );
        }
    }

    submitSearch( event )
    {
        event.preventDefault();
        var searchTerms = encodeURIComponent( ReactDOM.findDOMNode( this.refs.searchTerms ).value );
        window.location.href = "index.html#/search/" + searchTerms;
        return;
    }

    searchForm()
    {
        return (
            <form action='#/search/' onSubmit={this.submitSearch.bind( this )} className="form-inline my-2 my-lg-0 ml-auto" >
                <div className="input-group">
                    <input className="form-control mr-sm-2" type="search" ref="searchTerms" name="searchTerms" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </div>
            </form>
        );
    }

    navLinksIfLoggedIn()
    {
        return (
            <NavLinks >
                <NavLink exact={true} to="/" className="nav-item nav-link" activeClassName="active"> {Constants.TXT_QUOTES_ALL} </NavLink>
                <NavLink to={"/quotes/" + this.props.userName.userId} className="nav-item nav-link" activeClassName="active" > {Constants.TXT_QUOTES_MY} </NavLink> 
                {this.navLinksIfAdmin()}
                <a className="nav-item nav-link" href="#" onClick={this.handleClickLinkModal.bind( this )} > {Constants.TXT_QUOTE_NEW} </a>
                <a className="nav-item nav-link" href="#" onClick={this.handleLogout.bind( this )}> {Constants.TXT_NAV_LOGOUT} </a>
                {this.searchForm()}
            </NavLinks>
        );
    }

    getNavLinks()
    {
        if ( this.props.userName )
        {
            return this.navLinksIfLoggedIn()
        }
        
        return (
            <NavLinks >
                <NavLink activeClassName="active" exact={true} to="/" className="nav-item nav-link" > {Constants.TXT_QUOTES_ALL} </NavLink>
                <a onClick={this.handleClickLinkModal.bind( this )} className="nav-item nav-link" href="#"> {Constants.TXT_NAV_SIGNIN} </a>
                <a onClick={this.handleClickLinkModal.bind( this )} className="nav-item nav-link" href="#"> {Constants.TXT_NAV_SIGNUP} </a>
                {this.searchForm()}
            </NavLinks>
        );
    }

    handleClickLinkModal( e )
    {
        e.preventDefault();
        this.props.changeModal( e.target.innerText );
    }

    handleClickQuotes( e )
    {
        e.preventDefault();
        let targetText = e.target.innerText;
        if ( targetText === Constants.TXT_QUOTES_ALL )
        {
            this.props.authorClickFunc( undefined, undefined );
        }
        else if ( targetText === Constants.TXT_QUOTES_MY )
        {
            this.props.authorClickFunc( this.props.userName.userId, this.props.userName.username );
        }
        else
        {
            console.log( "Fell through on handleClickQuotes targetText: " + targetText );
        }
    }

    handleLogout( e )
    {
        e.preventDefault();
        var self = this;
        //send ajax request to server to logout the user
        $.get( "/logout" , {}, function( data, status )
        {
            if ( data.error || data.errors )
            {
                //TODO: show any errors to user
                console.log( data.errors );
                return;
            }

            self.props.onUpdateUser();
        });
    }

}

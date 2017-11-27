import React from "react";

export default class SignupForm extends React.Component
{
    handleUserField( e )
    {
        this.props.userChange( e.target.value );
    }

    handleEnterPress( e )
    {
        console.log( "handleEnterPress()" )
        if ( e.which == 13 || e.keyCode == 13 )
        {
            console.log( "Enter pressed" );
            this.props.submitFunc( undefined );
        }
    }

    handlePasswordField( e )
    {
        this.props.passChange( e.target.value );
    }

    render()
    {
        return (
            <form action='/newUser' method='post' >
                <input size='30' 
                    onKeyPress={this.handleEnterPress.bind( this )}
                    onChange={this.handleUserField.bind(this)} 
                    type='text' name='username' placeholder='Username' />
                <br /><br />
                <input 
                    size='30' type='password' name='password' 
                    onChange={this.handlePasswordField.bind( this )} 
                    onKeyPress={this.handleEnterPress.bind( this )}
                    placeholder='Password'  />
                <br /><br />
            </form>
        );
    }
}



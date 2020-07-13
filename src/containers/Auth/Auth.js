import React , {Component} from 'react';
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/input/input'
import classes from './Auth.module.css';
import * as actions from '../../store/actions'
import { connect } from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner'
import { Redirect } from 'react-router-dom';

class Auth extends Component{
    state= {
        controls : {
            email: {
                elementType: 'input',
                elementConfig: {
                    type:'email',
                    placeholder: 'Mail Address',
                },
                value:'',
                validation: {
                    required: true,
                    isEmail: true
                },
                touched: false,
                valid: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type:'password',
                    placeholder: 'Password',
                },
                value:'',
                validation: {
                    required: true,
                    minLength: 6
                },
                touched: false,
                valid: false
            }
        },
        isSignup : true
    }

    componentDidMount() {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/')
        {
            this.props.onSetAuthRedirectPath();
        }
    }

    checkValidity = (value,rules) => {
        let isValid = true;

        if(!rules)
            return true ;
        
        if(rules.required){
            isValid = isValid && (value.trim() !== '');
        }

        if(rules.minLength){
            isValid = isValid && (value.length >= rules.minLength);
        }

        if(rules.maxLength){
            isValid = isValid && (value.length <= rules.maxLength);
        }

        if(rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if(rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return(isValid);
    }

    submitHandler = (event) => {
        event.preventDefault();
        //console.log( this.state.controls.email.value +  this.state.controls.password.value)
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    }

    inputChangeHandler= (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName] : {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        };
        
        this.setState({controls: updatedControls});
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignup : !prevState.isSignup}
        })
    }

    render() {

        const formElementsArray=[];
        for (let key in this.state.controls)
        {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form2 = formElementsArray.map(formElement => (
            <Input 
                key={formElement.id}
                valueType={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                changed={(event)=> this.inputChangeHandler(event, formElement.id)}
                invalid={!formElement.config.valid}
                touched={formElement.config.touched}
                shouldValidate={formElement.config.validation}
            />  
            
        ));

        if(this.props.loading){
            form2 = <Spinner />
        }
        
        let errorMessage = null;

        if(this.props.error){
            errorMessage = (
                <p>{this.props.error.message}</p>
            )
        }

        let authRedirect = null
        if( this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath}/>
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit = { this.submitHandler }>
                    {form2}
                    <Button btnType="Success">SUBMIT</ Button>
                </form>
                <Button 
                clicked={this.switchAuthModeHandler}
                btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN': 'SIGNUP'}</Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null ,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath : state.auth.authRedirectPath
    }
}


const mapDispatchToProps = dispatch => {
    return{
        onAuth: (email, password ,isSignup) => dispatch(actions.auth(email,password,isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Auth);
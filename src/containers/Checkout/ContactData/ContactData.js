import React , {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import instance from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/input/input';

class ContactData extends Component {
    state = {
        orderForm : {
            name: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Your name',
                },
                value:'',
                validation: {
                    required: true
                },
                touched: false,
                valid: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Your street name',
                },
                value:'',
                validation: {
                    required: true
                },
                touched: false,
                valid: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'ZIP Code',
                },
                value:'',
                validation: {
                    required: false
                },
                touched: false,
                valid: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Country',
                },
                value:'',
                validation: {
                    required: false
                },
                touched: false,
                valid: false
            },
            email:{
                elementType: 'input',
                elementConfig: {
                    type:'email',
                    placeholder: 'Your email',
                },
                value:'',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 20 
                },
                touched: false,
                valid: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options:[
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value:'fastest',
                validation: {},
                touched: false,
                valid: true
            }
        },
        formIsValid: false,
        loading: false
    };

    checkValidity = (value,rules) => {
        let isValid = true;
        
        if(rules.required){
            isValid = isValid && (value.trim() !== '');
        }

        if(rules.minLength){
            isValid = isValid && (value.length >= rules.minLength);
        }

        if(rules.maxLength){
            isValid = isValid && (value.length <= rules.maxLength);
        }

        return(isValid);
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });

        const formData = {};
        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier]=this.state.orderForm[formElementIdentifier]
        }

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,    
            orderData: formData
        };
        
       instance.post('/orders.json', order)
       .then( response => {
           this.setState({ loading: false });
           this.props.history.push('/');
        })
       .catch(error => {
           console.log(error.message);
           this.setState({ loading: false })});
    }

    inputChangeHandler= (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched=true;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedOrderForm[inputIdentifier] = updatedFormElement ;
        let formIsValid = true;
        for(let formElementIdentifier in updatedOrderForm){
            formIsValid = formIsValid && updatedOrderForm[formElementIdentifier].valid ;
        }
        this.setState({orderForm: updatedOrderForm , formIsValid : formIsValid});
    }

    render(){
        const formElementsArray=[];
        for (let key in this.state.orderForm)
        {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
        <form onSubmit={this.orderHandler}>
            {
                formElementsArray.map(formElement => (
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
                ))
            }
            <Button btnType="Success" disabled= {! this.state.formIsValid} clicked={this.orderHandler}>ORDER</Button>
        </form>
        );

        if(this.state.loading) {
            form = <Spinner />;
        }
    
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;
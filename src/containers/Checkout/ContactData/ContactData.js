import React , {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import instance from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';


class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
           const order = {
           ingredients: this.props.ingredients,
           price: this.props.price,
           customer : {
               name: 'Satyajit Choudhary',
               address:{
                   street: 'Teststreet1',
                   zipCode: '42561',
                   country: 'Pakindia'
               },
               email:'test@test.com'
           },
           deliveryMethod: 'fastest'
       };

       this.setState({ loading: true });
       console.log(order);

       
       instance.post('/orders.json', order)
       .then( response => {
           this.setState({ loading: false });
           this.props.history.push('/');
        })
       .catch(error => {
           console.log(error.message);
           this.setState({ loading: false })});
    }


    render(){
        let form = (<form>
            <input type="text" className={classes.Input} name="name" placeholder="Your name" />
            <input type="text" className={classes.Input} name="email" placeholder="Your email" />
            <input type="text" className={classes.Input} name="street" placeholder="Street" />
            <input type="text" className={classes.Input} name="postalCode" placeholder="Postal Code" />
            <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
        </form>);

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
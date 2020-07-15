import React, { Component } from 'react'
import {connect} from 'react-redux'
import Aux from '../../components/hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import instance from '../../axios-orders';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index';//it is not necessary to mention index..

class BurgerBuilder extends Component{
    state={
        purchasing:false,
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients){
    
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((addons,el)=>{return addons+=el;},0);

        return sum>0;
    }


    // addIngredienthandler = (type) =>{
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = Number(oldCount) + 1 ;
        
    //     const updatedIngredients= {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type]=updatedCount;
        
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newprice = oldPrice + priceAddition;
        
    //     this.setState({totalPrice: newprice, ingredients: updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // }

    // removeIngredienthandler = (type) =>{
    //     const oldCount =this.state.ingredients[type];
    //     if(oldCount<=0)
    //         return;
    //     const updatedCount = oldCount - 1  ;
        
    //     const updatedIngredients= {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type]=updatedCount;
        
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newprice = oldPrice - priceDeduction;
        
    //     this.setState({totalPrice: newprice, ingredients: updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // }

    purchaseHandler = () => {
        if(this.props.isAuthenticated)
        {
            this.setState({purchasing:true});
        }
        else{
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push('/auth');
        }
    }

    purchaseContinueHandler = () => {
       // alert('You can continue');
    
        // const queryParams = [];
        // for (let i in this.state.ingredients)
        // {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }   
        // queryParams.push('price='+this.state.totalPrice);
        // const queryString = queryParams.join('&');
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    render(){
        const disabledInfo={
            ...this.props.ings
        };

        for(let key in disabledInfo)
        {
            disabledInfo[key]=disabledInfo[key]<=0;
        }

        let burger=this.props.error ? <p>Ingredients can't be loaded</p>:<Spinner />;
        let orderSummary= null;
        //Ingredients not available till now
        if(this.props.ings)
        {
            burger=(<Aux>
                        <Burger ingredients={this.props.ings}/>
                        <BuildControls 
                            ingredientAdded={this.props.onIngredientAdded}
                            ingredientRemoved={this.props.onIngredientRemoved}
                            disabled={disabledInfo}
                            totalPrice={this.props.price}
                            purchasable={this.updatePurchaseState(this.props.ings)}
                            ordered={this.purchaseHandler}
                            isAuth={this.props.isAuthenticated}/>
                    </Aux>);
            orderSummary=<OrderSummary 
                            ingredients={this.props.ings} 
                            price={this.props.price} 
                            purchaseCanceled={this.purchaseCancelHandler}
                            purchaseContinued={this.purchaseContinueHandler}/>;
        }

        return(
            <Aux >
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded : (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
        onIngredientRemoved : (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
        onInitIngredients : () => dispatch(actions.initIngredient()),
        onInitPurchase : () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
};

export default connect(mapStateToProps , mapDispatchToProps )(withErrorHandler(BurgerBuilder,instance));
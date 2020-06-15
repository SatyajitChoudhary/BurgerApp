import React, { Component } from 'react'
import Aux from '../../components/hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import instance from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component{
    state={
        ingredients:null,
        totalPrice: 0,
        purchasable:false,
        purchasing:false,
        loading: false,
        error:false
    }

    componentDidMount() {
        instance.get('/ingredients.json')
        .then(response => {this.setState({ingredients:response.data});} )
        .catch((error)=>{this.setState({error:true})});
    }

    updatePurchaseState(updatedIngredients){
        const ingredients={
            ...updatedIngredients
        };
    
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((addons,el)=>{return addons+=el;},0);

        this.setState({purchasable: sum>0});

    }


    addIngredienthandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = Number(oldCount) + 1 ;
        
        const updatedIngredients= {
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;
        
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newprice = oldPrice + priceAddition;
        
        this.setState({totalPrice: newprice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredienthandler = (type) =>{
        const oldCount =this.state.ingredients[type];
        if(oldCount<=0)
            return;
        const updatedCount = oldCount - 1  ;
        
        const updatedIngredients= {
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;
        
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newprice = oldPrice - priceDeduction;
        
        this.setState({totalPrice: newprice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing:true});
    }

    purchaseContinueHandler = () => {
       // alert('You can continue');
    
        const queryParams = [];
        for (let i in this.state.ingredients)
        {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }   
        queryParams.push('price='+this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
                pathname:'/checkout',
                search: '?' + queryString 
            });
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    render(){
        const disabledInfo={
            ...this.state.ingredients
        };

        for(let key in disabledInfo)
        {
            disabledInfo[key]=disabledInfo[key]<=0;
        }

        let burger=this.state.error ? <p>Ingredients can't be loaded</p>:<Spinner />;
        let orderSummary= null;
        //Ingredients not available till now
        if(this.state.ingredients)
        {
            burger=(<Aux>
                        <Burger ingredients={this.state.ingredients}/>
                        <BuildControls 
                            ingredientAdded={this.addIngredienthandler}
                            ingredientRemoved={this.removeIngredienthandler}
                            disabled={disabledInfo}
                            totalPrice={this.state.totalPrice}
                            purchasable={this.state.purchasable}
                            ordered={this.purchaseHandler}/>
                    </Aux>);
            orderSummary=<OrderSummary 
                            ingredients={this.state.ingredients} 
                            price={this.state.totalPrice} 
                            purchaseCanceled={this.purchaseCancelHandler}
                            purchaseContinued={this.purchaseContinueHandler}/>;
        }

        if(this.state.loading)
        {
            orderSummary = <Spinner />;
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

export default withErrorHandler(BurgerBuilder,instance);
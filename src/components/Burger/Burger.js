import React from 'react'
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let transformedIngredientes= Object.keys(props.ingredients).map(addons => {
        return([...Array(props.ingredients[addons])].map((_,index)=>{
            return <BurgerIngredient key={addons + index} type={addons} />
        }))
    }).reduce( (array,items) => array.concat(items) , [] );
   
    if(transformedIngredientes.length===0)
        transformedIngredientes=<p>Please start adding ingredients</p>;
        
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredientes}
            <BurgerIngredient type="bread-bottom" />
        </div>
    )
}

export default burger;
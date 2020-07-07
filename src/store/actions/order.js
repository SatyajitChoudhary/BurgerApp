import * as actionTypes from './actionTypes';
import instance from '../../axios-orders'

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData
    }
}

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAILED,
        error
    }
}

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    }
}

export const purchaseBurger = (orderData) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        instance.post('/orders.json', orderData)
       .then( response => {
            // this.props.history.push('/');
            //console.log(response.data);
            dispatch(purchaseBurgerSuccess(response.data.name , orderData))
        })
       .catch( error => {
           dispatch(purchaseBurgerFail(error));
       })
    }
}

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_INIT
    }
}

export const fetchOrderSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders
    }
}

export const fetchOrderFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error
    }
}

export const fetchOrderStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    }
}

export const fetchOrders = () => {
    return dispatch => {
        dispatch(fetchOrderStart());

       instance.get('./orders.json')
        .then(res => {
            const fetchedOrders = [];
            for(let key in res.data){
                fetchedOrders.push({
                    ...res.data[key],
                    id: key
                });
            }
            dispatch(fetchOrderSuccess(fetchedOrders));
        })
        .catch(err => {
            dispatch(fetchOrderFail());
        })
    }
}
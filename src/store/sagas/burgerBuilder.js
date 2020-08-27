import instance from "../../axios-orders";
import {put} from 'redux-saga/effects'
import * as actions from '../actions'

export function* initIngredientSaga(){
    try{
        const response = yield instance.get('/ingredients.json')
        yield put(actions.setIngredients(response.data));
    }
    catch( error ) {
        yield put(actions.fetchIngredientFailed());
    }
}
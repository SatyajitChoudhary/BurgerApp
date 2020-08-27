import {logoutSaga, checkAuthTimeoutSaga, authUserSaga, authCheckStateSaga} from './auth'

import * as actionTypes from '../actions/actionTypes'
import { takeEvery, all, takeLatest } from 'redux-saga/effects'
import { initIngredientSaga } from './burgerBuilder';

export function* watchAuth() {
    //takeEvery listens to all actions and when action given in 
    //first argument is called then the function in 2nd argument is called
    yield all([
        takeEvery(actionTypes.AUTH_INITIATE_LOGOUT,logoutSaga),
        takeEvery(actionTypes.AUTH_CHECK_TIMEOUT,checkAuthTimeoutSaga)
    ]);
    //all runs all the commands inside it simultaneously,you can run many async tasks.
    yield takeLatest(actionTypes.AUTH_USER,authUserSaga);
    //takeLatest takes the latest call and fires the func
    yield takeEvery(actionTypes.AUTH_CHECK_INITIAL_STATE,authCheckStateSaga);
} 

export function* watchBurgerBuilder(){
    yield takeEvery(actionTypes.INIT_INGREDIENTS,initIngredientSaga);
}


//saga helps keep action creators lean and 
//saga helps to have all side effects here in sagas
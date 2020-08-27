import { put, delay, call } from 'redux-saga/effects'
import * as actions from '../actions';
import axios from 'axios';


export function* logoutSaga(action){ 
    //this is a generator function which waits for each async code to return and executes incrementally
    //prepending yield before a line basically says to wait till the code runs completely before going to next line
    yield call([localStorage,'removeItem'],'token');//calling removeItem func of localStorage object with arguments 'token'
    //above line is equivalent to : yield localStorage.removeItem('token')
    yield localStorage.removeItem('expirationDate')
    yield localStorage.removeItem('userId')
    
    // yield put({
    //     type: actionTypes.AUTH_LOGOUT
    // }); is equivalent to below which dispatches a actionCreator function named logoutSucceed()
    yield put(actions.logoutSucceed());   
    
}

export function* checkAuthTimeoutSaga(action) {  
    yield delay(action.expirationTime*1000);
    yield put(actions.logout());
}

export function* authUserSaga(action){
    yield put(actions.authStart())
    
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    }
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBv5oEUUSVoRRqNg2GntvaV9EFE2xwJlEs'
    if(!action.isSignup)
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBv5oEUUSVoRRqNg2GntvaV9EFE2xwJlEs'
    
    try{
    const response = yield axios.post(url, authData)
    //axios return a promise intitially but adding "yield" waits for this post request to complete and returns the response object instead of proimise
    //since it waits for post request to complete, we don't have to use "then" chaining, we can run it sequentially using response output
    
    const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000)
    yield localStorage.setItem('token', response.data.idToken)
    yield localStorage.setItem('expirationDate', expirationDate)
    yield localStorage.setItem('userId', response.data.localId)//it is not important to use yield for localStorage
    yield put(actions.authSuccess(response.data.idToken, response.data.localId)) 
    yield put(actions.checkAuthTimeout(response.data.expiresIn))
    }
    catch(error) {
        yield put(actions.authFail(error.response.data.error));
    }
}


export function* authCheckStateSaga(){
    const token = yield localStorage.getItem('token');
    if(!token)
        yield put(actions.logout());
    else{
        const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
        if(expirationDate <= new Date()) {
            yield put(actions.logout());
        }
        else{
            const userId = yield localStorage.getItem('userid')
            yield put(actions.authSuccess(token,userId))
            yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000))
        }
    }
}

// use yield put({type:..,payload:..} in saga instead of dispatch in thunk)
// put is like returning action type same as return func in a acton creator
import { applyMiddleware, combineReducers, compose,createStore,} from 'redux';
import {PostsReducer, toggleMenu} from './reducers/PostsReducer';
import thunk from 'redux-thunk';
import { AuthReducer ,PatientStore} from './reducers/AuthReducer';
import todoReducers from './reducers/Reducers';
//import { reducer as reduxFormReducer } from 'redux-form';
import { createWrapper } from "next-redux-wrapper";

const middleware = applyMiddleware(thunk);

const composeEnhancers =
    compose;

const reducers = combineReducers({
    sideMenu: toggleMenu,
    posts: PostsReducer,
    auth: AuthReducer,
    patientDetails: PatientStore,
		todoReducers,
	//form: reduxFormReducer,	
	
});

//const store = createStore(rootReducers);

export const store = createStore(reducers,  composeEnhancers(middleware));

// assigning store to next wrapper
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);

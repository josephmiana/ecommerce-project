import { createStore } from 'redux';

// Initial state
const initialState = { count: 0 };

// Reducer function
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };

    case "DECREMENT":
      return { ...state, count: state.count - 1 };

    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(reducer);

export default store;

import { ActionType } from "./ActionType";
    export const initialState ={
    bascket: [],
    }

    export const reducer = (state, action) =>{
        console.log(action);
        switch(action.type){
            case ActionType.AddToBascket:
                const existingItem = state.bascket.find((item) => item.id === action.item.id);
                if (!existingItem) {
                    return {
                        ...state,
                        bascket: [...state.bascket, { ...action.item, quantity: 1 }],
                    };
                } else {
                    return {
                        ...state,
                        bascket: state.bascket.map((item) =>
                            item.id === action.item.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    };
                }
            case ActionType.RemoveOneFromBascket:
                const itemToRemove = state.bascket.find((item) => item.id === action.item.id);
                if (itemToRemove) {
                    if (itemToRemove.quantity > 1) {
                        // Decrease the quantity by 1
                        return {
                            ...state,
                            bascket: state.bascket.map((item) =>
                                item.id === action.item.id
                                    ? { ...item, quantity: item.quantity - 1 }
                                    : item
                            ),
                        };
                    } else {
                        // Remove the item from the basket if quantity is 1
                        return {
                            ...state,
                            bascket: state.bascket.filter((item) => item.id !== action.item.id),
                        };
                    }
                }
                return state;
            case ActionType.RemoveFromBascket:
                const index = state.bascket.findIndex(
                    (bascketItem) => bascketItem.id === action.id
                );
                let newBascket = [...state.bascket];
                if (index >= 0) {
                    newBascket.splice(index, 1);
                } else {
                    console.warn(
                        `Can't remove product (id: ${action.id}) as it's not in the bascket!`
                    );
                }
                return {
                    ...state,
                    bascket: newBascket,
                };
            default:
                return state;
        }
    }
    
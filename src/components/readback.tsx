import React, { useState } from 'react';
import { store } from '../redux/store';
import { CREATE_CONNECTION } from '../redux/actions';
import {useDispatch, useSelector} from 'react-redux';

let connected: boolean = false;


function selector(state: any) {
    return state.valueCache;
}

function useConnection(pvName: string) {
    //const [stateValue, setLatestValue] = useState(0);
    const dispatch = useDispatch();
    const latestValue = useSelector(selector);
    console.log(`useConnection ${latestValue}`);
    console.log(latestValue);
   if (!connected) {
        dispatch({type: CREATE_CONNECTION, payload: {'url': 'wsurl', 'pvName': 'pv'}});
        connected = true;
   }
    return latestValue[pvName];
}

export const Readback = (props: any) => (
    <p>{ props.value }</p>
);

export const ConnectedReadback = (props: any) => {
    const latestValue = useConnection(props.pv);
    console.log(`latestValue ${latestValue}`);
    return (
        <Readback value={latestValue} />
    )

}
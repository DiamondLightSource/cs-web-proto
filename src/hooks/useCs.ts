import { useEffect }  from 'react';
import { SUBSCRIBE, UNSUBSCRIBE } from '../redux/actions';
import {useDispatch} from 'react-redux';


export function useSubscription(pvName: string): void {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({type: SUBSCRIBE, payload: {'url': 'wsurl', 'pvName': pvName}});
        return () => {
            dispatch({type: UNSUBSCRIBE, payload: {'url': 'wsurl', }})
        }
    }, [dispatch, pvName]);
}

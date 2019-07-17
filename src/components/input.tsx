import React, { useState } from 'react';
import { WRITE_PV } from '../redux/actions';
import { store } from '../redux/store';

interface InputProps {
    value: any,
    keyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    change: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input = (props: InputProps) => (
    <input 
        type="text" 
        value={props.value} 
        onKeyDown={props.keyDown}
        onChange={props.change}
        />
);

interface ConnectedInputProps {
    pvName: string
}

export const ConnectedInput = (props: ConnectedInputProps) => {
    const [inputValue, setInputValue] = useState('');

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        console.log(`target value is ${target.value}`);
        setInputValue(inputValue + event.key);
        if (event.key === 'Enter') {
            store.dispatch({type: WRITE_PV, payload: {'pvName': props.pvName, 'value': target.value}});
            setInputValue('');
        }
    }
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        console.log('changed');
    }

    return Input({value: inputValue, keyDown: onKeyDown, change: onChange});
}

import React from 'react';
import Hotkeys from 'react-hot-keys';

const HotButton = (props) => {

    return  (
        <Hotkeys keyName={props.keyName} onKeyDown={props.actionFN}>
            <button className={props.buttonClass} onClick={props.actionFN}>{props.children}</button>
        </Hotkeys>
    )
}

export default HotButton;
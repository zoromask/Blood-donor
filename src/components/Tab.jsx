import React, {Component} from 'react';

export const Tab = (props) => {
    return (
        <li className={`${props.isActive ? 'active' : ''}`}>
            <a
                onClick={(event) => {
                    event.preventDefault();
                    props.onClick(props.tabIndex);
                }}>
                {props.tabName}
            </a>
        </li>
    )
}

export default Tab;
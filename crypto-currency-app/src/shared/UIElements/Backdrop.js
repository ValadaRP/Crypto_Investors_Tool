import React from 'react';
import ReactDOM from 'react-dom';



const Backdrop = props => {
    return ReactDOM.createPortal(
        <div className="fixed w-full h-screen opacity-75 bg-gray-400 z-10 " onClick={props.onClick}></div>,
        document.getElementById('backdrop-hook')
    );
};

export default Backdrop;


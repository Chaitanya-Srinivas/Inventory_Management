import React from 'react';
import classes from './Modal.module.css'
const Modal = props => {
    return(
<div className={classes.modal}>
    <header className={classes.modalHeader}><h1>{props.title}</h1></header>
    <section className={classes.modalContent}>
    {props.children}
    </section>
    <section className={classes.modalActions}>
        {props.canCancel && <button onClick={props.onCancel}>Cancel</button>}
        {props.canConfirm && <button onClick={props.onConfirm}>{props.confirmText}</button>}
    </section>
</div>)
}

export default Modal;

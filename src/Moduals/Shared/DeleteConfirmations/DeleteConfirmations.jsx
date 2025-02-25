
import React from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button"; 
import img from "../../../assets/images/No-Data.png"; 

export default function DeleteConfirmations({deleteItem,deleteFuncation,show,handleClose}) {
  return (
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
    </Modal.Header>
    <Modal.Body>
      <div className="text-center"> 
        <h2>Delete This {deleteItem}</h2>
        <img src={img} alt="No Data" />
        <p className="text-muted">
          are you sure you want to delete this item ? if you are sure just
          click on delete it
        </p>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="danger" onClick={deleteFuncation}>
        Delete this {deleteItem}
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

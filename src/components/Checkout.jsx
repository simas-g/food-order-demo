import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";
const config = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {},
};
export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const cartTotal = cartCtx.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  const userProgressCtx = useContext(UserProgressContext);
  function handleClose() {
    userProgressCtx.hideCheckout();
  }
  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
  }
  const { data, loading, error, sendRequest } = useHttp(
    "http://localhost:3000/orders",
    config
  );
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customerData = Object.fromEntries(formData.entries());
    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }
  let actions = (
    <>
      <Button textOnly type="button" onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );
  if (loading) {
    actions = <span>Sending order data...</span>;
  }
  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
        className="checkout"
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfuly.</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes.
        </p>
        <p>
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }
  {
  }
  return (
    <Modal
      open={userProgressCtx.progress === "checkout"}
      onClose={handleClose}
      className="checkout"
    >
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)} </p>
        <Input label="Full Name" type="text" id="name" />
        <Input label="Email address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input type="text" id="postal-code" label="Postal Code"></Input>
          <Input label="City" type="text" id="city"></Input>
        </div>
        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}

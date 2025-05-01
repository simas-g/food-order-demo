import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";
import { useActionState } from "react";
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
    clearData()
  }
  const { data, error, sendRequest, clearData } = useHttp(
    "http://localhost:3000/orders",
    config
  );
  async function checkoutAction(prev, formData) {
    const customerData = Object.fromEntries(formData.entries());
    await sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }
  const [formState, formAction, pending ] =  useActionState(checkoutAction, null)
  let actions = (
    <>
      <Button textOnly type="button" onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );
  if (pending) {
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
      <form action={formAction}>
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

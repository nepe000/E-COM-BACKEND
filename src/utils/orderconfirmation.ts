import mongoose from "mongoose";
import { sendEmail } from "./sendemail.util";

interface IOrderDetail {
  _id: mongoose.Types.ObjectId;
  orderId: string;
  items: any[];
  totalAmount: number;
  createdAt: Date;
}
interface IOptions {
  to: string;
  orderDetails: IOrderDetail;
}
export const sendOrderConfirmationEmail = async (options: IOptions) => {
  const { to, orderDetails } = options;

  const html = ` 
  <h1>Your order was placed successfully</h1>
  <p>Order ID: ${orderDetails?.orderId}</p>
  
  <h1>Order:</h1>
  <ol>
    ${orderDetails?.items
      .map(
        (item) =>
          `<li>${item.product.name} - ${item.quantity} * ${item.product.price}</li>`
      )
      .join("")}
  </ol>
  <p>Total: $${orderDetails.totalAmount.toFixed(2)}</p>
  <p> orderDate : ${new Date(orderDetails.createdAt).toLocaleString()}</p>

  <p>Thank you for choosing us!</p>
`;

  const mailOptions = {
    html,
    subject: "order placed ",
    to,
  };
  await sendEmail(mailOptions);
};

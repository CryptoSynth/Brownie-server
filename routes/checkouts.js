const express = require('express');
const uuid = require('uuid');
const { Product } = require('../models/product.model');
const { Order } = require('../models/orders.model');
const { User } = require('../models/users.model');
const {
  createAnAcceptPaymentTransaction
} = require('../gatewayAPI/create-an-accept-payment-transaction');
const config = require('config');
const Easypost = require('@easypost/api');
const api = new Easypost(config.get('shippingKey'));

const router = express.Router();

//POST
router.post('/', async (req, res) => {
  //deconstruct checkout properties
  const { account, items, dataDescriptor, dataValue } = req.body;

  const orderInvoiceId = uuid.v4().substring(0, 8);
  const orderDescription = `${account.firstName} ${
    account.lastName
  } has ordered ${
    items.length < 2
      ? items.length + ' ' + 'item'
      : items.length + ' ' + 'items'
  } `;

  // payment process
  try {
    // (1) validate user items with database products (Security Feature)
    const lineItems = await validUserItems(items);

    // (2) Authroize.net for payment
    const paymentResponse = await createAnAcceptPaymentTransaction(
      orderInvoiceId,
      orderDescription,
      account,
      lineItems,
      dataDescriptor,
      dataValue
    );

    // (3) create & buy shipment
    const shipment = await createShipment(account);
    const shipping_ordered = await shipment.buy(shipment.rates[0].id);

    // (4) create order
    let order = new Order({
      invoiceId: orderInvoiceId,
      shipping_id: shipping_ordered.id,
      tracking_url: shipping_ordered.tracker.public_url,
      description: orderDescription,
      items: lineItems
    });
    await order.save();

    //(5) send order to user's account
    const user = await User.findOne({ 'account.email': account.email }).select({
      __v: 0,
      shipping_id: 0
    });
    user.orders.push(order);
    user.save();

    //(6) send payment Response & orderId
    res.send({ ...paymentResponse, orderId: orderInvoiceId });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

async function validUserItems(items) {
  const validLineItems = [];

  //validate products
  for (let i = 0; i < items.length; i++) {
    try {
      const product = await Product.findById({ _id: items[i].id }).select({
        __v: 0
      });

      //deconstruct product properties and add user quantity
      const user_item = {
        ...product._doc,
        quantity: items[i].quantity
      };

      validLineItems.push(user_item);
    } catch (err) {
      throw err;
    }
  }

  return validLineItems;
}

async function createShipment(account) {
  try {
    //get merchant account
    const merchant_user = await User.findOne({ isAdmin: true });

    //Create From Address Object
    const fromAddress = new api.Address({
      name: `${merchant_user.account.shipping.firstName} ${merchant_user.account.shipping.lastName}`,
      street1: merchant_user.account.shipping.addressOne,
      street2: merchant_user.account.shipping.addressTwo,
      city: merchant_user.account.shipping.city,
      state: merchant_user.account.shipping.state,
      zip: merchant_user.account.shipping.zipCode,
      email: merchant_user.email
    });
    await fromAddress.save();

    //Create To Address Object
    const toAddress = new api.Address({
      name: `${account.shipping.firstName} ${account.shipping.lastName}`,
      street1: account.shipping.addressOne,
      street2: account.shipping.addressTwo,
      city: account.shipping.city,
      state: account.shipping.state,
      zip: account.shipping.zipCode,
      phone: account.shipping.phoneNum,
      email: account.email
    });
    await toAddress.save();

    //Create Parcel Object
    const parcel = new api.Parcel({
      predefined_package: 'MediumFlatRateBox',
      weight: 10
    });
    await parcel.save();

    //create Shipment
    const shipment = new api.Shipment({
      to_address: toAddress,
      from_address: fromAddress,
      parcel: parcel
    });

    return await shipment.save();
  } catch (err) {
    throw err;
  }
}

module.exports = router;

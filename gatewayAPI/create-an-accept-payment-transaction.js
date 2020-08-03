'use strict';

const { APIControllers, APIContracts } = require('authorizenet');
const config = require('config');

function createAnAcceptPaymentTransaction(
  orderInvoiceId,
  orderDescription,
  account,
  items,
  dataDescriptor,
  dataValue
) {
  let merchAuthType = new APIContracts.MerchantAuthenticationType();

  //Use API Key and Secret Key for Authrize Login
  merchAuthType.setName(config.get('authLoginKey'));
  merchAuthType.setTransactionKey(config.get('authTransactionKey'));

  //set token nounce from user?
  let opaqueData = new APIContracts.OpaqueDataType();
  opaqueData.setDataDescriptor(dataDescriptor);
  opaqueData.setDataValue(dataValue);

  let paymentType = new APIContracts.PaymentType();
  paymentType.setOpaqueData(opaqueData);

  //set user order
  let orderDetails = new APIContracts.OrderType();
  orderDetails.setInvoiceNumber(orderInvoiceId); //tmp UUID, change for production to custom Invoice #
  orderDetails.setDescription(orderDescription);

  //set ship to
  let shipTo = new APIContracts.CustomerAddressType();
  shipTo.setFirstName(account.shipping.firstName);
  shipTo.setLastName(account.shipping.lastName);
  shipTo.setAddress(`${account.shipping.addressOne} 
  ${account.shipping.addressTwo}`);
  shipTo.setCity(account.shipping.city);
  shipTo.setState(account.shipping.state);
  shipTo.setZip(account.shipping.zipCode);
  shipTo.setCountry(account.shipping.country);

  //set bill to
  let billTo = new APIContracts.CustomerAddressType();
  billTo.setFirstName(account.billing.firstName);
  billTo.setLastName(account.billing.lastName);
  billTo.setAddress(`${account.billing.addressOne} 
  ${account.billing.addressTwo}`);
  billTo.setCity(account.billing.city);
  billTo.setState(account.billing.state);
  billTo.setZip(account.billing.zipCode);
  billTo.setCountry(account.billing.country);
  billTo.setPhoneNumber(account.billing.phoneNum);

  //set line items and push to lineItemArray
  let lineItemList = [];
  let totalItemPrice = 0;

  items.forEach((item) => {
    let lineItem = new APIContracts.LineItemType();

    lineItem.setItemId(item._id);
    lineItem.setName(item.name);
    lineItem.setDescription(item.description);
    lineItem.setQuantity(item.quantity);
    lineItem.setUnitPrice(item.price);

    lineItemList.push(lineItem);

    totalItemPrice += item.price * item.quantity;
    return totalItemPrice;
  });

  let lineItems = new APIContracts.ArrayOfLineItem();
  lineItems.setLineItem(lineItemList);

  //set total item amount
  let totalAmount = new APIContracts.ExtendedAmountType();
  totalAmount.setAmount(totalItemPrice);
  totalAmount.setName('Total Order Price');
  totalAmount.setDescription('This is the total for each item quantity');

  //set tax amount
  let tax = new APIContracts.ExtendedAmountType();
  tax.setAmount(totalItemPrice * 0.06);
  tax.setName('Sales Tax');
  tax.setDescription('Total Sales tax for items purchased');

  // //set shipping amount
  // let shipping = new APIContracts.ExtendedAmountType();
  // shipping.setAmount(shippingCost);
  // shipping.setName('Shipping Cost');
  // shipping.setDescription('Shipping Rate selected by user');

  let transactionSetting1 = new APIContracts.SettingType();
  transactionSetting1.setSettingName('duplicateWindow');
  transactionSetting1.setSettingValue('120');

  let transactionSetting2 = new APIContracts.SettingType();
  transactionSetting2.setSettingName('emailCustomer');
  transactionSetting2.setSettingValue(true);

  let transactionSettingList = [];
  transactionSettingList.push(transactionSetting1);
  transactionSettingList.push(transactionSetting2);

  let transactionSettings = new APIContracts.ArrayOfSetting();
  transactionSettings.setSetting(transactionSettingList);

  //set transacation request type
  let transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );

  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setOrder(orderDetails);
  transactionRequestType.setBillTo(billTo);
  transactionRequestType.setShipTo(shipTo);
  transactionRequestType.setLineItems(lineItems);
  //doesnt include shipping cost
  transactionRequestType.setAmount(totalAmount.getAmount() + tax.getAmount());
  transactionRequestType.setTransactionSettings(transactionSettings);

  //create request
  let createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchAuthType);
  createRequest.setTransactionRequest(transactionRequestType);

  let ctrl = new APIControllers.CreateTransactionController(
    createRequest.getJSON()
  );

  //Defaults to sandbox
  //ctrl.setEnvironment(SDKConstants.endpoint.production);
  return new Promise((resolve, reject) => {
    ctrl.execute(() => {
      let apiResponse = ctrl.getResponse();
      let response = new APIContracts.CreateTransactionResponse(apiResponse);

      if (response != null) {
        if (
          response.getMessages().getResultCode() !=
          APIContracts.MessageTypeEnum.OK
        ) {
          if (response.getMessages() != null) {
            const errorData = {
              msgCode: response.getMessages().getMessage()[0].getCode(),
              msgText: response.getMessages().getMessage()[0].getText()
            };

            reject(errorData);
          }
        } else {
          if (response.getTransactionResponse().getErrors() != null) {
            const errorData = {
              transErrCode: response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorCode(),
              transErrText: response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorText()
            };

            reject(errorData);
          } else {
            if (
              response.getTransactionResponse() != null &&
              response.getTransactionResponse().getErrors() != null
            ) {
              const errorData = {
                transErrCode: response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorCode(),
                transErrText: response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorText()
              };

              reject(errorData);
            } else {
              const successfulData = {
                transId: response.getTransactionResponse().getTransId(),
                transResCode: response
                  .getTransactionResponse()
                  .getResponseCode(),
                transMesCode: response
                  .getTransactionResponse()
                  .getMessages()
                  .getMessage()[0]
                  .getCode(),
                transDes: response
                  .getTransactionResponse()
                  .getMessages()
                  .getMessage()[0]
                  .getDescription()
              };

              resolve(successfulData);
            }
          }
        }
      } else {
        reject(new Error('Response is null'));
      }
      resolve(response);
    });
  });
}

module.exports.createAnAcceptPaymentTransaction = createAnAcceptPaymentTransaction;

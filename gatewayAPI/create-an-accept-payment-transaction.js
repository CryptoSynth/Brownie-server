'use strict';

const { APIControllers, APIContracts } = require('authorizenet');
const config = require('config');

function createAnAcceptPaymentTransaction(user, dataDescriptor, dataValue) {
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
  orderDetails.setInvoiceNumber(user.order.invoiceId); //tmp UUID, change for production to custom Invoice #
  orderDetails.setDescription(user.order.description);

  //set tax switch statment for letious states and taxes???
  let tax = new APIContracts.ExtendedAmountType();
  tax.setAmount(user.order.tax.amount);
  tax.setName(user.order.tax.name);
  tax.setDescription(user.order.tax.description);

  //set shipping
  let shipping = new APIContracts.ExtendedAmountType();
  shipping.setAmount(user.order.shipping.amount);
  shipping.setName(user.order.shipping.name);
  shipping.setDescription(user.order.shipping.description);

  //set bill to
  let billTo = new APIContracts.CustomerAddressType();
  billTo.setFirstName(user.account.firstName);
  billTo.setLastName(user.account.lastName);
  billTo.setAddress(user.account.address);
  billTo.setCity(user.account.city);
  billTo.setState(user.account.state);
  billTo.setZip(user.account.zipCode);
  billTo.setCountry('USA');

  //set ship to
  let shipTo = new APIContracts.CustomerAddressType();
  shipTo.setFirstName(user.account.firstName);
  shipTo.setLastName(user.account.lastName);
  shipTo.setAddress(user.account.address);
  shipTo.setCity(user.account.city);
  shipTo.setState(user.account.state);
  shipTo.setZip(user.account.zipCode);
  shipTo.setCountry('USA');

  //set line items and push to lineItemArray
  let lineItemList = [];
  let totalOrderPrice = 0;

  user.order.items.forEach((item) => {
    let lineItem_id = new APIContracts.LineItemType();

    lineItem_id.setItemId(item.id);
    lineItem_id.setName(item.name);
    lineItem_id.setDescription(item.description);
    lineItem_id.setQuantity(item.quantity);
    lineItem_id.setUnitPrice(item.price);

    lineItemList.push(lineItem_id);

    totalOrderPrice += item.price * item.quantity;
    return totalOrderPrice;
  });

  let lineItems = new APIContracts.ArrayOfLineItem();
  lineItems.setLineItem(lineItemList);

  let transactionSetting1 = new APIContracts.SettingType();
  transactionSetting1.setSettingName('duplicateWindow');
  transactionSetting1.setSettingValue('120');

  let transactionSetting2 = new APIContracts.SettingType();
  transactionSetting2.setSettingName('recurringBilling');
  transactionSetting2.setSettingValue('false');

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
  transactionRequestType.setAmount(totalOrderPrice);
  transactionRequestType.setLineItems(lineItems);
  transactionRequestType.setOrder(orderDetails);
  transactionRequestType.setTax(tax);
  transactionRequestType.setShipping(shipping);
  transactionRequestType.setBillTo(billTo);
  transactionRequestType.setShipTo(shipTo);
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
          response.getMessages().getResultCode() ==
          APIContracts.MessageTypeEnum.OK
        ) {
          if (response.getTransactionResponse().getMessages() != null) {
            const successfulData = {
              transId: response.getTransactionResponse().getTransId(),
              transResCode: response.getTransactionResponse().getResponseCode(),
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
              const errorData = {
                msgCode: response.getMessages().getMessage()[0].getCode(),
                msgText: response.getMessages().getMessage()[0].getText()
              };

              reject(errorData);
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

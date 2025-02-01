import { requestPortal } from '../../utils/network'
export async function websocketList(data) {
  return data;
}

export async function websocketNotificationList(data) {
  return data;
}

  export async function exceptionMail({obj}) {
    const options = {
      method: "POST",
      body: JSON.stringify(obj),
    };
    const data = await requestPortal(
      `communication/email/send/exception/ui`,
      options
    );
    return data;
  }
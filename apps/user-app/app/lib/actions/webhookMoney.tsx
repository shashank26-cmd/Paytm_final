import axios, { AxiosResponse } from "axios"; // Import AxiosResponse
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
const WEBHOOK_URL ="http://localhost:3003"; // use env variable

export async function webhookMoney(token: string, amount: string): Promise<{ message: string; data?: any } | {errors:any}> { // Add type to the response
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return { message: "Unauthenticated request" };
  }

  const user_identifier = session?.user?.id ? String(session.user.id) : null;

  try {
    const response: AxiosResponse = await axios.post(`${WEBHOOK_URL}/hdfcWebhook`, {
      token,
      user_identifier,
      amount,
    });

    if (response.status === 200) {
      return { message: "Webhook request successful", data: response.data };
    } else {
        return {message:"Webhook request failed", errors: response.data}
    }
  } catch (error) {
    console.error("Error sending webhook request:", error);
    return { message: "Error sending webhook request" };
  }
}
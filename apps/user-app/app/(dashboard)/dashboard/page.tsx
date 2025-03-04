
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import Chartj from "../../../components/Chartj";
export default async function () {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name;

  async function getBalance() {
    const balance = await prisma.balance.findFirst({
      where: {
        userId: Number(session?.user?.id)
      }
    });
    return {
      amount: balance?.amount || 0,
      locked: balance?.locked || 0,
    };
  }

  const b=await getBalance();
  return (
    <div>
      <div
        className="mt-5 ml-3  text-5xl font-sans tracking-wide
 text-indigo-900 font-bold "
      >
        hello {userName}, how are u ?

      </div>
      <div className="mt-9 ml-3 text-2xl font-semibold tracking-normal  text-indigo-700">
      Current Balance 
        <br />
        ₹{(b.amount)/100} 
      </div>

      <Chartj />
      
    </div>
  );
}

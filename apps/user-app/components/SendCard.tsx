"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import ConfirmationModal from "./ConfirmaationModal";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    setLoading(true); // Show loader
    try {
      await p2pTransfer(number, Number(amount) * 100);
      setNumber(""); // Clear input
      setAmount(""); // Clear input
      setIsModalOpen(false); // Close modal
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="h-[90vh]">
      <Center>
        <Card title="Send">
          <div className="min-w-72 pt-2">
            <TextInput
              placeholder="Number"
              label="Number"
              value={number}
              onChange={(value) => setNumber(value)}
            />
            <TextInput
              placeholder="Amount"
              label="Amount"
              value={amount}
              onChange={(value) => setAmount(value)}
            />
            <div className="pt-4 flex justify-center">
              <Button onClick={() => setIsModalOpen(true)}>Send</Button>
            </div>
          </div>
        </Card>
      </Center>

      <ConfirmationModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      >
        <p>Are you sure you want to send ₹{amount} to {number}?</p>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={handleTransfer} >
            {loading ? "Processing..." : "Confirm"}
          </Button>
          <Button onClick={() => setIsModalOpen(false)} >
            Cancel
          </Button>
        </div>
      </ConfirmationModal>
    </div>
  );
}

'use server';
/**
 * @fileOverview A flow for sending SMS notifications for traffic violations.
 *
 * - sendNotification - A function that sends an SMS notification.
 * - ViolationNotificationInput - The input type for the sendNotification function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import twilio from 'twilio';
import { defineFlow, run } from 'genkit';
import 'dotenv/config';

export const ViolationNotificationInputSchema = z.object({
  violationid: z.string().describe('The ID of the violation.'),
  regno: z.string().describe("The vehicle's registration number."),
  violationtype: z.string().describe('The type of violation.'),
  fineamount: z.number().describe('The amount of the fine.'),
  occurdate: z.string().describe('The date the violation occurred.'),
});

export type ViolationNotificationInput = z.infer<typeof ViolationNotificationInputSchema>;

// Ensure environment variables are loaded
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const recipientPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber || !recipientPhoneNumber) {
  console.error('Twilio credentials or recipient phone number are not set in environment variables.');
}

const twilioClient = twilio(accountSid, authToken);

export const sendNotificationFlow = ai.defineFlow(
  {
    name: 'sendNotificationFlow',
    inputSchema: ViolationNotificationInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
  },
  async (violation) => {
    if (!accountSid || !authToken || !twilioPhoneNumber || !recipientPhoneNumber) {
      throw new Error('Twilio environment variables are not configured properly.');
    }
    
    const messageBody = `
      RTO Violation Alert:
      Vehicle: ${violation.regno}
      Violation: ${violation.violationtype}
      Fine: ₹${violation.fineamount}
      Date: ${new Date(violation.occurdate).toLocaleDateString()}
      Please pay the pending challan.
    `;

    try {
      const message = await twilioClient.messages.create({
        body: messageBody,
        from: twilioPhoneNumber,
        to: recipientPhoneNumber, // Hardcoded for prototype
      });
      console.log('SMS sent successfully. SID:', message.sid);
      return { success: true, message: 'Notification sent successfully.' };
    } catch (error: any) {
      console.error('Failed to send SMS:', error);
      return { success: false, message: `Failed to send notification: ${error.message}` };
    }
  }
);

export async function sendNotification(input: ViolationNotificationInput): Promise<{ success: boolean; message: string; }> {
    return await sendNotificationFlow(input);
}

/**
 * WhatsApp API Handler for Twilio Integration
 * 
 * This handler processes WhatsApp message requests and sends them via Twilio.
 * It's designed to be called from the frontend via a fetch request.
 */

import { sendWhatsAppViaTwilio, isValidE164PhoneNumber } from './twilio-config';

export interface WhatsAppSendRequest {
  toPhone: string;
  message: string;
}

export interface WhatsAppSendResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Handle WhatsApp send request
 * This function validates the request and sends the message via Twilio
 */
export async function handleWhatsAppSend(
  request: WhatsAppSendRequest
): Promise<WhatsAppSendResponse> {
  try {
    // Validate input
    if (!request.toPhone || !request.message) {
      return {
        success: false,
        error: 'Missing required fields: toPhone and message',
      };
    }

    // Validate phone number format
    if (!isValidE164PhoneNumber(request.toPhone)) {
      return {
        success: false,
        error: `Invalid phone number format. Expected E.164 format (e.g., +1234567890), got: ${request.toPhone}`,
      };
    }

    // Validate message length (WhatsApp has a 4096 character limit)
    if (request.message.length > 4096) {
      return {
        success: false,
        error: 'Message exceeds maximum length of 4096 characters',
      };
    }

    // Send message via Twilio
    const result = await sendWhatsAppViaTwilio(request.toPhone, request.message);

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in handleWhatsAppSend:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

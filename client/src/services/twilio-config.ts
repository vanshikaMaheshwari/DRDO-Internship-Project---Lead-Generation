/**
 * Twilio Configuration and Helper Functions
 * 
 * Environment variables required:
 * - TWILIO_ACCOUNT_SID: Your Twilio Account SID
 * - TWILIO_AUTH_TOKEN: Your Twilio Auth Token
 * - TWILIO_WHATSAPP_NUMBER: Your Twilio WhatsApp number (e.g., +1234567890)
 */

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
}

/**
 * Get Twilio configuration from environment variables
 */
export function getTwilioConfig(): TwilioConfig {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !whatsappNumber) {
    throw new Error(
      'Missing Twilio configuration. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER environment variables.'
    );
  }

  return {
    accountSid,
    authToken,
    whatsappNumber,
  };
}

/**
 * Send WhatsApp message via Twilio
 */
export async function sendWhatsAppViaTwilio(
  toPhone: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const config = getTwilioConfig();

    // Construct Twilio API URL
    const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;

    // Prepare request body
    const body = new URLSearchParams({
      From: `whatsapp:${config.whatsappNumber}`,
      To: `whatsapp:${toPhone}`,
      Body: message,
    });

    // Make request to Twilio API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Twilio API error:', errorData);
      return {
        success: false,
        error: errorData.message || 'Failed to send WhatsApp message',
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.sid,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending WhatsApp via Twilio:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Validate phone number in E.164 format
 */
export function isValidE164PhoneNumber(phone: string): boolean {
  // E.164 format: +[1-9]([0-9]{1,14})
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}

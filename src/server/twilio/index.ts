import twilio from "twilio";
import { abc } from "../dotenv";

function verificationService() {
  const t = twilio(abc("TWILIO_ACCOUNT_SID"), abc("TWILIO_AUTH_TOKEN")).verify
    .v2;
  const service = t.services(abc("TWILIO_VERIFY_SERVICE_SID"));
  return service;
}
function verifications() {
  return verificationService().verifications;
}
function verificationChecks() {
  return verificationService().verificationChecks;
}
export async function sendToVerify(phone: string) {
  const to = formatPhone(phone);
  const data = await verifications().create({ to, channel: "sms" });
  return data;
}
export async function sendToCheckVerification(phone: string, code: string) {
  const to = formatPhone(phone);
  const data = await verificationChecks().create({ to, code });
  return data;
}
export function formatPhone(phone: string) {
  const formatted = ["+", "1", phone].join("");
  return formatted;
}
type SmsOption = {
  body: string;
  from?: string;
  to: string;
  messagingServiceSid?: string;
};
export async function processSms(option: SmsOption) {
  const t = twilio(abc("TWILIO_ACCOUNT_SID"), abc("TWILIO_AUTH_TOKEN"));
  const sms = await t.messages.create(option);
  return sms;
}

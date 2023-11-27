import { Twilio } from "twilio";
import { abc } from "../dotenv";

function verificationService() {
  const twilio = new Twilio(abc("TWILIO_ACCOUNT_SID"), abc("TWILIO_AUTH_TOKEN"))
    .verify.v2;
  const service = twilio.services(abc("TWILIO_VERIFY_SERVICE_SID"));
  return service;
}
function verifications() {
  return verificationService().verifications;
}
function verificationChecks() {
  return verificationService().verificationChecks;
}
export async function sendToVerify(phone: string) {
  const to = ["+", "1", phone].join("");
  const data = await verifications().create({ to, channel: "sms" });
  return data;
}
export async function sendToCheckVerification(phone: string, code: string) {
  const to = ["+", "1", phone].join("");
  const data = await verificationChecks().create({ to, code });
  return data;
}

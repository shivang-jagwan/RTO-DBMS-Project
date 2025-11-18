from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from twilio.rest import Client

router = APIRouter()

# Twilio credentials from environment variables
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

class AlertRequest(BaseModel):
    source: str | None = None
    license_number: str | None = None
    violation_id: str | None = None

@router.post("/alerts/send", tags=["alerts"])
def send_twilio_alert(req: AlertRequest):
    """Send an SMS alert using Twilio."""
    
    if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER]):
        raise HTTPException(status_code=500, detail="Twilio credentials are not configured on the server.")

    # In a real app, you would look up the recipient's phone number.
    # For this demo, we'll use a fixed number.
    recipient_phone_number = "+918191013531" # Replace with a real number to test

    message_body = (
        f"⚠️ URGENT TRAFFIC VIOLATION NOTICE ⚠️\n"
        f"VIOLATION ID: {req.violation_id}\n"
        f"VEHICLE: {req.license_number}\n"
        f"IMMEDIATE ACTION REQUIRED: Your traffic fine is OVERDUE. Failure to pay within 7 days will result in:\n"
        f"• Vehicle impoundment\n"
        f"• License suspension\n"
        f"• Additional penalties up to 200% of original fine\n"
        f"• Legal proceedings\n"
        f"PAY NOW to avoid severe consequences. This is your FINAL NOTICE."
    )

    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=message_body,
            from_=TWILIO_PHONE_NUMBER,
            to=recipient_phone_number
        )
        
        return {
            "success": True,
            "message_sid": message.sid,
            "status": "sent",
            "recipient": recipient_phone_number
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Twilio SMS failed: {str(e)}")

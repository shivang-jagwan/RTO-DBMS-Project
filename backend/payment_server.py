#!/usr/bin/env python3
"""
Minimal FastAPI server just for payments
"""
import os
import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import razorpay
import logging
import time
from typing import Dict, Any

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Razorpay credentials
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_xxxxxxxx")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "secret_xxxxxxxxx")

# Initialize Razorpay client
try:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    logger.info(f"✅ Razorpay configured with Key ID: {RAZORPAY_KEY_ID[:10]}...")
except Exception as e:
    logger.error(f"❌ Failed to initialize Razorpay: {e}")
    razorpay_client = None

# FastAPI app
app = FastAPI(title="Payment API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PaymentOrderRequest(BaseModel):
    amount: int
    violation_id: str = None
    license_number: str = None

class PaymentOrderResponse(BaseModel):
    order_id: str
    amount: int
    key_id: str
    currency: str = "INR"

@app.get("/")
def root():
    return {"status": "Payment API is running", "message": "OK"}

@app.get("/api/payment/test")
def test_razorpay():
    if not razorpay_client:
        return {"status": "error", "message": "Razorpay not configured"}
    
    try:
        test_order = {"amount": 100, "currency": "INR"}
        order = razorpay_client.order.create(data=test_order)
        return {
            "status": "success",
            "message": "Razorpay connection successful",
            "key_id": RAZORPAY_KEY_ID[:10] + "..."
        }
    except Exception as e:
        return {"status": "error", "message": f"Razorpay error: {str(e)}"}

@app.post("/api/payment/create-order", response_model=PaymentOrderResponse)
def create_order(request: PaymentOrderRequest):
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Payment service not configured")
    
    try:
        if request.amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be positive")
        
        order_data = {
            "amount": request.amount,
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "violation_id": request.violation_id or "N/A",
                "license_number": request.license_number or "N/A",
                "purpose": "Traffic Fine Payment"
            }
        }
        
        logger.info(f"Creating order: {order_data}")
        order = razorpay_client.order.create(data=order_data)
        logger.info(f"Order created: {order['id']}")
        
        return PaymentOrderResponse(
            order_id=order["id"],
            amount=order["amount"],
            key_id=RAZORPAY_KEY_ID,
            currency=order["currency"]
        )
        
    except razorpay.errors.RazorpayError as e:
        logger.error(f"Razorpay error: {e}")
        raise HTTPException(status_code=400, detail=f"Razorpay error: {str(e)}")
    except Exception as e:
        logger.error(f"Order creation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Order creation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Payment API Server...")
    print("📍 URL: http://localhost:8000")
    try:
        # Use simple ASGI server
        uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
    except Exception as e:
        print(f"❌ Error: {e}")
        input("Press Enter...")
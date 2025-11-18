# Quick test script to verify Razorpay setup
import os
import sys
from pathlib import Path

# Add the app directory to the path
sys.path.insert(0, str(Path(__file__).parent / "app"))

print("🔍 Testing Razorpay Configuration...")
print("=" * 50)

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Check environment variables
key_id = os.getenv("RAZORPAY_KEY_ID", "")
key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")

print(f"📊 RAZORPAY_KEY_ID: {'✅ Set' if key_id and key_id != 'rzp_test_xxxxxxxx' else '❌ Not set or placeholder'}")
print(f"📊 RAZORPAY_KEY_SECRET: {'✅ Set' if key_secret and key_secret != 'secret_xxxxxxxxx' else '❌ Not set or placeholder'}")

if key_id == 'rzp_test_xxxxxxxx' or key_secret == 'secret_xxxxxxxxx':
    print("\n⚠️  WARNING: You are using placeholder Razorpay credentials!")
    print("🔧 Please update your .env file with actual Razorpay test credentials:")
    print("   1. Go to https://dashboard.razorpay.com/")
    print("   2. Navigate to Settings → API Keys")  
    print("   3. Generate Test Keys")
    print("   4. Update backend/.env file")
    print("\n" + "=" * 50)
    sys.exit(1)

# Test Razorpay connection
try:
    import razorpay
    client = razorpay.Client(auth=(key_id, key_secret))
    
    # Try to create a test order
    test_order = {
        "amount": 100,  # ₹1 in paise
        "currency": "INR"
    }
    
    order = client.order.create(data=test_order)
    print(f"✅ Razorpay connection successful!")
    print(f"📦 Test order ID: {order['id']}")
    
except ImportError:
    print("❌ Razorpay library not installed")
    print("🔧 Install with: pip install razorpay")
    sys.exit(1)
    
except Exception as e:
    print(f"❌ Razorpay connection failed: {str(e)}")
    print("🔧 Please check your credentials in .env file")
    sys.exit(1)

print("\n🎉 All tests passed! Your Razorpay integration is ready.")
print("=" * 50)
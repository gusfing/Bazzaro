# 🧪 BAZZARO Razorpay Payment Testing Guide

## ✅ **Your Test Configuration**

Your Razorpay test keys are now configured:
- **Key ID**: `rzp_test_S3LkejuJiwDCi7`
- **Key Secret**: `lVDrZu29uMjNFqYHaqwlukE8`

---

## 🧪 **How to Test Payments**

### **Step 1: Access Checkout**
1. **Start dev server**: `npm run dev` (if not running)
2. **Open browser**: `http://localhost:3000`
3. **Add items to cart** from the shop page
4. **Go to checkout**: Click cart → "Proceed to Checkout"

### **Step 2: Fill Customer Details**
```
Email: test@bazzaro.com
Phone: +91 9876543210
First Name: Test
Last Name: Customer
Address: 123 Test Street
City: Mumbai
ZIP: 400001
```

### **Step 3: Select Payment Method**
- ✅ **Select "Online Payment"** (Razorpay)
- ✅ **Click "Pay ₹X Securely"** button

### **Step 4: Test Payment**
Razorpay test modal will open. Use these **test credentials**:

---

## 💳 **Test Card Details**

### **Successful Payment**:
```
Card Number: 4111 1111 1111 1111
Expiry Date: 12/25 (any future date)
CVV: 123 (any 3 digits)
Name: Test User
```

### **Failed Payment**:
```
Card Number: 4000 0000 0000 0002
Expiry Date: 12/25
CVV: 123
Name: Test User
```

### **Insufficient Funds**:
```
Card Number: 4000 0000 0000 9995
Expiry Date: 12/25
CVV: 123
Name: Test User
```

---

## 📱 **Test UPI Payments**

### **Successful UPI**:
- **UPI ID**: `success@razorpay`
- **Amount**: Any amount

### **Failed UPI**:
- **UPI ID**: `failure@razorpay`
- **Amount**: Any amount

---

## 🏦 **Test Net Banking**

### **Successful Net Banking**:
- **Select**: Any bank from the list
- **Use**: Test credentials provided by Razorpay

### **Failed Net Banking**:
- **Select**: "Test Bank (Fail)"
- **Complete**: The test flow

---

## 💰 **Test Wallets**

### **Available Test Wallets**:
- **Paytm**: Use test credentials
- **Mobikwik**: Use test credentials
- **FreeCharge**: Use test credentials

---

## 🧪 **Testing Scenarios**

### **Scenario 1: Successful Payment**
1. **Add items** worth ₹2,000 to cart
2. **Go to checkout** and fill details
3. **Select "Online Payment"**
4. **Use successful test card**: `4111 1111 1111 1111`
5. **Complete payment**
6. **Verify**: Order success page + email confirmation

### **Scenario 2: Failed Payment**
1. **Add items** to cart
2. **Go to checkout** and fill details
3. **Select "Online Payment"**
4. **Use failed test card**: `4000 0000 0000 0002`
5. **Verify**: Error message + stay on checkout

### **Scenario 3: Cash on Delivery**
1. **Add items** to cart
2. **Go to checkout** and fill details
3. **Select "Cash on Delivery"**
4. **Click "Place Order (COD)"**
5. **Verify**: Order success + email confirmation

### **Scenario 4: Wallet + Discount**
1. **Add items** worth ₹3,000 to cart
2. **Apply coupon**: `WELCOME10` (if available)
3. **Enable wallet credit** (if you have balance)
4. **Complete payment** for remaining amount

---

## 📧 **Email Testing**

After successful order, check:
- ✅ **Order confirmation email** sent to customer
- ✅ **Admin notification email** sent to admin
- ✅ **Email contains**: Order details, payment info, tracking

---

## 🔍 **What to Verify**

### **Frontend Checks**:
- ✅ **Payment modal opens** correctly
- ✅ **Loading states** work during payment
- ✅ **Success/error messages** display properly
- ✅ **Redirect to success page** after payment
- ✅ **Order details** saved correctly

### **Console Logs**:
- ✅ **Payment successful** logs
- ✅ **Order saved** to database
- ✅ **Email sent** confirmations
- ✅ **No JavaScript errors**

### **Database Checks**:
- ✅ **Order stored** in Firestore
- ✅ **Customer data** updated
- ✅ **Payment ID** recorded
- ✅ **Order status** set correctly

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: Payment Modal Not Opening**
- **Check**: Browser console for errors
- **Verify**: Razorpay script loaded
- **Solution**: Refresh page and try again

### **Issue 2: "Key ID not configured"**
- **Check**: Environment variables loaded
- **Verify**: `.env.local` file has correct keys
- **Solution**: Restart dev server

### **Issue 3: Payment Successful but Order Not Saved**
- **Check**: Console for database errors
- **Verify**: Firebase configuration
- **Solution**: Check network tab for API calls

### **Issue 4: Email Not Sent**
- **Check**: Resend API key configured
- **Verify**: Console logs for email service
- **Solution**: Check email service configuration

---

## 📊 **Razorpay Test Dashboard**

### **View Test Transactions**:
1. **Login**: https://dashboard.razorpay.com/
2. **Switch to**: Test Mode
3. **Go to**: Payments section
4. **View**: All test transactions

### **Test Transaction Details**:
- **Payment ID**: `pay_xxxxxxxxxx`
- **Amount**: As per your test
- **Status**: Success/Failed
- **Method**: Card/UPI/NetBanking/Wallet

---

## ✅ **Testing Checklist**

- [ ] **Successful card payment** works
- [ ] **Failed card payment** handled properly
- [ ] **UPI payment** works
- [ ] **Cash on Delivery** works
- [ ] **Wallet credit** deduction works
- [ ] **Coupon discount** applied correctly
- [ ] **Order confirmation email** sent
- [ ] **Order saved** in database
- [ ] **Success page** displays correctly
- [ ] **Mobile responsive** checkout works

---

## 🎯 **Next Steps After Testing**

1. **Complete all test scenarios** above
2. **Fix any issues** found during testing
3. **Test on mobile devices** as well
4. **Prepare for production** deployment
5. **Switch to live keys** when ready to go live

---

**Your BAZZARO payment system is now ready for comprehensive testing! 🧪💳**

**Test URL**: http://localhost:3000/#/checkout
**Test Cards**: Use the provided test card numbers
**Expected Result**: Smooth payment flow with order confirmation

**Happy Testing! 🚀**
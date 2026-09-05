# She Ate - Ordering & Collection System Guide

## Overview
Since you don't have delivery vehicles yet, the system now requires customers to order **at least for the next day** and allows them to choose from **three collection time slots**: 06:00 (Morning), 16:00 (Afternoon), and 21:00 (Evening).

---

## How It Works for Customers

### Step 1: Place Items in Cart
- Customer adds menu items to their cart from the menu listing page
- All items are managed locally

### Step 2: Proceed to Checkout
- Click "Proceed to Checkout" button
- Route to cart/checkout page

### Step 3: Select Collection Date
- **Date Picker** shows all available dates **minimum from tomorrow onwards**
- Same-day orders are NOT allowed
- Customer can place orders weeks in advance

### Step 4: Select Collection Time
- Three time slots available:
  - **06:00** (Morning) - Sunrise icon 🌅
  - **16:00** (Afternoon) - Sun icon ☀️
  - **21:00** (Evening) - Moon icon 🌙
- Click desired time slot (it highlights in gold)
- Only ONE time can be selected

### Step 5: Enter Collection Address
- **Street Address** (Required) - E.g., "123 Main Street"
- **Suburb/City** (Required) - E.g., "Johannesburg"
- **Building/Apartment Details** (Optional) - E.g., "Building A, Gate Code 1234"

### Step 6: Review & Confirm
- Summary shows selected date, time, and address
- **Checkout button** is DISABLED until ALL required fields are filled
- Click "Proceed to Payment" to complete

---

## Order Tracking

After checkout, customers can view their order on the **Order Tracking page** with:
- ✅ Collection date (formatted nicely)
- ✅ Collection time (e.g., 16:00)
- ✅ Full collection address
- ✅ Order ID
- ✅ Progress steps:
  1. Order Confirmed
  2. Kitchen Preparing
  3. Ready for Pickup (Active step with pulsing animation)
  4. Collected

---

## Technical Implementation

### Data Structure
Orders are stored in browser localStorage as:
```javascript
{
  date: "2026-04-08",  // ISO format, minimum tomorrow
  time: "16:00",       // One of: 06:00, 16:00, 21:00
  address: {
    line1: "Street address",
    line2: "Suburb/City",
    notes: "Optional building details"
  },
  items: [...],        // Cart items
  subtotal: 0,         // Total cost
  total: 0,
  createdAt: "2026-04-07T10:30:00Z"
}
```

### Key Features

1. **Minimum Date Validation**
   - Date picker automatically sets minimum to tomorrow
   - Users cannot select past dates or today

2. **Form Validation**
   - Checkout button disabled until:
     - ✓ Collection date selected
     - ✓ Collection time selected
     - ✓ Street address entered
     - ✓ Suburb/City entered

3. **Visual Feedback**
   - Selected time slot receives gold border and background
   - Disabled checkout button shows as grayed out
   - Order confirmation shows formatted date (e.g., "Mon, Apr 8")

4. **Local Storage Integration**
   - Order saved to browser localStorage
   - Persists between page refreshes
   - Order tracking page reads from localStorage

---

## Time Slots Explained

| Time | Icon | Use Case |
|------|------|----------|
| 06:00 | 🌅 Sunrise | Early morning pickups |
| 16:00 | ☀️ Sun | Afternoon orders |
| 21:00 | 🌙 Moon | Evening/late orders |

---

## Files Modified

1. **[cart_checkout/code.html](cart_checkout/code.html)**
   - Added date picker (min date = tomorrow)
   - Added time slot selector (3 buttons)
   - Added address input fields
   - Added order validation logic
   - Stores order to localStorage

2. **[order_tracking/code.html](order_tracking/code.html)**
   - Replaced delivery tracking with collection workflow
   - Shows collection date & time
   - Shows collection address
   - Updated progress steps (6 steps → 4 steps)
   - Removed driver details, added collection info

---

## Future Enhancements

### Suggested Additions:
1. **Admin Dashboard**
   - View all orders by date/time
   - Mark orders as "Ready for Pickup"
   - Send customer notifications

2. **Customer Notifications**
   - Email/SMS when order is ready
   - Collection time reminders

3. **Payment Integration**
   - Process payment on checkout
   - Save receipts with order details

4. **Special Requests**
   - Allow notes like "Extra spicy" or "Hold the onions"
   - Already have comment field ready in cart

5. **Availability Management**
   - Set max orders per time slot
   - Block time slots when full
   - Disable dates for maintenance

6. **Past Orders History**
   - Show customer's previous collection orders
   - Easy re-order functionality

---

## Testing Checklist

- [ ] Date picker doesn't allow same-day ordering
- [ ] Date picker allows selection from tomorrow onwards
- [ ] Can't proceed to payment without filling all fields
- [ ] Time slot selection shows visual feedback (gold highlight)
- [ ] Address fields accept various formats
- [ ] Order details display correctly on order tracking page
- [ ] Formatted dates show as "Mon, Apr 8" instead of "2026-04-08"
- [ ] Collection times display correctly (06:00, 16:00, 21:00)

---

## Browser Storage Note

⚠️ **Important**: Data is stored in browser's localStorage only:
- Each browser/device has separate storage
- Clearing browser cache WILL delete orders
- Not suitable for production without backend
- Consider implementing backend database for real deployments

---

## Support

For questions about the ordering system or to customize time slots and validation, refer to the JavaScript code in:
- `cart_checkout/code.html` - Lines ~45-160
- `order_tracking/code.html` - Lines ~170-240

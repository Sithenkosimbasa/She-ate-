# She Ate - Admin Panel Guide

## Overview
The admin panel allows authorized administrators to manage menu items, change prices, and upload images for the menu listing page.

## Accessing Admin Mode

### Method 1: Direct Admin Login
1. Click the menu logo "She Ate" header **5 times in quick succession** (within 3 seconds)
2. A password prompt will appear
3. Enter the admin password: `admin123`
4. Once authenticated, an "Admin Panel" button (⚙️) will appear in the header next to the profile icon
5. Click the admin button to open the admin panel

### Method 2: Manual URL Parameter (Optional Enhancement)
You can also access admin mode by typing in the browser console:
```javascript
adminPanel.setAdminMode(true);
adminPanel.showAdminButton();
```

## Admin Panel Features

### 1. Add New Menu Items
- **Item Name**: Enter the name of the menu item (e.g., "Classic Burger")
- **Price (R)**: Enter price in Rands (e.g., 16.50)
- **Rating**: Enter rating from 0-5 (e.g., 4.8)
- **Description**: Brief description of the item and ingredients
- **Prep Time**: Estimated preparation time (e.g., "15-20 min")
- **Calories**: Nutritional information (e.g., 840 kcal)
- **Image URL**: Paste a direct link to an image URL, OR
- **Upload Image**: Upload a local image file

Click **"Add Item"** to save the new menu item.

### 2. Edit/Delete Items
In the "Current Menu Items" section:
- View all menu items with price and description
- Click **Delete** button on any item to remove it
- Confirm deletion when prompted

### 3. Image Handling
- **URL Method**: Paste a direct link to an image
- **Upload Method**: Select a local image file from your computer
  - Files are converted to data URLs and stored in browser localStorage
  - Supports: JPG, PNG, GIF, WebP

## Data Storage

All menu items are stored locally in the browser's **localStorage**:
- Data persists even after closing the browser
- Each browser/device maintains separate data
- To export: Use browser DevTools Console:
  ```javascript
  console.log(JSON.parse(localStorage.getItem('menuItems')))
  ```

## Quick Tips

1. **Password**: Change `admin123` to a secure password by editing line 431 in code.html
2. **Default Items**: Two sample burger items are pre-loaded on first visit
3. **Data Backup**: LocalStorage data is only stored locally - consider regular backups
4. **Mobile Friendly**: Admin panel works on mobile devices
5. **Security Note**: This is front-end only auth. For production, implement proper backend authentication

## Admin Password Change

To change the admin password:
1. Open `menu_listing/code.html` in an editor
2. Find line with: `this.adminPassword = 'admin123';`
3. Replace `'admin123'` with your new password
4. Save the file

## Troubleshooting

- **Admin button not showing**: Click logo 5 times and enter password correctly
- **Images not displaying**: Use full image URLs (starting with http:// or https://)
- **Data not saving**: Check browser's localStorage settings
- **Deleted items reappear**: Clear browser cache/localStorage

## Security Note

⚠️ **Important**: This implementation uses front-end only authentication. For a production system, you should:
- Implement proper backend authentication
- Use secure API endpoints to manage menu items
- Add user roles and permissions
- Encrypt sensitive data
- Use HTTPS for all communications

---

For support or questions, refer to the code comments in `menu_listing/code.html`

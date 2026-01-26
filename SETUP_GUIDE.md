# Tarispace Admin Dashboard - Setup Guide

## 🎉 Congratulations!

Your admin dashboard is now set up to sync data between the admin panel and the main site!

## 🔧 Setup Steps (5 minutes)

### Step 1: Create a JSONbin.io Account (FREE)

1. Go to **https://jsonbin.io** and click "Sign Up"
2. Create an account (email or GitHub login)
3. Verify your email if required

### Step 2: Create a Storage Bin

1. After logging in, click **"Create Bin"** 
2. In the JSON editor, paste this empty object:
   ```json
   {}
   ```
3. Click **"Create"**
4. **Copy the Bin ID** from the URL (it looks like: `6789abcdef1234567890abcd`)

### Step 3: Create an API Access Key

1. Click on your profile icon → **"API Keys"**
2. Click **"Create Access Key"**
3. Give it a name like "Tarispace Admin"
4. Set permissions to: **Read** and **Update**
5. Click **"Create"**
6. **Copy the Access Key** (it looks like: `$2a$10$xxxxxxxxxxxxxxxxxxxxxx`)

### Step 4: Configure Your Site

1. Open the file: `js/data-sync-service.js`
2. Find these lines at the top (around line 17-18):
   ```javascript
   JSONBIN_BIN_ID: 'YOUR_BIN_ID_HERE',
   JSONBIN_API_KEY: 'YOUR_API_KEY_HERE',
   ```
3. Replace with your actual values:
   ```javascript
   JSONBIN_BIN_ID: '6789abcdef1234567890abcd',  // Your Bin ID
   JSONBIN_API_KEY: '$2a$10$xxxxxxxxxxxxxxxxxxxxxx',  // Your Access Key
   ```
4. Save the file

### Step 5: Upload to Your Hosting

Upload these new/modified files to your hosting:

**New Files to Upload:**
- `js/data-sync-service.js`
- `js/admin-dashboard-v2.js`
- `js/site-content-loader.js`

**Modified Files to Update:**
- `admin.html`
- `index.html`

---

## ✅ What's Fixed Now

### 1. **Admin Changes Now Sync to Main Site**
- Edit profile → Updates on index.html automatically
- Add/edit/delete services → Reflects on main site
- Add/edit/delete projects → Reflects on main site
- Add/edit/delete blog posts → Reflects on main site
- Add/edit/delete skills → Reflects on main site

### 2. **Contact Form Messages**
- When visitors submit the contact form, messages are saved
- Messages appear in Admin Dashboard → Messages section
- NEW badge shows for unread messages
- Notification badge shows unread count

### 3. **About Section Image**
- You can now upload a separate image for the About section
- Go to Admin → Profile → "Change About Photo"

### 4. **Real-time Updates**
- Changes sync automatically
- Other browser tabs get updated when you make changes
- Main site refreshes content periodically

---

## 🔒 How It Works

1. **Cloud Storage**: All your data is stored in JSONbin.io (free tier: 10,000 requests/month)
2. **Admin Dashboard**: When you make changes, they're saved to the cloud
3. **Main Site**: Loads the latest data from the cloud and updates the page
4. **Contact Form**: When visitors submit messages, they're saved to the cloud
5. **Notifications**: You see new messages in the admin dashboard

---

## 📱 Alternative: Use Without Cloud Setup

If you don't want to set up JSONbin.io, the system will still work using **localStorage**. 

**Limitations of localStorage-only mode:**
- Data is stored only in your browser
- Doesn't sync between devices
- Visitors' messages won't be visible to you
- Data is lost if browser data is cleared

---

## 🔧 Troubleshooting

### "Changes not syncing"
1. Check browser console (F12) for errors
2. Verify your JSONbin.io credentials are correct
3. Make sure you have internet connection

### "Can't see contact form messages"
1. Ensure JSONbin.io is configured
2. Check that the contact form has the updated HTML
3. Verify the form submission in browser network tab

### "Images not uploading"
1. Images are stored as base64 (works but adds to data size)
2. Keep images under 2MB for best results
3. Consider using ImgBB for large images (see advanced setup)

---

## 📧 Need Help?

If you encounter issues:
1. Check browser console for error messages
2. Verify all files are uploaded correctly
3. Make sure JSONbin.io credentials are correct
4. Clear browser cache and try again

---

## 🚀 Advanced: Using Image Hosting (Optional)

For better performance with images, you can use ImgBB:

1. Go to **https://api.imgbb.com/**
2. Create a free account
3. Get your API key
4. In `data-sync-service.js`, use:
   ```javascript
   DataSyncService.uploadImage(file, 'YOUR_IMGBB_API_KEY')
   ```

This stores images externally instead of in your JSON data.

---

**Your site is now ready! Upload the files and enjoy managing your portfolio from anywhere! 🎊**

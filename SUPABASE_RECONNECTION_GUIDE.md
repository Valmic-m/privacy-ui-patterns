# Supabase Project Reconnection Guide

## Your New Supabase Credentials

**Project URL:** `https://pzxjfvtmrbslhsmcsbbb.supabase.co`  
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eGpmdnRtcmJzbGhzbWNzYmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDAyMTksImV4cCI6MjA3Nzg3NjIxOX0.UcU9isHP45VY-1tpgBTpGMScia1aL5YBx7wlYxhyHNI`

---

## Part 1: Update Your Local Environment

### Step 1: Update `.env.local` in Your Local Project

1. Navigate to your project root folder on your computer
2. Open or create `.env.local` file
3. Update it with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://pzxjfvtmrbslhsmcsbbb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eGpmdnRtcmJzbGhzbWNzYmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDAyMTksImV4cCI6MjA3Nzg3NjIxOX0.UcU9isHP45VY-1tpgBTpGMScia1aL5YBx7wlYxhyHNI
```

### Step 2: Get Your Service Role Key

You'll also need the **Service Role Key** (this is different from the anon key):

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/pzxjfvtmrbslhsmcsbbb
2. Click on **Settings** (gear icon in sidebar)
3. Click on **API** in the settings menu
4. Find the **service_role** key (under "Project API keys")
5. Copy it and add to your `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Get Your Database URL (Optional but Recommended)

1. In Supabase Dashboard, go to **Settings** > **Database**
2. Scroll down to **Connection string** > **URI**
3. Copy the connection string and add to `.env.local`:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.pzxjfvtmrbslhsmcsbbb.supabase.co:5432/postgres
```

**Note:** Replace `[YOUR-PASSWORD]` with your database password

---

## Part 2: Restore Your Database

### Option A: Restore from Backup File

Since you have `db_cluster-08-07-2025@14-26-39.backup.gz`, follow these steps:

1. **Extract the backup file:**
   ```bash
   gunzip db_cluster-08-07-2025@14-26-39.backup.gz
   ```
   This will create `db_cluster-08-07-2025@14-26-39.backup`

2. **Restore using Supabase Dashboard:**
   - Go to your Supabase Dashboard
   - Navigate to **Database** > **Backups**
   - Unfortunately, Supabase doesn't support direct backup restoration in the free tier
   
3. **Alternative - Use pg_restore (if you have PostgreSQL installed locally):**
   ```bash
   pg_restore --verbose --clean --no-acl --no-owner \
     -h db.pzxjfvtmrbslhsmcsbbb.supabase.co \
     -U postgres \
     -d postgres \
     db_cluster-08-07-2025@14-26-39.backup
   ```
   You'll be prompted for your database password.

### Option B: Fresh Database Setup (Recommended for New Project)

If the backup restore is complicated, you can set up fresh:

1. **Run the database migrations:**
   - Go to Supabase Dashboard: https://supabase.com/dashboard/project/pzxjfvtmrbslhsmcsbbb
   - Click on **SQL Editor** in the sidebar
   - Copy and paste the contents of these files from your GitHub repo (in order):
     1. `supabase/migrations/20240610_initial_schema.sql`
     2. `supabase/migrations/20240610_seed_categories.sql`
   - Run each migration

2. **Import your pattern data:**
   
   After setting up the schema locally, run:
   ```bash
   npm install  # Make sure dependencies are installed
   npm run import:patterns
   ```

---

## Part 3: Update GitHub Repository Settings

### Important: DO NOT Commit `.env.local` to GitHub

The `.env.local` file should be in your `.gitignore` and should **never** be committed.

### For Future Deployment (Vercel/Netlify)

When you're ready to deploy, you'll add these environment variables in your hosting platform's dashboard:

**Vercel:**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL` (optional)

**Netlify:**
1. Go to **Site settings** > **Environment variables**
2. Add the same variables as above

---

## Part 4: Test the Connection

### Step 1: Test Locally

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Try navigating to http://localhost:3000/patterns

4. Check your browser console for any errors

### Step 2: Test Database Connection

Create a simple test file to verify the connection:

**test-connection.js:**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  const { data, error } = await supabase
    .from('pattern_categories')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('Connection error:', error)
  } else {
    console.log('✅ Connection successful! Sample data:', data)
  }
}

testConnection()
```

Run it with:
```bash
node test-connection.js
```

---

## Part 5: Common Issues & Troubleshooting

### Issue: "Invalid API Key"
- **Solution:** Double-check you copied the entire anon key correctly (it's very long)
- Make sure there are no extra spaces or line breaks

### Issue: "Connection refused"
- **Solution:** Verify your project URL is correct
- Check if your Supabase project is active (not paused)

### Issue: "No data showing"
- **Solution:** You need to run the migrations and import data
- Check that Row Level Security policies are set up correctly

### Issue: "Module not found" errors
- **Solution:** Run `npm install` to ensure all dependencies are installed

---

## Summary Checklist

- [ ] Updated `.env.local` with new Supabase URL and anon key
- [ ] Retrieved and added service role key to `.env.local`
- [ ] Got database connection string (optional)
- [ ] Restored database from backup OR ran fresh migrations
- [ ] Imported pattern data using `npm run import:patterns`
- [ ] Tested local development with `npm run dev`
- [ ] Verified patterns are displaying at http://localhost:3000/patterns
- [ ] Confirmed `.env.local` is in `.gitignore` (never commit it!)

---

## Next Steps After Reconnection

1. **Push any code changes to GitHub:**
   ```bash
   git add .
   git commit -m "Updated for new Supabase project"
   git push origin main
   ```

2. **Set up deployment (when ready):**
   - Create Vercel account (free tier)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

---

## Need Help?

If you run into issues:
1. Check the Supabase Dashboard for error logs
2. Look at browser console for frontend errors
3. Check the README.md troubleshooting section
4. Verify all environment variables are set correctly

Your project should now be fully reconnected to the new Supabase instance!

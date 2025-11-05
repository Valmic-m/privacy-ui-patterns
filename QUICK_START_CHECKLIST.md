# Quick Start Checklist - Supabase Reconnection

## ⚡ Do These Steps Right Now (5 minutes)

### 1. Update Your Local .env.local File
- [ ] Copy the `env.local.template` file to your project root
- [ ] Rename it to `.env.local`
- [ ] The URL and anon key are already filled in
- [ ] Go get your service role key (see step 2)

### 2. Get Your Service Role Key
- [ ] Visit: https://supabase.com/dashboard/project/pzxjfvtmrbslhsmcsbbb/settings/api
- [ ] Scroll to "Project API keys"
- [ ] Copy the **service_role** key (not the anon key!)
- [ ] Paste it in `.env.local` replacing `your_service_role_key_here`
- [ ] Save the file

### 3. Verify .env.local is Ignored by Git
- [ ] Check your `.gitignore` file includes `.env.local`
- [ ] Run: `git status` and make sure `.env.local` doesn't show up
- [ ] If it does, add `.env.local` to `.gitignore`

---

## 🗄️ Restore Your Database (Choose One Option)

### Option A: Use Your Backup File (More Complex)
This requires PostgreSQL tools installed locally.

**Pros:** Keeps all your old data
**Cons:** Requires technical setup

See the full guide for instructions.

### Option B: Fresh Setup (Recommended - Easier!)
Start fresh with the schema and re-import data.

**Pros:** Clean, simpler, no tools needed
**Cons:** Need to re-import pattern data

**Steps:**
1. [ ] Go to: https://supabase.com/dashboard/project/pzxjfvtmrbslhsmcsbbb/editor
2. [ ] Click on SQL Editor
3. [ ] Open your GitHub repo in another tab
4. [ ] Copy `supabase/migrations/20240610_initial_schema.sql` → Paste in SQL Editor → Run
5. [ ] Copy `supabase/migrations/20240610_seed_categories.sql` → Paste in SQL Editor → Run
6. [ ] In your terminal: `npm install` (if not already done)
7. [ ] In your terminal: `npm run import:patterns`

---

## ✅ Test Everything Works

### Quick Test
```bash
npm run dev
```

Then visit: http://localhost:3000/patterns

**Expected Result:** You should see the pattern categories displayed

**If you see errors:**
- Check browser console (F12)
- Verify all env variables are set correctly
- Make sure migrations ran successfully

---

## 📤 Commit to GitHub (AFTER Testing Works)

**⚠️ IMPORTANT: Never commit .env.local!**

```bash
# Check what's being committed
git status

# If .env.local shows up, add it to .gitignore first!
echo ".env.local" >> .gitignore

# Commit any other changes
git add .
git commit -m "Update project configuration"
git push origin main
```

---

## 🎯 You're Done When:

- [ ] Local dev server runs without errors (`npm run dev`)
- [ ] You can see patterns at http://localhost:3000/patterns
- [ ] `.env.local` is NOT tracked by git
- [ ] Database has the correct schema (16 categories)
- [ ] Pattern data is imported

---

## 💡 Pro Tips

1. **Bookmark your Supabase Dashboard:**
   https://supabase.com/dashboard/project/pzxjfvtmrbslhsmcsbbb

2. **Keep Your Service Role Key Secret:**
   - Never share it
   - Never commit it to GitHub
   - Only use it in server-side code

3. **Check Database Activity:**
   - Supabase Dashboard > Database > Tables
   - Should see: `pattern_categories`, `patterns`, `examples`, `templates`

4. **If Starting Fresh:**
   - You'll need to re-import your pattern data
   - The scraper tool data is in `privacy_ui_scraper/` folder
   - Run `npm run import:patterns` to import

---

## Need Help?
Check the full SUPABASE_RECONNECTION_GUIDE.md for detailed troubleshooting!

# Permission Requests (Camera / Microphone / Location)

Privacy UI pattern #4

## Examples

### Example 1: Camera Access Dialog 
- **URL**: https://developer.apple.com/design/human-interface-guidelines/camera/
- **Title**: OS‑level
  modal triggered only when an app first calls the camera API; options: “Allow
  Once”, “Allow While Using App”, “Don’t Allow”.
- **Use Case**: Any iOS
  app needing camera for photos, AR, or video.
- **Screenshot**: [example_1_Camera_Access_Dialog.png](./example_1_Camera_Access_Dialog.png)

### Example 2: Camera Runtime Permission 
- **URL**: https://developer.android.com/about/versions/14/behavior-changes-14#runtime-permissions
- **Title**: Full‑screen
  dialog with “While using the app / Only this time / Don’t allow”. Denial
  results in SECURITY_EXCEPTION.
- **Use Case**: Android
  apps recording video or scanning QR codes.
- **Screenshot**: [example_2_Camera_Runtime_Permission.png](./example_2_Camera_Runtime_Permission.png)

### Example 3: Google 
- **URL**: https://support.google.com/chrome/answer/2693767#camera
- **Title**: URL‑bar
  chip + dropdown (“Allow / Block”) appears when site calls getUserMedia({ video:true }); icon
  persists while active.
- **Use Case**: Web
  conferencing apps (e.g., Google Meet, Teams, Zoom).
- **Screenshot**: [example_3_Google.png](./example_3_Google.png)

### Example 4: Screen 
- **URL**: https://support.snapchat.com/en-US/article/camera-access
- **Title**: In‑app
  explanatory screen precedes OS dialog, explaining need for camera with
  illustrative graphic and CTA “Turn On”.
- **Use Case**: Social
  media encouraging real‑time video capture.
- **Screenshot**: [example_4_Screen.png](./example_4_Screen.png)

### Example 5: Prompt 
- **URL**: https://www.meta.com/quest/privacy/
- **Title**: Immersive
  overlay requesting permission to record and stream passthrough; “Allow / Deny
  / Always Allow”.
- **Use Case**: VR
  applications needing mixed‑reality capture.
- **Screenshot**: [example_5_Prompt.png](./example_5_Prompt.png)

### Example 1: Meta 
- **URL**: https://www.facebook.com/settings
- **Title**: Two-step
  flow: (1) Download archive (JSON/HTML) via wizard; (2) Permanent delete or
  temporary deactivate. Clear warnings, progress meter, and email receipts.
- **Use Case**: Social
  networks with rich personal data, photos, connections.
- **Screenshot**: [example_1_Meta.png](./example_1_Meta.png)

### Example 2: Google
  Takeout 
- **URL**: https://takeout.google.com
- **Title**: Multi‑select
  list of 50+ Google services, push or pull export (email link, Drive),
  multiple formats (JSON, MBOX). Separate “Delete a Google Service” panel.
- **Use Case**: Cloud
  ecosystems spanning mail, photos, docs, etc.
- **Screenshot**: [example_2_Google
__Takeout.png](./example_2_Google
__Takeout.png)

### Example 3: Spotify 
- **URL**: https://support.spotify.com/us/article/data-rights-and-privacy-settings/
- **Title**: In‑app
  help flow opens browser wizard: verify email, confirm, five‑day cooling
  period. CSV/JSON export for playlists & listening history.
- **Use Case**: Subscription
  media service retaining long‑term behavioural data.
- **Screenshot**: [example_3_Spotify.png](./example_3_Spotify.png)

### Example 4: Data & Privacy Portal 
- **URL**: https://privacy.apple.com
- **Title**: Authenticated
  web portal with “Get a copy of your data” wizard and one‑click “Delete your
  account”. Provides estimate of file size and time.
- **Use Case**: Device +
  services vendor where Apple ID spans multiple platforms.
- **Screenshot**: [example_4_Data_&_Privacy_Portal.png](./example_4_Data_&_Privacy_Portal.png)

### Example 5: Deactivate Account 
- **URL**: https://help.twitter.com/en/managing-your-account/how-to-deactivate-twitter-account
- **Title**: Deactivation
  screen in Settings: warns deletion after
  30 days; provides link to “Request Your Archive” beforehand.
- **Use Case**: Micro‑blogging
  networks holding large public posting history.
- **Screenshot**: [example_5_Deactivate_Account.png](./example_5_Deactivate_Account.png)


TEXTBRIDGE LIVE — DEPLOYMENT GUIDE

This version uses its own WebSocket server, not a public demo relay.

EASIEST DEPLOYMENT (Render):
1. Create a GitHub account if you do not already have one.
2. Create a new repository named textbridge-live.
3. Upload these files/folders to the repository:
   - server.js
   - package.json
   - public/index.html
4. In Render, choose New > Web Service and connect that GitHub repository.
5. Build command: npm install
6. Start command: npm start
7. Deploy. Open the HTTPS URL Render gives you.
8. Open that exact URL on both your computer and phone.
9. Enter the same room code on both devices and press Connect.
10. Paste text on the computer and press Send to phone. Tap Copy text on the phone.

NOTES:
- Use a long, hard-to-guess room code if you don't want others to join your room.
- This simple server relays text only while both devices are connected; it does not store message history.
- Anyone who guesses your room code may be able to see text sent in that room. Don't send passwords or private data.
- Free hosting providers may sleep when idle, so the first connection after a while can take a little time.

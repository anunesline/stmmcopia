# Auth Testing Playbook

Test users are created via Emergent Google OAuth flow. For backend testing, use mongosh to seed a session token.

## Step 1: Create Test User & Session
```
mongosh "$MONGO_URL" --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  user_type: 'PF',
  cpf: null,
  cnpj: null,
  phone: null,
  address: null,
  is_admin: false,
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend
- GET /api/auth/me with `Authorization: Bearer <token>` or cookie `session_token=<token>`

## Step 3: Browser Testing
Set cookie and navigate to app URL.

# Telegram Bot Authorization for Website Login

## Overview

This feature allows users to log in to the website using their Telegram account. The user clicks a "Login with Telegram" button on the website, which redirects them to the Telegram bot. After authorization in the bot, they receive a link to return to the website already logged in.

## Implementation Details

### Backend Components

#### 1. TelegramLoginService (`MedicationAssist.Application/Services/`)

- **ITelegramLoginService**: Interface for managing temporary login tokens
- **TelegramLoginService**: Implementation using IMemoryCache
- Token validity: 5 minutes
- Stores authorization status (pending/authorized)

#### 2. API Endpoints (`MedicationAssist.API/Controllers/AuthController.cs`)

**POST /api/auth/telegram-login-init**

- Generates anonymous token for authorization
- Returns deep link to Telegram bot: `https://t.me/BotName?start=weblogin_{token}`
- Returns poll URL for checking authorization status
- Response:

```json
{
  "token": "abc123...",
  "deepLink": "https://t.me/BotName?start=weblogin_abc123",
  "expiresInMinutes": 5,
  "pollUrl": "/api/auth/telegram-login-poll/abc123"
}
```

**GET /api/auth/telegram-login-poll/{token}**

- Checks authorization status
- Returns one of three statuses:
  - `"pending"`: User hasn't authorized yet
  - `"authorized"`: User authorized, returns JWT tokens and user data
  - `"expired"`: Token expired or invalid
- Response when authorized:

```json
{
  "status": "authorized",
  "token": "eyJhbGci...",
  "refreshToken": "...",
  "tokenExpires": "2025-12-20T12:00:00Z",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

#### 3. Bot Handler (`MedicationAssist.TelegramBot/Handlers/`)

**AuthHandler.HandleWebLoginAuthorizationAsync**

- Processes `/start weblogin_{token}` deep links
- Verifies user has linked Telegram account
- Marks token as authorized
- Generates WebLoginToken for website redirect
- Sends message with "Login to Website" button

**CommandHandler.HandleStartAsync**

- Routes `weblogin_` parameters to AuthHandler

### Frontend Implementation Example

```typescript
// Login Page Component
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface TelegramLoginData {
  token: string;
  deepLink: string;
  expiresInMinutes: number;
  pollUrl: string;
}

interface TelegramLoginPollResponse {
  status: "pending" | "authorized" | "expired";
  token?: string;
  refreshToken?: string;
  tokenExpires?: string;
  user?: any;
}

export const LoginPage = () => {
  const [showTelegramLogin, setShowTelegramLogin] = useState(false);
  const [telegramLoginData, setTelegramLoginData] =
    useState<TelegramLoginData | null>(null);
  const [polling, setPolling] = useState(false);

  const handleTelegramLogin = async () => {
    try {
      // 1. Initialize Telegram login
      const response = await fetch("/api/auth/telegram-login-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to initialize Telegram login");

      const data: TelegramLoginData = await response.json();
      setTelegramLoginData(data);
      setShowTelegramLogin(true);

      // 2. Start polling for authorization
      startPolling(data.pollUrl);
    } catch (error) {
      console.error("Error initializing Telegram login:", error);
      alert("Failed to initialize Telegram login. Please try again.");
    }
  };

  const startPolling = async (pollUrl: string) => {
    setPolling(true);
    const maxAttempts = 60; // 60 seconds (5 minutes / 5 seconds per attempt)
    const pollInterval = 5000; // 5 seconds

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));

      try {
        const response = await fetch(pollUrl);
        if (!response.ok) throw new Error("Polling failed");

        const result: TelegramLoginPollResponse = await response.json();

        if (result.status === "authorized") {
          // Success! Save tokens and redirect
          localStorage.setItem("accessToken", result.token!);
          localStorage.setItem("refreshToken", result.refreshToken!);

          // Redirect to dashboard
          window.location.href = "/dashboard";
          return;
        }

        if (result.status === "expired") {
          alert("Authorization timeout. Please try again.");
          setShowTelegramLogin(false);
          setPolling(false);
          return;
        }

        // Status is 'pending', continue polling
      } catch (error) {
        console.error("Polling error:", error);
      }
    }

    // Timeout reached
    alert("Authorization timeout. Please try again.");
    setShowTelegramLogin(false);
    setPolling(false);
  };

  const handleCloseTelegramModal = () => {
    setShowTelegramLogin(false);
    setPolling(false);
  };

  return (
    <div className="login-page">
      <h1>Login</h1>

      {/* Traditional login form */}
      <form className="login-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      <div className="divider">
        <span>OR</span>
      </div>

      {/* Telegram login button */}
      <button
        className="telegram-login-btn"
        onClick={handleTelegramLogin}
        disabled={polling}
      >
        <TelegramIcon />
        Login with Telegram
      </button>

      {/* Telegram login modal */}
      {showTelegramLogin && telegramLoginData && (
        <TelegramLoginModal
          data={telegramLoginData}
          polling={polling}
          onClose={handleCloseTelegramModal}
        />
      )}
    </div>
  );
};

// Telegram Login Modal Component
interface TelegramLoginModalProps {
  data: TelegramLoginData;
  polling: boolean;
  onClose: () => void;
}

const TelegramLoginModal = ({
  data,
  polling,
  onClose,
}: TelegramLoginModalProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if user is on mobile
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Login with Telegram</h2>

        {!isMobile ? (
          // Desktop: Show QR code
          <div className="qr-code-container">
            <QRCodeSVG value={data.deepLink} size={256} />
            <p className="instruction">Scan with your phone's Telegram app</p>
          </div>
        ) : (
          // Mobile: Direct link
          <div className="mobile-link-container">
            <a
              href={data.deepLink}
              className="telegram-open-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Telegram
            </a>
          </div>
        )}

        <div className="instructions">
          <h3>Steps:</h3>
          <ol>
            <li>Open the link in Telegram</li>
            <li>Authorize the login request</li>
            <li>Click the login link in the bot</li>
          </ol>
        </div>

        {polling && (
          <div className="waiting-indicator">
            <div className="spinner"></div>
            <p>⏳ Waiting for authorization...</p>
          </div>
        )}

        <p className="expiration-notice">
          ⏱️ Link expires in {data.expiresInMinutes} minutes
        </p>
      </div>
    </div>
  );
};

// Icon component (use actual icon library in production)
const TelegramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.18.943.112.78.89z" />
  </svg>
);
```

### CSS Styles (Optional)

```css
/* Login Page */
.login-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.login-form input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.login-form button {
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #ddd;
}

.divider::before {
  left: 0;
}
.divider::after {
  right: 0;
}

.telegram-login-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #0088cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.telegram-login-btn:hover {
  background-color: #006699;
}

.telegram-login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.qr-code-container,
.mobile-link-container {
  text-align: center;
  margin: 2rem 0;
}

.telegram-open-btn {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #0088cc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1.1rem;
}

.instructions {
  margin: 1.5rem 0;
}

.instructions h3 {
  margin-bottom: 0.5rem;
}

.instructions ol {
  margin-left: 1.5rem;
}

.waiting-indicator {
  text-align: center;
  margin: 1rem 0;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0088cc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.expiration-notice {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
}
```

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Flow                                │
└─────────────────────────────────────────────────────────────────┘

1. User visits website login page
   └─> Clicks "Login with Telegram" button

2. Frontend calls POST /api/auth/telegram-login-init
   └─> Receives token and deep link
   └─> Shows QR code (desktop) or "Open Telegram" button (mobile)
   └─> Starts polling GET /api/auth/telegram-login-poll/{token}

3. User opens Telegram bot via deep link
   └─> Bot receives /start weblogin_{token}
   └─> Bot checks if user has linked Telegram account

4a. If user NOT linked:
    └─> Bot shows error message
    └─> User must register/login first, then link Telegram

4b. If user IS linked:
    └─> Bot marks token as authorized
    └─> Bot generates WebLoginToken
    └─> Bot sends message with "Login to Website" button

5. Frontend polling detects authorization
   └─> Receives JWT tokens and user data
   └─> Saves tokens to localStorage
   └─> Redirects to dashboard

6. User is logged in!
```

## Security Features

1. **Token Expiration**: Anonymous tokens expire in 5 minutes
2. **One-Time Use**: Tokens can only be consumed once
3. **User Verification**: Only users with linked Telegram accounts can authorize
4. **Polling Rate Limit**: Frontend should poll every 5 seconds (not every second)
5. **Cryptographic Security**: Tokens use `RandomNumberGenerator` with 32 bytes

## Prerequisites

- User must have a Telegram account
- User must have previously registered and linked their Telegram account via the website
- Bot must be configured with correct `TelegramBot:BotUsername` in settings

## Testing Steps

1. Register a user account on the website
2. Link Telegram account using existing "Link Telegram" feature
3. Logout from website
4. On login page, click "Login with Telegram"
5. Scan QR code or click "Open Telegram"
6. In bot, click "Login to Website" button
7. Should be automatically logged in on website

## Notes

- **Polling vs WebSocket**: Current implementation uses simple polling. For better UX, consider upgrading to WebSocket/Server-Sent Events
- **Mobile Detection**: Example code detects mobile devices to show appropriate UI
- **Error Handling**: Frontend should handle network errors and timeout gracefully
- **User Feedback**: Show clear loading states and error messages
- **Accessibility**: Ensure QR codes have alt text and keyboard navigation works

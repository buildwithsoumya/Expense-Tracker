import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings

logger = logging.getLogger("email.service")


def send_otp_email(recipient_email: str, otp: str, first_name: str) -> bool:
    """Send OTP email to the user. Returns True on success, False on failure."""

    sender_email = settings.EMAIL_SENDER
    sender_password = settings.EMAIL_PASSWORD

    if not sender_email or not sender_password:
        logger.error("EMAIL_SENDER or EMAIL_PASSWORD not configured in .env")
        return False

    subject = "Password Reset OTP - SmartSpend AI"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {{
          font-family: 'Segoe UI', Arial, sans-serif;
          background: #0d0d14;
          color: #c8cad8;
          margin: 0;
          padding: 0;
        }}
        .wrapper {{
          max-width: 480px;
          margin: 40px auto;
          background: #13131f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          overflow: hidden;
        }}
        .header {{
          background: linear-gradient(135deg, #6c63ff 0%, #48cfad 100%);
          padding: 28px 32px;
        }}
        .header h1 {{
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #fff;
        }}
        .body {{
          padding: 32px;
        }}
        .body p {{
          font-size: 15px;
          line-height: 1.7;
          margin: 0 0 16px;
        }}
        .otp-box {{
          background: rgba(108, 99, 255, 0.12);
          border: 1px solid rgba(108, 99, 255, 0.4);
          border-radius: 10px;
          text-align: center;
          padding: 20px 32px;
          margin: 24px 0;
        }}
        .otp-code {{
          font-size: 42px;
          font-weight: 800;
          letter-spacing: 0.35em;
          color: #a89cff;
          display: block;
        }}
        .otp-label {{
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7a7d99;
          margin-top: 6px;
          display: block;
        }}
        .footer {{
          padding: 20px 32px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 12px;
          color: #555770;
          text-align: center;
        }}
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>SmartSpend AI</h1>
        </div>
        <div class="body">
          <p>Hi <strong>{first_name}</strong>,</p>
          <p>We received a request to reset your password. Use the OTP below to proceed. It expires in <strong>10 minutes</strong>.</p>
          <div class="otp-box">
            <span class="otp-code">{otp}</span>
            <span class="otp-label">One-Time Password</span>
          </div>
          <p>If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p>
        </div>
        <div class="footer">
          &copy; 2026 SmartSpend AI &nbsp;|&nbsp; Do not reply to this email.
        </div>
      </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = recipient_email

    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
        logger.info(f"OTP email sent to {recipient_email}")
        return True
    except Exception as exc:
        logger.error(f"Failed to send OTP email to {recipient_email}: {exc}")
        return False

import aiosmtplib
from email.message import EmailMessage
from app.core.config import settings

async def send_email(to_email: str, subject: str, html_content: str) -> bool:
    # Sends an async email using the SMTP settings from the environment variables.
    try:
        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = settings.SMTP_FROM_EMAIL
        msg['To'] = to_email
        msg.set_content("Please enable HTML to view this email.")
        msg.add_alternative(html_content, subtype='html')

        # Determine TLS / STARTTLS automatically based on port
        # Port 465 is direct TLS, Port 587/25 is STARTTLS
        use_direct_tls = settings.SMTP_PORT == 465
        use_start_tls = not use_direct_tls and (settings.SMTP_PORT in (587, 25) or settings.SMTP_USE_TLS)

        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            use_tls=use_direct_tls,
            start_tls=use_start_tls
        )
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False
        
async def send_notice_email(to_email: str, notice_title: str, notice_link: str) -> bool:
    # Constructs and sends a notice notification email to a user.
    subject = f"New Notice: {notice_title}"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Notice Published</h2>
            <p><strong>{notice_title}</strong></p>
            <p>You can view or download the notice using the link below:</p>
            <p><a href="{notice_link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Notice</a></p>
        </body>
    </html>
    """
    return await send_email(to_email, subject, html_content)

async def send_verification_otp(to_email: str, otp: str) -> bool:
    # Sends verification OTP email to a user.
    subject = "Verify Your Email - HSTU Notice Mailer"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Email Verification</h2>
            <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address:</p>
            <h1 style="background-color: #f2f2f2; padding: 10px; display: inline-block; letter-spacing: 5px; border-radius: 5px;">{otp}</h1>
            <p>This OTP will expire in 10 minutes.</p>
        </body>
    </html>
    """
    return await send_email(to_email, subject, html_content)

async def send_reset_password_otp(to_email: str, otp: str) -> bool:
    # Sends password reset OTP email to a user.
    subject = "Reset Your Password - HSTU Notice Mailer"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to reset your password:</p>
            <h1 style="background-color: #f2f2f2; padding: 10px; display: inline-block; letter-spacing: 5px; border-radius: 5px; color: #d9534f;">{otp}</h1>
            <p>This OTP will expire in 10 minutes. If you did not make this request, you can safely ignore this email.</p>
        </body>
    </html>
    """
    return await send_email(to_email, subject, html_content)

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from jinja2 import Template
import logging

logger = logging.getLogger(__name__)

# Email configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@poppyandteal.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

class EmailService:
    def __init__(self):
        self.smtp_host = SMTP_HOST
        self.smtp_port = SMTP_PORT
        self.smtp_user = SMTP_USER
        self.smtp_password = SMTP_PASSWORD
        self.admin_email = ADMIN_EMAIL
        self.frontend_url = FRONTEND_URL

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        from_email: Optional[str] = None
    ) -> bool:
        """Send an email."""
        try:
            if not self.smtp_user or not self.smtp_password:
                logger.warning("SMTP credentials not configured. Email not sent.")
                return False

            from_email = from_email or self.smtp_user
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = from_email
            msg['To'] = to_email
            
            # Add HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_welcome_email(self, to_email: str, first_name: str) -> bool:
        """Send welcome email to new user."""
        template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }
                .logo { font-size: 24px; font-weight: 300; color: #1d1d1d; }
                .content { padding: 30px 0; }
                .button { display: inline-block; padding: 12px 30px; background: #1d1d1d; color: white; text-decoration: none; border-radius: 50px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Poppy & Teal</div>
                </div>
                <div class="content">
                    <h2>Welcome to Poppy & Teal, {{ first_name }}!</h2>
                    <p>Thank you for joining our community of macramé lovers. We're excited to have you discover our handcrafted collection of bohemian wall art, plant hangers, and home decor.</p>
                    <p>Each piece in our collection is lovingly made by hand using premium, sustainable materials, creating unique macramé art that brings natural beauty and elegance to your space.</p>
                    <a href="{{ frontend_url }}" class="button">Start Shopping</a>
                    <p>If you have any questions, feel free to reach out to us. We're here to help!</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Poppy & Teal. Handcrafted with love for macramé enthusiasts.</p>
                </div>
            </div>
        </body>
        </html>
        """)
        
        html_content = template.render(
            first_name=first_name,
            frontend_url=self.frontend_url
        )
        
        return await self.send_email(
            to_email=to_email,
            subject="Welcome to Poppy & Teal - Your Macramé Journey Begins!",
            html_content=html_content
        )

    async def send_order_confirmation(self, to_email: str, order_data: dict) -> bool:
        """Send order confirmation email."""
        template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }
                .logo { font-size: 24px; font-weight: 300; color: #1d1d1d; }
                .content { padding: 30px 0; }
                .order-details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                .total { font-weight: bold; font-size: 18px; margin-top: 10px; }
                .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Poppy & Teal</div>
                </div>
                <div class="content">
                    <h2>Order Confirmation #{{ order_id }}</h2>
                    <p>Thank you for your order! We're excited to prepare your beautiful macramé pieces.</p>
                    
                    <div class="order-details">
                        <h3>Order Details:</h3>
                        {% for item in items %}
                        <div class="item">
                            <span>{{ item.name }} (x{{ item.quantity }})</span>
                            <span>${{ "%.2f"|format(item.subtotal) }}</span>
                        </div>
                        {% endfor %}
                        <div class="total">
                            Total: ${{ "%.2f"|format(total_amount) }}
                        </div>
                    </div>
                    
                    <p><strong>Shipping Address:</strong><br>
                    {{ shipping_address.street }}<br>
                    {{ shipping_address.city }}, {{ shipping_address.state }} {{ shipping_address.postal_code }}<br>
                    {{ shipping_address.country }}</p>
                    
                    <p>We'll send you another email when your order ships. If you have any questions, please don't hesitate to contact us.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Poppy & Teal. Handcrafted with love for macramé enthusiasts.</p>
                </div>
            </div>
        </body>
        </html>
        """)
        
        html_content = template.render(**order_data)
        
        return await self.send_email(
            to_email=to_email,
            subject=f"Order Confirmation #{order_data['order_id']} - Poppy & Teal",
            html_content=html_content
        )

    async def send_contact_notification(self, contact_data: dict) -> bool:
        """Send notification to admin about new contact form submission."""
        template = Template("""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> {{ name }}</p>
            <p><strong>Email:</strong> {{ email }}</p>
            <p><strong>Subject:</strong> {{ subject }}</p>
            <p><strong>Message:</strong></p>
            <p>{{ message }}</p>
            <p><strong>Submitted:</strong> {{ created_at }}</p>
        </body>
        </html>
        """)
        
        html_content = template.render(**contact_data)
        
        return await self.send_email(
            to_email=self.admin_email,
            subject=f"New Contact: {contact_data['subject']}",
            html_content=html_content
        )

    async def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        """Send password reset email."""
        reset_url = f"{self.frontend_url}/reset-password?token={reset_token}"
        
        template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }
                .logo { font-size: 24px; font-weight: 300; color: #1d1d1d; }
                .content { padding: 30px 0; }
                .button { display: inline-block; padding: 12px 30px; background: #1d1d1d; color: white; text-decoration: none; border-radius: 50px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Poppy & Teal</div>
                </div>
                <div class="content">
                    <h2>Password Reset Request</h2>
                    <p>You've requested to reset your password. Click the button below to set a new password:</p>
                    <a href="{{ reset_url }}" class="button">Reset Password</a>
                    <p>This link will expire in 1 hour. If you didn't request this reset, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Poppy & Teal. Handcrafted with love for macramé enthusiasts.</p>
                </div>
            </div>
        </body>
        </html>
        """)
        
        html_content = template.render(reset_url=reset_url)
        
        return await self.send_email(
            to_email=to_email,
            subject="Password Reset - Poppy & Teal",
            html_content=html_content
        )

# Global email service instance
email_service = EmailService()
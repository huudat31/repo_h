import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import axios from 'axios';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private mailDriver: 'nodemailer' | 'sendgrid' = 'nodemailer';

  constructor(private configService: ConfigService) {
    this.mailDriver = (this.configService.get<string>('MAIL_DRIVER', 'nodemailer') as any) || 'nodemailer';

    if (this.mailDriver === 'nodemailer') {
      const host = this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com');
      const port = Number(this.configService.get<number>('MAIL_PORT', 587));
      const user = this.configService.get<string>('MAIL_USER');
      const pass = this.configService.get<string>('MAIL_PASS');

      if (user && pass) {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });
        this.logger.log(`📧 Nodemailer SMTP initialized with ${host}:${port}`);
      } else {
        this.logger.warn('Nodemailer credentials not fully configured. Emails will be logged to console.');
      }
    } else {
      this.logger.log('📧 SendGrid driver configured.');
    }
  }

  async sendMail(options: SendMailOptions): Promise<boolean> {
    const from = this.configService.get<string>('MAIL_FROM', '"TechStore" <noreply@techstore.vn>');

    try {
      if (this.mailDriver === 'sendgrid') {
        const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
        if (!apiKey) {
          this.logger.warn(`[SendGrid Simulation] To: ${options.to} | Subject: ${options.subject}`);
          return true;
        }

        await axios.post(
          'https://api.sendgrid.com/v3/mail/send',
          {
            personalizations: [{ to: [{ email: options.to }] }],
            from: { email: 'noreply@techstore.vn', name: 'TechStore' },
            subject: options.subject,
            content: [{ type: 'text/html', value: options.html }],
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        );
        this.logger.log(`Sent email via SendGrid to ${options.to}`);
        return true;
      }

      // Nodemailer driver
      if (this.transporter) {
        await this.transporter.sendMail({
          from,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        });
        this.logger.log(`Sent email via Nodemailer to ${options.to}`);
        return true;
      }

      // Local fallback simulator
      this.logger.log(`[Email Simulator] From: ${from} -> To: ${options.to}`);
      this.logger.log(`Subject: ${options.subject}`);
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${options.to}: ${err.message}`);
      return false;
    }
  }

  async sendOrderConfirmationEmail(order: any, customerEmail: string) {
    const itemsHtml = order.items
      ?.map(
        (item: any) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${Number(item.price).toLocaleString('vi-VN')} đ</td>
          </tr>`,
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb; text-align: center;">Xác Nhận Đơn Hàng Thành Công</h2>
        <p>Kính chào quý khách,</p>
        <p>Cảm ơn bạn đã đặt hàng tại <strong>TechStore</strong>. Mã đơn hàng của bạn là: <strong>${order.orderCode}</strong></p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 8px; text-align: left;">Sản phẩm</th>
              <th style="padding: 8px; text-align: center;">Số lượng</th>
              <th style="padding: 8px; text-align: right;">Đơn giá</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right;">
          <p>Phí vận chuyển: <strong>${Number(order.shippingFee || 0).toLocaleString('vi-VN')} đ</strong></p>
          <p style="font-size: 18px; color: #dc2626;">Tổng thanh toán: <strong>${Number(order.finalAmount).toLocaleString('vi-VN')} đ</strong></p>
        </div>

        <p style="margin-top: 20px;">Phương thức thanh toán: <strong>${order.paymentProvider}</strong></p>
        <p>Đơn hàng sẽ sớm được xử lý và giao đến bạn.</p>
      </div>
    `;

    return this.sendMail({
      to: customerEmail,
      subject: `[TechStore] Xác nhận đơn hàng #${order.orderCode}`,
      html,
    });
  }
}

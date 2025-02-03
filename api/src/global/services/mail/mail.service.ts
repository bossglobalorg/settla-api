import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { MailConfig } from 'src/services/app-config/configuration';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';

type MailOptions = Mail.Options;

@Injectable()
export class MailService {
  private readonly fromValue: string;
  private transport: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly configService: ConfigService) {
    const {
      from,
      transportOptions: {
        host,
        port,
        auth: { user, pass },
      },
    } = configService.get<MailConfig>('mail') as MailConfig;

    this.fromValue = from;
    this.transport = createTransport({
      host,
      port,
      auth: {
        user,
        pass,
      },
    });
  }

  public async send(options: MailOptions): Promise<string> {
    try {
      console.log('Sending email with options:', options); // Debug log
      const result = await this.transport.sendMail(options);
      console.log('Email sent successfully:', result); // Debug log
      return result.response;
    } catch (error) {
      console.error('Failed to send email:', error); // Error log
      throw error;
    }
  }

  public from(): string {
    return this.fromValue;
  }
}

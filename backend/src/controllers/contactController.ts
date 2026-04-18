import { Request, Response } from 'express';
import { z } from 'zod';
import { sendContactInquiry } from '@utils/emailService';
import { sendSuccess, sendError } from '@utils/response';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const handleContactForm = async (req: Request, res: Response) => {
  try {
    const validatedData = contactSchema.parse(req.body);

    await sendContactInquiry(validatedData);

    return sendSuccess(res, 'Your inquiry has been sent successfully! 💕');
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Use .issues for the raw array or .format() for a nested object
      // We take the first issue's message for a clean API response
      const firstIssue = error.issues[0];
      return sendError(res, firstIssue.message, 400);
    }

    return sendError(res, 'Internal server error while sending email.', 500);
  }
};

import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import PDFDocument from 'pdfkit';
import Razorpay from 'razorpay';
// import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password',
  },
});

// 1. Create Order API
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Helper function to generate PDF
const generatePDF = (donorName: string, amount: number, cause: string, date: string, txnId: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Certificate Design
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#4285F4');
    doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke('#34A853');

    // Header
    doc.fontSize(24).fillColor('#1a1a1a').text('Pratham Vijay Janseva Charitable Trust', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#666666').text('Empowering Lives, Inspiring Hope', { align: 'center' });
    doc.moveDown(2);

    // Title
    doc.fontSize(28).fillColor('#EA4335').text('80G Donation Receipt', { align: 'center' });
    doc.moveDown(2);

    // Body
    doc.fontSize(16).fillColor('#1a1a1a').text('This certificate is proudly presented to', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(22).fillColor('#4285F4').text(donorName, { align: 'center', underline: true });
    doc.moveDown(1);
    doc.fontSize(16).fillColor('#1a1a1a').text(`for their generous contribution of ₹${amount}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.text(`towards ${cause}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.text(`on ${date}.`, { align: 'center' });
    doc.moveDown(2);

    // Transaction Details
    doc.fontSize(12).fillColor('#666666').text(`Transaction ID: ${txnId}`, { align: 'center' });
    doc.moveDown(4);

    // Footer
    doc.fontSize(10).fillColor('#1a1a1a').text('Donations are eligible for tax deduction under section 80G.', { align: 'center' });
    doc.moveDown(2);
    
    // Signatures
    const signatureY = doc.y;
    doc.text('_______________________', 100, signatureY);
    doc.text('Authorized Signatory', 100, signatureY + 15);
    
    doc.text('_______________________', doc.page.width - 250, signatureY);
    doc.text('Trustee', doc.page.width - 250, signatureY + 15);

    doc.end();
  });
};

// 2. Verify Payment API
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      donorDetails 
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';

    // Verify Signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ status: 'failure', message: 'Transaction not legit!' });
    }

    // Payment is successful, generate PDF
    const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const pdfBuffer = await generatePDF(
      donorDetails.name,
      donorDetails.amount,
      donorDetails.cause,
      date,
      razorpay_payment_id
    );

    // Send Email with PDF attachment
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        await transporter.sendMail({
          from: process.env.FROM_EMAIL || '"Charity Trust" <noreply@charitytrust.org>',
          to: donorDetails.email,
          subject: 'Thank you for your donation - 80G Receipt',
          text: `Dear ${donorDetails.name},\n\nThank you for your generous donation of ₹${donorDetails.amount} towards ${donorDetails.cause}. Please find your 80G donation receipt attached.\n\nRegards,\nPratham Vijay Janseva Charitable Trust`,
          attachments: [
            {
              filename: `Donation_Receipt_${razorpay_payment_id}.pdf`,
              content: pdfBuffer,
            },
          ],
        });
        console.log('Email sent successfully to', donorDetails.email);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // We don't fail the payment verification if email fails, but we log it.
      }
    } else {
      console.log('SMTP not configured, skipping email delivery.');
    }

    // Send PDF back to client for direct download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Donation_Receipt_${razorpay_payment_id}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// async function startServer() {
// //   Vite middleware for development
//   if (process.env.NODE_ENV !== 'production') {
//     const vite = await createViteServer({
//       server: { middlewareMode: true },
//       appType: 'spa',
//     });
//     app.use(vite.middlewares);
//   } else {
//     const distPath = path.join(process.cwd(), 'dist');
//     app.use(express.static(distPath));
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(distPath, 'index.html'));
//     });
//   }

//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//   });
// }

// API to dynamically scan and fetch Shiv Jayanti media
app.get('/api/gallery/shiv-jayanti', (req, res) => {
  const baseDir = path.join(process.cwd(), 'images', 'live', 'events', 'shiv-jayanti');
  const subfolders = [
    { folder: 'haldi kumkum', key: 'haldi kumkum' },
    { folder: 'awards', key: 'awards' },
    { folder: 'social message', key: 'social message' },
    { folder: 'games & activities', key: 'games & activities' },
    { folder: 'food distribution', key: 'food distribution' }
  ];
  
  const mediaList: { category: string; type: 'image' | 'video'; src: string; name: string }[] = [];

  try {
    subfolders.forEach(({ folder, key }) => {
      const folderPath = path.join(baseDir, folder);
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        files.forEach(file => {
          const ext = path.extname(file).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.ogg'].includes(ext)) {
            const type = (ext === '.mp4' || ext === '.webm' || ext === '.ogg') ? 'video' : 'image';
            mediaList.push({
              category: key,
              type,
              src: `images/live/events/shiv-jayanti/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`,
              name: file
            });
          }
        });
      }
    });
    res.json(mediaList);
  } catch (error) {
    console.error('Error reading gallery files:', error);
    res.status(500).json({ error: 'Failed to read gallery files' });
  }
});

// API to dynamically scan and fetch KEM Hospital media
app.get('/api/gallery/kem-hospital', (req, res) => {
  const baseDir = path.join(process.cwd(), 'images', 'live', 'events', 'kem hospital');
  const mediaList: { type: 'image' | 'video'; src: string; name: string }[] = [];

  try {
    if (fs.existsSync(baseDir)) {
      const files = fs.readdirSync(baseDir);
      files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.ogg'].includes(ext)) {
          const type = (ext === '.mp4' || ext === '.webm' || ext === '.ogg') ? 'video' : 'image';
          mediaList.push({
            type,
            src: `images/live/events/kem hospital/${encodeURIComponent(file)}`,
            name: file
          });
        }
      });
    }
    res.json(mediaList);
  } catch (error) {
    console.error('Error reading KEM Hospital gallery files:', error);
    res.status(500).json({ error: 'Failed to read KEM Hospital gallery files' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

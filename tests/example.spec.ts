import { test, expect, Page } from '@playwright/test';
import * as nodemailer from 'nodemailer';


const websites = [
  'https://google.com.tr'
];


async function sendEmail(screenshotPath: string, websiteUrl: string) {
  
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'portalgrup.test.otomasyon@gmail.com', 
      pass: 'isye jwlg zokt waow', 
    },
  });

  
  const recipients = [
    
    'guney.kaya@portalgrup.com'
    
  ];

  const sadecedomain = new URL(websiteUrl).hostname;
  const screenshotName = `${new URL(websiteUrl).hostname}.png`;

  
  const mailOptions = {
    from: 'portalgrup.test.otomasyon@gmail.com',
    to: recipients.join(','), 
    subject: `Siteye Ulaşılamadı: ${sadecedomain}`,
    text: `Siteye Ulaşılamadı: ${websiteUrl}. Ekran görüntüsü ektedir. \n\n-PG Test Ekibi, Site Kontrol Test Otomasyonu \n\n`,
    attachments: [
      {
        filename: screenshotName, 
        path: screenshotPath,
      },
    ],
  };

  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-posta gönderildi: ${websiteUrl}`);
  } catch (error: any) {
    console.error(`E-posta gönderilemedi: ${error.message}`);
  }
}


websites.forEach((url) => {
  test(` ${url}`, async ({ page }) => {
    let isSiteWorking = false;
    const maxAttempts = 2;   //deneme sayisi
    let response;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        response = await page.goto(url, { waitUntil: 'domcontentloaded' });
        if (response && response.ok()) {
          console.log(`[[[[OK]]]] ${new URL(url).hostname} - Statü Kodu: ${response.status()} (Kontrol ${attempt})`);
          isSiteWorking = true;
          break;
        } else {
          console.error(`Kontrol ${attempt}:Siteye erişilmiyor: ${url} - Statü Kodu: ${response ? response.status() : 'No response'}`);
        }
      } catch (error: any) {
        console.error(`Kontrol ${attempt}:Siteye erişilmiyor: ${url} - Hata: ${error.message}`);
      }

      if (attempt < maxAttempts) {
        
        await new Promise(r => setTimeout(r, 10000));
        
      }
    }

    if (!isSiteWorking) {
      const screenshotPath = `screenshots/${new URL(url).hostname}.png`;
      await page.screenshot({ path: screenshotPath });
      await sendEmail(screenshotPath, url);
    }
  });
});

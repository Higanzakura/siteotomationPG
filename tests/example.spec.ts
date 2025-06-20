import { test, expect, Page } from '@playwright/test';
import { Domain } from 'domain';
import { url } from 'inspector';
import * as nodemailer from 'nodemailer';


const websites = [
  'https://fenerium.com/',
  'https://www.fenerbahce.org/',
  'https://www.dynavit.com.tr/',
  'https://www.sunpettr.com.tr/',
  'https://eczaneden.com/',
  'https://otobil.opet.com.tr/',
  'https://www.selpak.com.tr/',
  'https://www.avis.com.tr/',
  'https://www.budget.com.tr/',
  'https://www.otokoc.com.tr/',
  'https://www.koc.com.tr/',
  'https://www.kocailem.com/',
  "https://www.florence.com.tr/",
  "https://www.yapikrediyarinlarakartopu.com.tr/",
  "https://www.avisfilomaestro.com.tr/",
  "https://www.avisfilo.com/",
  "https://www.amerikanhastanesi.org/",
  "https://www.amerikanhastanesi.org/bodrum-amerikan-hastanesi",
  "https://www.amerikanhastanesi.org/amerikan-tip-merkezi",
  "https://www.kuh.ku.edu.tr/",
  "https://www.yapikrediportfoy.com.tr/",
  "https://www.tofasanadoluarabalarimuzesi.com",
  "https://www.opar.com/",
  "https://www.tofas.com.tr/", 
  "https://www.alfaromeo.com.tr/",
  "https://www.otomobil.fiat.com.tr/",
  "https://www.jeep.com.tr/",
  "https://www.kocfiatkredi.com.tr/",
  "https://online.kocfiatkredi.com.tr/",
  "https://www.otokar.com.tr/",
  "https://commercial.otokar.com.tr/",
  "https://defense.otokar.com.tr/",
  "https://www.otokarcentralasia.kz/en",
  "https://www.tokenflex.com.tr/",
  "https://www.tokeninc.com/",
  "https://oderopay.com.tr/",
  "https://www.turktraktor.com.tr/",
  "https://caseih.com.tr/",
  "https://www.caseismakineleri.com/",
  "https://www.newholland.com.tr/",
  "https://www.newhollandismakineleri.com/",
  "https://kiralama.tofas.com.tr/",
  "https://randevu.jeep.com.tr/",
  "https://randevu.fiat.com.tr/",
  "https://randevu.alfaromeo.com.tr/",
  "https://www.sanipakprofessional.com.tr/",
  "https://www.sanipak.com.tr/",
  "https://egos.com.tr/",
  "https://defans.com.tr/",
  "https://detan.com.tr/",
  "https://selin.com.tr/",
  "https://www.hijyendemukemmellik.com/",
  "https://www.budget.hu/en", 
  "https://www.solo.com.tr/",
  "https://hayatfinans.com.tr/",
  "https://sporokullari.fenerbahce.org/",
  "https://www.kokoa.com.tr",
  "https://yelken.fenerbahce.org/",
  "https://www.bigaiaturkiye.com/",
  "https://www.selfit.com.tr/",
  "https://www.eczacibasiilac.com.tr/"
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
    //,'serkan.cosgun@portalgrup.com','muhammed.guner@portalgrup.com','mizgin.esen@portalgrup.com','camay.duran@portalgrup.com','esra.alkasan@portalgrup.com','nejlanur.odabasi@portalgrup.com'
    //, 'projectmn@portalgrup.com'   
    
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
  } catch (error) {
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
      } catch (error) {
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

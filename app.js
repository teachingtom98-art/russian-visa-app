/**
 * Russian Visa Planner & Preparation Workspace
 * Local-First IndexedDB Document Storage, State Management, Exporter & Multi-State Workflow
 */

const STORAGE_KEY = 'russian_visa_workspace_session_v5';
const THEME_KEY = 'russian_visa_theme';
const TOUR_SEEN_KEY = 'russian_visa_tour_seen';

const IDB_NAME = 'russian_visa_workspace_db';
const IDB_VERSION = 1;
const IDB_STORE = 'documents';

// ============================================================================
// IndexedDB Local Storage Wrapper (Safe, Local-First File Handling)
// ============================================================================

let dbInstance = null;

function getDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      return resolve(dbInstance);
    }
    const request = indexedDB.open(IDB_NAME, IDB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB Error:', event.target.error);
      reject(event.target.error);
    };
  });
}

async function idbStoreFile(id, file, dataUrl) {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const record = {
        id: id,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        lastModified: file.lastModified,
        dataUrl: dataUrl,
        savedAt: new Date().toISOString()
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to store file in IndexedDB:', err);
    throw err;
  }
}

async function idbGetFile(id) {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to get file from IndexedDB:', err);
    return null;
  }
}

async function idbDeleteFile(id) {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to delete file from IndexedDB:', err);
  }
}

async function idbClearAll() {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to clear IndexedDB:', err);
  }
}

// ============================================================================
// Visa Types & Standardized Task Requirements with Official Sources
// ============================================================================

const VISA_DATA = {
  tourist: {
    id: 'tourist',
    title: 'Tourist Visa',
    category: 'Tourism & Sightseeing',
    tasks: [
      {
        id: 't1',
        title: 'Valid Original Passport',
        standardName: '01_Passport_Data_Page',
        hint: 'Physically undamaged, 2+ consecutive blank visa pages, valid 6+ months past visa expiry.',
        status: 'not-started',
        source: 'MID Consular Regs',
        sourceUrl: 'https://www.mid.ru/en/',
        verifiedDate: 'Aug 2026',
        guidance: 'Upload a clear scan or photo of your passport biometric photo page. Must show all 4 corners and machine-readable zone (MRZ).'
      },
      {
        id: 't2',
        title: 'Tourist Voucher & Confirmation of Reception',
        standardName: '04_Tourist_Voucher_Confirmation',
        hint: 'Official Tourist Confirmation issued by an authorized Russian tour operator registered in the Federal Unified Register of Tour Operators.',
        status: 'not-started',
        source: 'FMS/MVD Order 335',
        sourceUrl: 'https://mvd.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Must state your full passport details, planned travel dates, hotel reservations, and official Russian MBT/PTO reference license number.'
      },
      {
        id: 't3',
        title: 'Electronic Visa Application (EVA) Form',
        standardName: '03_Electronic_Visa_Application_EVA',
        hint: 'Completed and submitted online at visa.kdmid.ru, printed on A4 paper, dated and signed.',
        status: 'not-started',
        source: 'visa.kdmid.ru',
        sourceUrl: 'https://visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Ensure your name spelling, passport number, and host organization details match your tourist confirmation exactly.'
      },
      {
        id: 't4',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'One recent standard colour biometric photo taken within the last 6 months against a plain light/white background.',
        status: 'not-started',
        source: 'ICAO / MID Criteria',
        sourceUrl: 'https://visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'The head must measure between 30mm and 36mm from crown to chin (70–80% of photo). No tinted glasses or decorative headgear.'
      },
      {
        id: 't5',
        title: 'Travel Medical Insurance Certificate',
        standardName: '05_Medical_Insurance_Policy',
        hint: 'Mandatory policy covering at least €30,000 for emergency medical care valid across the Russian Federation.',
        status: 'not-started',
        source: 'Law No. 114-FZ',
        sourceUrl: 'https://www.mid.ru/en/',
        verifiedDate: 'Aug 2026',
        guidance: 'Required for UK, EU, and Schengen citizens. The policy document must explicitly state coverage for the Russian Federation.'
      },
      {
        id: 't6',
        title: 'Consular & Application Fee Receipt',
        standardName: '06_Consular_Fee_Payment_Receipt',
        hint: 'Proof of fee payment for standard (4–20 working days) or express consular processing.',
        status: 'not-started',
        source: 'Consular Tariff',
        sourceUrl: 'https://russia-visacentre.com',
        verifiedDate: 'Aug 2026',
        guidance: 'Payment is typically made by card or bank transfer during appointment booking at the Visa Application Centre.'
      }
    ]
  },
  business: {
    id: 'business',
    title: 'Business Visa',
    category: 'Commercial & Meetings',
    tasks: [
      {
        id: 'b1',
        title: 'Valid Original Passport',
        standardName: '01_Passport_Data_Page',
        hint: 'Valid for at least 6 months past visa expiry with 2 blank pages.',
        status: 'not-started',
        source: 'MID Consular Regs',
        sourceUrl: 'https://www.mid.ru/en/',
        verifiedDate: 'Aug 2026',
        guidance: 'Ensure sufficient blank pages for multiple entry/exit consular stamps.'
      },
      {
        id: 'b2',
        title: 'Official Russian Business Invitation',
        standardName: '04_Official_Business_Invitation_MVD',
        hint: 'Electronic telex or MVD/GUVM electronic invitation code issued to your sponsoring Russian company.',
        status: 'not-started',
        source: 'MVD / MID Telex',
        sourceUrl: 'https://mvd.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Must be officially registered through the Russian Ministry of Internal Affairs (MVD) or Ministry of Foreign Affairs (MID).'
      },
      {
        id: 'b3',
        title: 'Electronic Visa Application (EVA) Form',
        standardName: '03_Electronic_Visa_Application_EVA',
        hint: 'Completed at visa.kdmid.ru with employer and host details.',
        status: 'not-started',
        source: 'visa.kdmid.ru',
        sourceUrl: 'https://visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'State the official Russian host organization name, TIN/INN number, and exact registered address.'
      },
      {
        id: 'b4',
        title: 'Company Cover Letter',
        standardName: '05_Company_Introduction_Cover_Letter',
        hint: 'Letter from your employer detailing your position, trip purpose, and financial guarantee.',
        status: 'not-started',
        source: 'Consular Guidelines',
        sourceUrl: 'https://russia-visacentre.com',
        verifiedDate: 'Aug 2026',
        guidance: 'Must be printed on official company letterhead, stamped, and signed by an authorized director.'
      },
      {
        id: 'b5',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'One recent standard passport photograph meeting biometric specs.',
        status: 'not-started',
        source: 'MID Specs',
        sourceUrl: 'https://visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Glued securely to the designated box on the printed EVA application form.'
      },
      {
        id: 'b6',
        title: 'Travel Medical Insurance Policy',
        standardName: '06_Medical_Insurance_Policy',
        hint: 'Minimum €30,000 cover for Russian territory.',
        status: 'not-started',
        source: 'Law No. 114-FZ',
        sourceUrl: 'https://www.mid.ru/en/',
        verifiedDate: 'Aug 2026',
        guidance: 'Policy must cover the entire period of your first planned visit.'
      }
    ]
  },
  work: {
    id: 'work',
    title: 'Work Visa (Employment)',
    category: 'Official Employment & HQS',
    tasks: [
      {
        id: 'w1',
        title: 'Valid Passport (18+ Months Validity)',
        standardName: '01_Passport_Data_Page',
        hint: 'Russian work visas require a minimum of 18 months passport validity from the start date.',
        status: 'not-started',
        source: 'MVD Work Migration',
        sourceUrl: 'https://mvd.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Check passport expiry carefully as work visas cannot exceed passport validity.'
      },
      {
        id: 'w2',
        title: 'Original MVD / GUVM Work Invitation',
        standardName: '04_MVD_Work_Invitation',
        hint: 'Issued by the Russian Ministry of Internal Affairs following work permit approval.',
        status: 'not-started',
        source: 'MVD GUVM',
        sourceUrl: 'https://mvd.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Obtained directly by your sponsoring Russian employer.'
      },
      {
        id: 'w3',
        title: 'Original HIV Negative Medical Certificate',
        standardName: '05_HIV_Negative_Certificate',
        hint: 'Valid medical test certificate proving HIV-negative status, issued within the last 90 days.',
        status: 'not-started',
        source: 'Federal Law No. 38-FZ',
        sourceUrl: 'https://www.mid.ru/en/',
        verifiedDate: 'Aug 2026',
        guidance: 'Must contain official doctor signature, laboratory stamp, and match passport information.'
      },
      {
        id: 'w4',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'One recent standard colour biometric photo on light background.',
        status: 'not-started',
        source: 'MID Specs',
        sourceUrl: 'https://visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Standard 35x45mm biometric photograph on light background.'
      },
      {
        id: 'w5',
        title: 'Electronic Visa Application Form',
        standardName: '03_Electronic_Visa_Application_EVA',
        hint: 'Completed work visa application at visa.kdmid.ru.',
        status: 'not-started',
        source: 'visa.kdmid.ru',
        sourceUrl: 'https://visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Specify employer details and work permit registration number.'
      },
      {
        id: 'w6',
        title: 'Employment Contract Copy',
        standardName: '06_Employment_Contract',
        hint: 'Signed contract or High Qualified Specialist (HQS) agreement.',
        status: 'not-started',
        source: 'Labour Code / HQS',
        sourceUrl: 'https://mvd.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Copy signed by both employee and sponsoring employer.'
      }
    ]
  },
  student: {
    id: 'student',
    title: 'Student / Study Visa',
    category: 'Education & Exchange',
    tasks: [
      {
        id: 's1',
        title: 'Passport (18+ Months Validity)',
        standardName: '01_Passport_Data_Page',
        hint: 'At least 18 months validity from visa commencement date.',
        status: 'not-started',
        source: 'MID Consular Regs',
        sourceUrl: 'https://www.mid.ru/en/',
        verifiedDate: 'Aug 2026',
        guidance: 'Must contain at least 2 clean visa pages.'
      },
      {
        id: 's2',
        title: 'Official Ministry of Education / MVD Invitation',
        standardName: '04_Ministry_University_Invitation',
        hint: 'Issued directly to the university and consular database.',
        status: 'not-started',
        source: 'Minobrnauki / MVD',
        sourceUrl: 'https://mvd.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'University international office initiates this with the Russian ministry.'
      },
      {
        id: 's3',
        title: 'HIV Negative Certificate',
        standardName: '05_HIV_Negative_Certificate',
        hint: 'Medical test certificate issued within 90 days of application.',
        status: 'not-started',
        source: 'Law No. 38-FZ',
        sourceUrl: 'https://www.mid.ru/en/',
        verifiedDate: 'Aug 2026',
        guidance: 'Mandatory for all student visas.'
      },
      {
        id: 's4',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'One recent standard colour biometric photo.',
        status: 'not-started',
        source: 'MID Specs',
        sourceUrl: 'https://visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Standard 35x45mm biometric photograph on light background.'
      },
      {
        id: 's5',
        title: 'University Admission Contract / Letter',
        standardName: '06_University_Admission_Contract',
        hint: 'Formal proof of university course enrollment.',
        status: 'not-started',
        source: 'University Regs',
        sourceUrl: 'https://russia-visacentre.com',
        verifiedDate: 'Aug 2026',
        guidance: 'Letter from university faculty confirming course dates.'
      }
    ]
  },
  private: {
    id: 'private',
    title: 'Private / Family Guest Visa',
    category: 'Friends & Family',
    tasks: [
      {
        id: 'p1',
        title: 'Valid Original Passport',
        standardName: '01_Passport_Data_Page',
        hint: 'Valid for at least 6 months past visa expiry with 2 blank pages.',
        status: 'not-started',
        source: 'MID Consular Regs',
        sourceUrl: 'https://www.mid.ru/en/',
        verifiedDate: 'Aug 2026',
        guidance: 'Must be in pristine physical condition.'
      },
      {
        id: 'p2',
        title: 'Official MVD Private Invitation / Relative Statement',
        standardName: '04_Private_Host_Invitation',
        hint: 'Invitation processed by host in Russia via MVD or notarized relative statement.',
        status: 'not-started',
        source: 'MVD / Notary Act',
        sourceUrl: 'https://mvd.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Russian citizen spouses, children, or parents can sponsor directly via notarized statement without an MVD voucher.'
      },
      {
        id: 'p3',
        title: 'Proof of Family Relationship (If Applicable)',
        standardName: '05_Proof_Of_Family_Relationship',
        hint: 'Apostilled and notarized marriage or birth certificates (if applying via direct relative route).',
        status: 'not-started',
        source: 'Consular Regs',
        sourceUrl: 'https://russia-visacentre.com',
        verifiedDate: 'Aug 2026',
        guidance: 'Required for simplified close-relative application route.'
      },
      {
        id: 'p4',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'Recent 35x45mm biometric photo on light background.',
        status: 'not-started',
        source: 'MID Specs',
        sourceUrl: 'https://visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Standard 35x45mm biometric photograph on light background.'
      },
      {
        id: 'p5',
        title: 'Electronic Visa Application Form',
        standardName: '03_Electronic_Visa_Application_EVA',
        hint: 'Completed on visa.kdmid.ru with residential host address in Russia.',
        status: 'not-started',
        source: 'visa.kdmid.ru',
        sourceUrl: 'https://visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Provide full address and passport details of the host.'
      }
    ]
  },
  evisa: {
    id: 'evisa',
    title: 'Unified Electronic Visa (E-Visa)',
    category: '100% Online E-Visa (55 Eligible Countries)',
    tasks: [
      {
        id: 'e1',
        title: 'Check Nationality Eligibility (55 Countries)',
        standardName: '01_Eligibility_Verification',
        hint: 'Confirm your passport issuer is on the official 55-nation list. Note: UK, US, CA, AU citizens are NOT eligible.',
        status: 'not-started',
        source: 'electronic-visa.kdmid.ru',
        sourceUrl: 'https://electronic-visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Eligible countries include European Union members, China, India, Iran, Saudi Arabia, UAE, and others. UK/US/Canada/Australia must apply for a standard paper consular visa.'
      },
      {
        id: 'e2',
        title: 'Digital Colour Passport Scan (JPEG)',
        standardName: '02_Passport_Scan_JPEG',
        hint: 'High-resolution scan of biometric data page in JPEG format (max 500KB).',
        status: 'not-started',
        source: 'MID E-Visa Specs',
        sourceUrl: 'https://electronic-visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'All four borders of the page must be clearly visible with zero glare or flash reflections over the text or MRZ code.'
      },
      {
        id: 'e3',
        title: 'Digital Portrait Photograph (JPEG, 35x45 Ratio)',
        standardName: '03_Portrait_Photograph_JPEG',
        isPhoto: true,
        hint: 'Biometric colour digital photograph meeting official portal criteria (35x45 aspect ratio, JPEG).',
        status: 'not-started',
        source: 'MID E-Visa Specs',
        sourceUrl: 'https://electronic-visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Must be taken within the last 6 months against a plain light background. Neutral gaze, eyes fully open, head height 70–80%.'
      },
      {
        id: 'e4',
        title: 'Medical Insurance Policy for Russia',
        standardName: '04_Medical_Insurance_Policy',
        hint: 'Insurance certificate valid across the Russian Federation for the entire stay period.',
        status: 'not-started',
        source: 'Federal Law No. 114-FZ',
        sourceUrl: 'https://electronic-visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Required at border control upon arrival in Russia. Must state minimum €30,000 emergency medical cover.'
      },
      {
        id: 'e5',
        title: 'Electronic Visa Notification PDF (After Approval)',
        standardName: '05_EVisa_Notification_PDF',
        hint: 'Submit application at least 4 calendar days before scheduled departure. Print approval PDF for travel.',
        status: 'not-started',
        source: 'MID E-Visa Portal',
        sourceUrl: 'https://electronic-visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'The e-visa is valid for entry within 60 days of issuance, and permits a maximum continuous stay of 16 calendar days (up to 15 nights).'
      }
    ]
  },
  transit: {
    id: 'transit',
    title: 'Transit Visa',
    category: 'Passing Through Russia',
    tasks: [
      {
        id: 'tr1',
        title: 'Valid Original Passport',
        standardName: '01_Passport_Data_Page',
        hint: 'Valid for at least 6 months past transit date with 2 clean pages.',
        status: 'not-started',
        source: 'MID Consular Regs',
        sourceUrl: 'https://www.mid.ru/en/',
        verifiedDate: 'Aug 2026',
        guidance: 'Requires at least 2 consecutive blank visa pages.'
      },
      {
        id: 'tr2',
        title: 'Confirmed Onward Travel Tickets',
        standardName: '04_Onward_Flight_Train_Tickets',
        hint: 'Air or railway tickets showing departure from Russian territory within 3 days (air) or 10 days (rail).',
        status: 'not-started',
        source: 'Consular Tariff',
        sourceUrl: 'https://russia-visacentre.com',
        verifiedDate: 'Aug 2026',
        guidance: 'Must have confirmed departure date and time to a destination country.'
      },
      {
        id: 'tr3',
        title: 'Valid Visa for Destination Country (If Applicable)',
        standardName: '05_Destination_Country_Visa',
        hint: 'Proof of entry rights for your destination country.',
        status: 'not-started',
        source: 'MID Consular Regs',
        sourceUrl: 'https://www.mid.ru/en/',
        verifiedDate: 'Aug 2026',
        guidance: 'Visa or passport showing entry eligibility for destination.'
      },
      {
        id: 'tr4',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'One recent standard colour biometric photo.',
        status: 'not-started',
        source: 'MID Specs',
        sourceUrl: 'https://visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Standard 35x45mm biometric photo on light background.'
      },
      {
        id: 'tr5',
        title: 'Electronic Visa Application Form (EVA)',
        standardName: '03_Electronic_Visa_Application_EVA',
        hint: 'Select Transit category at visa.kdmid.ru.',
        status: 'not-started',
        source: 'visa.kdmid.ru',
        sourceUrl: 'https://visa.kdmid.ru',
        verifiedDate: 'Aug 2026',
        guidance: 'Detail your exact transit stopover dates and flight numbers.'
      }
    ]
  }
};

let currentSession = {
  applicantName: 'Applicant Name',
  visaType: 'tourist',
  nationality: 'British Citizen',
  entries: 'Single Entry',
  lastSaved: null,
  tasks: []
};

// ============================================================================
// Interactive Walkthrough / Tour Engine Definitions
// ============================================================================

const TOUR_STEPS = [
  {
    targetId: 'categorySection',
    title: '1. Select Your Visa Category',
    description: 'Click any category card (Tourist, Business, Work, Student, Private, E-Visa, Transit) to immediately load its specific required document checklist below.',
    placement: 'bottom'
  },
  {
    targetId: 'gdsTaskList',
    title: '2. Prepare Requirements & Attach Files',
    description: 'Click "Attach File" or drop files onto each requirement. Files are saved 100% locally in your browser (IndexedDB) and can be reviewed before finalizing.',
    placement: 'top'
  },
  {
    targetId: 'packageBannerBox',
    title: '3. Export Standardized Package (.ZIP)',
    description: 'When ready, export all attached files into an organized .ZIP folder with standardized file names and a printable checklist summary HTML.',
    placement: 'bottom'
  },
  {
    targetId: 'topActionBar',
    title: '4. Save & Backup Workspace',
    description: 'Save your progress locally anytime with "Save Progress", or export/restore lightweight JSON backups to move between devices.',
    placement: 'bottom'
  }
];

let currentTourStep = 0;
let isTourActive = false;

// ============================================================================
// Initialization & Theme Handling
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  loadSavedProgress();
  setupEventListeners();
  await renderTaskList();
  updateCardsVisualState(currentSession.visaType);
});

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  const label = document.getElementById('themeLabelText');
  if (label) {
    label.textContent = theme === 'dark' ? 'Dark' : 'Light';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const nextTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
}

// ============================================================================
// Category Selection & Card Highlighting
// ============================================================================

async function selectVisaCategory(visaId, shouldScroll = true) {
  if (!VISA_DATA[visaId]) return;

  currentSession.visaType = visaId;
  currentSession.tasks = JSON.parse(JSON.stringify(VISA_DATA[visaId].tasks));

  updateCardsVisualState(visaId);
  await renderTaskList();
  saveSessionToStorage(true, `Loaded ${VISA_DATA[visaId].title} Checklist`);

  if (shouldScroll) {
    const checklistSection = document.getElementById('checklistContainer');
    if (checklistSection) {
      checklistSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function updateCardsVisualState(activeVisaId) {
  const cards = document.querySelectorAll('.visa-interactive-card');
  cards.forEach(card => {
    const vId = card.getAttribute('data-visa');
    const footerAction = card.querySelector('.card-footer-action');
    
    if (vId === activeVisaId) {
      card.classList.add('active');
      card.setAttribute('aria-pressed', 'true');
      if (footerAction) {
        footerAction.innerHTML = `<span class="action-text">Active Checklist</span><span class="active-indicator-dot"></span>`;
      }
    } else {
      card.classList.remove('active');
      card.setAttribute('aria-pressed', 'false');
      if (footerAction) {
        footerAction.innerHTML = `<span class="action-text">Select & View &rarr;</span>`;
      }
    }
  });

  const modalSelect = document.getElementById('modalVisaSelect');
  if (modalSelect) modalSelect.value = activeVisaId;
}

// ============================================================================
// Task List Render & Multi-State Workflow
// ============================================================================

async function renderTaskList() {
  const visaDef = VISA_DATA[currentSession.visaType] || VISA_DATA.tourist;
  
  if (!currentSession.tasks || currentSession.tasks.length === 0) {
    currentSession.tasks = JSON.parse(JSON.stringify(visaDef.tasks));
  }

  // Update Applicant Meta
  const nameInput = document.getElementById('applicantNameInput');
  if (nameInput) nameInput.value = currentSession.applicantName || 'Applicant Name';

  const natDisplay = document.getElementById('applicantNatDisplay');
  if (natDisplay) natDisplay.textContent = currentSession.nationality || 'British Citizen';

  const entriesDisplay = document.getElementById('applicantEntriesDisplay');
  if (entriesDisplay) entriesDisplay.textContent = currentSession.entries || 'Single Entry';

  // Update Headings
  const caption = document.getElementById('activeCategoryCaption');
  if (caption) caption.textContent = `${visaDef.title} Checklist`;

  const heading = document.getElementById('checklistHeading');
  if (heading) heading.textContent = `${visaDef.title} Requirements`;

  const total = currentSession.tasks.length;
  const verifiedOrAttached = currentSession.tasks.filter(t => t.status === 'done' || t.status === 'attached').length;

  const completedElem = document.getElementById('completedCount');
  if (completedElem) completedElem.textContent = verifiedOrAttached;

  const totalElem = document.getElementById('totalCount');
  if (totalElem) totalElem.textContent = total;

  const listContainer = document.getElementById('gdsTaskList');
  if (!listContainer) return;

  listContainer.innerHTML = '';

  for (let index = 0; index < currentSession.tasks.length; index++) {
    const task = currentSession.tasks[index];
    const li = document.createElement('li');
    li.className = 'task-item';

    let badgeHtml = '';
    if (task.status === 'done') {
      badgeHtml = `<span class="status-badge done">&#10003; Verified</span>`;
    } else if (task.status === 'attached') {
      badgeHtml = `<span class="status-badge attached">&#128193; Attached</span>`;
    } else if (task.status === 'in-progress') {
      badgeHtml = `<span class="status-badge in-progress">&#9680; In Progress</span>`;
    } else {
      badgeHtml = `<span class="status-badge not-started">&#9675; Not Started</span>`;
    }

    // Check if file exists in session or IndexedDB
    let attachedFileInfo = task.attachedMeta || null;
    let fileZoneHtml = '';

    if (attachedFileInfo) {
      const isImg = attachedFileInfo.type && attachedFileInfo.type.startsWith('image/');
      let previewHtml = '';
      
      if (isImg) {
        // Fetch thumbnail from IndexedDB if available
        const idbRecord = await idbGetFile(`${currentSession.visaType}_${task.id}`);
        if (idbRecord && idbRecord.dataUrl) {
          previewHtml = `<img src="${idbRecord.dataUrl}" class="doc-thumbnail" alt="Preview">`;
        } else {
          previewHtml = `🖼️`;
        }
      } else {
        previewHtml = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;
      }

      fileZoneHtml = `
        <div class="task-upload-zone has-file">
          <div class="file-info-box">
            ${previewHtml}
            <div>
              <span class="file-name-text">${escapeHtml(attachedFileInfo.name)}</span>
              <span class="file-size-tag">(${attachedFileInfo.size}) &bull; Standardized: <code>${task.standardName}_${sanitizeName(currentSession.applicantName)}.${getFileExt(attachedFileInfo.name)}</code></span>
            </div>
          </div>
          <div class="file-actions">
            <button type="button" class="btn-remove-file" onclick="removeTaskFile(${index})">&times; Remove</button>
          </div>
        </div>
      `;
    } else {
      fileZoneHtml = `
        <div class="task-upload-zone" id="drop-zone-${index}" ondragover="handleDragOver(event, ${index})" ondragleave="handleDragLeave(event, ${index})" ondrop="handleDrop(event, ${index})">
          <div class="file-info-box">
            <span style="color: var(--text-muted); font-size: 0.78rem;">📁 Drop file here or click Attach File (PDF, JPG, PNG)</span>
          </div>
          <div class="file-actions">
            <button type="button" class="btn-upload-file" onclick="triggerTaskUpload(${index})">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>Attach File</span>
            </button>
            <input type="file" id="task-file-input-${index}" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style="position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none;" onchange="handleTaskFileUpload(event, ${index})">
          </div>
        </div>
      `;
    }

    // Guidance Section: Collapsed by default
    let guidanceHtml = '';
    const isPhotoItem = task.isPhoto || (task.standardName && task.standardName.includes('Passport_Photo')) || task.title.toLowerCase().includes('photo');

    if (isPhotoItem) {
      guidanceHtml = `
        <details class="task-guidance-details">
          <summary class="task-guidance-summary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span>Photo Specifications & Criteria (35mm × 45mm)</span>
          </summary>
          <div class="task-guidance-text">
            <div class="photo-guidance-grid">
              <div class="photo-exemplar-card">
                <div class="photo-vector-frame">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
                  </svg>
                  <span class="photo-dim-label">35 &times; 45 mm</span>
                </div>
                <div style="font-size: 0.7rem; color: var(--text-secondary);">
                  <strong>70–80% Head Height</strong><br>
                  Neutral Expression
                </div>
              </div>
              <div class="official-photo-rules">
                <h4 class="rules-heading">Russian Consular Photo Standards:</h4>
                <ul class="rules-list">
                  <li><strong>Dimensions:</strong> Exactly 35mm wide &times; 45mm high. Head height 30–36mm from crown to chin.</li>
                  <li><strong>Background:</strong> Plain, light grey or off-white. No patterns or shadows.</li>
                  <li><strong>Recency:</strong> Taken within the last 6 months reflecting current appearance.</li>
                  <li><strong>Glasses:</strong> No tinted or reflective lenses; frames must not obscure eyes.</li>
                </ul>
                <div class="photo-checklist-pills">
                  <span class="photo-pill pass">&#10003; 35&times;45mm</span>
                  <span class="photo-pill pass">&#10003; Light Background</span>
                  <span class="photo-pill pass">&#10003; Neutral Face</span>
                  <span class="photo-pill fail">&#10007; No Tinted Lenses</span>
                </div>
              </div>
            </div>
          </div>
        </details>
      `;
    } else {
      guidanceHtml = `
        <details class="task-guidance-details">
          <summary class="task-guidance-summary">Requirements & preparation guidance</summary>
          <div class="task-guidance-text">
            <p>${task.guidance}</p>
          </div>
        </details>
      `;
    }

    li.innerHTML = `
      <div class="task-top-row">
        <div class="task-main">
          <div class="task-title-wrap">
            <span class="task-title" onclick="toggleTaskStatus(${index})">
              ${task.title}
            </span>
          </div>
          <p class="task-hint">${task.hint}</p>
          <div class="task-meta-tags">
            ${task.source ? `<a href="${task.sourceUrl || '#'}" target="_blank" rel="noopener noreferrer" class="source-tag">Source: ${task.source} &nearr;</a>` : ''}
            ${task.verifiedDate ? `<span class="verified-tag">&bull; Verified: ${task.verifiedDate}</span>` : ''}
          </div>
        </div>

        <div class="task-status-wrap">
          <button type="button" class="btn-cycle-status" onclick="toggleTaskStatus(${index})" title="Click to cycle status: Not Started &rarr; In Progress &rarr; Attached &rarr; Verified">
            Cycle Status
          </button>
          ${badgeHtml}
        </div>
      </div>

      ${fileZoneHtml}

      ${guidanceHtml}
    `;

    listContainer.appendChild(li);
  }
}

async function toggleTaskStatus(index) {
  const task = currentSession.tasks[index];
  if (!task) return;

  const hasAttachedFile = !!task.attachedMeta;

  // Multi-state status cycle
  if (task.status === 'not-started') {
    task.status = 'in-progress';
  } else if (task.status === 'in-progress') {
    task.status = hasAttachedFile ? 'attached' : 'done';
  } else if (task.status === 'attached') {
    task.status = 'done';
  } else {
    task.status = 'not-started';
  }

  saveSessionToStorage(false);
  await renderTaskList();
}

// ============================================================================
// File Upload & Drag-and-Drop Handlers with IndexedDB Storage
// ============================================================================

function triggerTaskUpload(taskIndex) {
  const input = document.getElementById(`task-file-input-${taskIndex}`);
  if (input) {
    input.value = '';
    input.click();
  }
}

function handleTaskFileUpload(event, taskIndex) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  processUploadedFile(file, taskIndex);
}

function handleDragOver(e, taskIndex) {
  e.preventDefault();
  e.stopPropagation();
  const zone = document.getElementById(`drop-zone-${taskIndex}`);
  if (zone) zone.style.borderColor = '#38BDF8';
}

function handleDragLeave(e, taskIndex) {
  e.preventDefault();
  e.stopPropagation();
  const zone = document.getElementById(`drop-zone-${taskIndex}`);
  if (zone) zone.style.borderColor = '';
}

function handleDrop(e, taskIndex) {
  e.preventDefault();
  e.stopPropagation();
  const zone = document.getElementById(`drop-zone-${taskIndex}`);
  if (zone) zone.style.borderColor = '';

  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (file) {
    processUploadedFile(file, taskIndex);
  }
}

function processUploadedFile(file, taskIndex) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const dataUrl = e.target.result;
    const task = currentSession.tasks[taskIndex];
    if (task) {
      const fileId = `${currentSession.visaType}_${task.id}`;
      
      // Store in IndexedDB
      await idbStoreFile(fileId, file, dataUrl);

      // Store lightweight metadata in session
      task.attachedMeta = {
        name: file.name,
        size: formatBytes(file.size),
        type: file.type || 'application/octet-stream',
        lastModified: file.lastModified
      };
      
      // Multi-state: Transition to 'attached' (not immediately 'done') so user can verify
      task.status = 'attached';

      saveSessionToStorage(true, `Attached: ${file.name}`);
      await renderTaskList();
    }
  };
  reader.readAsDataURL(file);
}

async function removeTaskFile(taskIndex) {
  const task = currentSession.tasks[taskIndex];
  if (task && task.attachedMeta) {
    const fileId = `${currentSession.visaType}_${task.id}`;
    await idbDeleteFile(fileId);
    delete task.attachedMeta;
    if (task.status === 'attached') {
      task.status = 'in-progress';
    }
    saveSessionToStorage(false);
    await renderTaskList();
  }
}

// ============================================================================
// .ZIP Document Package Exporter (JSZip + IndexedDB Blobs)
// ============================================================================

async function exportDocumentPackageZip() {
  if (typeof JSZip === 'undefined') {
    alert('JSZip library is loading. Please check your internet connection or try again in a moment.');
    return;
  }

  const zip = new JSZip();
  const applicantNameClean = sanitizeName(currentSession.applicantName || 'Applicant');
  const visaTypeClean = currentSession.visaType || 'Tourist';
  const folderName = `Russian_Visa_Package_${visaTypeClean}_${applicantNameClean}`;
  const rootFolder = zip.folder(folderName);

  // 1. Generate & Add 00_Application_Checklist_Summary.html
  const summaryHtml = generatePrintableSummaryHtml();
  rootFolder.file(`00_Checklist_Summary_${applicantNameClean}.html`, summaryHtml);

  // 2. Fetch Attached Files from IndexedDB & Add with Standardized Naming
  let attachedCount = 0;
  for (let idx = 0; idx < currentSession.tasks.length; idx++) {
    const task = currentSession.tasks[idx];
    if (task.attachedMeta) {
      const fileId = `${currentSession.visaType}_${task.id}`;
      const fileRecord = await idbGetFile(fileId);
      
      if (fileRecord && fileRecord.dataUrl) {
        const ext = getFileExt(task.attachedMeta.name);
        const standardFileName = `${task.standardName || `Document_${idx+1}`}_${applicantNameClean}.${ext}`;
        const base64Data = fileRecord.dataUrl.split(',')[1];
        if (base64Data) {
          rootFolder.file(standardFileName, base64Data, { base64: true });
          attachedCount++;
        }
      }
    } else {
      const missingDocFileName = `${task.standardName || `Document_${idx+1}`}_INSTRUCTIONS.txt`;
      const instructions = `DOCUMENT INSTRUCTION: ${task.title}\n`
        + `Status: ${task.status.toUpperCase()}\n`
        + `Requirement: ${task.hint}\n`
        + `Consular Advice: ${task.guidance}\n\n`
        + `(Attach your photo or PDF in the Russian Visa Workspace and re-export this package.)\n`;
      rootFolder.file(missingDocFileName, instructions);
    }
  }

  // 3. Add application_backup_state.json (lightweight metadata)
  const backupJson = JSON.stringify({
    portal: 'Russian Visa Planner & Preparation Workspace',
    version: '5.0',
    exportDate: new Date().toISOString(),
    session: currentSession
  }, null, 2);
  rootFolder.file('application_backup_state.json', backupJson);

  // 4. Generate ZIP & Download
  saveSessionToStorage(false);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipFileName = `${folderName}_${new Date().toISOString().slice(0,10)}.zip`;

  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = zipFileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(downloadUrl);

  saveSessionToStorage(true, `Exported ${attachedCount} attached files into ${zipFileName}!`);
}

// ============================================================================
// Direct PC Folder Save (Web File System Access API)
// ============================================================================

async function saveDirectlyToPCFolder() {
  if (!window.showDirectoryPicker) {
    alert('Direct folder creation is supported in Chrome/Edge browsers. Exporting .ZIP package instead.');
    exportDocumentPackageZip();
    return;
  }

  try {
    const parentDirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    const applicantNameClean = sanitizeName(currentSession.applicantName || 'Applicant');
    const visaTypeClean = currentSession.visaType || 'Tourist';
    const folderName = `Russian_Visa_Package_${visaTypeClean}_${applicantNameClean}`;

    const appDirHandle = await parentDirHandle.getDirectoryHandle(folderName, { create: true });

    // 1. Write Summary HTML
    const summaryFileHandle = await appDirHandle.getFileHandle(`00_Checklist_Summary_${applicantNameClean}.html`, { create: true });
    const summaryWritable = await summaryFileHandle.createWritable();
    await summaryWritable.write(generatePrintableSummaryHtml());
    await summaryWritable.close();

    // 2. Write Attached Files from IndexedDB
    let count = 0;
    for (const task of currentSession.tasks) {
      if (task.attachedMeta) {
        const fileId = `${currentSession.visaType}_${task.id}`;
        const fileRecord = await idbGetFile(fileId);

        if (fileRecord && fileRecord.dataUrl) {
          const ext = getFileExt(task.attachedMeta.name);
          const fileName = `${task.standardName}_${applicantNameClean}.${ext}`;
          const fileHandle = await appDirHandle.getFileHandle(fileName, { create: true });
          const fileBlob = dataUrlToBlob(fileRecord.dataUrl);
          
          const writable = await fileHandle.createWritable();
          await writable.write(fileBlob);
          await writable.close();
          count++;
        }
      } else {
        const missingFileName = `${task.standardName}_INSTRUCTIONS.txt`;
        const missingFileHandle = await appDirHandle.getFileHandle(missingFileName, { create: true });
        const instructions = `DOCUMENT INSTRUCTION: ${task.title}\n`
          + `Status: ${task.status.toUpperCase()}\n`
          + `Requirement: ${task.hint}\n`
          + `Consular Advice: ${task.guidance}\n`;
        const writable = await missingFileHandle.createWritable();
        await writable.write(instructions);
        await writable.close();
      }
    }

    // 3. Write JSON state backup
    const jsonHandle = await appDirHandle.getFileHandle('application_backup_state.json', { create: true });
    const jsonWritable = await jsonHandle.createWritable();
    await jsonWritable.write(JSON.stringify(currentSession, null, 2));
    await jsonWritable.close();

    saveSessionToStorage(true, `Successfully created folder "${folderName}" with ${count} files on your PC!`);
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('File System Access API error:', err);
      alert('Could not write directly to folder. Downloading standard .ZIP package instead.');
      exportDocumentPackageZip();
    }
  }
}

function dataUrlToBlob(dataUrl) {
  try {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (err) {
    console.error('Error converting dataURL to Blob:', err);
    return new Blob([dataUrl], { type: 'application/octet-stream' });
  }
}

// ============================================================================
// Printable Summary HTML Generator
// ============================================================================

function generatePrintableSummaryHtml() {
  const visaDef = VISA_DATA[currentSession.visaType] || VISA_DATA.tourist;
  const doneCount = currentSession.tasks.filter(t => t.status === 'done').length;
  const attachedCount = currentSession.tasks.filter(t => t.status === 'attached').length;
  const totalCount = currentSession.tasks.length;

  let taskRowsHtml = '';
  currentSession.tasks.forEach((task, i) => {
    let statusText = 'NOT STARTED';
    let statusColor = '#64748B';

    if (task.status === 'done') {
      statusText = '&#10003; VERIFIED';
      statusColor = '#059669';
    } else if (task.status === 'attached') {
      statusText = '&#128193; ATTACHED';
      statusColor = '#0284C7';
    } else if (task.status === 'in-progress') {
      statusText = '&#9680; IN PROGRESS';
      statusColor = '#D97706';
    }

    const attachedInfo = task.attachedMeta ? `Attached: <strong>${escapeHtml(task.attachedMeta.name)}</strong> (${task.attachedMeta.size})` : 'No file attached';

    taskRowsHtml += `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px; font-weight: bold; width: 30px;">${i+1}.</td>
        <td style="padding: 10px;">
          <div style="font-weight: bold; color: #0F172A; font-size: 14px;">${escapeHtml(task.title)}</div>
          <div style="color: #64748B; font-size: 12px; margin-top: 2px;">${escapeHtml(task.hint)}</div>
          <div style="color: #2563EB; font-size: 12px; margin-top: 3px;">${attachedInfo}</div>
        </td>
        <td style="padding: 10px; text-align: right; width: 130px;">
          <span style="display: inline-block; padding: 3px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; color: ${statusColor}; border: 1px solid ${statusColor};">${statusText}</span>
        </td>
      </tr>
    `;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Russian Visa Preparation Summary - ${escapeHtml(currentSession.applicantName)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; line-height: 1.5; padding: 30px; max-width: 780px; margin: 0 auto; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .meta-box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 8px; margin: 16px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .footer-note { margin-top: 24px; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 12px; }
  </style>
</head>
<body>
  <h1>Russian Visa Preparation Summary</h1>
  <p style="color: #64748B; font-size: 13px; margin-top: 0;">Independent Checklist & Local Document Organiser</p>

  <div class="meta-box">
    <div><strong>Applicant:</strong> ${escapeHtml(currentSession.applicantName)}</div>
    <div><strong>Category:</strong> ${escapeHtml(visaDef.title)}</div>
    <div><strong>Citizenship:</strong> ${escapeHtml(currentSession.nationality)}</div>
    <div><strong>Entries:</strong> ${escapeHtml(currentSession.entries)}</div>
    <div><strong>Status:</strong> ${doneCount} verified, ${attachedCount} attached of ${totalCount} items</div>
    <div><strong>Generated:</strong> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
  </div>

  <h2>Document Checklist</h2>
  <table>
    <tbody>
      ${taskRowsHtml}
    </tbody>
  </table>

  <div class="footer-note">
    <p><strong>Disclaimer:</strong> This is an independent preparation workspace summary and not an official consular document. Requirements must be confirmed with the relevant Russian Consular Section or Visa Application Centre.</p>
  </div>
</body>
</html>`;
}

// ============================================================================
// Interactive Spotlight Tour Implementation
// ============================================================================

function startInteractiveTour() {
  currentTourStep = 0;
  isTourActive = true;
  
  const overlay = document.getElementById('tourOverlay');
  if (overlay) overlay.style.display = 'block';

  showTourStep(0);
}

function showTourStep(index) {
  if (index < 0 || index >= TOUR_STEPS.length) {
    endInteractiveTour();
    return;
  }

  currentTourStep = index;
  const step = TOUR_STEPS[index];
  const targetElem = document.getElementById(step.targetId);

  const badge = document.getElementById('tourStepBadge');
  if (badge) badge.textContent = `Step ${index + 1} of ${TOUR_STEPS.length}`;

  const title = document.getElementById('tourTitle');
  if (title) title.textContent = step.title;

  const desc = document.getElementById('tourDescription');
  if (desc) desc.textContent = step.description;

  const prevBtn = document.getElementById('tourPrevBtn');
  if (prevBtn) prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';

  const nextBtn = document.getElementById('tourNextBtn');
  if (nextBtn) {
    nextBtn.innerHTML = index === TOUR_STEPS.length - 1 ? 'Finish &#10003;' : 'Next &rarr;';
  }

  const dots = document.querySelectorAll('.tour-dot');
  dots.forEach((dot, dotIdx) => {
    if (dotIdx === index) dot.classList.add('active');
    else dot.classList.remove('active');
  });

  if (targetElem) {
    targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      positionTourElements(targetElem, step.placement);
    }, 250);
  }
}

function positionTourElements(targetElem, placement = 'bottom') {
  const spotlight = document.getElementById('tourSpotlightBox');
  const popover = document.getElementById('tourPopover');
  if (!spotlight || !popover || !targetElem) return;

  const rect = targetElem.getBoundingClientRect();
  const padding = 6;

  const top = Math.max(0, rect.top - padding);
  const left = Math.max(0, rect.left - padding);
  const width = rect.width + (padding * 2);
  const height = rect.height + (padding * 2);

  spotlight.style.top = `${top}px`;
  spotlight.style.left = `${left}px`;
  spotlight.style.width = `${width}px`;
  spotlight.style.height = `${height}px`;

  const popoverWidth = popover.offsetWidth || 320;
  const popoverHeight = popover.offsetHeight || 190;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let popoverTop = 0;
  let popoverLeft = 0;

  if (placement === 'bottom' && (top + height + popoverHeight + 16 < windowHeight)) {
    popoverTop = top + height + 10;
    popoverLeft = Math.min(Math.max(12, left), windowWidth - popoverWidth - 12);
  } else if (placement === 'top' && (top - popoverHeight - 10 > 0)) {
    popoverTop = top - popoverHeight - 10;
    popoverLeft = Math.min(Math.max(12, left), windowWidth - popoverWidth - 12);
  } else {
    popoverTop = Math.min(Math.max(70, top + 10), windowHeight - popoverHeight - 16);
    popoverLeft = Math.min(Math.max(12, (windowWidth - popoverWidth) / 2), windowWidth - popoverWidth - 12);
  }

  popover.style.top = `${popoverTop}px`;
  popover.style.left = `${popoverLeft}px`;
}

function nextTourStep() {
  if (currentTourStep < TOUR_STEPS.length - 1) {
    showTourStep(currentTourStep + 1);
  } else {
    endInteractiveTour();
    saveSessionToStorage(true, 'Tour finished! You are ready to prepare your application.');
  }
}

function prevTourStep() {
  if (currentTourStep > 0) {
    showTourStep(currentTourStep - 1);
  }
}

function endInteractiveTour() {
  isTourActive = false;
  const overlay = document.getElementById('tourOverlay');
  if (overlay) overlay.style.display = 'none';
  localStorage.setItem(TOUR_SEEN_KEY, 'true');
}

window.addEventListener('resize', () => {
  if (isTourActive) {
    const step = TOUR_STEPS[currentTourStep];
    const targetElem = document.getElementById(step.targetId);
    if (targetElem) positionTourElements(targetElem, step.placement);
  }
});

window.addEventListener('keydown', (e) => {
  if (isTourActive) {
    if (e.key === 'Escape') endInteractiveTour();
    else if (e.key === 'ArrowRight' || e.key === 'Enter') nextTourStep();
    else if (e.key === 'ArrowLeft') prevTourStep();
  }
});

// ============================================================================
// State Persistence & Safe JSON Backup / Schema Validation
// ============================================================================

function saveSessionToStorage(showBanner = true, customMsg = null) {
  currentSession.lastSaved = new Date().toISOString();
  
  // Safe persistence: only metadata in localStorage, no heavy Base64 strings
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSession));

  const syncLabel = document.getElementById('syncLabel');
  if (syncLabel) syncLabel.textContent = 'Saved locally';

  if (showBanner) {
    const banner = document.getElementById('successBanner');
    const heading = document.getElementById('bannerHeading');
    const msg = document.getElementById('bannerMessage');

    if (heading && customMsg) heading.textContent = customMsg;
    if (msg) msg.textContent = `Your ${VISA_DATA[currentSession.visaType].title} progress and file references are saved in local storage.`;

    if (banner) {
      banner.style.display = 'flex';
      setTimeout(() => {
        if (banner) banner.style.display = 'none';
      }, 5000);
    }
  }
}

function loadSavedProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.visaType && VISA_DATA[parsed.visaType]) {
        currentSession = parsed;
        const syncLabel = document.getElementById('syncLabel');
        if (syncLabel) syncLabel.textContent = 'Saved locally';
      }
    } catch (e) {
      console.error('Failed to parse saved session', e);
    }
  }
}

function exportJsonBackup() {
  saveSessionToStorage(false);

  const fileName = `russian_visa_${currentSession.visaType}_${sanitizeName(currentSession.applicantName)}_backup.json`;
  const exportPayload = {
    workspace: 'Russian Visa Planner',
    schemaVersion: '5.0',
    exportDate: new Date().toISOString(),
    session: currentSession
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  saveSessionToStorage(true, `Exported Backup: ${fileName}`);
}

function handleFileRestore(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      
      // Schema validation
      const validSession = parsed.session || (parsed.visaType ? parsed : null);
      if (validSession && typeof validSession.visaType === 'string' && VISA_DATA[validSession.visaType]) {
        currentSession = {
          applicantName: String(validSession.applicantName || 'Applicant Name').slice(0, 100),
          visaType: validSession.visaType,
          nationality: String(validSession.nationality || 'British Citizen').slice(0, 60),
          entries: String(validSession.entries || 'Single Entry').slice(0, 30),
          lastSaved: new Date().toISOString(),
          tasks: Array.isArray(validSession.tasks) ? validSession.tasks : []
        };
        
        saveSessionToStorage(true, 'Application progress restored successfully!');
        updateCardsVisualState(currentSession.visaType);
        await renderTaskList();
      } else {
        alert('Invalid backup schema. File must be a valid Russian Visa Planner backup JSON.');
      }
    } catch (err) {
      alert('Could not read file. Please select a valid JSON backup file.');
    }
  };
  reader.readAsText(file);
}

// ============================================================================
// Clear Workspace / Reset
// ============================================================================

async function clearWorkspaceData() {
  await idbClearAll();
  localStorage.removeItem(STORAGE_KEY);
  
  currentSession = {
    applicantName: 'Applicant Name',
    visaType: 'tourist',
    nationality: 'British Citizen',
    entries: 'Single Entry',
    lastSaved: null,
    tasks: JSON.parse(JSON.stringify(VISA_DATA.tourist.tasks))
  };

  saveSessionToStorage(true, 'Workspace cleared. Starting fresh!');
  updateCardsVisualState('tourist');
  await renderTaskList();
}

// ============================================================================
// String & Utility Helpers
// ============================================================================

function sanitizeName(name) {
  return (name || 'Applicant').replace(/[^a-zA-Z0-9_-]/g, '_');
}

function getFileExt(filename) {
  return (filename || '').split('.').pop() || 'bin';
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

// ============================================================================
// Event Listeners & Modal Controls (Keyboard & Accessibility Aware)
// ============================================================================

function setupEventListeners() {
  // Theme Toggle Button
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) themeBtn.onclick = toggleTheme;

  // Tour Buttons
  const startTourBtn = document.getElementById('startTourBtn');
  if (startTourBtn) startTourBtn.onclick = startInteractiveTour;

  const bannerTourBtn = document.getElementById('bannerTourBtn');
  if (bannerTourBtn) bannerTourBtn.onclick = startInteractiveTour;

  const footerTourLink = document.getElementById('footerTourLink');
  if (footerTourLink) {
    footerTourLink.onclick = (e) => {
      e.preventDefault();
      startInteractiveTour();
    };
  }

  // Tour Nav
  const tourNextBtn = document.getElementById('tourNextBtn');
  if (tourNextBtn) tourNextBtn.onclick = nextTourStep;

  const tourPrevBtn = document.getElementById('tourPrevBtn');
  if (tourPrevBtn) tourPrevBtn.onclick = prevTourStep;

  const tourCloseBtn = document.getElementById('tourCloseBtn');
  if (tourCloseBtn) tourCloseBtn.onclick = endInteractiveTour;

  // Applicant Name Input
  const nameInput = document.getElementById('applicantNameInput');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      currentSession.applicantName = e.target.value;
      saveSessionToStorage(false);
    });
  }

  // Interactive Visa Category Cards
  const cards = document.querySelectorAll('.visa-interactive-card');
  cards.forEach(card => {
    const visaId = card.getAttribute('data-visa');
    
    card.addEventListener('click', () => {
      selectVisaCategory(visaId, true);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectVisaCategory(visaId, true);
      }
    });
  });

  // Action Buttons
  const startBtn = document.getElementById('startAppBtn');
  if (startBtn) {
    startBtn.onclick = () => {
      openModal('newAppModal');
    };
  }

  const saveBtn = document.getElementById('saveProgressBtn');
  if (saveBtn) {
    saveBtn.onclick = () => saveSessionToStorage(true, 'Progress saved locally!');
  }

  const headerSaveBtn = document.getElementById('headerSaveBtn');
  if (headerSaveBtn) {
    headerSaveBtn.onclick = () => saveSessionToStorage(true, 'Progress saved locally!');
  }

  const sidebarSaveBtn = document.getElementById('sidebarSaveBtn');
  if (sidebarSaveBtn) {
    sidebarSaveBtn.onclick = () => saveSessionToStorage(true, 'Progress saved locally!');
  }

  // Export Document Package .ZIP
  const quickZipBtn = document.getElementById('quickZipBtn');
  if (quickZipBtn) quickZipBtn.onclick = exportDocumentPackageZip;

  const exportZipBtn = document.getElementById('exportZipBtn');
  if (exportZipBtn) exportZipBtn.onclick = exportDocumentPackageZip;

  const bottomZipBtn = document.getElementById('bottomZipBtn');
  if (bottomZipBtn) bottomZipBtn.onclick = exportDocumentPackageZip;

  // Direct PC Folder Save
  const saveFolderDirectBtn = document.getElementById('saveFolderDirectBtn');
  if (saveFolderDirectBtn) saveFolderDirectBtn.onclick = saveDirectlyToPCFolder;

  // Restore Backup Button
  const loadBtn = document.getElementById('loadProgressBtn');
  if (loadBtn) {
    loadBtn.onclick = () => {
      const input = document.getElementById('importFileInput');
      if (input) input.click();
    };
  }

  // Export JSON State Backup
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  if (exportJsonBtn) {
    exportJsonBtn.onclick = exportJsonBackup;
  }

  // Clear Workspace Modal Trigger
  const clearBtn = document.getElementById('clearWorkspaceBtn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      openModal('clearWorkspaceModal');
    };
  }

  const confirmClearBtn = document.getElementById('confirmClearBtn');
  if (confirmClearBtn) {
    confirmClearBtn.onclick = async () => {
      closeModal('clearWorkspaceModal');
      await clearWorkspaceData();
    };
  }

  const cancelClearBtn = document.getElementById('cancelClearBtn');
  if (cancelClearBtn) {
    cancelClearBtn.onclick = () => closeModal('clearWorkspaceModal');
  }

  const cancelClearModalBtn = document.getElementById('cancelClearModalBtn');
  if (cancelClearModalBtn) {
    cancelClearModalBtn.onclick = () => closeModal('clearWorkspaceModal');
  }

  // Dismiss Notification Banner
  const closeBannerBtn = document.getElementById('closeBannerBtn');
  if (closeBannerBtn) {
    closeBannerBtn.onclick = () => {
      document.getElementById('successBanner').style.display = 'none';
    };
  }

  // Modal Controls
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  if (cancelModalBtn) {
    cancelModalBtn.onclick = () => closeModal('newAppModal');
  }

  const modalCloseSecBtn = document.getElementById('modalCloseSecondaryBtn');
  if (modalCloseSecBtn) {
    modalCloseSecBtn.onclick = () => closeModal('newAppModal');
  }

  const confirmStartBtn = document.getElementById('confirmStartBtn');
  if (confirmStartBtn) {
    confirmStartBtn.onclick = async () => {
      const applicantName = document.getElementById('modalApplicantName').value || 'Applicant Name';
      const selectedType = document.getElementById('modalVisaSelect').value || 'tourist';
      const nat = document.getElementById('modalNationality').value || 'British Citizen';
      const entryElem = document.querySelector('input[name="modalEntries"]:checked');
      const entry = entryElem ? entryElem.value : 'Single Entry';

      currentSession.applicantName = applicantName;
      currentSession.visaType = selectedType;
      currentSession.nationality = nat;
      currentSession.entries = entry;
      currentSession.tasks = JSON.parse(JSON.stringify(VISA_DATA[selectedType].tasks));

      saveSessionToStorage(true, `New ${VISA_DATA[selectedType].title} started!`);
      closeModal('newAppModal');
      
      updateCardsVisualState(selectedType);
      await renderTaskList();

      const checklistSection = document.getElementById('checklistContainer');
      if (checklistSection) {
        checklistSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  }

  // Radio pills in modal
  const pillOptions = document.querySelectorAll('.pill-option');
  pillOptions.forEach(pill => {
    pill.onclick = () => {
      pillOptions.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const input = pill.querySelector('input');
      if (input) input.checked = true;
    };
  });

  // File input change
  const importInput = document.getElementById('importFileInput');
  if (importInput) {
    importInput.onchange = handleFileRestore;
  }

  // Global escape key handler for open modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('newAppModal');
      closeModal('clearWorkspaceModal');
    }
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

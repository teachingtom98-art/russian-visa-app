/**
 * Russian Visa Application Portal
 * Document Attachment, Packaging, Photo Exemplar, Interactive Tour & State Logic
 */

const STORAGE_KEY = 'russian_visa_portal_session_v4';
const THEME_KEY = 'russian_visa_theme';
const TOUR_SEEN_KEY = 'russian_visa_tour_seen';

// ============================================================================
// Visa Types & Standardized Task Requirements
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
        hint: 'Must be physically undamaged, have 2+ consecutive blank visa pages, and remain valid 6+ months past visa expiry.',
        status: 'done',
        guidance: 'Upload a clear scan or photo of your passport biometric photo page. Must show all 4 corners.'
      },
      {
        id: 't2',
        title: 'Tourist Voucher & Confirmation of Reception',
        standardName: '04_Tourist_Voucher_Confirmation',
        hint: 'Official Russian Tourist Confirmation issued by an authorized Russian tour operator registered with Rostourism.',
        status: 'in-progress',
        guidance: 'Must state your full passport details, travel itinerary, hotel bookings, and MBT reference license number.'
      },
      {
        id: 't3',
        title: 'Electronic Visa Application (EVA) Form',
        standardName: '03_Electronic_Visa_Application_EVA',
        hint: 'Completed and submitted online at visa.kdmid.ru, printed on A4 paper, dated and signed.',
        status: 'done',
        guidance: 'Ensure your name order, passport number, and host organization details match your tourist voucher exactly.'
      },
      {
        id: 't4',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'One recent standard colour biometric photo taken within the last 6 months against a plain light/white background.',
        status: 'not-started',
        guidance: 'The head must measure between 29mm and 34mm from crown to chin. No tinted glasses or headgear unless religious.'
      },
      {
        id: 't5',
        title: 'Travel Medical Insurance Certificate',
        standardName: '05_Medical_Insurance_Policy',
        hint: 'Mandatory policy covering at least €30,000 for emergency medical care valid across the Russian Federation.',
        status: 'not-started',
        guidance: 'Required for UK, EU, and Schengen citizens. The policy document must explicitly mention cover for Russia.'
      },
      {
        id: 't6',
        title: 'Consular & Application Fee Receipt',
        standardName: '06_Consular_Fee_Payment_Receipt',
        hint: 'Proof of fee payment for standard (4–20 working days) or express consular processing.',
        status: 'not-started',
        guidance: 'Payment is typically made by card or bank transfer during appointment booking.'
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
        status: 'done',
        guidance: 'Ensure sufficient blank pages for multiple entry/exit consular stamps.'
      },
      {
        id: 'b2',
        title: 'Official Russian Business Invitation',
        standardName: '04_Official_Business_Invitation_MVD',
        hint: 'Electronic telex or MIA (GUVM) electronic invitation code from your sponsoring Russian company.',
        status: 'in-progress',
        guidance: 'Must be officially registered through the Russian Ministry of Internal Affairs (MVD) or Ministry of Foreign Affairs (MID).'
      },
      {
        id: 'b3',
        title: 'Electronic Visa Application (EVA) Form',
        standardName: '03_Electronic_Visa_Application_EVA',
        hint: 'Completed at visa.kdmid.ru with employer and host details.',
        status: 'not-started',
        guidance: 'State the official Russian host organization name, TIN/INN number, and exact registered address.'
      },
      {
        id: 'b4',
        title: 'Company Cover Letter',
        standardName: '05_Company_Introduction_Cover_Letter',
        hint: 'Letter from your employer detailing your position, trip purpose, and financial guarantee.',
        status: 'not-started',
        guidance: 'Must be printed on official company letterhead, stamped, and signed by an authorized director.'
      },
      {
        id: 'b5',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'One recent standard passport photograph meeting biometric specs.',
        status: 'not-started',
        guidance: 'Glued securely to the designated box on the EVA application printout.'
      },
      {
        id: 'b6',
        title: 'Travel Medical Insurance Policy',
        standardName: '06_Medical_Insurance_Policy',
        hint: 'Minimum €30,000 cover for Russian territory.',
        status: 'not-started',
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
        status: 'done',
        guidance: 'Check passport expiry carefully as work visas cannot exceed passport validity.'
      },
      {
        id: 'w2',
        title: 'Original MVD / GUVM Work Invitation',
        standardName: '04_MVD_Work_Invitation',
        hint: 'Issued by the Russian Ministry of Internal Affairs following work permit approval.',
        status: 'in-progress',
        guidance: 'Obtained by your Russian employer.'
      },
      {
        id: 'w3',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'One recent standard colour biometric photo.',
        status: 'not-started',
        guidance: 'Standard 35x45mm biometric photograph on light background.'
      },
      {
        id: 'w4',
        title: 'Original HIV Negative Medical Certificate',
        standardName: '05_HIV_Negative_Certificate',
        hint: 'Valid medical test certificate proving HIV-negative status, issued within the last 90 days.',
        status: 'not-started',
        guidance: 'Must contain official doctor signature, laboratory stamp, and match passport information.'
      },
      {
        id: 'w5',
        title: 'Electronic Visa Application Form',
        standardName: '03_Electronic_Visa_Application_EVA',
        hint: 'Completed work visa application at visa.kdmid.ru.',
        status: 'not-started',
        guidance: 'Specify employer details and work permit registration number.'
      },
      {
        id: 'w6',
        title: 'Employment Contract Copy',
        standardName: '06_Employment_Contract',
        hint: 'Signed contract or High Qualified Specialist (HQS) agreement.',
        status: 'not-started',
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
        status: 'done',
        guidance: 'Must contain at least 2 clean visa pages.'
      },
      {
        id: 's2',
        title: 'Official Ministry of Education / MVD Invitation',
        standardName: '04_Ministry_University_Invitation',
        hint: 'Issued directly to the university and consular database.',
        status: 'not-started',
        guidance: 'University international office initiates this with the Russian ministry.'
      },
      {
        id: 's3',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'One recent standard colour biometric photo.',
        status: 'not-started',
        guidance: 'Standard 35x45mm biometric photograph on light background.'
      },
      {
        id: 's4',
        title: 'HIV Negative Certificate',
        standardName: '05_HIV_Negative_Certificate',
        hint: 'Medical test certificate issued within 90 days of application.',
        status: 'not-started',
        guidance: 'Mandatory for all student visas.'
      },
      {
        id: 's5',
        title: 'University Admission Contract / Letter',
        standardName: '06_University_Admission_Contract',
        hint: 'Formal proof of university course enrollment.',
        status: 'not-started',
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
        status: 'done',
        guidance: 'Must be in pristine physical condition.'
      },
      {
        id: 'p2',
        title: 'Official MVD Private Invitation / Relative Statement',
        standardName: '04_Private_Host_Invitation',
        hint: 'Invitation processed by host in Russia or direct notarized relative statement.',
        status: 'in-progress',
        guidance: 'Russian citizen spouses, children, or parents can sponsor directly via notarized statement.'
      },
      {
        id: 'p3',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'Recent 35x45mm biometric photo on light background.',
        status: 'not-started',
        guidance: 'Standard 35x45mm biometric photograph on light background.'
      },
      {
        id: 'p4',
        title: 'Proof of Family Relationship',
        standardName: '05_Proof_Of_Family_Relationship',
        hint: 'Apostilled and notarized marriage or birth certificates (if applicable).',
        status: 'not-started',
        guidance: 'Required for simplified close-relative application route.'
      },
      {
        id: 'p5',
        title: 'Electronic Visa Application Form',
        standardName: '03_Electronic_Visa_Application_EVA',
        hint: 'Completed on visa.kdmid.ru with residential host address in Russia.',
        status: 'not-started',
        guidance: 'Provide full address and passport details of the host.'
      }
    ]
  },
  evisa: {
    id: 'evisa',
    title: 'Unified Electronic Visa (E-Visa)',
    category: '100% Online E-Visa',
    tasks: [
      {
        id: 'e1',
        title: 'Check Nationality Eligibility',
        standardName: '01_Eligibility_Verification',
        hint: 'Verify your passport country is eligible at electronic-visa.kdmid.ru.',
        status: 'done',
        guidance: 'Valid for citizens of European Union, UK, India, China, UAE, and others.'
      },
      {
        id: 'e2',
        title: 'Digital Colour Passport Scan',
        standardName: '02_Passport_Scan_JPEG',
        hint: 'High-resolution scan of biometric data page in JPEG format.',
        status: 'done',
        guidance: 'All four borders of the page must be clearly visible with no flash reflection.'
      },
      {
        id: 'e3',
        title: 'Digital Portrait Photo (35mm × 45mm)',
        standardName: '03_Portrait_Photograph_JPEG',
        isPhoto: true,
        hint: 'Biometric colour photograph meeting official digital specifications (35x45mm ratio, JPEG).',
        status: 'in-progress',
        guidance: 'Strictly 35x45 aspect ratio against a light plain background.'
      },
      {
        id: 'e4',
        title: 'Medical Insurance Cover for Russian Federation',
        standardName: '04_Medical_Insurance_Policy',
        hint: 'Insurance certificate valid for the entire 16-day stay period.',
        status: 'not-started',
        guidance: 'Required at border control upon airport arrival in Russia.'
      },
      {
        id: 'e5',
        title: 'Online Application PDF Receipt',
        standardName: '05_EVisa_Application_Receipt',
        hint: 'Submit at least 4 calendar days before scheduled departure.',
        status: 'not-started',
        guidance: 'Issued within 4 calendar days as a downloadable electronic PDF notification.'
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
        hint: 'Valid for at least 6 months past transit date.',
        status: 'done',
        guidance: 'Requires at least 2 consecutive blank visa pages.'
      },
      {
        id: 'tr2',
        title: 'Confirmed Onward Travel Tickets',
        standardName: '04_Onward_Flight_Train_Tickets',
        hint: 'Air or railway tickets showing entry and exit from Russian territory.',
        status: 'in-progress',
        guidance: 'Must have confirmed departure date to destination country.'
      },
      {
        id: 'tr3',
        title: 'Passport Photo (35mm × 45mm)',
        standardName: '02_Passport_Photo_35x45mm',
        isPhoto: true,
        hint: 'One recent standard colour biometric photo.',
        status: 'not-started',
        guidance: 'Standard 35x45mm biometric photo on light background.'
      },
      {
        id: 'tr4',
        title: 'Valid Visa for Destination Country',
        standardName: '05_Destination_Country_Visa',
        hint: 'Proof of entry rights for your destination.',
        status: 'not-started',
        guidance: 'Visa or passport showing entry eligibility.'
      },
      {
        id: 'tr5',
        title: 'Electronic Visa Application Form (EVA)',
        standardName: '03_Electronic_Visa_Application_EVA',
        hint: 'Select Transit category at visa.kdmid.ru.',
        status: 'not-started',
        guidance: 'Detail your exact transit stopover dates and flight numbers.'
      }
    ]
  }
};

let currentSession = {
  applicantName: 'Tom Barclay',
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
    description: 'Click any category card (Tourist, Business, Work, Student, Private, E-Visa, Transit) to immediately load its official required document checklist below.',
    placement: 'bottom'
  },
  {
    targetId: 'gdsTaskList',
    title: '2. Track Requirements & Attach Files',
    description: 'Click "Attach File" or drag & drop your files directly onto each box. Uploading automatically marks the requirement Complete 🟢 and standardizes the file name.',
    placement: 'top'
  },
  {
    targetId: 'packageBannerBox',
    title: '3. Export Standardized Package (.ZIP)',
    description: 'When your documents are ready, click "Export Document Package" to download all files neatly organized and renamed for the consulate, with a printable summary HTML.',
    placement: 'bottom'
  },
  {
    targetId: 'topActionBar',
    title: '4. Save, Restore & Start Fresh',
    description: 'Save your progress locally anytime with "Save Progress", or export/import full JSON backups with "Restore Backup" to work across devices.',
    placement: 'bottom'
  }
];

let currentTourStep = 0;
let isTourActive = false;

// ============================================================================
// Initialization & Theme Handling
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadSavedProgress();
  setupEventListeners();
  renderTaskList();
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
    label.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
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

function selectVisaCategory(visaId, shouldScroll = true) {
  if (!VISA_DATA[visaId]) return;

  currentSession.visaType = visaId;
  currentSession.tasks = JSON.parse(JSON.stringify(VISA_DATA[visaId].tasks));

  updateCardsVisualState(visaId);
  renderTaskList();
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
// Task List Render with Bulletproof File Upload Zones & Drag-and-Drop
// ============================================================================

function renderTaskList() {
  const visaDef = VISA_DATA[currentSession.visaType] || VISA_DATA.tourist;
  
  if (!currentSession.tasks || currentSession.tasks.length === 0) {
    currentSession.tasks = JSON.parse(JSON.stringify(visaDef.tasks));
  }

  // Update Applicant Meta
  const nameInput = document.getElementById('applicantNameInput');
  if (nameInput) nameInput.value = currentSession.applicantName || 'Tom Barclay';

  const natDisplay = document.getElementById('applicantNatDisplay');
  if (natDisplay) natDisplay.textContent = currentSession.nationality || 'British Citizen';

  const entriesDisplay = document.getElementById('applicantEntriesDisplay');
  if (entriesDisplay) entriesDisplay.textContent = currentSession.entries || 'Single Entry';

  // Update Headings
  const caption = document.getElementById('activeCategoryCaption');
  if (caption) caption.textContent = `${visaDef.title} Checklist`;

  const heading = document.getElementById('checklistHeading');
  if (heading) heading.textContent = `${visaDef.title} Document Requirements`;

  const total = currentSession.tasks.length;
  const done = currentSession.tasks.filter(t => t.status === 'done').length;

  const completedElem = document.getElementById('completedCount');
  if (completedElem) completedElem.textContent = done;

  const totalElem = document.getElementById('totalCount');
  if (totalElem) totalElem.textContent = total;

  const listContainer = document.getElementById('gdsTaskList');
  if (!listContainer) return;

  listContainer.innerHTML = '';

  currentSession.tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    let badgeHtml = '';
    if (task.status === 'done') {
      badgeHtml = `<span class="status-badge done">&#10003; Complete</span>`;
    } else if (task.status === 'in-progress') {
      badgeHtml = `<span class="status-badge in-progress">&#9679; In Progress</span>`;
    } else {
      badgeHtml = `<span class="status-badge not-started">&#9675; Not Started</span>`;
    }

    // File Upload Zone HTML with Drag & Drop and Explicit Hidden Input
    let fileZoneHtml = '';
    if (task.attachedFile) {
      const isImg = task.attachedFile.type && task.attachedFile.type.startsWith('image/');
      const previewHtml = isImg 
        ? `<img src="${task.attachedFile.dataUrl}" class="doc-thumbnail" alt="Preview">` 
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;

      fileZoneHtml = `
        <div class="task-upload-zone has-file">
          <div class="file-info-box">
            ${previewHtml}
            <div>
              <span class="file-name-text">${escapeHtml(task.attachedFile.name)}</span>
              <span class="file-size-tag">(${task.attachedFile.size}) &bull; Standardized: <code>${task.standardName}_${sanitizeName(currentSession.applicantName)}.${getFileExt(task.attachedFile.name)}</code></span>
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
            <span style="color: var(--text-muted); font-size: 0.8rem;">📁 Drop file here or click Attach File (PDF, JPG, PNG)</span>
          </div>
          <div class="file-actions">
            <button type="button" class="btn-upload-file" onclick="triggerTaskUpload(${index})">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
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

    // Guidance Section: Special Rich Guide for Passport Photo vs Standard Guidance
    let guidanceHtml = '';
    const isPhotoItem = task.isPhoto || (task.standardName && task.standardName.includes('Passport_Photo')) || task.title.toLowerCase().includes('photo');

    if (isPhotoItem) {
      guidanceHtml = `
        <details class="task-guidance-details" open>
          <summary class="task-guidance-summary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span>Official Russian Authorities Photo Advice & Exemplar Photo</span>
          </summary>
          <div class="task-guidance-text">
            
            <div class="photo-guidance-grid">
              
              <!-- Exemplar Photo Card with Biometric Measurement Overlays -->
              <div class="photo-exemplar-card">
                <div class="exemplar-badge">&#10003; Exemplar Russian Visa Photo</div>
                
                <div class="exemplar-frame-wrapper">
                  <div class="exemplar-photo-frame">
                    <img src="exemplar_passport_photo.jpg" alt="Exemplar Russian Visa Passport Photo" class="exemplar-img">
                    <div class="metric-face-zone" title="Head height must occupy 70-80% of photo"></div>
                  </div>
                  <div class="metric-dimension metric-width">35 mm</div>
                  <div class="metric-dimension metric-height">45 mm</div>
                </div>

                <div class="exemplar-caption">
                  <strong>35mm &times; 45mm</strong> (3.5 &times; 4.5 cm)<br>
                  Plain light background &bull; Neutral gaze
                </div>
              </div>

              <!-- Official Russian Authorities Advice & Criteria -->
              <div class="official-photo-rules">
                <h4 class="rules-heading">Official Russian Ministry of Foreign Affairs (MID) Photo Criteria:</h4>
                
                <ul class="rules-list">
                  <li><strong>Dimensions & Scale:</strong> Exactly 35 mm wide by 45 mm high (3.5 &times; 4.5 cm). The head height (chin to crown) must occupy <strong>70% to 80%</strong> of the total vertical area (approx. 30–36 mm).</li>
                  <li><strong>Background:</strong> Plain, uniform light grey, light blue, or off-white. No patterns, shadows, textures, or visible background objects.</li>
                  <li><strong>Pose & Expression:</strong> Direct frontal view looking straight into the camera lens with a <strong>neutral facial expression</strong>. Mouth closed, eyes open and clearly visible.</li>
                  <li><strong>Lighting & Clarity:</strong> Sharp focus, high contrast, even lighting across the face with zero shadows on the face or background. No red-eye or digital beauty filters.</li>
                  <li><strong>Recency:</strong> Must have been taken within the last <strong>6 months</strong> reflecting your current appearance.</li>
                  <li><strong>Eyeglasses:</strong> Eyes must be fully visible with no flash reflections, glare, or thick frames covering the eyes. Tinted/sunglasses are <strong>strictly prohibited</strong>.</li>
                  <li><strong>Headwear:</strong> Religious headwear is permitted only if it does not cover any part of the face from chin to forehead and creates no shadows on the face.</li>
                  <li><strong>Physical Condition:</strong> For paper submissions, must be printed on high-grade photographic paper, undamaged, without creases or staple marks across the face.</li>
                </ul>

                <div class="photo-checklist-pills">
                  <span class="photo-pill pass">&#10003; 35&times;45 mm Format</span>
                  <span class="photo-pill pass">&#10003; Light Background</span>
                  <span class="photo-pill pass">&#10003; 70–80% Head Ratio</span>
                  <span class="photo-pill pass">&#10003; Neutral Expression</span>
                  <span class="photo-pill pass">&#10003; Taken within 6 Months</span>
                  <span class="photo-pill fail">&#10007; No Tinted Glasses</span>
                  <span class="photo-pill fail">&#10007; No Shadows / Glare</span>
                </div>
              </div>

            </div>

          </div>
        </details>
      `;
    } else {
      guidanceHtml = `
        <details class="task-guidance-details">
          <summary class="task-guidance-summary">Official consular requirements & advice</summary>
          <div class="task-guidance-text">
            <p>${task.guidance}</p>
          </div>
        </details>
      `;
    }

    li.innerHTML = `
      <div class="task-top-row">
        <div class="task-main">
          <div class="task-title" onclick="toggleTaskStatus(${index})">
            ${task.title}
          </div>
          <p class="task-hint">${task.hint}</p>
        </div>

        <div class="task-status-wrap">
          <button type="button" class="btn-cycle-status" onclick="toggleTaskStatus(${index})" title="Click to cycle status">
            Cycle Status
          </button>
          ${badgeHtml}
        </div>
      </div>

      ${fileZoneHtml}

      ${guidanceHtml}
    `;

    listContainer.appendChild(li);
  });
}

function toggleTaskStatus(index) {
  const task = currentSession.tasks[index];
  if (!task) return;

  if (task.status === 'not-started') {
    task.status = 'in-progress';
  } else if (task.status === 'in-progress') {
    task.status = 'done';
  } else {
    task.status = 'not-started';
  }

  saveSessionToStorage(false);
  renderTaskList();
}

function markAllCompleted() {
  currentSession.tasks.forEach(t => t.status = 'done');
  saveSessionToStorage(true, 'All checklist items marked completed!');
  renderTaskList();
}

// ============================================================================
// Robust File Upload & Drag-and-Drop Handlers
// ============================================================================

function triggerTaskUpload(taskIndex) {
  const input = document.getElementById(`task-file-input-${taskIndex}`);
  if (input) {
    input.value = ''; // Always clear previous value so re-uploading the same file works every time
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
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const task = currentSession.tasks[taskIndex];
    if (task) {
      task.attachedFile = {
        name: file.name,
        size: formatBytes(file.size),
        type: file.type || 'application/octet-stream',
        dataUrl: dataUrl
      };
      // Auto-mark as completed when file is uploaded
      task.status = 'done';
      saveSessionToStorage(true, `Attached: ${file.name}`);
      renderTaskList();
    }
  };
  reader.readAsDataURL(file);
}

function removeTaskFile(taskIndex) {
  const task = currentSession.tasks[taskIndex];
  if (task && task.attachedFile) {
    delete task.attachedFile;
    saveSessionToStorage(false);
    renderTaskList();
  }
}

// ============================================================================
// .ZIP Document Package Exporter (JSZip)
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
  rootFolder.file(`00_Application_Checklist_Summary_${applicantNameClean}.html`, summaryHtml);

  // 2. Add Attached Files with Standardized Naming
  let attachedCount = 0;
  currentSession.tasks.forEach((task, idx) => {
    if (task.attachedFile && task.attachedFile.dataUrl) {
      const ext = getFileExt(task.attachedFile.name);
      const standardFileName = `${task.standardName || `Document_${idx+1}`}_${applicantNameClean}.${ext}`;
      
      const base64Data = task.attachedFile.dataUrl.split(',')[1];
      if (base64Data) {
        rootFolder.file(standardFileName, base64Data, { base64: true });
        attachedCount++;
      }
    } else {
      const missingDocFileName = `${task.standardName || `Document_${idx+1}`}_INSTRUCTIONS.txt`;
      const instructions = `DOCUMENT INSTRUCTION: ${task.title}\n`
        + `Status: ${task.status.toUpperCase()}\n`
        + `Requirement: ${task.hint}\n`
        + `Consular Advice: ${task.guidance}\n\n`
        + `(You can attach your photo or PDF scan in the Russian Visa Portal and re-export this package.)\n`;
      rootFolder.file(missingDocFileName, instructions);
    }
  });

  // 3. Add application_state_backup.json for instant portal re-import
  const backupJson = JSON.stringify({
    portal: 'Russian Visa Application Portal',
    version: '4.0',
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

  saveSessionToStorage(true, `Exported ${attachedCount} files into ${zipFileName}!`);
}

// ============================================================================
// Direct PC Folder Save (Web File System Access API with Direct Blob Writing)
// ============================================================================

async function saveDirectlyToPCFolder() {
  if (!window.showDirectoryPicker) {
    alert('Direct folder creation is supported in Chromium browsers (Chrome/Edge). Exporting .ZIP package instead.');
    exportDocumentPackageZip();
    return;
  }

  try {
    // Open directory picker (e.g. user selects Documents or Desktop)
    const parentDirHandle = await window.showDirectoryPicker({
      mode: 'readwrite'
    });

    const applicantNameClean = sanitizeName(currentSession.applicantName || 'Applicant');
    const visaTypeClean = currentSession.visaType || 'Tourist';
    const folderName = `Russian_Visa_Package_${visaTypeClean}_${applicantNameClean}`;

    // Create subfolder inside chosen directory
    const appDirHandle = await parentDirHandle.getDirectoryHandle(folderName, { create: true });

    // 1. Write Summary HTML
    const summaryFileHandle = await appDirHandle.getFileHandle(`00_Application_Checklist_Summary_${applicantNameClean}.html`, { create: true });
    const summaryWritable = await summaryFileHandle.createWritable();
    await summaryWritable.write(generatePrintableSummaryHtml());
    await summaryWritable.close();

    // 2. Write Attached Files using direct Uint8Array conversion (no fetch call)
    let count = 0;
    for (const task of currentSession.tasks) {
      if (task.attachedFile && task.attachedFile.dataUrl) {
        const ext = getFileExt(task.attachedFile.name);
        const fileName = `${task.standardName}_${applicantNameClean}.${ext}`;
        const fileHandle = await appDirHandle.getFileHandle(fileName, { create: true });
        
        // Direct Base64 to Blob conversion (bypasses fetch URL length limits)
        const fileBlob = dataUrlToBlob(task.attachedFile.dataUrl);
        
        const writable = await fileHandle.createWritable();
        await writable.write(fileBlob);
        await writable.close();
        count++;
      } else {
        // Write instruction template file for missing items
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

    saveSessionToStorage(true, `Successfully created folder "${folderName}" with ${count} attached files on your PC!`);
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('File System Access API error:', err);
      alert('Could not write directly to folder (browser permission policy). Downloading standard .ZIP package instead.');
      exportDocumentPackageZip();
    }
  }
}

// Convert Base64 dataURL to Blob safely without using fetch()
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
  const totalCount = currentSession.tasks.length;

  let taskRowsHtml = '';
  currentSession.tasks.forEach((task, i) => {
    const statusText = task.status === 'done' ? '&#10003; COMPLETED' : (task.status === 'in-progress' ? '&#9679; IN PROGRESS' : '&#9675; NOT STARTED');
    const statusColor = task.status === 'done' ? '#059669' : (task.status === 'in-progress' ? '#D97706' : '#64748B');
    const attachedInfo = task.attachedFile ? `Attached: <strong>${escapeHtml(task.attachedFile.name)}</strong> (${task.attachedFile.size})` : 'No file attached';

    taskRowsHtml += `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 12px; font-weight: bold; width: 40px;">${i+1}.</td>
        <td style="padding: 12px;">
          <div style="font-weight: bold; color: #0F172A; font-size: 15px;">${escapeHtml(task.title)}</div>
          <div style="color: #64748B; font-size: 13px; margin-top: 2px;">${escapeHtml(task.hint)}</div>
          <div style="color: #2563EB; font-size: 12px; margin-top: 4px;">${attachedInfo}</div>
        </td>
        <td style="padding: 12px; text-align: right; width: 140px;">
          <span style="display: inline-block; padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; color: ${statusColor}; border: 1px solid ${statusColor};">${statusText}</span>
        </td>
      </tr>
    `;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Russian Visa Application Checklist Summary - ${escapeHtml(currentSession.applicantName)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; line-height: 1.5; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    .meta-box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; border-radius: 8px; margin: 20px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .footer-note { margin-top: 30px; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 15px; }
  </style>
</head>
<body>
  <h1>Russian Visa Application Package</h1>
  <p style="color: #64748B; font-size: 14px; margin-top: 0;">Official Checklist & Document Bundle Summary</p>

  <div class="meta-box">
    <div><strong>Applicant Name:</strong> ${escapeHtml(currentSession.applicantName)}</div>
    <div><strong>Visa Category:</strong> ${escapeHtml(visaDef.title)}</div>
    <div><strong>Citizenship:</strong> ${escapeHtml(currentSession.nationality)}</div>
    <div><strong>Requested Entries:</strong> ${escapeHtml(currentSession.entries)}</div>
    <div><strong>Progress:</strong> ${doneCount} of ${totalCount} items complete</div>
    <div><strong>Date Generated:</strong> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
  </div>

  <h2>Document Checklist</h2>
  <table>
    <tbody>
      ${taskRowsHtml}
    </tbody>
  </table>

  <div class="footer-note">
    <p><strong>Submission Notice:</strong> Present this checklist along with your original passport, printed signed EVA form, passport photos, and official voucher/invitation at the Russian Visa Application Centre (VFS Global / Russia Visa Centre) or Consular Section.</p>
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
  if (overlay) {
    overlay.style.display = 'block';
  }

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

  // Update Popover Content
  const badge = document.getElementById('tourStepBadge');
  if (badge) badge.textContent = `Step ${index + 1} of ${TOUR_STEPS.length}`;

  const title = document.getElementById('tourTitle');
  if (title) title.textContent = step.title;

  const desc = document.getElementById('tourDescription');
  if (desc) desc.textContent = step.description;

  const prevBtn = document.getElementById('tourPrevBtn');
  if (prevBtn) {
    prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
  }

  const nextBtn = document.getElementById('tourNextBtn');
  if (nextBtn) {
    nextBtn.innerHTML = index === TOUR_STEPS.length - 1 ? 'Finish Tour &#10003;' : 'Next &rarr;';
  }

  // Update Dots
  const dots = document.querySelectorAll('.tour-dot');
  dots.forEach((dot, dotIdx) => {
    if (dotIdx === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Scroll to element & Position spotlight & popover
  if (targetElem) {
    targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      positionTourElements(targetElem, step.placement);
    }, 280);
  }
}

function positionTourElements(targetElem, placement = 'bottom') {
  const spotlight = document.getElementById('tourSpotlightBox');
  const popover = document.getElementById('tourPopover');
  if (!spotlight || !popover || !targetElem) return;

  const rect = targetElem.getBoundingClientRect();
  const padding = 8;

  // Position Spotlight box with padding
  const top = Math.max(0, rect.top - padding);
  const left = Math.max(0, rect.left - padding);
  const width = rect.width + (padding * 2);
  const height = rect.height + (padding * 2);

  spotlight.style.top = `${top}px`;
  spotlight.style.left = `${left}px`;
  spotlight.style.width = `${width}px`;
  spotlight.style.height = `${height}px`;

  // Position Popover intelligent placement
  const popoverWidth = popover.offsetWidth || 340;
  const popoverHeight = popover.offsetHeight || 200;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let popoverTop = 0;
  let popoverLeft = 0;

  if (placement === 'bottom' && (top + height + popoverHeight + 20 < windowHeight)) {
    popoverTop = top + height + 14;
    popoverLeft = Math.min(Math.max(16, left), windowWidth - popoverWidth - 16);
  } else if (placement === 'top' && (top - popoverHeight - 14 > 0)) {
    popoverTop = top - popoverHeight - 14;
    popoverLeft = Math.min(Math.max(16, left), windowWidth - popoverWidth - 16);
  } else {
    // Center fallback if space is tight
    popoverTop = Math.min(Math.max(80, top + 20), windowHeight - popoverHeight - 20);
    popoverLeft = Math.min(Math.max(16, (windowWidth - popoverWidth) / 2), windowWidth - popoverWidth - 16);
  }

  popover.style.top = `${popoverTop}px`;
  popover.style.left = `${popoverLeft}px`;
}

function nextTourStep() {
  if (currentTourStep < TOUR_STEPS.length - 1) {
    showTourStep(currentTourStep + 1);
  } else {
    endInteractiveTour();
    saveSessionToStorage(true, 'Tour completed! You are ready to prepare your application.');
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
  if (overlay) {
    overlay.style.display = 'none';
  }
  localStorage.setItem(TOUR_SEEN_KEY, 'true');
}

// Reposition on window resize or scroll when tour is open
window.addEventListener('resize', () => {
  if (isTourActive) {
    const step = TOUR_STEPS[currentTourStep];
    const targetElem = document.getElementById(step.targetId);
    if (targetElem) positionTourElements(targetElem, step.placement);
  }
});

window.addEventListener('scroll', () => {
  if (isTourActive) {
    const step = TOUR_STEPS[currentTourStep];
    const targetElem = document.getElementById(step.targetId);
    if (targetElem) positionTourElements(targetElem, step.placement);
  }
}, { passive: true });

// Keyboard shortcuts for tour
window.addEventListener('keydown', (e) => {
  if (!isTourActive) return;

  if (e.key === 'Escape') {
    endInteractiveTour();
  } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
    nextTourStep();
  } else if (e.key === 'ArrowLeft') {
    prevTourStep();
  }
});

// ============================================================================
// Helpers & State Persistence
// ============================================================================

function saveSessionToStorage(showBanner = true, customMsg = null) {
  currentSession.lastSaved = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSession));

  const syncLabel = document.getElementById('syncLabel');
  if (syncLabel) syncLabel.textContent = 'Saved just now';

  if (showBanner) {
    const banner = document.getElementById('successBanner');
    const heading = document.getElementById('bannerHeading');
    const msg = document.getElementById('bannerMessage');

    if (heading && customMsg) heading.textContent = customMsg;
    if (msg) msg.textContent = `Your ${VISA_DATA[currentSession.visaType].title} progress and attached files have been saved securely on your device.`;

    if (banner) {
      banner.style.display = 'flex';
    }
  }
}

function loadSavedProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      currentSession = JSON.parse(raw);
      const syncLabel = document.getElementById('syncLabel');
      if (syncLabel) syncLabel.textContent = 'Saved locally';
    } catch (e) {
      console.error('Failed to parse saved session', e);
    }
  }
}

function exportJsonBackup() {
  saveSessionToStorage(false);

  const fileName = `russian_visa_${currentSession.visaType}_${sanitizeName(currentSession.applicantName)}_state.json`;
  const exportPayload = {
    portal: 'Russian Visa Application Portal',
    version: '4.0',
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

  saveSessionToStorage(true, `Exported State: ${fileName}`);
}

function handleFileRestore(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed && (parsed.session || parsed.visaType)) {
        currentSession = parsed.session || parsed;
        saveSessionToStorage(true, 'Application progress restored successfully!');
        
        updateCardsVisualState(currentSession.visaType);
        renderTaskList();
      }
    } catch (err) {
      alert('Invalid backup file. Please select a valid JSON application file.');
    }
  };
  reader.readAsText(file);
}

function sanitizeName(name) {
  return (name || 'Applicant').replace(/[^a-zA-Z0-9_-]/g, '_');
}

function getFileExt(filename) {
  return (filename || '').split('.').pop() || 'bin';
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
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
// Event Listeners & Modal Controls
// ============================================================================

function setupEventListeners() {
  // Theme Toggle Button
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) themeBtn.onclick = toggleTheme;

  // Tour Buttons: Header, Banner, and Footer Links
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

  // Tour Navigation Controls
  const tourNextBtn = document.getElementById('tourNextBtn');
  if (tourNextBtn) tourNextBtn.onclick = nextTourStep;

  const tourPrevBtn = document.getElementById('tourPrevBtn');
  if (tourPrevBtn) tourPrevBtn.onclick = prevTourStep;

  const tourCloseBtn = document.getElementById('tourCloseBtn');
  if (tourCloseBtn) tourCloseBtn.onclick = endInteractiveTour;

  // Applicant Name Input Real-Time Sync
  const nameInput = document.getElementById('applicantNameInput');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      currentSession.applicantName = e.target.value;
      saveSessionToStorage(false);
    });
  }

  // Interactive Visa Category Cards (Immediate Response on Click)
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

  // Action Buttons: Start New Application Modal
  const startBtn = document.getElementById('startAppBtn');
  if (startBtn) {
    startBtn.onclick = () => {
      const modal = document.getElementById('newAppModal');
      if (modal) modal.style.display = 'flex';
    };
  }

  // Action Buttons: Save Progress (Top bar, Header, Sidebar)
  const saveBtn = document.getElementById('saveProgressBtn');
  if (saveBtn) {
    saveBtn.onclick = () => saveSessionToStorage(true, 'Progress saved successfully!');
  }

  const headerSaveBtn = document.getElementById('headerSaveBtn');
  if (headerSaveBtn) {
    headerSaveBtn.onclick = () => saveSessionToStorage(true, 'Progress saved successfully!');
  }

  const sidebarSaveBtn = document.getElementById('sidebarSaveBtn');
  if (sidebarSaveBtn) {
    sidebarSaveBtn.onclick = () => saveSessionToStorage(true, 'Progress saved successfully!');
  }

  // Export Document Package .ZIP (Buttons in Top Bar, Checklist Banner, and Footer)
  const quickZipBtn = document.getElementById('quickZipBtn');
  if (quickZipBtn) quickZipBtn.onclick = exportDocumentPackageZip;

  const exportZipBtn = document.getElementById('exportZipBtn');
  if (exportZipBtn) exportZipBtn.onclick = exportDocumentPackageZip;

  const bottomZipBtn = document.getElementById('bottomZipBtn');
  if (bottomZipBtn) bottomZipBtn.onclick = exportDocumentPackageZip;

  // Direct PC Folder Save Button
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

  // Mark All Done Button
  const markAllBtn = document.getElementById('markAllDoneBtn');
  if (markAllBtn) {
    markAllBtn.onclick = markAllCompleted;
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
    cancelModalBtn.onclick = () => {
      document.getElementById('newAppModal').style.display = 'none';
    };
  }

  const modalCloseSecBtn = document.getElementById('modalCloseSecondaryBtn');
  if (modalCloseSecBtn) {
    modalCloseSecBtn.onclick = () => {
      document.getElementById('newAppModal').style.display = 'none';
    };
  }

  const confirmStartBtn = document.getElementById('confirmStartBtn');
  if (confirmStartBtn) {
    confirmStartBtn.onclick = () => {
      const applicantName = document.getElementById('modalApplicantName').value || 'Tom Barclay';
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
      document.getElementById('newAppModal').style.display = 'none';
      
      updateCardsVisualState(selectedType);
      renderTaskList();

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
}

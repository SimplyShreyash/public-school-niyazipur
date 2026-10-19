/**
 * PUBLIC SCHOOL, NIYAZIPUR, ARJUNPUR
 * Master JavaScript File
 * Administered by Ajit Kumar Thakur
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarCanvas();
  initStatsCounter();
  initFeeTabs();
  initFeeCalculator();
  initFacilityFilter();
  initFaqAccordion();
  initModals();
  initEnquiryForms();
  initMobileMenu();
});

/* ==========================================================================
   1. STAR PARTICLES CANVAS ENGINE (TWINKLING & SLIGHTING LIKE STARS)
   ========================================================================== */
function initStarCanvas() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const stars = [];
  const starCount = 85;

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.3 + 0.05,
      speedX: (Math.random() - 0.5) * 0.15,
      alpha: Math.random(),
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.4 ? '#FFB703' : '#FFFFFF',
      isSpecial: Math.random() > 0.85
    });
  }

  function drawStarShape(ctx, cx, cy, spikes, outerRadius, innerRadius, alpha, color) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Twinkle calculation
      s.alpha += s.twinkleSpeed;
      if (s.alpha > 1 || s.alpha < 0.2) {
        s.twinkleSpeed = -s.twinkleSpeed;
      }

      // Movement
      s.y -= s.speedY;
      s.x += s.speedX;

      // Wrap around
      if (s.y < 0) s.y = height;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;

      if (s.isSpecial) {
        // Draw 4-point sparkling star
        drawStarShape(ctx, s.x, s.y, 4, s.radius * 3.5, s.radius * 1.2, s.alpha, s.color);
      } else {
        // Soft glowing circle
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha * 0.9;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      statNumbers.forEach((counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const stepTime = 30;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.innerText = target.toLocaleString('en-IN');
            clearInterval(timer);
          } else {
            counter.innerText = Math.floor(current).toLocaleString('en-IN');
          }
        }, stepTime);
      });
    }
  }, { threshold: 0.3 });

  const statsStrip = document.querySelector('.stats-counter-strip');
  if (statsStrip) observer.observe(statsStrip);
}

/* ==========================================================================
   3. TABBED FEE STRUCTURE DATA & DISPLAY
   ========================================================================== */
const feeDatabase = {
  preprimary: {
    title: 'Pre-Primary Wing (Nursery, LKG, UKG)',
    headers: ['Grade / Class', 'Admission Fee (One-Time)', 'Annual Composite Fee', 'Monthly Tuition Fee', 'Smart Class / Activity', 'Annual Total Est.'],
    rows: [
      ['Nursery (Playway)', '₹ 2,500', '₹ 2,800', '₹ 750', '₹ 150', '₹ 16,100'],
      ['Lower KG (LKG)', '₹ 2,500', '₹ 3,000', '₹ 850', '₹ 200', '₹ 18,100'],
      ['Upper KG (UKG)', '₹ 2,500', '₹ 3,000', '₹ 900', '₹ 200', '₹ 18,700']
    ],
    note: '★ Includes Montessori activity kit, color workbooks & smart audio-visual learning sessions.'
  },
  primary: {
    title: 'Primary Wing (Classes 1 to 5)',
    headers: ['Grade / Class', 'Admission Fee (One-Time)', 'Annual Composite Fee', 'Monthly Tuition Fee', 'Computer / STEM Lab', 'Annual Total Est.'],
    rows: [
      ['Class 1', '₹ 3,000', '₹ 3,200', '₹ 1,050', '₹ 200', '₹ 21,200'],
      ['Class 2', '₹ 3,000', '₹ 3,200', '₹ 1,100', '₹ 200', '₹ 21,800'],
      ['Class 3', '₹ 3,500', '₹ 3,500', '₹ 1,150', '₹ 250', '₹ 23,800'],
      ['Class 4', '₹ 3,500', '₹ 3,500', '₹ 1,200', '₹ 250', '₹ 24,400'],
      ['Class 5', '₹ 3,500', '₹ 3,500', '₹ 1,250', '₹ 250', '₹ 25,000']
    ],
    note: '★ Includes foundational Math & Olympiad practice modules, Spoken English, and Computer Lab access.'
  },
  middle: {
    title: 'Middle Wing (Classes 6 to 8)',
    headers: ['Grade / Class', 'Admission Fee (One-Time)', 'Annual Composite Fee', 'Monthly Tuition Fee', 'Science & Lab Fee', 'Annual Total Est.'],
    rows: [
      ['Class 6', '₹ 4,000', '₹ 4,000', '₹ 1,350', '₹ 300', '₹ 27,800'],
      ['Class 7', '₹ 4,500', '₹ 4,200', '₹ 1,400', '₹ 300', '₹ 29,100'],
      ['Class 8', '₹ 4,500', '₹ 4,200', '₹ 1,450', '₹ 350', '₹ 30,300']
    ],
    note: '★ Includes Integrated Science & AI Coding labs, Olympiad mentorship, and dedicated sports coaching.'
  },
  secondary: {
    title: 'Secondary Wing (Classes 9 & 10 - Board)',
    headers: ['Grade / Class', 'Admission Fee (One-Time)', 'Annual Composite Fee', 'Monthly Tuition Fee', 'Special Olympiad / Lab', 'Annual Total Est.'],
    rows: [
      ['Class 9', '₹ 5,000', '₹ 4,800', '₹ 1,750', '₹ 400', '₹ 35,600'],
      ['Class 10 (Board)', '₹ 5,500', '₹ 5,000', '₹ 1,850', '₹ 450', '₹ 38,100']
    ],
    note: '★ Includes Board Examination preparation series, weekly mock tests, remedial classes & science practicals.'
  },
  senior: {
    title: 'Senior Secondary Wing (Classes 11 & 12)',
    headers: ['Stream / Grade', 'Admission Fee (One-Time)', 'Annual Composite Fee', 'Monthly Tuition Fee', 'Competitive Foundation', 'Annual Total Est.'],
    rows: [
      ['Class 11 - Science (PCM/PCB)', '₹ 6,500', '₹ 6,000', '₹ 2,400', '₹ 600', '₹ 48,500'],
      ['Class 11 - Commerce / Arts', '₹ 5,500', '₹ 5,500', '₹ 2,000', '₹ 400', '₹ 39,800'],
      ['Class 12 - Science (Board + NEET/JEE)', '₹ 6,500', '₹ 6,200', '₹ 2,500', '₹ 600', '₹ 49,900'],
      ['Class 12 - Commerce / Arts (Board)', '₹ 5,500', '₹ 5,800', '₹ 2,100', '₹ 400', '₹ 41,300']
    ],
    note: '★ Narayana-pattern Integrated Competitive Coaching for NEET, JEE & CUET under expert faculty guidance.'
  }
};

function initFeeTabs() {
  const tabBtns = document.querySelectorAll('.fee-tab-btn');
  const tableContent = document.getElementById('fee-table-content');
  if (!tabBtns.length || !tableContent) return;

  function renderTable(wingKey) {
    const data = feeDatabase[wingKey];
    if (!data) return;

    let headersHtml = data.headers.map((h, i) => `<th class="${i === data.headers.length - 1 ? 'fee-highlight-col' : ''}">${h}</th>`).join('');
    
    let rowsHtml = data.rows.map(row => {
      let cells = row.map((cell, idx) => {
        if (idx === row.length - 1) {
          return `<td class="fee-highlight-col"><strong>${cell}</strong> <span class="fee-tag-badge">Transparent</span></td>`;
        }
        return `<td>${cell}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    tableContent.innerHTML = `
      <div style="padding: 16px 20px; background: #061A40; color: #FFB703; font-weight: 800; font-size: 1.05rem; display: flex; align-items: center; justify-content: space-between;">
        <span>★ ${data.title}</span>
        <span style="font-size: 0.8rem; color: #FFFFFF; font-weight: 500;">Academic Year 2026-27</span>
      </div>
      <div class="table-responsive">
        <table class="fee-table">
          <thead><tr>${headersHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
      <div style="padding: 12px 20px; background: #FFFBEB; border-top: 1px solid #FEF08A; font-size: 0.85rem; color: #92400E; font-weight: 600;">
        ${data.note}
      </div>
    `;
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTable(btn.getAttribute('data-wing'));
    });
  });

  // Render initial tab
  renderTable('preprimary');
}

/* ==========================================================================
   4. INTERACTIVE REAL-TIME FEE CALCULATOR
   ========================================================================== */
function initFeeCalculator() {
  const classSelect = document.getElementById('calc-class');
  const transportSelect = document.getElementById('calc-transport');
  const siblingCheck = document.getElementById('calc-sibling');
  const termSelect = document.getElementById('calc-term');

  const totalAmountEl = document.getElementById('calc-total-amount');
  const termLabelEl = document.getElementById('calc-term-label');
  const tuitionBreakEl = document.getElementById('calc-tuition-val');
  const transportBreakEl = document.getElementById('calc-transport-val');
  const discountRowEl = document.getElementById('calc-discount-row');
  const discountValEl = document.getElementById('calc-discount-val');

  if (!classSelect) return;

  const baseTuitionRates = {
    'nursery': 800,
    'lkg': 900,
    'ukg': 950,
    'class1_5': 1200,
    'class6_8': 1450,
    'class9_10': 1850,
    'class11_12_sci': 2400,
    'class11_12_comm': 2050
  };

  const transportRates = {
    '0': 0,
    '600': 600,
    '900': 900,
    '1200': 1200
  };

  function recalculate() {
    const selectedClass = classSelect.value;
    const monthlyTuition = baseTuitionRates[selectedClass] || 1200;
    const monthlyTransport = parseInt(transportSelect.value, 10) || 0;
    const hasSibling = siblingCheck ? siblingCheck.checked : false;
    const term = termSelect.value; // 'month', 'quarter', 'annual'

    let discount = 0;
    if (hasSibling) {
      discount = Math.round(monthlyTuition * 0.25); // 25% discount on tuition
    }

    const netMonthlyTuition = monthlyTuition - discount;
    const netMonthlyTotal = netMonthlyTuition + monthlyTransport;

    let multiplier = 1;
    let label = 'Per Month';

    if (term === 'quarter') {
      multiplier = 3;
      label = 'Per Quarter (3 Months)';
    } else if (term === 'annual') {
      multiplier = 12;
      label = 'Total Annual Estimate (12 Months)';
    }

    const finalTotal = netMonthlyTotal * multiplier;

    totalAmountEl.innerText = '₹ ' + finalTotal.toLocaleString('en-IN');
    termLabelEl.innerText = label;

    tuitionBreakEl.innerText = '₹ ' + (monthlyTuition * multiplier).toLocaleString('en-IN');
    transportBreakEl.innerText = monthlyTransport > 0 ? '₹ ' + (monthlyTransport * multiplier).toLocaleString('en-IN') : 'Not Opted';

    if (hasSibling) {
      discountRowEl.style.display = 'flex';
      discountValEl.innerText = '- ₹ ' + (discount * multiplier).toLocaleString('en-IN') + ' (25% Off)';
    } else {
      discountRowEl.style.display = 'none';
    }
  }

  classSelect.addEventListener('change', recalculate);
  transportSelect.addEventListener('change', recalculate);
  if (siblingCheck) siblingCheck.addEventListener('change', recalculate);
  termSelect.addEventListener('change', recalculate);

  recalculate();
}

/* ==========================================================================
   5. FACILITY FILTER
   ========================================================================== */
function initFacilityFilter() {
  const filterBtns = document.querySelectorAll('.facility-filter-btn');
  const facilityCards = document.querySelectorAll('.facility-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      facilityCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. MODALS (ADMISSION FORM & PAY ONLINE)
   ========================================================================== */
function initModals() {
  const admissionModal = document.getElementById('admission-modal');
  const payOnlineModal = document.getElementById('pay-online-modal');
  const prospectusModal = document.getElementById('prospectus-modal');

  // Trigger buttons
  const openAdmissionBtns = document.querySelectorAll('.trigger-admission-modal');
  const openPayBtns = document.querySelectorAll('.trigger-pay-modal');
  const openProspectusBtns = document.querySelectorAll('.trigger-prospectus-modal');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  openAdmissionBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(admissionModal);
  }));

  openPayBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(payOnlineModal);
  }));

  openProspectusBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(prospectusModal);
  }));

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(admissionModal);
      closeModal(payOnlineModal);
      closeModal(prospectusModal);
    });
  });

  // Close on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === admissionModal) closeModal(admissionModal);
    if (e.target === payOnlineModal) closeModal(payOnlineModal);
    if (e.target === prospectusModal) closeModal(prospectusModal);
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(admissionModal);
      closeModal(payOnlineModal);
      closeModal(prospectusModal);
    }
  });
}

/* ==========================================================================
   8. ADMISSION FORM SUBMISSION & PRINTABLE RECEIPT
   ========================================================================== */
function initEnquiryForms() {
  const forms = [
    document.getElementById('hero-enquiry-form'),
    document.getElementById('modal-enquiry-form')
  ];

  forms.forEach(form => {
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="student_name"]').value.trim();
      const phone = form.querySelector('[name="parent_phone"]').value.trim();
      const grade = form.querySelector('[name="grade_applying"]').value;
      const refNum = 'PSNA-2026-' + Math.floor(1000 + Math.random() * 9000);

      const modalSuccess = document.getElementById('modal-success-box');
      const modalForm = document.getElementById('modal-form-content');
      const admissionModal = document.getElementById('admission-modal');

      if (modalSuccess && modalForm && admissionModal) {
        // If submitted from hero, open modal and show success
        admissionModal.classList.add('active');
        modalForm.style.display = 'none';
        modalSuccess.style.display = 'block';

        const detailsEl = document.getElementById('success-details');
        if (detailsEl) {
          detailsEl.innerHTML = `
            <div style="background: #F8FAFC; border: 1.5px dashed #0056B3; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: left;">
              <p><strong>Application Ref No:</strong> <span style="color:#FB8500; font-weight:800;">${refNum}</span></p>
              <p><strong>Student Name:</strong> ${name}</p>
              <p><strong>Parent Contact:</strong> ${phone}</p>
              <p><strong>Campus:</strong> Niyazipur, Simri Block, Buxar District (PIN: 802131) • UDISE+: 10301901109</p>
              <p><strong>Administration:</strong> Shri Ajit Kumar Thakur (Founder &amp; Administrator)</p>
            </div>
          `;
        }

        form.reset();
      }
    });
  });

  const printBtn = document.getElementById('btn-print-slip');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   9. MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const navLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.add('open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}


/* ==========================================================================
   10. PSAT SCHOLARSHIP REGISTRATION & ADMIT CARD GENERATOR
   ========================================================================== */
function initPsatModule() {
  const psatForm = document.getElementById('psat-reg-form');
  const psatModal = document.getElementById('psat-modal');
  const openPsatBtns = document.querySelectorAll('.trigger-psat-modal');
  const psatAdmitBox = document.getElementById('psat-admit-card-box');
  const psatFormWrap = document.getElementById('psat-form-wrap');

  if (!psatModal) return;

  openPsatBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      psatModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (psatFormWrap) psatFormWrap.style.display = 'block';
      if (psatAdmitBox) psatAdmitBox.style.display = 'none';
    });
  });

  if (psatForm) {
    psatForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = psatForm.querySelector('[name="student_name"]').value.trim();
      const phone = psatForm.querySelector('[name="parent_phone"]').value.trim();
      const grade = psatForm.querySelector('[name="class_applying"]').value;
      const testDate = psatForm.querySelector('[name="test_date"]').value;
      const rollNumber = 'PSAT-' + Math.floor(10000 + Math.random() * 90000);

      if (psatFormWrap) psatFormWrap.style.display = 'none';
      if (psatAdmitBox) {
        psatAdmitBox.style.display = 'block';
        psatAdmitBox.innerHTML = `
          <div class="official-receipt-box">
            <div class="receipt-header-row">
              <img src="assets/logo.svg" alt="Logo" style="width: 55px; height: 55px; border-radius: 50%;">
              <div class="receipt-school-meta" style="text-align: center; flex-grow: 1;">
                <h2>PUBLIC SCHOOL, NIYAZIPUR</h2>
                <p>Simri Block, Buxar District, Bihar (PIN: 802131) • UDISE+: 10301901109</p>
                <p><strong>OFFICIAL EXAMINATION HALL TICKET / ADMIT CARD</strong></p>
              </div>
              <img src="assets/psat-badge.svg" alt="PSAT" style="width: 50px; height: 50px;">
            </div>

            <div class="receipt-meta-grid">
              <div><strong>Roll Number:</strong> <span style="color:#D97706; font-weight:900;">${rollNumber}</span></div>
              <div><strong>Exam Date:</strong> ${testDate} (10:00 AM)</div>
              <div><strong>Candidate Name:</strong> ${name}</div>
              <div><strong>Parent Mobile:</strong> ${phone}</div>
              <div><strong>Class / Stream:</strong> ${grade}</div>
              <div><strong>Exam Mode:</strong> Offline (OMR Sheet)</div>
              <div style="grid-column: span 2;"><strong>Exam Center:</strong> Main Campus, Public School, Niyazipur, Simri Block, Buxar (PIN: 802131)</div>
            </div>

            <div style="background: #FFFBEB; border: 1px solid #FDE047; padding: 10px 14px; border-radius: 6px; font-size: 0.8rem; color: #78350F; margin-bottom: 16px;">
              <strong>Exam Instructions:</strong><br>
              1. Candidate must report 30 minutes before exam time with this Admit Card.<br>
              2. Bring Blue/Black ballpoint pens.<br>
              3. Results and scholarship awards will be declared by Administrator Shri Ajit Kumar Thakur within 7 working days.
            </div>

            <div class="receipt-auth-footer">
              <div>
                <img src="assets/school-seal.svg" alt="Seal" class="stamp-seal-img">
                <p style="font-size: 0.72rem; color: #64748B;">Official Verified Seal</p>
              </div>
              <div style="text-align: right;">
                <img src="assets/signature.svg" alt="Signature" class="signature-img">
                <p style="font-size: 0.8rem; font-weight: 700; color: #061A40;">Ajit Kumar Thakur</p>
                <p style="font-size: 0.72rem; color: #64748B;">Founder &amp; Controller of Exams</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px;" class="no-print">
              <button onclick="window.print()" class="btn-hero-primary" style="padding: 10px 24px; font-size: 0.9rem;">
                <i class="fa-solid fa-print"></i> Print Hall Ticket
              </button>
            </div>
          </div>
        `;
      }
    });
  }
}

/* ==========================================================================
   11. INSTANT OFFICIAL FEE RECEIPT GENERATOR & PORTAL
   ========================================================================== */
function initFeeReceiptGenerator() {
  const receiptForm = document.getElementById('generate-receipt-form');
  const receiptOutputBox = document.getElementById('receipt-output-container');
  const receiptModal = document.getElementById('receipt-modal');
  const openReceiptBtns = document.querySelectorAll('.trigger-receipt-modal');

  if (!receiptModal) return;

  openReceiptBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      receiptModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (receiptForm) receiptForm.style.display = 'block';
      if (receiptOutputBox) receiptOutputBox.style.display = 'none';
    });
  });

  if (receiptForm) {
    receiptForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const studentName = receiptForm.querySelector('[name="student_name"]').value.trim();
      const grade = receiptForm.querySelector('[name="student_class"]').value;
      const quarter = receiptForm.querySelector('[name="fee_quarter"]').value;
      const amount = receiptForm.querySelector('[name="fee_amount"]').value;
      const mode = receiptForm.querySelector('[name="pay_mode"]').value;
      const receiptNo = 'RCP-' + Math.floor(100000 + Math.random() * 900000);
      const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

      receiptForm.style.display = 'none';
      if (receiptOutputBox) {
        receiptOutputBox.style.display = 'block';
        receiptOutputBox.innerHTML = `
          <div class="official-receipt-box">
            <div class="receipt-header-row">
              <img src="assets/logo.svg" alt="Logo" style="width: 60px; height: 60px; border-radius: 50%;">
              <div class="receipt-school-meta" style="text-align: center; flex-grow: 1;">
                <h2>PUBLIC SCHOOL, NIYAZIPUR</h2>
                <p>Niyazipur, Simri Block, Buxar District, Bihar (PIN: 802131) • UDISE+: 10301901109 • Estd. 2011</p>
                <p>Administered by: <strong>Shri Ajit Kumar Thakur</strong></p>
                <div style="font-weight: 800; font-size: 0.95rem; color: #0056B3; margin-top: 2px;">OFFICIAL STUDENT FEE RECEIPT</div>
              </div>
            </div>

            <div class="receipt-meta-grid">
              <div><strong>Receipt No:</strong> <span style="color:#D97706; font-weight:800;">${receiptNo}</span></div>
              <div><strong>Date of Issue:</strong> ${today}</div>
              <div><strong>Student Name:</strong> ${studentName}</div>
              <div><strong>Grade / Class:</strong> ${grade}</div>
              <div><strong>Fee Period:</strong> ${quarter}</div>
              <div><strong>Payment Mode:</strong> ${mode} (Verified)</div>
            </div>

            <table class="receipt-items-table">
              <thead>
                <tr>
                  <th>Particulars / Fee Head</th>
                  <th style="text-align:right;">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly Tuition &amp; Academic Composite Fee</td>
                  <td style="text-align:right;">₹ ${amount}</td>
                </tr>
                <tr>
                  <td>Smart Classroom &amp; Digital Lab Fee</td>
                  <td style="text-align:right;">INCLUDED</td>
                </tr>
                <tr>
                  <td>Library, Sports &amp; Development Fund</td>
                  <td style="text-align:right;">INCLUDED</td>
                </tr>
                <tr style="background: #F1F5F9; font-weight:900; font-size: 0.95rem;">
                  <td>TOTAL AMOUNT PAID:</td>
                  <td style="text-align:right; color:#0056B3;">₹ ${amount}</td>
                </tr>
              </tbody>
            </table>

            <div style="font-size: 0.78rem; color: #475569; margin-bottom: 16px;">
              <strong>Payment Status:</strong> Successfully Cleared &amp; Recorded in School Accounts Ledger.
            </div>

            <div class="receipt-auth-footer">
              <div>
                <img src="assets/school-seal.svg" alt="Official Seal" class="stamp-seal-img">
                <p style="font-size: 0.72rem; color: #64748B;">School Accounts Seal</p>
              </div>
              <div style="text-align: right;">
                <img src="assets/signature.svg" alt="Authorized Signature" class="signature-img">
                <p style="font-size: 0.8rem; font-weight: 700; color: #061A40;">Ajit Kumar Thakur</p>
                <p style="font-size: 0.72rem; color: #64748B;">Director &amp; Administrator</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px;" class="no-print">
              <button onclick="window.print()" class="btn-hero-primary" style="padding: 10px 24px; font-size: 0.9rem;">
                <i class="fa-solid fa-print"></i> Print Official Receipt
              </button>
            </div>
          </div>
        `;
      }
    });
  }
}

/* ==========================================================================
   12. VIRTUAL CAMPUS FLOOR EXPLORER
   ========================================================================== */
const campusFloors = {
  ground: {
    title: 'Ground Floor: Administrative Block & Kindergarten',
    desc: 'The welcoming entrance with administrative reception, Director Shri Ajit Kumar Thakur desk, infirmary, and safe child-friendly kindergarten playrooms.',
    spots: [
      { name: 'Director & Admin Suite', desc: 'Direct accessibility for parents and students to meet Shri Ajit Kumar Thakur.' },
      { name: 'Montessori Kindergarten Zone', desc: 'Bright playway classrooms with educational toys and soft flooring.' },
      { name: 'Medical Health Clinic', desc: 'First-aid post with certified nursing attendant and regular health checks.' }
    ]
  },
  first: {
    title: 'First Floor: Primary Wing & Digital Library',
    desc: 'Home to Classes 1 through 5, equipped with modern interactive panels and our extensive library.',
    spots: [
      { name: 'Primary Smart Classrooms', desc: 'Equipped with interactive LED multimedia smart boards.' },
      { name: 'Central Digital Library', desc: 'Over 5,000 titles, NCERT encyclopedias, and reading cubicles.' },
      { name: 'Activity & Art Studio', desc: 'Dedicated space for music, classical dance, and fine arts.' }
    ]
  },
  second: {
    title: 'Second Floor: STEM Labs & Middle School',
    desc: 'Specialized scientific environment for Middle School (Classes 6 to 8) with hands-on experimentation.',
    spots: [
      { name: 'Physics & Chemistry Lab', desc: 'Fully equipped workstations following international safety codes.' },
      { name: 'Robotics & Coding Lab', desc: 'Networked computers with Python, Scratch, and micro-controllers.' },
      { name: 'Biology & Nature Hub', desc: 'Compound microscopes, botanical specimens, and anatomical models.' }
    ]
  },
  third: {
    title: 'Third Floor: Secondary & Senior Competitive Wing',
    desc: 'Classes 9 to 12 focused on Board examinations and integrated Olympiad/NEET/JEE foundation prep.',
    spots: [
      { name: 'Board Examination Hall', desc: 'Spacious, well-ventilated halls optimized for timed test series.' },
      { name: 'Doubt Remedial Pods', desc: 'Dedicated mentoring spaces for one-on-one student teacher sessions.' },
      { name: 'Career Counseling Desk', desc: 'Guidance center for stream selection, CUET, and higher education.' }
    ]
  },
  sports: {
    title: 'Outdoor Complex: 2-Acre Sports Arena & Fleet Bay',
    desc: 'Expansive outdoor campus featuring sports turf, running tracks, and safe bus parking.',
    spots: [
      { name: 'Cricket & Football Turf', desc: 'Full-size pitch with practice nets and certified physical coaches.' },
      { name: 'Badminton & Athletics Track', desc: 'Regulation courts and 200m track for physical stamina.' },
      { name: 'GPS Fleet Terminal', desc: 'Designated safe pickup and drop bay for school buses and vans.' }
    ]
  }
};

function initVirtualCampus() {
  const floorBtns = document.querySelectorAll('.floor-btn');
  const detailsContainer = document.getElementById('floor-details-box');
  if (!floorBtns.length || !detailsContainer) return;

  function renderFloor(key) {
    const data = campusFloors[key];
    if (!data) return;

    let spotsHtml = data.spots.map(s => `
      <div class="floor-spot-item">
        <h4>★ ${s.name}</h4>
        <p>${s.desc}</p>
      </div>
    `).join('');

    detailsContainer.innerHTML = `
      <div style="border-bottom: 2px solid #E2E8F0; padding-bottom: 12px; margin-bottom: 16px;">
        <h3 style="font-family: var(--font-heading); color: #061A40; font-size: 1.35rem; font-weight: 800;">${data.title}</h3>
        <p style="color: #64748B; font-size: 0.92rem;">${data.desc}</p>
      </div>
      <div class="floor-highlights-grid">
        ${spotsHtml}
      </div>
    `;
  }

  floorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      floorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFloor(btn.getAttribute('data-floor'));
    });
  });

  renderFloor('ground');
}

/* ==========================================================================
   13. LIGHTBOX FOR GALLERY & EVENT PHOTOS
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const galleryItems = document.querySelectorAll('.facility-card, .event-card');

  if (!lightbox) return;

  galleryItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h3') ? item.querySelector('h3').innerText : 'Campus View';
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.innerText = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeBtn = document.querySelector('.lightbox-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

/* ==========================================================================
   14. PSAT PRACTICE QUIZ & SCHOLARSHIP PREDICTOR
   ========================================================================== */
const quizQuestions = [
  {
    q: "If a student cycles 15 km in 45 minutes, what is their average speed in km/h?",
    options: ["18 km/h", "20 km/h", "22.5 km/h", "25 km/h"],
    correct: 1,
    subject: "Mathematics & Speed"
  },
  {
    q: "Which cellular organelle is known as the 'Powerhouse of the Cell'?",
    options: ["Ribosome", "Nucleus", "Mitochondria", "Endoplasmic Reticulum"],
    correct: 2,
    subject: "General Science"
  },
  {
    q: "Find the next number in the logical sequence: 3, 7, 15, 31, 63, ___?",
    options: ["95", "127", "118", "125"],
    correct: 1,
    subject: "Logical Reasoning"
  },
  {
    q: "Pointing to a boy in the park, Neha said: 'He is the son of my grandfather\\'s only son.' How is the boy related to Neha?",
    options: ["Cousin", "Brother", "Uncle", "Nephew"],
    correct: 1,
    subject: "Verbal Aptitude"
  },
  {
    q: "Who was the renowned Indian scientist and 11th President revered as the 'Missile Man of India'?",
    options: ["Dr. Homi J. Bhabha", "Dr. A.P.J. Abdul Kalam", "Dr. Vikram Sarabhai", "Sir C.V. Raman"],
    correct: 1,
    subject: "Scientific Discovery"
  }
];

function initPsatQuiz() {
  const quizModal = document.getElementById('quiz-modal');
  const openQuizBtns = document.querySelectorAll('.trigger-quiz-modal');
  const quizContainer = document.getElementById('quiz-dynamic-container');

  if (!quizModal || !quizContainer) return;

  let currentQuestion = 0;
  let score = 0;

  function renderQuestion(index) {
    if (index >= quizQuestions.length) {
      renderResults();
      return;
    }

    const qData = quizQuestions[index];
    const letters = ['A', 'B', 'C', 'D'];
    const progressPercent = ((index + 1) / quizQuestions.length) * 100;

    quizContainer.innerHTML = `
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
      </div>
      <div class="quiz-q-num"><i class="fa-solid fa-brain"></i> Question ${index + 1} of ${quizQuestions.length} • ${qData.subject}</div>
      <div class="quiz-question-text">${qData.q}</div>
      <div class="quiz-options-list">
        ${qData.options.map((opt, i) => `
          <button class="quiz-option-btn" data-index="${i}">
            <span class="quiz-opt-letter">${letters[i]}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    quizContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = parseInt(btn.getAttribute('data-index'), 10);
        if (selected === qData.correct) {
          score++;
        }
        currentQuestion++;
        renderQuestion(currentQuestion);
      });
    });
  }

  function renderResults() {
    let tierTitle = "";
    let waiverText = "";
    let tierBadge = "";

    if (score >= 4) {
      tierTitle = "Top Tier Achiever: 100% Scholarship Potential!";
      waiverText = "Outstanding performance! You are in the top ranking bracket for up to 100% Tuition Fee Waiver in PSAT 2026-27!";
      tierBadge = "100% SCHOLARSHIP ELIGIBLE";
    } else if (score === 3) {
      tierTitle = "High Achiever: 50% Scholarship Potential!";
      waiverText = "Great effort! You qualify for our Tier-2 Merit Scholarship bracket with up to 50% Tuition Fee Waiver!";
      tierBadge = "50% SCHOLARSHIP ELIGIBLE";
    } else {
      tierTitle = "Promising Talent: Foundation Bracket!";
      waiverText = "Good attempt! You qualify for up to 25% Merit Scholarship and entrance to our Olympiad Foundation Coaching Batch!";
      tierBadge = "25% SCHOLARSHIP ELIGIBLE";
    }

    quizContainer.innerHTML = `
      <div class="quiz-result-box">
        <div class="quiz-score-badge">${score}/${quizQuestions.length}</div>
        <div style="font-size: 0.82rem; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
          <i class="fa-solid fa-circle-check"></i> ${tierBadge}
        </div>
        <h3 style="font-family: var(--font-heading); color: #061A40; font-size: 1.35rem; margin-bottom: 10px;">${tierTitle}</h3>
        <p style="color: #475569; font-size: 0.92rem; max-width: 480px; margin: 0 auto 24px; line-height: 1.55;">${waiverText}</p>
        
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button id="btn-claim-psat-scholarship" class="btn-hero-primary" style="background: linear-gradient(135deg, #10B981, #059669); color: #fff;">
            <i class="fa-solid fa-award"></i> Claim Scholarship &amp; Register for PSAT
          </button>
          <button id="btn-retake-quiz" class="btn-hero-secondary" style="border: 1.5px solid #0056B3; color: #0056B3; background: #EFF6FF;">
            <i class="fa-solid fa-rotate-right"></i> Try Again
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-retake-quiz').addEventListener('click', () => {
      currentQuestion = 0;
      score = 0;
      renderQuestion(0);
    });

    document.getElementById('btn-claim-psat-scholarship').addEventListener('click', () => {
      quizModal.classList.remove('active');
      const psatModal = document.getElementById('psat-modal');
      if (psatModal) {
        psatModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  function openQuiz() {
    currentQuestion = 0;
    score = 0;
    renderQuestion(0);
    quizModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  openQuizBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openQuiz();
    });
  });
}

/* ==========================================================================
   15. PRINTABLE OFFICIAL ADMISSION REGISTRATION FORM
   ========================================================================== */
function initPrintableAdmissionForm() {
  const formModal = document.getElementById('admission-form-download-modal');
  const openBtns = document.querySelectorAll('.trigger-print-admission-form');
  if (!formModal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      formModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
}

// Attach all initializers to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initPsatModule();
  initFeeReceiptGenerator();
  initVirtualCampus();
  initLightbox();
  initPsatQuiz();
  initPrintableAdmissionForm();
});

(function () {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const THEME_KEY = 'ruangbelajar-theme';
  const CRM_DONE_KEY = 'ruangbelajar-crm-p1-done';
  const DW_DONE_KEY = 'ruangbelajar-dw-p1-done';

  const CRM_SECTIONS = ['pengantar', 'strategic', 'operational', 'social', 'ekosistem', 'model'];
  const DW_SECTIONS = ['subcpmk', 'karakteristik', 'oltp-olap', 'arsitektur', 'ods', 'etl', 'metadata', 'rangkuman'];

  // Tema terang/gelap disimpan di browser pengguna.
  try {
    if (localStorage.getItem(THEME_KEY) === 'dark') document.body.classList.add('dark');
  } catch (_) {}

  const themeToggle = $('#themeToggle');
  function updateThemeButton() {
    if (themeToggle) {
      const dark = document.body.classList.contains('dark');
      themeToggle.textContent = dark ? '☾' : '☼';
      themeToggle.setAttribute('aria-label', dark ? 'Gunakan tema terang' : 'Gunakan tema gelap');
      themeToggle.title = dark ? 'Gunakan tema terang' : 'Gunakan tema gelap';
    }
  }
  updateThemeButton();

  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    try {
      localStorage.setItem(THEME_KEY, document.body.classList.contains('dark') ? 'dark' : 'light');
    } catch (_) {}
    updateThemeButton();
  });

  // Tahun footer.
  $$('#year').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Pencarian mata kuliah pada beranda.
  const courseSearch = $('#courseSearch');
  if (courseSearch) {
    const cards = $$('#courseGrid [data-search]');
    const empty = $('#emptySearch');
    courseSearch.addEventListener('input', () => {
      const q = courseSearch.value.trim().toLocaleLowerCase('id');
      let visible = 0;
      cards.forEach(card => {
        const searchAttr = card.dataset.search || '';
        const matches = searchAttr.toLocaleLowerCase('id').includes(q) || card.textContent.toLocaleLowerCase('id').includes(q);
        card.hidden = !matches;
        if (matches) visible++;
      });
      if (empty) empty.hidden = visible > 0;
    });

    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        courseSearch.focus();
      }
      if (event.key === 'Escape' && document.activeElement === courseSearch) {
        courseSearch.blur();
      }
    });
  }

  // Helper local storage untuk progres.
  function getCourseDone(key, allowedSections) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(data) ? data.filter(id => allowedSections.includes(id)) : [];
    } catch (_) {
      return [];
    }
  }

  function saveCourseDone(key, items) {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (_) {}
  }

  // Tentukan apakah halaman ini merupakan halaman materi spesifik.
  const isDwLesson = document.body.classList.contains('dw-lesson') || window.location.pathname.includes('data-warehousing-data-mining');
  const isCrmLesson = document.body.classList.contains('crm-lesson') || (window.location.pathname.includes('/crm/') && !isDwLesson);

  const activeKey = isDwLesson ? DW_DONE_KEY : CRM_DONE_KEY;
  const activeSections = isDwLesson ? DW_SECTIONS : CRM_SECTIONS;

  function renderProgress() {
    const crmDone = getCourseDone(CRM_DONE_KEY, CRM_SECTIONS);
    const dwDone = getCourseDone(DW_DONE_KEY, DW_SECTIONS);

    // Update progres di beranda.
    const completedCountEl = $('#completedCount');
    if (completedCountEl) {
      completedCountEl.textContent = String(crmDone.length + dwDone.length);
    }

    const crmPercent = Math.round((crmDone.length / CRM_SECTIONS.length) * 100);
    const crmProgressText = $('#crmProgressText');
    if (crmProgressText) crmProgressText.textContent = `${crmPercent}%`;
    const crmProgressBar = $('#crmProgressBar');
    if (crmProgressBar) crmProgressBar.style.width = `${crmPercent}%`;

    const dwPercent = Math.round((dwDone.length / DW_SECTIONS.length) * 100);
    const dwProgressText = $('#dwProgressText');
    if (dwProgressText) dwProgressText.textContent = `${dwPercent}%`;
    const dwProgressBar = $('#dwProgressBar');
    if (dwProgressBar) dwProgressBar.style.width = `${dwPercent}%`;

    // Update progres di halaman materi yang sedang aktif.
    const currentDone = isDwLesson ? dwDone : crmDone;
    const currentSections = activeSections;
    const currentCount = currentDone.length;
    const currentPercent = Math.round((currentCount / currentSections.length) * 100);

    const lessonLabel = $('#lessonProgressLabel');
    if (lessonLabel) lessonLabel.textContent = `${currentCount} dari ${currentSections.length} bagian`;
    const lessonPercent = $('#lessonProgressPercent');
    if (lessonPercent) lessonPercent.textContent = `${currentPercent}%`;
    const lessonBar = $('#lessonProgressBar');
    if (lessonBar) lessonBar.style.width = `${currentPercent}%`;

    const summary = $('#progressSummary');
    if (summary) {
      if (currentCount === currentSections.length) {
        summary.textContent = 'Semua bagian materi telah kamu tandai selesai. Mantap!';
      } else if (currentCount > 0) {
        summary.textContent = `${currentCount} bagian sudah selesai dipelajari. Lanjutkan sedikit demi sedikit!`;
      } else {
        summary.textContent = 'Tandai bagian yang sudah kamu pelajari untuk memantau progres.';
      }
    }

    // Update tombol "Tandai bagian ini selesai"
    $$('[data-done]').forEach(button => {
      const id = button.dataset.done;
      const isDone = currentDone.includes(id);
      button.classList.toggle('is-done', isDone);
      button.innerHTML = isDone
        ? '<span>✓</span> Bagian selesai — klik untuk membatalkan'
        : '<span>✓</span> Tandai bagian ini selesai';
    });
  }

  // Interaksi tombol selesai pada submateri.
  $$('[data-done]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.done;
      const currentDone = getCourseDone(activeKey, activeSections);
      const updated = currentDone.includes(id)
        ? currentDone.filter(x => x !== id)
        : [...currentDone, id];
      saveCourseDone(activeKey, updated);
      renderProgress();
    });
  });

  renderProgress();

  // Highlight navigasi submateri saat pengguna menggulir halaman.
  const lessonSections = $$('[data-section]');
  const tocLinks = $$('.toc-link[href^="#"]');
  if ('IntersectionObserver' in window && lessonSections.length && tocLinks.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });
    lessonSections.forEach(section => observer.observe(section));
  }

  // Perbesar infografik ke modal.
  const modal = $('#imageModal');
  const modalImage = $('#modalImage');
  const modalClose = $('#modalClose');

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (modalImage) modalImage.src = '';
    document.body.style.overflow = '';
  }

  $$('[data-image]').forEach(button => {
    button.addEventListener('click', () => {
      if (!modal || !modalImage) return;
      modalImage.src = button.dataset.image;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });

  // Sistem Kuis Terpadu
  const quizForm = $('#quizForm');
  const quizResult = $('#quizResult');

  // Konfigurasi kuis untuk masing-masing mata kuliah.
  const quizConfigs = {
    crm: {
      answers: { q1: 'b', q2: 'c', q3: 'a', q4: 'b', q5: 'b' },
      explanations: {
        q1: 'CRM mengelola interaksi dan hubungan pelanggan secara terorganisasi.',
        q2: 'Operational CRM mengotomatisasi pemasaran, penjualan, dan layanan.',
        q3: 'Analytical CRM mengubah data pelanggan menjadi wawasan yang bisa ditindaklanjuti.',
        q4: 'IDIC berarti Identify, Differentiate, Interact, lalu Customize.',
        q5: 'Social CRM mendukung pemantauan, analisis sentimen, respons, dan integrasi interaksi media sosial.'
      }
    },
    dw: {
      answers: { q1: 'a', q2: 'b', q3: 'b', q4: 'a', q5: 'b' },
      explanations: {
        q1: 'Menurut W. H. Inmon, Data Warehouse adalah subject-oriented, integrated, time-variant, dan nonvolatile.',
        q2: 'OLTP memproses transaksi operasional harian, sedangkan OLAP berfokus pada analisis informasi historis dan multidimensi.',
        q3: 'Kueri analitis OLAP yang kompleks dan masif akan menurunkan performa transaksi operasional jika dijalankan langsung di OLTP.',
        q4: 'ODS berfungsi sebagai area perantara (short-term memory) untuk pembersihan data sebelum disimpan permanen ke Data Warehouse.',
        q5: 'Tiga kategori utama metadata adalah Business Metadata, Technical Metadata, dan Operational Metadata.'
      }
    }
  };

  const currentQuizKey = isDwLesson ? 'dw' : 'crm';
  const activeQuiz = quizConfigs[currentQuizKey];

  if (quizForm && quizResult && activeQuiz) {
    quizForm.addEventListener('submit', event => {
      event.preventDefault();
      let score = 0;
      let answered = 0;
      const reviews = [];
      const keys = Object.keys(activeQuiz.answers);

      keys.forEach((name, index) => {
        const selected = $(`input[name="${name}"]:checked`, quizForm);
        if (selected) answered++;
        const isCorrect = selected && selected.value === activeQuiz.answers[name];
        if (isCorrect) score++;
        reviews.push(
          `<li><b>Soal ${index + 1}:</b> ${isCorrect ? 'Benar.' : 'Belum tepat.'} ${activeQuiz.explanations[name]}</li>`
        );
      });

      const percent = Math.round((score / keys.length) * 100);
      let feedback = 'Coba baca lagi ringkasan di atas, lalu ulangi kuis.';
      if (percent >= 80) {
        feedback = 'Bagus sekali! Kamu sudah memahami konsep-konsep kunci materi ini.';
      } else if (percent >= 60) {
        feedback = 'Cukup baik! Periksa kembali bagian materi yang pembahasannya belum tepat.';
      }

      quizResult.innerHTML = `<strong>Skor kamu: ${score}/${keys.length} (${percent}%)</strong>
        <p>${answered < keys.length ? `Kamu baru menjawab ${answered} dari ${keys.length} soal. ` : ''}${feedback}</p>
        <ul class="answer-review">${reviews.join('')}</ul>`;
      quizResult.hidden = false;
      quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    $('#resetQuiz')?.addEventListener('click', () => {
      quizResult.hidden = true;
      quizResult.innerHTML = '';
    });
  }
})();

const escapeHTML = (str) => {
        return String(str).replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    };

    let questionsData = [];
    let currentQuestionIndex = 0;
    let userAnswers = {};

    const uploadOverlay = document.getElementById('upload-overlay');
    const jsonUpload = document.getElementById('json-upload');
    const examContainer = document.getElementById('exam-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const questionCounter = document.getElementById('question-counter');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-test-btn');
    const titleHeader = document.querySelector('h1');

    let timeRemaining = 45 * 60;
    const timerDisplay = document.getElementById('timer');
    const timerContainer = document.getElementById('timer-container');
    let timerInterval;

    const startTimer = () => {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const hours = Math.floor(timeRemaining / 3600);
            const minutes = Math.floor((timeRemaining % 3600) / 60);
            const seconds = timeRemaining % 60;
            
            if (hours > 0) {
                timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (timeRemaining < 300 && timeRemaining > 0) {
                timerContainer.classList.remove('bg-primary-fixed', 'text-primary');
                timerContainer.classList.add('bg-error-container', 'text-error', 'timer-pulse');
            } else {
                timerContainer.classList.remove('bg-error-container', 'text-error', 'timer-pulse');
                timerContainer.classList.add('bg-primary-fixed', 'text-primary');
            }

            if (timeRemaining > 0) {
                timeRemaining--;
            } else {
                clearInterval(timerInterval);
                alert('Time is up! Submitting automatically.');
                submitTest();
            }
        }, 1000);
    };

    // Timer Edit logic
    const editTimeBtn = document.getElementById('edit-time-btn');
    const timeEditModal = document.getElementById('time-edit-modal');
    const cancelTimeBtn = document.getElementById('cancel-time-btn');
    const saveTimeBtn = document.getElementById('save-time-btn');
    const editHours = document.getElementById('edit-hours');
    const editMins = document.getElementById('edit-mins');
    const editSecs = document.getElementById('edit-secs');

    editTimeBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        editHours.value = hours;
        editMins.value = minutes;
        editSecs.value = seconds;
        timeEditModal.classList.remove('hidden');
    });

    cancelTimeBtn.addEventListener('click', () => {
        timeEditModal.classList.add('hidden');
        if (uploadOverlay.classList.contains('hidden')) {
             startTimer(); // resume only if test has started
        }
    });

    saveTimeBtn.addEventListener('click', () => {
        const h = parseInt(editHours.value) || 0;
        const m = parseInt(editMins.value) || 0;
        const s = parseInt(editSecs.value) || 0;
        timeRemaining = (h * 3600) + (m * 60) + s;
        timeEditModal.classList.add('hidden');
        
        // update display immediately
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        if (hours > 0) {
            timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (uploadOverlay.classList.contains('hidden')) {
             startTimer();
        }
    });

    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadOverlay.classList.add('bg-primary/10');
    });
    
    document.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadOverlay.classList.remove('bg-primary/10');
    });
    
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadOverlay.classList.remove('bg-primary/10');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    jsonUpload.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.name.endsWith('.json')) {
            alert('Please upload a valid JSON file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.questions && Array.isArray(data.questions)) {
                    questionsData = data.questions;
                    if(data.exam) titleHeader.textContent = data.exam + (data.subject ? ` - ${data.subject}` : '');
                    startExam();
                } else {
                    alert('Invalid format. JSON must contain a "questions" array.');
                }
            } catch (err) {
                alert('Error parsing JSON.');
            }
        };
        reader.readAsText(file);
    }

    function startExam() {
        uploadOverlay.classList.add('hidden');
        examContainer.classList.remove('hidden');
        startTimer();
        loadQuestion(0);
    }

    function loadQuestion(index) {
        currentQuestionIndex = index;
        const q = questionsData[index];
        
        questionCounter.textContent = `Question ${index + 1} of ${questionsData.length}`;
        progressBar.style.width = `${((index + 1) / questionsData.length) * 100}%`;
        questionText.textContent = q.question;
        
        optionsContainer.innerHTML = '';
        const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
        
        q.options.forEach((opt, i) => {
            const isChecked = userAnswers[index] === opt;
            const label = document.createElement('label');
            label.className = 'relative block cursor-pointer group';
            const safeOpt = escapeHTML(opt);
            label.innerHTML = `
                <input class="peer absolute opacity-0 w-0 h-0" name="mock-test-option" type="radio" value="${safeOpt}" ${isChecked ? 'checked' : ''}/>
                <div class="option-content flex items-center p-md border border-outline-variant rounded-lg bg-surface transition-all duration-200 peer-checked:border-primary peer-checked:bg-[#eff6ff] peer-checked:shadow-sm hover:border-primary-fixed-dim">
                    <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary mr-md peer-checked:bg-primary peer-checked:text-on-primary">
                        ${labels[i]}
                    </div>
                    <span class="font-body-lg text-body-lg text-on-surface">${safeOpt}</span>
                </div>
            `;
            
            label.querySelector('input').addEventListener('change', (e) => {
                if (e.target.checked) {
                    userAnswers[index] = opt;
                }
            });
            
            optionsContainer.appendChild(label);
        });

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === questionsData.length - 1;
    }

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) loadQuestion(currentQuestionIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questionsData.length - 1) loadQuestion(currentQuestionIndex + 1);
    });

    submitBtn.addEventListener('click', () => {
        const confirmed = confirm('Are you sure you want to submit your test?');
        if (confirmed) submitTest();
    });

    function submitTest() {
        clearInterval(timerInterval);
        submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Submitting...';
        submitBtn.disabled = true;
        
        let correct = 0;
        let incorrect = 0;
        let skipped = 0;

        questionsData.forEach((q, i) => {
            const answer = userAnswers[i];
            if (!answer) skipped++;
            else if (answer === q.answer) correct++;
            else incorrect++;
        });

        const scoreData = {
            total: questionsData.length,
            correct,
            incorrect,
            skipped,
            percentage: Math.round((correct / questionsData.length) * 100)
        };
        
        const detailedResults = questionsData.map((q, i) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.answer,
            userAnswer: userAnswers[i] || null
        }));

        sessionStorage.setItem('mockTestScore', JSON.stringify(scoreData));
        sessionStorage.setItem('mockTestDetails', JSON.stringify(detailedResults));

        setTimeout(() => {
            window.location.href = "/score";
        }, 1000);
    }
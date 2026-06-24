const escapeHTML = (str) => {
        return String(str).replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    };

    document.addEventListener('DOMContentLoaded', () => {
        const scoreDataStr = sessionStorage.getItem('mockTestScore');
        if (scoreDataStr) {
            const scoreData = JSON.parse(scoreDataStr);
            document.getElementById('score-percentage').textContent = scoreData.percentage + '%';
            document.getElementById('correct-count').textContent = scoreData.correct;
            document.getElementById('incorrect-count').textContent = scoreData.incorrect;
            document.getElementById('skipped-count').textContent = scoreData.skipped;
            
            // Update circular gauge
            const circle = document.querySelector('circle');
            if (circle) {
                const maxDashoffset = 552.92;
                const offset = maxDashoffset - (scoreData.percentage / 100) * maxDashoffset;
                circle.style.strokeDashoffset = offset;
            }
        }

        const reviewBtn = document.getElementById('review-btn');
        const reviewContainer = document.getElementById('review-container');
        
        reviewBtn.addEventListener('click', () => {
            const detailsStr = sessionStorage.getItem('mockTestDetails');
            if (!detailsStr) return;
            
            const details = JSON.parse(detailsStr);
            reviewContainer.innerHTML = '';
            
            details.forEach((item, index) => {
                const isCorrect = item.userAnswer === item.correctAnswer;
                const isSkipped = item.userAnswer === null;
                
                let statusClass = isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
                if (isSkipped) statusClass = 'border-gray-400 bg-gray-50';
                
                let statusIcon = isCorrect ? 'check_circle' : 'cancel';
                if (isSkipped) statusIcon = 'block';
                let iconColor = isCorrect ? 'text-green-600' : 'text-red-600';
                if (isSkipped) iconColor = 'text-gray-500';

                const card = document.createElement('div');
                card.className = `p-lg rounded-lg border-2 ${statusClass} flex flex-col gap-sm`;
                
                card.innerHTML = `
                    <div class="flex items-start gap-md">
                        <span class="material-symbols-outlined ${iconColor}">${statusIcon}</span>
                        <div class="flex-1">
                            <h3 class="font-headline-md text-headline-md text-on-surface mb-xs">Question ${index + 1}</h3>
                            <p class="font-body-md text-body-md text-on-surface mb-md">${escapeHTML(item.question)}</p>
                            <div class="flex flex-col gap-xs">
                                <div class="font-body-md text-sm ${isCorrect ? 'text-green-700 font-bold' : 'text-on-surface'}">
                                    <strong>Your Answer:</strong> ${escapeHTML(item.userAnswer || 'Skipped')}
                                </div>
                                ${!isCorrect ? `<div class="font-body-md text-sm text-green-700 font-bold"><strong>Correct Answer:</strong> ${escapeHTML(item.correctAnswer)}</div>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                reviewContainer.appendChild(card);
            });
            
            reviewContainer.classList.toggle('hidden');
        });
    });
document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Heart Rate Logic
    const bpmElement = document.getElementById('bpm-value');

    function updateHeartRate() {
        const currentBpm = parseInt(bpmElement.textContent);
        const change = Math.floor(Math.random() * 5) - 2;
        let newBpm = currentBpm + change;

        if (newBpm < 60) newBpm = 60;
        if (newBpm > 90) newBpm = 90;

        bpmElement.textContent = newBpm;

        const heartIcon = document.querySelector('.heart-icon');
        const beatDuration = 60 / newBpm;
        heartIcon.style.animationDuration = `${beatDuration}s`;
    }

    setInterval(updateHeartRate, 2000);

    // 2. Navigation Logic
    window.navigateTo = function (viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
        });

        // Show target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
    };

    // 3. Medication Checkbox Logic
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(box => {
        box.addEventListener('change', (e) => {
            const li = e.target.closest('li');

            // Visual feedback logic
            if (e.target.checked) {
                li.style.opacity = '0.5';
                if (li.querySelector('.med-name')) { // Dashboard list
                    li.style.textDecoration = 'line-through';
                }
            } else {
                li.style.opacity = '1';
                if (li.querySelector('.med-name')) {
                    li.style.textDecoration = 'none';
                }
            }
        });

        // Initialize state
        if (box.checked) {
            const li = box.closest('li');
            li.style.opacity = '0.5';
            if (li.querySelector('.med-name')) {
                li.style.textDecoration = 'line-through';
            }
        }
    });

    console.log("Smartwatch Prototype Loaded with Navigation");
});

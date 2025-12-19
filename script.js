document.addEventListener('DOMContentLoaded', () => {
    // --- STARTUP SEQUENCE ---
    const startupView = document.getElementById('view-startup');
    const bluetoothContainer = document.getElementById('bluetooth-container');
    const startupName = document.getElementById('startup-name');

    if (startupView && bluetoothContainer && startupName) {
        // Wait 3 seconds
        setTimeout(() => {
            // Hide Bluetooth Icon
            bluetoothContainer.style.display = 'none';

            // Show Patient Name
            startupName.classList.add('visible');
            startupName.style.cursor = 'pointer'; // Make it look clickable

            // Enable transition on name click ONLY
            startupName.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent bubbling if needed
                navigateTo('view-dashboard');
            });
        }, 3000);
    }

    // 1. Dynamic Heart Rate Logic
    const bpmElement = document.getElementById('bpm-value');

    function updateHeartRate() {
        const currentBpm = parseInt(bpmElement.textContent);
        const change = Math.floor(Math.random() * 5) - 2;
        let newBpm = currentBpm + change;

        // Adjusted for Tachycardia (Herzrasen) logic
        if (newBpm < 110) newBpm = 110;
        if (newBpm > 140) newBpm = 140;

        bpmElement.textContent = newBpm;

        const heartIcon = document.querySelector('.heart-icon');
        const beatDuration = 60 / newBpm;
        heartIcon.style.animationDuration = `${beatDuration}s`;
    }

    setInterval(updateHeartRate, 2000);

    // 2. Activity Logic (Chart & Toggle)
    const activityToggle = document.getElementById('activity-toggle');
    const activityLabel = document.getElementById('activity-label');
    const activityValue = document.getElementById('activity-value');
    const chartContainer = document.getElementById('hourly-chart');

    // Mock Data for the last 5 hours (Steadiness Score 0-100)
    const chartData = [
        { time: '13:00', steps: 75 },
        { time: '14:00', steps: 82 },
        { time: '15:00', steps: 60 },
        { time: '16:00', steps: 88 },
        { time: '17:00', steps: 95 }
    ];

    // Calculate max score (usually 100 for percentage/score)
    const maxSteps = 100;

    let selectedSteps = 0; // Steps of the currently selected bar
    let isShowingSteps = false; // Toggle state

    function renderChart() {
        if (!chartContainer) return;
        chartContainer.innerHTML = '';

        chartData.forEach((data, index) => {
            const group = document.createElement('div');
            group.className = 'bar-group';

            // Interaction: Click bar
            group.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent propagation if needed
                setActiveBar(index);
            });

            const bar = document.createElement('div');
            bar.className = 'bar';
            // Calculate height percentage (Score is already 0-100 approx)
            const height = Math.max((data.steps / maxSteps) * 100, 10);
            bar.style.height = `${height}%`;

            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = data.time;

            group.appendChild(bar);
            group.appendChild(label);
            chartContainer.appendChild(group);
        });
    }

    function setActiveBar(index) {
        // Update visual active state
        const groups = chartContainer.querySelectorAll('.bar-group');
        groups.forEach((g, i) => {
            if (i === index) {
                g.classList.add('active');
                selectedSteps = chartData[i].steps;
            } else {
                g.classList.remove('active');
            }
        });

        // Switch main display to steps immediately
        showSteps();
    }

    function showSteps() {
        isShowingSteps = true;
        activityValue.textContent = selectedSteps; // + "%" if desired, but number is fine
        activityLabel.textContent = "WALK STEADINESS";
        activityToggle.classList.add('show-steps');
    }

    function showTime() {
        isShowingSteps = false;
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        activityValue.textContent = `${hours}:${minutes}`;
        activityLabel.textContent = "UHRZEIT";
        activityToggle.classList.remove('show-steps');
    }

    function updateTimeLoop() {
        if (!isShowingSteps) {
            showTime();
        }
    }

    if (activityToggle) {
        // Initial Render
        renderChart();
        // Select the last bar by default (latest hour)
        setActiveBar(chartData.length - 1);

        // Start Time Loop (but we start in 'Steps' mode due to setActiveBar above)
        // If we want to start in Time mode:
        showTime(); // Force back to time initially

        setInterval(updateTimeLoop, 1000);

        // Toggle on Main Display Click
        activityToggle.addEventListener('click', () => {
            if (isShowingSteps) {
                showTime();
            } else {
                showSteps();
            }
        });
    }

    // 3. Navigation Logic
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

    // 3. Medication Checkbox Logic (REMOVED - Read Only View)
    // The status is now hardcoded in HTML for the prototype.

    // --- SCROLL SIMULATION LOGIC ---
    window.scrollUp = function () {
        const patientData = document.getElementById('view-patient-data');

        // If Patient Data is visible, "scroll up" to Dashboard
        if (patientData && !patientData.classList.contains('hidden')) {
            navigateTo('view-dashboard');
        }
    };

    window.scrollDown = function () {
        const dashboard = document.getElementById('view-dashboard');

        // If Dashboard is visible, "scroll down" to Patient Data
        if (dashboard && !dashboard.classList.contains('hidden')) {
            navigateTo('view-patient-data');
        }
    };


    // --- EXTERNAL TOGGLE LOGIC ---
    window.togglePatientData = function () {
        const patientData = document.getElementById('view-patient-data');

        // If Patient Data is hidden, show it
        if (patientData && patientData.classList.contains('hidden')) {
            navigateTo('view-patient-data');
        } else {
            // Otherwise go back to dashboard
            navigateTo('view-dashboard');
        }
    };

    console.log("Smartwatch Prototype Loaded with Navigation");
});

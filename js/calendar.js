// ============================================================
// DOH HIV Platform - Calendar System
// ============================================================

const Calendar = {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    selectedDate: null,

    // Render calendar
    render(containerId, appointments = []) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const prevLastDay = new Date(this.currentYear, this.currentMonth, 0);
        
        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDay();
        const nextDays = 7 - lastDayIndex - 1;

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        let html = `
            <div class="calendar-header">
                <div class="calendar-nav">
                    <button class="btn btn-sm btn-outline" onclick="Calendar.prevMonth()">←</button>
                    <span class="calendar-month">${months[this.currentMonth]} ${this.currentYear}</span>
                    <button class="btn btn-sm btn-outline" onclick="Calendar.nextMonth()">→</button>
                </div>
                <button class="btn btn-sm btn-primary" onclick="Calendar.goToToday()">Today</button>
            </div>
            <div class="calendar-grid">
        `;

        // Day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });

        // Previous month days
        for (let x = firstDayIndex; x > 0; x--) {
            const day = prevLastDay.getDate() - x + 1;
            html += `<div class="calendar-day other-month">${day}</div>`;
        }

        // Current month days
        const today = new Date();
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(this.currentYear, this.currentMonth, day);
            const dateString = this.formatDate(date);
            const isToday = date.toDateString() === today.toDateString();
            const hasAppointment = appointments.some(apt => apt.appointmentDate === dateString);
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${hasAppointment ? 'has-appointment' : ''}" 
                     data-date="${dateString}"
                     onclick="Calendar.selectDate('${dateString}')">
                    ${day}
                </div>
            `;
        }

        // Next month days
        for (let day = 1; day <= nextDays; day++) {
            html += `<div class="calendar-day other-month">${day}</div>`;
        }

        html += '</div>';
        container.innerHTML = html;
    },

    // Format date as YYYY-MM-DD
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // Previous month
    prevMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.render('calendarContainer', appointments);
    },

    // Next month
    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.render('calendarContainer', appointments);
    },

    // Go to today
    goToToday() {
        const today = new Date();
        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.render('calendarContainer', appointments);
    },

    // Select date
    selectDate(dateString) {
        this.selectedDate = dateString;
        
        // Highlight selected date
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
            if (day.getAttribute('data-date') === dateString) {
                day.classList.add('selected');
            }
        });

        // Show appointments for selected date
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const dayAppointments = appointments.filter(apt => apt.appointmentDate === dateString);
        
        if (typeof Appointments !== 'undefined') {
            Appointments.showDayAppointments(dateString, dayAppointments);
        }
    }
};



        // --- DATA STATE ---
        let calls = [
            { id: 101, name: "Amit Verma", phone: "+91 98765 43210", type: "Sales", status: "New", priority: "High", notes: "Interested in the premium package.", timestamp: Date.now() - 1000 * 60 * 5 }, // 5 mins ago
            { id: 102, name: "Sneha Gupta", phone: "+91 91234 56789", type: "Complaint", status: "In Progress", priority: "Medium", notes: "Issue with previous appointment.", timestamp: Date.now() - 1000 * 60 * 45 }, // 45 mins ago
            { id: 103, name: "Rajesh Kumar", phone: "+91 88888 77777", type: "Inquiry", status: "Resolved", priority: "Low", notes: "Asked about opening hours.", timestamp: Date.now() - 1000 * 60 * 60 * 2 }, // 2 hours ago
            { id: 104, name: "Priya Singh", phone: "+91 99887 76655", type: "Support", status: "New", priority: "High", notes: "Urgent: Payment failed.", timestamp: Date.now() - 1000 * 60 * 60 * 5 },
            { id: 105, name: "Vikram Malhotra", phone: "+91 77777 66666", type: "Sales", status: "Resolved", priority: "Medium", notes: "Booked consultation.", timestamp: Date.now() - 1000 * 60 * 60 * 24 }, // 1 day ago
            { id: 106, name: "Anjali Desai", phone: "+91 66666 55555", type: "Inquiry", status: "New", priority: "Low", notes: "Pricing query.", timestamp: Date.now() - 1000 * 60 * 60 * 26 },
            { id: 107, name: "Karan Johar", phone: "+91 55555 44444", type: "Complaint", status: "In Progress", priority: "High", notes: "Waiting for refund.", timestamp: Date.now() - 1000 * 60 * 60 * 48 },
        ];

        let chartInstance = null;

        // --- INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            renderCalls();
            updateStats();
            initChart();
            renderActivityFeed();
        });

        // --- VIEW MANAGEMENT ---
        function switchView(viewId) {
            // Update Navigation
            document.querySelectorAll('.nav-item').forEach(el => {
                el.classList.remove('bg-indigo-600', 'text-white');
                el.classList.add('text-slate-300');
            });

            if (viewId === 'dashboard') {
                document.getElementById('view-dashboard').classList.remove('hidden');
                document.getElementById('view-calls').classList.add('hidden');
                document.getElementById('nav-dashboard').classList.add('bg-indigo-600', 'text-white');
                document.getElementById('nav-dashboard').classList.remove('text-slate-300');
                document.getElementById('pageTitle').innerText = "Dashboard";
                renderActivityFeed(); // Refresh feed
            } else if (viewId === 'calls') {
                document.getElementById('view-dashboard').classList.add('hidden');
                document.getElementById('view-calls').classList.remove('hidden');
                document.getElementById('nav-calls').classList.add('bg-indigo-600', 'text-white');
                document.getElementById('nav-calls').classList.remove('text-slate-300');
                document.getElementById('pageTitle').innerText = "All Calls";
                renderCalls(); // Refresh table
            }
            
            // Close sidebar on mobile if open
            if(window.innerWidth < 1024) {
                 const sidebar = document.getElementById('sidebar');
                 const overlay = document.getElementById('sidebarOverlay');
                 if(!sidebar.classList.contains('-translate-x-full')) {
                     toggleSidebar();
                 }
            }
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }

        // --- STATISTICS & CHART ---
        function updateStats() {
            const total = calls.length;
            const pending = calls.filter(c => c.status !== 'Resolved').length;
            const resolved = calls.filter(c => c.status === 'Resolved').length;
            const high = calls.filter(c => c.priority === 'High' && c.status !== 'Resolved').length;

            // Animate Numbers
            animateValue("statTotal", parseInt(document.getElementById("statTotal").innerText), total, 500);
            animateValue("statPending", parseInt(document.getElementById("statPending").innerText), pending, 500);
            animateValue("statResolved", parseInt(document.getElementById("statResolved").innerText), resolved, 500);
            animateValue("statHighPriority", parseInt(document.getElementById("statHighPriority").innerText), high, 500);

            document.getElementById("statResolvedRate").innerText = total > 0 ? Math.round((resolved / total) * 100) + "% success rate" : "0% success rate";
            document.getElementById("navCallCount").innerText = total;
        }

        function animateValue(id, start, end, duration) {
            if (start === end) return;
            let range = end - start;
            let current = start;
            let increment = end > start ? 1 : -1;
            let stepTime = Math.abs(Math.floor(duration / range));
            let obj = document.getElementById(id);
            let timer = setInterval(function() {
                current += increment;
                obj.innerHTML = current;
                if (current == end) {
                    clearInterval(timer);
                }
            }, stepTime);
        }

        function initChart() {
            const ctx = document.getElementById('mainChart').getContext('2d');
            
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: getChartData('daily'),
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            padding: 12,
                            cornerRadius: 8,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#f3f4f6' },
                            ticks: { font: { family: 'Inter' } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { font: { family: 'Inter' } }
                        }
                    },
                    barThickness: 24,
                    borderRadius: 6
                }
            });
        }

        function getChartData(period) {
            // Mock Data Generation
            let labels = [];
            let data = [];
            let max = 0;

            if (period === 'daily') {
                labels = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
                data = [2, 5, 8, 12, 6, 9, 11, 7, 4];
            } else if (period === 'weekly') {
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = [45, 52, 38, 65, 48, 25, 15];
            } else if (period === 'monthly') {
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data = [150, 180, 160, 210];
            }

            return {
                labels: labels,
                datasets: [{
                    label: 'Call Volume',
                    data: data,
                    backgroundColor: '#4f46e5', // Indigo 600
                    hoverBackgroundColor: '#4338ca', // Indigo 700
                }]
            };
        }

        function updateChart(period) {
            // Update Buttons
            document.querySelectorAll('.chart-toggle').forEach(btn => {
                if (btn.dataset.period === period) {
                    btn.classList.add('bg-white', 'text-gray-800', 'shadow-sm');
                    btn.classList.remove('text-gray-500');
                } else {
                    btn.classList.remove('bg-white', 'text-gray-800', 'shadow-sm');
                    btn.classList.add('text-gray-500');
                }
            });

            // Update Chart Data
            const newData = getChartData(period);
            chartInstance.data = newData;
            chartInstance.update();
        }

        function renderActivityFeed() {
            const container = document.getElementById('activityFeed');
            container.innerHTML = '';
            
            // Sort by latest
            const recent = [...calls].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

            recent.forEach(call => {
                const div = document.createElement('div');
                div.className = 'flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0';
                
                let iconColor = 'bg-blue-100 text-blue-600';
                if (call.status === 'Resolved') iconColor = 'bg-green-100 text-green-600';
                if (call.status === 'In Progress') iconColor = 'bg-yellow-100 text-yellow-600';

                div.innerHTML = `
                    <div class="w-8 h-8 rounded-full ${iconColor} flex items-center justify-center flex-shrink-0 mt-1">
                        <i data-lucide="phone" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-900">
                            ${call.name} <span class="text-gray-400 font-normal">was marked as</span> <span class="font-medium text-gray-700">${call.status}</span>
                        </p>
                        <p class="text-xs text-gray-400 mt-0.5">${timeAgo(call.timestamp)}</p>
                    </div>
                `;
                container.appendChild(div);
            });
            lucide.createIcons();
        }


        // --- CALL LIST LOGIC ---
        function renderCalls() {
            const search = document.getElementById('searchInput').value.toLowerCase();
            const statusFilter = document.getElementById('filterStatus').value;
            const priorityFilter = document.getElementById('filterPriority').value;
            
            const filtered = calls.filter(call => {
                const matchesSearch = call.name.toLowerCase().includes(search) || call.phone.includes(search);
                const matchesStatus = statusFilter === 'All' || call.status === statusFilter;
                const matchesPriority = priorityFilter === 'All' || call.priority === priorityFilter;
                return matchesSearch && matchesStatus && matchesPriority;
            });

            // Sort by timestamp desc
            filtered.sort((a, b) => b.timestamp - a.timestamp);

            const tbody = document.getElementById('callsTableBody');
            tbody.innerHTML = '';

            if (filtered.length === 0) {
                document.getElementById('emptyState').classList.remove('hidden');
                document.getElementById('showingCount').innerText = 'Showing 0 results';
            } else {
                document.getElementById('emptyState').classList.add('hidden');
                document.getElementById('showingCount').innerText = `Showing ${filtered.length} results`;

                filtered.forEach(call => {
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0';
                    
                    // Status Badge Logic
                    let statusClass = '';
                    if (call.status === 'New') statusClass = 'bg-blue-100 text-blue-700';
                    else if (call.status === 'In Progress') statusClass = 'bg-yellow-100 text-yellow-700';
                    else if (call.status === 'Resolved') statusClass = 'bg-green-100 text-green-700';

                    // Priority Badge Logic
                    let priorityClass = '';
                    let priorityIcon = '';
                    if (call.priority === 'High') {
                        priorityClass = 'text-red-600 bg-red-50';
                        priorityIcon = 'alert-circle';
                    } else if (call.priority === 'Medium') {
                        priorityClass = 'text-orange-600 bg-orange-50';
                        priorityIcon = 'minus';
                    } else {
                        priorityClass = 'text-slate-500 bg-slate-100';
                        priorityIcon = 'arrow-down';
                    }

                    tr.innerHTML = `
                        <td class="px-6 py-4">
                            <div class="flex items-center">
                                <div class="h-9 w-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mr-3">
                                    ${getInitials(call.name)}
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900">${call.name}</div>
                                    <div class="text-xs text-gray-500">${call.phone}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span class="text-sm text-gray-600">${call.type}</span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}">
                                ${call.status}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                             <div class="flex items-center gap-1.5">
                                <i data-lucide="${priorityIcon}" class="w-3 h-3 ${priorityClass.split(' ')[0]}"></i>
                                <span class="text-sm text-gray-600">${call.priority}</span>
                             </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm text-gray-500 flex items-center gap-1">
                                <i data-lucide="clock" class="w-3 h-3"></i>
                                ${timeAgo(call.timestamp)}
                            </div>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex items-center justify-end gap-2">
                                <button onclick="editCall(${call.id})" class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit">
                                    <i data-lucide="pencil" class="w-4 h-4"></i>
                                </button>
                                <button onclick="deleteCall(${call.id})" class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                lucide.createIcons();
            }
        }

        // --- FILTER EVENT LISTENERS ---
        document.getElementById('searchInput').addEventListener('input', renderCalls);
        document.getElementById('filterStatus').addEventListener('change', renderCalls);
        document.getElementById('filterPriority').addEventListener('change', renderCalls);

        // --- MODAL & FORM LOGIC ---
        function openModal(isEdit = false) {
            const modal = document.getElementById('callModal');
            modal.classList.remove('hidden');
            
            if (!isEdit) {
                document.getElementById('callForm').reset();
                document.getElementById('callId').value = '';
                document.getElementById('modalTitle').innerText = 'Log New Call';
                // Reset radios to 'New'
                document.querySelector('input[name="status"][value="New"]').checked = true;
                // Set default date/time? No, generated on save.
            }
        }

        function closeModal() {
            document.getElementById('callModal').classList.add('hidden');
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            
            const id = document.getElementById('callId').value;
            const name = document.getElementById('callerName').value;
            const phone = document.getElementById('phoneNumber').value;
            const type = document.getElementById('callType').value;
            const priority = document.getElementById('priority').value;
            const status = document.querySelector('input[name="status"]:checked').value;
            const notes = document.getElementById('notes').value;

            if (id) {
                // Edit
                const index = calls.findIndex(c => c.id == id);
                if (index > -1) {
                    calls[index] = { ...calls[index], name, phone, type, priority, status, notes };
                    showToast("Call details updated successfully");
                }
            } else {
                // Add
                const newCall = {
                    id: Date.now(),
                    name,
                    phone,
                    type,
                    priority,
                    status,
                    notes,
                    timestamp: Date.now()
                };
                calls.unshift(newCall);
                showToast("New call logged successfully");
            }

            closeModal();
            renderCalls();
            updateStats();
            renderActivityFeed();
        }

        function editCall(id) {
            const call = calls.find(c => c.id == id);
            if (!call) return;

            document.getElementById('callId').value = call.id;
            document.getElementById('callerName').value = call.name;
            document.getElementById('phoneNumber').value = call.phone;
            document.getElementById('callType').value = call.type;
            document.getElementById('priority').value = call.priority;
            document.getElementById('notes').value = call.notes || '';
            
            // Radio select
            const radios = document.getElementsByName('status');
            for (let r of radios) {
                if (r.value === call.status) r.checked = true;
            }

            document.getElementById('modalTitle').innerText = 'Edit Call Details';
            openModal(true);
        }

        function deleteCall(id) {
            if (confirm('Are you sure you want to remove this call record?')) {
                calls = calls.filter(c => c.id !== id);
                renderCalls();
                updateStats();
                showToast("Call record deleted");
            }
        }

        // --- UTILS ---
        function getInitials(name) {
            return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        }

        function timeAgo(timestamp) {
            const seconds = Math.floor((Date.now() - timestamp) / 1000);
            let interval = seconds / 31536000;
            if (interval > 1) return Math.floor(interval) + "y ago";
            interval = seconds / 2592000;
            if (interval > 1) return Math.floor(interval) + "mo ago";
            interval = seconds / 86400;
            if (interval > 1) return Math.floor(interval) + "d ago";
            interval = seconds / 3600;
            if (interval > 1) return Math.floor(interval) + "h ago";
            interval = seconds / 60;
            if (interval > 1) return Math.floor(interval) + "m ago";
            return "Just now";
        }

        function showToast(message) {
            const toast = document.getElementById('toast');
            document.getElementById('toastMessage').innerText = message;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }

    
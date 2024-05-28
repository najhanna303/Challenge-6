
document.addEventListener('DOMContentLoaded', () => {
    const jobListings = document.getElementById('job-listings');
    const filterBox = document.getElementById('filter-box');
    let filters = [];
    let jobData = [];


    fetch('/static-job-listings-master/data.json')
        .then(response => response.json())
        .then(data => {
            jobData = data;
            renderJobListings(jobData);
            addFilterButtonEventListeners();
        })
        .catch(error => console.error('Error fetching the job data:', error));

    function addFilterButtonEventListeners() {
        document.querySelectorAll('.btn.main-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.textContent.trim();
                if (!filters.includes(filter)) {
                    filters.push(filter);
                    updateFilterBox();
                    filterJobListings();
                }
            });
        });
    }

    function updateFilterBox() {
        if (filters.length > 0) {
            filterBox.style.display = 'flex';
            filterBox.innerHTML = filters.map(filter => `
                <div class="filter-item">
                    <span class="ms-4 filter-span">${filter}</span>
                    <button type="button" class="btn filter-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                            <path fill="#FFF" fill-rule="evenodd" d="M11.314 0l2.121 2.121-4.596 4.596 4.596 4.597-2.121 2.121-4.597-4.596-4.596 4.596L0 11.314l4.596-4.597L0 2.121 2.121 0l4.596 4.596L11.314 0z"/>
                        </svg>
                    </button>
                </div>
            `).join(' ');

            filterBox.innerHTML += '<span class="filter-clear" id="filter-clear">Clear</span>';
            
            document.querySelectorAll('.filter-item .filter-btn').forEach((button, index) => {
                button.addEventListener('click', () => {
                    filters.splice(index, 1);
                    updateFilterBox();
                    filterJobListings();
                });
            });

            document.getElementById('filter-clear').addEventListener('click', () => {
                filters = [];
                updateFilterBox();
                renderJobListings(jobData);
            });
        } else {
            filterBox.style.display = 'none';
        }
    }

    function renderJobListings(data) {
        jobListings.innerHTML = '';
        data.forEach(job => {
            const languages = job.languages.map(lang => `<button type="button" class="btn main-btn ms-2">${lang}</button>`).join(' ');
            const tools = job.tools.map(tool => `<button type="button" class="btn main-btn ms-2">${tool}</button>`).join(' ');
            const newBadge = job.new ? '<button type="button" class="btn new-btn rounded-pill">NEW!</button>' : '';
            const featuredBadge = job.featured ? '<button type="button" class="btn featured-btn rounded-pill">FEATURED</button>' : '';

            const jobCard = `
                <div class="job-card">
                    <div class="row no-gutters">
                        <div class="col-md-2 d-flex align-items-center justify-content-center">
                            <img src="${job.logo}" alt="${job.company}" class="logo">
                        </div>
                        <div class="col-md-5">
                            <div class="company-name"><span class="company-name me-2">${job.company}</span> ${newBadge} ${featuredBadge}</div>
                            <h5 class="mt-1 job-position">${job.position}</h5>
                            <div class="text-muted">${job.postedAt} • ${job.contract} • ${job.location}</div>
                        </div>
                        <div class="col-md-5 d-flex align-items-center justify-content-center">
                            <div class="mt-2 p-3">
                                <button type="button" class="btn main-btn">${job.role}</button>
                                <button type="button" class="btn main-btn ms-2">${job.level}</button>
                                ${languages}
                                ${tools}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            jobListings.innerHTML += jobCard;
        });

        
        addFilterButtonEventListeners();
    }

    function filterJobListings() {
        if (filters.length === 0) {
            renderJobListings(jobData);
            return;
        }

        const filteredData = jobData.filter(job => {
            const allTags = [job.role, job.level, ...job.languages, ...job.tools];
            return filters.every(filter => allTags.includes(filter));
        });
        renderJobListings(filteredData);
    }
});
const API = "http://localhost:8080/api";


let employees = [];
let skills = [];
let projects = [];
let allocations = [];


// ===============================
// PAGE NAVIGATION
// ===============================

function showSection(sectionId, button) {

    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("active-section");
    });

    const section = document.getElementById(sectionId);

    if (section) {
        section.classList.add("active-section");
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    const titles = {
        dashboard: "Dashboard",
        employees: "Employees",
        skills: "Skills",
        projects: "Projects",
        recommendations: "Recommendations",
        allocations: "Allocations"
    };

    document.getElementById("page-title").textContent =
        titles[sectionId] || "SkillMatrix";

    if (sectionId === "employees") {
        loadEmployees();
    }

    if (sectionId === "skills") {
        loadSkills();
    }

    if (sectionId === "projects") {
        loadProjects();
    }

    if (sectionId === "recommendations") {
        loadProjectsIntoRecommendation();
    }

    if (sectionId === "allocations") {
        loadAllocations();
        loadEmployeesIntoAllocation();
        loadProjectsIntoAllocation();
    }
}


function showSectionByName(sectionId) {

    const button = document.querySelector(
        `.nav-item[onclick*="${sectionId}"]`
    );

    showSection(sectionId, button);
}


// ===============================
// API HELPER
// ===============================

async function apiRequest(url, options = {}) {

    try {

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        });

        if (!response.ok) {

            let errorMessage = "Request failed";

            try {
                const errorData = await response.json();
                errorMessage =
                    errorData.message ||
                    errorData.error ||
                    errorMessage;
            } catch (e) {
                errorMessage = await response.text();
            }

            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();

    } catch (error) {

        console.error(error);

        showToast(error.message, true);

        throw error;
    }
}


// ===============================
// DASHBOARD
// ===============================

async function loadDashboard() {

    try {

        await Promise.all([
            loadEmployees(),
            loadSkills(),
            loadProjects(),
            loadAllocations()
        ]);

    } catch (error) {

        console.error("Dashboard loading error:", error);

    }
}


// ===============================
// EMPLOYEES
// ===============================

async function loadEmployees() {

    try {

        employees = await apiRequest(`${API}/employees`);

        document.getElementById("employeeCount").textContent =
            employees.length;

        renderEmployees();

        renderRecentEmployees();

        populateEmployeeDropdown();

    } catch (error) {

        document.getElementById("employeeTable").innerHTML =
            `<div class="empty-state">Unable to load employees.</div>`;
    }
}


function renderEmployees() {

    const container = document.getElementById("employeeTable");

    if (!employees.length) {

        container.innerHTML =
            `<div class="empty-state">
                No employees found. Add your first employee.
             </div>`;

        return;
    }


    let html = `
        <table class="data-table">

            <thead>

                <tr>
                    <th>ID</th>
                    <th>EMPLOYEE</th>
                    <th>EMAIL</th>
                    <th>ROLE</th>
                    <th>CAPACITY</th>
                    <th>STATUS</th>
                </tr>

            </thead>

            <tbody>
    `;


    employees.forEach(employee => {

        html += `
            <tr>

                <td>#${employee.employeeId}</td>

                <td>
                    <strong>${escapeHtml(employee.name)}</strong>
                </td>

                <td>${escapeHtml(employee.email)}</td>

                <td>${escapeHtml(employee.role || "-")}</td>

                <td>
                    ${employee.availabilityCapacity ?? 100}%
                </td>

                <td>

                    <span class="badge ${
            employee.active ? "active" : "cancelled"
        }">

                        ${employee.active ? "ACTIVE" : "INACTIVE"}

                    </span>

                </td>

            </tr>
        `;

    });


    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}


function renderRecentEmployees() {

    const container =
        document.getElementById("recentEmployees");

    if (!employees.length) {

        container.innerHTML =
            `<div class="empty-state">
                No employees registered yet.
             </div>`;

        return;
    }


    const recent = employees.slice(-5).reverse();


    let html = `
        <table class="data-table">

            <thead>

                <tr>
                    <th>NAME</th>
                    <th>ROLE</th>
                    <th>CAPACITY</th>
                </tr>

            </thead>

            <tbody>
    `;


    recent.forEach(employee => {

        html += `
            <tr>

                <td>
                    <strong>${escapeHtml(employee.name)}</strong>
                </td>

                <td>${escapeHtml(employee.role || "-")}</td>

                <td>
                    ${employee.availabilityCapacity ?? 100}%
                </td>

            </tr>
        `;

    });


    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}


function filterEmployees() {

    const search =
        document.getElementById("employeeSearch")
            .value
            .toLowerCase();

    const filtered =
        employees.filter(employee =>

            employee.name.toLowerCase().includes(search) ||

            employee.email.toLowerCase().includes(search) ||

            (employee.role || "")
                .toLowerCase()
                .includes(search)

        );


    const original = employees;

    employees = filtered;

    renderEmployees();

    employees = original;
}


// ===============================
// CREATE EMPLOYEE
// ===============================

async function createEmployee(event) {

    event.preventDefault();

    const employee = {

        name:
        document.getElementById("employeeName").value,

        email:
        document.getElementById("employeeEmail").value,

        role:
        document.getElementById("employeeRole").value,

        availabilityCapacity:
            Number(
                document.getElementById(
                    "employeeAvailability"
                ).value
            ),

        active: true
    };


    try {

        await apiRequest(`${API}/employees`, {

            method: "POST",

            body: JSON.stringify(employee)

        });


        closeModal("employeeModal");

        event.target.reset();

        document.getElementById(
            "employeeAvailability"
        ).value = 100;

        showToast("Employee added successfully.");

        await loadEmployees();

    } catch (error) {

        console.error(error);

    }
}


// ===============================
// SKILLS
// ===============================

async function loadSkills() {

    try {

        skills = await apiRequest(`${API}/skills`);

        document.getElementById("skillCount").textContent =
            skills.length;

        renderSkills();

        renderSkillsOverview();

    } catch (error) {

        document.getElementById("skillsGrid").innerHTML =
            `<div class="empty-state">
                Unable to load skills.
             </div>`;
    }
}


function renderSkills() {

    const container =
        document.getElementById("skillsGrid");

    if (!skills.length) {

        container.innerHTML =
            `<div class="empty-state">
                No skills available.
             </div>`;

        return;
    }


    container.innerHTML = skills.map(skill => `

        <div class="skill-card">

            <div class="skill-card-icon">
                ${getSkillInitial(skill.skillName)}
            </div>

            <h3>
                ${escapeHtml(skill.skillName)}
            </h3>

            <p>
                ${escapeHtml(skill.category || "General")}
            </p>

        </div>

    `).join("");
}


function renderSkillsOverview() {

    const container =
        document.getElementById("skillsOverview");

    if (!skills.length) {

        container.innerHTML =
            `<div class="empty-state">
                No skills found.
             </div>`;

        return;
    }


    const visibleSkills =
        skills.slice(0, 6);


    container.innerHTML =
        visibleSkills.map(skill => `

            <div class="skill-row">

                <div>

                    <div class="skill-name">
                        ${escapeHtml(skill.skillName)}
                    </div>

                    <div class="skill-category">
                        ${escapeHtml(skill.category || "General")}
                    </div>

                </div>

                <span class="badge planned">
                    #${skill.skillId}
                </span>

            </div>

        `).join("");
}


function getSkillInitial(name) {

    if (!name) return "S";

    return name
        .trim()
        .charAt(0)
        .toUpperCase();
}


// ===============================
// CREATE SKILL
// ===============================

async function createSkill(event) {

    event.preventDefault();


    const skill = {

        skillName:
        document.getElementById("skillName").value,

        category:
        document.getElementById("skillCategory").value

    };


    try {

        await apiRequest(`${API}/skills`, {

            method: "POST",

            body: JSON.stringify(skill)

        });


        closeModal("skillModal");

        event.target.reset();

        showToast("Skill added successfully.");

        await loadSkills();

    } catch (error) {

        console.error(error);

    }
}


// ===============================
// PROJECTS
// ===============================

async function loadProjects() {

    try {

        projects =
            await apiRequest(`${API}/projects`);

        document.getElementById("projectCount").textContent =
            projects.length;

        renderProjects();

        populateProjectDropdowns();

    } catch (error) {

        document.getElementById("projectsGrid").innerHTML =
            `<div class="empty-state">
                Unable to load projects.
             </div>`;
    }
}


function renderProjects() {

    const container =
        document.getElementById("projectsGrid");


    if (!projects.length) {

        container.innerHTML =
            `<div class="empty-state">
                No projects found. Add your first project.
             </div>`;

        return;
    }


    container.innerHTML =
        projects.map(project => {

            const status =
                project.status || "PLANNED";


            let badgeClass = "planned";

            if (status === "ACTIVE") {
                badgeClass = "active";
            }

            if (status === "COMPLETED") {
                badgeClass = "completed";
            }


            return `

                <div class="project-card">

                    <span class="badge ${badgeClass}">
                        ${escapeHtml(status)}
                    </span>

                    <h3>
                        ${escapeHtml(project.projectName)}
                    </h3>

                    <p>
                        ${escapeHtml(
                project.description ||
                "No description available."
            )}
                    </p>

                    <div class="project-footer">

                        Required Capacity:
                        <strong>
                            ${project.requiredCapacity ?? 0}%
                        </strong>

                        &nbsp; • &nbsp;

                        Project ID:
                        #${project.projectId}

                    </div>

                </div>

            `;

        }).join("");
}


// ===============================
// CREATE PROJECT
// ===============================

async function createProject(event) {

    event.preventDefault();


    const project = {

        projectName:
        document.getElementById("projectName").value,

        description:
        document.getElementById("projectDescription").value,

        status:
        document.getElementById("projectStatus").value,

        requiredCapacity:
            Number(
                document.getElementById("projectCapacity").value
            )

    };


    try {

        await apiRequest(`${API}/projects`, {

            method: "POST",

            body: JSON.stringify(project)

        });


        closeModal("projectModal");

        event.target.reset();

        showToast("Project added successfully.");

        await loadProjects();

    } catch (error) {

        console.error(error);

    }
}


// ===============================
// RECOMMENDATIONS
// ===============================

async function loadProjectsIntoRecommendation() {

    try {

        if (!projects.length) {
            await loadProjects();
        }


        const select =
            document.getElementById(
                "recommendationProject"
            );


        select.innerHTML =
            `<option value="">Select a project</option>`;


        projects.forEach(project => {

            select.innerHTML += `

                <option value="${project.projectId}">
                    ${escapeHtml(project.projectName)}
                </option>

            `;

        });

    } catch (error) {

        console.error(error);

    }
}


async function loadRecommendations() {

    const projectId =
        document.getElementById(
            "recommendationProject"
        ).value;


    const container =
        document.getElementById(
            "recommendationResults"
        );


    if (!projectId) {

        container.innerHTML =
            `<div class="empty-state large">
                Select a project to see recommended employees.
             </div>`;

        return;
    }


    container.innerHTML =
        `<div class="empty-state large">
            Calculating employee matches...
         </div>`;


    try {

        const recommendations =
            await apiRequest(
                `${API}/projects/${projectId}/recommendations`
            );


        renderRecommendations(recommendations);

    } catch (error) {

        container.innerHTML =
            `<div class="empty-state large">
                Could not load recommendations.
             </div>`;
    }
}


function renderRecommendations(recommendations) {

    const container =
        document.getElementById(
            "recommendationResults"
        );


    if (!recommendations.length) {

        container.innerHTML =
            `<div class="empty-state large">
                No available employees found for this project.
             </div>`;

        return;
    }


    container.innerHTML = `

        <div class="recommendation-grid">

            ${recommendations.map(employee => `

                <div class="recommendation-card">

                    <div class="recommendation-top">

                        <div class="employee-avatar">

                            ${getInitials(
        employee.employeeName
    )}

                        </div>

                        <div class="match-score">

                            ${employee.matchPercentage}%
                            Match

                        </div>

                    </div>


                    <h3>
                        ${escapeHtml(
        employee.employeeName
    )}
                    </h3>


                    <p>
                        ${escapeHtml(
        employee.role || "Employee"
    )}
                    </p>


                    <p>
                        Available capacity:
                        <strong>
                            ${employee.availableCapacity}%
                        </strong>
                    </p>


                    <div class="match-bar">

                        <div
                            class="match-fill"
                            style="width:
                                ${Math.min(
        employee.matchPercentage,
        100
    )}%">
                        </div>

                    </div>

                </div>

            `).join("")}

        </div>

    `;
}


// ===============================
// ALLOCATIONS
// ===============================

async function loadAllocations() {

    try {

        allocations =
            await apiRequest(`${API}/allocations`);

        document.getElementById(
            "allocationCount"
        ).textContent = allocations.length;

        renderAllocations();

    } catch (error) {

        document.getElementById(
            "allocationTable"
        ).innerHTML =
            `<div class="empty-state">
                Unable to load allocations.
             </div>`;
    }
}


function renderAllocations() {

    const container =
        document.getElementById(
            "allocationTable"
        );


    if (!allocations.length) {

        container.innerHTML =
            `<div class="empty-state">
                No allocations created yet.
             </div>`;

        return;
    }


    let html = `

        <table class="data-table">

            <thead>

                <tr>

                    <th>ID</th>
                    <th>EMPLOYEE</th>
                    <th>PROJECT</th>
                    <th>ALLOCATION</th>
                    <th>STATUS</th>
                    <th>START DATE</th>

                </tr>

            </thead>

            <tbody>

    `;


    allocations.forEach(allocation => {

        const employeeName =
            allocation.employee?.name ||
            "Employee #" +
            (allocation.employee?.employeeId || "-");


        const projectName =
            allocation.project?.projectName ||
            "Project #" +
            (allocation.project?.projectId || "-");


        const status =
            allocation.allocationStatus ||
            "ACTIVE";


        html += `

            <tr>

                <td>
                    #${allocation.allocationId}
                </td>

                <td>
                    ${escapeHtml(employeeName)}
                </td>

                <td>
                    ${escapeHtml(projectName)}
                </td>

                <td>
                    <strong>
                        ${allocation.allocationPercentage}%
                    </strong>
                </td>

                <td>

                    <span class="badge ${
            status.toUpperCase() === "ACTIVE"
                ? "active"
                : "planned"
        }">

                        ${escapeHtml(status)}

                    </span>

                </td>

                <td>
                    ${allocation.startDate || "-"}
                </td>

            </tr>

        `;

    });


    html += `

            </tbody>

        </table>

    `;


    container.innerHTML = html;
}


// ===============================
// ALLOCATION CREATION
// ===============================

async function createAllocation(event) {

    event.preventDefault();


    const employeeId =
        Number(
            document.getElementById(
                "allocationEmployee"
            ).value
        );


    const projectId =
        Number(
            document.getElementById(
                "allocationProject"
            ).value
        );


    const allocation = {

        employee: {
            employeeId: employeeId
        },

        project: {
            projectId: projectId
        },

        allocationPercentage:
            Number(
                document.getElementById(
                    "allocationPercentage"
                ).value
            ),

        startDate:
            document.getElementById(
                "allocationStart"
            ).value || null,

        endDate:
            document.getElementById(
                "allocationEnd"
            ).value || null,

        allocationStatus: "ACTIVE"

    };


    try {

        await apiRequest(`${API}/allocations`, {

            method: "POST",

            body: JSON.stringify(allocation)

        });


        closeModal("allocationModal");

        event.target.reset();

        showToast(
            "Employee allocated successfully."
        );

        await loadAllocations();

    } catch (error) {

        console.error(error);

    }
}


// ===============================
// DROPDOWNS
// ===============================

function populateEmployeeDropdown() {

    const select =
        document.getElementById(
            "allocationEmployee"
        );


    if (!select) return;


    select.innerHTML =
        `<option value="">Select employee</option>`;


    employees.forEach(employee => {

        select.innerHTML += `

            <option value="${employee.employeeId}">

                ${escapeHtml(employee.name)}

                -
                ${escapeHtml(
            employee.role || "Employee"
        )}

            </option>

        `;

    });
}


function populateProjectDropdowns() {

    const select =
        document.getElementById(
            "allocationProject"
        );


    if (!select) return;


    select.innerHTML =
        `<option value="">Select project</option>`;


    projects.forEach(project => {

        select.innerHTML += `

            <option value="${project.projectId}">

                ${escapeHtml(project.projectName)}

            </option>

        `;

    });
}


async function loadEmployeesIntoAllocation() {

    if (!employees.length) {
        await loadEmployees();
    }

    populateEmployeeDropdown();
}


async function loadProjectsIntoAllocation() {

    if (!projects.length) {
        await loadProjects();
    }

    populateProjectDropdowns();
}


// ===============================
// MODALS
// ===============================

function openEmployeeModal() {

    document
        .getElementById("employeeModal")
        .classList.add("show");
}


function openSkillModal() {

    document
        .getElementById("skillModal")
        .classList.add("show");
}


function openProjectModal() {

    document
        .getElementById("projectModal")
        .classList.add("show");
}


async function openAllocationModal() {

    document
        .getElementById("allocationModal")
        .classList.add("show");

    await loadEmployeesIntoAllocation();

    await loadProjectsIntoAllocation();
}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");
}


// Close modal when clicking outside

document.querySelectorAll(".modal").forEach(modal => {

    modal.addEventListener("click", event => {

        if (event.target === modal) {

            modal.classList.remove("show");

        }

    });

});


// ===============================
// TOAST
// ===============================

function showToast(message, error = false) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;


    if (error) {

        toast.style.background = "#cf4d4d";

    } else {

        toast.style.background = "#171827";

    }


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


// ===============================
// HELPERS
// ===============================

function getInitials(name) {

    if (!name) return "E";


    return name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();
}


function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ===============================
// START APPLICATION
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDashboard();

    }
);
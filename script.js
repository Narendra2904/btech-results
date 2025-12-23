const SOCIAL_DATA = {
  instagram: {
    title: "INSTAGRAM",
    color: "bg-pink-500",
    icon: '<i class="fab fa-instagram text-white text-2xl"></i>',
    users: [
      { name: "Narendra Yenagandula", url: "https://instagram.com/narendra_yenagandula" },
      { name: "Madhan Myana", url: "https://btech-notes.vercel.app/insta.html" }
    ]
  },
  github: {
    title: "GITHUB",
    color: "bg-black",
    icon: '<i class="fab fa-github text-white text-2xl"></i>',
    users: [
      { name: "Narendra Yenagandula", url: "https://github.com/Narendra2904" },
      { name: "Madhan Myana", url: "https://github.com/madhanmyana" }
    ]
  },
  linkedin: {
    title: "LINKEDIN",
    color: "bg-blue-600",
    icon: '<i class="fab fa-linkedin-in text-white text-2xl"></i>',
    users: [
      { name: "Narendra Yenagandula", url: "https://www.linkedin.com/in/narendra-yenagandula/" },
      { name: "Madhan Myana", url: "https://www.linkedin.com/in/madhan-myana-7ab90a335/" }
    ]
  }
};

function openPopup(type) {
  const popup = document.getElementById("socialPopup");
  const title = document.getElementById("popupTitle");
  const iconBox = document.getElementById("popupIcon");
  const usersBox = document.getElementById("popupUsers");

  const data = SOCIAL_DATA[type];
  if (!data) return;

  title.innerText = data.title;
  iconBox.className = `w-14 h-14 flex items-center justify-center mb-4 ${data.color}`;
  iconBox.innerHTML = data.icon;

  usersBox.innerHTML = "";
  data.users.forEach(u => {
    const a = document.createElement("a");
    a.href = u.url;
    a.target = "_blank";
    a.className =
      "flex justify-between items-center border border-black px-4 py-3 font-bold hover:bg-black hover:text-white transition";
    a.innerHTML = `<span>${u.name}</span><span>→</span>`;
    usersBox.appendChild(a);
  });

  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("socialPopup").classList.add("hidden");
}

// click outside popup to close
document.getElementById("socialPopup")
  .addEventListener("click", e => {
    if (e.target.id === "socialPopup") closePopup();
  });

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
}

function calculateCGPA(semesters) {
    let totalCredits = 0;
    let totalPoints = 0;

    semesters.forEach(sem => {
        sem.subjects.forEach(sub => {
            const gp = GRADE_POINTS[sub.grade] ?? 0;
            const credits = parseFloat(sub.credits || 0);
            totalCredits += credits;
            totalPoints += gp * credits;
        });
    });

    return totalCredits === 0 ? "0.00" : (totalPoints / totalCredits).toFixed(2);
}



/* ---------- Spotlight ---------- */
document.addEventListener("mousemove", e => {
    const s = document.getElementById("spotlight");
    s.style.setProperty("--x", e.clientX + "px");
    s.style.setProperty("--y", e.clientY + "px");
});

/* ---------- Greeting ---------- */
window.onload = () => {
    const g = document.getElementById("timeGreeting");
    const h = new Date().getHours();
    g.innerText =
        h < 12 ? "— Good Morning  Bro—" :
        h < 17 ? "— Good Afternoon Bro—" :
                 "— Good Evening Bro—";
    g.classList.remove("opacity-0");
};

/* ---------- Helpers ---------- */
function countUp(id, end) {
    const el = document.getElementById(id);
    const start = performance.now();
    const dur = 1200;

    function tick(t) {
        const p = Math.min((t - start) / dur, 1);
        el.innerText = (p * end).toFixed(2);
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

function createBurst() {
    const box = document.getElementById("burst-container");
    const icons = ["🔥","✨","🎓","⚡","✅"];
    for (let i = 0; i < 15; i++) {
        const d = document.createElement("div");
        d.className = "particle";
        d.innerText = icons[Math.floor(Math.random()*icons.length)];
        d.style.left = "50%";
        d.style.top = "50%";
        d.style.setProperty("--tx",(Math.random()*400-200)+"px");
        d.style.setProperty("--ty",(Math.random()*400-200)+"px");
        box.appendChild(d);
        setTimeout(()=>d.remove(),1000);
    }
}

/* ---------- Render Result ---------- */
function displayResult(data) {
    document.getElementById("resName").innerText = data.name;
document.getElementById("resRoll").innerText = data.hallTicket;

    countUp("resCgpa", data.cgpa || 0);
    countUp("resSgpa", data.sgpa || 0);

    const tbody = document.getElementById("resultTableBody");
    tbody.innerHTML = "";

    data.subjects.forEach((s, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="px-6 py-4 text-[10px] text-zinc-500">${s.code}</td>
            <td class="px-6 py-4 font-bold">${s.name}</td>
            <td class="px-6 py-4 text-center">${s.internal}</td>
            <td class="px-6 py-4 text-center">${s.external}</td>
            <td class="px-6 py-4 text-center">${s.internal + s.external}</td>
            <td class="px-6 py-4 text-center">
                <span class="grade-badge">${s.grade}</span>
            </td>
            <td class="px-6 py-4 text-center">${s.credits}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("resultContainer").classList.remove("hidden");
}

/* ================= GLOBAL STATE ================= */

let FULL_RESULT = null;
let CURRENT_VIEW = "all";

const GRADE_POINTS = {
  "O": 10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
  "C": 5,
  "D": 4,
  "F": 0,
  "S": 0
};

/* ================= MARK SUPPLY ================= */
/* ================= MARK ATTEMPTS GLOBALLY ================= */
function markSupplySubjects(semesters) {
  if (!Array.isArray(semesters)) return;

  const subjectAttemptCount = new Map();

  // Iterate through all semesters to calculate attempt numbers
  semesters.forEach(sem => {
    if (!Array.isArray(sem.subjects)) return;

    sem.subjects.forEach(sub => {
      const key = `${sub.subjectCode || sub.code}`; 
      
      // Increment the counter for this specific subject code
      const currentCount = (subjectAttemptCount.get(key) || 0) + 1;
      subjectAttemptCount.set(key, currentCount);
      
      // Save the attempt number into the subject object
      sub.attemptNumber = currentCount;
      
      // Define if it is a regular or supply attempt
      sub.attempt = currentCount === 1 ? "regular" : "supply";
    });
  });
}



/* ================= SEARCH ================= */
/* ================= SEARCH ================= */
async function searchResult() {
    const htno = document.getElementById("hallTicketInput").value.trim().toUpperCase();
    const errorMsg = document.getElementById("errorMsg");
    const errorText = document.getElementById("errorText");
    const loading = document.getElementById("loadingState");
    const resultBox = document.getElementById("resultContainer");

    errorMsg.classList.add("hidden");
    resultBox.classList.add("hidden");

    if (!htno) {
        errorText.innerText = "Enter Hall Ticket Number";
        errorMsg.classList.remove("hidden");
        return;
    }

    loading.classList.remove("hidden");

    try {
        const API_BASE = "https://jntuh-backend-7rad.onrender.com";
        const res = await fetch(`${API_BASE}/result/${htno}`);
        const json = await res.json();

        if (!json || !json.data) throw new Error("No results");

        /* ================= NORMALIZE DATA ================= */
        let rawData = json.data;
        if (typeof rawData === 'string') {
            try {
                FULL_RESULT = JSON.parse(rawData.replace(/'/g, '"'));
            } catch (e) {
                console.error("JSON Parse Error:", e);
                throw new Error("Data format is invalid");
            }
        } else {
            FULL_RESULT = rawData;
        }

        /* ================= UPDATE UI HEADER ================= */
        document.getElementById("resName").innerText = FULL_RESULT.name || "—";
        document.getElementById("resRoll").innerText = FULL_RESULT.hallTicket || "—";
        document.getElementById("resFather").innerText = FULL_RESULT.fatherName || "—";
        document.getElementById("resBranch").innerText = FULL_RESULT.branch || "—";
        document.getElementById("resCollege").innerText = FULL_RESULT.college || "—";
        document.getElementById("resCollegeCode").innerText = FULL_RESULT.collegeCode || "—";

        markSupplySubjects(FULL_RESULT.semesters);

        /* ================= DROPDOWN ================= */
        /* ================= DROPDOWN SETUP ================= */
        const semSelect = document.getElementById("semesterSelect");
        semSelect.innerHTML = "";

        const allOpt = document.createElement("option");
        allOpt.value = "all";
        allOpt.textContent = "ALL SEMESTERS";
        semSelect.appendChild(allOpt);

        // Get unique names like ["1-1", "1-2", "2-1"]
        const uniqueSemNames = [...new Set(FULL_RESULT.semesters.map(s => s.semester))];

        /* Inside searchResult() Dropdown Setup */
uniqueSemNames.forEach((semName) => {
    const opt = document.createElement("option");
    opt.value = semName;
    // Label clearly so user knows this is the first attempt view
    opt.textContent = `SEMESTER ${semName}`;
    semSelect.appendChild(opt);
});

        semSelect.onchange = (e) => renderResult(e.target.value);

        renderResult("all");
        loading.classList.add("hidden");
        resultBox.classList.remove("hidden");
        createBurst();

    } catch (err) {
        console.error("searchResult error:", err);
        errorText.innerText = err.message;
        errorMsg.classList.remove("hidden");
        loading.classList.add("hidden");
    }
} // <--- This closes searchResult

/* ================= MOVE THESE OUTSIDE ================= */

function calculateSGPA(subjects) {
    let credits = 0;
    let points = 0;
    subjects.forEach(sub => {
        const gp = GRADE_POINTS[sub.grade] ?? 0;
        const cr = parseFloat(sub.credits || 0);
        credits += cr;
        points += gp * cr;
    });
    return credits === 0 ? "0.00" : (points / credits).toFixed(2);
}

function calculateCGPA(semesters) {
    let credits = 0;
    let points = 0;
    semesters.forEach(sem => {
        if (!Array.isArray(sem.subjects)) return;
        sem.subjects.forEach(sub => {
            const gp = GRADE_POINTS[sub.grade] ?? 0;
            const cr = parseFloat(sub.credits || 0);
            credits += cr;
            points += gp * cr;
        });
    });
    return credits === 0 ? "0.00" : (points / credits).toFixed(2);
}

/* ================= CONSOLIDATED RENDER LOGIC ================= */
/* ================= CONSOLIDATED RENDER LOGIC ================= */
/* ================= CONSOLIDATED RENDER LOGIC ================= */
function renderResult(mode) {
    if (!FULL_RESULT || !Array.isArray(FULL_RESULT.semesters)) return;
    const tbody = document.getElementById("resultTableBody");
    tbody.innerHTML = "";

    if (mode === "all") {
        FULL_RESULT.semesters.forEach(sem => renderSemester(sem));
        addOverallCGPA();
    } else {
        const semEntries = FULL_RESULT.semesters.filter(s => s.semester === mode);
        if (semEntries.length > 0) {
            const firstAttemptSem = { semester: mode, subjects: [] };
            const seen = new Set();
            semEntries.forEach(entry => {
                entry.subjects.forEach(sub => {
                    const code = sub.subjectCode || sub.code;
                    if (!seen.has(code)) {
                        seen.add(code);
                        firstAttemptSem.subjects.push(sub);
                    }
                });
            });
            renderSemester(firstAttemptSem);
        }
    }
}

function renderSemester(sem) {
    addSemesterHeader(sem.semester);
    const subjects = sem.subjects || [];
    const regularSubjects = subjects.filter(s => s.attempt === "regular");
    const supplySubjects = subjects.filter(s => s.attempt === "supply");

    if (regularSubjects.length > 0) {
        addSubHeader("REGULAR RESULTS", regularSubjects[0].examCode || "");
        regularSubjects.forEach(addRow);
    }
    
    if (supplySubjects.length > 0) {
        const lastSupply = supplySubjects[supplySubjects.length - 1];
        addSubHeader("SUPPLY RESULTS", lastSupply.examCode || "", lastSupply.attemptNumber || "");
        supplySubjects.forEach(addRow);
    }
    addSGPARow(calculateSGPA(subjects));
}

/* ================= TABLE HELPERS ================= */
function addSemesterHeader(semName) {
  const tbody = document.getElementById("resultTableBody");
  const tr = document.createElement("tr");
  tr.innerHTML = `<td colspan="7" class="bg-zinc-900 text-yellow-400 font-extrabold px-6 py-2 text-center border border-zinc-800">${semName} Results</td>`;
  tbody.appendChild(tr);
}

function addSubHeader(title, examCode = "", attemptNum = "") {
  const tbody = document.getElementById("resultTableBody");
  const tr = document.createElement("tr");
  
  // Format labels for attempt and code
  const attemptHtml = attemptNum ? `<span class="ml-2 bg-zinc-800 text-[8px] md:text-[9px] px-2 py-0.5 rounded border border-zinc-700 text-zinc-400 font-mono">ATTEMPT: ${attemptNum}</span>` : "";
  const codeHtml = examCode ? `<span class="ml-2 md:ml-3 text-[8px] md:text-[9px] text-zinc-500 font-mono">[CODE: ${examCode}]</span>` : "";
  
  let officialLink = "";
  if (examCode && FULL_RESULT && FULL_RESULT.hallTicket) {
      // Constructs the JNTUH official result URL
      const baseUrl = "http://results.jntuh.ac.in/results/resultAction";
      const params = `?degree=btech&examCode=${examCode}&etype=r17&result=null&grad=null&type=intgrade&htno=${FULL_RESULT.hallTicket}`;
      
      // The "no-print" class ensures this button is hidden in the PDF
      officialLink = `
        <a href="${baseUrl}${params}" target="_blank" 
           class="no-print ml-auto text-[8px] md:text-[9px] bg-yellow-accent/10 hover:bg-yellow-accent/20 text-yellow-accent border border-yellow-accent/30 px-2 py-1 rounded transition-all flex items-center gap-1">
           <i class="fas fa-external-link-alt text-[7px]"></i> DIRECT LINK
        </a>`;
  }
  
  tr.innerHTML = `
    <td colspan="7" class="bg-black text-orange-400 font-bold px-4 py-2 uppercase tracking-widest text-[9px] md:text-[11px]">
      <div class="flex items-center justify-between md:justify-start">
        <span class="truncate">${title}${attemptHtml}${codeHtml}</span>
        ${officialLink}
      </div>
    </td>`;
  tbody.appendChild(tr);
}

function addRow(sub) {
  const tbody = document.getElementById("resultTableBody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="px-2 md:px-6 py-3 border border-zinc-800 font-mono text-zinc-400 text-[9px] md:text-[12px]">${sub.subjectCode}</td>
    <td class="px-2 md:px-6 py-3 border border-zinc-800 font-medium text-[9px] md:text-[12px]">${sub.subjectName}</td>
    <td class="px-1 md:px-4 py-3 border border-zinc-800 text-center text-[9px] md:text-[12px]">${sub.internal}</td>
    <td class="px-1 md:px-4 py-3 border border-zinc-800 text-center text-[9px] md:text-[12px]">${sub.external}</td>
    <td class="px-1 md:px-4 py-3 border border-zinc-800 text-center text-[9px] md:text-[12px]">${sub.total}</td>
    <td class="px-1 md:px-4 py-3 border border-zinc-800 text-center font-bold text-[9px] md:text-[12px]">${sub.grade}</td>
    <td class="px-1 md:px-4 py-3 border border-zinc-800 text-center text-[9px] md:text-[12px]">${sub.credits}</td>`;
  tbody.appendChild(tr);
}

function addSGPARow(sgpa) {
  const tbody = document.getElementById("resultTableBody");
  const tr = document.createElement("tr");
  tr.innerHTML = `<td colspan="7" class="text-right bg-black font-bold text-green-400 px-6 py-3 border border-zinc-800">SGPA : ${sgpa}</td>`;
  tbody.appendChild(tr);
}

function addOverallCGPA() {
  const tbody = document.getElementById("resultTableBody");
  const tr = document.createElement("tr");
  tr.innerHTML = `<td colspan="7" class="text-right bg-zinc-950 font-extrabold text-yellow-400 px-6 py-4 border border-zinc-800">OVERALL CGPA : ${calculateCGPA(FULL_RESULT.semesters)}</td>`;
  tbody.appendChild(tr);
}

function handlePrint() {
    const originalTitle = document.title;
    const rollNo = document.getElementById("resRoll").innerText.trim();
    if (rollNo && rollNo !== "---") {
        document.title = rollNo;
    }
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 100);
}

/* ================= MOBILE SWIPE ================= */

let touchStartX = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  const select = document.getElementById("semesterSelect");
  if (!select || Math.abs(diff) < 50) return;

  if (diff < 0 && select.selectedIndex < select.options.length - 1)
    select.selectedIndex++;
  if (diff > 0 && select.selectedIndex > 0)
    select.selectedIndex--;

  CURRENT_VIEW = select.value;
  renderResult(CURRENT_VIEW);
});

/* ================= ENTER KEY ================= */

document.getElementById("hallTicketInput")
  ?.addEventListener("keydown", e => {
    if (e.key === "Enter") searchResult();
  });

  

  (function(){
  emailjs.init("5kLoGgKCRJnViVqjs"); // 👈 replace
})();


function sendFeedback() {
  const msgInput = document.getElementById("feedbackMessage");
  const btn = document.getElementById("feedbackBtn");
  const status = document.getElementById("feedbackStatus");

  const msg = msgInput.value.trim();
  if (!msg) return;

  // UI: sending
  btn.innerText = "SENDING...";
  btn.disabled = true;
  btn.classList.add("opacity-60", "cursor-not-allowed");

  emailjs.send("service_sh3psxo", "template_kugkk3i", {
    from_name: "Backbenchers User",
    from_email: "no-reply@backbenchers",
    message: msg
  })
  .then(() => {
    // SUCCESS UI
    status.classList.remove("hidden");
    msgInput.value = "";

    btn.innerText = "SENT ✓";

    // reset after 3 sec
    setTimeout(() => {
      btn.innerText = "SEND";
      btn.disabled = false;
      btn.classList.remove("opacity-60", "cursor-not-allowed");
      status.classList.add("hidden");
    }, 3000);
  })
  .catch(err => {
    console.error(err);
    btn.innerText = "FAILED";
    btn.disabled = false;
  });
}



function handlePrint() {
    // Save the original title
    const originalTitle = document.title;
    
    // Set the title to the Roll Number (e.g., 22S41A6695.pdf)
    const rollNo = document.getElementById("resRoll").innerText.trim();
    if (rollNo && rollNo !== "---") {
        document.title = rollNo;
    }
    
    // Open print dialog
    window.print();
    
    // Restore the original title after printing starts
    setTimeout(() => {
        document.title = originalTitle;
    }, 100);
}
function runAllocation() {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  // -------- INPUTS --------
  const numClassrooms = parseInt(document.getElementById("classrooms").value);
  const rows = parseInt(document.getElementById("rows").value);
  const cols = parseInt(document.getElementById("cols").value);
  const subjectLimit = parseInt(document.getElementById("subjectLimit").value);
  const numStudents = parseInt(document.getElementById("students").value);
  const numInvigilators = parseInt(document.getElementById("invigilators").value);

  const subjects = document.getElementById("subjects").value
    .split(",").map(s => s.trim()).filter(s => s !== "");

  const lateSubjects = document.getElementById("lateSubjects").value
    .split(",").map(s => s.trim()).filter(s => s !== "");

  const absentIds = document.getElementById("absent").value
    .split(",").map(s => parseInt(s.trim())).filter(s => !isNaN(s));

  // -------- VALIDATION --------
  if (
    !numClassrooms || !rows || !cols || !subjectLimit ||
    !numStudents || !numInvigilators ||
    subjects.length !== numStudents
  ) {
    outputDiv.innerHTML =
      "<p style='color:red'>Invalid input. Please check all fields.</p>";
    return;
  }

  // -------- SETUP --------
  const seatsPerClassroom = rows * cols;
  const timeSlots = ["Morning", "Afternoon"];
  const questionSets = ["A", "B", "C", "D"];

  // -------- STUDENT POOL --------
  let studentPool = subjects.map((subj, i) => ({
    id: i,
    subject: subj,
    set: questionSets[i % 4]
  }));

  lateSubjects.forEach((subj, i) => {
    studentPool.push({
      id: subjects.length + i,
      subject: subj,
      set: questionSets[(subjects.length + i) % 4]
    });
  });

  // -------- INVIGILATORS --------
  let invigilators = [];
  for (let i = 0; i < numInvigilators; i++) {
    if (!absentIds.includes(i)) {
      invigilators.push({ id: i, load: 0 });
    }
  }

  if (invigilators.length === 0) {
    outputDiv.innerHTML = "<p style='color:red'>No invigilators available.</p>";
    return;
  }

  // -------- SEAT ALLOCATION WITH CONFLICT RESOLUTION --------
  for (let slot of timeSlots) {
    if (studentPool.length === 0) break;

    outputDiv.innerHTML += `
      <div class="slot">
        <h3>Time Slot: ${slot}</h3>
    `;

    for (let c = 0; c < numClassrooms; c++) {
      let subjectCount = {};
      let lastStudent = null;

      let tableHTML = `
        <div class="classroom-card">
          <h4>Classroom ${c}</h4>
          <table>
            <tr>
              <th>Seat</th>
              <th>Student</th>
              <th>Subject</th>
              <th>Set</th>
              <th>Status</th>
            </tr>
      `;

      for (let seat = 0; seat < seatsPerClassroom; seat++) {
        let allocatedIndex = -1;

        // Try to find a non-conflicting student
        for (let i = 0; i < studentPool.length; i++) {
          const candidate = studentPool[i];

          const subjectUsed = subjectCount[candidate.subject] || 0;
          const conflict =
            (lastStudent &&
              (candidate.subject === lastStudent.subject ||
               candidate.set === lastStudent.set)) ||
            subjectUsed >= subjectLimit;

          if (!conflict) {
            allocatedIndex = i;
            break;
          }
        }

        if (allocatedIndex === -1) {
          tableHTML += `
            <tr class="conflict">
              <td>${seat}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>Conflict</td>
            </tr>
          `;
          continue;
        }

        const student = studentPool.splice(allocatedIndex, 1)[0];

        tableHTML += `
          <tr>
            <td>${seat}</td>
            <td>${student.id}</td>
            <td>${student.subject}</td>
            <td>${student.set}</td>
            <td class="ok">Allocated</td>
          </tr>
        `;

        subjectCount[student.subject] =
          (subjectCount[student.subject] || 0) + 1;
        lastStudent = student;
      }

      tableHTML += `
          </table>
        </div>
      `;

      outputDiv.innerHTML += tableHTML;
    }

    outputDiv.innerHTML += `</div>`;
  }

  if (studentPool.length > 0) {
    outputDiv.innerHTML += `
      <p style="color:red">
        Students remaining unallocated: ${studentPool.length}
      </p>
    `;
  }

  // -------- INVIGILATOR ASSIGNMENT --------
  outputDiv.innerHTML += `<h3>Invigilator Assignment</h3>`;

  for (let c = 0; c < numClassrooms; c++) {
    invigilators.sort((a, b) => a.load - b.load);
    invigilators[0].load++;

    outputDiv.innerHTML += `
      <p>
        Classroom ${c} → Invigilator ${invigilators[0].id}
        (Load: ${invigilators[0].load})
      </p>
    `;
  }
}

// -------- RESET --------
function resetDemo() {
  document.getElementById("output").innerHTML = "";
  document.querySelectorAll("input").forEach(input => input.value = "");
}

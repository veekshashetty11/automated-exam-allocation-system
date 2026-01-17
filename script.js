function runAllocation() {
  // -------- READ INPUTS --------
  const numClassrooms = parseInt(document.getElementById("classrooms").value);
  const rows = parseInt(document.getElementById("rows").value);
  const cols = parseInt(document.getElementById("cols").value);
  const subjectLimit = parseInt(document.getElementById("subjectLimit").value);
  const numStudents = parseInt(document.getElementById("students").value);
  const subjects = document.getElementById("subjects").value
    .split(",")
    .map(s => s.trim());

  const lateSubjectsInput = document.getElementById("lateSubjects").value;
  const lateSubjects = lateSubjectsInput
    ? lateSubjectsInput.split(",").map(s => s.trim())
    : [];

  const numInvigilators = parseInt(document.getElementById("invigilators").value);
  const absentInput = document.getElementById("absent").value;
  const absentIds = absentInput
    ? absentInput.split(",").map(id => parseInt(id.trim()))
    : [];

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  // -------- VALIDATION --------
  if (
    !numClassrooms || !rows || !cols || !subjectLimit ||
    !numStudents || subjects.length !== numStudents || !numInvigilators
  ) {
    outputDiv.innerHTML =
      "<p style='color:red'>Invalid input. Please check all fields.</p>";
    return;
  }

  // -------- SETUP --------
  const timeSlots = ["Morning", "Afternoon"];
  const questionSets = ["A", "B", "C", "D"];
  const seatsPerClassroom = rows * cols;
  const totalCapacity =
    numClassrooms * seatsPerClassroom * timeSlots.length;

  let studentIndex = 0;

  // -------- STUDENT LIST --------
  let students = subjects.map((subj, i) => ({
    id: i,
    subject: subj,
    set: questionSets[i % questionSets.length]
  }));

  // -------- LATE STUDENT QUEUE (FIFO) --------
  let lateQueue = lateSubjects.map((subj, i) => ({
    id: students.length + i,
    subject: subj,
    set: questionSets[(students.length + i) % questionSets.length]
  }));

  if (students.length + lateQueue.length > totalCapacity) {
    outputDiv.innerHTML += `
      <p style="color:red">
        Warning: Capacity insufficient for all students including late arrivals.
      </p>`;
  }

  // -------- INVIGILATOR SETUP --------
  let invigilators = [];
  for (let i = 0; i < numInvigilators; i++) {
    if (!absentIds.includes(i)) {
      invigilators.push({ id: i, load: 0 });
    }
  }

  if (invigilators.length === 0) {
    outputDiv.innerHTML +=
      "<p style='color:red'>No invigilators available.</p>";
    return;
  }

  // -------- SEAT ALLOCATION --------
  for (let slot of timeSlots) {
    if (studentIndex >= students.length && lateQueue.length === 0) break;

    outputDiv.innerHTML += `
      <div class="slot">
        <h3>Time Slot: ${slot}</h3>
    `;

    for (let c = 0; c < numClassrooms; c++) {
      let subjectCount = {};
      let lastStudent = null;

      outputDiv.innerHTML += `
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
        let currentStudent = null;

        if (studentIndex < students.length) {
          currentStudent = students[studentIndex];
        } else if (lateQueue.length > 0) {
          currentStudent = lateQueue[0];
        } else {
          break;
        }

        let conflict = false;

        // adjacency conflict
        if (
          lastStudent &&
          (currentStudent.subject === lastStudent.subject ||
           currentStudent.set === lastStudent.set)
        ) {
          conflict = true;
        }

        // subject limit per classroom
        subjectCount[currentStudent.subject] =
          subjectCount[currentStudent.subject] || 0;

        if (subjectCount[currentStudent.subject] >= subjectLimit) {
          conflict = true;
        }

        if (conflict) {
          outputDiv.innerHTML += `
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

        outputDiv.innerHTML += `
          <tr>
            <td>${seat}</td>
            <td>${currentStudent.id}</td>
            <td>${currentStudent.subject}</td>
            <td>${currentStudent.set}</td>
            <td class="ok">Allocated</td>
          </tr>
        `;

        subjectCount[currentStudent.subject]++;
        lastStudent = currentStudent;

        if (studentIndex < students.length) {
          studentIndex++;
        } else {
          lateQueue.shift(); // dequeue late student
        }
      }

      outputDiv.innerHTML += `
          </table>
        </div>
      `;
    }

    outputDiv.innerHTML += `</div>`;
  }

  if (lateQueue.length > 0) {
    outputDiv.innerHTML += `
      <p style="color:red">
        Late students remaining in queue: ${lateQueue.length}
      </p>
    `;
  }

  // -------- INVIGILATOR ASSIGNMENT --------
  outputDiv.innerHTML += `<h3>Invigilator Assignment</h3>`;

  for (let c = 0; c < numClassrooms; c++) {
    invigilators.sort((a, b) => a.load - b.load);
    let chosen = invigilators[0];
    chosen.load++;

    outputDiv.innerHTML += `
      <p>
        Classroom ${c} → Invigilator ${chosen.id}
        (Load: ${chosen.load})
      </p>
    `;
  }
}

// -------- RESET FUNCTION --------
function resetDemo() {
  document.getElementById("output").innerHTML = "";
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => input.value = "");
}

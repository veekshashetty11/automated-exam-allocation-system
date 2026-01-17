function runAllocation() {
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

  // ---------- VALIDATION ----------
  if (!numClassrooms || !rows || !cols || !subjectLimit ||
      !numStudents || subjects.length !== numStudents || !numInvigilators) {
    outputDiv.innerHTML = "<p style='color:red'>Invalid input. Please check all fields.</p>";
    return;
  }

  // ---------- SETUP ----------
  const timeSlots = ["Morning", "Afternoon"];
  const questionSets = ["A", "B", "C", "D"];
  const seatsPerClassroom = rows * cols;
  const totalCapacity = numClassrooms * seatsPerClassroom * timeSlots.length;

  let studentIndex = 0;

  // Normal students
  let students = subjects.map((subj, i) => ({
    id: i,
    subject: subj,
    set: questionSets[i % questionSets.length]
  }));

  // Late student queue (FIFO)
  let lateQueue = lateSubjects.map((subj, i) => ({
    id: students.length + i,
    subject: subj,
    set: questionSets[(students.length + i) % questionSets.length]
  }));

  if (students.length + lateQueue.length > totalCapacity) {
    outputDiv.innerHTML += `<p style="color:red">
      Warning: Not all students (including late arrivals) can be seated.
    </p>`;
  }

  // ---------- INVIGILATOR SETUP ----------
  let invigilators = [];
  for (let i = 0; i < numInvigilators; i++) {
    if (!absentIds.includes(i)) {
      invigilators.push({ id: i, load: 0 });
    }
  }

  if (invigilators.length === 0) {
    outputDiv.innerHTML += "<p style='color:red'>No invigilators available.</p>";
    return;
  }

  // ---------- SEAT ALLOCATION ----------
  for (let slot of timeSlots) {
    if (studentIndex >= students.length && lateQueue.length === 0) break;

    outputDiv.innerHTML += `<h3>Time Slot: ${slot}</h3>`;

    for (let c = 0; c < numClassrooms; c++) {
      let subjectCount = {};
      let lastStudent = null;

      outputDiv.innerHTML += `<strong>Classroom ${c}</strong><ul>`;

      for (let seat = 0; seat < seatsPerClassroom; seat++) {

        let currentStudent = null;

        if (studentIndex < students.length) {
          currentStudent = students[studentIndex];
        } else if (lateQueue.length > 0) {
          currentStudent = lateQueue[0]; // FIFO
        } else {
          break;
        }

        let conflict = false;

        // adjacency conflict
        if (lastStudent &&
            (currentStudent.subject === lastStudent.subject ||
             currentStudent.set === lastStudent.set)) {
          conflict = true;
        }

        // subject-per-classroom limit
        subjectCount[currentStudent.subject] = subjectCount[currentStudent.subject] || 0;
        if (subjectCount[currentStudent.subject] >= subjectLimit) {
          conflict = true;
        }

        if (conflict) {
          outputDiv.innerHTML += `<li style="color:orange">
            Seat ${seat}: Conflict detected
          </li>`;
          continue;
        }

        outputDiv.innerHTML += `<li>
          Seat ${seat}: Student ${currentStudent.id}
          | Subject ${currentStudent.subject}
          | Set ${currentStudent.set}
        </li>`;

        subjectCount[currentStudent.subject]++;
        lastStudent = currentStudent;

        if (studentIndex < students.length) {
          studentIndex++;
        } else {
          lateQueue.shift(); // dequeue
        }
      }

      outputDiv.innerHTML += "</ul>";
    }
  }

  if (lateQueue.length > 0) {
    outputDiv.innerHTML += `<p style="color:red">
      Late students remaining in queue: ${lateQueue.length}
    </p>`;
  }

  // ---------- INVIGILATOR ASSIGNMENT ----------
  outputDiv.innerHTML += "<h3>Invigilator Assignment</h3>";

  for (let c = 0; c < numClassrooms; c++) {
    invigilators.sort((a, b) => a.load - b.load);
    let chosen = invigilators[0];
    chosen.load++;

    outputDiv.innerHTML += `<p>
      Classroom ${c} → Invigilator ${chosen.id} (Load: ${chosen.load})
    </p>`;
  }
} 
function resetDemo() {
  document.getElementById("output").innerHTML = "";

  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => input.value = "");
}
  const totalCapacity = numClassrooms * seatsPerClass;

  if (numStudents > totalCapacity) {
    outputDiv.innerHTML += `<p style="color:red">
      Warning: Only ${totalCapacity} students can be seated.
    </p>`;
  }

  let studentIndex = 0;
  let lastSubject = null;

  for (let c = 0; c < numClassrooms; c++) {
    let classHTML = `<div style="margin-bottom:15px">
                       <h3>Classroom ${c}</h3>
                       <ul>`;

    for (let s = 0; s < seatsPerClass && studentIndex < numStudents; s++) {
      const currentSubject = subjects[studentIndex];

      if (currentSubject === lastSubject) {
        classHTML += `<li style="color:orange">
          Seat ${s}: Conflict detected (same subject nearby)
        </li>`;
      } else {
        classHTML += `<li>
          Seat ${s}: Student ${studentIndex} (Subject ${currentSubject})
        </li>`;
        lastSubject = currentSubject;
        studentIndex++;
      }
    }

    classHTML += "</ul></div>";
    outputDiv.innerHTML += classHTML;
  }
}

function runAllocation() {
  const numClassrooms = parseInt(document.getElementById("classrooms").value);
  const seatsPerClass = parseInt(document.getElementById("seats").value);
  const numStudents = parseInt(document.getElementById("students").value);
  const subjects = document.getElementById("subjects").value
                    .split(",")
                    .map(s => s.trim());

  const numInvigilators = parseInt(document.getElementById("invigilators").value);
  const absentInput = document.getElementById("absent").value;
  const absentIds = absentInput
                      ? absentInput.split(",").map(id => parseInt(id.trim()))
                      : [];

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  // ---------- INPUT VALIDATION ----------
  if (!numClassrooms || !seatsPerClass || !numStudents ||
      subjects.length !== numStudents || !numInvigilators) {
    outputDiv.innerHTML = "<p style='color:red'>Invalid input. Please check values.</p>";
    return;
  }

  // ---------- SEAT ALLOCATION ----------
  const totalCapacity = numClassrooms * seatsPerClass;
  let studentIndex = 0;
  let lastSubject = null;

  outputDiv.innerHTML += "<h3>Seat Allocation</h3>";

  for (let c = 0; c < numClassrooms; c++) {
    outputDiv.innerHTML += `<strong>Classroom ${c}</strong><ul>`;

    for (let s = 0; s < seatsPerClass && studentIndex < numStudents; s++) {
      const currentSubject = subjects[studentIndex];

      if (currentSubject === lastSubject) {
        outputDiv.innerHTML += `<li style="color:orange">
          Seat ${s}: Conflict detected (same subject nearby)
        </li>`;
      } else {
        outputDiv.innerHTML += `<li>
          Seat ${s}: Student ${studentIndex} (Subject ${currentSubject})
        </li>`;
        lastSubject = currentSubject;
        studentIndex++;
      }
    }

    outputDiv.innerHTML += "</ul>";
  }

  if (studentIndex < numStudents) {
    outputDiv.innerHTML += `<p style="color:red">
      Warning: Not all students could be seated.
    </p>`;
  }

  // ---------- INVIGILATOR HANDLING ----------
  outputDiv.innerHTML += "<h3>Invigilator Assignment</h3>";

  let availableInvigilators = [];

  for (let i = 0; i < numInvigilators; i++) {
    if (!absentIds.includes(i)) {
      availableInvigilators.push(i);
    }
  }

  if (availableInvigilators.length === 0) {
    outputDiv.innerHTML += `<p style="color:red">
      No invigilators available due to absences.
    </p>`;
    return;
  }

  // Round-robin assignment
  for (let c = 0; c < numClassrooms; c++) {
    const inv = availableInvigilators[c % availableInvigilators.length];
    outputDiv.innerHTML += `<p>
      Classroom ${c} → Invigilator ${inv}
    </p>`;
  }
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

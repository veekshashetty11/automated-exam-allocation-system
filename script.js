function runAllocation() {
  const numClassrooms = parseInt(document.getElementById("classrooms").value);
  const seatsPerClass = parseInt(document.getElementById("seats").value);
  const numStudents = parseInt(document.getElementById("students").value);
  const subjects = document.getElementById("subjects").value
                    .split(",")
                    .map(s => s.trim());

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  if (!numClassrooms || !seatsPerClass || !numStudents || subjects.length !== numStudents) {
    outputDiv.innerHTML = "<p style='color:red'>Invalid input. Please check values.</p>";
    return;
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

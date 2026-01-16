console.log("Exam Allocation System Website Loaded");
function runAllocation() {
  const classrooms = parseInt(document.getElementById("classrooms").value);
  const seats = parseInt(document.getElementById("seats").value);
  const students = parseInt(document.getElementById("students").value);
  const subjects = document.getElementById("subjects").value
                    .split(",")
                    .map(Number);

  let output = "";

  let capacity = classrooms * seats;

  if (students > capacity) {
    output += "Warning: Not enough seats for all students.\n\n";
  }

  let index = 0;

  for (let c = 0; c < classrooms; c++) {
    output += `Classroom ${c}:\n`;

    for (let s = 0; s < seats && index < students; s++) {
      output += `  Seat ${s} -> Student ${index} (Subject ${subjects[index]})\n`;
      index++;
    }

    output += "\n";
  }

  document.getElementById("output").textContent = output;
}



#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <algorithm>

using namespace std;

// ---------------- STRUCTURES ----------------
struct Student {
    int id;
    int subject;
    char questionSet;
};

struct Classroom {
    int id;
    int rows;
    int cols;
};

// ---------------- CONFLICT CHECK ----------------
bool isConflict(Student &a, Student &b) {
    return (a.subject == b.subject) || (a.questionSet == b.questionSet);
}

int main() {

    // -------- INPUT CLASSROOMS --------
    int numberOfClassrooms;
    cout << "Enter number of classrooms: ";
    cin >> numberOfClassrooms;

    vector<Classroom> classrooms;
    int totalCapacity = 0;

    for (int i = 0; i < numberOfClassrooms; i++) {
        Classroom c;
        c.id = i;
        cout << "Enter rows and columns for classroom " << i << ": ";
        cin >> c.rows >> c.cols;
        totalCapacity += c.rows * c.cols;
        classrooms.push_back(c);
    }

    int subjectLimit;
    cout << "Enter maximum students per subject per classroom: ";
    cin >> subjectLimit;

    // -------- TIME SLOTS --------
    vector<string> timeSlots = {"Morning", "Afternoon"};

    // -------- INPUT STUDENTS --------
    int n;
    cout << "Enter number of students: ";
    cin >> n;

    int maxCapacity = totalCapacity * timeSlots.size();

    if (n > maxCapacity) {
        cout << "Warning: Not all students can be seated.\n";
        cout << "Only " << maxCapacity << " students will be allocated seats.\n";
    }

    int effectiveStudents = min(n, maxCapacity);

    vector<Student> students;
    for (int i = 0; i < effectiveStudents; i++) {
        Student s;
        s.id = i;
        cout << "Enter subject code for student " << i << ": ";
        cin >> s.subject;
        s.questionSet = '-';
        students.push_back(s);
    }

    // -------- QUESTION SET ALLOCATION --------
    char sets[] = {'A', 'B', 'C', 'D'};
    for (int i = 0; i < students.size(); i++) {
        students[i].questionSet = sets[i % 4];
    }

    // -------- LATE STUDENT QUEUE --------
    queue<Student> lateStudents;
    char choice;
    cout << "\nIs there any late student? (y/n): ";
    cin >> choice;

    if (choice == 'y') {
        Student late;
        late.id = students.size();
        cout << "Enter subject code for late student: ";
        cin >> late.subject;
        late.questionSet = sets[late.id % 4];
        lateStudents.push(late);
        cout << "Late student added to queue.\n";
    }

    // -------- SEAT ALLOCATION --------
    int seatIndex = 0;
    Student* lastSeated = nullptr;

    for (string slot : timeSlots) {
        cout << "\n===== Time Slot: " << slot << " =====\n";

        for (auto &c : classrooms) {
            unordered_map<int, int> subjectCount;

            cout << "\nClassroom " << c.id
                 << " (" << c.rows << "x" << c.cols << ")\n";

            for (int i = 0; i < c.rows && seatIndex < students.size(); i++) {
                for (int j = 0; j < c.cols && seatIndex < students.size(); j++) {

                    bool conflict = false;

                    if (lastSeated != nullptr &&
                        isConflict(students[seatIndex], *lastSeated)) {
                        conflict = true;
                    }

                    if (subjectCount[students[seatIndex].subject] >= subjectLimit) {
                        conflict = true;
                    }

                    if (conflict) continue;

                    cout << "Seat (" << i << "," << j << ") -> Student "
                         << students[seatIndex].id
                         << " | Subject " << students[seatIndex].subject
                         << " | Set " << students[seatIndex].questionSet << endl;

                    subjectCount[students[seatIndex].subject]++;
                    lastSeated = &students[seatIndex];
                    seatIndex++;
                }
            }
        }

        if (seatIndex >= students.size()) break;
    }

    // -------- LATE STUDENT ALLOCATION --------
    cout << "\nLate Student Allocation:\n";
    while (!lateStudents.empty() && seatIndex < maxCapacity) {
        Student s = lateStudents.front();
        lateStudents.pop();

        cout << "Late Student " << s.id
             << " | Subject " << s.subject
             << " allocated a seat.\n";

        seatIndex++;
    }

    if (!lateStudents.empty()) {
        cout << "Some late students could not be seated due to capacity limits.\n";
    }

    // -------- INVIGILATOR HANDLING --------
    int numberOfInvigilators;
    cout << "\nEnter number of invigilators: ";
    cin >> numberOfInvigilators;

    vector<bool> isAbsent(numberOfInvigilators, false);
    int absentCount;

    cout << "Enter number of absent invigilators: ";
    cin >> absentCount;

    for (int i = 0; i < absentCount; i++) {
        int id;
        cout << "Enter absent invigilator ID: ";
        cin >> id;
        if (id >= 0 && id < numberOfInvigilators)
            isAbsent[id] = true;
    }

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;

    for (int i = 0; i < numberOfInvigilators; i++) {
        if (!isAbsent[i]) {
            pq.push({0, i});
        }
    }

    if (pq.empty()) {
        cout << "Error: No invigilators available.\n";
        return 0;
    }

    cout << "\nInvigilator Assignment:\n";
    for (int hall = 0; hall < numberOfClassrooms; hall++) {
        auto inv = pq.top();
        pq.pop();

        cout << "Hall " << hall
             << " -> Invigilator " << inv.second
             << " (Load " << inv.first << ")\n";

        inv.first++;
        pq.push(inv);
    }

    return 0;
}

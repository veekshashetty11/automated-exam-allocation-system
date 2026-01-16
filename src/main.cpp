#include <iostream>
#include <vector>
using namespace std;

// Student structure
struct Student {
    int id;
    int subject;      // subject code
    char questionSet; // A, B, C, D
};

// Invigilator structure
struct Invigilator {
    int id;
    int load;
};

int main() {
    int n;
    cout << "Enter number of students: ";
    cin >> n;

    vector<Student> students;

    for (int i = 0; i < n; i++) {
        Student s;
        s.id = i;

        cout << "Enter subject code for student " << i << ": ";
        cin >> s.subject;

        s.questionSet = '-';
        students.push_back(s);
    }

    // Assign question sets using simple greedy approach
    char sets[] = {'A', 'B', 'C', 'D'};
    for (int i = 0; i < students.size(); i++) {
        students[i].questionSet = sets[i % 4];
    }

    cout << "\nStudent Details After Question Set Allocation:\n";
    for (auto s : students) {
        cout << "Student ID: " << s.id
             << ", Subject: " << s.subject
             << ", Question Set: " << s.questionSet << endl;
    }

    return 0;
}

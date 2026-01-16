#include <iostream>
#include <vector>
using namespace std;

// Student structure
struct Student {
    int id;
    int subject;     // subject code
    char questionSet; // A, B, C, D
};

// Invigilator structure
struct Invigilator {
    int id;
    int load; // number of halls assigned
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

        s.questionSet = '-'; // not assigned yet
        students.push_back(s);
    }

    cout << "\nStudent Details:\n";
    for (auto s : students) {
        cout << "Student ID: " << s.id
             << ", Subject: " << s.subject
             << ", Question Set: " << s.questionSet << endl;
    }

    return 0;
}

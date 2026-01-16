# Automated Exam Allocation System

## Overview
The **Automated Exam Allocation System** is a Data Structures and Algorithms (DSA) based project that automates the allocation of students to examination seats and assigns invigilators to examination halls while handling multiple real-world constraints.

The system is designed to be **conflict-aware**, **capacity-aware**, and **scalable**, focusing on algorithmic efficiency rather than user interface or databases.

---

## Problem Statement
Manual examination seat allocation becomes complex when multiple classrooms, subjects, question paper sets, and invigilators are involved. Ensuring fairness, avoiding conflicts, and handling dynamic changes such as late student arrivals or invigilator absence are difficult to manage manually.

This project addresses these challenges by using appropriate data structures and greedy scheduling techniques to automate the process.

---

## Why This Project Is Unique
The system handles **multi-dimensional scheduling** involving:
- Students
- Subjects
- Question paper sets
- Classrooms
- Time slots
- Invigilators

All constraints are handled simultaneously using efficient data structures, making the system robust and realistic.

---

## Key Features

### Student & Seat Allocation
- Supports multiple classrooms with configurable seating capacity
- Morning and Afternoon **time-slot scheduling**
- Conflict-aware seating:
  - Same subject students are not seated adjacently
  - Same question paper sets are not seated adjacently
- Question paper set distribution (A / B / C / D)
- **Subject-per-classroom limit** to prevent clustering
- Capacity validation across classrooms and time slots

### Dynamic Handling
- Late student handling using **Queue (FIFO)**
- Graceful handling of overflow students when capacity is exceeded

### Invigilator Management
- Fair invigilator assignment using **Priority Queue (Min-Heap)**
- Load balancing across examination halls
- Dynamic handling of invigilator absence

---

## Data Structures Used

| Purpose | Data Structure |
|------|----------------|
Student storage | Vector |
Late student handling | Queue |
Subject distribution tracking | Hash Map (`unordered_map`) |
Invigilator allocation | Priority Queue (Min Heap) |
Seat layout | 2D matrix (conceptual) |

---

## Algorithms & Techniques
- Greedy seat allocation strategy
- Constraint-based conflict checking
- Min-heap based load balancing
- FIFO scheduling for late arrivals

---

## Workflow
1. Input classroom details and seating capacity  
2. Input students and subject codes  
3. Assign question paper sets  
4. Allocate seats per classroom and time slot  
5. Handle late student entries  
6. Assign invigilators with load balancing and absence handling  

---

## Project Website
A static website has been created using **HTML and CSS** to provide a visual overview of the system, its features, and workflow.

**Live Website:**  
https://veekshashetty11.github.io/automated-exam-allocation-system/

---

## Project Structure

```text
automated-exam-allocation-system/
│
├── index.html        # Project website
├── style.css         # Website styling
├── script.js         # Optional JavaScript
│
├── src/
│   └── main.cpp      # Core C++ implementation
│
├── README.md

export interface AcademicGuideSection {
  title: string;
  id: string;
  content: string;
  codeSnippet?: string;
  filename?: string;
}

export const GUI_FRAMEWORK_RECOMMENDATION = {
  recommended: 'PySide6 (Qt for Python)',
  alternative: 'Streamlit',
  decision: 'PySide6 is strongly recommended for this academic bioinformatics software project.',
  comparisonPoints: [
    {
      criteria: 'Application Architecture & Modularity',
      pyside6: 'Full MVC / OOP architecture. Standalone modular QWidget/QFrame classes plug seamlessly into a central QStackedWidget or QTabWidget.',
      streamlit: 'Linear script re-execution model. Streamlit runs top-to-bottom on every widget click; coordinating multiple modules across distinct analysis views often leads to session_state variable collisions.',
    },
    {
      criteria: 'Offline Desktop & Academic Presentation',
      pyside6: 'Runs 100% offline as a native desktop executable (.exe / .app) via PyInstaller. Perfect for grading, offline lab machines, and BS defense viva without needing web servers or browser ports.',
      streamlit: 'Requires a running local Python web server and browser tab. Susceptible to port conflicts or browser reload caching during live demos.',
    },
    {
      criteria: 'Threading & Compute-Heavy Algorithms',
      pyside6: 'Native QThread and QRunnable support. Long alignments (Needleman-Wunsch) and Random Forest ML model training run in background threads with live progress bars without freezing the UI.',
      streamlit: 'Computation blocks the browser socket unless complex multiprocessing/caching is implemented.',
    },
    {
      criteria: 'Excel & Native File System Integration',
      pyside6: 'Native QFileDialog, openpyxl, and ReportLab integrations without browser download prompts or sandbox limits.',
      streamlit: 'Relies on st.download_button which serializes data to browser memory.',
    },
  ],
};

export const REQUIREMENTS_TXT_CONTENT = `# Bioinformatics Analysis Suite (BAS)
# Requirements Specification for Python 3.10+
# Integrated Platform for Biological Sequence Analysis

# GUI Framework
PySide6>=6.6.0

# Biological Data Processing & Parsing
biopython>=1.83

# Data Handling & Excel Records
pandas>=2.2.0
openpyxl>=3.1.2
numpy>=1.26.0

# Machine Learning & Sequence Classification
scikit-learn>=1.4.0
joblib>=1.3.2

# Scientific Plotting & Visualizations
matplotlib>=3.8.0
seaborn>=0.13.0

# PDF Report Generation
reportlab>=4.1.0

# Web APIs & NCBI E-utilities
requests>=2.31.0
urllib3>=2.2.0
`;

export const STARTER_MAIN_PY_CODE = `"""
Bioinformatics Analysis Suite (BAS)
Integrated Platform for Biological Sequence Analysis
Main Application Orchestrator
"""

import sys
import os
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, 
    QHBoxLayout, QStackedWidget, QMessageBox
)
from PySide6.QtCore import Qt

# Import modular components developed for the suite
from modules.authentication import AuthManager, LoginWindow, SignupDialog
from modules.dashboard import MainDashboard
from modules.state_manager import SharedBioState

class BioinformaticsApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Bioinformatics Analysis Suite (BAS)")
        self.resize(1280, 800)

        # 1. Initialize Shared State (The bridge connecting all analysis modules)
        self.state = SharedBioState()

        # 2. Central stacked widget
        self.stack = QStackedWidget()
        self.setCentralWidget(self.stack)

        # 3. Create views
        self.login_view = LoginWindow(self.state, on_login_success=self.handle_login_success)
        self.dashboard_view = MainDashboard(self.state, on_logout=self.handle_logout)

        self.stack.addWidget(self.login_view)      # Index 0: Welcome / Login
        self.stack.addWidget(self.dashboard_view)  # Index 1: Main Dashboard

        self.stack.setCurrentIndex(0)

    def handle_login_success(self, user_info):
        self.state.set_current_user(user_info)
        self.dashboard_view.refresh_user_display()
        self.stack.setCurrentIndex(1)
        QMessageBox.information(self, "Welcome", f"Login successful. Welcome, {user_info['username']}!")

    def handle_logout(self):
        self.state.clear_session()
        self.stack.setCurrentIndex(0)

def main():
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    window = BioinformaticsApp()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
`;

export const STARTER_AUTH_PY_CODE = `"""
Module 1: Authentication & User Management
Author: Student 1 (Member A)
File: modules/authentication.py
Handles Login, Signup, Unique User ID (BIO001...), and Excel records (data/users.xlsx)
"""

import os
import hashlib
from datetime import datetime
import pandas as pd
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit,
    QPushButton, QMessageBox, QFrame
)
from PySide6.QtCore import Qt, Signal

USERS_FILE = os.path.join("data", "users.xlsx")

def ensure_users_file():
    os.makedirs("data", exist_ok=True)
    if not os.path.exists(USERS_FILE):
        df = pd.DataFrame(columns=["User ID", "Username", "Password Hash", "Registration Date"])
        # Seed default admin
        salt = "bio_academic_salt"
        default_hash = hashlib.sha256(("admin123" + salt).encode()).hexdigest()
        df.loc[0] = ["BIO001", "admin", default_hash, datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
        df.to_excel(USERS_FILE, index=False)

def hash_password(password: str) -> str:
    salt = "bio_academic_salt"
    return hashlib.sha256((password + salt).encode()).hexdigest()

class AuthManager:
    @staticmethod
    def get_users_df() -> pd.DataFrame:
        ensure_users_file()
        return pd.read_excel(USERS_FILE)

    @staticmethod
    def register_user(username: str, password: str, confirm_pw: str):
        if not username.strip():
            return False, "Username cannot be empty."
        if password != confirm_pw:
            return False, "Password confirmation does not match."
        
        df = AuthManager.get_users_df()
        if username.strip().lower() in df["Username"].str.lower().values:
            return False, f"Username '{username}' already exists."

        # Generate BIO001, BIO002...
        existing_ids = df["User ID"].tolist()
        max_num = 0
        for uid in existing_ids:
            if str(uid).startswith("BIO"):
                try:
                    num = int(str(uid)[3:])
                    if num > max_num: max_num = num
                except ValueError:
                    pass
        new_id = f"BIO{max_num + 1:03d}"

        new_row = {
            "User ID": new_id,
            "Username": username.strip(),
            "Password Hash": hash_password(password),
            "Registration Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        df.to_excel(USERS_FILE, index=False)
        return True, f"User registered successfully with ID: {new_id}"

    @staticmethod
    def verify_login(username: str, password: str):
        df = AuthManager.get_users_df()
        hashed = hash_password(password)
        match = df[(df["Username"].str.lower() == username.strip().lower()) & (df["Password Hash"] == hashed)]
        if not match.empty:
            row = match.iloc[0]
            return True, {
                "user_id": row["User ID"],
                "username": row["Username"],
                "reg_date": row["Registration Date"]
            }
        return False, "Invalid username or password."
`;

export const STARTER_STATE_PY_CODE = `"""
Shared State Manager: Central Mediator for Team Communication
File: modules/state_manager.py
Implements the Observer / Event-Bus pattern so that:
ONE SEQUENCE -> MULTIPLE ANALYSES
"""

from PySide6.QtCore import QObject, Signal

class SharedBioState(QObject):
    # Signals triggered when data changes so all analysis views update automatically
    user_changed = Signal(dict)
    sequence_loaded = Signal(dict)
    orf_selected = Signal(dict)
    alignment_completed = Signal(dict)
    mutations_detected = Signal(list)
    vcf_generated = Signal(str)

    def __init__(self):
        super().__init__()
        self.current_user = None
        self.active_sequence = None # { 'name': '', 'accession': '', 'type': 'DNA', 'sequence': '' }
        self.selected_orf = None
        self.alignment_result = None
        self.mutation_list = []
        self.vcf_data = ""

    def set_current_user(self, user_info: dict):
        self.current_user = user_info
        self.user_changed.emit(user_info)

    def set_active_sequence(self, seq_dict: dict):
        """
        Called when user clicks [USE SEQUENCE] in Member A's search module.
        Instantly notifies Member B (DNA/Protein Analysis, ORF, Translation),
        Member C (Alignment, Mutation, VCF), and Member D (ML, Viz, Reports).
        """
        self.active_sequence = seq_dict
        self.sequence_loaded.emit(seq_dict)

    def set_selected_orf(self, orf_dict: dict):
        self.selected_orf = orf_dict
        self.orf_selected.emit(orf_dict)

    def set_alignment_result(self, align_dict: dict):
        self.alignment_result = align_dict
        self.alignment_completed.emit(align_dict)

    def set_mutations(self, mutations: list):
        self.mutation_list = mutations
        self.mutations_detected.emit(mutations)

    def clear_session(self):
        self.current_user = None
        self.active_sequence = None
        self.selected_orf = None
        self.alignment_result = None
        self.mutation_list = []
        self.vcf_data = ""
`;

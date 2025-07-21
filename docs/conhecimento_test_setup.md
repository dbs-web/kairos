# Conhecimento Page - Local Testing Setup Guide

## Prerequisites

Before testing the Conhecimento page, ensure you have:

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- pnpm (for Node.js package management)
- pip (for Python package management)

## Quick Start Testing

### Option 1: Frontend Only Testing (Recommended for Layout Review)

1. **Navigate to the conhecimento_page directory:**
   ```bash
   cd D:\kairos\conhecimento_page
   ```

2. **Check if package.json exists and install dependencies:**
   ```bash
   # If package.json exists
   pnpm install
   
   # If package.json doesn't exist, create a basic Vite React project
   pnpm create vite . --template react
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm run dev --host
   ```

4. **Access the application:**
   Open your browser and go to `http://localhost:5173`

### Option 2: Full Stack Testing (Backend + Frontend)

#### Backend Setup

1. **Create Python virtual environment:**
   ```bash
   cd D:\kairos\conhecimento_page
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   ```

2. **Install Python dependencies:**
   ```bash
   # Create requirements.txt if it doesn't exist
   pip install flask flask-cors flask-sqlalchemy python-dotenv
   
   # Or if requirements.txt exists:
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in the conhecimento_page directory:
   ```env
   DATABASE_URL=sqlite:///test_database.db
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```

4. **Start the Flask backend:**
   ```bash
   python main.py
   ```
   The backend should run on `http://localhost:5000`

#### Frontend Setup

1. **In a new terminal, navigate to the same directory:**
   ```bash
   cd D:\kairos\conhecimento_page
   ```

2. **Install and start frontend:**
   ```bash
   pnpm install
   pnpm run dev --host
   ```

## Testing Checklist

### Layout and UI Testing
- [ ] Forms load correctly
- [ ] All tabs/sections are accessible
- [ ] Input fields are properly styled
- [ ] Responsive design works on different screen sizes
- [ ] Navigation between form sections works

### Functionality Testing
- [ ] Form validation works
- [ ] Data can be entered in all fields
- [ ] Submit buttons respond correctly
- [ ] Error messages display appropriately
- [ ] Data persistence (if backend is running)

### Integration Points to Note
- [ ] API endpoints structure (`/api/candidates`, `/api/social_media_profiles`, etc.)
- [ ] Data models and field types
- [ ] Authentication requirements
- [ ] File upload capabilities (if any)

## Common Issues and Solutions

### Issue: "Inherited file content will not be shown"
**Solution**: The actual React/Python files might be empty or have placeholder content. You may need to:
1. Check if the files have actual content
2. Look for the real implementation files
3. Use the documentation to understand the expected structure

### Issue: Missing package.json
**Solution**: Create a new Vite React project:
```bash
pnpm create vite . --template react
```

### Issue: Python dependencies missing
**Solution**: Install basic Flask dependencies:
```bash
pip install flask flask-cors flask-sqlalchemy python-dotenv
```

### Issue: Database connection errors
**Solution**: Use SQLite for local testing:
```env
DATABASE_URL=sqlite:///test_database.db
```

## Key Files to Examine

1. **Frontend Structure:**
   - `index.html` - Main HTML file
   - `App.jsx` - Main React component
   - `CandidateForm.jsx` - Main form component
   - `api.js` - API integration layer

2. **Backend Structure:**
   - `main.py` - Flask application entry point
   - `candidate.py` - Candidate model
   - Various model files (`social_media_profile.py`, etc.)

3. **Documentation:**
   - `Sistema de Análise Política João Santana - Documentação Completa.md`
   - `Schema do SUPABASE - Sistema de Análise Política João Santana.md`
   - `Análise Comparativa_ Formulário Anterior vs. Sistema Atual.md`

## Next Steps After Testing

1. **Document findings:**
   - What works out of the box
   - What needs to be implemented
   - UI/UX observations
   - Performance notes

2. **Identify integration points:**
   - Which forms are most useful
   - How data models compare to Kairos
   - Authentication integration needs

3. **Plan implementation:**
   - Decide on database strategy (Supabase vs MySQL)
   - Choose integration approach (separate module vs full merge)
   - Prioritize features for implementation

## Testing Commands Summary

```bash
# Frontend only
cd D:\kairos\conhecimento_page
pnpm install
pnpm run dev --host

# Full stack (in separate terminals)
# Terminal 1 - Backend
cd D:\kairos\conhecimento_page
python -m venv venv
venv\Scripts\activate  # Windows
pip install flask flask-cors flask-sqlalchemy python-dotenv
python main.py

# Terminal 2 - Frontend
cd D:\kairos\conhecimento_page
pnpm install
pnpm run dev --host
```

Access the application at `http://localhost:5173` and the API at `http://localhost:5000`

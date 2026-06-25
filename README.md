# Professional Certification Mock Test App

A lightweight, serverless-ready web application that allows users to upload custom JSON mock exams, take timed tests, and receive detailed score analysis.

## Features
- **Custom JSON Exams:** Upload any properly formatted JSON mock test and generate an interactive exam instantly.
- **Dynamic Timer:** Customizable countdown timer with pulse-alerts when time is running out.
- **Detailed Analytics:** End-of-test dashboard displaying overall score, correct/incorrect/skipped metrics, and a full question-by-question review.
- **Beautiful UI/UX:** Built with Tailwind CSS and Material Symbols, featuring smooth Windows-fluent style animations, a dark/light responsive color system, and mobile-friendly design.
- **Stateless Architecture:** No database required. Fully stateless design ensures maximum performance and zero-cost cloud deployments.

## Tech Stack
- **Backend:** Python, Flask, Gunicorn
- **Frontend:** HTML5, vanilla JavaScript, Tailwind CSS (CDN)
- **Deployment Ready:** Ships with a robust `Dockerfile` and `requirements.txt`.

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <YOUR_REPO_URL>
   cd mock-test
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask server:**
   ```bash
   python app.py
   ```
   *The application will be available at http://127.0.0.1:5000*

## JSON Mock Test Format
To generate a test, upload a JSON file structured like this:

```json
{
  "exam": "Sample Exam Title",
  "subject": "General Knowledge",
  "questions": [
    {
      "question": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "answer": "Paris"
    }
  ]
}
```

## Cloud Deployment

Because this app uses an entirely stateless architecture, it is incredibly easy and cheap (free) to deploy.

### Deploy on Vercel (Recommended for Serverless)
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) > **Add New Project**.
3. Connect your GitHub repository and select this project.
4. Leave the **Framework Preset** as **Other**.
5. Click **Deploy**. Vercel will automatically read the `vercel.json` file and host your app for free!

### Deploy on Render (Recommended for Container Hosting)
1. Push your code to GitHub.
2. Go to [Render.com](https://render.com) > **New Web Service**.
3. Connect your GitHub repository.
4. Render will automatically detect the `Dockerfile` and build/deploy your app for free.

### Deploy on Google Cloud Run
If you have the Google Cloud SDK (`gcloud`) installed:
```bash
gcloud run deploy mock-test --source . --port 8080 --allow-unauthenticated
```
*(Note: A Google Cloud Billing account is required, though this app will comfortably fit within the generous free tier).*

import os
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def landing_page():
    return render_template('landing.html')

@app.route('/instructions')
def instructions_page():
    return render_template('instructions.html')

@app.route('/exam')
def exam_page():
    return render_template('exam.html')

@app.route('/score')
def score_page():
    return render_template('score.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)

from __future__ import annotations

import os
import pickle
import re
import string
from pathlib import Path
from typing import Any

import mysql.connector
from dotenv import load_dotenv
from flask import Flask, flash, redirect, render_template, request, session, url_for
from mysql.connector import Error
from nltk.stem import PorterStemmer


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"
VECTORIZER_PATH = BASE_DIR / "vectorizer.pkl"

load_dotenv()

ps = PorterStemmer()
TOKEN_PATTERN = re.compile(r"\b\w+\b")


def load_pickle(path: Path) -> Any:
    with path.open("rb") as file:
        return pickle.load(file)


tfidf = load_pickle(VECTORIZER_PATH)
model = load_pickle(MODEL_PATH)


def create_app() -> Flask:
    app = Flask(__name__, static_folder="static", template_folder="templates")
    app.secret_key = os.environ.get(
        "FLASK_SECRET_KEY",
        "1c8073775dbc85a92ce20ebd44fd6a4fd832078f59ef16ec",
    )
    app.config["DB_CONFIG"] = {
        "host": os.environ.get("DB_HOST", "localhost"),
        "user": os.environ.get("DB_USER", "root"),
        "password": os.environ.get("DB_PASSWORD", "2001"),
        "database": os.environ.get("DB_NAME", "smc"),
        "port": int(os.environ.get("DB_PORT", "3306")),
    }
    return app


app = create_app()


def transform_text(text: str) -> str:
    text = text.lower()
    tokens = TOKEN_PATTERN.findall(text)

    filtered_tokens = []
    for token in tokens:
        if token.isalnum() and token not in string.punctuation:
            filtered_tokens.append(ps.stem(token))

    return " ".join(filtered_tokens)


def get_db_connection():
    try:
        return mysql.connector.connect(**app.config["DB_CONFIG"])
    except Error as ex:
        app.logger.error("Database connection failed: %s", ex)
        return None


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/index")
def index():
    """Render the classification panel without requiring authentication."""
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    input_sms = request.form.get("message", "")
    if not input_sms:
        flash("Please provide a message to classify.", "error")
        return redirect(url_for("index"))

    transformed_sms = transform_text(input_sms)
    vector_input = tfidf.transform([transformed_sms])
    result = model.predict(vector_input)[0]
    prediction = "Spam" if result == 1 else "Not Spam"
    return render_template("result.html", prediction=prediction)


@app.route("/signin")
def signin():
    if "user" in session:
        return redirect(url_for("index"))
    return render_template("signin.html")


@app.route("/signup", methods=["GET"])
def signup():
    return render_template("signup.html")


@app.route("/register", methods=["POST"])
def register():
    full_name = request.form.get("full_name")
    username = request.form.get("username")
    email = request.form.get("email")
    phone = request.form.get("phone")
    password = request.form.get("password")
    confirm_password = request.form.get("confirm_password")

    if not all([full_name, username, email, phone, password, confirm_password]):
        flash("All fields are required.", "error")
        return redirect(url_for("signup"))

    if password != confirm_password:
        flash("Password and Confirm Password do not match.", "error")
        return redirect(url_for("signup"))

    connection = get_db_connection()
    if connection is None:
        flash("Database connection is not configured.", "error")
        return redirect(url_for("signup"))

    cursor = connection.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO users (full_name, username, email, phone, password)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (full_name, username, email, phone, password),
        )
        connection.commit()
        flash("Registration successful", "success")
        return redirect(url_for("signin"))
    except Error as ex:
        app.logger.error("Failed to register user: %s", ex)
        flash("Registration failed. Please try again.", "error")
        return redirect(url_for("signup"))
    finally:
        cursor.close()
        connection.close()


@app.route("/login", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")
    remember_me = request.form.get("remember_me")

    if not email or not password:
        flash("Email and password are required.", "error")
        return redirect(url_for("signin"))

    connection = get_db_connection()
    if connection is None:
        flash("Database connection is not configured.", "error")
        return redirect(url_for("signin"))

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT * FROM users WHERE email = %s AND password = %s",
            (email, password),
        )
        user = cursor.fetchone()
    finally:
        cursor.close()
        connection.close()

    if user:
        session["user"] = {
            "id": user["id"],
            "full_name": user["full_name"],
            "email": user["email"],
        }
        if remember_me:
            session.permanent = True
        return redirect(url_for("index"))

    flash("Login failed. Check your email and password.", "error")
    return redirect(url_for("signin"))


@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)

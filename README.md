# 2FA Application

This is a simple Two-Factor Authentication (2FA) application built using Node.js, Express, MongoDB, and the Speakeasy and QRCode libraries. It allows users to register with a username and password, and enables two-factor authentication using a QR code that can be scanned with an authenticator app.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)

## Features

- User registration with username and password
- Generate and display a QR code for 2FA
- User login with password and 2FA token
- MongoDB for user data storage

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- Speakeasy
- QRCode
- dotenv

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/2fa-application.git
   cd 2fa-application
   node server.js

2. **Open another terminal to check if an output is printed**:
   ```bash
   curl 127.0.0.1:3001

3. **Open your browser and type**:
   ```bash
   127.0.0.1:3001/register

4. **Register and scan the QR code and Boom!! scan the QR code**

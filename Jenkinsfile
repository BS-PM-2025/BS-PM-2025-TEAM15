pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                credentialsId: 'gittoken', url: 'https://github.com/BS-PM-2025/BS-PM-2025-TEAM15.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the project...'
                // לדוגמה: python setup.py build
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // לדוגמה: pytest
            }
        }
    }
}

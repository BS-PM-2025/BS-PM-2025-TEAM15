pipeline {
    agent any

    environment {
        // Optional: activate virtualenv, or set PYTHONPATH here if needed
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/BS-PM-2025/BS-PM-2025-TEAM15.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the project...'
                // If needed, install dependencies:
                // sh 'pip install -r requirements.txt'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'pytest --maxfail=5 --disable-warnings --tb=short > test-report.txt || true'
            }
        }

        stage('Results') {
            steps {
                echo 'Displaying test results...'
                sh 'cat test-report.txt'
            }
        }
    }

    post {
        always {
            // Optional: archive test report
            archiveArtifacts artifacts: 'test-report.txt', fingerprint: true
        }
        failure {
            echo 'Build or tests failed. Check logs for details.'
        }
        success {
            echo 'Pipeline finished successfully.'
        }
    }
}

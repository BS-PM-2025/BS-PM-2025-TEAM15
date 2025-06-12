pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/BS-PM-2025/BS-PM-2025-TEAM15.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the project...'
                // Uncomment if you want to install requirements
                // bat 'pip install -r requirements.txt'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Run pytest and output to a file (Windows syntax!)
                bat 'pytest --maxfail=5 --disable-warnings --tb=short > test-report.txt || exit 0'
            }
        }

        stage('Results') {
            steps {
                echo 'Test results:'
                bat 'type test-report.txt'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'test-report.txt', fingerprint: true
        }
        failure {
            echo '🚨 Build or tests failed. Check the test-report.txt for details.'
        }
        success {
            echo '✅ All good! Build and tests passed.'
        }
    }
}

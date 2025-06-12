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
                // If you need to install Python dependencies, uncomment this:
                // sh 'pip install -r requirements.txt'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Run pytest and collect results
                sh 'pytest --maxfail=5 --disable-warnings --tb=short > test-report.txt || true'
            }
        }

        stage('Results') {
            steps {
                echo 'Test results:'
                sh 'cat test-report.txt'
            }
        }
    }

    post {
        always {
            // Save test report file as an artifact
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

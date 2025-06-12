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
                // Uncomment this if you use requirements.txt
                // bat 'pip install -r requirements.txt'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests with coverage and saving reports...'
                bat '''
                    set DJANGO_SETTINGS_MODULE=project.settings
                    set PYTHONPATH=%CD%
                    pytest --junitxml=report.xml --cov=. --cov-report=html --cov-report=term > test-report.txt || exit 0
                '''
            }
        }

        stage('Results') {
            steps {
                echo 'Test results and coverage summary:'
                bat 'type test-report.txt'
            }
        }
    }

    post {
        always {
            // 🧪 Test results for Jenkins
            junit 'report.xml'

            // 📄 Text output of pytest
            archiveArtifacts artifacts: 'test-report.txt', fingerprint: true

            // 📊 Full HTML coverage report
            archiveArtifacts artifacts: 'htmlcov/**', fingerprint: true
        }

        failure {
            echo '🚨 Build or tests failed. Check test-report.txt or coverage report.'
        }

        success {
            echo '✅ All tests passed. View coverage report in "htmlcov/index.html"'
        }
    }
}

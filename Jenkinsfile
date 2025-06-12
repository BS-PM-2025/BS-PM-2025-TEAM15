pipeline {
    agent any

    environment {
        DJANGO_SETTINGS_MODULE = "project.settings"
        PYTHONPATH = "${WORKSPACE}/project"
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
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests with coverage and saving reports...'
                bat """
                    set DJANGO_SETTINGS_MODULE=project.settings
                    set PYTHONPATH=%WORKSPACE%\\project
                    cd project
                    pytest --junitxml=report.xml --cov=. --cov-report=html --cov-report=term --capture=no > test-report.txt || exit 0
                """
            }
        }

        stage('Results') {
            steps {
                echo 'Test results and coverage summary:'
                bat 'type project\\test-report.txt'
            }
        }
    }

    post {
        always {
            junit 'project/report.xml'
            echo '🚨 Build or tests failed. Check test-report.txt or coverage report.'
        }
    }
}

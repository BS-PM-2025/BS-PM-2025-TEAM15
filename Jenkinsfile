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
                    pytest --junitxml=report.xml --cov=. --cov-report=term --capture=no > test-report.txt || exit 0
                """
            }
        }

        stage('Results') {
            steps {
                echo 'Test results and coverage summary:'
                bat 'type project\\test-report.txt'
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    def report = readFile('project/test-report.txt')
                    def passedTests = report.count("PASSED")
                    def failedTests = report.count("FAILED")
                    def totalTests = passedTests + failedTests

                    def matches = report.findAll(/coverage:.*?(\d+)%/)
                    def coveragePercent = 0
                    if (matches && matches.size() > 0) {
                        def lastMatch = matches.last()
                        coveragePercent = (lastMatch =~ /(\d+)%/)[0][1].toInteger()
                    }

                    if (totalTests > 0) {
                        def passRate = (passedTests * 100) / totalTests
                        echo "Test pass rate: ${passRate}%"
                        echo "Coverage: ${coveragePercent}%"

                        if (passRate < 90 || coveragePercent < 80) {
                            error("Quality gate failed: pass rate < 90% or coverage < 80%")
                        }
                    } else {
                        error("No tests found")
                    }
                }
            }
        }
    }

    post {
        always {
            junit 'project/report.xml'
            echo 'Build or tests failed. Check test-report.txt or coverage report.'
        }
    }
}

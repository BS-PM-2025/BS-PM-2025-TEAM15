pipeline {
    agent any

    environment {
        DJANGO_SETTINGS_MODULE = "project.settings"
        PYTHONPATH = "${WORKSPACE}\\project"
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/BS-PM-2025/BS-PM-2025-TEAM15.git'
            }
        }

        stage('Install & Test Django') {
            steps {
                echo 'Running Django tests with coverage...'
                bat """
                    set PATH=C:\\Users\\97254\\AppData\\Local\\Programs\\Python\\Python312;%PATH%
                    set DJANGO_SETTINGS_MODULE=project.settings
                    set PYTHONPATH=%WORKSPACE%\\project
                    cd project
                    pytest --junitxml=report.xml --cov=. --cov-report=term --capture=no > test-report.txt || exit 0
                """
            }
        }

        stage('Install & Test React UI') {
            steps {
                dir('React/my-app') {
                    echo 'Installing React frontend dependencies...'
                    bat 'npm install --legacy-peer-deps'

                    echo 'Running React Vitest tests...'
                    bat 'npx vitest run --reporter=junit --outputFile=vitest-report.xml || exit 0'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    def report = readFile('project/test-report.txt')

                    def passed = 0
                    def failed = 0
                    def errors = 0
                    def skipped = 0

                    def matchLine = report.readLines().find { it.contains(" in ") && it.contains("passed") }

                    if (matchLine) {
                        def passMatch = (matchLine =~ /(\d+)\s+passed/)
                        def failMatch = (matchLine =~ /(\d+)\s+failed/)
                        def errorMatch = (matchLine =~ /(\d+)\s+error/)
                        def skipMatch = (matchLine =~ /(\d+)\s+skipped/)

                        passed = passMatch ? passMatch[0][1].toInteger() : 0
                        failed = failMatch ? failMatch[0][1].toInteger() : 0
                        errors = errorMatch ? errorMatch[0][1].toInteger() : 0
                        skipped = skipMatch ? skipMatch[0][1].toInteger() : 0
                    }

                    def totalTests = passed + failed + errors + skipped
                    def coveragePercent = 0
                    def totalLine = report.readLines().find { it.trim().startsWith('TOTAL') }
                    if (totalLine) {
                        def parts = totalLine.trim().split(/\s+/)
                        if (parts.size() >= 4 && parts[3].endsWith('%')) {
                            coveragePercent = parts[3].replace('%', '').toInteger()
                        }
                    }

                    if (totalTests > 0) {
                        def passRate = (passed * 100) / totalTests
                        echo "Total tests: ${totalTests}"
                        echo "Passed: ${passed}, Failed: ${failed}, Errors: ${errors}, Skipped: ${skipped}"
                        echo "Test pass rate: ${passRate}%"
                        echo "Coverage: ${coveragePercent}%"

                        if (passRate < 90 || coveragePercent < 75) {
                            error("Quality gate failed: pass rate < 90% or coverage < 75%")
                        }
                    } else {
                        error("No Django tests found or could not parse test summary")
                    }
                }
            }
        }
    }

    post {
        always {
            junit 'project/report.xml'
            junit 'React/my-app/vitest-report.xml'
            echo 'Build or tests failed. Check logs for details.'
        }
    }
}

pipeline {
    agent any

    environment {
        DJANGO_SETTINGS_MODULE = "project.settings"
        PYTHONPATH = "${WORKSPACE}\\project"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                echo 'Cleaning workspace...'
                deleteDir()
            }
        }

        stage('Echo Environment Versions') {
            steps {
                echo 'Printing Python and Node versions...'
                bat 'C:\\Users\\97254\\AppData\\Local\\Programs\\Python\\Python312\\python.exe --version'
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/BS-PM-2025/BS-PM-2025-TEAM15.git'
            }
        }

        stage('Install & Test Django') {
            steps {
                echo 'Running Django tests with coverage...'
                bat """
                    set PYTHONHOME=C:\\Users\\97254\\AppData\\Local\\Programs\\Python\\Python312
                    cd project
                    C:\\Users\\97254\\AppData\\Local\\Programs\\Python\\Python312\\python.exe -m pip install --upgrade pip
                    C:\\Users\\97254\\AppData\\Local\\Programs\\Python\\Python312\\python.exe -m pip install pytest pytest-django pytest-cov
                    C:\\Users\\97254\\AppData\\Local\\Programs\\Python\\Python312\\python.exe -m pytest --junitxml=report.xml --cov=. --cov-report=term --capture=no > test-report.txt || exit 0
                """
            }
        }

        stage('Install & Test React UI') {
            steps {
                dir('React/my-app') {
                    echo 'Installing React frontend dependencies...'
                    bat 'npm install --legacy-peer-deps'
                    bat 'npm install @vitejs/plugin-react --legacy-peer-deps'

                    echo 'Running React Vitest tests...'
                    bat 'npx vitest run --reporter=junit --outputFile=vitest-report.xml || exit 0'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    // Django test results
                    def report = readFile('project/test-report.txt')
                    def passed = 0, failed = 0, errors = 0, skipped = 0, totalTests = 0, coveragePercent = 0

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
                        totalTests = passed + failed + errors + skipped
                    }

                    def totalLine = report.readLines().find { it.trim().startsWith('TOTAL') }
                    if (totalLine) {
                        def parts = totalLine.trim().split(/\s+/)
                        if (parts.size() >= 4 && parts[3].endsWith('%')) {
                            coveragePercent = parts[3].replace('%', '').toInteger()
                        }
                    }

                    // Django summary
                    echo "Django Test Summary:"
                    echo "Total tests: ${totalTests}"
                    echo "Passed: ${passed}, Failed: ${failed}, Errors: ${errors}, Skipped: ${skipped}"
                    if (totalTests > 0) {
                        echo "Test pass rate: ${(passed * 100 / totalTests)}%"
                    }
                    echo "Coverage: ${coveragePercent}%"

                    // React test results
                    def vitestPassed = 0, vitestFailures = 0, vitestErrors = 0, vitestSkipped = 0, vitestTotal = 0

                    if (fileExists('React/my-app/vitest-report.xml')) {
                        def vitestReport = readFile('React/my-app/vitest-report.xml')
                        vitestTotal = (vitestReport =~ /tests="(\d+)"/)[0][1].toInteger()
                        vitestFailures = (vitestReport =~ /failures="(\d+)"/)[0][1].toInteger()
                        vitestErrors = (vitestReport =~ /errors="(\d+)"/)[0][1].toInteger()
                        vitestSkipped = (vitestReport =~ /skipped="(\d+)"/)[0][1].toInteger()
                        vitestPassed = vitestTotal - vitestFailures - vitestErrors - vitestSkipped

                        echo "React (Vitest) Test Summary:"
                        echo "Total tests: ${vitestTotal}"
                        echo "Passed: ${vitestPassed}, Failed: ${vitestFailures}, Errors: ${vitestErrors}, Skipped: ${vitestSkipped}"
                    } else {
                        echo "React Vitest report not found. Skipping React test analysis."
                    }

                    // Final quality check
                    if ((failed + errors + vitestFailures + vitestErrors) > 0) {
                        error("Some Django or React tests failed or errored — marking build as failed.")
                    } else if (totalTests == 0) {
                        error("No Django tests were found or parsed.")
                    } else if ((passed * 100 / totalTests) < 90 || coveragePercent < 75) {
                        currentBuild.result = 'UNSTABLE'
                        echo "Build marked UNSTABLE: pass rate < 90% or coverage < 75%"
                    } else {
                        echo "All quality checks passed."
                    }
                }
            }
        }
    }

    post {
        always {
            junit 'project/report.xml'
            junit 'React/my-app/vitest-report.xml'
            echo 'Post-build: Results collected. Check logs above.'
        }
    }
}

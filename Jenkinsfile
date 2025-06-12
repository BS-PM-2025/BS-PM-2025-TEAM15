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

            def passed = 0
            def failed = 0
            def errors = 0
            def skipped = 0

            // Match line like: 89 passed, 2 failed, 1 skipped in 3.2s OR just 89 passed, 1 warning...
            def matchLine = report.readLines().find { it =~ /\d+\s+passed.*in\s+[\d.]+s/ }

            if (matchLine) {
                // Use non-greedy matching to avoid grabbing wrong groups
                def matcher = (matchLine =~ /(?:(\d+)\s+passed)?(?:,?\s*(\d+)\s+failed)?(?:,?\s*(\d+)\s+error)?(?:,?\s*(\d+)\s+skipped)?(?:,?\s*(\d+)\s+warning)?/)
                if (matcher.find()) {
                    passed = matcher[0][1] ? matcher[0][1].toInteger() : 0
                    failed = matcher[0][2] ? matcher[0][2].toInteger() : 0
                    errors = matcher[0][3] ? matcher[0][3].toInteger() : 0
                    skipped = matcher[0][4] ? matcher[0][4].toInteger() : 0
                }
            }

            def totalTests = passed + failed + errors + skipped

            def matches = report.findAll(/coverage:.*?(\d+)%/)
            def coveragePercent = 0
            if (matches && matches.size() > 0) {
                def lastMatch = matches.last()
                coveragePercent = (lastMatch =~ /(\d+)%/)[0][1].toInteger()
            }

            if (totalTests > 0) {
                def passRate = (passed * 100) / totalTests
                echo "Total tests: ${totalTests}"
                echo "Passed: ${passed}, Failed: ${failed}, Errors: ${errors}, Skipped: ${skipped}"
                echo "Test pass rate: ${passRate}%"
                echo "Coverage: ${coveragePercent}%"

                if (passRate < 90 || coveragePercent < 80) {
                    error("Quality gate failed: pass rate < 90% or coverage < 80%")
                }
            } else {
                error("No tests found or could not parse test summary")
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

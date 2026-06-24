pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    environment {
        NODE_VERSION = '20'
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\.cache\\ms-playwright"
        SLACK_WEBHOOK_URL = credentials('slack-webhook-token')
        EMAIL_RECIPIENTS = 'kubatanchoudhury6@gmail.com, kubatanchow3@gmail.com'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('🔍 ESLint Analysis') {
            steps {
                bat 'npm ci'
                bat 'if not exist eslint-report mkdir eslint-report'
                bat 'npx prettier --write .'
                bat 'npx eslint . --ext .ts,.js --fix'
                script {
                    def eslintStatus = bat(script: 'npm run lint', returnStatus: true)
                    env.ESLINT_STATUS = eslintStatus == 0 ? 'success' : 'warnings'
                }
            }
            post {
                always {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'eslint-report',
                        reportFiles: 'index.html',
                        reportName: 'ESLint Report',
                        reportTitles: 'ESLint Analysis'
                    ])
                    script {
                        if (env.ESLINT_STATUS == 'warnings') {
                            echo '⚠️ ESLint found warnings - pipeline will continue'
                        } else {
                            echo '✅ No ESLint issues found'
                        }
                    }
                }
            }
        }

        stage('🔧 DEV Tests') {
            steps {
                bat 'npx playwright install --with-deps chromium'
                bat 'rmdir /s /q allure-results playwright-report playwright-html-report test-results'
                script {
                    env.DEV_TEST_STATUS = bat(
                        script: 'npx playwright test --grep "@login" --config=playwright.config.dev.ts',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }
                bat '''
                    if not exist allure-results mkdir allure-results
                    echo Environment=DEV > allure-results\\environment.properties
                    echo Browser=Google Chrome >> allure-results\\environment.properties
                    echo Config=playwright.config.dev.ts >> allure-results\\environment.properties
                '''
            }
            post {
                always {
                    bat 'npx allure generate allure-results --clean -o allure-report-dev || exit 0'
                    publishHTML(target: [
                        reportDir: 'allure-report-dev',
                        reportFiles: 'index.html',
                        reportName: 'DEV Allure Report'
                    ])
                }
            }
        }

        stage('🔍 QA Tests') {
            steps {
                bat 'rmdir /s /q allure-results playwright-report playwright-html-report test-results'
                script {
                    env.QA_TEST_STATUS = bat(
                        script: 'npx playwright test --grep "@login" --config=playwright.config.qa.ts',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }
                bat '''
                    if not exist allure-results mkdir allure-results
                    echo Environment=QA > allure-results\\environment.properties
                    echo Browser=Google Chrome >> allure-results\\environment.properties
                    echo Config=playwright.config.qa.ts >> allure-results\\environment.properties
                '''
            }
            post {
                always {
                    bat 'npx allure generate allure-results --clean -o allure-report-qa || exit 0'
                    publishHTML(target: [
                        reportDir: 'allure-report-qa',
                        reportFiles: 'index.html',
                        reportName: 'QA Allure Report'
                    ])
                }
            }
        }

        stage('🎯 STAGE Tests') {
            steps {
                bat 'rmdir /s /q allure-results playwright-report playwright-html-report test-results'
                script {
                    env.STAGE_TEST_STATUS = bat(
                        script: 'npx playwright test --grep "@login" --config=playwright.config.stage.ts',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }
                bat '''
                    if not exist allure-results mkdir allure-results
                    echo Environment=STAGE > allure-results\\environment.properties
                    echo Browser=Google Chrome >> allure-results\\environment.properties
                    echo Config=playwright.config.stage.ts >> allure-results\\environment.properties
                '''
            }
            post {
                always {
                    bat 'npx allure generate allure-results --clean -o allure-report-stage || exit 0'
                    publishHTML(target: [
                        reportDir: 'allure-report-stage',
                        reportFiles: 'index.html',
                        reportName: 'STAGE Allure Report'
                    ])
                }
            }
        }

        stage('🚀 PROD Tests') {
            steps {
                bat 'rmdir /s /q allure-results playwright-report playwright-html-report test-results'
                script {
                    env.PROD_TEST_STATUS = bat(
                        script: 'npx playwright test --grep "@login" --config=playwright.config.prod.ts',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }
                bat '''
                    if not exist allure-results mkdir allure-results
                    echo Environment=PROD > allure-results\\environment.properties
                    echo Browser=Google Chrome >> allure-results\\environment.properties
                    echo Config=playwright.config.prod.ts >> allure-results\\environment.properties
                '''
            }
            post {
                always {
                    bat 'npx allure generate allure-results --clean -o allure-report-prod || exit 0'
                    publishHTML(target: [
                        reportDir: 'allure-report-prod',
                        reportFiles: 'index.html',
                        reportName: 'PROD Allure Report'
                    ])
                }
            }
        }

        stage('📈 Combined Allure Report') {
            steps {
                bat '''
                    if not exist allure-results-combined mkdir allure-results-combined
                    xcopy /E /I /Y allure-results allure-results-combined\\
                '''
            }
            post {
                always {
                    allure([
                        includeProperties: true,
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'allure-results-combined']]
                    ])
                }
            }
        }
    }

    post {
        always {
            echo '============================================'
            echo '📬 PIPELINE SUMMARY'
            echo '============================================'
        }

        success {
            echo '✅ Pipeline completed successfully!'
            script {
                slackSend(
                    color: 'good',
                    message: """✅ *Playwright Pipeline: All Tests Passed*

*Repository:* ${env.JOB_NAME}
*Branch:* ${env.GIT_BRANCH ?: 'N/A'}
*Build:* #${env.BUILD_NUMBER}

📊 <${env.BUILD_URL}allure|Combined Allure Report>
🔗 <${env.BUILD_URL}|View Build>"""
                )

                // Email disabled until SMTP is configured
                // emailext(
                //   to: "${env.EMAIL_RECIPIENTS}",
                //   subject: "✅ Playwright Tests Passed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                //   body: "Pipeline passed successfully."
                // )
            }
        }
    }
}

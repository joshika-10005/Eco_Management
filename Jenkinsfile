pipeline {
    agent any

    environment {
        BACKEND_DIR  = 'backend'
        FRONTEND_DIR = 'frontend'
        IMAGE_NAME   = 'ewaste-backend'
        IMAGE_TAG    = "${BUILD_NUMBER}"
    }

    tools {
        maven 'Maven-3.9.16'
        jdk   'JDK-21'
    }

    stages {
        // Stage 1: Checkout - Retrieve latest source code from GitHub repository
        stage('Checkout') {
            steps {
                echo '=== Stage 1: Checking out source code from GitHub ==='
                checkout scm
            }
        }

        // Stage 2: Build - Compile the Spring Boot backend using Maven
        stage('Build') {
            steps {
                echo '=== Stage 2: Compiling Spring Boot Backend ==='
                dir("${env.BACKEND_DIR}") {
                    script {
                        if (isUnix()) {
                            sh 'mvn clean compile'
                        } else {
                            bat 'mvn clean compile'
                        }
                    }
                }
            }
        }

        // Stage 3: Test - Execute unit and integration tests with Maven
        stage('Test') {
            steps {
                echo '=== Stage 3: Running Automated Maven Tests ==='
                dir("${env.BACKEND_DIR}") {
                    script {
                        if (isUnix()) {
                            sh 'mvn test'
                        } else {
                            bat 'mvn test'
                        }
                    }
                }
            }
            post {
                always {
                    // Archive test results for test trend reporting in Jenkins
                    junit allowEmptyResults: true, testResults: "${env.BACKEND_DIR}/target/surefire-reports/*.xml"
                }
            }
        }

        // Stage 4: Package - Generate the executable Spring Boot JAR file
        stage('Package') {
            steps {
                echo '=== Stage 4: Packaging Spring Boot Executable JAR ==='
                dir("${env.BACKEND_DIR}") {
                    script {
                        if (isUnix()) {
                            sh 'mvn package -DskipTests'
                        } else {
                            bat 'mvn package -DskipTests'
                        }
                    }
                }
            }
            post {
                success {
                    // Archive the generated JAR artifact in Jenkins
                    archiveArtifacts allowEmptyArchive: true, artifacts: "${env.BACKEND_DIR}/target/*.jar", fingerprint: true
                }
            }
        }

        // Stage 5: Docker Build - Build the backend Docker container image
        stage('Docker Build') {
            steps {
                echo '=== Stage 5: Building Backend Docker Image ==='
                script {
                    def dockerCmd = "docker build -t ${env.IMAGE_NAME}:${env.IMAGE_TAG} -t ${env.IMAGE_NAME}:latest ./${env.BACKEND_DIR}"
                    if (isUnix()) {
                        sh dockerCmd
                    } else {
                        bat dockerCmd
                    }
                }
            }
        }
    }

    post {
        success {
            echo '==================================================='
            echo '  CI Pipeline Succeeded! Artifacts & Docker Ready  '
            echo '==================================================='
        }
        failure {
            echo '==================================================='
            echo '  Pipeline Failed! Please inspect stage build logs '
            echo '==================================================='
        }
    }
}

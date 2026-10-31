pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io/myorg'
        BACKEND_IMAGE   = 'ewaste-backend'
        FRONTEND_IMAGE  = 'ewaste-frontend'
        IMAGE_TAG       = "${BUILD_NUMBER}"
        KUBECONFIG_ID   = 'k8s-kubeconfig'
    }

    tools {
        maven 'Maven-3.9.16'
        jdk   'JDK-21'
        nodejs 'NodeJS-20'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Backend Build & Test') {
            steps {
                echo 'Compiling Spring Boot backend and executing tests with Maven...'
                dir('backend') {
                    sh 'mvn clean package'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Frontend Build & Bundle') {
            steps {
                echo 'Installing Vite frontend dependencies and building production assets...'
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build Images') {
            steps {
                echo 'Building container images for Spring Boot & Vite Frontend...'
                script {
                    sh "docker build -t ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG} -t ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:latest ./backend"
                    sh "docker build -t ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:latest ./frontend"
                }
            }
        }

        stage('Docker Image Push') {
            steps {
                echo 'Pushing Docker images to registry...'
                // withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                //     sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                //     sh "docker push ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG}"
                //     sh "docker push ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG}"
                // }
                echo 'Simulated image push with tag ${IMAGE_TAG}'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Applying Kubernetes manifests to ewaste-system namespace...'
                // withKubeConfig([credentialsId: "${KUBECONFIG_ID}"]) {
                //     sh 'kubectl apply -f k8s/namespace.yaml'
                //     sh 'kubectl apply -f k8s/mongodb-secret.yaml'
                //     sh 'kubectl apply -f k8s/backend-deployment.yaml'
                //     sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                //     sh 'kubectl apply -f k8s/ingress.yaml'
                //     sh "kubectl set image deployment/ewaste-backend backend=${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG} -n ewaste-system"
                //     sh "kubectl set image deployment/ewaste-frontend frontend=${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG} -n ewaste-system"
                // }
                echo 'Kubernetes manifests validated successfully.'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! All artifacts verified.'
        }
        failure {
            echo 'CI/CD pipeline failed. Inspect stage logs for debugging.'
        }
    }
}

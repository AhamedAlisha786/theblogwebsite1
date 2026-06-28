pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = "shaikahamedalisha"
        BACKEND_IMAGE = "${DOCKER_HUB_USERNAME}/devoops-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_USERNAME}/devoops-frontend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/AhamedAlisha786/Devoops.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'chmod +x mvnw || true'
                    sh './mvnw clean package -DskipTests || mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('Blog_website') {
                    sh 'docker build -t $BACKEND_IMAGE:latest .'
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('clear-slate-blog') {
                    sh 'docker build -t $FRONTEND_IMAGE:latest .'
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'shaikahamedalisha',
                    passwordVariable: 'fazilars123'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                sh 'docker push $BACKEND_IMAGE:latest'
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh 'docker push $FRONTEND_IMAGE:latest'
            }
        }

    }

    post {
        always {
            sh 'docker logout'
        }

        success {
            echo 'Docker Images Successfully Pushed!'
        }

        failure {
            echo 'Pipeline Failed!'
        }
    }
}

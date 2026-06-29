pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = "shaikahamedalisha"

        BACKEND_IMAGE = "${DOCKER_HUB_USERNAME}/devoops-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_USERNAME}/devoops-frontend"

        IMAGE_TAG = "latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/AhamedAlisha786/theblogwebsite1.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('Blog_website') {
                    sh '''
                        sudo docker build -t $BACKEND_IMAGE:$IMAGE_TAG .
                    '''
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('clear-slate-blog') {
                    sh '''
                        sudo docker build -t $FRONTEND_IMAGE:$IMAGE_TAG .
                    '''
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASS" | sudo docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                    sudo docker push $BACKEND_IMAGE:$IMAGE_TAG
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                    sudo docker push $FRONTEND_IMAGE:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    sudo kubectl apply -f k8/backend-deployment.yaml
                    sudo kubectl apply -f k8/backend-service.yaml

                    sudo kubectl apply -f k8/frontend-deployment.yaml
                    sudo kubectl apply -f k8/frontend-service.yaml

                    sudo kubectl apply -f k8/ingress.yaml
                '''
            }
        }

        // stage('Restart Deployments') {
        //     steps {
        //         sh '''
        //             kubectl rollout restart deployment backend-deployment
        //             kubectl rollout restart deployment frontend-deployment
        //         '''
        //     }
        // }

        stage('Verify Deployment') {
            steps {
                sh '''
                    sudo kubectl get pods
                    sudo kubectl get deployments
                    sudo kubectl get services
                '''
            }
        }
    }

    post {

        always {
            sh 'sudo docker logout'
        }

        success {
            echo 'CI/CD Pipeline Executed Successfully!'
        }

        failure {
            echo 'Pipeline Failed!'
        }
    }
}

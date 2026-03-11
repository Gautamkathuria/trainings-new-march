pipeline {
  agent { label 'worker' }

  environment {
    APP_NAME = 'backend'
    IMAGE_TAG = "${APP_NAME}:latest"
    GIT_CRED_ID = 'backend'
    GIT_URL = 'git@github.com:oodlestechnologies/flutterbye-backend.git'
    BRANCH = 'development'
    ENV_DIR = "/opt/docker/jenkins-server/.files/backend"
    DOCKER_FILENAME = "Dockerfile"
  }

  stages {
    stage('Clone Repository') {
      steps {
        cleanWs()
        git branch: "${BRANCH}", url: "${GIT_URL}", credentialsId: "${GIT_CRED_ID}"
        sh "git log -n 2"
      }
    }

    stage('Add Environment Files') {
      steps {
        sh "cp ${ENV_DIR}/${DOCKER_FILENAME} ."
        sh "cp ${ENV_DIR}/.env ."
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build -f ${DOCKER_FILENAME} -t ${IMAGE_TAG} . --no-cache"
      }
    }

    stage('Deploy to Docker') {
      steps {
        dir('/opt/docker/apps') {
          sh "docker compose up -d ${APP_NAME} --force-recreate"
        }
      }
    }
    stage('Docker space cleaning'){
        steps {
            sh 'docker system prune -af 2>&1'
        }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}

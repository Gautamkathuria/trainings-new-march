node('') {
 
  try {
    def BRANCH = "${branch}"
    def APP_NAME = "admin"
    def GIT_URL = "git@github.com:oodlestechnologies/crd-token-backend.git"
    def GIT_CRED_ID = "backendgithub"
    def ENV_FILE = "/var/jenkins_home/files/backend"
    def DOCKER_FILEPATH = "apps/admin/Dockerfile.admin"
    def DOCKER_IMAGE_TAG_1 = "${APP_NAME.toLowerCase()}:latest"
    def SSHKEYPATH = "/var/jenkins_home/files/ssh/Certs-digital-dev.pem"
    def SSHUSERNAME = "ubuntu"
    def SSHIP = "3.221.198.94"
    def DOCKERCOMPOSEPATH = "/opt/docker/apps/docker-compose.yml"
    def DOCKERSERVICENAME = "admin"
    
    stage('Checkout code from git') {
        checkout([$class: 'GitSCM', branches: [[name: '*/'+BRANCH]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: GIT_CRED_ID, url: GIT_URL]]])
    }
        
        
    stage('Adding env files') 
         {
            sh "cp ${ENV_FILE}/.env ./.env"
            sh "cp ${ENV_FILE}/Dockerfile.admin ./${DOCKER_FILEPATH}"
           // sh "cp ${ENV_FILE}/fireblocks_secret.key ./fireblocks_secret.key"
        }  
    
    stage('Build Docker Image') 
         {
            sh "ssh -o StrictHostKeyChecking=no -i ${SSHKEYPATH} ${SSHUSERNAME}@${SSHIP} 'sudo chmod 777 /var/run/docker.sock'"
            sh("docker build -f ./${DOCKER_FILEPATH} -t ${DOCKER_IMAGE_TAG_1} . --no-cache")
        }    
    
 
    stage('Build Deploy') {
        echo "deploying ${DOCKERSERVICENAME} service"
        sh "ssh -i ${SSHKEYPATH} -o StrictHostKeyChecking=no ${SSHUSERNAME}@${SSHIP} 'docker compose -f ${DOCKERCOMPOSEPATH} up -d --force-recreate ${DOCKERSERVICENAME} 2>&1'"
        sh "ssh -i ${SSHKEYPATH} -o StrictHostKeyChecking=no ${SSHUSERNAME}@${SSHIP} 'docker system prune -af --volumes 2>&1'"
        cleanWs()
    }   
  }
  
  catch(e) {
    echo "SOME ERROR OCCURED"
    throw e
  }
}
pipeline {
    agent any
    environment {
        IMAGE_NAME = 'htc-front'
        REGISTRY_NAME = 'registry-htc.dilau.kz'
        SERVICE_NAME = 'htc-front'
        SERVICE_PORT = '6010'
        registry = 'https://registry-htc.dilau.kz'
        registryCredential = 'registry-user'
    }
    tools {
        maven 'mvn-3.6.3'
    }
    stages {
        stage('Code analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh 'mvn clean package sonar:sonar'
                }
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }

        stage('Building image') {
            steps {
                script {
                    docker.withRegistry(registry, registryCredential) {
                        def dockerfile = 'Dockerfile.test'
                        def customImage = docker.build("${env.IMAGE_NAME}:${env.BUILD_ID}", "-f backend/Dockerfile .")
                        customImage.push()
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying'
                script{
                    docker.withRegistry(registry, registryCredential) {
                        try {
                            sh '''
                                  SERVICES=$(docker service ls --filter name=${SERVICE_NAME} --quiet | wc -l)
                                  if [ "$SERVICES" -eq 0 ]; then
                                    docker service create --with-registry-auth --replicas 1 \
                                    --network service-nw --network traefik-nw\
                                    --constraint node.role==worker \
                                    --name ${SERVICE_NAME} \
                                    --label traefik.frontend.rule="Host:htc.dilau.kz" \
                                    --label traefik.enable=true \
                                    --label traefik.port=8080 \
                                    --label traefik.tags=traefik-nw \
                                    --label traefik.docker.network=traefik-nw \
                                    --label traefik.redirectorservice.frontend.entryPoints=http \
                                    --label traefik.redirectorservice.frontend.redirect.entryPoint=https \
                                    --label traefik.webservice.frontend.entryPoints=https \
                                    --update-order start-first --stop-grace-period 60s \
                                    -p ${SERVICE_PORT}:8080 ${REGISTRY_NAME}/${IMAGE_NAME}:${BUILD_ID}
                                  else
                                    docker service update --with-registry-auth --update-order start-first --stop-grace-period 60s --image ${REGISTRY_NAME}/${IMAGE_NAME}:${BUILD_ID} ${SERVICE_NAME}
                                  fi
                                  '''
                        } catch(e) {
                            sh "docker service update --rollback ${SERVICE_NAME}"
                            error "Service update failed in production"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'All good, we passed tests.'
        }
        failure {
            sh "docker service update --rollback ${SERVICE_NAME}"
        }
    }
}

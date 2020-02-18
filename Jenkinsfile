// Our "trigger" pipeline job definition
pipeline{
  agent {
    label 'default'
  }
  post {
    failure {
      slackSend color: 'bad', message: "Jenkins build for fgp-js-react has failed. ${env.VERSION}"
    }
    success {
      slackSend color: 'good', message: "Jenkins build for fgp-js-react has succeeded! ${env.VERSION}"
    }
  }

  environment{
    DOCKERHUB = credentials('dockerhub-credentials')
    NPM = credentials('npm-token')
    DEPLOYMENTS_REPO = "future-grid.git.beanstalkapp.com/futuregrid-deploy.git"
  }

  stages{

    stage ('prep'){
      steps {
        script {
          package_json = readJSON(file: 'package.json')
          env.VERSION = package_json.version
          env.GIT_TAG = sh (
            script: 'git rev-parse --short HEAD',
            returnStdout: true
          ).trim()
          echo "VERSION=${env.VERSION}"
          echo "GIT_TAG=${env.GIT_TAG}"
        }
      }
    }

    stage ('build'){
      steps {
        container("docker"){
          ansiColor('xterm') {
            sh "docker build --build-arg NPM_TOKEN=${env.NPM_TOKEN} -t fgp-js-react -f Dockerfile ."            
          }
        }
      }
    }

    stage ('publish'){
      when {
        expression { ['origin/master'].contains(env.GIT_BRANCH) }
      }
      steps {
        container("docker"){
          ansiColor('xterm') {
            sh "docker run --rm -it -e NPM_TOKEN=${env.NPM_TOKEN} --workdir /opt/app npm run-script publish"            
          }
        }
      }
    }
  }
}

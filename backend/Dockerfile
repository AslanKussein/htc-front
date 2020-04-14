FROM openjdk:8-alpine

ARG DEPENDENCY=./target/htc
ARG PATH=./target/htc

COPY ${DEPENDENCY}/BOOT-INF/lib /usr/app/BOOT-INF/lib
COPY ${DEPENDENCY}/org /usr/app/org
COPY ${DEPENDENCY}/META-INF /usr/app/META-INF
COPY ${PATH}/htc.war /usr/app/

WORKDIR /usr/app
ENTRYPOINT ["java", "-cp", "./", "org.springframework.boot.loader.JarLauncher"]

FROM openjdk:8-alpine

ARG DEPENDENCY=./target/htc-front

COPY ${DEPENDENCY}/BOOT-INF/lib /usr/app/BOOT-INF/lib
COPY ${DEPENDENCY}/org /usr/app/org
COPY ${DEPENDENCY}/META-INF /usr/app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /usr/app/BOOT-INF/classes

WORKDIR /usr/app
ENTRYPOINT ["java", "-cp", "./", "org.springframework.boot.loader.JarLauncher"]

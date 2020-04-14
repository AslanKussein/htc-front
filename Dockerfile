FROM openjdk:8-alpine

ARG DEPENDENCY=./target/htc

COPY ${DEPENDENCY}/org /usr/app/org
COPY ${DEPENDENCY}/META-INF /usr/app/META-INF
COPY ./target/htc.war /usr/app/

WORKDIR /usr/app
ENTRYPOINT ["java", "-jar", "./htc.war"]

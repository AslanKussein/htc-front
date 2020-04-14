FROM openjdk:8-alpine

COPY ./backend/target/htc.war /usr/app/

WORKDIR /usr/app
ENTRYPOINT ["java", "-jar", "./htc.war"]

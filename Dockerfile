# Build stage
FROM gradle:8.14-jdk21-alpine AS build
WORKDIR /app
COPY backend/build.gradle backend/settings.gradle ./
COPY backend/src ./src
RUN gradle bootJar --no-daemon -x test

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

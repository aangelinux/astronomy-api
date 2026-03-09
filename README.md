# API Design Assignment

## Astronomical GraphQL API

## Description

This API serves a dataset of 15 000+ near-earth objects, their orbital data, and historical records of close approaches to earth.  
  
The main resource offering CRUD-functionality are the Near-Earth Objects (NEOs); their name, earth MOID (Minimum Orbit Intersection Distance), magnitude, hours to complete a full rotation, and a hazard flag.  
  
Secondary resources are read-only, with the first resource offering orbital data of each NEO and the second resource offering historical records of close approaches.  
  
Orbits and Close Approaches are linked to their corresponding Near-Earth Object via their unique identifier, **spkid**.  
  
## Implementation Type

<!-- https://community.postman.com/t/how-to-export-graphql-collection/45147/2 -->

GraphQL  
  
## Links and Testing

| | URL / File |
|---|---|
| **Production API** | *...* |
| **API Documentation** | *...* |
| **GraphQL Playground** (GraphQL only) | *...* |
| **Postman Collection** | `*.postman_collection.json` |
| **Production Environment** | `production.postman_environment.json` |

**Examiner can verify tests in one of the following ways:**

1. **CI/CD pipeline** — check the pipeline output in GitLab for test results.
2. **Run manually** — no setup needed:
   ```
   npx newman run <collection.json> -e production.postman_environment.json
   ```

## Dataset

*Describe the dataset you chose:*

| Field | Description |
|---|---|
| **Dataset source** | CSV files from [NASA Small-Body DB](https://ssd.jpl.nasa.gov/tools/sbdb_query.html#!#results) and [NASA Close Approaches](https://cneos.jpl.nasa.gov/ca/) |
| **Primary resource (CRUD)** | Near-Earth Objects (spkid, name, earth_moid_ld, magnitude, rotation_hours, pha) |
| **Secondary resource 1 (read-only)** | Orbits (spkid, orbital_class, eccentricity, years) |
| **Secondary resource 2 (read-only)** | Close Approaches (id, spkid, date, nominal_distance_km, minimum_distance_km, relative_velocity_km_s, rarity) |


## Design Decisions

### Authentication

<!--Describe your JWT authentication solution. Why did you choose this approach? What alternatives exist, and what are their trade-offs?-->

### API Design

<!--- *How did you design your schema (types, queries, mutations)?*
- *How did you implement nested queries? How does the single-endpoint approach affect your design?*-->

### Error Handling

<!--*How does your API handle errors? Describe the format and consistency of your error responses.*-->

## Core Technologies Used

- Express for the backend
- MySQL for the database
- Apollo Server to setup a GraphQL server and playground
  
## Reflection

<!--*What was hard? What did you learn? What would you do differently?*-->
  
## Requirements
  
### Functional Requirements — Common

| Requirement | Issue | Status |
|---|---|---|
| Data acquisition — choose and document a dataset (1000+ data points) | [#1](../../issues/1) | [x] |
| Full CRUD for primary resource, read-only for secondary resources | [#2](../../issues/2) | [x] |
| JWT authentication for write operations | [#3](../../issues/3) | [x] |
| Error handling (400, 401, 404 with consistent format) | [#4](../../issues/4) | :white_large_square: |
| Filtering and pagination for large result sets | [#17](../../issues/17) | :white_large_square: |
  
### Functional Requirements — GraphQL

| Requirement | Issue | Status |
|---|---|---|
| Queries and mutations via single `/graphql` endpoint | [#14](../../issues/14) | [x] |
| At least one nested query | [#15](../../issues/15) | :white_large_square: |
| GraphQL Playground available | [#16](../../issues/16) | [x] |

### Non-Functional Requirements

| Requirement | Issue | Status |
|---|---|---|
| API documentation (Swagger/OpenAPI or Postman) | [#6](../../issues/6) | :white_large_square: |
| Automated Postman tests (20+ test cases, success + failure) | [#7](../../issues/7) | :white_large_square: |
| CI/CD pipeline running tests on every commit/MR | [#8](../../issues/8) | :white_large_square: |
| Seed script for sample data | [#5](../../issues/5) | [x] |
| Code quality (consistent standard, modular, documented) | [#10](../../issues/10) | :white_large_square: |
| Deployed and publicly accessible | [#9](../../issues/9) | :white_large_square: |
| Peer review reflection submitted on merge request | [#11](../../issues/11) | :white_large_square: |



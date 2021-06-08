# Part I

## The exercise
See the main coding exercise [Readme](../Readme.md) for a full description.

Build a small API with a single endpoint which accepts a patient's ansers to a
diagnostic screener as JSON. Score the answers and return the appropriate
assessments as JSON.

## My approach
Since this API is constrained to a single endpoint with single task, my aim is
to develop and deploy this as if it were a microservice -- lighweight, built &
deployed in a container. I've been learning Golang recently, and it is a perfect
fit for a small API like this problem space; I'll be using Go along with
[gofiber/fiber](https://gofiber.io/). Fiber is a web framework for Go inspired
by Express-style routing, so there's also a nice crossover with the Blueprint
stack using Express itself.

## Testing
I normally "test" an API in several ways while developing. If I already have a
frontend to work with, I may occasionally run some test requests from the
frontend itself while developing an endpoint in order to test things like
request body parsing and return values. Without a frontend, I'll use a tool like
Postman or cURL. I wouldn't normally check my cURL scripts into the code
repository, but I'll do so here (within the `scripts/` directory) to show how I
work with my applications.

I also often write automated tests for my code, and these will be checked in as
I would normally do. Given more time and especially with collaboration, I would
set up some sort of a CI/CD pipeline to ensure that these tests are validated
upon every change in order to prevent regressions.

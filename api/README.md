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

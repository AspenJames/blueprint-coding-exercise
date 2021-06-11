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

## Domain mapping
As stated in the exercise description, the "domain mapping" for the question ids
should be loaded from a persistent system. I am making an assumption that we
would not need this mapping to be dynamic or "hot-swappable", and treating the
mapping as a configuration. For this reason, I updated the format slightly to be
able to store this data as a `.json` file. I also used the Go standard lib
`embed` to embed this file into the compiled binary.

The API service will then read this `domainMapping.json` file upon
initialization and store it into a simple `map[string]string` in the form
`{question_id: domain}`, which we'll call `domainMap`. This type of structure is
similar to an Object in JavaScript whose keys represent `question_id`s and whose
values represent `domain`s.

I could have created a first-class struct type with a `Get` method that accepts
a `question_id` and returns a matching `domain` or an empty string, but such a
method would likely require looping over members and doing some sort of string
comparision on the QuestionID keys. By using a `map[string]string`, we can get
the same result as the `Get` method described above by simply indexing on the
desired `question_id`, e.g. `domainMap["question_a"] == "depression"`, and
`domainMap["unknown"] == ""`. This way, we would only have to loop over the data
once to populate the `domainMap`, making subsequent queries very cheap.

It would be fairly trivial to re-write `ReadDomainMapping()` to retrieve the
mapping values from a database or HTTP endpoint in the case that an embedded
configuration file does not properly meet the business requirements

## Score Analysis
I placed the logic for the diagnostic screener scoring analysis into its own
function, `analyzeScores`. The requirements did not state that the score
threshholds or the domain-assessment mapping needs to be read in from a
persistent source, so I simply included these as maps within the analyze
function. I could have placed all of this within the POST request handler
function, but I felt that separating this logic helped to clarify what the
request handler does and how.

# Part II addition

The data for the Blueprint diagnostic screener for [part 2](../ui/README.md) is
added as another embedded static file. In order to simulate retrieving the
screener by its ID, I stored the JSON data with the screener ID as the
filename. I created a GET handler that accepts a screener ID as a path
parameter, reads the file, and returns the data as JSON.

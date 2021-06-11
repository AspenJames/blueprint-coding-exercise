# Part II

## The exercise
See the main coding exercise [Readme](../Readme.md) for a full description.

Build a user interface on top of the diagnostic screener endpoint created in Part I.

## My approach
I'm going to be using [`create-react-app`][cra] along with [tailwindcss][tw] to
bootstrap a frontend web interface. Tailwind CSS is a flexible, "utility-first"
framework that builds to quite a small size in production, making it a perfect
pair for the lightweight API built in Part I.

## Fetching diagnostic screener
I added a GET handler to the backend API to respond with the diagnostic
screener JSON given in the main README. When `App` mounts, this data is fetched
and used to initialize the `DiagnosticScreener`.

## Displaying the prompts
To hold the screener answers as the user responds, I'm going to use a state
object (which I'll call `form`) in the top-level component, `App`. This will
consist of a map of `questionID` to `{title, answer}`, where `title` is the
question text and `answer` is initialized to `undefined`.

This `form` object is initialized when the `App` component mounts and passed to
the `DiagnosticScreener` component.`DiagnosticScreener` is then responsible for
displaying the questions one at a time, updating the state object with
responses, and POST-ing the answers when the screener is complete.

The answers are sent to the API service where they are analyzed, returning a
list of recommended assessments. These are then displayed to the user, with a
button to "reset" the screener. This clears the response state and sets the
current step back to 0, but does not actually clear responses from memory. This
is not how I would implement a "reset" feature in production, but I wanted an
easy way to go through the assessment flow without needing to refresh.

## Serving the application
The frontend application may be built and served via Nginx using Docker. The
Dockerfile creates a build of the React application and places this in the
default `html` directory of an Nginx container. The configuration at
`nginx/ui.conf` serves the frontend application at '/' and proxies requests made
to '/api/*' to the API service, stripping the path prefix.

## Considerations
If this were a production application, I would likely use a form library or
state management library to manage the form state. This custom-built example
works for these constrained requirements -- single form, sequential answers,
single response per prompt, etc -- but likely would quickly become unweildly as
requirements grow.

I would also approach the code structure differently in a larger application.
Since this only did one thing, a flat file structure in `/src` worked just fine,
but I would want some more organization as a project grows. I would probably
separate the files into directories like `/src/{components,pages,utils}`, and I
would include some frontend testing.

Styling was done with inline classes using Tailwind, but I would likely use a
stylesheet or store these classes in a centralized constant to avoid having
repeated HTML classes over all the components.

I also left out observability/monitoring for this app, but would definitely add
that in for a production application. I would use something like
[Elastic][elastic] that would allow me to centralize the logs and traces for
this app, as well as the API.

## Deployment
This app is deployed and accessible [here][app]! I used the [ECS
integration][dkr-ecs] for Docker to deploy the same compose configuration to
AWS. The images must be built and pushed to ECR, then deployed using the ECS
Docker context. This would need to be secured in production and served via a
nicer endpoint with an SSL certificate.

This deployment also relies upon the front- and back-end apps being deployed
together and discoverable by service name, a feature of the Docker ECS
integration. This coupling is fine since the apps exist only together currently,
but if we wanted these to be more independent and deployed separately, we would
need a system for managing deploys and service discovery. The deployment also
pushes/pulls to the `latest` tag for both images, which makes rollbacks
difficult. In production, I would use proper tagging to allow for easy rollbacks
of deployments.

The app may be run locally using `docker compose up --build` from the root
directory, which will build and run both the frontend and backend applications.

[app]:http://bluep-LoadB-HIYX7OZLF1RD-1823088552.us-east-1.elb.amazonaws.com
[cra]:https://create-react-app.dev/
[dkr-ecs]:https://docs.docker.com/cloud/ecs-integration/
[elastic]:https://elastic.co
[tw]:https://tailwindcss.com/docs/guides/create-react-app

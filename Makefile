IMG = mongrelion/smoke-fluxinator-5000

build:
	@docker build -t ${IMG} .

run:
	@docker run --rm -it -p 3000:3000 -e SMOKE_MACHINE_HOST=https://httpbin.org/anything ${IMG}
